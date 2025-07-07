#include "secrets.h"
#include "register.h"
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

extern int deviceId;
extern bool hasThresholds;
extern int commandIndex;
extern bool status;
extern float moistureThreshold[2];
extern float temperatureThreshold[2];
extern float humidityThreshold[2];
extern float nutrientThreshold[3];


WiFiClientSecure net = WiFiClientSecure();
PubSubClient client(net);

// Function declarations
void messageHandler(char *topic, byte *payload, unsigned int length);

void connectAWS()
{
  // Configure WiFiClientSecure to use the AWS IoT device credentials
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);

  // Connect to the MQTT broker on the AWS endpoint we defined earlier
  client.setServer(AWS_IOT_ENDPOINT, 8883);

  // Create a message handler
  client.setCallback(messageHandler);

  Serial.println("Connecting to AWS IOT");

  while (!client.connect(THINGNAME))
  {
    Serial.print(".");
    delay(100);
  }

  if (!client.connected())
  {
    Serial.println("AWS IoT Timeout!");
    return;
  }

  // Subscribe to a topic
  String SubscribeTopic = "esp32/" + String(deviceId) + "/command";
  String thresholdTopic = "esp32/" + String(deviceId) + "/threshold";
  client.subscribe(SubscribeTopic.c_str());
  client.subscribe(thresholdTopic.c_str());

  Serial.println("AWS IoT Connected!");
}

void publishMessage(float h, float t, int m, bool actuatorState[])
{
  JsonDocument doc;
  doc["mac"] = WiFi.macAddress();
  doc["humidity"] = h;
  doc["temperature"] = t;
  doc["moisture"] = m;
  doc["nitrogenLevel"] = random(40, 75);
  doc["phosphorusLevel"] = random(35, 70);
  doc["potassiumLevel"] = random(37, 80);
   // Create actuatorState array in JSON
  JsonArray stateArray = doc["actuatorState"].to<JsonArray>();
  for (int i = 0; i < 5; i++) {
    stateArray.add(actuatorState[i]);
  }

  // Serialize and publish
  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer);
  String topic = "esp32/" + String(deviceId) + "/data";
  bool result = client.publish(topic.c_str(), jsonBuffer);

}

void confirmThresholdReceipt(){
  JsonDocument doc;
  doc["deviceId"] = deviceId;
  doc["status"] = hasThresholds ? "received" : "not_received";

  // Serialize and publish
  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer);
  String topic = "esp32/" + String(deviceId) + "/threshold-confirmation";
  bool result = client.publish(topic.c_str(), jsonBuffer);
}

void handleThresholdMessage(byte *payload, unsigned int length)
{
  // Create a temporary char buffer to hold the payload as a string
  char messageBuffer[length + 1];
  memcpy(messageBuffer, payload, length);
  messageBuffer[length] = '\0'; // Null-terminate the string

  Serial.print("Payload: ");
  Serial.println(messageBuffer);

  // Parse the JSON
  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, messageBuffer);
  if (error) {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.c_str());
    return;
  }

  if (doc["moistureThreshold"].is<JsonArray>() &&
      doc["temperatureThreshold"].is<JsonArray>() &&
      doc["humidityThreshold"].is<JsonArray>() &&
      doc["nutrientThreshold"].is<JsonArray>() &&
      doc["moistureThreshold"].size() == 2 &&
      doc["temperatureThreshold"].size() == 2 &&
      doc["humidityThreshold"].size() == 2 &&
      doc["nutrientThreshold"].size() == 3) {
    for (int i = 0; i < 2; i++) {
      moistureThreshold[i] = doc["moistureThreshold"][i].as<float>();
      temperatureThreshold[i] = doc["temperatureThreshold"][i].as<float>();
      humidityThreshold[i] = doc["humidityThreshold"][i].as<float>();
      nutrientThreshold[i] = doc["nutrientThreshold"][i].as<float>();
    }
    nutrientThreshold[2] = doc["nutrientThreshold"][2].as<float>();

    hasThresholds = true;
    confirmThresholdReceipt();

    Serial.print("Moisture Threshold: ");
    Serial.print(moistureThreshold[0]);
    Serial.print(", ");
    Serial.println(moistureThreshold[1]);
    Serial.print("Temperature Threshold: ");
    Serial.print(temperatureThreshold[0]);
    Serial.print(", ");
    Serial.println(temperatureThreshold[1]);
    Serial.print("Humidity Threshold: ");
    Serial.print(humidityThreshold[0]);
    Serial.print(", ");
    Serial.println(humidityThreshold[1]);
    Serial.print("Nutrient N Threshold: ");
    Serial.println(nutrientThreshold[0]);
    Serial.print("Nutrient P Threshold: ");
    Serial.println(nutrientThreshold[1]);
    Serial.print("Nutrient K Threshold: ");
    Serial.println(nutrientThreshold[2]);
  } else {
    Serial.println("Missing or invalid fields in JSON");
  }
}

void handleCommandMessage(byte *payload, unsigned int length)
{
      // Create a temporary char buffer to hold the payload as a string
    char messageBuffer[length + 1];
    memcpy(messageBuffer, payload, length);
    messageBuffer[length] = '\0'; // Null-terminate the string
  
    Serial.print("Payload: ");
    Serial.println(messageBuffer);
  
    // Parse the JSON
    JsonDocument doc;
    DeserializationError error = deserializeJson(doc, messageBuffer);
    if (error) {
      Serial.print("deserializeJson() failed: ");
      Serial.println(error.c_str());
      return;
    }
  
    if (doc["index"].is<int>() && doc["status"].is<bool>()) {
      commandIndex = doc["index"];
      status = doc["status"];

      Serial.print("Index: ");
      Serial.print(commandIndex);
      Serial.print(", Status: ");
      Serial.println(status ? "true" : "false");

    } else {
      Serial.println("Missing fields in JSON");
    }
}

void messageHandler(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Incoming topic: ");
  Serial.println(topic);

  const char* commandSuffix = "/command";
  const char* thresholdSuffix = "/threshold";

  size_t topicLen = strlen(topic);

  if (topicLen >= strlen(commandSuffix) && strcmp(topic + topicLen - strlen(commandSuffix), commandSuffix) == 0) {
    Serial.println("Received command message");
    handleCommandMessage(payload, length);
  } else if (topicLen >= strlen(thresholdSuffix) && strcmp(topic + topicLen - strlen(thresholdSuffix), thresholdSuffix) == 0) {
    Serial.println("Received threshold message");
    handleThresholdMessage(payload, length);
  } else {
    Serial.println("Unknown topic received");
    return;
  }

}
