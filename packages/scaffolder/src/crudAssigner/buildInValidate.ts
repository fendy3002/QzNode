import { validator } from '@fendy3002/qz-node';
import entityMap from '../baseEntity/entityMap';

export default async (baseEntity, action) => {
    return async ({ req, res }) => {
        let validateResult = await validator.json.schema(
            await entityMap.validateJSON({
                entity: baseEntity,
                action: action
            })
        ).validate(req.body);
        return {
            data: validateResult.data,
            isValid: validateResult.isValid,
            message: validator.json.formatMessage(validateResult)
        };
    }
}