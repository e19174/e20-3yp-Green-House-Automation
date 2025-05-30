#include "secrets.h"
#include "register.h"
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

extern int deviceId;

extern int commandIndex;
extern bool status;

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
  client.subscribe(SubscribeTopic.c_str());

  Serial.println("AWS IoT Connected!");
}

void publishMessage(float h, float t, int m, bool actuatorState[])
{
  JsonDocument doc;
  doc["mac"] = WiFi.macAddress();
  doc["humidity"] = h;
  doc["temperature"] = t;
  doc["moisture"] = m;
  doc["nitrogenLevel"] = 200;
  doc["phosphorusLevel"] = 136;
  doc["potassiumLevel"] = 556;
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

void messageHandler(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Incoming topic: ");
  Serial.println(topic);

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
    int localIndex = doc["index"];
    bool localStatus = doc["status"];

    Serial.print("Index: ");
    Serial.print(localIndex);
    Serial.print(", Status: ");
    Serial.println(localStatus ? "true" : "false");
    commandIndex = localIndex;
    status = localStatus;

  } else {
    Serial.println("Missing fields in JSON");
  }
}
