const EventEmitter = require("../../common/classes/EventEmitter");
const IntervalTimer = require("../../common/classes/IntervalTimer");
/**
 * This class is responsible for Handling the execution flow of packet sender.
 */
class PacketSender extends IntervalTimer {
    constructor(callback, intervalInMs) {
        super(callback, intervalInMs);
        this.eventEmitter = new EventEmitter();
        this.eventEmitter.packetSender = this;
        this.timoutCount = 0;
    }

    /**
     * This method resetes the timeout/response failure count
     */
    resetTimeoutCount() {
        this.timoutCount = 0;
    }

    /**
     * This method returns the number of timeout/response failure of the packet sender
     * @returns integer
     */
    getTimeoutCount() {
        return this.timoutCount;
    }

    /**
     * This method incementes and returns the number of timeout/response failure of the packet sender.
     * @returns integer
     */
    incrementTimeoutCount() {
        return this.timoutCount += 1;
    }

    /**
     * This method stops the execution of the packet sender.
     */
    stop() {
        this.resetTimeoutCount();
        super.stop();
    }

    /**
     * This method clears all the event handlers of a given event name from the packet sender.
     * @param {string} eventName 
     */
    clearEventHandlers(eventName) {
        this.eventEmitter.clearEventHandlers(eventName);
    }

    /**
     * Responsible for registering the event handlers.
     * @param {string} eventName 
     * @param {function} callback 
     */
    on(eventName, callback) {
        this.eventEmitter.on(eventName, callback.bind(this));
    }

    /**
     * Emits the event, with given data
     * @param {string} eventName 
     * @param {any} data 
     */
    emit(eventName, data) {
        this.eventEmitter.emit(eventName, data);
    }
}
module.exports = PacketSender;