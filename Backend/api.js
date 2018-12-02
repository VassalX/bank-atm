var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://VassalX:Password1!@atm-1-tnytz.mongodb.net/test?retryWrites=true');
var db = mongoose.connection;
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
});

var TransferSchema = new mongoose.Schema({
    purpose:{
        type: String,
        unique: false,
        required: true,
        trim: true
    },
    amount:{
        type: Number,
        required: true,
        get: getAmount,
        set: setAmount
    },
    card:{
        type: Schema.Types.ObjectId,
        required: true,
        unique: false,
        ref: "Card"
    }
},{timestamps: true});


function getAmount(num){
    return (num/100).toFixed(2);
}

function setAmount(num){
    return num*100;
}

var CardSchema = new mongoose.Schema({
    kind:{
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    amount:{
        type: Number,
        required: true,
        unique: false,
        get: getAmount,
        set: setAmount
    },
    code:{
        type: Number,
        required: true,
        unique: true
    },
    owner:{
        type: Schema.Types.ObjectId,
        required: true,
        unique: false,
        ref: "User"
    }
});

var UserSchema = new mongoose.Schema({
    phone:{
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    firstName:{
        type: String,
        unique: false,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        unique: false,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true
    }
});

UserSchema.statics.authenticate = function (phone, password, callback) {
    User.findOne({ phone: phone })
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            if(bcrypt.compareSync(password, user.password)){
                return callback(null, user);
            } else {
                return callback();
            }
        });
};

UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password'))
        return next();
    var salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password,salt);
    next();
});

UserSchema.pre('updateOne', function (next) {
    var user = this;
    if(user.getUpdate().password) {
        var salt = bcrypt.genSaltSync(10);
        user.getUpdate().password = bcrypt.hashSync(user.getUpdate().password, salt);
        next();
    } else {
        next();
    }
});

var User = mongoose.model('User',UserSchema);
var Card = mongoose.model('Card',CardSchema);
var Transfer = mongoose.model('Transfer',TransferSchema);

exports.registerUser = function(req,res,next) {
    if (req.body.password !== req.body.passwordConf) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    }
    if (req.body.phone &&
        req.body.firstName &&
        req.body.lastName &&
        req.body.password &&
        req.body.passwordConf) {
        var userData = {
            phone: req.body.phone,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password
        };
        //use schema.create to insert data into the db
        User.create(userData, function (err, user) {
            if (err) {
                return next(err)
            } else {
                req.session.userId = user._id;
                getProfile(req,function (e,r) {
                    if(e){
                        return next(err)
                    } else {
                        return res.json(r);
                    }
                });
            }
        });
    }else{
        return next(err);
    }
};

exports.loginUser = function (req,res,next) {
    if (req.body.phone &&
        req.body.password) {
        User.authenticate(req.body.phone,req.body.password, function(error, user){
            if(error || !user){
                var err = new Error("Wrong number or password.");
                err.status = 401;
                return next(err);
            }else{
                req.session.userId = user._id;
                getProfile(req,function (e,r) {
                    if(e){
                        return next(err)
                    } else {
                        return res.json(r);
                    }
                });
            }
        });
    } else {
        var err = new Error("All fields required.");
        err.status = 400;
        return next(err);
    }
};

exports.getHistory = function (req,res) {

};

exports.updateProfile = function (req,res,next) {
    if ((req.body.phone ||
        req.body.firstName ||
        req.body.lastName ||
        req.body.password) &&
        req.body.currentPassword){
        //find user
        getProfile(req,function (err,user) {
            if(err){
                return next(err);
            } else if(!user){
                return next(new Error("User not found!"));
            } else {
                //compare passwords
                if(bcrypt.compareSync(req.body.currentPassword,user.password)){
                    //remove currentPasswordent password from object
                    var userData = req.body;
                    delete userData.currentPassword;
                    //update info
                    User.updateOne(user,userData,function (error,updUser) {
                        if(error){
                            return next(error);
                        } else if(!updUser){
                            return next(new Error("Could not update user"));
                        } else {
                            //get updated user
                            getProfile(req,function (e,r) {
                                if(e){
                                    return next(e)
                                } else {
                                    return res.json(r);
                                }
                            });
                        }
                    });
                } else {
                    return next(new Error("Passwords don't match!"));
                }
            }
        });
    }else{
        var err = new Error("Not all required fields are filled");
        err.status = 400;
        return next(err);
    }
};

exports.transfer = function (req, res, next) {
    if( req.body.amount &&
        req.body.cardTo &&
        req.body.cardFrom &&
        req.body.password){
        //find cardFrom
        console.log("find cardFrom");
        Card.findOne({code:req.body.cardFrom}).exec(function (err,card) {
            if(err){
                return next(err);
            } else if (!card) {
                return next(new Error("Card not found!"));
            } else {
                //check if user is owner of cardFrom
                console.log("check if user is owner of cardFrom");
                console.log(card.owner);
                console.log(req.session.userId);
                if(String(card.owner) === String(req.session.userId)){
                    //check if user exists
                    console.log("check if user exists");
                    getProfile(req,function (error, profile) {
                        if(error){
                            return next(error);
                        } else {
                            console.log("check password");
                            if(bcrypt.compareSync(req.body.password,profile.password)){
                                //check if enough money
                                console.log("check if enough money");
                                if(card.amount >= req.body.amount){
                                    //give money to another user
                                    console.log("give money to another user");
                                    executeTransfer(req,res,next);
                                    return res.json("success!");
                                } else {
                                    return next(new Error("Not enough money!"));
                                }
                            } else {
                                return next(new Error("Incorrect password!"));
                            }
                        }
                    });
                } else {
                    return next(new Error("Not your card!!!"));
                }
            }
        });
    } else {
        next(new Error("All information required"));
    }
    return res;
};

function executeTransfer(req,res,next){
    Card.findOne({code:req.body.cardFrom}).exec(function (err,cardFrom) {
        if(err){
            return next(err);
        } else {
            Card.updateOne({code:req.body.cardTo},{$inc: {amount:req.body.amount}}).exec(function (err,cardTo) {
                if(err){
                    return next(err);
                } else if (!cardTo) {
                    return next(new Error("User to not found"))
                } else {
                    Card.updateOne({code:req.body.cardFrom},{$inc: {amount:(-req.body.amount)}}).exec(function (err,updCardFrom) {
                        if(err){
                            return next(err);
                        } else {
                            return ;
                        }
                    });
                }
            });
        }
    });
    return res;
}

exports.logoutUser = function (req,res,next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if(err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
};

var getProfile = function (req,callback) {
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error || !user) {
                return callback(new Error("Unauthorized user!"));
            } else {
                return callback(null,{
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    password: user.password
                });
            }
        });
};

exports.getProfile = getProfile;

exports.addCard = function (req,res,next) {
    if(req.body.kind){
        User.findById(req.session.userId).exec(function (err,user) {
            if(err || !user){
                return next("Couldn't create card");
            } else {
                var randCode = generateCard();
                var codeData = {
                    kind: req.body.kind,
                    amount: 50,
                    code: randCode,
                    owner: user._id
                };
                Card.create(codeData, function (err, card) {
                    if (err) {
                        return next(err)
                    } else {
                        return res.json(card);
                    }
                });
            }
        });
    } else {
        var err = new Error("card should have type");
        return next(err);
    }
};

exports.getCards = function (req,res,next) {
    Card.find({owner: req.session.userId}).exec(function(err,cards){
        if(err){
            return next(err);
        } else {
            return res.json(cards);
        }
    });
};

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function generateCard() {
    return getRndInteger(1000000000000000,9999999999999999);
}

//module.exports = User;
