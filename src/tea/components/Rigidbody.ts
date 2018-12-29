import * as Tea from "../Tea";
import { Component } from "./Component";

export class Rigidbody extends Component {
	static readonly className: string = "Rigidbody";
	useGravity: boolean;
	mass: number;
	velocity: Tea.Vector3;
	angularVelocity: Tea.Vector3;
	drag: number;
	angularDrag: number;
	constraints: Tea.RigidbodyConstraints;
	protected _tmpVec3: Array<Tea.Vector3>;
	protected _isSleeping: boolean;
	protected _force: Tea.Vector3;
	protected _torque: Tea.Vector3;

	constructor(app: Tea.App) {
		super(app);
		this.useGravity = true;
		this.mass = 1.0;
		this.velocity = new Tea.Vector3();
		this.angularVelocity = new Tea.Vector3();
		this.drag = 0.0;
		this.angularDrag = 0.05;
		this.constraints = Tea.RigidbodyConstraints.None;
		this._tmpVec3 = [
			new Tea.Vector3(),
			new Tea.Vector3(),
			new Tea.Vector3()
		];
		this._isSleeping = false;
		this._force = new Tea.Vector3();
		this._torque = new Tea.Vector3();
	}

	get position(): Tea.Vector3 {
		return this.object3d.position;
	}
	set position(value: Tea.Vector3) {
		this.object3d.position = value;
	}

	get rotation(): Tea.Quaternion {
		return this.object3d.rotation;
	}
	set rotation(value: Tea.Quaternion) {
		this.object3d.rotation = value;
	}

	get isSleeping(): boolean {
		return this._isSleeping;
	}

	get freezeRotation(): boolean {
		return (
			this.constraints &
			Tea.RigidbodyConstraints.FreezeRotation
		) > 0;
	}
	set freezeRotation(value: boolean) {
		if (value) {
			this.constraints |= Tea.RigidbodyConstraints.FreezeRotation;
		} else {
			this.constraints &= ~Tea.RigidbodyConstraints.FreezeRotation;
		}
	}

	update(): void {
		if (this._isSleeping) {
			return;
		}
		if (this.app.scene == null) {
			return;
		}
		var time = 1.0 / 50.0;
		if (this._force.equals(Tea.Vector3.zero) === false) {
			var force = this._tmpVec3[0];
			force.copy(this._force);
			//force.divSelf(this.mass);
			force.mulSelf(time);
			this.velocity.addSelf(force);
			this._force.set(0.0, 0.0, 0.0);
		}
		if (this.drag > 0) {
			this.velocity.mulSelf(1.0 - (this.drag / 100.0));
		}
		if (this.useGravity) {
			var gravity = this._tmpVec3[0];
			gravity.copy(this.app.scene.physics.gravity);
			//gravity.mulSelf(0.5);
			//gravity.mulSelf(time);
			gravity.mulSelf(Math.pow(time, 2.0));
			this.velocity.addSelf(gravity);
			//console.log(this.velocity);
		}
		if (this.velocity.equals(Tea.Vector3.zero) === false) {
			if (Math.abs(this.velocity.x) < 0.0005) {
				this.velocity.x = 0.0;
			}
			if (Math.abs(this.velocity.y) < 0.0005) {
				this.velocity.y = 0.0;
			}
			if (Math.abs(this.velocity.z) < 0.0005) {
				this.velocity.z = 0.0;
			}
			var velocity = this._tmpVec3[0];
			velocity.copy(this.velocity);
			//velocity.mulSelf(time);
			this.addPosition(velocity);
		}
		
		if (this._torque.equals(Tea.Vector3.zero) === false) {
			this.angularVelocity.addSelf(this._torque);
			this._torque.set(0.0, 0.0, 0.0);
		}
		if (this.angularDrag > 0) {
			this.angularVelocity.mulSelf(1.0 - this.angularDrag);
		}
		if (this.angularVelocity.equals(Tea.Vector3.zero) === false) {
			if (Math.abs(this.angularVelocity.x) < 0.0005) {
				this.angularVelocity.x = 0.0;
			}
			if (Math.abs(this.angularVelocity.y) < 0.0005) {
				this.angularVelocity.y = 0.0;
			}
			if (Math.abs(this.angularVelocity.z) < 0.0005) {
				this.angularVelocity.z = 0.0;
			}
			var angularVelocity = this._tmpVec3[0];
			angularVelocity.copy(this.angularVelocity);
			//angularVelocity.mulSelf(time);
			this.object3d.rotation.rotateEuler(angularVelocity);
		}
	}

	sleep(): void {
		this._isSleeping = true;
	}

	wakeUp(): void {
		this._isSleeping = false;
	}

	addForce(x: number, y: number, z: number, mode?: Tea.ForceMode): void;
	addForce(force: Tea.Vector3, mode?: Tea.ForceMode): void;
	addForce(a: Tea.Vector3 | number, b: Tea.ForceMode | number, c?: number, d?: Tea.ForceMode): void {
		var force: Tea.Vector3;
		var mode: Tea.ForceMode;
		if (a instanceof Tea.Vector3) {
			force = this._tmpVec3[0];
			force.copy(a);
			mode = b as Tea.ForceMode;
		} else {
			force = this._tmpVec3[0];
			force.set(a, b, c);
			mode = d;
		}
		if (mode == null) {
			mode = Tea.ForceMode.Force;
		}
		var time = 1.0 / 50.0;
		switch (mode) {
			case Tea.ForceMode.Force:
				force.divSelf(this.mass);
				force.mulSelf(time);
				this._force.addSelf(force);
				break;
			case Tea.ForceMode.Impulse:
				force.divSelf(this.mass);
				this._force.addSelf(force);
				break;
			case Tea.ForceMode.Acceleration:
				force.mulSelf(time);
				this._force.addSelf(force);
				break;
			case Tea.ForceMode.VelocityChange:
				this._force.addSelf(force);
				break;
		}
	}

