import { error, validator } from '@fendy3002/qz-node';
import * as httpErrors from "http-errors";
import * as debugRaw from 'debug';
let debug = debugRaw("@fendy3002/scaffolder:handler/withBaseEntityModelValidation");

import entityMap from '../baseEntity/entityMap';

import {
    handler
} from '../crudAssignerType';

let withBaseEntityModelValidation: handler.withBaseEntityModelValidation = ({ baseEntityModel, action, onValid }) => {
    return async ({ req, ...params }) => {
        let jsonSchema = await entityMap.validateJSON({
            model: baseEntityModel,
            action: action.toString()
        });
        debug("jsonSchema", JSON.stringify(jsonSchema));
        let validateResult = await validator.json.schema(jsonSchema).validate(req.body);

        if (!validateResult.isValid) {
            throw httpErrors(500, validator.json.formatMessage(validateResult));
        } else {
            return {
                ...params,
                req,
                validateResult,
                ...await onValid({ req, validateResult, ...params })
            };
        }
    };
};
export { withBaseEntityModelValidation };