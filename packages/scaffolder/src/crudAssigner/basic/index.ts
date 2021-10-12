import createAssigner from './createAssigner';
import updateAssigner from './updateAssigner';
import listAssigner from './listAssigner';
import viewAssigner from './viewAssigner';
import deleteAssigner from './deleteAssigner';

import * as createAssignerType from './createAssigner';
import * as updateAssignerType from './updateAssigner';
import * as listAssignerType from './listAssigner';
import * as viewAssignerType from './viewAssigner';
import * as deleteAssignerType from './deleteAssigner';

export interface AssignParams {
    create?: createAssignerType.AssignParams,
    update?: updateAssignerType.AssignParams,
    list?: listAssignerType.AssignParams,
    view?: viewAssignerType.AssignParams,
    delete?: deleteAssignerType.AssignParams,
};

export {
    createAssigner,
    updateAssigner,
    listAssigner,
    viewAssigner,
    deleteAssigner
}

export default {
    assign: async (option: AssignParams, router) => {
        if (option.create) {
            createAssigner.assign(option.create, router);
        }
        if (option.update) {
            updateAssigner.assign(option.update, router);
        }
        if (option.list) {
            listAssigner.assign(option.list, router);
        }
        if (option.view) {
            viewAssigner.assign(option.view, router);
        }
        if (option.delete) {
            deleteAssigner.assign(option.delete, router);
        }
    }
}