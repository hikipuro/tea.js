import * as fs from "fs";
import * as nodePath from "path";
import * as Electron from "electron";
var remote = null;
var Dialog = null;
if (Electron) {
	remote = Electron.remote;
	Dialog = remote.dialog;
}

declare module "fs" {
	function mkdirSync(path: string, mode?: any | number | string | null): void;
}

import * as Tea from "../../Tea";
import { Editor } from "../Editor";
import { HierarchyView } from "../HierarchyView";
import { InspectorView } from "../InspectorView";
import { EventDispatcher } from "../../utils/EventDispatcher";

export class EditorCommand {
	editor: Editor;
	app: Tea.App;
	scene: Tea.Scene;
	hierarchyView: HierarchyView;
	inspectorView: InspectorView;

	filename: string;
	protected _isChanged: boolean;
	protected eventHandler: EventDispatcher;

	constructor() {
		this.filename = null;
		this._isChanged = false;
		this.eventHandler = new EventDispatcher();
		this.updateWindowTitle();
	}

	get isChanged(): boolean {
		return this._isChanged;
	}
	set isChanged(value: boolean) {
		if (this._isChanged === value) {
			return;
		}
		this._isChanged = value;
		this.updateWindowTitle();
	}

	newScene(force: boolean = false): void {
		if (force === false && this._isChanged) {
			this.showConfirmSaveDialog((response: string) => {
				switch (response) {
					case "Save":
						this.eventHandler.once("save", (filename: string) => {
							if (filename != null) {
								this.newScene();
							}
						});
						this.saveScene();
						break;
					case "Don't Save":
						this.newScene(true);
						break;
				}
			});
			return;
		}
		this.scene.destroy();
		this.filename = null;
		this.isChanged = false;
		var app = this.app;
		var scene = app.createScene();
		var camera = app.createCamera();
		var light = app.createDirectionalLight();
		scene.addChild(camera);
		scene.addChild(light);
		app.setScene(scene);
		this.editor.setScene(scene);
	}

	openScene(force: boolean = false): void {
		console.log("openScene");
		if (force === false && this._isChanged) {
			this.showConfirmSaveDialog((response: string) => {
				switch (response) {
					case "Save":
						this.eventHandler.once("save", (filename: string) => {
							if (filename != null) {
								this.openScene();
							}
						});
						this.saveScene();
						break;
					case "Don't Save":
						this.openScene(true);
						break;
				}
			});
			return;
		}
		var browserWindow = remote.getCurrentWindow();
		var options: Electron.OpenDialogOptions = {
			defaultPath: ".",
			properties: ["openFile"],
			filters: [
				{ name: "Scene File", extensions: ["json"] }
			]
		};
		Dialog.showOpenDialog(
			browserWindow, options,
			this.onCloseOpenDialog
		);
	}

	saveScene(): void {
		console.log("saveScene");
		if (this._isChanged === false) {
			this.eventHandler.emit("save", null);
			return;
		}
		if (this.filename == null) {
			this.saveSceneAs();
			return;
		}
		this.save();
	}

	saveSceneAs(): void {
		console.log("saveSceneAs");
		var browserWindow = remote.getCurrentWindow();
		var options: Electron.SaveDialogOptions = {
			defaultPath: ".",
			filters: [
				{ name: "Scene File", extensions: ["json"] }
			]
		};
		Dialog.showSaveDialog(
			browserWindow, options,
			this.onCloseSaveDialog
		);
	}

	build(): void {
		console.log("build");
		var browserWindow = remote.getCurrentWindow();
		var options: Electron.OpenDialogOptions = {
			defaultPath: ".",
			properties: ["openDirectory", "createDirectory"]
		};
		Dialog.showOpenDialog(
			browserWindow, options,
			this.onCloseOpenDialogBuild
		);
	}

