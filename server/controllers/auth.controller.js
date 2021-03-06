const{User} = require('../models/user.model'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt');

module.exports = {
    register: (req,res) => {
        User.create(req.body)
            .then(data => {
                res.cookie("usertoken",jwt.sign({_id:data._id},process.env.JWT_KEY),{
                    httpOnly:true,
                    expires: new Date(Date.now() + 900000000)
                }).json({msg:"success",userLogged:{
                                                    firstName: data.firstName,
                                                    lastName: data.lastName}})
            })
            .catch(err => res.json(err.errors))
    },
    login: (req,res) => {
        User.findOne({email:req.body.email})
            .then(data => {
                if(data === null){
                    res.json({error:"Invalid login attempt3!"})
                }
                else{
                    console.log(req.body.password, data.password)
                    bcrypt.compare(req.body.password,data.password)
                        .then(isValid => {
                            console.log("in bcrypt", isValid)
                            if(isValid === true){
                                res.cookie("usertoken",jwt.sign({_id:data._id},process.env.JWT_KEY),{
                                    httpOnly:true,
                                    expires: new Date(Date.now() + 900000000)
                                }).json({
                                    msg:"success",
                                    userLogged:{
                                        firstName: data.firstName,
                                        lastName: data.lastName
                                    }
                                })
                            }
                        })
                        .catch(err => res.status(400).json({error:"Invalid login attempt5!"}))
                }
            })
            .catch(err => res.json({error:"Invalid login attempt4!"}))
    },
    logout: (req,res) => {
        res.clearCookie('usertoken');
        res.json({msg:"logged out"});
    }
}