export namespace healthCheck {
    export interface configuration {
        check ?: {
            [key: string]: () => Promise<void>
        }
    }
}