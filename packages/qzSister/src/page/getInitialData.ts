const getInitialData = () => (formIndex?: number) => {
    const initialData: {
        [key: string]: {
            [key: string]: {
                value: string,
                type: string
            }
        }
    } = {};

    let generateForm = (formElement, formIndex) => {
        const inputElements = formElement.querySelectorAll('[data-qzsister]');
        initialData[formIndex] = initialData[formIndex] ?? {};
        inputElements.forEach((inputElement: any) => {
            let qzsisterAttr = inputElement.dataset.qzsister;
            const elemName = inputElement.name;
            const tagName = inputElement.tagName.toLowerCase();
            const inputType = (inputElement.type ?? "").toLowerCase();

            if (qzsisterAttr) {
                if (qzsisterAttr == "check" || qzsisterAttr == "checkbox") {
                    initialData[formIndex][elemName] = {
                        type: "check",
                        value: inputElement.checked
                    };
                } else if (qzsisterAttr == "select") {
                    initialData[formIndex][elemName] = {
                        type: "select",
                        value: inputElement.value
                    };
                } else if (qzsisterAttr == "select2") {
                    initialData[formIndex][elemName] = {
                        type: "select2",
                        value: inputElement.value
                    };
                } else if (qzsisterAttr == "text" || qzsisterAttr == "hidden") {
                    initialData[formIndex][elemName] = {
                        type: "text",
                        value: inputElement.value
                    };
                }
            } else {
                if (tagName == "select") {
                    initialData[formIndex][elemName] = {
                        type: "select",
                        value: inputElement.value
                    };
                } else if (inputType == "text" || !inputType || inputType == "hidden") {
                    initialData[formIndex][elemName] = {
                        type: "text",
                        value: inputElement.value
                    };
                } else if (inputType == "checkbox") {
                    initialData[formIndex][elemName] = {
                        type: "check",
                        value: inputElement.checked
                    };
                }
            }
        });
    }

    const formElements = document.querySelectorAll('form[data-qzsister]');
    let formLoopIndex = 0;
    formElements.forEach((formElement) => {
        if (formIndex) {
            if (formIndex == formLoopIndex) {
                generateForm(formElement, formIndex);
            }
        }
        else {
            generateForm(formElement, formLoopIndex);
        }

        formLoopIndex++;
    })
    return initialData;
};
export default getInitialData;