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
const session = require('express-session');
const memoryStore = require('express-session/session/memory');
const cookieParser = require('cookie-parser');
import * as expressUserManagement from "../src/index";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(cookieParser());
let sessionStore = new memoryStore();
let expressSession = session({
    secret: 'myCustomSecret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge  : 60 * 30 * 1000
    },
    store: sessionStore
});
app.use(expressSession);
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
let context: expressUserManagement.type.initContext = {
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
    registerNeedConfirmation: true,
    sessionStore: sessionStore
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
expressUserManagement.init(context, app).then(async (context) => {
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
    let initUsers = [{
        id: 1,
        name: 'admin',
        username: 'admin',
        email: 'admin@example.com',
        is_super_admin: 1,
        confirmation: '086e637c-2915-4db5-84d8-6554520420ad',
    }, {
        id: 2,
        name: 'user1',
        username: 'user1',
        email: 'user2@example.com',
        confirmation: '8af84115-384e-4cb8-a429-49e5b307e562',
    }, {
        id: 3,
        name: 'user2',
        username: 'user2',
        email: 'user2@example.com',
        confirmation: '82d62f13-220e-4ed2-8204-768add32066b',
        is_confirmed: 0,
        is_active: 1,
    }];
    await userModel.bulkCreate(initUsers.map(k => {
        return {
            password: '$2a$12$OR/P9EEGIhSEAuQ5HxKkQOMmKgu9jGOyM52Fed9yPq8SkU6WWrqla',
            is_super_admin: 0,
            is_confirmed: 1,
            is_active: 1,
            created_by: 'admin',
            updated_by: 'admin',
            utc_created: '2019-01-01 00:00:00',
            utc_updated: '2019-01-01 00:00:00',
            ...k
        };
    }));

    app.get(
        '/', 
        expressUserManagement.middleware.signedIn(context)({
            mustSignedIn: true
        }), 
        (req, res, next) => {
            return res.render("home.html");
        });
    app.get(
        '/user-management', 
        [
            expressUserManagement.middleware.signedIn(context)({
                mustSignedIn: true
            }),
            expressUserManagement.middleware.isSuperAdmin
        ],
        (req, res, next) => {
            return res.render("user-management/index.html");
        });

    initialized = true;
    setInitialized();
});

app.use((req, res, next) => {
    res.locals._urlIn = () => false;
    res.locals._hasAccess = () => true;
    res.locals._gravatarHash = "";
    res.locals._req = req;
    res.locals.default = () => "";
    next();
});

let nunjucksEnv = nunjucks.configure('test/views', {
    autoescape: true,
    express: app
});
nunjucksEnv.addFilter("bool", (val, ifTrue = "yes", ifFalse = "no") => {
    return val === true ? ifTrue : ifFalse;
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