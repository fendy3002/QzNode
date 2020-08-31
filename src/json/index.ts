export const safeParse = (value: string) => {
    try {
        return JSON.parse(value);
    } catch (ex) {
        return null;
    }
};