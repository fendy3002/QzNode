export namespace healthCheck {
    interface checkHandler {
        (
            req: any,
            res: any
        ): Promise<void | any>
    }
    export interface configuration {
        check?: {
            [key: string]: checkHandler
        },
        checkTimeout?: number
    }
}

export namespace filterParser {
    export interface filterObj {
        propertyName: string,
        operation: string,
        value: string | Date | number
    }
}