import * as Electron from "electron";
const remote = Electron.remote;
const Dialog = remote.dialog;

import * as Tea from "../../Tea";
import { Editor } from "../Editor";
import { HierarchyView } from "../HierarchyView";
import { InspectorView } from "../InspectorView";

export class EditorCommand {
	editor: Editor;
	app: Tea.App;
	scene: Tea.Scene;
	hierarchyView: HierarchyView;
	inspectorView: InspectorView;

	newScene(): void {
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

	onCloseOpenDialog = (filePaths: string[]): void => {
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
			var app = this.app;
			var scene = app.createSceneFromJSON(json);
			app.setScene(scene);
			this.editor.setScene(scene);
		});
	}

	protected onCloseSaveDialog = (filename: string): void => {
		if (filename == null) {
			return;
		}
		var json = this.scene.toJSON();
		var text = JSON.stringify(json, null, "\t");
		if (text.indexOf("\r\n") <= 0) {
			text = text.replace(/\n/g, "\r\n");
		}
		Tea.File.writeText(filename, text, null);
		console.log(filename);
	}
}
