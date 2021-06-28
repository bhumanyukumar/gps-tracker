/** 
 * GPS Controller
 * responsible for checking if the connection is normal or not by the terminal
 * @description
 * Terminal/device sents the gps packet every 5 seconds
 * if the response received in 5 seconds, connection is considered to be normal
 * otherwise, response of login packet is timeout and terminal will send the packet again
 * 
 * Terminal will be rebooted/stopped after 3 timeout
*/

const FileWriter = require("../utils/FileWriter");
let fw = new FileWriter("gpsdata.txt");
const GPSPacketDecorder = require("../utils/GpsPacketDecoder");
class GpsController {
    gps(req, res) {
        //check if datastring is valid or not
        if (req.body.data) {
            let data = req.body.data.trim();
            if (data && GPSPacketDecorder.isDataValid(data) && GPSPacketDecorder.ErrorCheck(data)) {
                fw.WriteDataToFile(GPSPacketDecorder.Decode(data));
                console.log("GPS Packet Received At Server");
                return res.send("ok");
            }
        }
        res.send("Invalid data packet");
    }
}
module.exports = new GpsController();