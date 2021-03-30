export default (min: number, max: number) => {
    return Math.min(
        Math.random() * (max - min + 1) + min,
        max);
};