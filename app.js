var express = require("express");
var cors = require('cors')
const DB = require('./db');

var app = express();app.listen(3001, () => {
    console.log("Server running on port 3001");
});
const Repositories = new DB.Repositories();

app.use(cors())
app.get("/repositories", async (req, res, next) => {
    if ( req.query.vulnerability_id ) {
        res.json(await Repositories.whereVulnerability(req.query.vulnerability_id));
    } else {
        res.json(await Repositories.all());
    }
});