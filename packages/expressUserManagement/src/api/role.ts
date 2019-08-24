const httpError = require('http-errors');
const uuid = require('uuid/v4');
const Sequelize = require('sequelize');
const debug = require('debug')("QzNode:expressUserManagement:api:role");
import roleModelRaw from '../model/role';
import * as myType from '../types';

let role: myType.api.role = (context) => {
    const roleModel = roleModelRaw(context.db);
    return {
        _get: async(req, res, next) => {
            let page = req.query.page || 1;
            let limit = req.query.limit || 20;

            let roleResult = await roleModel.findAndCountAll({
                limit: limit * 1,
                offset: Math.max(0, (page - 1) * limit),
                raw: true
            });
            let roles = roleResult.rows;
            let roleCount = roleResult.count;

            res.set({
                'X-Total-Count': roleCount.length
            });
            return res.json(roles);
        },
        _post: async (req, res, next) => {

        },
    };
};
export default role;