import * as types from '../types';

var Service: types.Logs.EmptyLogService = function(
    callback = (err, message)=> {}
)
{
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

export = Service;