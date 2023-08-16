"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
window.onload = () => {
    var _a, _b, _c;
    let regFiles = [];
    electron_1.ipcRenderer.on("response", (event, arg) => {
        regFiles = JSON.parse(arg);
        draw();
    });
    function _import(file) {
        electron_1.ipcRenderer.send("message", JSON.stringify(["import", file]));
    }
    function _export(file) {
        electron_1.ipcRenderer.send("message", JSON.stringify(["export", file]));
    }
    function AllClear() {
        electron_1.ipcRenderer.send("message", JSON.stringify(["allClear"]));
    }
    function reload() {
        electron_1.ipcRenderer.send("message", JSON.stringify(["reload"]));
    }
    function getALL() {
        electron_1.ipcRenderer.send("message", JSON.stringify(["getALL"]));
    }
    function draw() {
        let html = "";
        if (regFiles.length > 0) {
            for (let i = 0; i < regFiles.length; ++i) {
                html += `<tr><td>${regFiles[i]}</td><td><button data-id="${regFiles[i]}" class="button">ロード</button></td><td><button data-id="${regFiles[i]}" class="button2">上書き</button></td></tr>`;
            }
        }
        else {
            html = `<tr><td>空っぽ</td><td>空っぽ</td><td>空っぽ</td></tr>`;
        }
        document.getElementById("table").innerHTML = html;
        document.querySelectorAll(".button").forEach((value) => {
            value.addEventListener("click", (e) => {
                _import(value.getAttribute("data-id"));
            });
        });
        document.querySelectorAll(".button2").forEach((value) => {
            value.addEventListener("click", (e) => {
                _export(value.getAttribute("data-id"));
            });
        });
    }
    (_a = document.getElementById("buttonAllClear")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        AllClear();
    });
    (_b = document.getElementById("save")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        _export(document.getElementById("name").value + ".reg");
    });
    (_c = document.getElementById("reload")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
        reload();
    });
    electron_1.ipcRenderer.send("message", JSON.stringify(["getALL"]));
};
