#include "Arduino.h"
#include "WiFi.h"
#include "ArduinoHttpClient.h"
#include "aws_setup.h"

#include "DHT.h"
#define DHTPIN 4
#define DHTTYPE DHT22   // DHT 22  (AM2302)

// Capsitive moisture sensor
#define MOISTURE_SENSOR_PIN 34

// Define Control Pins
#define FAN_PIN 15
#define NUTRIENTS_PIN 16
#define WATER_PIN 17
#define LIGHT_PIN 2

//     pinMode(FAN_PIN, OUTPUT);
//     pinMode(NUTRIENTS_PIN, OUTPUT);
//     pinMode(WATER_PIN, OUTPUT);
//     pinMode(LIGHT_PIN, OUTPUT);

struct Command {
  const char* name;
  int pin;
  bool state;
};

// funtion declaration
void processCommand(const char* command);

void setup(){
  
    Serial.begin(115200);

// }

// void loop(){

//   client.loop();

//   h = dht.readHumidity();
//   t = dht.readTemperature();

//   if (isnan(h) || isnan(t)) // Check if any reads failed and exit early (to try again).
//   {
//     Serial.println(F("Failed to read from DHT sensor!"));
//     return;
//     }

//     int moisture = analogRead(MOISTURE_SENSOR_PIN);

//     Serial.print(F("Humidity: "));
//     Serial.print(h);
//     Serial.print(F("%  Temperature: "));
//     Serial.print(t);
//     Serial.println(F("°C "));

//     Serial.print(F("Moisture: "));
//     Serial.print(moisture);
//     Serial.println(F("%"));

//     if (moisture < 1000)
//     {
//       Serial.println("Watering the plant");
//     }
//     else
//     {
//       Serial.println("Plant is watered");
//     }

//     // control command for equipments
//     processCommand(command);

//     publishMessage(h, t, moisture);
//     client.loop();
//     delay(2000);
// }


    // control command for equipments
    processCommand(command);

    publishMessage(h, t, moisture);
    client.loop();
    delay(2000);
}

void processCommand(const char* command) {
  Command commands[] = {
      {"FAN_ON", FAN_PIN, HIGH}, {"FAN_OFF", FAN_PIN, LOW},
      {"NUTRIENTS_ON", NUTRIENTS_PIN, HIGH}, {"NUTRIENTS_OFF", NUTRIENTS_PIN, LOW},
      {"WATER_ON", WATER_PIN, HIGH}, {"WATER_OFF", WATER_PIN, LOW},
      {"LIGHT_ON", LIGHT_PIN, HIGH}, {"LIGHT_OFF", LIGHT_PIN, LOW}
  };

  for (const auto& cmd : commands) {
      if (strcmp(command, cmd.name) == 0) {
          digitalWrite(cmd.pin, cmd.state);
          Serial.print(cmd.name);
          Serial.println(" executed");
          return;
      }
  }
  
  Serial.println("Unknown command received");
}



#include "Arduino.h"

#define RE 5
#define DE 5

const byte nitro[] = {0x01, 0x03, 0x00, 0x1E, 0x00, 0x01, 0xE4, 0x0C};
const byte phos[] = {0x01, 0x03, 0x00, 0x1F, 0x00, 0x01, 0xB5, 0xCC};
const byte pota[] = {0x01, 0x03, 0x00, 0x20, 0x00, 0x01, 0x85, 0xC0};

byte values[7];
HardwareSerial mod(2);  // Use UART2: TX = 17, RX = 16

uint16_t nitrogen();
uint16_t phosphorous();
uint16_t potassium();
uint16_t readSensor(const byte *command);

void setup() {
    Serial.begin(115200);
    mod.begin(4800, SERIAL_8N1, 16, 17);  // RX = GPIO 16, TX = GPIO 17

    pinMode(RE, OUTPUT);
    pinMode(DE, OUTPUT);
    digitalWrite(DE, LOW);
    digitalWrite(RE, LOW);
}

void loop() {
    uint16_t val1, val2, val3;
    
    val1 = nitrogen();
    delay(250);
    val2 = phosphorous();
    delay(250);
    val3 = potassium();
    delay(250);
    
    Serial.print("Nitrogen: ");
    Serial.print(val1);
    Serial.println(" mg/kg");

    Serial.print("Phosphorous: ");
    Serial.print(val2);
    Serial.println(" mg/kg");

    Serial.print("Potassium: ");
    Serial.print(val3);
    Serial.println(" mg/kg");
    
    Serial.println("----------------------------");
    delay(2000);
}

