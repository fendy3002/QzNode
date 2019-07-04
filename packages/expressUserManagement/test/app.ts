process.env.DEBUG = "QzNode:*";

const express = require('express');
const bodyParser = require('body-parser');

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
    appKey: "",
    rememberTokenName: "",
    registerNeedConfirmation: ""
};

export default app;