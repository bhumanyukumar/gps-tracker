const axios = require("axios");
const { EVENT } = require("../../common/constants/constants");
const Config = require("../config/config");


/**
 * This file contains the callback definitions of the respective packet senders.
 * 
 * These functions contains the logic to be run after each interval.
 * 
 * @param packetSender 
 * this param will be passed automatically.
 */
module.exports.HeartBeatCallback = async function (packetSender) {
    console.log("Heartbeat packet sent to server : waiting ack");
    try {
        let result = await axios.post(Config.SERVER_BASE_URL + "/api/heartbeat/check");
        handleSuccess(result.data, packetSender);
    } catch (err) {
        handleFailure(packetSender);
    }
}
module.exports.LoginCallback = async function (packetSender) {
    console.log("Login packet sent to server : waiting ack");
    try {
        let result = await axios.post(Config.SERVER_BASE_URL + "/api/login");
        handleSuccess(result.data, packetSender);
    } catch (err) {
        handleFailure(packetSender);
    }
}
module.exports.GPSCallback = async function (packetSender) {
    console.log("GPS packet sent to server : waiting ack");
    try {
        let result = await axios.post(Config.SERVER_BASE_URL + "/api/gps", { data: Config.DATA_PACKET_TO_SEND });
        handleSuccess(result.data, packetSender);
    } catch (err) {
        handleFailure(packetSender);
    }
}

/**
 * A simple helper function to reduce duplicate code.
 * @param {any} data 
 * @param {PacketSender} packetSender 
 */
function handleSuccess(data, packetSender) {
    if (data == "ok") {
        packetSender.resetTimeoutCount();
    }
    packetSender.emit(EVENT.SUCCESS, data);
}
function handleFailure(packetSender) {
    let timeoutCount = packetSender.incrementTimeoutCount();
    packetSender.emit(EVENT.TIMEOUT, timeoutCount);
}