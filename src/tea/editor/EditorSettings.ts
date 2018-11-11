import * as fs from "fs";
import * as Electron from "electron";

export class EditorSettings {
	static readonly FileName = "settings.json";
	protected static _instance: EditorSettings;
	window: EditorSettings.Window;

	protected constructor() {
		this.window = new EditorSettings.Window();
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
		var currentWindow = Electron.remote.getCurrentWindow();
		this.window.setData(currentWindow);
		var data = JSON.stringify(this, null, "\t");
		fs.writeFileSync(EditorSettings.FileName, data);
	}

	load(): void {
		if (fs.existsSync(EditorSettings.FileName) === false) {
			return;
		}
		var data = fs.readFileSync(EditorSettings.FileName, "utf8");
		var json = JSON.parse(data);
		this.window.setJSON(json.window);
	}
}

export module EditorSettings {
	export class Window {
		x: number;
		y: number;
		width: number;
		height: number;

		constructor() {
			this.x = 0;
			this.y = 0;
			this.width = 0;
			this.height = 0;
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

		setData(window: Electron.BrowserWindow): void {
			if (window == null) {
				return;
			}
			var position = window.getPosition();
			var size = window.getContentSize();
			this.x = position[0];
			this.y = position[1];
			this.width = size[0];
			this.height = size[1];
		}
	}
}
