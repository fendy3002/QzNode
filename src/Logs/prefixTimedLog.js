let moment = require('moment');

var Service = function(log, options) {
    var _ = {
        prefix: '',
        format: 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]',
        date: () => moment().utc(),
        ...options
    };

    var prefix = () => _.prefix + " " + _.date().format(_.format);

    var message = function(message){
        log.message(prefix() + " " + message);
    };
    var messageln = function(message){
        log.messageln(prefix() + " " + message);
    };
    var object = function(obj){
        log.message(prefix() + " ");
        log.object(obj);
    };
    var exception = function(ex){
        log.message(prefix() + " ");
        log.exception(ex);
    };

    return {
        _,
        message,
        messageln,
        object,
        exception
    };
};

module.exports = Service;