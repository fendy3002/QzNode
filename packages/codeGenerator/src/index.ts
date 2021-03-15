#!/usr/bin/env node

import fs = require('fs');
import path = require('path');
import commandLineArgs = require('command-line-args');
import winston = require('winston');

import nunjucks = require('nunjucks');
import prettier = require("prettier");
import getHelper from './helper';
import * as types from './types';

const optionDefinitions = [
    { name: 'schema', alias: 's', type: String, defaultOption: true },
    { name: 'template', alias: 't', type: String },
];

const supportedPrettierFileFormat = [
    { ext: ".ts", parser: "typescript" },
    { ext: ".js", parser: "babel" },
    //    { ext: ".html", parser: "html" }
];

const replaceFileName = (original: string, option) => {
    const replacement = {
        "[Model.Name]": option.schema.Model.Name,
        "[Model.Connection]": option.schema.Model.Connection,
        "[Route.Module.Code]": option.schema.Route.Module.Code,
        "[Route.Module.UrlPrefix]": option.schema.Route.Module.UrlPrefix,
    };
    let result = original;
    for (const key of Object.keys(replacement)) {
        result = result.replace(key, replacement[key]);
    }
    result = result.replace(".template", "");
    return result;
};

let htmlNunjucks = nunjucks.configure({
    tags: {
        blockStart: '|%',
        blockEnd: '%|',
        variableStart: '|$',
        variableEnd: '$|',
        commentStart: '|#',
        commentEnd: '#|'
    }
});
let defaultNunjucks = nunjucks.configure({});
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.json({
            space: 2
        })
    ),
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.Console({})
    ],
});


const renderPath = async (currentPath: string, option) => {
    const replacedCurrentPath = replaceFileName(currentPath, option);
    const dirs = fs.readdirSync(path.join(option.path.template, currentPath));
    for (const item of dirs) {
        const itemPath = path.join(option.path.template, currentPath, item);
        const itemOutputPath = path.join(option.path.output, replacedCurrentPath, replaceFileName(item, option));
        const fileStat = fs.lstatSync(itemPath);

        if (fileStat.isFile()) {
            logger.info({ message: "processing file: " + itemPath });
            let realExtension = path.extname(replaceFileName(item, option));
            let fileContent = "";
            if (realExtension != ".html") {
                fileContent = defaultNunjucks.render(itemPath, {
                    _helper: option.helper,
                    ...option.schema
                });
            }
            else {
                fileContent = htmlNunjucks.render(itemPath, {
                    _helper: option.helper,
                    ...option.schema
                });
            }
            fileContent = fileContent.replace(/\n\s*\n/g, '\n');

            let prettierFormat = supportedPrettierFileFormat.filter(k => k.ext == realExtension)
            if (
                option.schema.Prettier &&
                prettierFormat.length > 0 &&
                !option.schema.ExcludePrettier.some(k => k == realExtension)
            ) {
                fileContent = prettier.format(fileContent, {
                    parser: prettierFormat[0].parser,
                    arrowParens: "always",
                    tabWidth: 4,
                    proseWrap: "never",
                    ...option.schema.Prettier
                });
            }
            fs.writeFileSync(itemOutputPath, fileContent);
        }
        else {
            if (!fs.existsSync(itemOutputPath)) {
                fs.mkdirSync(itemOutputPath, {
                    recursive: true
                });
            }
            await renderPath(path.join(currentPath, item), option);
        }
    }
};

const doTask = async () => {
    const option = commandLineArgs(optionDefinitions)
    option.template = option.template || "";
    logger.info("process.cwd(): ", process.cwd());
    const helperDir = path.join(process.cwd(), option.template, "helper");
    const templateDir = path.join(process.cwd(), option.template, "template");
    const outputDir = path.join(process.cwd(), option.template, "output");
    const extensionDir = path.join(process.cwd(), option.template, "extension");
    const schemaPath = path.join(process.cwd(), option.schema);
    const schemaStat = fs.statSync(schemaPath);
    logger.info({
        helperDir,
        templateDir,
        outputDir,
        extensionDir,
        schemaPath
    });
    const processingSchema = [];
    if (schemaStat.isFile()) {
        processingSchema.push(schemaPath);
    }
    else {
        // if directory, loop all schema
        for (const file of fs.readdirSync(schemaPath)) {
            const fullPath = path.join(schemaPath, file);
            if (path.extname(file) == ".json" || path.extname(file) == ".js") {
                processingSchema.push(fullPath);
            }
        }
    }
    for (const schemaFilePath of processingSchema) {
        let schemaObj = null;
        if (path.extname(schemaFilePath) == ".json") {
            const schemaStr = fs.readFileSync(schemaFilePath, "utf8");
            schemaObj = JSON.parse(schemaStr);
        }
        else {
            schemaObj = require(schemaFilePath).default;
        }

        logger.info("schema", schemaObj)
        let context: types.Context = {
            ...option,
            path: {
                helper: helperDir,
                template: templateDir,
                output: outputDir,
                extension: extensionDir
            },
            schema: schemaObj,
            nunjucks: {
                default: defaultNunjucks,
                html: htmlNunjucks
            }
        };
        const helper = await getHelper(context);
        context.helper = helper;
        await renderPath("", context);
    }
};
doTask();