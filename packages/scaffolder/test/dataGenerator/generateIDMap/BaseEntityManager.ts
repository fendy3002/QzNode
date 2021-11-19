import manager from '../../../src/baseEntity/manager';
import BaseEntityModelSingle from './BaseEntityModelSingle';
import BaseEntityModelRowCount from './BaseEntityModelRowCount';

let managerInstance = new manager();
managerInstance.addModel(BaseEntityModelSingle);
managerInstance.addModel(BaseEntityModelRowCount);

export default managerInstance;