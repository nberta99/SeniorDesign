#include <math.h>

#define PUL1_PIN    35
#define DIR1_PIN    37
#define Home1_PIN   39

#define PUL2_PIN    41
#define DIR2_PIN    43
#define Home2_PIN   45

#define PUL3_PIN    23
#define DIR3_PIN    25
#define Home3_PIN   26

#define PUL4_PIN    29
#define DIR4_PIN    31
#define Home4_PIN   33

class HStepper{
  private:
    int dir;
    int pulse;
    int home_switch;
    int pumpNum;
    // bool isPrimed = false;
    
    bool step_pulse = true; // Maintains status of pulse pin high or low, high = true, low = false
    int current_pos = 0; // Maintains position of motor after homing
    
    bool isOffset = false;
    int offset = 0;
    double V = 10; // (ml) change in volume needs specified in constructor
    double diameter = 6.7; // (cm) 2.74in * 2.54
    double A = 3.14*(diameter/2)*(diameter/2); // pi*r^2
    bool volume_decrease = true; // After priming the volume will be at max and will be decreasing
    int steps_per_rev = 800;
    int v_steps = (V/A)*(steps_per_rev/.8);

    // bool fullPump = false;
    // bool store_volume_decrease;
    // int store_current_pos;
  
    double phase = 0;
    double bpm = 60; // Max 120 BPM
    
    long delayTime = 1000000/(2*v_steps*(bpm/60)); // 250
    long deltaTime = 0;
    long currentTime = 0;
    bool enable = 0;
  
  public:
    // Constructor
    HStepper(int _dir, int _pul, int _home, int _pumpNum) {
      dir = _dir;
      pulse = _pul;
      home_switch = _home;
      pumpNum = _pumpNum;
      pinMode(dir, OUTPUT);
      pinMode(pulse, OUTPUT);
      pinMode(home_switch, INPUT_PULLUP);
      digitalWrite(dir, HIGH);
      digitalWrite(pulse, LOW);
    }
    
    void stepUp() {
      digitalWrite(dir,HIGH);
      if (step_pulse == true) {
        digitalWrite(pulse,LOW);
        step_pulse = false;
      }
      if (step_pulse == false) {
        digitalWrite(pulse,HIGH);
        step_pulse = true;
      }  
    }
  
    int getCurrentPos() { return current_pos; }
    int getVol() { return V; }
    int getOffset() { return offset; }
    int getHR() { return bpm; }
    
    void setEnable(bool x) { enable = x; }
    
    void stepDn() {
      digitalWrite(dir,LOW);
      if (step_pulse == true) {
        digitalWrite(pulse,LOW);
        step_pulse = false;
      }
      if (step_pulse == false) {
        digitalWrite(pulse,HIGH);
        step_pulse = true;
      }  
    }
    
    void homing() {
      bool flag = true;
      while(flag) {
        this->stepDn();
        if (digitalRead(home_switch) == LOW) {
          flag = false;
        }
        delay(1);
      }
      flag = true;
      int pcount = 0;
      // The Following while loop ends the purge a number of steps away from the home switch
      while (flag) {
          this->stepUp();
          pcount++;
          if (pcount >= 4000) { flag = false; }
          // delayMicroseconds(500);
          delayMicroseconds(1000);
      }
      current_pos = v_steps;
      isOffset = false;
      offset = 0;
    }
    
    void prime() {
      bool flag = true;
//      int pcount = 0; // Steps made
      int cycle = 0; // Number of pump cycles 
      while (cycle < 1) {
        while (flag){
          this->stepUp();
//          pcount++;
          current_pos++;
          if (current_pos >= 8000) { flag = false; }
          // delayMicroseconds(500);
          delayMicroseconds(1000);
        }
        delayMicroseconds(5000);
        flag = true;
        while (flag) {
          this->stepDn();
//          pcount--;
          current_pos--;
          if (current_pos <= 100) { flag = false; }
          // delayMicroseconds(500);
          delayMicroseconds(1000);
        }
        delayMicroseconds(2500);
        flag = true;
        cycle++;
      }
      // The Following while loop ends the purge a number of steps away from the home switch
      while (flag) {
          this->stepUp();
          current_pos++;
          if (current_pos >= 4000) { flag = false; }
          // delayMicroseconds(500);
          delayMicroseconds(1000);
        }
      current_pos = v_steps;
    }
  
