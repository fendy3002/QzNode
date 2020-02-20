export namespace Mongo {
    export interface Field {
        Name: string,
        Type: string,
    };
    
    export interface Model {
        _idType: string,
        Fields: [Field],
        Uniques: [{
            Fields: [{
                Name: string,
                Ascending: boolean
            }]
        }]
    };
};

export interface BaseRoute {
    Module: {
        Code: string,
        UrlPrefix: string,
        Title: string,
        
    }
}