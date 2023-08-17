import { ipcRenderer } from "electron";

window.onload = () => {
    let regFiles: string[] = [];
    ipcRenderer.on("response", (event, arg) => {
        regFiles = JSON.parse(arg);
        draw();
        let elm = document.createElement("span");
        elm.innerText = __dirname;
        document.body.appendChild(elm);
    });
    function _import(file: string) {
        ipcRenderer.send("message", JSON.stringify(["import", file]));
    }
    function _export(file: string) {
        ipcRenderer.send("message", JSON.stringify(["export", file]));
    }
    function AllClear() {
        ipcRenderer.send("message", JSON.stringify(["allClear"]));
    }
    function reload() {
        ipcRenderer.send("message", JSON.stringify(["reload"]));
    }
    function getALL() {
        ipcRenderer.send("message", JSON.stringify(["getALL"]));
    }
    function draw() {
        let html = "";
        if (regFiles.length > 0) {
            for (let i = 0; i < regFiles.length; ++i) {
                html += `<tr><td>${regFiles[i]}</td><td><button data-id="${regFiles[i]}" class="button">ロード</button></td><td><button data-id="${regFiles[i]}" class="button2">上書き</button></td></tr>`;
            }
        } else {
            html = `<tr><td>空っぽ</td><td>空っぽ</td><td>空っぽ</td></tr>`;
        }
        (document.getElementById("table") as HTMLElement).innerHTML = html;
        document.querySelectorAll(".button").forEach((value) => {
            value.addEventListener("click", (e) => {
                _import(value.getAttribute("data-id") as string);
            });
        });
        document.querySelectorAll(".button2").forEach((value) => {
            value.addEventListener("click", (e) => {
                _export(value.getAttribute("data-id") as string);
            });
        });
    }
    document.getElementById("buttonAllClear")?.addEventListener("click", () => {
        AllClear();
    });
    document.getElementById("save")?.addEventListener("click", () => {
        _export(
            (document.getElementById("name") as HTMLInputElement).value + ".reg"
        );
    });
    document.getElementById("reload")?.addEventListener("click", () => {
        reload();
    });
    ipcRenderer.send("message", JSON.stringify(["getALL"]));
};
