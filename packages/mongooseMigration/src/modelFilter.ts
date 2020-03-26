import padVersion from './padVersion';
export default (version: string) => {
    return {
        __version: {
            $lt: padVersion(version)
        },
    }
};