const crc16 = require("node-crc-itu");
const DateValues = ["Year", "Month", "Day", "Hour", "Minute", "Second"];
const DataUploadMode = Object.freeze({
    "00": "Upload by time interval",
    "01": "Upload by distance interval",
    "02": "Inflection point upload",
    "03": "ACC status upload",
    "04": "Re-upload the last GPS point when back to static",
    "05": "Upload the last effective point when network recover",
    "06": "Update ephemeris and upload GPS data compulsorily",
    "07": "Upload location when side key triggered",
    "08": "Upload location after power on",
    "09": "Unused",
    "0A": "A Upload the last longitude and latitude when device is static;time updated",
    "0D": "Upload the last longitude and latitude when device is static",
    "0E": "Gpsdup upload (Upload regularly in a static state.)"
})
const GpsUploadType = Object.freeze({
    "00": "Real time upload",
    "01": "Re-upload"
})

class GPSPacketDecoder {
    /**
     * Performs data decoding from the data string
     * 
     * @param {string} dataString 
     * @returns 
     */
    static Decode(dataString) {
        let dataStringArray = dataString.split(" ");
        let isMileageAvailable = GPSPacketDecoder.hasMileage(dataStringArray);
        const Fields = ExtractVariables([...dataStringArray], isMileageAvailable);
        const qGIS = Fields.qGIS[0]; // Not to be saved

        //Creating date string
        let dateTime = Fields.dateTime.reduce((acc, current, index) => {
            acc.push(`${DateValues[index]}:${hexToDecimal(current)}`)
            return acc;
        }, []).join(", ");

        const gpsInformationLength = hexToDecimal(qGIS[0]);
        const positioningSatelliteNumber = hexToDecimal(qGIS[1]);
        const latitude = hexToDecimal(Fields.lat.join("")) / 1800000;
        const longitude = hexToDecimal(Fields.long.join("")) / 1800000;
        const speed = hexToDecimal(Fields.speed[0]);
        const courseStatus = GetCourseStatus(Fields.courseStatus);
        const mcc = hexToDecimal(Fields.mcc);
        const mnc = hexToDecimal(Fields.mnc);
        const lac = hexToDecimal(Fields.lac);
        const cellId = hexToDecimal(Fields.cellId);
        let accStatus;;
        if (Fields.acc[0] == '00') {
            accStatus = "Low";
        } else if (Fields.acc[0] == '01') {
            accStatus = "High";
        } else {
            accStatus = "Not available";
        }
        const dataUploadMode = DataUploadMode[Fields.dataUploadMode[0]] ? DataUploadMode[Fields.dataUploadMode[0]] : "-";
        const gpsUploadType = GpsUploadType[Fields.gpsRealTimeReUpload[0]] ? GpsUploadType[Fields.gpsRealTimeReUpload[0]] : "-";
        const mileage = isMileageAvailable ? hexToDecimal(Fields.mileage) / 100 : "-";
        const serialNumber = hexToDecimal(Fields.serialNumber);
        let text = `DateTime=[${dateTime}],
        Quantity of Gps Information Satellites=[GPS information Length=${gpsInformationLength}, positioning satelite number=${positioningSatelliteNumber}], 
        Latitude=${latitude},
        Longitude=${longitude},
        speed=${speed},
        CourseStatus=${courseStatus},
        MCC=${mcc},
        MNC=${mnc},
        LAC=${lac},
        Cell Id=${cellId},
        ACC=${accStatus},
        DataUploadMode=${dataUploadMode},
        GPSUploadType=${gpsUploadType},
        Mileage=${mileage},
        SerialNumber=${serialNumber}
        `;
        return text.replace(/\r\n/g, "");
    }

