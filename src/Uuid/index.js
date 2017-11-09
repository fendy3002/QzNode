import uuidv4 from 'uuid/v4';

var Service = function() {
    return uuidv4().replace(/\-/g, "");
};

export default Service;