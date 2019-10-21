import generate from './generate';
let idPlaceholder = (len: string) => {
    return "{{id}}";
};
interface handlePayload {
    sql: string,
    regex: string
};
interface handleFunc {
    (payload: handlePayload): Promise<number>
};
export default async (format: string, handle: handleFunc) => {
    let preformatTemplate = await generate(format, {
        _id: idPlaceholder
    });
    let regexFormat = await generate(preformatTemplate, {
        "id": "(\\d*)"
    });
    regexFormat = regexFormat.replace().replace(/\//gm, '\\\/');
    let handlePayload = {
        regex: regexFormat,
        sql: await generate(preformatTemplate, {
            "id": "%"
        }),
    };

    let nextId = await handle(handlePayload);
    return generate(format, {
        _id: (num) => nextId.toString().padStart(num, "0")
    });
};