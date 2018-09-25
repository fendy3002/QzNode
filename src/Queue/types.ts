export interface Connection {
    host: string,
    database: string,
    port: string,
    user: string,
    password: string
}
export interface LogLevel {
    start: boolean,
    error: boolean,
    done: boolean,
    scriptNotFound: boolean,
    workerLimit: boolean,
    noJob: boolean
}
export interface Job {
    run_script: string
}