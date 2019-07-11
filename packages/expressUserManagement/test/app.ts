process.env.DEBUG = "QzNode:*";
require('dotenv').config({
    path: './test/.env'
});

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const Sequelize = require('sequelize');
const path = require('path');
const nunjucks = require('nunjucks');
import * as expressUserManagement from "../src/index";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(express.static(path.resolve(__dirname, "public")));

let db = new Sequelize(process.env.MYSQL_DATABASE, "root", process.env.MYSQL_ROOT_PASSWORD, {
    host: process.env.DB_HOST || "127.0.0.1",
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
};
expressUserManagement.init(context, app).then(async () => {
    let userModel = expressUserManagement.models.user(context.db);
    let userRoleModel = expressUserManagement.models.userRole(context.db);
    let roleAccessModel = expressUserManagement.models.roleAccess(context.db);
    let roleModel = expressUserManagement.models.role(context.db);
    let userRememberTokenModel = expressUserManagement.models.userRememberToken(context.db);
    await userModel.sync();
    await userRoleModel.sync();
    await roleAccessModel.sync();
    await roleModel.sync();
    await userRememberTokenModel.sync();
    await userModel.destroy({
        where: {},
        truncate: true
    });
    await userModel.create({
        id: 1,
        name: 'admin',
        username: 'admin',
        email: 'admin@example.com',
        password: '$2a$12$OR/P9EEGIhSEAuQ5HxKkQOMmKgu9jGOyM52Fed9yPq8SkU6WWrqla',
        confirmation: '086e637c-2915-4db5-84d8-6554520420ad',
        is_confirmed: 1,
        is_active: 1,
        is_super_admin: 1,
        created_by: 'admin',
        updated_by: 'admin',
        utc_created: '2019-01-01 00:00:00',
        utc_updated: '2019-01-01 00:00:00',
    });

    initialized = true;
    setInitialized();
});

app.get('/auth/login', (req, res, next) => {
    res.render("auth/login.html");
});
nunjucks.configure('test/views', {
    autoescape: true,
    express: app
});



export default {
    app: app,
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