	protected showConfirmSaveDialog(callback: (response: string) => void): void {
		console.log("showConfirmSaveDialog");
		var browserWindow = remote.getCurrentWindow();
		var buttons = [
			"Save", "Cancel", "Don't Save"
		];
		var options: Electron.MessageBoxOptions = {
			type: "info",
			message: "Scene have been modified",
			detail: "Do you want to save?",
			buttons: buttons,
			defaultId: 0
		};
		Dialog.showMessageBox(
			browserWindow, options,
			(response: number) => {
				callback(buttons[response]);
			}
		);
	}

	protected updateWindowTitle(): void {
		if (remote == null || remote.getCurrentWindow == null) {
			return;
		}
		var window = remote.getCurrentWindow();
		var title = window.getTitle();
		var suffix = title.substr(-2);
		if (this._isChanged) {
			if (suffix !== " *") {
				title += " *";
				window.setTitle(title);
			}
		} else {
			if (suffix === " *") {
				title = title.substr(0, title.length - 2);
				window.setTitle(title);
			}
		}
	}

	protected save(): void {
		var filename = this.filename;
		var json = this.scene.toJSON();
		var text = JSON.stringify(json, null, "\t");
		if (text.indexOf("\r\n") <= 0) {
			text = text.replace(/\n/g, "\r\n");
		}
		Tea.File.writeText(filename, text, null);
		this.isChanged = false;
		this.eventHandler.emit("save", filename);
	}

	protected onCloseOpenDialog = (filePaths: string[]): void => {
		if (filePaths == null || filePaths.length < 1) {
			return;
		}
		var filename = filePaths[0];
		Tea.File.readText(filename, (err, data) => {
			if (err) {
				console.error("EditorCommand.openScene(): " + filename);
				console.error(err);
				return;
			}
			var json = null;
			try {
				json = JSON.parse(data);
			} catch (err) {
				console.error("EditorCommand.openScene(): " + filename);
				console.error(err);
				return;
			}
			this.filename = filename;
			this.isChanged = false;
			var app = this.app;
			var scene = app.createSceneFromJSON(json);
			app.setScene(scene);
			this.editor.setScene(scene);
		});
	}

	protected onCloseSaveDialog = (filename: string): void => {
		if (filename == null) {
			this.eventHandler.emit("save", null);
			return;
		}
		this.filename = filename;
		this.save();
		console.log(filename);
	}

	protected onCloseOpenDialogBuild = (filePaths: string[]): void => {
		if (filePaths == null || filePaths.length < 1) {
			return;
		}
		var directoryName = filePaths[0];
		//console.log(directoryName);

		var path = nodePath.join(directoryName, "index.html");
		fs.copyFileSync("html/build.html", path);

		path = nodePath.join(directoryName, "main.js");
		fs.copyFileSync("html/build.js", path);

		path = nodePath.join(directoryName, "scene.json");
		var sceneData = this.scene.toJSON();
		fs.writeFileSync(path, JSON.stringify(sceneData, null, "\t"));

		var scripts = this.findScriptPaths(sceneData);
		//console.log(scripts);
		scripts.forEach((scriptPath: string) => {
			var path = nodePath.join(directoryName, scriptPath);
			var dirname = nodePath.dirname(path);
			if (fs.existsSync(dirname) === false) {
				fs.mkdirSync(dirname, { recursive: true });
			}
			fs.copyFileSync(scriptPath, path);
		});
	}

	protected findScriptPaths(data: any): Array<string> {
		var find = (children: Array<any>): Array<string> => {
			if (children == null || children.length <= 0) {
				return [];
			}
			var scripts = [];
			var length = children.length;
			for (var i = 0; i < length; i++) {
				var child = children[i];
				if (child._type !== "Object3D") {
					continue;
				}
				var components = child.components as Array<any>;
				if (components == null || components.length <= 0) {
					continue;
				}
				scripts.push.apply(scripts,
					components.filter((component: any) => {
						return component._type === "Script";
					}
				));
			}
			var paths = scripts.map((script: any) => {
				return script.path;
			});
			for (var i = 0; i < length; i++) {
				var child = children[i];
				paths.push.apply(paths, find(child.children));
			}
			return paths;
		};
		return find(data.children);
	}
}