	addRelativeForce(x: number, y: number, z: number, mode?: Tea.ForceMode): void;
	addRelativeForce(force: Tea.Vector3, mode?: Tea.ForceMode): void;
	addRelativeForce(a: Tea.Vector3 | number, b: Tea.ForceMode | number, c?: number, d?: Tea.ForceMode): void {
		var force: Tea.Vector3;
		var mode: Tea.ForceMode;
		if (a instanceof Tea.Vector3) {
			force = this._tmpVec3[0];
			force.copy(a);
			mode = b as Tea.ForceMode;
		} else {
			force = this._tmpVec3[0];
			force.set(a, b, c);
			mode = d;
		}
		if (mode == null) {
			mode = Tea.ForceMode.Force;
		}
		force.applyQuaternion(this.object3d.rotation);
		var time = 1.0 / 50.0;
		switch (mode) {
			case Tea.ForceMode.Force:
				force.divSelf(this.mass);
				force.mulSelf(time);
				this._force.addSelf(force);
				break;
			case Tea.ForceMode.Impulse:
				force.divSelf(this.mass);
				this._force.addSelf(force);
				break;
			case Tea.ForceMode.Acceleration:
				force.mulSelf(time);
				this._force.addSelf(force);
				break;
			case Tea.ForceMode.VelocityChange:
				this._force.addSelf(force);
				break;
		}
	}

	addTorque(x: number, y: number, z: number, mode?: Tea.ForceMode): void;
	addTorque(torque: Tea.Vector3, mode?: Tea.ForceMode): void;
	addTorque(a: Tea.Vector3 | number, b: Tea.ForceMode | number, c?: number, d?: Tea.ForceMode): void {
		var torque: Tea.Vector3;
		var mode: Tea.ForceMode;
		if (a instanceof Tea.Vector3) {
			torque = this._tmpVec3[0];
			torque.copy(a);
			mode = b as Tea.ForceMode;
		} else {
			torque = this._tmpVec3[0];
			torque.set(a, b, c);
			mode = d;
		}
		if (mode == null) {
			mode = Tea.ForceMode.Force;
		}
		torque[0] *= -1.0;
		torque[2] *= -1.0;
		var time = 1.0 / 50.0;
		switch (mode) {
			case Tea.ForceMode.Force:
				torque.divSelf(this.mass);
				torque.mulSelf(time);
				this._torque.addSelf(torque);
				break;
			case Tea.ForceMode.Impulse:
				torque.divSelf(this.mass);
				this._torque.addSelf(torque);
				break;
			case Tea.ForceMode.Acceleration:
				torque.mulSelf(time);
				this._torque.addSelf(torque);
				break;
			case Tea.ForceMode.VelocityChange:
				this._torque.addSelf(torque);
				break;
		}
	}

	addRelativeTorque(x: number, y: number, z: number, mode?: Tea.ForceMode): void;
	addRelativeTorque(torque: Tea.Vector3, mode?: Tea.ForceMode): void;
	addRelativeTorque(a: Tea.Vector3 | number, b: Tea.ForceMode | number, c?: number, d?: Tea.ForceMode): void {
		var torque: Tea.Vector3;
		var mode: Tea.ForceMode;
		if (a instanceof Tea.Vector3) {
			torque = this._tmpVec3[0];
			torque.copy(a);
			mode = b as Tea.ForceMode;
		} else {
			torque = this._tmpVec3[0];
			torque.set(a, b, c);
			mode = d;
		}
		if (mode == null) {
			mode = Tea.ForceMode.Force;
		}
		torque.applyQuaternion(this.object3d.rotation);
		var time = 1.0 / 50.0;
		switch (mode) {
			case Tea.ForceMode.Force:
				torque.divSelf(this.mass);
				torque.mulSelf(time);
				this._torque.addSelf(torque);
				break;
			case Tea.ForceMode.Impulse:
				torque.divSelf(this.mass);
				this._torque.addSelf(torque);
				break;
			case Tea.ForceMode.Acceleration:
				torque.mulSelf(time);
				this._torque.addSelf(torque);
				break;
			case Tea.ForceMode.VelocityChange:
				this._torque.addSelf(torque);
				break;
		}
	}

	movePosition(position: Tea.Vector3): void {
		this.object3d.position = position;
	}

	moveRotation(rot: Tea.Quaternion): void {
		this.object3d.rotation = rot;
	}

	toJSON(): Object {
		var json = super.toJSON();
		json[Tea.JSONUtil.TypeName] = Rigidbody.className;
		return json;
	}

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, Rigidbody.className) === false) {
			callback(null);
			return;
		}
		var rigidbody = new Rigidbody(app);
		rigidbody.enabled = json.enabled;
		callback(rigidbody);
	}

	protected addPosition(position: Tea.Vector3): void {
		var p = this._tmpVec3[0];
		p.copy(position);
		var constraints = this.constraints;
		if ((constraints & Tea.RigidbodyConstraints.FreezePositionX) > 0) {
			p[0] = 0.0
		}
		if ((constraints & Tea.RigidbodyConstraints.FreezePositionY) > 0) {
			p[1] = 0.0
		}
		if ((constraints & Tea.RigidbodyConstraints.FreezePositionZ) > 0) {
			p[2] = 0.0
		}
		p.addSelf(this.object3d.position);
		this.object3d.position = p;
	}
}
