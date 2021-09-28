/***************************************************
  This is an example for the Adafruit Thermocouple Sensor w/MAX31855K

  Designed specifically to work with the Adafruit Thermocouple Sensor
  ----> https://www.adafruit.com/products/269

  These displays use SPI to communicate, 3 pins are required to
  interface
  Adafruit invests time and resources providing this open source code,
  please support Adafruit and open-source hardware by purchasing
  products from Adafruit!

  Written by Limor Fried/Ladyada for Adafruit Industries.
  BSD license, all text above must be included in any redistribution
 ****************************************************/
#include <SPI.h>
#include <Wire.h>
#include "Adafruit_MAX31855.h"
#include <LiquidCrystal.h>
#include <WiFiNINA.h>
#include <ArduinoHttpClient.h>

// Example creating a thermocouple instance with software SPI on any three
// digital IO pins.
#define MAXDO   3
#define MAXCS   4
#define MAXCLK  5

// Initialize the Thermocouple
Adafruit_MAX31855 thermocouple(MAXCLK, MAXCS, MAXDO);

// initialize the library with the numbers of the interface pins
const int rs = 12, en = 11, d4 = 9, d5 = 8, d6 = 7, d7 = 6;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);
const int ledPin =  10;

bool probeConnected = false;
bool lcdOn = false;

char ssid[] = "UI-DeviceNet";        // your network SSID (name)
char pass[] = "UI-DeviceNet";    // your network password (use for WPA, or use as key for WEP)
int status = WL_IDLE_STATUS;     // the Wifi radio's status
int    HTTP_PORT   = 3000;
char   HOST_NAME[] = "172.17.113.124"; // hostname of web server:

WiFiClient client;
HttpClient http = HttpClient(client, HOST_NAME, HTTP_PORT);

void setup() {
  // initialize the LED pin as an output:
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, HIGH);
  // set up the LCD's number of columns and rows:
  lcd.begin(16, 2);

  lcd.clear();
  lcd.print("Temp. Sense");
  lcd.setCursor(0, 1);
  lcd.print("Starting...");
  // wait for MAX chip to stabilize
  delay(500);
  if (!thermocouple.begin()) {
    lcd.print("ERROR.");
    while (1) delay(10);
  }
  lcd.print("DONE.");

/////////////
  //Initialize serial and wait for port to open:
//  Serial.begin(9600);
//  while (!Serial);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Connecting to");
  lcd.setCursor(0, 1);
  lcd.print("network...");
  // attempt to connect to Wifi network
  while (status != WL_CONNECTED) {
//    Serial.print("Attempting to connect to network: ");
//    Serial.println(ssid);
    // Connect to WPA/WPA2 network:
    status = WiFi.begin(ssid, pass);

    // wait for connection
    delay(2500);
  }
  // you're connected now, so print out the data:
//  Serial.println("You're connected to the network");
   lcd.clear();
   lcd.setCursor(0, 0);
   lcd.print("Connected to network");
   digitalWrite(ledPin, LOW);
}

void loop() {
  // basic readout test, just print the current temp
   lcd.clear();
   lcd.setCursor(0, 0);
   lcd.print("Int. Temp = ");
   lcd.println(thermocouple.readInternal());
   //Serial.print("Int. Temp = ");
   //Serial.println(thermocouple.readInternal());

   double c = thermocouple.readCelsius();
   lcd.setCursor(0, 1);
   if (isnan(c)) {
     probeConnected = false;
     if (!lcdOn) {
       digitalWrite(ledPin, HIGH); // LCD On
     } else {
      digitalWrite(ledPin, LOW); // LCD Off
     }
     lcd.print("T/C Problem");
     // HTTP request to server
     http.get("/ping?probe=false&temp=null");
     int statusCode = http.responseStatusCode();
     String response = http.responseBody();
//     if (response == "pong,pressed") {
//       toggleDisplay();
//     }
   } else {
     probeConnected = true;
     if (lcdOn) {
      digitalWrite(ledPin, HIGH); // LCD On
     } else {
      digitalWrite(ledPin, LOW); // LCD Off
     }
     lcd.print("C = ");
     lcd.print(c);
     lcd.print("  ");
     //Serial.print("Thermocouple Temp = *");
     //Serial.println(c);
     // HTTP request to server
     http.get("/ping?probe=true&temp="+String(c,2));
     int statusCode = http.responseStatusCode();
     String response = http.responseBody();
     if (response == "pong,pressed") {
       toggleDisplay();
     }
   }

}

void toggleDisplay() {
  if (lcdOn) {
    digitalWrite(ledPin, LOW);
    lcdOn = false;
  } else {
    digitalWrite(ledPin, HIGH);
    lcdOn = true;
  }
}
