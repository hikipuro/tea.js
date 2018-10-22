import * as Tea from "../Tea";
import { Component } from "./Component";

export class MeshFilter extends Component {
	static editorView = Tea.Editor.MeshFilter;
	mesh: Tea.Mesh;
	
	constructor(app: Tea.App) {
		super(app);
	}

	destroy(): void {
		if (this.mesh != null) {
			this.mesh.destroy();
			this.mesh = undefined;
		}
		super.destroy();
	}
	
	toJSON(): Object {
		var json = super.toJSON();
		Object.assign(json, {
			_type: "MeshFilter"
		});
		return json;
	}

	static fromJSON(app: Tea.App, json: any): MeshFilter {
		if (json == null || json._type !== "MeshFilter") {
			return null;
		}
		var meshFilter = new MeshFilter(app);
		return meshFilter;
	}
}
