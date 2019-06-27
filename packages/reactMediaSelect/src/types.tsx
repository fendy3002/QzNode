export interface context {
    config: {
        fileAction: {
            submit ?: {
                label: string,
                handler: (fileInfo: string) => any
            },
            cancel ?: {
                label: string,
                handler: () => any
            }
        },
        apiPath: {
            browse: string,
            fileInfo: string,
            content: string,
            newFolder: string,
            upload: string,
            delete: string
        },
        headers: {
            authorization?: string
        },
        fieldName: {
            upload: {
                fileInput: string
            },
            newFolder: {
                folderNameInput: string
            },
            delete: {
                withContent: string
            }
        },
        access: {
            deleteFile: boolean,
            deleteFolder: boolean,
            deleteEmptyFolder: boolean
        },
        defaultOverwrite: boolean
    }
};