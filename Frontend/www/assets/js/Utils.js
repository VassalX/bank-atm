exports.getAmount = function(num){
    return (num/100).toFixed(2);
};

exports.setAmount = function(num){
    return num*100;
};