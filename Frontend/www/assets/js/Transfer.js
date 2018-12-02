var Templates = require("./Templates");
var API = require("./API");
var Utils = require("./Utils");
var vld = require("./Validation");

$cardFrom = $("#cardFrom");

$cardFrom.ready(function () {
    API.getCards(function (err,cards) {
        if(err){
            alert("Couldn't load list of cards'");
        } else {
            if(cards){
                cards.forEach(function(card){
                    card.amount = Utils.getAmount(card.amount);
                });
                showCardsSelect(cards);
            }
        }
    })
});

function showCardsSelect(cards) {
    $cardFrom.html("");
    function showOneCard(card){
        var html_code = Templates.option_one({card:card});
        $cardFrom.append($(html_code));
    }
    cards.forEach(showOneCard)
}

var transferButton = $("#transferButton");
var transferForm = $("#transfer-from");

var amountIsOk = false;
var inputAmount = transferForm.find("#amount");
var errorAmount = transferForm.find("#messageAmount");

var cardToIsOk = false;
var inputCardTo = transferForm.find("#cardTo");
var errorCardTo = transferForm.find("#messageCardTo");

var passwordIsOk = false;
var inputPassword = transferForm.find("#currentPassword");
var errorPassword = transferForm.find("#messagePassword");

var inputCardFrom = transferForm.find("#cardFrom");

transferForm.ready(function () {
    console.log(transferForm);
    inputAmount.on("input",function () {
        checkAmount();
    });

    inputCardTo.on("input",function () {
        checkCardTo();
    });

    inputPassword.on("input",function(){
        checkPassword();
    });
});

function checkPassword(){
    passwordIsOk = vld.fieldValidation(inputPassword, vld.patternPassword, errorPassword, vld.errorMessagePassword);
    console.log(passwordIsOk);
    transferButton.attr('disabled',!(amountIsOk && passwordIsOk && cardToIsOk && inputCardFrom.val()));
}

function checkCardTo(){
    cardToIsOk = vld.fieldValidation(inputCardTo, vld.patternCard, errorCardTo, vld.errorMessageCard);
    console.log(cardToIsOk);
    transferButton.attr('disabled',!(amountIsOk && passwordIsOk && cardToIsOk && inputCardFrom.val()));
}

function checkAmount(){
    amountIsOk = vld.fieldValidation(inputAmount, vld.patternAmount, errorAmount, vld.errorMessageAmount);
    console.log(amountIsOk);
    transferButton.attr('disabled',!(amountIsOk && passwordIsOk && cardToIsOk && inputCardFrom.val()));
}

transferButton.click(function () {
    var money = parseInt(inputAmount.val());
    var moneyOnCard = parseInt(inputCardFrom.val().split(" ")[2]);
    if(money > moneyOnCard){
        alert("Not enough money on chosen card!");
    } else if(inputCardFrom.val()===inputCardTo.val()) {
        alert("The same card entered");
    } else if(money<1){
        alert("The amount should be bigger than 0");
    } else {
        var transferInfo = {
            amount: money,
            cardTo: parseInt(inputCardTo.val()),
            cardFrom: parseInt(inputCardFrom.val().split(" ")[0]),
            password: inputPassword.val()
        };

        API.transfer(transferInfo, function(err,server_data){
            console.log(err);
            console.log(server_data);
            if(err){
                alert("Transfer failed! Check entered information");
            }else{
                console.log(server_data);
                window.location.pathname = '/profile'
            }
        });
    }
});