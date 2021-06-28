const fs = require("fs");
const path = require("path");
class File {
    constructor(fileName) {
        this._stream = fs.createWriteStream(path.join(__dirname, "..", "..", "..", "output", fileName), { flags: "a" });
    }
    WriteDataToFile(dataString) {
        this._stream.write(`${dataString}\n`);
    }
    EndWriting() {
        this._stream.end();
    }
}

module.exports = File;
