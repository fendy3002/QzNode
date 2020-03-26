import padVersion from './padVersion';
export default {
    lower: (version: string) => {
        return {
            __version: {
                $lt: padVersion(version)
            },
        }
    },
    lowerThanEquals: (version: string) => {
        return {
            __version: {
                $lte: padVersion(version)
            },
        }
    },
    custom: (clause) => {
        return {
            __version: clause
        };
    },
    fieldName: "__version"
}