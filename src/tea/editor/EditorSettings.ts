import * as nodePath from "path";
import * as fs from "fs";
import * as Electron from "electron";
import { Translator } from "./translate/Translator";

export class EditorSettings {
	static readonly FileName = "settings.json";
	protected static _instance: EditorSettings;
	window: EditorSettings.Window;
	language: string;

	protected constructor() {
		this.window = new EditorSettings.Window();
		this.language = "en";
	}

	static get path(): string {
		var path = ".";
		if (process.type === "browser") {
			// main process
			path = Electron.app.getAppPath();
		} else {
			// renderer process
			path = Electron.remote.app.getAppPath();
		}
		return nodePath.join(path, EditorSettings.FileName);
	}

	static getInstance(): EditorSettings {
		if (this._instance == null) {
			this._instance = new EditorSettings();
		}
		return this._instance;
	}

	exists(): boolean {
		return fs.existsSync(EditorSettings.path);
	}

	save(): void {
		var path = EditorSettings.path;
		var data = JSON.stringify(this, null, "\t");
		fs.writeFileSync(path, data);
	}

	load(): void {
		var path = EditorSettings.path;
		if (fs.existsSync(path) === false) {
			return;
		}
		var data = fs.readFileSync(path, "utf8");
		var json = null;
		try {
			json = JSON.parse(data);
		} catch (e) {
			console.error(e);
			return;
		}
		this.window.setJSON(json.window);
		if (json.language) {
			this.language = json.language;
		}
	}
}

export module EditorSettings {
	export class Window {
		x: number;
		y: number;
		width: number;
		height: number;

		constructor() {
			this.x = null;
			this.y = null;
			this.width = null;
			this.height = null;
		}

		setJSON(json: any): void {
			try {
				this.x = json.x;
				this.y = json.y;
				this.width = json.width;
				this.height = json.height;
			} catch (err) {
				console.error(err);
			}
		}

		setData(browserWindow: Electron.BrowserWindow): void {
			if (browserWindow == null) {
				return;
			}
			var position = browserWindow.getPosition();
			var size = browserWindow.getContentSize();
			this.x = position[0];
			this.y = position[1];
			this.width = size[0];
			this.height = size[1];
		}
	}
}
