process.env.DEBUG = "QzNode:*";

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const Sequelize = require('sequelize');
const path = require('path');
import expressUserManagement from "../src/index";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(express.static(path.resolve(__dirname, "public")));

let db = new Sequelize(process.env.MYSQL_DATABASE, "root", process.env.MYSQL_ROOT_PASSWORD, {
    host: "127.0.0.1",
    port: process.env.DOCKER_MYSQL_PORT,
    dialect: 'mysql',
    operatorsAliases: Sequelize.Op,
    dialectOptions: {
        multipleStatements: true,
        supportBigNumbers: true,
        bigNumberStrings: true
    },
    timezone: "Asia/Jakarta"
});
let context = {
    db: db,
    auth: (req: any, res: any) => { return (req.session && req.session.user) || res.locals.user },
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
let initialized = false;
let initializeHandler = [];
let setInitialized = () => {
    if(initialized){
        for(let handler of initializeHandler){
            handler();
        }
    }
}
expressUserManagement.init(context, app).then(() => {
    initialized = true;
    setInitialized();
});

export default {
    app,
    initialized: async () => {
        if(initialized){
            return initialized;
        }
        else{
            await new Promise((resolve) => {
                initializeHandler.push(() => {
                    resolve();
                });
            });
            return initialized;
        }
    }
};