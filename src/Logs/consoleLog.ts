import * as types from '../types';

var Service: types.Logs.ConsoleLogService = function(
    callback = (err, message) => {}
)
{
    var _ = {
        stdout: process.stdout
    };

    var message = function(message){
        _.stdout.write(message);
        callback(null, message);
    };
    var messageln = function(message){
        _.stdout.write(message + "\n");
        callback(null, message);
    };
    var object = function(obj){
        _.stdout.write(JSON.stringify(obj, null, 2) + "\n");
        callback(null, obj);
    };
    var exception = function(ex){
        _.stdout.write(ex.toString());
        _.stdout.write(ex.stack);
        callback(null, ex);
    };

    return {
        _,
        message,
        messageln,
        object,
        exception,
    };
};

export = Service;