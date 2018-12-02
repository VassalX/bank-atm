var API = require("./API");
var vld = require("./Validation");

var updateButton = $("#updateButton");
var formSignIn = $(".form-update");

var firstNameIsOk = false;
var updateFirstName = formSignIn.find("#updateFirstName");
var errorFirstName = formSignIn.find("#messageFirstName");

var lastNameIsOk = false;
var updateLastName = formSignIn.find("#updateLastName");
var errorLastName = formSignIn.find("#messageLastName");

var telIsOk = false;
var updateTel = formSignIn.find("#updateTel");
var errorTel = formSignIn.find("#messageTel");

var passwordIsOk = false;
var updatePassword = formSignIn.find("#updatePassword");
var errorPassword = formSignIn.find("#messagePassword");

var CurrentPasswordIsOk = false;
var updateCurrentPassword = formSignIn.find("#currentPassword");
var errorCurrentPassword = formSignIn.find("#messageCurrentPassword");

formSignIn.ready(function () {
    updateFirstName.on("input",function () {
        checkFirstName();
    });

    updateLastName.on("input",function () {
        checkLastName();
    });

    updateTel.on("input",function(){
        checkTel();
    });

    updatePassword.on("input",function(){
        checkPassword();
    });

    updateCurrentPassword.on("input",function(){
        checkCurrentPassword();
    });
});

function fieldIsEmpty(field,message){
    if(!field.val()){
        message.text("");
        field.removeClass("ok");
        field.removeClass("error");
        return true;
    }
}

function oneNotEmpty(){
    return updateFirstName.val() || updateLastName.val() || updateTel.val() || updatePassword.val();
}

function checkFirstName(){
    firstNameIsOk = fieldIsEmpty(updateFirstName,errorFirstName) || vld.fieldValidation(updateFirstName, vld.patternName, errorFirstName, vld.errorMessageFirstName);
    updateButton.attr('disabled',!((firstNameIsOk || lastNameIsOk || telIsOk || passwordIsOk) && CurrentPasswordIsOk && oneNotEmpty()));
}

function checkLastName(){
    lastNameIsOk = fieldIsEmpty(updateLastName,errorLastName) || vld.fieldValidation(updateLastName, vld.patternName, errorLastName, vld.errorMessageLastName);
    updateButton.attr('disabled',!((firstNameIsOk || lastNameIsOk || telIsOk || passwordIsOk) && CurrentPasswordIsOk && oneNotEmpty()));
}

function checkTel(){
    telIsOk = fieldIsEmpty(updateTel,errorTel) || vld.fieldValidation(updateTel, vld.patternTel, errorTel, vld.errorMessageTel);
    updateButton.attr('disabled',!((firstNameIsOk || lastNameIsOk || telIsOk || passwordIsOk) && CurrentPasswordIsOk && oneNotEmpty()));
}

function checkPassword(){
    passwordIsOk = fieldIsEmpty(updatePassword,errorPassword) || vld.fieldValidation(updatePassword, vld.patternPassword, errorPassword, vld.errorMessagePassword);
    updateButton.attr('disabled',!((firstNameIsOk || lastNameIsOk || telIsOk || passwordIsOk) && CurrentPasswordIsOk && oneNotEmpty()));
}

function checkCurrentPassword(){
    CurrentPasswordIsOk = vld.fieldValidation(updateCurrentPassword, vld.patternPassword, errorCurrentPassword, vld.errorMessagePassword);
    updateButton.attr('disabled',!((firstNameIsOk || lastNameIsOk || telIsOk || passwordIsOk) && CurrentPasswordIsOk && oneNotEmpty()));
}

function removeEmptyFields(obj){
    Object.keys(obj).forEach(function (key) {
        if (!obj[key]) {
            delete obj[key];
        }
    });
    return obj;
}

updateButton.click(function () {
    var userInfo = {
        phone: updateTel.val(),
        firstName: updateFirstName.val(),
        lastName: updateLastName.val(),
        password: updatePassword.val(),
        currentPassword: updateCurrentPassword.val()
    };
    API.updateUser(removeEmptyFields(userInfo), function(err,server_data){
        if(err){
            alert("Could not update, check you current password!");
        }else{
            console.log(server_data);
            window.location.pathname = '/profile';
        }
    });
});