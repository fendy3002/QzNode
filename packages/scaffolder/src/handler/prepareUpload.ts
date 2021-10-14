import { error } from '@fendy3002/qz-node';
import {
    handler
} from '../crudAssignerType';

let prepareUpload: handler.prepareUpload = ({ fields, onSave }) => {
    return async ({ req, ...params }) => {
        let files: any = {};
        for (let prop of fields.map(k => k.name)) {
            files[prop] = req.files[prop] || [];
        }
        return {
            req,
            ...params,
            files,
            ...await onSave({ ...params, req, files })
        };
    };
};
export { prepareUpload };