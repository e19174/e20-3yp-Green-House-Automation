#include "secrets.h"
#include "register.h"
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

extern int deviceId;

const char *command = "NULL";

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

void publishMessage(float h, float t, int m)
{
  JsonDocument doc;
  doc["mac"] = WiFi.macAddress();
  doc["humidity"] = h;
  doc["temperature"] = t;
  doc["moisture"] = m;
  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer); // print to client

  String topic = "esp32/" + String(deviceId) + "/data";
  bool result = client.publish(topic.c_str(), jsonBuffer);
}

void messageHandler(char *topic, byte *payload, unsigned int length)
{
  Serial.print("incoming: ");
  Serial.println(topic);

  JsonDocument doc;
  deserializeJson(doc, payload);
  const char *message = doc["message"];
  Serial.println(message);
  command = message;
}