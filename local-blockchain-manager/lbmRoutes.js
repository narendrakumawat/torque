const contractDetails = require('./contractDetailsProvider.js');
const constant = require("./constant.js");
const logger = require('./logger.js');
const config = require('./config.js');

module.exports = (web3Private, web3Public,app) => {
    const publicDeviceStateManager = contractDetails.returnContractDetails(
        web3Public,constant.contract.name.PublicDeviceStateManager);
    const homeMember = contractDetails.returnContractDetails(
        web3Public,constant.contract.name.HomeMember);
    const privateDeviceStateManager = contractDetails.returnContractDetails(
        web3Private,constant.contract.name.DeviceStateManager);

    app.get('/health',(req, res) => {
        res.send(constant.status.success);
    });

    app.post('/device',(req, res) => {
    const deviceAddress = req.body.deviceAddress;
    const isRegulatable = Boolean(req.body.isRegulatable);
    const deviceName = req.body.deviceName;

    privateDeviceStateManager.methods
        .addDevice(deviceAddress,0,isRegulatable,deviceName)
        .send({from:config.private.account.address, gas:3000000})
        .then(result => {
                logger.debug(result);
                publicDeviceStateManager.methods
                    .addDevice(deviceAddress, 
                                0,
                                isRegulatable,
                                deviceName)
                    .send({from:config.public.account.address, gas:3000000})
                    .then(result => {
                            logger.debug(result);
                            res.send(constant.status.success);
                    })
                    .catch(error => {
                        logger.error(error);
                        res.send(constant.status.failure);
                    });
        })
        .catch(error => {
            logger.error(error);
            res.send(constant.status.failure);
        });

    });

    app.delete('/device',(req, res) => {    
    const deviceAddress = req.body.deviceAddress;

    privateDeviceStateManager.methods
        .deleteDevice(deviceAddress)
        .send({from:config.private.account.address, gas:3000000})
        .then(result => {
                logger.debug(result);
                publicDeviceStateManager.methods
                    .deleteDevice(deviceAddress)
                    .send({from:config.public.account.address})
                    .then(result => {
                            logger.debug(result);
                            res.send(constant.status.success);
                    })
                    .catch(error => {
                        logger.error(error);
                        res.send(constant.status.failure);
                    });
        })
        .catch(error => {
            logger.error(error);
            res.send(constant.status.failure);
        });

    });

    app.post('/homemember',(req, res) => {
    const homeMemberAddress = req.body.homeMemberAddress;

    homeMember.methods
            .addHomeMember(homeMemberAddress)
            .send({from:config.public.account.address})
            .then(result => {
                    logger.debug(result);
                    res.send(constant.status.success);
            })
            .catch(error => {
                logger.error(error);
                res.send(constant.status.failure);
            });
    });

    app.delete('/homemember',(req, res) => {
    const homeMemberAddress = req.body.homeMemberAddress;

    homeMember.methods
            .removeHomeMember(homeMemberAddress)
            .send({from:config.public.account.address, gas:3000000})
            .then(result => {
                    logger.debug(result);
                    res.send(constant.status.success);
            })
            .catch(error => {
                logger.error(error);
                res.send(constant.status.failure);
            });
    });
    
};
