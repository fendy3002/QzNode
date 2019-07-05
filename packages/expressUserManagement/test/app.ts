process.env.DEBUG = "QzNode:*";

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


let context = {
    db: null,
    auth: (req: any) => {  },
    mail: {
        adminResetPassword: async (payload) => {
            
        },
        resetPasswordRequest: async (payload) => {
            
        },
        adminRegister: async (payload) => {
            
        },
        userRegister: async (payload) => {
            
        },
        changeEmail: async (payload) => {
            
        },
        resendConfirmation: async (payload) => {
            
        }
    },
    appPublicKey: fs.readFileSync(__dirname + "/../testHelper/public.key"),
    appPrivateKey: fs.readFileSync(__dirname + "/../testHelper/private.key"),
    registerNeedConfirmation: true
};

export default app;