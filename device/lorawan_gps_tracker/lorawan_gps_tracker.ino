
#include <lmic.h>
#include <hal/hal.h>
#include <SPI.h>
#include <SoftwareSerial.h>
#include <TinyGPS.h>

TinyGPS gps;
SoftwareSerial gpsSerial(6, -1);

static osjob_t sendjob;

const unsigned TX_INTERVAL = 60;

float lat, lon;
unsigned long age;

uint8_t gps_data_string;
bool gps_new_data = false;

// Pin mapping
const lmic_pinmap lmic_pins = {
    .nss = 10,
    .rxtx = LMIC_UNUSED_PIN,
    .rst = 9,
    .dio = {3, 4, 5},
};

void onEvent (ev_t event) {
    switch(event) {
        case EV_SCAN_TIMEOUT:
            Serial.println(F("EV_SCAN_TIMEOUT"));
            break;
        case EV_BEACON_FOUND:
            Serial.println(F("EV_BEACON_FOUND"));
            break;
        case EV_BEACON_MISSED:
            Serial.println(F("EV_BEACON_MISSED"));
            break;
        case EV_BEACON_TRACKED:
            Serial.println(F("EV_BEACON_TRACKED"));
            break;
        case EV_JOINING:
            Serial.println(F("EV_JOINING"));
            break;
        case EV_JOINED:
            Serial.println(F("EV_JOINED"));
            break;
        case EV_JOIN_FAILED:
            Serial.println(F("EV_JOIN_FAILED"));
            break;
        case EV_REJOIN_FAILED:
            Serial.println(F("EV_REJOIN_FAILED"));
            break;
        case EV_TXCOMPLETE:
            Serial.println(F("EV_TXCOMPLETE (includes waiting for RX windows)"));
            
            if (LMIC.txrxFlags & TXRX_ACK)
              Serial.println(F("Received ack"));
            if (LMIC.dataLen) {
              Serial.println(F("Received "));
              Serial.write(LMIC.frame + LMIC.dataBeg, LMIC.dataLen);
              Serial.println();
            }

            os_setTimedCallback(&sendjob, os_getTime() + sec2osticks(TX_INTERVAL), send_gps);
            break;
        case EV_LOST_TSYNC:
            Serial.println(F("EV_LOST_TSYNC"));
            break;
        case EV_RESET:
            Serial.println(F("EV_RESET"));
            break;
        case EV_RXCOMPLETE:
            Serial.println(F("EV_RXCOMPLETE"));
            break;
        case EV_LINK_DEAD:
            Serial.println(F("EV_LINK_DEAD"));
            break;
        case EV_LINK_ALIVE:
            Serial.println(F("EV_LINK_ALIVE"));
            break;
        case EV_TXSTART:
            Serial.println(F("EV_TXSTART"));
            break;
        case EV_TXCANCELED:
            Serial.println(F("EV_TXCANCELED"));
            break;
        case EV_RXSTART:
            break;
        case EV_JOIN_TXCOMPLETE:
            Serial.println(F("EV_JOIN_TXCOMPLETE: no JoinAccept"));
            break;
        default:
            Serial.print(F("Unknown event: "));
            Serial.println((unsigned) event);
            break;
    }
}

void send_gps(osjob_t* j){
    if (LMIC.opmode & OP_TXRXPEND) {
        Serial.println(F("OP_TXRXPEND, not sending"));
    } else {
        if(gps_new_data)
          LMIC_setTxData2(1, (uint8_t *)gps_data_string, sizeof((uint8_t *)gps_data_string) - 1, 0);

        gps_new_data = false;
          
        Serial.println(F("Packet queued"));
        Serial.write(gps_data_string);
    }
}

void setup() {
    delay(5000);
    Serial.begin(9600);
    Serial.println(F("Starting"));

    gpsSerial.begin(9600);

    os_init();
    LMIC_reset();

    send_gps(&sendjob);
}

void loop() {
    os_runloop_once();

    if(gpsSerial.available()) {
      if(gps.encode(gpsSerial.read())) {
        gps.f_get_position(&lat, &lon, &age);
        //gps_data_string = (uint8_t *) String(String(lat) + "#" + String(lon)).c_str();// + String(gps.f_speed_kmph()) + "#" + String(gps.hdop());
        gps_new_data = true;
        Serial.println("Jau");
      }
    }
}
