import * as Tea from "../Tea";
import { Object3D } from "./Object3D";

export class Object3DStatus {
	position: Tea.Vector3;
	rotation: Tea.Quaternion;
	scale: Tea.Vector3;
	isMoved: boolean;
	protected _isDirty: boolean;
	protected _localToWorldMatrix: Tea.Matrix4x4;
	protected _worldToLocalMatrix: Tea.Matrix4x4;

	constructor() {
		this.position = new Tea.Vector3(Infinity);
		this.rotation = new Tea.Quaternion(Infinity);
		this.scale = new Tea.Vector3(Infinity);
		this.isMoved = true;
		this._isDirty = true;
		this._localToWorldMatrix = new Tea.Matrix4x4();
		this._worldToLocalMatrix = null;
	}

	get localToWorldMatrix(): Tea.Matrix4x4 {
		if (this._isDirty) {
			this._localToWorldMatrix.setTRS(
				this.position,
				this.rotation,
				this.scale
			);
			var m = this._localToWorldMatrix;
			m[8]  *= -1.0;
			m[9]  *= -1.0;
			m[10] *= -1.0;
			m[11] *= -1.0;
			this._isDirty = false;
		}
		return this._localToWorldMatrix;
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
		this.isMoved = undefined;
		this._isDirty = undefined;
		this._localToWorldMatrix = undefined;
		this._worldToLocalMatrix = undefined;
	}

	update(object3d: Object3D): void {
		var p = null, r = null, s = null;
		var parent = object3d.parent;
		var isMoved = false;
		if (parent == null) {
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
		this.isMoved = isMoved;
		if (isMoved === false) {
			return;
		}
		this._isDirty = true;
		this._worldToLocalMatrix = null;
	}
}
