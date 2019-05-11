const { createBrowserHistory } = require('history');
const lo = require('lodash');
const routington = require('routington');
const router = routington();

interface route {
    label: string,
    path: string | string[],
    data ?: any,
    callback ?: (data: changePayload) => Promise<any>
};

interface changePayload{
    route ?: route,
    location: string,
    routeParam ?: any,
    queryParam: any,
    hash ?: string
}
interface initPayload{
    routes: route[],
    option ?: {
        root: string,
        event: {
            historyChange: (data: changePayload) => Promise<any>
        }
    }
};

const urlSearchParamsToJSON = (urlParam) => {
    let result : any = {};
    for(let pair of urlParam.entries()){
        result[pair[0]] = pair[1];
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
    const {routes, option} = init;
    const useOption = lo.merge(defaultOption, option);

    for(let eachRoute of routes){
        const paths = Array.isArray(eachRoute.path) ? eachRoute.path : [eachRoute.path];
        for(let eachPath of paths){
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
        if(routeMatch){
            let label = routeMatch.node.label;
            changePayload.route = routes.find(k => k.label == label);
            changePayload.routeParam = routeMatch.param;
        }
        if(changePayload.route && changePayload.route.callback){
            changePayload.route.callback(changePayload)
        }
        if(defaultOption.event.historyChange){
            defaultOption.event.historyChange();
        }
    };
    const historyUnlistener = browserHistory.listen((location, action) => {
        onChange(location);
    });
    const innerSetPath = (path, queryParams, hash) => {
        const urlParams = new URLSearchParams();
        lo.forOwn(queryParams, (val, key) => {
            urlParams.set(key, val);
        });

        let redirectTo = path;
        if(queryParams && Object.keys(queryParams).length > 0){
            redirectTo += '?' + urlParams;
        }
        if(hash){
            redirectTo += '#' + hash;
        }

        window.history.pushState({}, '', redirectTo);
        return onChange(window.location);
    };

    const setPath = (path, queryParams, hash) => {
        let redirectTo = ("/" + useOption.root + "/" + path).replace(/\/\//gi, "/");
        return innerSetPath(redirectTo, queryParams, hash);
    };
    
    const changePath = (path) => {
        const queryParam = urlSearchParamsToJSON(new URLSearchParams(window.location.search));
        return setPath(path, queryParam, window.location.hash );
    };
    const changeQueryParam = (queryParams) => {
        let loc = window.location;
        let redirectTo = `${loc.pathname}`;
        return innerSetPath(redirectTo, queryParams, window.location.hash)
    };
    const changeHash = (hash) => {
        const queryParam = urlSearchParamsToJSON(new URLSearchParams(window.location.search));
        let loc = window.location;
        let redirectTo = `${loc.pathname}`;
        return innerSetPath(redirectTo, queryParam, hash );
    };

    return {
        setPath: setPath,

        changePath: changePath,
        changeQueryParam: changeQueryParam,
        changeHash: changeHash,

        historyUnlistener: historyUnlistener
    }
};
export default urlRouter;