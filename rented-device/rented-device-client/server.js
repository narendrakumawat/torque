const Web3 = require("web3");
const config = require("./config.js");
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || config.network.port || 8001;
const bodyParser = require('body-parser');
const logger = require("./logger.js");
const web3 = new Web3(config.network.ws);

app.use(cors());
app.use(bodyParser.json());

// Handling smart contracts for devices
require("./rentedDeviceStateManager.js")(web3);

app.use(function (req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'});
});

app.listen(port);
logger.info('Rented Device Client Manager is running on: '+ 
             port);