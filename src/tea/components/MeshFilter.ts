import * as Tea from "../Tea";
import { Component } from "./Component";
import { BufferData } from "./BufferData";

export class MeshFilter extends Component {
	mesh: Tea.Mesh;
	data: BufferData;
	
	constructor(app: Tea.App) {
		super(app);
		this.data = new BufferData(app);
	}

	destroy(): void {
		if (this.mesh != null) {
			this.mesh.destroy();
			this.mesh = undefined;
		}
		if (this.data != null) {
			this.data.destroy();
			this.data = undefined;
		}
		super.destroy();
	}

	createData(): void {
		if (this.mesh == null) {
			return;
		}
		if (this.mesh.isModified === false) {
			return;
		}
		this.data.setMeshData(this.mesh);
		this.mesh.isModified = false;
	}
	
	toJSON(): Object {
		var json = super.toJSON();
		Object.assign(json, {
			_type: "MeshFilter",
			mesh: this.mesh.toJSON()
		});
		return json;
	}

	static fromJSON(app: Tea.App, json: any): MeshFilter {
		if (json == null || json._type !== "MeshFilter") {
			return null;
		}
		var meshFilter = new MeshFilter(app);
		//meshFilter.enabled = json.enabled;
		meshFilter.mesh = Tea.Mesh.fromJSON(app, json.mesh);
		return meshFilter;
	}
}
