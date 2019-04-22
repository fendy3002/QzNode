
export interface storeContextConfig{
    apiPath: {
        getUsers: string,
        getRoles: string,
        getUser: string,
        changeEmail: string,
        changeSuperAdmin: string,
        changeActive: string,
        resetPassword: string,
        resendConfirmation: string,
        register: string,
        getCurrentUser: string
    },
    headers: {
        [key: string]: any
    },
    handle: {
        resError: (err, res) => Promise<{
            message: string
        }>
    },
    root: string
};
export interface storeContext{
    config: storeContextConfig
};
export interface store{
    context: storeContext,
    initialize: () => Promise<any>,
    loading: (callback: (done: () => void) => void) => void,
    setPage: (page: string) => void
};
export interface listStore {
    store : store,
    loadUsers: () => Promise<any>
};
export interface createStore {
    store : store
};
export interface roleStore {
    store : store,
    userId: string,
    loadRoles: () => Promise<any>,
    loadUser: () => Promise<any>,
};
