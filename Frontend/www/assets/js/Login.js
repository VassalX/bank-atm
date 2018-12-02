var API = require("./API");
var vld = require("./Validation");

var loginButton = $("#loginButton");
var formSignIn = $(".form-signin");

var telIsOk = false;
var inputTel = formSignIn.find("#inputTel");
var errorTel = formSignIn.find("#messageTel");

var passwordIsOk = false;
var inputPassword = formSignIn.find("#inputPassword");
var errorPassword = formSignIn.find("#messagePassword");

formSignIn.ready(function () {
    inputTel.on("input",function(){
        checkTel();
    });

    inputPassword.on("input",function(){
        checkPassword();
    });
});

function checkTel(){
    telIsOk = vld.fieldValidation(inputTel, vld.patternTel, errorTel, vld.errorMessageTel);
    loginButton.attr('disabled',!(telIsOk && passwordIsOk));
}

function checkPassword(){
    passwordIsOk = vld.fieldValidation(inputPassword, vld.patternPassword, errorPassword, vld.errorMessagePassword);
    loginButton.attr('disabled',!(telIsOk && passwordIsOk));
}

loginButton.click(function () {
    var userInfo = {
        phone: inputTel.val(),
        password: inputPassword.val()
    };
    API.loginUser(userInfo, function(err,server_data){
        if(err){
            alert("Could not sign in, check you phone number and password!");
        }else{
            console.log(server_data);
            window.location.pathname = '/profile';
        }
    });
});