    /**
     * Checks if data packet has any errors
     * uses crc-itu 16bit
     * 
     * @param {string} dataString 
     * @returns 
     */
    static ErrorCheck(dataString) {
        let stringArray = dataString.split(" ");
        const hasMileage = GPSPacketDecoder.hasMileage(stringArray);
        let errorCheck = GetCrcValue(stringArray);
        let fields = ExtractVariables(stringArray, hasMileage);
        return (fields.errorCheck.join("") == errorCheck);
    }

    /**
     * Checks whether the data length is correct or not
     * 
     * @param {string} dataString 
     * @returns boolean
     */
    static isDataValid(dataString) {
        let dataStringArray = dataString.split(" ");
        let dataStringArrayLength = dataStringArray.length;
        if ([43, 39].includes(dataStringArrayLength)) {
            return true;
        }
        return false;
    }

    /**
     * Checks if mileage is present in the data or not
     * by checking the data length
     * 
     * @param {Array of hex string} dataStringArray 
     * @returns boolean
     */
    static hasMileage(dataStringArray) {
        let dataStringArrayLength = dataStringArray.length;
        let isMileageAvailable = false;
        if (dataStringArrayLength == 43) {
            isMileageAvailable = true;
        }
        return isMileageAvailable;
    }
}
module.exports = GPSPacketDecoder;

/**
 * This function is responsible for error checking and returning the boolean result of the gps data packet
 * 
 * @param {Array of hex strings} arr 
 * @returns boolean
 */
function GetCrcValue(arr) {
    //starting index is 2 becasue startBit of size 2 (index 0,1) is not included in crc
    const startFromIndex = 2;
    //end index will be length-4 beacause last 4 bits(stop bit and error check is not included in crc);
    const endIndex = arr.length - 4;
    return crc16(arr.slice(startFromIndex, endIndex).join(""))
}
function ExtractVariables(arr, isMileage) {
    const KeysAndLength = [{ key: "startBit", length: 2 },
    { key: "packetLength", length: 1 },
    { key: "protocolNumber", length: 1 },
    { key: "dateTime", length: 6 },
    { key: "qGIS", length: 1 },
    { key: "lat", length: 4 },
    { key: "long", length: 4 },
    { key: "speed", length: 1 },
    { key: "courseStatus", length: 2 },
    { key: "mcc", length: 2 },
    { key: "mnc", length: 1 },
    { key: "lac", length: 2 },
    { key: "cellId", length: 3 },
    { key: "acc", length: 1 },
    { key: "dataUploadMode", length: 1 },
    { key: "gpsRealTimeReUpload", length: 1 },
    { key: "mileage", length: 4 },
    { key: "serialNumber", length: 2 },
    { key: "errorCheck", length: 2 },
    { key: "stopBit", length: 2 }
    ]
    let finalObject = {};
    for (let obj of KeysAndLength) {
        if (obj.key == "mileage" && !isMileage) {
            continue;
        }
        finalObject[obj.key] = arr.splice(0, obj.length);
    }
    return finalObject;

}
function hexToDecimal(hex) {
    if (Array.isArray(hex)) {
        hex = hex.join("");
    }
    return parseInt(hex, 16);
}
function hexToBinary(hex) {
    return ("00000000" + parseInt(hex, 16).toString(2)).substr(-8);
}
function GetCourseStatus(courseStatusArray) {
    let binaryOfCourseStatus = courseStatusArray.map(e => hexToBinary(e)).join("");
    const gpsType = parseInt(binaryOfCourseStatus[2]) ? "differential positioning" : "GPS real-time";
    const gpsPositioning = parseInt(binaryOfCourseStatus[3]) ? "on" : "off";
    const longitudeType = parseInt(binaryOfCourseStatus[4]) ? "West Longitude" : "East Longitude";
    const latitudeType = parseInt(binaryOfCourseStatus[5]) ? "North Latitude" : "South Latitude";
    const course = parseInt(binaryOfCourseStatus.slice(6), 2);
    return `GPS Tracking is ${gpsPositioning} with ${gpsType} lcoation at ${latitudeType} ${longitudeType} and course is ${course}°`
}