import createAssigner from './createAssigner';
import updateAssigner from './updateAssigner';
import listAssigner from './listAssigner';
import viewAssigner from './viewAssigner';
import deleteAssigner from './deleteAssigner';
import deletePermanentAssigner from './deletePermanentAssigner';

import * as createAssignerType from './createAssigner';
import * as updateAssignerType from './updateAssigner';
import * as listAssignerType from './listAssigner';
import * as viewAssignerType from './viewAssigner';
import * as deleteAssignerType from './deleteAssigner';
import * as deletePermanentAssignerType from './deletePermanentAssigner';

export interface AssignParams {
    create?: createAssignerType.AssignParams,
    update?: updateAssignerType.AssignParams,
    list?: listAssignerType.AssignParams,
    view?: viewAssignerType.AssignParams,
    delete?: deleteAssignerType.AssignParams,
    deletePermanent?: deletePermanentAssignerType.AssignParams
};

export default {
    assign: async (option: AssignParams) => {
        if (option.create) {
            createAssigner.assign(option.create);
        }
        if (option.update) {
            updateAssigner.assign(option.update);
        }
        if (option.list) {
            listAssigner.assign(option.list);
        }
        if (option.view) {
            viewAssigner.assign(option.view);
        }
        if (option.delete) {
            deleteAssigner.assign(option.delete);
        }
        if (option.deletePermanent) {
            deletePermanentAssigner.assign(option.deletePermanent);
        }
    }
}