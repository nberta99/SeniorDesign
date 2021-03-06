#!/usr/bin/python
import serial
import time
from datetime import datetime
import smtplib
import secrets # Just holds variables for credentials
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

#The following line is for serial over GPIO
port = '/dev/cu.usbmodem14301' # Change with value from Arduino IDE

ard = serial.Serial(port, 9600, timeout=5)
time.sleep(2) # wait for Arduino to start serial

running = True # State for while loop

# Email creds
email = secrets.email
pwd = secrets.password

# Cell number
cellNumber = secrets.cellNumber # Cell number without +1 at front
carrierEmail = ['@vtext.com','@txt.att.net','@pm.sprint.com','@tmomail.net','@myboostmobile.com','@sms.mycricket.com','@mymetropcs.com','@email.uscc.net','@vmobl.com']
               # 0: Verizon, 1: ATT,        2: Sprint,       3: T-Mobile,   4: Boost,            5: Cricket,          6: Metro PCS,     7: US Cellular,   8: Virgin
sms_gateway = cellNumber + carrierEmail[0]

def sendAlertMsg(alertMsg):
    smtp = "smtp.gmail.com" # Gmail SMTP server
    port = 587
    # Start our email server
    server = smtplib.SMTP(smtp,port)
    server.starttls()
    server.login(email,pwd)

    # Now we use the MIME module to structure our message.
    msg = MIMEMultipart()
    msg['From'] = email
    msg['To'] = sms_gateway
    msg['Subject'] = ""
    body = alertMsg + " " + datetime.now().strftime('%Y-%m-%d %I:%M:%S %p')
    msg.attach(MIMEText(body, 'plain'))

    # Send message and quit server
    server.sendmail(email, sms_gateway, msg.as_string())
    server.quit()
    return()

while (running):
    # Serial read section
    msg = ard.readline().decode('ascii') #(ard.inWaiting()) # read all characters in buffer
    print(msg)
    if (msg == "Beam broken\r\n"):
        # Send message to phone
        beamBroken = True
        sendAlertMsg("Beam break detected")
        while(beamBroken):
            msg = ard.readline().decode('ascii') #(ard.inWaiting()) # read all characters in buffer
            print(msg)
            if (msg == "Beam detected\r\n"):
                beamBroken = False
else:
    print("Exiting")
exit()