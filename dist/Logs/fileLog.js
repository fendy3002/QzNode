'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Service = function Service(filepath) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

    var _ = {
        fs: _fs2.default,
        encoding: "utf8",
        done: function done() {},
        pendings: []
    };
    var message = function message(_message) {
        onProcess(function (done) {
            _.fs.appendFile(filepath, _message, _.encoding, function (err) {
                if (err) {
                    callback(err, _message);
                } else {
                    callback(null, _message);
                }

                done();
            });
        });
    };
    var messageln = function messageln(msg) {
        message(msg + "\n");
    };
    var object = function object(obj) {
        message(JSON.stringify(obj, null, 2) + "\n");
    };
    var exception = function exception(ex) {
        var msg = ex.toString() + "\n" + ex.stack;
        message(msg + "\n");
    };

    var onProcess = function onProcess(callback) {
        var process = { done: false };
        _.pendings.push(process);

        (function (process) {
            var onDone = function onDone() {
                process.done = true;
                if (_lodash2.default.filter(_.pendings, function (process) {
                    return !process.done;
                }).length == 0) {
                    _.done();
                }
            };
            callback(onDone);
        })(process);
    };

    var onDone = function onDone(cb) {
        _.done = cb;

        return _lodash2.default.filter(_.pendings, function (process) {
            return !process.done;
        }).length == 0;
    };

    return {
        _: _,
        onDone: onDone,
        message: message,
        messageln: messageln,
        object: object,
        exception: exception
    };
};

exports.default = Service;