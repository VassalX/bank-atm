(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var API_URL = "http://localhost:5050";

function backendGet(url, callback) {
    $.ajax({
        url: API_URL + url,
        type: 'GET',
        success: function(data){
            callback(null, data);
        },
        error: function() {
            callback(new Error("Ajax Failed"));
        }
    })
}

function backendPost(url, data, callback) {
    $.ajax({
        url: API_URL + url,
        type: 'POST',
        contentType : 'application/json',
        data: JSON.stringify(data),
        success: function(data){
            callback(null, data);
        },
        error: function() {
            callback(new Error("Ajax Failed"));
        }
    })
}

exports.loginUser = function(userInfo, callback) {
    backendPost("/api/login/", userInfo, callback);
};

exports.registerUser = function(userInfo, callback) {
    backendPost("/api/register/", userInfo, callback);
};

exports.createOrder = function(order_info, callback) {
    backendPost("/api/create-order/", order_info, callback);
};

},{}],2:[function(require,module,exports){
var API = require("./API");

var telIsOk = false;
var passwordIsOk = false;

var loginButton = $("#loginButton");
var inputTel = $("#inputTel");
var inputPassword = $("#inputPassword");

var patternTel = /^[+]{0,1}\d{4,15}$/;
var patternPassword = /^.{8,}$/;

var errorTel = $("#errorTel");
var errorPassword = $("#errorPassword");

var errorMessageTel = "Phone number length should be from 5 to 15";
var errorMessagePassword = "Password length should be at least 8";

$(".form-signin").ready(function () {
    inputTel.on("input",function(){
        checkTel();
    });

    inputPassword.on("input",function(){
        checkPassword();
    });
});

function checkTel(){
    telIsOk = fieldValidation(inputTel, patternTel, errorTel, errorMessageTel);
    loginButton.attr('disabled',!(telIsOk && passwordIsOk));
}

function checkPassword(){
    telIsOk = fieldValidation(inputPassword, patternPassword, errorPassword, errorMessagePassword);
    loginButton.attr('disabled',!(telIsOk && passwordIsOk));
}

function fieldValidation(field,pattern,message,messText){
    if(field.val()){
        if(pattern.test(field.val())){
            message.text("");
            field.addClass("ok");
            field.removeClass("error");
            return true;
        }else{
            message.text(messText);
            field.addClass("error");
            field.removeClass("ok");
        }
    }else{
        message.text("This field can't be empty!");
        field.addClass("error");
        field.removeClass("ok");
    }
    return false;
}

loginButton.click(function () {
    var userInfo = {
        phone: inputTel.val(),
        password: inputTel.val()
    };
    API.loginUser(userInfo, function(err,server_data){
        if(err){
            alert("Could not sign in, check you phone number and password!");
            return callback(err);
        }
    });
});
},{"./API":1}],3:[function(require,module,exports){

$(function () {
    var Login = require("./Login.js");
});
},{"./Login.js":2}]},{},[3]);
