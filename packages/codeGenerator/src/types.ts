export namespace Mongo {
    export interface Field {
        Name: string,
        Type: string,
        Properties ?: {
            [key: string]: Field
        },
        Required: boolean,
        Gui ?: {
            Name: string,
            Type: string,
            Required: boolean,
            Label: string
        }
    };
    
    export interface Model {
        Name: string,
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

export interface Route {
    Module: {
        Code: string,
        UrlPrefix: string,
        Title: string,
        
    }
}