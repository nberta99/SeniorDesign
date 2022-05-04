/*------------------------------------------------------------------------------------
   Program:     PhatomGUI

   Description: Creates a graphical interface for controlling the Ardunio program
                which controls the 4 pumps used to mimic heart beats for a phantom
                in an MRI machine.
                
   Purpose:     Allows user to control Arduino controlling motor system
                
   Hardware:    Ardunio (loaded with custom program <program_name>)
   
   Software:    Developed using Processing 2.2.1 (processing.org)
                ControlP5 2.2.6
                
   Date:        15 April 2022
   
   Author: sparkBug, UIowa ECE Senior Design Team
   
------------------------------------------------------------------------------------*/

import controlP5.*; //import ControlP5 library
import processing.serial.*;

Serial serial_port = null;        // the serial port

// serial port buttons
Button btn_up, btn_dn;
Button btn_connect, btn_disconnect, btn_list_refresh;
Button btn_get_status, btn_prime_purge;
Button btn_volume_send, btn_offset_send, btn_heartrate_send;
Button btn_start_pump, btn_stop_pump;
String serial_list = "No Serial Devices Found"; // List of serial ports
int serial_list_index = -1;// Currently selected serial port 
int num_serial_ports = 0; // Number of serial ports in the list

ControlP5 cp5v, cp5o, cp5m, cp5b;

Textfield volumeInput, offsetInput, messageBox, heartrateInput;

String message_text = "Not Connected";

