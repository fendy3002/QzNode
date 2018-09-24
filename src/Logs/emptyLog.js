var Service = function(callback = ()=>{} ) {
    var message = function(message){
        callback(null, message);
    };
    var messageln = function(message){
        callback(null, message);
    };
    var object = function(obj){
        callback(null, obj);
    };
    var exception = function(ex){
        callback(null, ex);
    };

    return {
        message,
        messageln,
        object,
        exception
    };
};

module.exports = Service;