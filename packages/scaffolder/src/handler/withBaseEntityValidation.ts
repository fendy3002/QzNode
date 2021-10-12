import { error, validator } from '@fendy3002/qz-node';
import * as httpErrors from "http-errors";
import entityMap from '../baseEntity/entityMap';

import {
    handler
} from '../crudAssignerType';

let withBaseEntityValidation: handler.withBaseEntityValidation = ({ baseEntity, action, onValid }) => {
    return async ({ req, ...params }) => {
        let validateResult = await validator.json.schema(
            await entityMap.validateJSON({
                entity: baseEntity,
                action: action.toString()
            })
        ).validate(req.body);

        if (!validateResult.isValid) {
            throw httpErrors(500, validator.json.formatMessage(validateResult));
        } else {
            return await onValid({ req, ...params });
        }
    };
};
export { withBaseEntityValidation };