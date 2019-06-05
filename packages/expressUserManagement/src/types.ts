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
        },
        changeEmail: {
            emailFormatInvalid: string
        },
        changePassword: {
            oldPasswordNotMatch: string,
            confirmError: string
        },
        general: {
            notFound: string,
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
        (context: context, option ?: {
            accessModule: any
        }): (user: loginUserPayload, rememberMe: boolean) => Promise<any>
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
    export interface changeEmail{
        (context: context): (payload: {
            userId: string,
            email: string
        }) => Promise<any>
    }
    export interface changePassword{
        (context: context): (payload: {
            userid: string, 
            oldPassword: string, 
            newPassword: string, 
            confirmPassword: string
        }) => Promise<any>
    }
    export interface resetPassword{
        (context: context): (payload: {
            email: string
        }) => Promise<any>
    }
}
export namespace middleware{
    export interface jwtVerify{
        (option: {
            sessionStore: any,
            appKey: string
        }): (req: any, res: any, next ?: any) => any
    }
}