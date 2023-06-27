#include <ESP32_LoRaWAN.h>
#include "Arduino.h"
#include <SoftwareSerial.h>
#include <TinyGPS.h>

uint32_t license[4] = { 0xDF72CEF4, 0x1AE8A914, 0x630E91BD, 0xF336404B };

uint8_t DevEui[] = { 0x60, 0x81, 0xF9, 0x30, 0x25, 0x97, 0x89, 0x22 };
uint8_t AppEui[] = { 0x60, 0x81, 0xF9, 0xC5, 0xDA, 0xF6, 0x50, 0x9B };
uint8_t AppKey[] = { 0x57, 0x4C, 0x90, 0xF9, 0xB4, 0x03, 0x4F, 0xEC, 0x66, 0xB2, 0xDB, 0xCE, 0x65, 0x7D, 0x19, 0x93 };

uint8_t NwkSKey[] = { };
uint8_t AppSKey[] = { };
uint32_t DevAddr = (uint32_t) 0x69;

uint16_t userChannelsMask[6] = { 0x00FF, 0x0000, 0x0000, 0x0000, 0x0002, 0x0000 };
DeviceClass_t loraWanClass = CLASS_A;
uint32_t appTxDutyCycle = 30000;
bool overTheAirActivation = true;
bool loraWanAdr = true;
bool isTxConfirmed = false;
uint8_t appPort = 2;
uint8_t confirmedNbTrials = 8;
uint8_t debugLevel = LoRaWAN_DEBUG_LEVEL;
LoRaMacRegion_t loraWanRegion = ACTIVE_REGION;

SoftwareSerial gpsSerial(22, -1);
TinyGPS gps;

static void prepareTxFrame(uint8_t port)
{
    bool new_data = false;
    
    for(unsigned long start = millis(); millis() - start < 2000 && !new_data;) {
        while(gpsSerial.available() && !new_data) {
            if(gps.encode(gpsSerial.read())) {
                long lat, lon;
                gps.get_position(&lat, &lon);
                
                long lspeed = gps.speed();

                appDataSize = 12;
                
                appData[0] = lat;
                appData[1] = lat >> 8;
                appData[2] = lat >> 16;
                appData[3] = lat >> 24;

                appData[4] = lon;
                appData[5] = lon >> 8;
                appData[6] = lon >> 16;
                appData[7] = lon >> 24;

                appData[8] = lspeed;
                appData[9] = lspeed >> 8;
                appData[10] = lspeed >> 16;
                appData[11] = lspeed >> 24;
                
                new_data = true;

                Serial.println(lspeed);
                Serial.println(appData[8]);
            }
        }
    }

    if(!new_data) {
      appDataSize = 1;
      appData[0] = 0x69;
    }
}

void setup()
{
  Serial.begin(115200);
  while (!Serial);
  SPI.begin(SCK, MISO, MOSI, SS);
  Mcu.init(SS, RST_LoRa, DIO0, DIO1, license);
  deviceState = DEVICE_STATE_INIT;

  gpsSerial.begin(9600);
}

void loop()
{
  switch(deviceState)
  {
    case DEVICE_STATE_INIT:
    {
      LoRaWAN.init(loraWanClass, loraWanRegion);
      break;
    }
    case DEVICE_STATE_JOIN:
    {
      LoRaWAN.displayJoining();
      LoRaWAN.join();
      break;
    }
    case DEVICE_STATE_SEND:
    {
      prepareTxFrame(appPort);
      LoRaWAN.displaySending();
      LoRaWAN.send(loraWanClass);
      deviceState = DEVICE_STATE_CYCLE;
      break;
    }
    case DEVICE_STATE_CYCLE:
    {
      txDutyCycleTime = appTxDutyCycle + randr(-APP_TX_DUTYCYCLE_RND, APP_TX_DUTYCYCLE_RND);
      LoRaWAN.cycle(txDutyCycleTime);
      deviceState = DEVICE_STATE_SLEEP;
      break;
    }
    case DEVICE_STATE_SLEEP:
    {
      LoRaWAN.displayAck();
      LoRaWAN.sleep(loraWanClass, debugLevel);
      break;
    }
    default:
    {
      deviceState = DEVICE_STATE_INIT;
      break;
    }
  }
}
