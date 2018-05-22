'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mysql = require('mysql');
var moment = require('moment');
var momentTz = require('moment');
var openDbConnection = require('./helper/openDbConnection.js');
var uuidGen = require('../Uuid/index.js').default;

var dispatcher = function dispatcher() {
    var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _driver$connection$ta = (0, _extends3.default)({
        driver: "mysql",
        connection: {},
        tableName: "qz_queue",
        timezone: "Etc/GMT"
    }, param),
        driver = _driver$connection$ta.driver,
        connection = _driver$connection$ta.connection,
        tableName = _driver$connection$ta.tableName,
        timezone = _driver$connection$ta.timezone;

    var usedConnection = (0, _extends3.default)({
        host: "localhost",
        database: "my_database",
        port: "3306",
        user: "root"
    }, connection);

    var dispatch = function dispatch(scriptPath) {
        var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
            _ref$tag = _ref.tag,
            tag = _ref$tag === undefined ? "default" : _ref$tag,
            _ref$priority = _ref.priority,
            priority = _ref$priority === undefined ? 3 : _ref$priority,
            _ref$when = _ref.when,
            when = _ref$when === undefined ? null : _ref$when,
            _ref$key = _ref.key,
            key = _ref$key === undefined ? null : _ref$key;

        var utcInsert = moment.utc().format("YYYY-MM-DDTHH:mm:ss");
        if (when) {
            utcInsert = momentTz(when, timezone).utc().format("YYYY-MM-DDTHH:mm:ss");
        }

        var escTableName = tableName;
        return new Promise(openDbConnection(usedConnection)).then(function (db) {
            return new Promise(function (resolve, reject) {
                var queueUuid = uuidGen();
                var query = db.query('INSERT INTO ' + escTableName + ' SET ?', {
                    'tag': tag,
                    'utc_run': utcInsert,
                    'run_script': scriptPath,
                    'params': JSON.stringify(param),
                    'priority': priority,
                    'uuid': queueUuid,
                    'key': key,
                    'retry': 0,
                    'utc_created': moment.utc().format("YYYY-MM-DDTHH:mm:ss")
                }, function (err, results) {
                    db.end();
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            uuid: queueUuid,
                            key: key
                            //results: results
                        });
                    }
                });
            });
        });
    };
    return {
        dispatch: dispatch
    };
};

exports.default = dispatcher;