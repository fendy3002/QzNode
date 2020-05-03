const deepEqual = require('deep-equal');
const crypto = require('crypto-js');
const moment = require('moment').default;
const getInitialDataRaw = require('./page/getInitialData').default;
export interface SyncOption {
    urlToHash?: string,
    expire?: number,
    loadMode ?: string
};
export interface SavePayload {
    timestamp: number,
    hasChange: boolean,
    data: {
        [key: string]: {
            [key: string]: {
                value: string,
                type: string
            }
        }
    },
    initialData: {
        [key: string]: {
            [key: string]: {
                value: string,
                type: string
            }
        }
    }
};
const sync = (pageCode, syncOption?: SyncOption) => {
    const getInitialData = getInitialDataRaw();
    const urlMd5 = crypto.MD5(syncOption?.urlToHash ?? window.location.pathname);
    const storageCode = "_qzsister_" + pageCode + "_default_" + urlMd5;
    let savedDataStr = window.localStorage.getItem(storageCode);
    let savedData: SavePayload = null;
    let watchChange = null;
    let load = null;
    const showConfirmation = () => {
        if (confirm(`An unfinished modification from ${moment(savedData.timestamp).fromNow()} is detected, do you want to recover?`)) {
            load();
        }
        else {
            watchChange();
        }
    };
    load = () => {
        for (let formIndex of Object.keys(savedData.data)) {
            let formData = savedData.data[formIndex];
            let form = document.querySelectorAll('form[data-qzsister]')[formIndex];
            for (let elemName of Object.keys(formData)) {
                let elemData = formData[elemName];
                const elem: any = form.querySelector(`[name='${elemName}']`);
                if (elemData.type == "text") {
                    elem.value = elemData.value;
                } else if (elemData.type == "check") {
                    elem.checked = elemData.value;
                } else if (elemData.type == "select") {
                    elem.value = elemData.value;
                }
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
            savedData.hasChange = !deepEqual(savedData.data, savedData.initialData);
            savedData.timestamp = new Date().getTime();
            window.localStorage.setItem(storageCode, JSON.stringify(savedData));
            clearTimeout(savingHandler);
        }, 300);
    };
    watchChange = () => {
        const formElements = document.querySelectorAll('form[data-qzsister]');
        let formIndex = 0;
        formElements.forEach((formElement) => {
            let currentFormIndex = formIndex;
            savedData.data[formIndex] = savedData.data[formIndex] ?? {};
            formElement.addEventListener("submit", (evt) => {
                savedData.data[currentFormIndex] = getInitialData(currentFormIndex);
                onSavingData();
            });
            const inputElements = formElement.querySelectorAll("[data-qzsister]");
            const listener = {
                "check": (inputElement) => {
                    if (!inputElement.qzsisterWatch) {
                        inputElement.qzsisterWatch = inputElement.addEventListener("change", (evt) => {
                            savedData.data[currentFormIndex][inputElement.name] = {
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
                            console.log(savedData.data);
                            console.log(formIndex);
                            savedData.data[currentFormIndex][inputElement.name] = {
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
                            savedData.data[currentFormIndex][inputElement.name] = {
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
                            savedData.data[currentFormIndex][inputElement.name] = {
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
            formIndex++;
        })
    };

    if (savedData) {
        savedData.initialData = getInitialData();
        savedData.data = {
            ...savedData.initialData,
            ...savedData.data
        };
        savedData.hasChange = !deepEqual(savedData.initialData, savedData.data);

        const expire = (syncOption?.expire ?? 3 * 24 * 60 * 60 * 1000); // default 3 days
        if (savedData.hasChange && savedData.timestamp > new Date().getTime() - expire) {
            showConfirmation();
        }
        else {
            watchChange();
        }
    } else {
        savedData = {
            data: getInitialData(),
            hasChange: false,
            initialData: getInitialData(),
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