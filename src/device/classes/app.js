/**
 * This is the main application class
 */
class App {
    constructor() {
        this.currentPacketSender = null;
    }
    /**
     * This method is responsible for changing the packet sender dynamically at runtime.
     * @param {PacketSender} packetSender 
     */
    updatePacketSender(packetSender) {
        packetSender.app = this;
        this.stop();
        this.currentPacketSender = packetSender;
        this.start();
    }
    /**
     * This method is responsible for stopping the currently running packet sender.
     */
    stop() {
        if (this.currentPacketSender && this.currentPacketSender.isRunning()) {
            this.currentPacketSender.stop();
        }
    }
    /**
     * This method is responsible for starting the last assigned packet sender.
     */
    start() {
        if (this.currentPacketSender && !this.currentPacketSender.isRunning()) {
            this.currentPacketSender.start();
        }
    }
}
module.exports = App;