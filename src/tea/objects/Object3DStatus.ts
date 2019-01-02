import * as Tea from "../Tea";
import { Object3D } from "./Object3D";

export class Object3DStatus {
	position: Tea.Vector3;
	rotation: Tea.Quaternion;
	scale: Tea.Vector3;
	localToWorldMatrix: Tea.Matrix4x4;
	worldToLocalMatrix: Tea.Matrix4x4;
	isMovedPrevFrame: boolean;

	constructor() {
		this.position = new Tea.Vector3(0.001, 0.002, 0.003);
		this.rotation = new Tea.Quaternion(0.001, 0.002, 0.003);
		this.scale = new Tea.Vector3(0.001, 0.002, 0.003);
		this.localToWorldMatrix = new Tea.Matrix4x4();
		this.worldToLocalMatrix = new Tea.Matrix4x4();
	}

	destroy(): void {
		this.position = undefined;
		this.rotation = undefined;
		this.scale = undefined;
		this.localToWorldMatrix = undefined;
		this.worldToLocalMatrix = undefined;
	}

	update(object3d: Object3D): void {
		var isMoved = this.isMoved(object3d);
		this.isMovedPrevFrame = isMoved;
		if (isMoved) {
			this.trs();
		}
	}

	isMoved(object3d: Object3D): boolean {
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
		var b = false;
		if (!this.position.equals(p)) {
			b = true;
			this.position.copy(p);
		}
		if (!this.rotation.equals(r)) {
			b = true;
			this.rotation.copy(r);
		}
		if (!this.scale.equals(s)) {
			b = true;
			this.scale.copy(s);
		}
		return b;
	}

	trs(): void {
		this.localToWorldMatrix.setTRS(
			this.position,
			this.rotation,
			this.scale
		);
		this.localToWorldMatrix.toggleHand();
		this.worldToLocalMatrix = this.localToWorldMatrix.inverse;
	}
}
