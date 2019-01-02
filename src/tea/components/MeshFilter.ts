import * as Tea from "../Tea";
import { Component } from "./Component";
import { BufferData } from "./BufferData";

export class MeshFilter extends Component {
	static readonly className: string = "MeshFilter";
	mesh: Tea.Mesh;
	//data: BufferData;
	
	constructor(app: Tea.App) {
		super(app);
		//this.data = new BufferData(app);
	}

	destroy(): void {
		if (this.mesh != null) {
			this.mesh.destroy();
			this.mesh = undefined;
		}
		/*
		if (this.data != null) {
			this.data.destroy();
			this.data = undefined;
		}
		*/
		super.destroy();
	}

	createData(): void {
		if (this.mesh == null) {
			return;
		}
		this.mesh.createData(this.app);
		/*
		if (this.mesh.isModified === false) {
			return;
		}
		this.data.setMeshData(this.mesh);
		this.mesh.isModified = false;
		*/
	}
	
	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = MeshFilter.className;
		json.mesh = this.mesh.toJSON();
		return json;
	}

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, MeshFilter.className) === false) {
			callback(null);
			return;
		}
		var meshFilter = new MeshFilter(app);
		//meshFilter.enabled = json.enabled;
		meshFilter.mesh = Tea.Mesh.fromJSON(app, json.mesh);
		callback(meshFilter);
	}
}
