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

	saveScene(): void {
		console.log("saveScene");
	}
}
