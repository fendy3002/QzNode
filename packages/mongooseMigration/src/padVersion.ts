let padVersion = (str) => ('0000' + str).substring(str.length);
export default (version) => {
    let semver = version.split(".");
    if (semver.length != 3) {
        throw new Error(version + " is not a valid semantic version");
    }
    return padVersion(semver[0]) + "." + padVersion(semver[1]) + "." + padVersion(semver[2]);
};