    void control() {
      currentTime = micros();
      if (enable == 1) {
        if ((currentTime - deltaTime) > delayTime) {
          if (volume_decrease) {
            this->stepDn();
            current_pos--;
            if (current_pos < 3) { volume_decrease = false; }//changes dir when volume is at min
          }
          if (!volume_decrease) {
            this->stepUp();
            current_pos++;
            if (current_pos > v_steps) { volume_decrease = true; }
          }
          deltaTime = currentTime;
        }
      }
    }
  
    void setVolume(int _volume) {
       V = _volume;
  
       // Need to re-calculate and prime the pump on volume change
       v_steps = (V/A)*(steps_per_rev/.8);
       delayTime = 1000000/(2*v_steps*(bpm/60));
       this->homing();
    }
  
    int setOffset(int _offset) {
      if (!isOffset) {
        if (_offset >= 100) {
          offset = _offset % 100; // Keeps offsets as a valid percentage
        } else if (_offset < 0) {
          offset = 100 + (_offset % 100); // Sets offset for negative values
        // } else if (_offset == 0) {
        //   return 0;
        } else {
          offset = _offset;
        }
        isOffset = true;
        // Step the motor the number of steps corresponding to the offset percentage
        for (int i = 0; i < (2*int((v_steps * 1.0) * ((offset * 1.0) / 100.0))); i++) {
          if (volume_decrease) {
            this->stepDn();
            current_pos--;
            if (current_pos < 3) { volume_decrease = false; } // Changes dir when volume is at min
          }
          if (!volume_decrease) {
            this->stepUp();
            current_pos++;
            if (current_pos > v_steps) { volume_decrease = true; }
          }
          delayMicroseconds(500);
        }
        return 0;
      } else {
        return pumpNum;
      }
    }
  
    void setHeartRate(int _hr) {
      bpm = _hr;
      delayTime = 1000000/(2*v_steps*(bpm/60));
    }
};

HStepper Motor1(DIR1_PIN, PUL1_PIN, Home1_PIN, 1);
HStepper Motor2(DIR2_PIN, PUL2_PIN, Home2_PIN, 2);
HStepper Motor3(DIR3_PIN, PUL3_PIN, Home3_PIN, 3);
HStepper Motor4(DIR4_PIN, PUL4_PIN, Home4_PIN, 4);

String msg;

void setup() {
  Serial.begin(9600);
  while (!Serial) {} // Wait for a serial connection on device
  
  Serial.println("Controller Connected\nHoming pumps"); //CLOSE VALVES WHEN PRIMING!");

  // Homing of Pumps
  Motor1.homing();
  Motor2.homing();
  Motor3.homing();
  Motor4.homing();

  Serial.println("Pumps Ready. Press\n'Prime/Purge' Or\n'Start Pumping'");

//  Serial.println("Pumps Ready. To begin\nPress 'Start Pumping'\nDefaults - Vol: "+
//                  String(Motor1.getVol())+" ml,\nOffset: "+
//                  String(Motor1.getOffset())+" , "+
//                  String(Motor1.getHR())+" BPM");
}

void loop() {
  Motor1.control();
  Motor2.control();
  Motor3.control();
  Motor4.control();

  String serial_read = readSerialPort();
  checkSerial(serial_read);
}

void setAll(bool runBool) {
    Motor1.setEnable(runBool);
    Motor2.setEnable(runBool);
    Motor3.setEnable(runBool);
    Motor4.setEnable(runBool);
}

