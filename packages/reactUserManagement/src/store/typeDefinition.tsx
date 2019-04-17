
export interface storeContextConfig{
    apiPath: {
        getUsers: string,
        getUser: string,
        changeEmail: string,
        register: string
    },
    headers: {
        [key: string]: any
    }
};
export interface storeContext{
    config: storeContextConfig
};
export interface store{
    context: storeContext,
    initialize: () => Promise<void>,
    loading: (callback: (done: () => void) => void) => void,
    setPage: (page: string) => void
};
export interface listStore {
    store : store,
    loadUsers: () => Promise<any>
};