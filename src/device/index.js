/**
 * All the required imports
 */

const PacketSenderTimer = require("./classes/PacketSenderTimer");
const App = require("./classes/app");
const { HeartBeatCallback, LoginCallback, GPSCallback } = require("./callbacks/callbacks");
const { LoginTimeoutHandler, HeartbeatTimeoutHandler, GPSTimeoutHandler } = require("./eventHandlers/handlers");
const { HBEAT_DELAY_IN_MS, LOGIN_DELAY_IN_MS, GPS_DELAY_IN_MS } = require("./config/config")
const {EVENT} = require("../common/constants/constants");



/**
 * Instantiating the app
 */
let app = new App();

/**
 * Instantiating the login PacketSender.
 */
let login = new PacketSenderTimer(LoginCallback, LOGIN_DELAY_IN_MS);

/**
 * Adding the PacketSender to app.
 */
app.updatePacketSender(login);

/**
 * Adding event handlers for the login packet sender.
 */
login.on(EVENT.TIMEOUT, LoginTimeoutHandler);
login.on(EVENT.SUCCESS, (data, emitter) => {
    console.log("Login response " + data);
    /**
     * On successful response of login packet.
     * Instantiating PacketSender for and adding 
     */
    let hbeat = new PacketSenderTimer(HeartBeatCallback, HBEAT_DELAY_IN_MS);
    app.updatePacketSender(hbeat);
    hbeat.on(EVENT.TIMEOUT, HeartbeatTimeoutHandler);
    hbeat.on(EVENT.SUCCESS, (data, emitter) => {
        console.log("Heartbeat response " + data);
        let gpsPacketSender = new PacketSenderTimer(GPSCallback, GPS_DELAY_IN_MS);
        gpsPacketSender.on(EVENT.TIMEOUT, GPSTimeoutHandler);
        gpsPacketSender.on(EVENT.SUCCESS, (data, emitter) => {
            console.log("GPS response " + data);
        });
        app.updatePacketSender(gpsPacketSender);
    });
});

app.start();