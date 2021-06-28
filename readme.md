# GPS Tracker Simulator
## Features

- Device Sends login packet to server
- After successful login packet response from server, device sends heartbeat packet
- After successful hearbeat packet response from server, device sends gps packet
- GPS packet is decoded and saved in a file at server

## Installation

### Step 1
Clone the project
```sh
git clone https://github.com/bhumanyukumar/gps-tracker.git
```
### Step 2
Go to the cloned project folder & Install the dependencies

```sh
cd gps-tracker
npm install
```
### Step 3
Start the server and device simulator
> Note: Run device & server on separate terminal parallely
#

```sh
npm run start:device
npm run start:server
```

> Note: The file written by server will be in `output` folder.

