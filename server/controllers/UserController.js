const User = require('../models/User');
const  { mutipleMongooseToObject } = require('../helpers/mongoose');
const apiResponse = require('../helpers/apiResponse');

/*
UserController contains function handlers to handle request from User management page.
It will recieve the data from client, send to its model and vice versa.
This model will interact with database to store or update data.
*/

class UserController {
    // [POST] /user_management - function to store a user
    userStore(req, res){
        setTimeout(() => {
            try{
                let userInfo = req.body;
                const user = new User(userInfo);

                user
                    .save()
                    .then(() => {
                        return apiResponse.successResponse(res, 'Add user successfully');
                    });

            }catch(err){
                return apiResponse.ErrorResponse(res, err);
            }
        }, 1000);
    }

    // [GET] /user_management - function to get list of user
    userList = async (req, res) => {
      try{
        const condition = {};
        let limit = 8;
        let page = 0;
        let total = 0;
        if (req.query.keyword != undefined && req.query.keyword != '') {
          let keyword = req.query.keyword.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
          condition.username = {$regex: '.*' + keyword.trim() + '.*', $options: 'i'};
        }
        /* Pagination */
        if (req.query.limit != undefined && req.query.limit != '') {
          const number_limit = parseInt(req.query.limit);
          if (number_limit && number_limit > 0) {
            limit = number_limit;
          }
        }
        if (req.query.page != undefined && req.query.page != '') {
          const number_page = parseInt(req.query.page);
          if (number_page && number_page > 0) {
            page = number_page;
          }
        }
        if (req.query.isAdmin != undefined && req.query.isAdmin != '') {
          condition.isAdmin = (req.query.isAdmin === 'true');
        }
        if (req.query.isActive != undefined && req.query.isActive != '') {
          condition.isActive = (req.query.isActive === 'true');
        }
        /* Pagination */
        const users = await User.find(condition)
        total = await User.countDocuments(condition);
        if(users.length > 0)
          return apiResponse.successResponseWithData(res, 'Success', {
            users: mutipleMongooseToObject(users),
            total,
            page,
				    limit
          });
        else
          return apiResponse.successResponseWithData(res, 'Success', {
            users:[],
            total,
            page,
				    limit
          });
        } catch(err){
          return apiResponse.ErrorResponse(res, err);
        }
    }

    // [GET] /user_management/:id - function to get a user
    userDetail(req, res){
        let userId = req.params.id;
        try{
            User
                .findOne({ _id: userId })
                .then((user) => {
                    return apiResponse.successResponseWithData(res, 'Success', { user });
                });
        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    // [PUT] /user_management/:id - function to update a user
    userUpdate = async (req, res) => {
      try{
        let userId = req.params.id;
        let user = await User.findById(userId);
        let userInfo = req.body;
        if(user){
          await User.updateOne({ _id: userId }, userInfo)
          return apiResponse.successResponseWithData(res, 'Update user successfully', { user });
        }
        else throw new Error('User not found');
      }catch(err){
        return apiResponse.ErrorResponse(res, err);
      }
    }

    // [POST] /user_management/:id - function to change user's password
    changePassword = async (req, res) => {
      try{
        let userId = req.params.id;
        const {curPass, newPass} = req.body;
        if(curPass === newPass) return apiResponse.ErrorResponse(res, 'Your new password is your current password');
        let user = await User.findById(userId);
        if(user.verifyPassword(curPass)){
          user.password = newPass;
          await user.save();
          return apiResponse.successResponse(res, 'Change password successfully');
        }
        return apiResponse.ErrorResponse(res, 'Your password is incorrect');
      } catch(err){
        return apiResponse.ErrorResponse(res, err);
      }
    }
}

module.exports = new UserController();
