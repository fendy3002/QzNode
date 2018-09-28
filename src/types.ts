export interface MySqlDbConnection{
    host: string,
    username: string,
    password: string,
    db: string,
    port: string,
};
export interface PromiseCallback<T> {
    (resolve: (param?: T) => void, reject: (param?: T) => void): void
};