uint16_t nitrogen() {
    return readSensor(nitro);
}

uint16_t phosphorous() {
    return readSensor(phos);
}

uint16_t potassium() {
    return readSensor(pota);
}

uint16_t readSensor(const byte *command) {
    digitalWrite(DE, HIGH);
    digitalWrite(RE, HIGH);
    delay(10);
    
    mod.write(command, 8);
    mod.flush();
    delay(10);

    digitalWrite(DE, LOW);
    digitalWrite(RE, LOW);

    unsigned long startTime = millis();
    while (mod.available() < 7) {  // Wait for full response (7 bytes)
        if (millis() - startTime > 500) {
            Serial.println("Sensor Timeout!");
            return 0;
        }
    }

    for (byte i = 0; i < 7; i++) {
        values[i] = mod.read();
        Serial.print(values[i], HEX);
        Serial.print(" ");
    }
    Serial.println();

    if (values[0] != 0x01 || values[1] != 0x03) {  // Check valid response
        Serial.println("Invalid Response!");
        return 0;
    }

    return (values[3] << 8) | values[4];  // Convert to 16-bit value
}


// #include "Arduino.h"

// // Pin definitions
// #define RE_DE 4     
// #define RX_PIN 16   
// #define TX_PIN 17   

// // Correct Modbus command to read NPK values
// byte readNPK[] = {0x01, 0x03, 0x00, 0x1E, 0x00, 0x03, 0x65, 0xCD};
// byte receivedData[15];

// HardwareSerial sensorSerial(2);

// void setup() {
//   Serial.begin(115200);
//   sensorSerial.begin(4800, SERIAL_8N1, RX_PIN, TX_PIN);
  
//   pinMode(RE_DE, OUTPUT);
//   digitalWrite(RE_DE, LOW);  // Receive mode initially
  
//   Serial.println("ESP32 NPK Sensor Reader Started");
// }

// void loop() {
//   digitalWrite(RE_DE, HIGH);  // Switch to transmit mode
//   delay(10);

//   Serial.println("\nSending request for NPK data:");
//   for (byte i = 0; i < 8; i++) {
//     sensorSerial.write(readNPK[i]);
//     Serial.print("0x");
//     Serial.print(readNPK[i], HEX);
//     Serial.print(" ");
//   }
//   Serial.println();

//   sensorSerial.flush();
//   digitalWrite(RE_DE, LOW);  // Switch back to receive mode
//   delay(300);  // Increased delay for stability

//   byte index = 0;
//   unsigned long startTime = millis();
//   while ((millis() - startTime < 2000) && (index < 11)) {  // Expecting 11 bytes (1 address, 1 function, 1 byte count, 6 data, 2 CRC)
//     if (sensorSerial.available()) {
//       receivedData[index] = sensorSerial.read();
//       Serial.print("0x");
//       Serial.print(receivedData[index], HEX);
//       Serial.print(" ");
//       index++;
//     }
//   }

//   Serial.println();
//   Serial.print("Bytes received: ");
//   Serial.println(index);

//   if (index < 11) {
//     Serial.println("Error: Incomplete response received");
//     delay(5000);
//     return;
//   }

//   // Validate response structure
//   if (receivedData[0] != 0x01 || receivedData[1] != 0x03 || receivedData[2] != 0x06) {
//     Serial.println("Error: Unexpected response header");
//     delay(5000);
//     return;
//   }

//   // Extract and calculate NPK values
//   int nitrogen   = (receivedData[3] << 8) | receivedData[4];
//   int phosphorus = (receivedData[5] << 8) | receivedData[6];
//   int potassium  = (receivedData[7] << 8) | receivedData[8];

//   Serial.println("\n--- Soil NPK Readings ---");
//   Serial.print("Nitrogen: "); Serial.print(nitrogen); Serial.println(" mg/kg");
//   Serial.print("Phosphorus: "); Serial.print(phosphorus); Serial.println(" mg/kg");
//   Serial.print("Potassium: "); Serial.print(potassium); Serial.println(" mg/kg");

//   delay(5000);  // Wait before next request
// }

