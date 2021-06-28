/**
 * 
 * It is a custom event emitter class which will be used by
 * packet senders to emit events.
 * 
 */
class EventEmitter {
    constructor() {
        this.events = {};

    }
    /**
     * Registers an event handler for a given event
     * 
     * @param {string} eventName 
     * @param {function} callback 
     */
    on(eventName, callback) {
        if (this.events[eventName]) {
            this.events[eventName].push(callback);
        } else {
            this.events[eventName] = [callback];
        }
    }

    /**
     * Clears the event handlers for a given event name
     * 
     * @param {string} eventName 
     */
    clearEventHandlers(eventName) {
        if (this.events[eventName])
            this.events[eventName] = [];
    }

    /**
     * Emits an event and executes all the events registered for a given event name.
     * 
     * @param {string} eventName 
     * @param {any} data 
     */
    emit(eventName, data) {
        if (this.events[eventName])
            for (let f of this.events[eventName]) {
                f(data, this);
            }
    }

}
module.exports = EventEmitter;