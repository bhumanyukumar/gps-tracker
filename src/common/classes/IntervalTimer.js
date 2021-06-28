/**
 * @classdesc
 * This class is used a base class for Packetsenders ie.Login Packet Sender, Heartbeat Packet Sender etc.
 * The main purpose of this class is to provide timer functionality.
 */
class IntervalTimer {
    /**
     * @constructor
     * Takes 2 params, first is a callback which will be called repeatedly after the given interval (sencond param).
     * 
     * @param {function} callback 
     * @description callback function to be called after the interval
     * @param {number} intervalInMs  
     * @description interval in miliseconds
     */
    constructor(callback, intervalInMs) {
        this.callback = callback;
        this.intervalInMs = intervalInMs;
        this.running = false;
    }
    /**
     * This method stops the timer.
     */
    stop() {
        if (this.timer)
            clearInterval(this.timer)
        this.timer = null;
        this.running = false;
    }
    /**
     * This method returns boolean, refering to the current status of timer 
     * 
     * @returns boolean
     */
    isRunning() {
        return this.running;
    };
    /**
     * This method is responsible for starting the timer.
     */
    start() {
        if (this.timer) {
            this.stop();
        }
        this.timer = setInterval(this.callback, this.intervalInMs, this);
        this.running = true;
    };
}
module.exports = IntervalTimer;