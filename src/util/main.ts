import { spawn, exec, ChildProcessWithoutNullStreams, ChildProcess } from "child_process";
import type { ResponseData } from "../interface";
import { join } from "path";
import PubSub from "pubsub-js";
import getPort from "get-port";
const WebSocket = require("ws");

let child: ChildProcess;

const cleanExit = async (message?: string | Error) => {
	if (!child) return;
	if (message) {
		console.log(message);
	}
	if (process.platform == "win32") {
		new Promise((resolve, reject) => {
			exec("taskkill /pid " + child.pid + " /T /F", (error: any, stdout: any, stderr: any) => {
				if (error) {
					console.warn(error);
				}
				process.exit();
				resolve(stdout ? stdout : stderr);
			});
		});
	} else {
		new Promise((resolve, reject) => {
			if (child.pid) {
				process.kill(-child.pid);
				process.exit();
			}
		});
	}
};

process.on("SIGINT", () => cleanExit());

process.on("SIGTERM", () => cleanExit());

export let BACKEND: WebSocket;
let PORT: number;
let CONNECTED = false;
export let isConnected = ()=>{
	return CONNECTED
}
const connectToServer  = async (callback: Function) => {
	try {
		await sleep(500);

		BACKEND = new WebSocket(`ws://localhost:${PORT}/client`);
		BACKEND.onopen = function () {
			console.log("Successfully Connnected To Backend Proxy");
			CONNECTED = true;
			callback(true, BACKEND)
		};
		BACKEND.onmessage = function (e: any) {
			if (typeof e.data === "string") {
				let responseData: ResponseData = JSON.parse(e.data);
				PubSub.publish(responseData.id, responseData);
			}
		};

		BACKEND.onclose = function () {
			console.log("Backend Proxy Client Closed Error! Retrying Connection...");
			CONNECTED = false;
			connectToServer(()=>{});
		};

		BACKEND.onerror = function () {
			console.log("Backend Proxy Connection Error! Retrying Connection...");
			CONNECTED = false;
			// connectToServer()
		};

	} catch (e) {
		return callback(false)
	}
};
interface StringMap { [key: string]: string; }

var executables: StringMap = {
	'darwin': 'got-tls-proxy',
	'linux': "got-tls-proxy-linux",
	'win32': 'got-tls-proxy.exe',
}
export const startServer = async () => {
	try {
		PORT = await getPort();

		console.log("Starting Server...");
		
		let executableFilename = executables[process.platform]
		
		if(!executableFilename){
			throw new Error("Operating system not supported");
		}

		child = spawn(join(__dirname, `../resources/${executableFilename}`), {
			env: { PROXY_PORT: PORT.toString() },
			shell: true,
			stdio:['inherit','inherit','inherit', 'ipc'],
			windowsHide: true,
		});
		return new Promise((resolve, rejects)=>{
			connectToServer((success: Boolean)=>{
				success ? resolve(success) : rejects(success)
			});
		})
		
	} catch (e) {
		console.log(e);
		return false
	}
};

const dir = "/";

export function getBaseUrl(url: string, prefix?: string) {
	const urlAsArray = url.split(dir);
	const doubleSlashIndex = url.indexOf("://");
	if (doubleSlashIndex !== -1 && doubleSlashIndex === url.indexOf(dir) - 1) {
		urlAsArray.length = 3;
		let url = urlAsArray.join(dir);
		if (prefix !== undefined) url = url.replace(/http:\/\/|https:\/\//, prefix);
		return url;
	} else {
		let pointIndex = url.indexOf(".");
		if (pointIndex !== -1 && pointIndex !== 0) {
			return (prefix !== undefined ? prefix : "https://") + urlAsArray[0];
		}
	}
	return "";
}

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
