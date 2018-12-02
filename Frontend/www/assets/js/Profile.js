var Templates = require("./Templates");
var API = require("./API");
var Utils = require("./Utils");

var functions = $("#functions");
var $cardsList = $("#cards-list");

var topUp = functions.find("#topUp");
var logout = functions.find("#logout");
var settings = functions.find("#settings");
var addCard = functions.find("#addCard");
var transfer = functions.find("#transfer");

$cardsList.ready(function(){
    API.getCards(function(err,cards){
        if(err){
            alert("Couldn't load list of cards");
        } else {
            if(cards){
                cards.forEach(function (card) {
                    card.amount = Utils.getAmount(card.amount);
                });
                showCardsList(cards);
            }
        }
    })
});

function showCardsList(cards){
    $cardsList.html("");

    function showOneCard(card){
        var html_code = Templates.card_one({card: card});
        var $node = $(html_code);

        $node.click(function(){
            //TODO
            console.log("get history");
        });

        $cardsList.append($node);
    }

    cards.forEach(showOneCard);
}

functions.ready(function(){
    topUp.click(function(){
        console.log("top up phone");
        window.location.pathname = '/phone';
    });
    logout.click(function(){
        console.log("logout");
        API.logoutUser(function(err,res){
            if(err){
                alert("Could not logout!");
            } else {
                console.log("logged out");
                window.location.pathname = '/login';
            }
        });
    });
    settings.click(function(){
        console.log("settings");
        window.location.pathname = '/settings';
    });
    addCard.click(function(){
        console.log("addCard");
        API.addCard({kind:"Debit"},function(err,res){
            if(err){
                alert("Couldn't create card!");
            } else {
                location = location;
            }
        })
    });
    transfer.click(function(){
        console.log("transfer");
        window.location.pathname = '/transfer';
    });
    //TODO history
});

