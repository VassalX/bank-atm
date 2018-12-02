var API = require("./API");
var vld = require("./Validation");

var registerButton = $("#registerButton");
var formSignIn = $(".form-signup");

var firstNameIsOk = false;
var inputFirstName = formSignIn.find("#inputFirstName");
var errorFirstName = formSignIn.find("#messageFirstName");

var lastNameIsOk = false;
var inputLastName = formSignIn.find("#inputLastName");
var errorLastName = formSignIn.find("#messageLastName");

var telIsOk = false;
var inputTel = formSignIn.find("#inputTel");
var errorTel = formSignIn.find("#messageTel");

var passwordIsOk = false;
var inputPassword = formSignIn.find("#inputPassword");
var errorPassword = formSignIn.find("#messagePassword");

var passwordConfIsOk = false;
var inputPasswordConf = formSignIn.find("#inputPasswordConf");
var errorPasswordConf = formSignIn.find("#messagePasswordConf");

formSignIn.ready(function () {
    inputFirstName.on("input",function () {
        checkFirstName();
    });

    inputLastName.on("input",function () {
        checkLastName();
    });

    inputTel.on("input",function(){
        checkTel();
    });

    inputPassword.on("input",function(){
        checkPassword();
    });

    inputPasswordConf.on("input",function(){
        checkPasswordConf();
    });
});

function checkFirstName(){
    firstNameIsOk = vld.fieldValidation(inputFirstName, vld.patternName, errorFirstName, vld.errorMessageFirstName);
    registerButton.attr('disabled',!(firstNameIsOk && lastNameIsOk && telIsOk && passwordIsOk && passwordConfIsOk));
}

function checkLastName(){
    lastNameIsOk = vld.fieldValidation(inputLastName, vld.patternName, errorLastName, vld.errorMessageLastName);
    registerButton.attr('disabled',!(firstNameIsOk && lastNameIsOk && telIsOk && passwordIsOk && passwordConfIsOk));
}

function checkTel(){
    telIsOk = vld.fieldValidation(inputTel, vld.patternTel, errorTel, vld.errorMessageTel);
    registerButton.attr('disabled',!(firstNameIsOk && lastNameIsOk && telIsOk && passwordIsOk && passwordConfIsOk));
}

function checkPassword(){
    passwordIsOk = vld.fieldValidation(inputPassword, vld.patternPassword, errorPassword, vld.errorMessagePassword);
    registerButton.attr('disabled',!(firstNameIsOk && lastNameIsOk && telIsOk && passwordIsOk && passwordConfIsOk));
}

function checkPasswordConf(){
    passwordConfIsOk = vld.checkEqual(inputPasswordConf, inputPassword, errorPasswordConf, vld.errorMessagePasswordConf)
    registerButton.attr('disabled',!(firstNameIsOk && lastNameIsOk && telIsOk && passwordIsOk && passwordConfIsOk));
}

registerButton.click(function () {
    var userInfo = {
        phone: inputTel.val(),
        firstName: inputFirstName.val(),
        lastName: inputLastName.val(),
        password: inputPassword.val(),
        passwordConf: inputPasswordConf.val()
    };
    API.registerUser(userInfo, function(err,server_data){
        if(err){
            alert("Could not sign up! The phone number might have been taken");
        }else{
            console.log(server_data);
            window.location.pathname = '/profile'
        }
    });
});