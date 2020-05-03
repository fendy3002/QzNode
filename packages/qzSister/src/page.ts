const deepEqual = require('deep-equal');
const crypto = require('crypto-js');
const getInitialData = require('./page/getInitialData').default;
export interface SyncOption {
    urlToHash?: string
};
export interface SavePayload {
    timestamp: number,
    hasChange: boolean,
    data: {
        [key: string]: {
            value: string,
            type: string
        }
    },
    initialData: {
        [key: string]: {
            value: string,
            type: string
        }
    }
};
const sync = (pageCode, syncOption?: SyncOption) => {
    const urlMd5 = crypto.MD5(syncOption?.urlToHash ?? window.location.pathname);
    const storageCode = "_qzsister_" + pageCode + "_default_" + urlMd5;
    console.log(storageCode);
    let savedDataStr = window.localStorage.getItem(storageCode);
    let savedData: SavePayload = null;
    let watchChange = null;
    let load = null;
    const showConfirmation = () => {
        if (confirm("Load?")) {
            load();
        }
        else {
            watchChange();
        }
    };
    load = () => {
        for (let elemName of Object.keys(savedData.data)) {
            let elemData = savedData.data[elemName];
            const elem: any = document.querySelector(`[name='${elemName}']`);
            if (elemData.type == "text") {
                elem.value = elemData.value;
            } else if (elemData.type == "check") {
                elem.checked = elemData.value;
            } else if (elemData.type == "select") {
                elem.value = elemData.value;
            }
        }

        watchChange();
    };
    if (savedDataStr) {
        savedData = JSON.parse(savedDataStr);
    }
    let savingHandler = null;
    const onSavingData = () => {
        savingHandler = setTimeout(() => {
            console.log(savedData.data, savedData.initialData);
            savedData.hasChange = !deepEqual(savedData.data, savedData.initialData);
            console.log("savedData.hasChange", savedData.hasChange)
            window.localStorage.setItem(storageCode, JSON.stringify(savedData));
            clearTimeout(savingHandler);
        }, 300);
    };
    watchChange = () => {
        const inputElements = document.querySelectorAll('[data-qzsister]');
        const listener = {
            "check": (inputElement) => {
                if (!inputElement.qzsisterWatch) {
                    inputElement.qzsisterWatch = inputElement.addEventListener("change", (evt) => {
                        savedData.data[inputElement.name] = {
                            type: "check",
                            value: inputElement.checked
                        };
                        onSavingData();
                    });
                }
            },
            "select": (inputElement) => {
                if (!inputElement.qzsisterWatch) {
                    inputElement.qzsisterWatch = inputElement.addEventListener("change", (evt) => {
                        savedData.data[inputElement.name] = {
                            type: "select",
                            value: inputElement.value
                        };
                        onSavingData();
                    });
                }
            },
            "select2": (inputElement) => {
                if (!inputElement.qzsisterWatch) {
                    inputElement.qzsisterWatch = inputElement.addEventListener("change", (evt) => {
                        savedData.data[inputElement.name] = {
                            type: "select",
                            value: inputElement.value
                        };
                        onSavingData();
                    });
                }
            },
            "text": (inputElement) => {
                if (!inputElement.qzsisterWatch) {
                    inputElement.qzsisterWatch = inputElement.addEventListener("change", (evt) => {
                        console.log("change");
                        savedData.data[inputElement.name] = {
                            type: "text",
                            value: inputElement.value
                        };
                        onSavingData();
                    });
                }
            }
        };

        inputElements.forEach((inputElement: any) => {
            let qzsisterAttr = inputElement.dataset.qzsister;
            const tagName = inputElement.tagName.toLowerCase();
            const inputType = (inputElement.type ?? "").toLowerCase();
            if (qzsisterAttr) { qzsisterAttr = qzsisterAttr.toLowerCase(); }
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
                if (tagName == "select") {
                    listener.select(inputElement);
                } else if (tagName == "input") {
                    if (inputType == "text" || !inputType || inputType == "hidden") {
                        listener.text(inputElement);
                    } else if (inputType == "checkbox") {
                        listener.check(inputElement);
                    }
                }
            }
        });
    };

    if (savedData) {
        savedData.initialData = getInitialData()();
        savedData.data = {
            ...savedData.initialData,
            ...savedData.data
        };
        savedData.hasChange = !deepEqual(savedData.initialData, savedData.data);

        if (savedData.hasChange) {
            showConfirmation();
        }
        else {
            watchChange();
        }
    } else {
        savedData = {
            data: getInitialData()(),
            hasChange: false,
            initialData: getInitialData()(),
            timestamp: new Date().getTime()
        };
        watchChange();
    }
    return {
        resync: watchChange
    };
};
export {
    sync
};