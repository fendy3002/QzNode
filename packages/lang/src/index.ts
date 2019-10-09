import lo = require('lodash');

interface LangContent {
    [key: string]: string | LangContent
};
interface LangDictionary{
    [languagecode: string]: LangContent
};
interface LangUseParams{
    [key: string]: string
};

let langUse = (langDictionary: LangContent) => {
    return {
        _: (path: string, ifNull: string, params ?: LangUseParams) => {
            let content = lo.get(langDictionary, path, ifNull);
            if(!params){
                return content;
            }
            for(let key of Object.keys(params)){
                let regexPattern = new RegExp("{" + key + "}", "g");
                content = content.replace(regexPattern, params[key]);
            }
            return content;
        }
    };
};
let langCore = async(initDictionary: LangDictionary) => {
    let langDictionary: LangDictionary = {
        ...initDictionary
    };

    return {
        addLang: (languagecode: string, content: LangContent) => {
            langDictionary[languagecode] = {
                ...langDictionary[languagecode],
                ...content
            };
        },
        use: (languagecode: string) => {
            return langUse(langDictionary[languagecode]);
        }
    };
};

export default langCore;