void checkSerial(String serial_in) {
  if (serial_in == "start") {
    // Start motors
    setAll(true);
    Serial.println("Pumping started");
  } else if (serial_in == "stop") {
    // Stop motors in state
    setAll(false);
    Serial.println("Pumping stopped");
  } else if (serial_in == "prime/purge") {
    // Prime pump motors
    Motor1.homing();
    Motor1.prime();
    Motor2.homing();
    Motor2.prime();
    Motor3.homing();
    Motor3.prime();
    Motor4.homing();
    Motor4.prime();
  } else if (serial_in == "status") {
    // Get status of pumps
    char buffer[100];
    sprintf(buffer,
            "Current: BPM: %d\nV: %d,%d,%d,%d\nO: %d,%d,%d,%d\n",
            Motor1.getHR(),
            Motor1.getVol(), Motor2.getVol(), Motor3.getVol(), Motor4.getVol(),
            Motor1.getOffset(), Motor2.getOffset(), Motor3.getOffset(), Motor4.getOffset()
           );
    Serial.println(buffer);
  } else if (serial_in.charAt(0) == 'v') {
    // Parse and set volumes
        // v12,34,56,78 --> 12,34,56,78
    Serial.println("Setting volumes\nPlease wait");
    int commaIndex1 = serial_in.indexOf(',');
    int convertV1 = serial_in.substring(1, commaIndex1).toInt();
    int commaIndex2 = serial_in.indexOf(',', commaIndex1 + 1);
    int convertV2 = serial_in.substring(commaIndex1 + 1, commaIndex2).toInt();
    int commaIndex3 = serial_in.indexOf(',', commaIndex2 + 1);
    int convertV3 = serial_in.substring(commaIndex2 + 1, commaIndex3).toInt();
    int convertV4 = serial_in.substring(commaIndex3 + 1, serial_in.length() + 1).toInt();
    Motor1.setVolume(convertV1);
    Motor2.setVolume(convertV2);
    Motor3.setVolume(convertV3);
    Motor4.setVolume(convertV4);
    char buffer[60];
    sprintf(buffer, "Volume Set:\nV1: %d\t V2: %d\nV3: %d\t V4: %d", Motor1.getVol(), Motor2.getVol(), Motor3.getVol(), Motor4.getVol());
    Serial.println(buffer);
  } else if (serial_in.charAt(0) == 'o') {
    // Parse and set offsets
        // o12,34,56 --> 12,34,56
    Serial.println("Setting offsets\nPlease wait");
    int commaIndex1 = serial_in.indexOf(',');
    int convertO1 = serial_in.substring(1, commaIndex1).toInt();
    int commaIndex2 = serial_in.indexOf(',', commaIndex1 + 1);
    int convertO2 = serial_in.substring(commaIndex1 + 1, commaIndex2).toInt();
    int commaIndex3 = serial_in.indexOf(',', commaIndex2 + 1);
    int convertO3 = serial_in.substring(commaIndex2 + 1, commaIndex3).toInt();
    int convertO4 = serial_in.substring(commaIndex3 + 1, serial_in.length() + 1).toInt();
    int op1 = Motor1.setOffset(convertO1);
    int op2 = Motor2.setOffset(convertO2);
    int op3 = Motor3.setOffset(convertO3);
    int op4 = Motor4.setOffset(convertO4);
    if ((op1+op2+op3+op4) == 0) {
      char buffer[65];
      sprintf(buffer, "Offsets Set:\nO1: %d\t O2: %d\nO3: %d\t O4: %d", Motor1.getOffset(), Motor2.getOffset(), Motor3.getOffset(), Motor4.getOffset());
      Serial.println(buffer);
    } else {
      Serial.println("Offset already set.\nHome pumps first");
    }
  } else if (serial_in.charAt(0) == 'b') {
    // Parse and set heart rate
        // b73 --> 73
    int convertBPM = serial_in.substring(1, serial_in.length()).toInt();
    char buffer[50];
    if (convertBPM > 120) {
      sprintf(buffer, "Heart Rate:\n%d BPM\nToo Large\n120 BPM Max", convertBPM);
      Serial.println(buffer);
    } else if (convertBPM < 1) {
      sprintf(buffer, "Heart Rate:\n%d BPM\nToo Small\n1 BPM Min", convertBPM);
      Serial.println(buffer);
    } else {
      setAll(false);
      Motor1.setHeartRate(convertBPM);
      Motor2.setHeartRate(convertBPM);
      Motor3.setHeartRate(convertBPM);
      Motor4.setHeartRate(convertBPM);
      setAll(true);
      sprintf(buffer, "Heart Rate Set:\n%d BPM", convertBPM);
      Serial.println(buffer);
    }
  }
  serial_in = "";
}

String readSerialPort() {
  if (Serial.available()) {
    msg = "";
    delay(20);
    while (Serial.available() > 0) {
      msg += (char)Serial.read();
    }
    Serial.flush();
    // Serial.println(msg);
    return msg;
  }
  return "";
}
