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
        changeActive: {
            success: string,
        },
        changeSuperAdmin: {
            success: string
        },
        resendConfirmation: {
            success: string
        },
        resetPassword: {
            success: string,
            mailFailSend: string
        },
        setRole: {
            success: string
        },
        general: {
            notFound: string,
        }
    }
};
export interface authPayload{
    id: string,
};
export interface accessModule{
    [module: string]: {
        [access: string]: {
            display: string
        }
    }
};

export interface context{
    db: any,
    lang: lang,
    auth: (req: any, res: any) => Promise<authPayload|null>,
    path: {
        auth: string,
        userApi: string,
        userConfirmApi: string,
        roleApi: string
    },
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
            email: string,
            name: string
        }) => Promise<any>,
        userRegister: (payload: {
            username: string,
            password: string,
            confirmation: string,
            email: string,
            name: string
        }) => Promise<any>,
        changeEmail: (payload: {
            username: string,
            confirmation: string
        }) => Promise<any>,
        resendConfirmation: (payload: {
            username: string,
            name: string,
            confirmation: string
        }) => Promise<any>
    },
    accessModule: accessModule,
    appPublicKey: string,
    appPrivateKey: string,
    rememberTokenName: string,
    registerNeedConfirmation: boolean,
    sessionStore: any
};
export interface initContext{
    db: any,
    lang ?: lang,
    auth: (req: any, res: any) => Promise<authPayload|null>,
    path ?: {
        auth? : string,
        userApi? : string,
        userConfirmApi? : string,
        roleApi? : string
    },
    redirect ?: {
        signedIn: string,
        signedOut: string
    },
    render ?: {
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
            email: string,
            name: string
        }) => Promise<any>,
        userRegister: (payload: {
            username: string,
            password: string,
            confirmation: string,
            email: string,
            name: string
        }) => Promise<any>,
        changeEmail: (payload: {
            username: string,
            confirmation: string
        }) => Promise<any>,
        resendConfirmation: (payload: {
            username: string,
            name: string,
            confirmation: string
        }) => Promise<any>
    },
    accessModule ?: accessModule,
    appPublicKey: string,
    appPrivateKey: string,
    rememberTokenName ?: string,
    registerNeedConfirmation ?: boolean,
    sessionStore: any
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
            _post: (req: any, res: any, next ?: any) => any,
        }
    }
    export interface userManagement{
        (context: context): {
            get: (req: any, res: any, next ?: any) => any,
            current: (req: any, res: any, next ?: any) => any,
            list: (req: any, res: any, next ?: any) => any,
            changeEmail: (req: any, res: any, next ?: any) => any,
            register: (req: any, res: any, next ?: any) => any,
            resetPassword: (req: any, res: any, next ?: any) => any,
            active: (req: any, res: any, next ?: any) => any,
            superAdmin: (req: any, res: any, next ?: any) => any,
            confirmation: (req: any, res: any, next ?: any) => any,
            setRole: (req: any, res: any, next ?: any) => any,
        }
    }
    export interface role{
        (context: context): {
            _get: (req: any, res: any, next ?: any) => any,
            _post: (req: any, res: any, next ?: any) => any,
        }
    }
}
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
            appPublicKey: string,
        }): (req: any, res: any, next ?: any) => any
    }
    export interface signedIn{
        (context: context): 
            (option: {
                mustSignedIn: boolean
            }) => (req: any, res: any, next ?: any) => any
    }
}