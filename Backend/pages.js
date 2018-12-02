var api = require("./api");

exports.loginPage = function(req, res) {
    res.render('login', {
        pageTitle: 'BANK - Sign in'
    });
};

exports.registerPage = function(req, res) {
    res.render('register', {
        pageTitle: 'BANK - Sign up'
    });
};

exports.historyPage = function(req, res) {
    //TODO hard
    res.render('history', {
        pageTitle: 'BANK - History',
        user: user
    });
};

exports.phonePage = function(req, res) {
    api.getProfile(req,function (err,user) {
        if(err){
            res.redirect("/login");
        } else {
            res.render('phone', {
                pageTitle: 'BANK - Top up phone',
                user: user
            });
        }
    });

};

exports.profilePage = function(req, res) {
    api.getProfile(req,function (err,user) {
        if(err){
            res.redirect("/login");
        } else {
            res.render('profile', {
                pageTitle: 'BANK - Profile',
                user: user
            });
        }
    });
};

exports.settingsPage = function(req, res) {
    api.getProfile(req,function (err,user) {
        if(err){
            res.redirect("/login");
        } else {
            res.render('settings', {
                pageTitle: 'BANK - Settings',
                user: user
            });
        }
    });
};

exports.transferPage = function(req, res) {
    api.getProfile(req,function (err,user) {
        if(err){
            res.redirect("/login");
        } else {
            res.render('transfer', {
                pageTitle: 'BANK - Transfer',
                user: user
            });
        }
    });
};