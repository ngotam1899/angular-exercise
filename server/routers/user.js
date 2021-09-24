const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.post('/', userController.userStore); // add a user
router.get('/', userController.userList);  // get list of users
router.get('/:id', userController.userDetail); // get a user
router.put('/:id', userController.userUpdate); // update a user
router.post('/avatar', userController.uploadImage); // upload a user avatar
router.post('/multi', userController.uploadMulti); // upload multi images
router.post('/:id', userController.changePassword); // change password of a user


module.exports = router;
