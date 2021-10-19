#include<Arduino.h>

int sensorPin = A0;    // select the input
int ledPin1 = 12; // select the pin for the LED
int ledPin2 = 14; 
float volt_conversion = 3300 / 1023; //mV
const int numsamples = 150;
int analog[numsamples];
float voltage[numsamples];

float voltmin = 500; // mV

void setup() {
  // declare the ledPin as an OUTPUT:
  pinMode(ledPin1, OUTPUT);
  pinMode(ledPin2, OUTPUT);
  // initialize serial communications at 9600 bps:
  Serial.begin(9600);
}

void loop() {
float rms = 0;
  for (int i = 0; i <= numsamples; i++) {
    analog[i] = analogRead(sensorPin);// read the value from the sensor
    voltage[i] = analog[i] * volt_conversion;
    rms = rms + voltage[i]*voltage[i]; //sum of all the samples^2
  }
  rms = sqrt(rms/(numsamples));
//  Serial.println(analog[1]);
//  Serial.println(analog[2]);
  Serial.println(rms);
//  Serial.println(voltage[1]);

  if (rms > voltmin) {
    // turn the ledPin on
    digitalWrite(ledPin1, HIGH);
    digitalWrite(ledPin2, LOW);
    Serial.println("Beam detected");
  }
  else {
    digitalWrite(ledPin1, LOW);
    digitalWrite(ledPin2, HIGH);
    Serial.println("Beam broken");
  }
}
