const Config = require("../config/config");
/**
 * This file contains all the event handlers for respective packet senders.
 * @param {number} timeoutCount 
 * @param {PacketSender} emitter 
 */

module.exports.HeartBeatSuccessHandler = async function (timeoutCount, emitter) {
    console.log("Login packet timeout " + timeoutCount);
    TimeoutHandler(timeoutCount, emitter);
}
module.exports.LoginTimeoutHandler = async function (timeoutCount, emitter) {
    console.log("Login packet timeout " + timeoutCount);
    TimeoutHandler(timeoutCount, emitter);
}
module.exports.HeartbeatTimeoutHandler = async function (timeoutCount, emitter) {
    console.log("Heartbeat packet timout " + timeoutCount);
    TimeoutHandler(timeoutCount, emitter);
}
module.exports.GPSTimeoutHandler = async function (timeoutCount, emitter) {
    console.log("GPS packet timout " + timeoutCount);
    TimeoutHandler(timeoutCount, emitter);
}
function TimeoutHandler(timeoutCount, emitter) {
    if (Config.REBOOT_AFTER_TIMEOUT_COUNT == timeoutCount) {
        if (emitter.packetSender.app) {
            emitter.packetSender.app.stop();
        }
    }
}