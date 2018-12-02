//Tel
exports.patternTel = /^[+]{0,1}\d{4,15}$/;
exports.errorMessageTel = "Phone number length should be from 5 to 15";

//Password
exports.patternPassword = /^.{8,}$/;
exports.errorMessagePassword = "Password length should be at least 8";
exports.errorMessagePasswordConf = "Passwords are not equal";

exports.patternName = /^([A-Z])([a-z]+)$/; // /^(([a-zA-Z]+)(\s?)){2,}$/;
exports.errorMessageFirstName = "First name is incorrect";
exports.errorMessageLastName = "Last name is incorrect";

exports.patternCard = /^[0-9]{16}$/;
exports.errorMessageCard = "Card number is incorrect";

exports.patternAmount = /^[0-9]{1,}$/;
exports.errorMessageAmount = "Amount is incorrect";

exports.fieldValidation = function(field,pattern,message,messText){
    if(field.val() && pattern.test(field.val())){
        message.text("");
        field.addClass("ok");
        field.removeClass("error");
        return true;
    }else{
        message.text(messText);
        field.addClass("error");
        field.removeClass("ok");
        return false;
    }
};

exports.checkEqual = function (field1,field2,message,messText) {
    if(field1.val() && field2.val() && field1.val()===field2.val()){
        message.text("");
        field1.addClass("ok");
        field1.removeClass("error");
        return true;
    }else{
        message.text(messText);
        field1.addClass("error");
        field1.removeClass("ok");
        return false;
    }
}