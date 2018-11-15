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

	static getInstance(): EditorSettings {
		if (this._instance == null) {
			this._instance = new EditorSettings();
		}
		return this._instance;
	}

	exists(): boolean {
		return fs.existsSync(EditorSettings.FileName);
	}

	save(): void {
		var browserWindow = Electron.remote.getCurrentWindow();
		this.window.setData(browserWindow);
		var translator = Translator.getInstance();
		this.language = translator.lang;
		var data = JSON.stringify(this, null, "\t");
		fs.writeFileSync(EditorSettings.FileName, data);
	}

	load(): void {
		if (fs.existsSync(EditorSettings.FileName) === false) {
			return;
		}
		var data = fs.readFileSync(EditorSettings.FileName, "utf8");
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
			if (browserWindow.isFullScreen()) {
				browserWindow.setFullScreen(false);
			}
			if (browserWindow.isMaximized()
			||  browserWindow.isMinimized()) {
				browserWindow.restore();
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
