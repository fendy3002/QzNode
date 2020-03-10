let trimVersion = (str) => str.replace(/^0+/, '') || "0";
export default (version) => {
    let semver = version.split(".");
    if (semver.length != 3) {
        throw new Error(version + " is not a valid semantic version");
    }
    return trimVersion(semver[0]) + "." + trimVersion(semver[1]) + "." + trimVersion(semver[2]);
};