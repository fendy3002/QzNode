import padVersion from './padVersion';
export default (version: string) => {
    return {
        __version: { type: String, default: padVersion(version) },
    }
};