"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var mysql = require('mysql');
var momentTz = require('moment');
var openDbConnection = require('./helper/openDbConnection.js');
var uuidGen = require('../Uuid/index');
var dispatcher = function (param) {
    if (param === void 0) { param = {}; }
    var _a = __assign({
        driver: "mysql",
        connection: {},
        tableName: "qz_queue",
        timezone: "Etc/GMT"
    }, param), driver = _a.driver, connection = _a.connection, tableName = _a.tableName, timezone = _a.timezone;
    var usedConnection = __assign({
        host: "localhost",
        database: "my_database",
        port: "3306",
        user: "root"
    }, connection);
    var dispatch = function (scriptPath, param, _a) {
        if (param === void 0) { param = {}; }
        var _b = _a === void 0 ? {} : _a, _c = _b.tag, tag = _c === void 0 ? "default" : _c, _d = _b.priority, priority = _d === void 0 ? 3 : _d, _e = _b.when, when = _e === void 0 ? null : _e, _f = _b.key, key = _f === void 0 ? null : _f;
        var utcInsert = moment.utc().format("YYYY-MM-DDTHH:mm:ss");
        if (when) {
            utcInsert = momentTz(when, timezone).utc().format("YYYY-MM-DDTHH:mm:ss");
        }
        var escTableName = tableName;
        return new Promise(openDbConnection(usedConnection)).then(function (db) {
            return new Promise(function (resolve, reject) {
                var queueUuid = uuidGen();
                var query = db.query("INSERT INTO " + escTableName + " SET ?", {
                    'tag': tag,
                    'utc_run': utcInsert,
                    'run_script': scriptPath,
                    'params': JSON.stringify(param),
                    'priority': priority,
                    'uuid': queueUuid,
                    'key': key,
                    'retry': 0,
                    'utc_created': moment.utc().format("YYYY-MM-DDTHH:mm:ss"),
                }, function (err, results) {
                    db.end();
                    if (err) {
                        reject(err);
                    }
                    else {
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
