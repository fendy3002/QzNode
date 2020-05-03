const getInitialData = () => () => {
    const inputElements = document.querySelectorAll('[data-qzsister]');
    const initialData: {
        [key: string]: {
            value: string,
            type: string
        }
    } = {};
    inputElements.forEach((inputElement: any) => {
        let qzsisterAttr = inputElement.dataset.qzsister;
        const elemName = inputElement.name;
        const tagName = inputElement.tagName.toLowerCase();
        const inputType = (inputElement.type ?? "").toLowerCase();

        if (qzsisterAttr) {
            if (qzsisterAttr == "check" || qzsisterAttr == "checkbox") {
                initialData[elemName] = {
                    type: "check",
                    value: inputElement.checked
                };
            } else if (qzsisterAttr == "select") {
                initialData[elemName] = {
                    type: "select",
                    value: inputElement.value
                };
            } else if (qzsisterAttr == "select2") {
                initialData[elemName] = {
                    type: "select2",
                    value: inputElement.value
                };
            } else if (qzsisterAttr == "text" || qzsisterAttr == "hidden") {
                initialData[elemName] = {
                    type: "text",
                    value: inputElement.value
                };
            }
        } else {
            if (tagName == "select") {
                initialData[elemName] = {
                    type: "select",
                    value: inputElement.value
                };
            } else if (inputType == "text" || !inputType || inputType == "hidden") {
                initialData[elemName] = {
                    type: "text",
                    value: inputElement.value
                };
            } else if (inputType == "checkbox") {
                initialData[elemName] = {
                    type: "check",
                    value: inputElement.checked
                };
            }
        }
    });
    return initialData;
};
export default getInitialData;