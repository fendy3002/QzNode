
var Service = function({
    limit = 5
}) {
    var processPromises = (promises, onLoop = null) => {
        return (lastValue = []) => {
            return new Promise((resolve, reject) => {
                Promise.all(promises).then((values) => {
                    if(onLoop){ onLoop(values); }
                    var newValues = lastValue.concat(values);
                    resolve(newValues);
                });
            })
        };
    }

    return (promises, onLoop = null) => {
        if(!promises){
            callback([]);
        }
        var lastPromise = null;
        for(var i = 0; i < promises.length; i += limit){
            var slicePromise = promises.slice(i, i + limit);
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