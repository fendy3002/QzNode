import fs = require('fs');
import path = require('path');
import commandLineArgs = require('command-line-args');

import nunjucks = require('nunjucks');
import prettier = require("prettier");
import getHelper from './helper';

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
        "[Route.Module.Code]": option.schema.Route.Module.Code,
    };
    let result = original;
    for (const key of Object.keys(replacement)) {
        result = result.replace(key, replacement[key]);
    }
    result = result.replace(".template", "");
    return result;
};

const renderPath = async (currentPath: string, option) => {
    const replacedCurrentPath = replaceFileName(currentPath, option);
    const dirs = fs.readdirSync(path.join(option.path.template, currentPath));
    for (const item of dirs) {
        const itemPath = path.join(option.path.template, currentPath, item);
        const itemOutputPath = path.join(option.path.output, replacedCurrentPath, replaceFileName(item, option));
        const fileStat = fs.lstatSync(itemPath);

        if (fileStat.isFile()) {
            console.log("processing file: ", itemPath);
            let fileContent = nunjucks.render(itemPath, {
                _helper: option.helper,
                ...option.schema
            }).replace(/\n\s*\n/g, '\n');
            let realExtension = path.extname(replaceFileName(item, option));
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
    console.log("process.cwd(): ", process.cwd());
    const helperDir = path.join(process.cwd(), option.template, "helper");
    const templateDir = path.join(process.cwd(), option.template, "template");
    const outputDir = path.join(process.cwd(), option.template, "output");
    const schemaPath = path.join(process.cwd(), option.schema);
    const schemaStr = fs.readFileSync(schemaPath, "utf8");
    const schemaObj = JSON.parse(schemaStr);

    console.log("schema", schemaObj)
    let context: any = {
        ...option,
        path: {
            helper: helperDir,
            template: templateDir,
            output: outputDir
        },
        schema: schemaObj
    };
    const helper = getHelper(context);
    context.helper = helper;
    await renderPath("", context);
};
doTask();