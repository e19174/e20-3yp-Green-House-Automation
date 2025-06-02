#include <Arduino.h>
#include <register.h>
#include "aws_setup.h"
#include "ArduinoHttpClient.h"
#include "DHT.h"

// Define Control Pins
#define DHTPIN 4
#define DHTTYPE DHT22   // DHT 22  (AM2302)
#define FAN_PIN 22
#define NUTRIENT_N 18
#define NUTRIENT_P 19
#define NUTRIENT_K 21
#define WATER_PIN 5
#define BUTTON_PIN 13
#define MOISTURE_SENSOR_PIN_1 32
#define MOISTURE_SENSOR_PIN_2 33
#define MOISTURE_SENSOR_PIN_3 34
#define MOISTURE_SENSOR_PIN_4 35

WebServer server(80);

// Global variables
String ssid = "";
String password = "";
String email = "";
int deviceId = -1;
bool registered = false;
const char* AWS_CERT_CRT = nullptr;
const char* AWS_CERT_PRIVATE = nullptr;
const char* THINGNAME = nullptr; 
const char* AWS_IOT_ENDPOINT = nullptr;
int commandIndex = -1; // Index of the command to be executed
bool status;
bool actuatorState[5] = {false, false, false, false, false}; // FAN, NUTRIENT_N, NUTRIENT_P, NUTRIENT_K, WATER

float h;
float t;
DHT dht(DHTPIN, DHTTYPE);

struct Command {
  String name;
  int pin;
  bool state;
};

// funtion declaration
void processCommand(int index, bool status);

void setup() {
  Serial.begin(115200);

  if (!SPIFFS.begin(true)) {
    Serial.println("SPIFFS Mount Failed");
    return;
  }

  pinMode(BUTTON_PIN, INPUT_PULLUP); // Button LOW when pressed
  delay(100); // Wait for pin to stabilize
  
  if (digitalRead(BUTTON_PIN) == LOW) {
    Serial.println("Button held during boot. Erasing EEPROM...");
    
    EEPROM.begin(512);
    for (int i = 0; i < 512; i++) {
      EEPROM.write(i, 0);
    }
    EEPROM.commit();
    EEPROM.end();

    removeFile(SPIFFS, "/cert.pem");
    removeFile(SPIFFS, "/priv.key");
    removeFile(SPIFFS, "/thingName.txt");
    removeFile(SPIFFS, "/endpoint.txt");
    
    Serial.println("EEPROM erased.");
  } else {
    Serial.println("No button press. EEPROM not erased.");
  }
  
  tryConnectToWiFi();

  pinMode(FAN_PIN, OUTPUT);
  pinMode(NUTRIENT_N, OUTPUT);
  pinMode(NUTRIENT_P, OUTPUT);
  pinMode(NUTRIENT_K, OUTPUT);
  pinMode(WATER_PIN, OUTPUT);
  pinMode(MOISTURE_SENSOR_PIN_1, INPUT);
  pinMode(MOISTURE_SENSOR_PIN_2, INPUT);
  pinMode(MOISTURE_SENSOR_PIN_3, INPUT);
  // pinMode(MOISTURE_SENSOR_PIN_4, INPUT);

  digitalWrite(FAN_PIN, HIGH);
  digitalWrite(NUTRIENT_N, HIGH);
  digitalWrite(NUTRIENT_P, HIGH);
  digitalWrite(NUTRIENT_K, HIGH);
  digitalWrite(WATER_PIN, HIGH);

  if (registered) {
    Serial.println("Device already registered. Connecting to AWS...");
    connectAWS();
  } else {
    Serial.println("Device not registered. Please register first.");
  }

  dht.begin();
}

void loop() {
  server.handleClient();

  h = dht.readHumidity();
  t = dht.readTemperature();

  if (isnan(h) || isnan(t)) // Check if any reads failed and exit early (to try again).
  {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
    }

    int moisture_1 = analogRead(MOISTURE_SENSOR_PIN_1);
    int moisture_2 = analogRead(MOISTURE_SENSOR_PIN_2);
    int moisture_3 = analogRead(MOISTURE_SENSOR_PIN_3);
    // int moisture_4 = analogRead(MOISTURE_SENSOR_PIN_4);

    int average_moisture = (moisture_1 + moisture_2 + moisture_3) / 3;

    // Serial.print(F("Humidity: "));
    // Serial.print(h);
    // Serial.print(F("%  Temperature: "));
    // Serial.print(t);
    // Serial.println(F("°C "));

    // Serial.print(F("Moisture: "));
    // Serial.print(average_moisture);
    // Serial.println(F("%"));

    // if (average_moisture > 1500)
    // {
    //   Serial.println("Watering the plant");
    //   // digitalWrite(LIGHT_PIN, HIGH);
    // }
    // else
    // {
    //     Serial.println("Plant is watered");
    //     // digitalWrite(LIGHT_PIN, LOW);
    // }

    // control command for equipments
    processCommand(commandIndex, status);

    publishMessage(h, t, average_moisture, actuatorState);
    client.loop();
    delay(2000);
  
}


void processCommand(int index, bool status) {
  const int commandPins[] = { FAN_PIN, NUTRIENT_N, NUTRIENT_P, NUTRIENT_K, WATER_PIN };

  if (index >= 0 && index < sizeof(commandPins) / sizeof(commandPins[0])) {
    digitalWrite(commandPins[index], status ? LOW : HIGH);
    actuatorState[index] = status;
    Serial.print("Command executed: ");
    Serial.print(index);
    Serial.print(" - State: ");
    Serial.println(status ? "ON" : "OFF");
  }
}
