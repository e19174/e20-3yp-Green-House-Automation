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
#define BUTTON_PIN 2
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


float h;
float t;
DHT dht(DHTPIN, DHTTYPE);

struct Command {
  const char* name;
  int pin;
  bool state;
};

// funtion declaration
void processCommand(const char* command);

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
    processCommand(command);

    publishMessage(h, t, average_moisture);
    client.loop();
    delay(2000);
  
}


void processCommand(const char* command) {
  Command commands[] = {
      {"FAN_ON", FAN_PIN, HIGH}, {"FAN_OFF", FAN_PIN, LOW},
      {"NUTRIENTS_ON", NUTRIENT_P, HIGH}, {"NUTRIENTS_OFF", NUTRIENT_P, LOW},
      {"NUTRIENT_N_ON", NUTRIENT_N, HIGH}, {"NUTRIENT_N_OFF", NUTRIENT_N, LOW},
      {"NUTRIENT_K_ON", NUTRIENT_K, HIGH}, {"NUTRIENT_K_OFF", NUTRIENT_K, LOW},
      {"WATER_ON", WATER_PIN, HIGH}, {"WATER_OFF", WATER_PIN, LOW},
  };

  for (const auto& cmd : commands) {
      if (strcmp(command, cmd.name) == 0) {
          digitalWrite(cmd.pin, cmd.state);
          Serial.print(cmd.name);
          Serial.println(" executed");
          return;
      }
  }
  
  // Serial.println("Unknown command received");
}