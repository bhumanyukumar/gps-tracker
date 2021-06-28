/** 
 * Login Controller
 * responsible for checking if the connection is normal or not by the terminal
 * @description
 * Terminal/device sents the login packet every 5 seconds
 * if the response received in 5 seconds, connection is considered to be normal
 * otherwise, response of login packet is timeout and terminal will send the packet again
 * 
 * Terminal will be rebooted/stopped after 3 timeouts
 * 
 * --- Personal Comment----
 * As i am told to focus only on GPS packet decoding, so i am sending just ok response
 * from this controller to simulate correctly working endpoint
*/
class LoginController {
    async login(req, res) {
        console.log("Login Packet Received At Server");
        res.send("ok");
    }
}
module.exports = new LoginController();