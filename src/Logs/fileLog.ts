let fs = require('fs');
let lo = require('lodash');

var Service = function(
    filepath,
    callback: (err:any, message:any) => void
        = (err, message)=> {}
    )
{
    var _ = {
        fs: fs,
        encoding: "utf8",
        done: () => {},
        pendings: []
    };
    var message = function(message){
        onProcess((done) => {
            _.fs.appendFile(filepath, message, _.encoding, (err) => {
                if(err) { callback(err, message); }
                else { callback(null, message); }

                done();
            });
        });
    };
    var messageln = function(msg){
        message(msg + "\n");
    };
    var object = function(obj){
        message(JSON.stringify(obj, null, 2) + "\n");
    };
    var exception = function(ex){
        var msg = ex.toString() + "\n" + ex.stack;
        message(msg + "\n");
    };

    var onProcess = function(callback){
        var process = { done: false };
        _.pendings.push(process);

        ((process) => {
            var onDone = () => {
                process.done = true;
                if(lo.filter(_.pendings, (process) => !process.done).length == 0){
                    _.done();
                }
            };
            callback(onDone);
        })(process);
    };

    var onDone = function(cb){
        _.done = cb;

        return lo.filter(_.pendings, (process) => !process.done).length == 0;
    };

    return {
        _,
        onDone,
        message,
        messageln,
        object,
        exception
    };
};

export = Service;