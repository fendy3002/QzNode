export namespace Mongo {
    export interface Field {
        Name: string,
        Type: string,
        Properties ?: [Field],
        Required: boolean,
        Gui ?: {
            Name: string,
            Type ?: string,
            Label ?: string
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