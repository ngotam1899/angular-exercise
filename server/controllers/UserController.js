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
                    return apiResponse.successResponseWithData(res, 'Success', { user: user });
                });
        }catch(err){
            return apiResponse.ErrorResponse(res, err);
        }
    }

    // [PUT] /user_management/:id - function to update a user
    userUpdate(req, res){
        setTimeout(() => {
            try{
                let userId = req.params.id;
                let userInfo = req.body;
                User
                    .updateOne({ _id: userId }, userInfo)
                    .then(() => {
                        return apiResponse.successResponse(res, 'Update user successfully');
                    });
            }catch(err){
                return apiResponse.ErrorResponse(res, err);
            }
        }, 1000);
    }

    // [POST] /user_management/:id - function to change user's password
    changePassword(req, res){
        setTimeout(() => {
            try{
                let userId = req.params.id,
                    newPass = req.body.newPass;

                User
                    .findByIdAndUpdate({_id : userId}, {password : newPass})
                    .then(() => {
                        return apiResponse.successResponse(res, 'Change password successfully');
                    });

            } catch(err){
                return apiResponse.ErrorResponse(res, err);
            }
        }, 1000);
    }
}

module.exports = new UserController();
