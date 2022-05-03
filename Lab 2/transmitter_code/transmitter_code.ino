//int reverseSwitch = 2;
int driverPUL = 6;    // PUL- pin
int driverDIR = 7;    // DIR- pin
int spd = A0;     // Potentiometer

// Variables

int pd = 115;       // Pulse Delay period 
boolean setdir = LOW; // Set Direction

void setup() {

  pinMode (driverPUL, OUTPUT);
  pinMode (driverDIR, OUTPUT);
  digitalWrite(driverDIR, setdir);
}

void loop() {
    digitalWrite(driverPUL, HIGH);
    delayMicroseconds(pd);
    digitalWrite(driverPUL, LOW);
    delayMicroseconds(pd);
}
