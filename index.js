const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const connectToMongo = require("./db");
connectToMongo();


app.use(bodyParser.urlencoded({ extended: true }));



app.get("/", (req, res) => {
    res.send("Hello Google");
});



app.use("/api/auth/", require("./routes/auth"));


app.use("/api/notes", require("./routes/notes"));

app.listen(5000, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("5000 port is running");
    }
})