void setup() {
  size (470, 275); // Set the window size
  
  cp5v = new ControlP5(this);
  cp5o = new ControlP5(this);
  cp5m = new ControlP5(this);
  cp5b = new ControlP5(this);
  
  // Volume Input Textfield
  volumeInput = cp5v.addTextfield("", 10, 115, 150, 25)
    .setColorActive(#FF3333)
    .setColorBackground(0xffffffff) // Set the textbox color
    .setFont(createFont("Georgia", 18)) // Set the textbox font
    .setColorValue(0x00000000) // Set the font color
    .setAutoClear(false); // Prevents the textfield from clearing on enter
  btn_volume_send = new Button("Set Volumes", 170, 115, 100, 25);
  
  // Offset Input Textfield
  offsetInput = cp5o.addTextfield("", 10, 150, 150, 25)
    .setColorActive(#FF3333)
    .setColorBackground(0xffffffff) // Set the textbox color
    .setFont(createFont("Georgia", 18)) // Set the textbox font
    .setColorValue(0x00000000) // Set the font color
    .setAutoClear(false); // Prevents the textfield from clearing on enter
  btn_offset_send = new Button("Set Offsets", 170, 150, 100, 25);
  
  // Heart Rate Input Textfield
  heartrateInput = cp5b.addTextfield("", 10, 185, 150, 25)
    .setColorActive(#FF3333)
    .setColorBackground(0xffffffff) // Set the textbox color
    .setFont(createFont("Georgia", 18)) // Set the textbox font
    .setColorValue(0x00000000) // Set the font color
    .setAutoClear(false); // Prevents the textfield from clearing on enter
  btn_heartrate_send = new Button("Set Heart Rate", 170, 185, 100, 25);

  // Serial Communication Buttons
  btn_up = new Button("^", 170, 10, 40, 20);
  btn_dn = new Button("v", 170, 85, 40, 20);
  btn_connect = new Button("Connect", 220, 10, 100, 25);
  btn_disconnect = new Button("Disconnect", 220, 45, 100, 25);
  btn_list_refresh = new Button("Refresh List", 220, 80, 100, 25);

  btn_start_pump = new Button("Start Pumping", 330, 10, 130, 45);
  btn_stop_pump = new Button("Stop Pumping", 330, 60, 130, 45);
  
  btn_get_status = new Button("Get Status", 145, 220, 100, 25);
  btn_prime_purge = new Button("Prime/Purge", 35, 220, 100, 25);
  
  if (Serial.list().length != 0) {
    // Get the list of serial ports on the computer
    serial_list_index = 0;
    serial_list = Serial.list()[serial_list_index];
  
    // Get the number of serial ports in the list
    num_serial_ports = Serial.list().length;
  }
}

//void keyPressed() {
//  if (keyPressed && key == ENTER){
//    ToggleButton(volumeInput.getText());
//  }
//}

// Print the serial value from the Arduino board (For testing)
void serialEvent(Serial p) {
  // get message till line break (ASCII > 13)
  String message = serial_port.readStringUntil(13);
  if (message != null) {
    //print(message);
    message_text = message;
  }
  
  if (p == null) {
    message_text = "Re-Connect Controller"; 
  }
}

void mousePressed() {
  // Port up button clicked
  if (btn_up.MouseIsOver()) {
    if (serial_list_index > 0) {
      // move one position up in the list of serial ports
      serial_list_index--;
      serial_list = Serial.list()[serial_list_index];
    }
  }
  
  // Port down button clicked
  if (btn_dn.MouseIsOver()) {
    if (serial_list_index < (num_serial_ports - 1)) {
      // move one position down in the list of serial ports
      serial_list_index++;
      serial_list = Serial.list()[serial_list_index];
    }
  }
  
  // Connect button clicked
  if (btn_connect.MouseIsOver()) {
    if ((serial_port == null) && (serial_list_index != -1)) {
      try {
        // Connect to the selected serial port
        message_text = "Connecting to serial device\nIf message doesn't disappear, reconnect";
        serial_port = new Serial(this, Serial.list()[serial_list_index], 9600);
        //print(serial_port);
        serial_port.readStringUntil('\n');
      } catch (Exception e) {
        serial_list_index = -1;
        message_text = "Serial connection error" + e;
      }
    } else {
      message_text = "No Controllers Found";
    }
  }
  
  // Disconnect button clicked
  if (btn_disconnect.MouseIsOver()) {
    if (serial_port != null) {
      // disconnect from the serial port
      serial_port.stop();
      serial_port = null;
      message_text = "Controller Disconnected";
    } else {
      message_text = "No Controller Connected"; 
    }
  }
  
  // Refresh button clicked
  if (btn_list_refresh.MouseIsOver()) {
    if (Serial.list().length != 0) {
      // get the serial port list and length of the list
      serial_list_index = 0;
      serial_list = Serial.list()[serial_list_index];
      num_serial_ports = Serial.list().length;
    } else {
      serial_list_index = -1;
      serial_list = "No Serial Devices Found";
      num_serial_ports = 0;
      message_text = "No Controllers Found";
    }
  }
  
  // Send Volume Button Clicked
  if (btn_volume_send.MouseIsOver()) {
    if (!volumeInput.getText().equals("")) {
      SendSerialData("v" + volumeInput.getText()); // Send the values of myTextfield to ToggleButton() and clear textfield
    } else {
      message_text = "Enter volume as comma-separated in mL\nex. 12,15,13,10";
    }
  }
  
  // Send Offset Button Clicked
  if (btn_offset_send.MouseIsOver()) {
    if (!offsetInput.getText().equals("")) {
      SendSerialData("o" + offsetInput.getText()); // Send the values of myTextfield to ToggleButton() and clear textfield
    } else {
      message_text = "Enter pump offsets as comma-separated in % of beat\nex. 0,50,50,0"; 
    }
  }
  
  // Send Heart Rate Button Clicked
  if(btn_heartrate_send.MouseIsOver()) {
    if (!heartrateInput.getText().equals("")) {
      SendSerialData("b" + heartrateInput.getText()); // Send the values of myTextfield to ToggleButton() and clear textfield
    } else {
      message_text = "Enter heart rate in BPM\n ex. 65"; 
    }
  }
  
  // Start & Stop pumping buttons
  if (btn_start_pump.MouseIsOver()) {
    SendSerialData("start");
  }
  if (btn_stop_pump.MouseIsOver()) {
    SendSerialData("stop");
  }

  // Pumps status button
  if (btn_get_status.MouseIsOver()) {
    SendSerialData("status");
  }

  // Pump prime/purge
  if (btn_prime_purge.MouseIsOver()) {
    SendSerialData("prime/purge");
  }
  
}

void draw() {
  // Draw the buttons in the application window
  btn_up.Draw();
  btn_dn.Draw();
  btn_connect.Draw();
  btn_disconnect.Draw();
  btn_list_refresh.Draw();
  btn_get_status.Draw();
  btn_prime_purge.Draw();
  btn_volume_send.Draw();
  btn_offset_send.Draw();
  btn_heartrate_send.Draw();
  btn_start_pump.Draw(0, 154, 23);
  btn_stop_pump.Draw(223, 70, 97);
  DrawTextBox("Alerts/Messages", message_text, 280, 115, 180, 150);
  DrawTextBox("Select Port", serial_list, 10, 10, 150, 95);
}

void DrawTextBox(String title, String str, int x, int y, int w, int h)
{
  fill(255);
  rect(x, y, w, h);
  fill(0);
  textAlign(LEFT);
  textSize(14);
  text(title, x + 10, y + 10, w - 20, 20);
  textSize(12);  
  text(str, x + 10, y + 40, w - 20, h - 10);
}

// Button class for all buttons
class Button {
  String label;
  float x;    // top left corner x position
  float y;    // top left corner y position
  float w;    // width of button
  float h;    // height of button
  
  // Constructor
  Button(String labelB, float xpos, float ypos, float widthB, float heightB) {
    label = labelB;
    x = xpos;
    y = ypos;
    w = widthB;
    h = heightB;
  }
  
  // Draw the button in the window (with given RGB values)
  void Draw(int r, int g, int b) {
    fill(r, g, b);
    stroke(141);
    rect(x, y, w, h, 10);
    textAlign(CENTER, CENTER);
    fill(0);
    text(label, x + (w / 2), y + (h / 2));
  }
  
  // Draw the button in the window (standard fill color)
  void Draw() {
    fill(218);
    stroke(141);
    rect(x, y, w, h, 10);
    textAlign(CENTER, CENTER);
    fill(0);
    text(label, x + (w / 2), y + (h / 2));
  }
  
  // Returns true if the mouse cursor is over the button
  boolean MouseIsOver() {
    if (mouseX > x && mouseX < (x + w) && mouseY > y && mouseY < (y + h)) {
      return true;
    }
    return false;
  }
}

// Send serial data to connected device
void SendSerialData(String cmd){
  if (serial_port != null) {
    serial_port.write(cmd);
  } else {
    message_text = "No device connected";
  }
}
