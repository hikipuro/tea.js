import { Editor } from "../Editor";
import { ObjectInspectorCommand } from "./ObjectInspectorCommand";

export class InspectorViewCommand {
	editor: Editor;
	objectInspectorCommand: ObjectInspectorCommand;

	constructor() {
		this.objectInspectorCommand = new ObjectInspectorCommand();
	}

	updateObjectInspector(): void {
		this.objectInspectorCommand.update();
	}
}
