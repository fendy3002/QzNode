
export interface storeContextConfig{
    apiPath: {
        getUsers: string,
        getRoles: string,
        getUser: string,
        changeEmail: string,
        changeSuperAdmin: string,
        changeActive: string,
        changeRole: string,
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
    urlRouter: any,

    mode: {
        name: string,
        store ?: any,
    },
    initialize: () => Promise<any>,
    loading: (callback: (done: () => void) => void) => void,
    setPage: (page: string) => Promise<any>
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
    selectedRoles: any[],
    user: any,
    loadRoles: () => Promise<any>,
    loadUser: () => Promise<any>,
};
