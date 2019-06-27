const React = require('react');
const ReactDOM = require('react-dom');
const sa = require('superagent');
const lo = require('lodash');
const MobxReact = require('mobx-react');

const App = require('./App.tsx').default;
const store = require('./store/store.tsx').store;
const toastr = require('toastr');
import * as types from './types';

export const reactMediaSelect = function(elem, option) {
    toastr.options.positionClass = "toast-bottom-right";

    const useOption = lo.merge({
        fileAction: {
            submit: null,
            cancel: null
        },
        apiPath: {
            browse: "/api/media-asset/browse",
            fileInfo: "/api/media-asset/fileInfo",
            content: "/media",
            newFolder: "/api/media-asset/newfolder",
            upload: "/api/media-asset/upload",
            delete: "/api/media-asset/delete"
        },
        headers: {
            authorization: null
        },
        fieldName: {
            upload: {
                fileInput: "files"
            },
            newFolder: {
                folderNameInput: "folderName"
            },
            delete: {
                withContent: "withContent"
            }
        },
        access: {
            deleteFile: true,
            deleteFolder: true,
            deleteEmptyFolder: true
        },
        defaultOverwrite: false
    }, option);
    const context: types.context = {
        config: useOption,
    };
    let storeInstance = new store(context);
    ReactDOM.render(
        <MobxReact.Provider store={storeInstance}>
            <App/>
        </MobxReact.Provider>,
        elem
    );
    return {
        clear: function(){
            storeInstance.navigate("/");
        },
        setFile: function(fullPath){
            const fileParts = fullPath.split("/").filter(k=> k);
            if(fileParts.length == 0){
                storeInstance.navigate("/");
            }
            else if(fileParts.length == 1){
                storeInstance.navigate("/").then(() => {
                    storeInstance.selectFile(fileParts[0]);
                });
            }
            else{
                const newPath = "/" + fileParts.filter((k, index) => index < fileParts.length - 1).join("/");
                storeInstance.navigate(newPath).then(() => {
                    storeInstance.selectFile(fileParts[fileParts.length - 1]);
                });
            }
        },
        onSubmit: function(handler){
            if(!useOption.fileAction.submit){
                useOption.fileAction.submit = {
                    label: "Submit",
                    handler: () => {}
                }
            }
            useOption.fileAction.submit.handler = handler;
        },
        onCancel: function(handler){
            if(!useOption.fileAction.cancel){
                useOption.fileAction.cancel = {
                    label: "Cancel",
                    handler: () => {}
                }
            }
            useOption.fileAction.cancel.handler = handler;
        }
    };
};