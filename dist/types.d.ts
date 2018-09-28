declare namespace qz {
    interface MySqlDbConnection {
        host: string;
        username: string;
        password: string;
        db: string;
        port: string;
    }
    interface PromiseCallback<T> {
        (resolve: (param?: T) => void, reject: (param?: T) => void): void;
    }
}
export = qz;
