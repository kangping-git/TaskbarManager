import { app, BrowserWindow, ipcMain, IpcMainEvent } from "electron";
import * as path from "path";
import * as child_process from "child_process";
import * as fs from "fs";

app.on("ready", () => {
    if (!fs.existsSync(path.join(__dirname, "./regs/"))) {
        fs.mkdirSync(path.join(__dirname, "./regs/"));
    } else {
        if (!fs.statSync(path.join(__dirname, "./regs/")).isDirectory()) {
            fs.mkdirSync(path.join(__dirname, "./regs/"));
        }
    }
    const browserWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "./preload.js"),
        },
    });
    browserWindow.setMenu(null);
    browserWindow.loadFile(path.join(__dirname, "./index.html"));
});
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

function _export(name: string, event: IpcMainEvent) {
    child_process.exec(
        "powershell REG export HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Taskband " +
            path.join(__dirname, "./regs/", name) +
            " /y",
        (error, stdout, stderr) => {
            if (error) {
                return "e";
            }
            event.sender.send("response", JSON.stringify(getALL()));
            return "s";
        }
    );
}

function _import(name: string) {
    child_process.exec(
        "powershell reg import " + path.join(__dirname, "./regs/", name),
        (error, stdout, stderr) => {
            if (error) {
                return "e";
            }
            reload();
            return "s";
        }
    );
}

function allClear() {
    child_process.exec(
        "powershell REG DELETE HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Taskband /F",
        (error, stdout, stderr) => {
            if (error) {
                return "e";
            }
            reload();
            return "s";
        }
    );
}
function reload() {
    child_process.exec(
        "powershell taskkill /F /IM explorer.exe;start explorer",
        (error, stdout, stderr) => {
            if (error) {
                return "e";
            }
            return "s";
        }
    );
}
function getALL() {
    let files = fs.readdirSync(path.join(__dirname, "./regs/"));
    let regFiles = [];
    for (let i = 0; i < files.length; i++) {
        if (files[i].split(".").slice(-1)[0] == "reg") {
            if (
                fs.statSync(path.join(__dirname, "./regs/", files[i])).isFile()
            ) {
                regFiles.push(files[i]);
            }
        }
    }
    return regFiles;
}
ipcMain.on("message", (event, arg) => {
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
