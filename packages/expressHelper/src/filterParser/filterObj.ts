import lo = require('lodash');
import moment = require('moment');
import Sequelize = require('sequelize');
import { string } from '@fendy3002/qz-node';
import odataParser from '../odataParser';
import * as types from '../types';

let toSequelize = (source: types.filterParser.filterObj) => {
    let parseObj = (obj) => {
        let operation = Object.keys(obj)[0];
        if (operation == "and") {
            return parseAnd(obj.and);
        } else if (operation == "or") {
            return parseOr(obj.or);
        } else if ([
            "gt",
            "gte",
            "lt",
            "lte",
            "eq",
            "ne"
        ].indexOf(operation) > -1) {
            return parseOperation(obj[operation], operation);
        }
    };
    let parseAnd = (obj) => {
        return {
            [Sequelize.Op.and]: obj.map(k => {
                return parseObj(k);
            })
        };
    }
    let parseOr = (obj) => {
        return {
            [Sequelize.Op.or]: obj.map(k => {
                return parseObj(k);
            })
        };
    }
    let operationMap = {
        "gt": Sequelize.Op.gt,
        "gte": Sequelize.Op.gte,
        "lt": Sequelize.Op.lt,
        "lte": Sequelize.Op.lte,
        "eq": Sequelize.Op.eq,
        "ne": Sequelize.Op.ne
    };
    let parseOperation = (obj, operation) => {
        return {
            [obj.propertyName]: {
                [operationMap[operation]]: obj.value
            }
        };
    };
    return parseObj(source);
};
let toMongo = (source: types.filterParser.filterObj) => {
    let parseObj = (obj) => {
        let operation = Object.keys(obj)[0];
        if (operation == "and") {
            return parseAnd(obj.and);
        } else if (operation == "or") {
            return parseOr(obj.or);
        } else if ([
            "gt",
            "gte",
            "lt",
            "lte",
            "eq",
            "ne"
        ].indexOf(operation) > -1) {
            return parseOperation(obj[operation], operation);
        }
    };
    let parseAnd = (obj) => {
        return {
            $and: obj.map(k => {
                return parseObj(k);
            })
        };
    }
    let parseOr = (obj) => {
        return {
            $or: obj.map(k => {
                return parseObj(k);
            })
        };
    }
    let operationMap = {
        "gt": "$gt",
        "gte": "$gte",
        "lt": "$lt",
        "lte": "$lte",
        "eq": "$eq",
        "ne": "$ne",
    };
    let parseOperation = (obj, operation) => {
        return {
            [obj.propertyName]: {
                [operationMap[operation]]: obj.value
            }
        };
    };
    return parseObj(source);
};
export default {
    toSequelize: toSequelize,
    toMongo: toMongo
};