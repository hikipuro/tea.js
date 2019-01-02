import * as Tea from "../Tea";
import { Object3D } from "./Object3D";

export class Object3DStatus {
	position: Tea.Vector3;
	rotation: Tea.Quaternion;
	scale: Tea.Vector3;
	localToWorldMatrix: Tea.Matrix4x4;
	isMovedPrevFrame: boolean;
	protected _worldToLocalMatrix: Tea.Matrix4x4;

	constructor() {
		this.position = new Tea.Vector3(0.001, 0.002, 0.003);
		this.rotation = new Tea.Quaternion(0.001, 0.002, 0.003);
		this.scale = new Tea.Vector3(0.001, 0.002, 0.003);
		this.localToWorldMatrix = new Tea.Matrix4x4();
		this._worldToLocalMatrix = null;
	}

	get worldToLocalMatrix(): Tea.Matrix4x4 {
		if (this._worldToLocalMatrix == null) {
			this._worldToLocalMatrix = this.localToWorldMatrix.inverse;
		}
		return this._worldToLocalMatrix;
	}

	destroy(): void {
		this.position = undefined;
		this.rotation = undefined;
		this.scale = undefined;
		this.localToWorldMatrix = undefined;
		this._worldToLocalMatrix = undefined;
	}

	update(object3d: Object3D): void {
		var p = null, r = null, s = null;
		if (object3d.parent == null) {
			p = object3d.localPosition;
			r = object3d.localRotation;
			s = object3d.localScale;
		} else {
			p = object3d.position;
			r = object3d.rotation;
			s = object3d.scale;
		}
		var tp = this.position;
		var tr = this.rotation;
		var ts = this.scale;
		var isMoved = false;
		if (tp[0] !== p[0]
		||  tp[1] !== p[1]
		||  tp[2] !== p[2]) {
			isMoved = true;
			tp[0] = p[0];
			tp[1] = p[1];
			tp[2] = p[2];
		}
		if (tr[0] !== r[0]
		||  tr[1] !== r[1]
		||  tr[2] !== r[2]
		||  tr[3] !== r[3]) {
			isMoved = true;
			tr[0] = r[0];
			tr[1] = r[1];
			tr[2] = r[2];
			tr[3] = r[3];
		}
		if (ts[0] !== s[0]
		||  ts[1] !== s[1]
		||  ts[2] !== s[2]) {
			isMoved = true;
			ts[0] = s[0];
			ts[1] = s[1];
			ts[2] = s[2];
		}
		this.isMovedPrevFrame = isMoved;
		if (isMoved === false) {
			return;
		}
		this.localToWorldMatrix.setTRS(
			tp, tr, ts
		);
		//this.localToWorldMatrix.toggleHand();
		var m = this.localToWorldMatrix;
		m[8]  *= -1.0;
		m[9]  *= -1.0;
		m[10] *= -1.0;
		m[11] *= -1.0;
		this._worldToLocalMatrix = null;
	}
}
