const express = require("express");
const app = express();
const PORT = 5000;
const routes = require("./routes");
app.use(express.json());
app.use("/api/", routes);
app.listen(PORT, () => {
    console.log("Server is listening at " + PORT);
});