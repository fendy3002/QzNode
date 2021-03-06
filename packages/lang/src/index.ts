import lo = require('lodash');
import markdownRaw = require('markdown-it');
import * as myType from './types';

const markdown = new markdownRaw();
export let pack: myType.PackConstructor = (langDictionary: myType.Lang.Content, context: myType.Context) => {
    let getter = (val) => {
        if (context.render == "markdown") {
            return markdown.render(val);
        }
        else {
            return val;
        }
    }
    let _ = (path: string, ifNull?: string, params?: myType.Lang.UseParams) => {
        return getter(text(path, ifNull, params));
    };
    let text = (path: string, ifNull?: string, params?: myType.Lang.UseParams) => {
        let content = lo.get(langDictionary, path, ifNull) as string;
        if (!params) {
            return content;
        }
        for (let key of Object.keys(params)) {
            let regexPattern = new RegExp("{" + key + "}", "g");
            content = content.replace(regexPattern, params[key]);
        }
        return content;
    };
    return {
        _: _,
        get: _,
        text: text,
        part: (path: string) => {
            return pack(lo.get(langDictionary, path) as myType.Lang.Content, context);
        }
    };
};
export let core: myType.CoreConstructor = async (initDictionary: myType.Lang.Dictionary, option: myType.Option) => {
    let langDictionary: myType.Lang.Dictionary = {
        ...initDictionary
    };
    let context: myType.Context = lo.merge({
        render: "default"
    }, option);
    let coreInstance: myType.Core = {
        addLang: (languagecode: string, content: myType.Lang.Content) => {
            langDictionary[languagecode] = lo.merge(langDictionary[languagecode], content);
            return coreInstance;
        },
        use: (languagecode: string) => {
            return pack(langDictionary[languagecode], context);
        }
    };

    return coreInstance;
};

export { myType as type };

export default core;