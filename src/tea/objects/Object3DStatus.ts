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
	protected static _tmpPosition: Tea.Vector3 = new Tea.Vector3();
	protected static _tmpRotation: Tea.Quaternion = new Tea.Quaternion();
	protected static _tmpScale: Tea.Vector3 = new Tea.Vector3();

	constructor() {
		this.position = new Tea.Vector3(Infinity);
		this.rotation = new Tea.Quaternion(Infinity);
		this.scale = new Tea.Vector3(Infinity);
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
		this._isDirty = undefined;
		this._localToWorldMatrix = undefined;
		this._worldToLocalMatrix = undefined;
	}

	updatePosition(object3d: Object3D, parentStatus: Object3DStatus): void {
		var parent = object3d.parent;
		var tp = this.position;
		if (parent == null) {
			var p = object3d.localPosition;
			tp[0] = p[0];
			tp[1] = p[1];
			tp[2] = p[2];
			return;
		}
		var status = parentStatus;
		var pp = status.position;
		var pr = status.rotation;
		var ps = status.scale;
		var localPosition = object3d.localPosition;
		tp[0] = localPosition[0] * ps[0];
		tp[1] = localPosition[1] * ps[1];
		tp[2] = localPosition[2] * ps[2];
		tp.applyQuaternion(pr);
		tp[0] += pp[0];
		tp[1] += pp[1];
		tp[2] += pp[2];
	}

	updateRotation(object3d: Object3D, parentStatus: Object3DStatus): void {
		var parent = object3d.parent;
		var tr = this.rotation;
		if (parent == null) {
			var r = object3d.localRotation;
			tr[0] = r[0];
			tr[1] = r[1];
			tr[2] = r[2];
			tr[3] = r[3];
			return;
		}
		var status = parentStatus;
		var pr = status.rotation;
		var localRotation = object3d.localRotation;
		tr[0] = localRotation[0];
		tr[1] = localRotation[1];
		tr[2] = localRotation[2];
		tr[3] = localRotation[3];
		var ax = pr[0], ay = pr[1], az = pr[2], aw = pr[3];
		var bx = tr[0], by = tr[1], bz = tr[2], bw = tr[3];
		tr[0] = aw * bx + bw * ax + ay * bz - by * az;
		tr[1] = aw * by + bw * ay + az * bx - bz * ax;
		tr[2] = aw * bz + bw * az + ax * by - bx * ay;
		tr[3] = aw * bw - ax * bx - ay * by - az * bz;
	}

	update(object3d: Object3D, parentStatus: Object3DStatus): void {
		var p = null, r = null, s = null;
		var parent = object3d.parent;
		var isMoved = true;
		if (parent == null) {
			p = object3d.localPosition;
			r = object3d.localRotation;
			s = object3d.localScale;
			isMoved = false;
		}
		/*
		 else if (!parent.isMoved) {
			if (this.isMovedLocal(object3d) === false) {
				return;
			}
		} 
		*/
		if (isMoved) {
			var status = parentStatus;
			var pp = status.position;
			var pr = status.rotation;
			var ps = status.scale;
			var localPosition = object3d.localPosition;
			var localRotation = object3d.localRotation;
			var localScale = object3d.localScale;
			p = Object3DStatus._tmpPosition;
			p[0] = localPosition[0];
			p[1] = localPosition[1];
			p[2] = localPosition[2];
			p[0] *= ps[0];
			p[1] *= ps[1];
			p[2] *= ps[2];
			p.applyQuaternion(pr);
			p[0] += pp[0];
			p[1] += pp[1];
			p[2] += pp[2];
			r = Object3DStatus._tmpRotation;
			r[0] = localRotation[0];
			r[1] = localRotation[1];
			r[2] = localRotation[2];
			r[3] = localRotation[3];
			var ax = pr[0], ay = pr[1], az = pr[2], aw = pr[3];
			var bx = r[0], by = r[1], bz = r[2], bw = r[3];
			r[0] = aw * bx + bw * ax + ay * bz - by * az;
			r[1] = aw * by + bw * ay + az * bx - bz * ax;
			r[2] = aw * bz + bw * az + ax * by - bx * ay;
			r[3] = aw * bw - ax * bx - ay * by - az * bz;
			s = Object3DStatus._tmpScale;
			s[0] = localScale[0] * ps[0];
			s[1] = localScale[1] * ps[1];
			s[2] = localScale[2] * ps[2];
			//p = object3d.position;
			//r = object3d.rotation;
			//s = object3d.scale;
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
		/*
		this.localToWorldMatrix.setTRS(
			tp, tr, ts
		);
		//this.localToWorldMatrix.toggleHand();
		var m = this.localToWorldMatrix;
		m[8]  *= -1.0;
		m[9]  *= -1.0;
		m[10] *= -1.0;
		m[11] *= -1.0;
		*/
		this._worldToLocalMatrix = null;
	}

	protected isMovedLocal(object3d: Tea.Object3D): boolean {
		var p = object3d.position;
		var tp = this.position;
		if (tp[0] !== p[0]
		||  tp[1] !== p[1]
		||  tp[2] !== p[2]) {
			return true;
		}
		var r = object3d.rotation;
		var tr = this.rotation;
		if (tr[0] !== r[0]
		||  tr[1] !== r[1]
		||  tr[2] !== r[2]
		||  tr[3] !== r[3]) {
			return true;
		}
		var s = object3d.scale;
		var ts = this.scale;
		if (ts[0] !== s[0]
		||  ts[1] !== s[1]
		||  ts[2] !== s[2]) {
			return true;
		}
		return false;
	}
}
