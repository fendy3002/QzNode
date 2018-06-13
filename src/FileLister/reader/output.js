import fs from 'fs';

var Service = (options) => {
    if(!options.out){
        return (result, callback) => { 
            if(options.pretty){
                console.log(JSON.stringify(result, null, 2));
            }
            else{
                console.log(JSON.stringify(result));
            }
        };
    }
    else{
        return (result, callback) => {
            var fsOption = {
                encoding: "utf8",
                mode: 0o666,
                flag: 'w'
            };

            if(options.mode){ fsOption.mode = options.mode; }
            if(options.encoding){ fsOption.encoding = options.encoding; }
            if(options.flag){ fsOption.flag = options.flag; }
            if(options.pretty){
                fs.writeFile(options.out, JSON.stringify(result, null, 2), fsOption, callback);
            }
            else{
                fs.writeFile(options.out, JSON.stringify(result), fsOption, callback);
            }
        };
    }
};

export default Service;