const { createBrowserHistory } = require('history');
const lo = require('lodash');
const routington = require('routington');
const router = routington();

interface route {
    label: string,
    path: string | string[],
    data?: any,
    callback?: (data: changePayload) => Promise<any>
};

interface changePayload {
    route?: route,
    location: any,
    routeParam?: any,
    queryParam: any,
    hash?: string
}
interface initPayload {
    routes: route[],
    option?: {
        root: string,
        event: {
            historyChange: (data: changePayload) => Promise<any>
        }
    }
};

const urlSearchParamsToJSON = (urlParam) => {
    let result: any = {};
    for (let pair of urlParam.entries()) {
        if (!result[pair[0]]) {
            result[pair[0]] = pair[1];
        }
        else {
            if (!Array.isArray(result[pair[0]])) {
                result[pair[0]] = [result[pair[0]]];
            }
            result[pair[0]].push(pair[1]);
        }
    }
    return result;
};
const getUrl = (location, root) => {
    return ("/" + location.replace(root, "")).replace(/\/\//gi, "/").padEnd(0, "/");
}
const defaultOption = {
    root: "",
    event: {
        historyChange: null
    }
};
const urlRouter = (init: initPayload) => {
    const { routes, option } = init;
    const useOption = lo.merge(defaultOption, option);

    for (let eachRoute of routes) {
        const paths = Array.isArray(eachRoute.path) ? eachRoute.path : [eachRoute.path];
        for (let eachPath of paths) {
            let definedRoute = router.define(eachPath.padEnd(0, "/"));
            definedRoute[0].label = eachRoute.label;
        }
    }

    const browserHistory = createBrowserHistory({
        basename: useOption.root
    });

    const onChange = (location) => {
        const changePayload: changePayload = {
            location: location,
            queryParam: urlSearchParamsToJSON(new URLSearchParams(location.search)),
            hash: location.hash
        };

        let routeMatch = router.match(getUrl(location.pathname, useOption.root));
        if (routeMatch) {
            let label = routeMatch.node.label;
            changePayload.route = routes.find(k => k.label == label);
            changePayload.routeParam = routeMatch.param;
        }
        let process = Promise.resolve();
        if (changePayload.route && changePayload.route.callback) {
            process = process.then(() => changePayload.route.callback(changePayload));
        }
        if (defaultOption.event.historyChange) {
            process = process.then(() => defaultOption.event.historyChange(changePayload));
        }
        return process;
    };
    const historyUnlistener = browserHistory.listen((location, action) => {
        onChange(location);
    });
    const innerSetPath = (path, queryParams, hash) => {
        const urlParams = new URLSearchParams();
        for (let key of Object.keys(queryParams)) {
            let val = queryParams[key];
            if (Array.isArray(val)) {
                for (let each of val) {
                    urlParams.append(key, each);
                }
            }
            else {
                urlParams.set(key, val);
            }
        }

        let redirectTo = path;
        if (queryParams && Object.keys(queryParams).length > 0) {
            redirectTo += '?' + urlParams;
        }
        if (hash) {
            redirectTo += '#' + hash;
        }

        window.history.pushState({}, '', redirectTo);
        const pushStateEvent = new CustomEvent("_pushstate", {
            detail: {
                location: window.location
            }
        });
        window.dispatchEvent(pushStateEvent);
        return onChange(window.location);
    };

    const setPath = (path, queryParams, hash) => {
        let redirectTo = ("/" + useOption.root + "/" + path).replace(/\/\//gi, "/");
        return innerSetPath(redirectTo, queryParams, hash);
    };

    const changePath = (path) => {
        const queryParam = urlSearchParamsToJSON(new URLSearchParams(window.location.search));
        return setPath(path, queryParam, window.location.hash);
    };
    const setQueryParam = (queryParams) => {
        let loc = window.location;
        let redirectTo = `${loc.pathname}`;
        return innerSetPath(redirectTo, queryParams, window.location.hash)
    };
    const changeQueryParam = (queryParams) => {
        const oldQueryParam = urlSearchParamsToJSON(new URLSearchParams(window.location.search));
        let loc = window.location;
        let redirectTo = `${loc.pathname}`;
        return innerSetPath(redirectTo, {
            ...oldQueryParam,
            ...queryParams
        }, window.location.hash)
    };
    const changeHash = (hash) => {
        const queryParam = urlSearchParamsToJSON(new URLSearchParams(window.location.search));
        let loc = window.location;
        let redirectTo = `${loc.pathname}`;
        return innerSetPath(redirectTo, queryParam, hash);
    };
    const generatePath = (path) => {
        return ("/" + useOption.root + "/" + path).replace(/\/\//gi, "/");
    };

    const getLocationInfo = () => {
        let location = window.location;
        const changePayload: changePayload = {
            location: location,
            queryParam: urlSearchParamsToJSON(new URLSearchParams(location.search)),
            hash: location.hash
        };

        let routeMatch = router.match(getUrl(location.pathname, useOption.root));
        if (routeMatch) {
            let label = routeMatch.node.label;
            changePayload.route = routes.find(k => k.label == label);
            changePayload.routeParam = routeMatch.param;
        }
        return changePayload;
    };
    return {
        setPath: setPath,
        setQueryParam: setQueryParam,
        refresh: () => onChange(window.location),
        getLocationInfo: getLocationInfo,

        changePath: changePath,
        changeQueryParam: changeQueryParam,
        changeHash: changeHash,
        generatePath: generatePath,

        historyUnlistener: historyUnlistener
    }
};
export default urlRouter;