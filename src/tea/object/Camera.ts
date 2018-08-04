import * as Tea from "../Tea";
import { Object3D } from "./Object3D";

export class Camera extends Object3D {
	fieldOfView: number;
	nearClipPlane: number;
	farClipPlane: number;
	aspect: number;
	backgroundColor: Tea.Color;
	orthographic: boolean;
	orthographicSize: number;

	constructor() {
		super();
		this.position = new Tea.Vector3(0, 1, 10);
		this.fieldOfView = 60;
		this.nearClipPlane = 0.3;
		this.farClipPlane = 1000;
		this.aspect = 1;
		this.backgroundColor = Tea.Color.background;
		this.orthographic = false;
		this.orthographicSize = 5;
	}
	
	get vpMatrix(): Tea.Matrix4 {
		const rotation = this.rotation.clone().mul(-1);
		const position = this.position.clone().mul(-1);
		let view = Tea.Matrix4.identity;
		view = view.mul(Tea.Matrix4.rotateZYX(rotation));
		view = view.mul(Tea.Matrix4.translate(position));

		let projection = Tea.Matrix4.identity;
		if (this.orthographic) {
			projection = projection.mul(Tea.Matrix4.ortho(
				this.orthographicSize, this.aspect, this.nearClipPlane, this.farClipPlane
			));
		} else {
			projection = projection.mul(Tea.Matrix4.perspective(
				this.fieldOfView, this.aspect, this.nearClipPlane, this.farClipPlane
			));
		}
		
		let vp = projection.clone();
		vp = vp.mul(view);
		return vp;
	}

	mvpMatrix(mMatrix: Tea.Matrix4): Tea.Matrix4 {
		return this.vpMatrix.mul(mMatrix);
	}

	/*
	lookAt(eye): void {
		this.vMatrix = Matrix4.identity;
		this.vMatrix = this.vMatrix.lookAt(eye, [0, 0, 0], [0, 1, 0]);
	}
	*/
}
