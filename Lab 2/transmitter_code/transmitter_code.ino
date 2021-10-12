bool breakDetected = false;

void setup() {
  Serial.begin(9600);  // initialize serial communications at 9600 bps
}

void loop() {
  // Detect beam break
  // -----------
  // TODO
  // -----------
  
  // Serial monitor notify that beam break was detected
  if (breakDetected) {
    Serial.println("Beam Break")
    Serial.flush();
  }
}
