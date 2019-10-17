
export default (err, req, res, next) => {
    let resPayload: any = {};
    let resStatus = 500;
    if(req.id){
        resPayload.id = req.id;
    }
    if(err.status){
        resStatus = err.status;
    }
    if(err.code){
        resPayload.code = err.code;
    }
    if(err.message){
        resPayload.message = err.message;
    }
    if(err.error){
        resPayload.message = err.error;
    }

    res.status(resStatus);
    return res.json(resPayload);
};