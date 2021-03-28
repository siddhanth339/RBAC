const express = require('express');
const router = express.Router();
const controller = require('../control/controls');

router.post('/signup', controller.signup);

router.post('/login', controller.login);

router.post('/addRole', controller.allowIfLoggedin, controller.checkAddAccess('Role'));

router.post('/addImage', controller.allowIfLoggedin, controller.checkAddAccess('Image'));

router.post('/updateImage', controller.allowIfLoggedin, controller.updateImage);

router.post('/deleteImage', controller.allowIfLoggedin, controller.deleteImage);

router.get('/getImages', controller.allowIfLoggedin, controller.getImages);

module.exports = router;