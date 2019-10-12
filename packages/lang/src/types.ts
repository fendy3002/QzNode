export namespace Lang {
    export interface Content {
        [key: string]: string | Content
    };
    export interface Dictionary{
        [languagecode: string]: Content
    };
    export interface UseParams{
        [key: string]: string
    };
}

export interface CoreConstructor{
    (initDictionary: Lang.Dictionary): Promise<Core>
};
export interface Core{
    addLang: (languagecode: string, content: Lang.Content) => Core
    use: (languagecode: string) => Pack
};
export interface PackConstructor {
    (langDictionary: Lang.Content): Pack
};
export interface Pack{
    _: (path: string, ifNull ?: string, params ?: Lang.UseParams) => string
    get: (path: string, ifNull ?: string, params ?: Lang.UseParams) => string
    part: (path: string) => Pack
};