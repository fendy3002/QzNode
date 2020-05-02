import crypto = require('crypto-js');
export interface SyncOption {
    urlToHash?: string
};
export interface SavePayload {
    timestamp: number,
    data: {
        [key: string]: {
            value: string,
            type: string
        }
    }
};
const sync = (pageCode, syncOption?: SyncOption) => {
    const showConfirmation = () => {

    };
    const load = () => {

    }
    const urlMd5 = crypto.MD5(syncOption?.urlToHash ?? window.location.pathname);
    const storageCode = "_qzsister_" + pageCode + "_default_" + urlMd5;
    let savedDataStr = window.localStorage.getItem(storageCode);
    let savedData: SavePayload = null;
    if (savedDataStr) {
        savedData = JSON.parse(savedDataStr);

    }
    let savingHandler = null;
    const onSavingData = () => {
        savingHandler = setTimeout(() => {
            window.localStorage.setItem(storageCode, JSON.stringify(savedData));
            clearTimeout(savingHandler);
        }, 300);
    };
    const inputElements = document.querySelectorAll('[data-qzsister]');
    if (!savedData) {
        savedData = {
            data: {},
            timestamp: new Date().getTime()
        };
    }

    const listener = {
        "check": (inputElement) => {
            inputElement.addEventListener("change", (evt) => {
                savedData.data[inputElement.name] = {
                    type: "check",
                    value: inputElement.checked
                };
                onSavingData();
            });
        },
        "select": (inputElement) => {
            inputElement.addEventListener("change", (evt) => {
                savedData.data[inputElement.name] = {
                    type: "select",
                    value: inputElement.value
                };
                onSavingData();
            });
        },
        "select2": (inputElement) => {
            inputElement.addEventListener("change", (evt) => {
                savedData.data[inputElement.name] = {
                    type: "select",
                    value: inputElement.value
                };
                onSavingData();
            });
        },
        "text": (inputElement) => {
            inputElement.addEventListener("change", (evt) => {
                savedData.data[inputElement.name] = {
                    type: "text",
                    value: inputElement.value
                };
                onSavingData();
            });
        }
    };

    inputElements.forEach((inputElement: any) => {
        let qzsisterAttr = inputElement.dataset.qzsister;
        if (qzsisterAttr == "check" || qzsisterAttr == "checkbox") {
            listener.check(inputElement);
            // } else if (qzsisterAttr == "radio") {
            //     inputElement.addEventListener("change", (evt) => {

            //     });
        } else if (qzsisterAttr == "select") {
            listener.select(inputElement);
        } else if (qzsisterAttr == "select2") {
            listener.select2(inputElement);
        } else if (qzsisterAttr == "text" || qzsisterAttr == "hidden") {
            listener.text(inputElement);
        } else if (!qzsisterAttr) {
            if (inputElement.tagName == "select") {
                listener.select(inputElement);
            } else if (inputElement.tagName == "input") {
                if (inputElement.type == "text" || !inputElement.type || inputElement.type == "hidden") {
                    listener.text(inputElement);
                } else if (inputElement.type == "check") {
                    listener.check(inputElement);
                }
            }
        }
    });
};
export {
    sync
};