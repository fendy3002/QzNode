import generate from './generate';
let idPlaceholder = (len: string) => {
    return "{{id}}";
};
interface handlePayload {
    sql: string,
    regex: string,
    prefix: string,
    suffix: string
};
interface handleFunc {
    (payload: handlePayload): Promise<number>
};
interface option{
    data ?: any
};
export default async (format: string, handle: handleFunc, option ?: option) => {
    let data = option ? option.data : null;

    let preformatTemplate = await generate(format, {
        _id: idPlaceholder,
        ...data
    });

    let prefix = preformatTemplate.substring(
        0, 
        preformatTemplate.indexOf("{{id}}")
    );
    let suffix = preformatTemplate.substring(
        prefix.length + 6
    );

    let regexFormat = await generate(preformatTemplate, {
        "id": "(\\d*)"
    });
    regexFormat = regexFormat.replace().replace(/\//gm, '\\\/');
    let handlePayload = {
        regex: regexFormat,
        sql: await generate(preformatTemplate, {
            "id": "%"
        }),
        prefix,
        suffix
    };
    
    let nextId = await handle(handlePayload);
    return generate(format, {
        _id: (num) => nextId.toString().padStart(num, "0"),
        ...data
    });
};