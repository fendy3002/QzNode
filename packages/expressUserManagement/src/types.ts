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
            registerEmailFail: string,
        },
        changeEmail: {
            emailFormatInvalid: string,
            success: string,
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
    lang: lang,
    redirect: {
        signedIn: string,
        signedOut: string
    },
    render: {
        login: string,
        changePassword: string
    },
    mail: {
        adminResetPassword: (payload: {
            password: string
        }) => Promise<any>,
        resetPasswordRequest: (payload: {
            email: string,
            username: string
        }) => Promise<any>,
        adminRegister: (payload: {
            username: string,
            password: string,
            confirmation: string,
            name: string
        }) => Promise<any>,
        userRegister: (payload: {
            username: string,
            password: string,
            confirmation: string,
            name: string
        }) => Promise<any>,
        changeEmail: (payload: {
            username: string,
            confirmation: string
        }) => Promise<any>
    },
    appKey: string,
    rememberTokenName: string,
    registerNeedConfirmation: string
};
export namespace controller{
    export interface login{
        (context: context): {
            _get: (req: any, res: any, next ?: any) => any,
            _post: (req: any, res: any, next ?: any) => any
        }
    }
    export interface logout{
        (context: context): {
            _get: (req: any, res: any, next ?: any) => any,
        }
    }
    export interface changePassword{
        (context: context): {
            _get: (req: any, res: any, next ?: any) => any,
            _post: (req: any, res: any, next ?: any) => any,
        }
    }
}
export namespace api{
    export interface confirmation{
        (context: context): {
            _get: (req: any, res: any, next ?: any) => any,
        }
    }
    export interface adminResetPassword{
        (context: context): {
            _post: (req: any, res: any, next ?: any) => any,
        }
    }
    export interface adminRegister{
        (context: context): {
            _post: (req: any, res: any, next ?: any) => any,
        }
    }
    export interface adminChangeEmail{
        (context: context): {
            _post: (req: any, res: any, next ?: any) => any,
        }
    }
}
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
        superAdmin: boolean
    }
    export interface register{
        (context: context): (user: registerUserPayload) => Promise<any>
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
    export interface signedIn{
        (context: context): 
            (option: {
                mustSignedIn: boolean
            }) => (req: any, res: any, next ?: any) => any
    }
}