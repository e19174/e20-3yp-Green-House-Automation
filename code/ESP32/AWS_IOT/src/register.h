#include <WiFi.h>
#include <WebServer.h>
#include <EEPROM.h>
#include <HTTPClient.h>

WebServer server(80);
String ssid = "";
String password = "";
String userToken = "";

void saveCredentials() {
  EEPROM.begin(512);
  EEPROM.writeString(0, ssid);
  EEPROM.writeString(100, password);
  EEPROM.writeString(200, userToken);
  EEPROM.commit();
  EEPROM.end();
}

const char* RegisterForm = R"rawliteral(
  <!DOCTYPE html>
  <html>
  <head>
    <title>Green Tech Registration</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f0f2f5;
        padding: 20px;
        text-align: center;
      }
      h2 {
        color: #333;
      }
      form {
        background: #fff;
        padding: 25px;
        margin: auto;
        width: 90%;
        max-width: 400px;
        border-radius: 10px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
      }
      label {
        font-size: 16px;
        color: #555;
        margin-bottom: 8px;
      }
      input[type="text"],
      input[type="password"],
      textarea {
        width: 100%;
        padding: 10px;
        margin: 8px 0 16px 0;
        border: 1px solid #ccc;
        border-radius: 6px;
        box-sizing: border-box;
        outline: none;
        text-align: center;
      }
      textarea {
        resize: vertical;
      }
      input[type="submit"] {
        background-color: #4CAF50;
        color: white;
        padding: 12px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
      }
      input[type="submit"]:hover {
        background-color: #45a049;
      }
    </style>
  </head>
  <body>
    <h2>Green Tech Registration</h2>
    <form action="/save" method="post">
      <label for="ssid">Wi-Fi SSID:</label><br>
      <input type="text" id="ssid" name="ssid" required><br>
  
      <label for="password">Password:</label><br>
      <input type="password" id="password" name="password" required><br>
  
      <label for="token">User Token (JWT):</label><br>
      <textarea id="token" name="token" rows="4" cols="50" required></textarea><br>
  
      <input type="submit" value="Save and Restart">
    </form>
  </body>
  </html>
  )rawliteral";  

const char* rebootPage = R"rawliteral(
  <!DOCTYPE html>
  <html>
  <head>
    <title>Rebooting...</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f0f2f5;
        padding: 20px;
        text-align: center;
      }
      h2 {
        color: #333;        
      }
      p {
        font-size: 18px;
        color: #555;
      }
      .loader {
        border: 16px solid #f3f3f3;
        border-top: 16px solid #3498db;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        animation: spin 2s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .loader-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .loader-text {
        margin-left: 20px;
        font-size: 24px;
        color: #555;
      }
    </style>
  </head>
  <body>
    <h2>Rebooting...</h2>
    <p>Please wait while the device restarts.</p>
    <div class="loader-container">
      <div class="loader"></div>
      <div class="loader-text">Rebooting...</div>
    </div>
  </body>
  </html>
  )rawliteral";


void startAccessPoint() {
  WiFi.softAP("ESP32-Setup", "esp32pass");
  IPAddress IP = WiFi.softAPIP();
  Serial.println("AP IP: " + IP.toString());

  server.on("/", HTTP_GET, []() {
    server.send(200, "text/html", RegisterForm);
  });

  server.on("/save", HTTP_POST, []() {
    ssid = server.arg("ssid");
    password = server.arg("password");
    userToken = server.arg("token");
    saveCredentials();  // Save to EEPROM
    server.send(200, "text/html", rebootPage);
    delay(2000);
    ESP.restart();
  });

  server.begin();
}

void loadCredentials() {
  EEPROM.begin(512);
  ssid = EEPROM.readString(0);
  password = EEPROM.readString(100);
  userToken = EEPROM.readString(200);
  EEPROM.end();
}

void sendRegistrationToBackend() {
  HTTPClient http;
  WiFiClient client;

  http.begin(client, "http://192.168.115.83:8080/api/v1/auth/user/test");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + userToken);

  String payload = "{\"mac\":\"" + WiFi.macAddress() + "\"}";
  int code = http.POST(payload);

  if (code > 0) {
    String response = http.getString();
    Serial.println("Response: " + response);
    if (code == 200) {
      Serial.println("Device registered successfully!");
      EEPROM.begin(512);
      EEPROM.write(490, 1); // 1 means "registered"
      EEPROM.commit();
      EEPROM.end();
    } else {
      Serial.println("Failed to register device, code: " + String(code));
    }
  } else {
    Serial.println("Failed to register device");
  }

  http.end();
}

void tryConnectToWiFi() {
  loadCredentials();

  if (ssid == "" || password == "" || userToken == "") {
    Serial.println("No credentials found. Starting AP mode.");
    startAccessPoint();
    return;
  }

  WiFi.begin(ssid.c_str(), password.c_str());

  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 20) {
    delay(500);
    Serial.print(".");
    retries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Connected to Wi-Fi!");
    EEPROM.begin(512);
    int registered = EEPROM.read(490);
    EEPROM.end();
    if (registered == 1) {
      Serial.println("Device already registered.");
      return;
    }
    sendRegistrationToBackend();  // use token here
  } else {
    startAccessPoint();
  }
}

