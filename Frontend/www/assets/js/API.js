var API_URL = window.location.origin;

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

exports.updateUser = function (userInfo,callback) {
    backendPost("/api/update/",userInfo,callback);
};

exports.logoutUser = function (callback) {
    backendGet("/api/logout/", callback);
};

exports.addCard = function (cardInfo,callback) {
    backendPost("/api/addCard/",cardInfo,callback);
};

exports.getCards = function (callback) {
    backendGet("/api/cards/",callback);
};

exports.transfer = function (transferInfo,callback){
    console.log("TRANSFER API");
    backendPost("/api/transfer/",transferInfo,callback);
};

exports.backendGet = backendGet;
exports.backendPost = backendPost;