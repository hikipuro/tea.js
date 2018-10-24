import * as Tea from "../Tea";
import { Mouse } from "../Mouse";
import { Script } from "../components/Script";
import { Keyboard } from "../Keyboard";

export class SceneMovement extends Script {
	moveSpeed: number = 0.2;
	rotateSpeed: number = 0.2;

	constructor(app: Tea.App) {
		super(app);
	}

	update(): void {
		var mouse = this.mouse;
		if (mouse.isDown(Mouse.Button.Right)) {
			document.addEventListener("mousemove", this.onMouseMove);
			window.addEventListener("mouseup", this.onMouseUp);
			document.body.requestPointerLock();
		}
		var wheelY = mouse.wheelY;
		if (wheelY !== 0) {
			var object3d = this.object3d;
			object3d.translate(
				object3d.forward.mul$(wheelY * 0.05)
			);
		}
		if (mouse.isHeld(Mouse.Button.Right)) {
			this.move();
		}
	}

	protected move(): void {
		var keyboard = this.keyboard;
		var object3d = this.object3d;
		var speed = this.moveSpeed;

		if (keyboard.isHeld(Keyboard.Code.ShiftLeft)
		|| keyboard.isHeld(Keyboard.Code.ShiftRight)) {
			speed *= 3;
		}

		if (keyboard.isHeld(Keyboard.Code.KeyW)) {
			object3d.translate(
				object3d.forward.mul$(speed)
			);
		} else if (keyboard.isHeld(Keyboard.Code.KeyS)) {
			object3d.translate(
				object3d.forward.mul$(-speed)
			);
		}
		if (keyboard.isHeld(Keyboard.Code.KeyD)) {
			object3d.translate(
				object3d.right.mul$(speed)
			);
		} else if (keyboard.isHeld(Keyboard.Code.KeyA)) {
			object3d.translate(
				object3d.right.mul$(-speed)
			);
		}
		if (keyboard.isHeld(Keyboard.Code.KeyE)) {
			object3d.translate(
				object3d.up.mul$(speed)
			);
		} else if (keyboard.isHeld(Keyboard.Code.KeyQ)) {
			object3d.translate(
				object3d.up.mul$(-speed)
			);
		}
	}

	protected onMouseMove = (e: MouseEvent): void => {
		var x = e.movementX;
		var y = e.movementY;
		var object3d = this.object3d;
		if (x !== 0) {
			x *= this.rotateSpeed;
			object3d.rotateAround(
				object3d.position, Tea.Vector3.up, x
			);
		}
		if (y !== 0) {
			y *= this.rotateSpeed;
			object3d.rotateAround(
				object3d.position, object3d.right, y
			);
		}
	}

	protected onMouseUp = (e: MouseEvent): void => {
		document.removeEventListener("mousemove", this.onMouseMove);
		window.removeEventListener("mouseup", this.onMouseUp);
		document.exitPointerLock();
	}
}
