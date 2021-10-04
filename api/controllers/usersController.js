const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

module.exports = {
    signup: (req, res) => {
        const {firstName, lastName, userName, email, phone, password , getEmails} = req.body;

        User.find({ email }).then((users) => {
            if (users.length >= 1) {
                return res.status(409).json({
                    message: 'Email exists'
                })
            }
        User.find({ userName }).then((users) => {
            if (users.length >= 1) {
                return res.status(409).json({
                    message: 'UserName exists'
                })
            }   
            bcrypt.hash(password, 10, (error, hash) => {
                if (error) {
                    return res.status(500).json({
                        error
                    })
                }
    
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    firstName,
                    lastName,
                    userName,
                    email,
                    phone,
                    password: hash,
                    getEmails
                })
    
                user.save().then((result) => {
                    console.log(result);
    
                    res.status(200).json({
                        message: 'User created'
                    });
                }).catch(error => {
                    res.status(500).json({
                        error
                    })
                });
            });
        })
    })
},
    
login: (req, res) => {
        const { userName, email, password } = req.body;

        User.find({ email }).then((users) => {
            if (users.length === 0) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }

            const [ user ] = users;

            bcrypt.compare(password, user.password, (error, result) => {
                if (error) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }

                if (result) {
                    const token = jwt.sign({
                        id: user._id,
                        userName: user.userName,
                        email: user.email  
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "3H"
                    });
                    console.log(user)
                    return res.status(200).json({
                        message: 'Auth successful',
                        token, 
                    })
                }

                res.status(401).json({
                    message: 'Auth failed'
                });
            })
        })
    },
    update: (req, res) => {
        //check when the user want to change the email and validate it
        const oldEmail = req.body.oldEmail;
        console.log(req.body)
        const {_id, firstName, lastName, userName, email, phone, password , getEmails} = req.body;
        
        User.findOne({oldEmail}).then((users) => {
            console.log("u",users)
            if (!users) {
                return res.status(404).json({
                    message: 'User not found'
                })
            }
            User.find({ email }).then((users) => {
                if (users.length >= 1) {
                    return res.status(409).json({
                        message: 'Email exists'
                    })
                }
            User.find({ userName }).then((users) => {
                if (users.length >= 1) {
                    return res.status(409).json({
                        message: 'UserName exists'
                    })
                }
              
            User.updateOne({ _id: _id }, req.body).then(() => {
                res.status(200).json({
                    message: 'User Updated'
                })
            }).catch(error => {
                res.status(500).json({
                    error
                })
            });
        })
    })
})
    }
}