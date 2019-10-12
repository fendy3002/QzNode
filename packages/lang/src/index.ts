import lo = require('lodash');
import * as myType from './types';
export let pack: myType.PackConstructor = (langDictionary: myType.Lang.Content) => {
    let _ = (path: string, ifNull ?: string, params ?: myType.Lang.UseParams) => {
        let content = lo.get(langDictionary, path, ifNull);
        if(!params){
            return content;
        }
        for(let key of Object.keys(params)){
            let regexPattern = new RegExp("{" + key + "}", "g");
            let contentStr = content as string;
            content = contentStr.replace(regexPattern, params[key]);
        }
        return content;
    };
    return {
        _: _,
        get: _,
        part: (path: string) => {
            return pack(lo.get(langDictionary, path) as myType.Lang.Content);
        }
    };
};
export let core: myType.CoreConstructor = async(initDictionary: myType.Lang.Dictionary) => {
    let langDictionary: myType.Lang.Dictionary = {
        ...initDictionary
    };
    let coreInstance: myType.Core = {
        addLang: (languagecode: string, content: myType.Lang.Content) => {
            langDictionary[languagecode] = lo.merge(langDictionary[languagecode], content);
            return coreInstance;
        },
        use: (languagecode: string) => {
            return pack(langDictionary[languagecode]);
        }
    };

    return coreInstance;
};

export {myType as type};

export default core;