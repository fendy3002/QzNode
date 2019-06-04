export interface modelType{
    (db: any): any,
    associate: (db: any, model: any) => any
};
export interface lang {
    auth: {
        login: {
            notMatch: string
        },
        register: {
            confirmError: string,
            exists: string,
            usernameFormat: string,
            emailFormat: string,
            registerSuccess: string,
            registerNoConfirmation: string,
            registerEmailFail: string,
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
    export interface registerUserPayload{
        name: string, 
        username: string, 
        email: string, 
        password: string, 
        confirm: string, 
        superAdmin: boolean
    }
    export interface register{
        (context: context, option ?: {
            needEmailConfirmation: boolean
        }): (user: registerUserPayload) => Promise<any>
    }
}