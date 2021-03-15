import changeCase = require('change-case');
export default async (schema) => {
    return {
        name: "GroupSupplement",
        data: () => {
            let result = [];
            for (let field of schema.Model.Fields) {
                if (field.Gui && field.Gui.Supplement) {
                    let fieldSupplement = field.Gui.Supplement;
                    let supplement = result.filter(k => k.ModelName == fieldSupplement.ModelName)[0];
                    if (!supplement) {
                        result.push({
                            ModelName: fieldSupplement.ModelName,
                            Pair: {
                                [field.Name]: {
                                    key: fieldSupplement.Key,
                                    value: fieldSupplement.Value
                                }
                            }
                        });
                    }
                    else {
                        supplement.Pair[field.Name] = {
                            key: fieldSupplement.Key,
                            value: fieldSupplement.Value
                        };
                    }
                }
            }
            return result;
        }
    }
};