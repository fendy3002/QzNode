
var Service = function({
    limit = 5
}) {
    var processPromises = (promises, onLoop = null) => {
        return (lastValue = []) => {
            return Promise.all(promises.map(k => new Promise(k.callback))).then((values) => {
                if(onLoop){ onLoop(values); }
                var newValues = lastValue.concat(values);
                return newValues;
            });
        };
    }

    return (qzPromises, onLoop = null) => {
        if(!qzPromises){
            callback([]);
        }
        var lastPromise = null;
        for(var i = 0; i < qzPromises.length; i += limit){
            var slicePromise = qzPromises.slice(i, i + limit);
            if(!lastPromise){
                lastPromise = processPromises(slicePromise, onLoop)([]);
            }
            else{
                var currentPromise = processPromises(slicePromise, onLoop);
                var nextPromise = lastPromise.then(currentPromise);
                lastPromise = nextPromise;
            }
        }
        return lastPromise;
    };
};

export default Service;