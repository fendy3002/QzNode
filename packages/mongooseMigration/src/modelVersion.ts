let padVersion = (str) => ('0000' + str).substring(str.length);
export default (version: string) => {
    let semver = version.split(".");
    if (semver.length != 3) {
        throw new Error(version + " is not a valid semantic version");
    }
    let paddedVersion = padVersion(semver[0]) + "." + padVersion(semver[1]) + "." + padVersion(semver[2]);
    return {
        __version: { type: String, default: paddedVersion },
    }
};