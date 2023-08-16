"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const child_process = __importStar(require("child_process"));
const fs = __importStar(require("fs"));
electron_1.app.on("ready", () => {
    if (!fs.existsSync(path.join(__dirname, "./regs/"))) {
        fs.mkdirSync(path.join(__dirname, "./regs/"));
    }
    else {
        if (!fs.statSync(path.join(__dirname, "./regs/")).isDirectory()) {
            fs.mkdirSync(path.join(__dirname, "./regs/"));
        }
    }
    const browserWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "./preload.js"),
        },
    });
    browserWindow.setMenu(null);
    browserWindow.loadFile(path.join(__dirname, "./index.html"));
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
function _export(name, event) {
    if (fs.existsSync(path.join(__dirname, "./regs/", name))) {
        if (fs.statSync(path.join(__dirname, "./regs/", name)).isFile()) {
            fs.unlinkSync(path.join(__dirname, "./regs/", name));
        }
    }
    child_process.exec("powershell REG export HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Taskband " +
        path.join(__dirname, "./regs/", name), (error, stdout, stderr) => {
        if (error) {
            return "e";
        }
        event.sender.send("response", JSON.stringify(getALL()));
        return "s";
    });
}
function _import(name) {
    child_process.exec("powershell reg import " + path.join(__dirname, "./regs/", name), (error, stdout, stderr) => {
        if (error) {
            return "e";
        }
        reload();
        return "s";
    });
}
function allClear() {
    child_process.exec("powershell REG DELETE HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Taskband /F", (error, stdout, stderr) => {
        if (error) {
            return "e";
        }
        reload();
        return "s";
    });
}
function reload() {
    child_process.exec("powershell taskkill /F /IM explorer.exe;start explorer", (error, stdout, stderr) => {
        if (error) {
            return "e";
        }
        return "s";
    });
}
function getALL() {
    let files = fs.readdirSync(path.join(__dirname, "./regs/"));
    let regFiles = [];
    for (let i = 0; i < files.length; i++) {
        if (files[i].split(".").slice(-1)[0] == "reg") {
            if (fs.statSync(path.join(__dirname, "./regs/", files[i])).isFile()) {
                regFiles.push(files[i]);
            }
        }
    }
    return regFiles;
}
electron_1.ipcMain.on("message", (event, arg) => {
    let args = JSON.parse(arg);
    switch (args[0]) {
        case "reload":
            reload();
            break;
        case "allClear":
            allClear();
            break;
        case "export":
            _export(args[1], event);
            break;
        case "import":
            _import(args[1]);
            break;
        case "getALL":
            event.sender.send("response", JSON.stringify(getALL()));
            break;
    }
});
