class QzPromise {
    constructor(callback, before = null){
        this.callback = callback;
        this.before = before;
        this.then = function(thenCallback) {
            return new QzPromise(thenCallback, this);
        };
    }
    callback: any;
    before: any;
    then: any;
};

export = QzPromise;