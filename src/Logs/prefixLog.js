var Service = function(log, options) {
    var _ = {
        prefix: '',
        ...options
    };

    var prefix = () => _.prefix;

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

export default Service;