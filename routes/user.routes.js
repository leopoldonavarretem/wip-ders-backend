//Imports
const router = require('express').Router();
const logger = require('../config/logger.config');
const getUserInfo = require("../middleware/getUserInfo");
const isEmployee = require("../middleware/isEmployee");
const userDao = require("../dao/user.dao");

router.patch('/', getUserInfo, isEmployee, async (req, res) => {
    logger.info(`${req.method} received to ${req.url}`);
    try {
        //TODO: Add verification.
        const {newPassword, newName, newAddress} = req.body;
        await userDao.editUserInformation(req.user.username, newPassword, newName, newAddress);
        res.send({"message": "Information updated successfully."});

    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            res.status(400);
            res.send({
                "message": "Invalid JWT"
            });
        } else if (err.name === 'TypeError') {
            res.status(400);
            res.send({
                "message": "No authorization header provided"
            });
        } else {
            res.status(500);
        }
    }
});

module.exports = router;