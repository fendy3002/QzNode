export interface modelType{
    (db: any): any,
    associate: (db: any, model: any) => any
};
export interface lang {
    auth: {
        login: {
            notMatch: string
        }
    }
}
export interface context{
    db: any,
    lang: lang
};
export namespace service{
    export interface loginUserPayload{
        username: string, password: string
    }
    export interface login{
        (context: context): (user: loginUserPayload, rememberMe: boolean) => Promise<any>
    }
}