import fs from 'fs';

var Service = (options) => {
    if(!options.out){
        return (key, log) => {  };
    }
    else if(options.log){
        return (key, log, callback) => { 
            if(log){
                var data = key + ": ";
                if(typeof log === 'string' || log instanceof String){
                    data += log;
                }
                else{ data+= JSON.stringify(log); }
                fs.writeFile(options.log, data, callback);
            }
            else{
                var data = "";
                if(typeof key === 'string' || key instanceof String){
                    data += key;
                }
                else{ data+= JSON.stringify(key); }
                fs.writeFile(options.log, data, callback);
            }
         };
    }
    else{
        return console.log;
    }
};

export default Service;