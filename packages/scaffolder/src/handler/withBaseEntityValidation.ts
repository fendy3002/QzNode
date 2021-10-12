import { error, validator } from '@fendy3002/qz-node';
import * as httpErrors from "http-errors";
import entityMap from '../baseEntity/entityMap';

import {
    handler
} from '../crudAssignerType';

let service: handler.withBaseEntityValidation = async ({ req, res, context, baseEntity, action, onValid }) => {
    let validateResult = await validator.json.schema(
        await entityMap.validateJSON({
            entity: baseEntity,
            action: action.toString()
        })
    ).validate(req.body);

    if (!validateResult.isValid) {
        throw httpErrors(500, validator.json.formatMessage(validateResult));
    } else {
        return await onValid({ req, res, context, validateResult });
    }
};
export default service;