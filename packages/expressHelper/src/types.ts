export namespace healthCheck {
    export interface configuration {
        check ?: {
            [key: string]: () => Promise<void | any>
        },
        checkTimeout ?: number
    }
}