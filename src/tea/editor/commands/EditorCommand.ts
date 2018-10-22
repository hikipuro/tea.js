import * as Electron from "electron";
const remote = Electron.remote;
const Dialog = remote.dialog;

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
	isChanged: boolean;

	protected eventHandler: EventDispatcher;

	constructor() {
		this.filename = null;
		this.isChanged = false;
		this.eventHandler = new EventDispatcher();
	}

	newScene(): void {
		if (this.isChanged) {
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
						this.isChanged = false;
						this.newScene();
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

	openScene(): void {
		console.log("openScene");
		if (this.isChanged) {
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
						this.isChanged = false;
						this.openScene();
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
		if (this.isChanged === false) {
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
}
