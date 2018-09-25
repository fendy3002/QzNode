let Service:any = function({
    limit = 5
}) {
    let qzPromiseToPromise = (qzPromise) => {
        if(qzPromise.before){
            return qzPromiseToPromise(qzPromise.before).then((result) => {
                return new Promise(qzPromise.callback(result));
            });
        }
        else{
            return new Promise(qzPromise.callback);
        }
    };
    let processPromises = (qzPromises, onLoop = null) => {
        return (lastValue = []) => {
            let promises = qzPromises.map(qzPromiseToPromise);
            return Promise.all(promises).then((values) => {
                if(onLoop){ onLoop(values); }
                let newValues = lastValue.concat(values);
                return newValues;
            });
        };
    }

    return (qzPromises, onLoop = null) => {
        if(!qzPromises || qzPromises.length == 0){
            return new Promise((resolve) => resolve(null));
        }
        let lastPromise = null;
        for(let i = 0; i < qzPromises.length; i += limit){
            let slicePromise = qzPromises.slice(i, i + limit);
            if(!lastPromise){
                lastPromise = processPromises(slicePromise, onLoop)([]);
            }
            else{
                let currentPromise = processPromises(slicePromise, onLoop);
                let nextPromise = lastPromise.then(currentPromise);
                lastPromise = nextPromise;
            }
        }
        return lastPromise;
    };
};

export = Service;