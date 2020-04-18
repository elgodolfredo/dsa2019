var express = require("express");
const DB = require('./db');

var app = express();app.listen(3000, () => {
    console.log("Server running on port 3000");
});
const Repositories = new DB.Repositories();


app.get("/repositories",  async (req, res, next) => {
    if ( req.query.vulnerability_id ) {
        res.json(await Repositories.whereVulnerability(req.query.vulnerability_id));
    } else {
        res.json(await Repositories.all());
    }
});