import manager from '../../../src/baseEntity/manager';
import BaseEntityModelSingle from './BaseEntityModelSingle';
import BaseEntityModelNumber from './BaseEntityModelNumber';
import BaseEntityModelRowCount from './BaseEntityModelRowCount';

let managerInstance = new manager();
managerInstance.addModel(BaseEntityModelSingle);
managerInstance.addModel(BaseEntityModelRowCount);
managerInstance.addModel(BaseEntityModelNumber);

export default managerInstance;