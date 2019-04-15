
export interface storeContext{
    config: {
        apiPath: {
            getUsers: string,
            changeEmail: string
        },
        headers: {
            [key: string]: any
        }
    }
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