import * as Tea from "../Tea";
import { Object3D } from "./Object3D";
import { Rect } from "../math/Rect";

export class Camera extends Object3D {
	fieldOfView: number;
	nearClipPlane: number;
	farClipPlane: number;
	aspect: number;
	backgroundColor: Tea.Color;
	orthographic: boolean;
	orthographicSize: number;
	rect: Rect;

	constructor() {
		super(null);
		this.position = new Tea.Vector3(0, 1, 10);
		this.fieldOfView = 60;
		this.nearClipPlane = 0.3;
		this.farClipPlane = 1000;
		this.aspect = 1;
		this.backgroundColor = Tea.Color.background;
		this.orthographic = false;
		this.orthographicSize = 5;
		this.rect = new Rect(0, 0, 1, 1);
	}
	
	vpMatrix(width: number, height: number): Tea.Matrix4 {
		const aspect = width / height;
		let view = Tea.Matrix4.translate(this.position);
		view = view.mul(Tea.Matrix4.rotateZXY(this.rotation));
		view = view.inverse;

		let projection: Tea.Matrix4;
		if (this.orthographic) {
			projection = projection.mul(Tea.Matrix4.ortho(
				this.orthographicSize,
				aspect,
				this.nearClipPlane,
				this.farClipPlane
			));
		} else {
			projection = Tea.Matrix4.perspective(
				this.fieldOfView,
				aspect,
				this.nearClipPlane,
				this.farClipPlane
			);
		}
		
		return projection.mul(view);
	}

	mvpMatrix(width: number, height: number, model: Tea.Matrix4): Tea.Matrix4 {
		return this.vpMatrix(width, height).mul(model);
	}

	/*
	lookAt(eye): void {
		this.vMatrix = Matrix4.identity;
		this.vMatrix = this.vMatrix.lookAt(eye, [0, 0, 0], [0, 1, 0]);
	}
	*/
}
