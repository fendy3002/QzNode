var Service = function(
    callback: (err:any, message:any) => void
        = (err, message)=> {}
    )
{
    let _data = "";
    var message = function(message){
        _data += message;
        callback(null, message);
    };
    var messageln = function(message){
        _data += message + "\n";
        callback(null, message);
    };
    var object = function(obj){
        _data += JSON.stringify(obj) + "\n";
        callback(null, obj);
    };
    var exception = function(ex){
        _data += ex.toString() + "\n";
        _data += ex.stack + "\n";
        callback(null, ex);
    };
    var clear = function(){
        _data = "";
    };

    return {
        message,
        messageln,
        object,
        exception,
        data: () =>{
            return _data;
        },
        clear
    };
};

export = Service;