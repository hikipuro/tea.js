import * as Tea from "../../Tea";
import { Keyboard } from "../../input/Keyboard";
import { Mouse } from "../../input/Mouse";
import { Script } from "../../components/Script";
import { EditorSceneRenderer } from "./SceneRenderer";

export class SceneMovement extends Script {
	sceneRenderer: EditorSceneRenderer;
	moveSpeed: number = 0.2;
	rotateSpeed: number = 0.2;
	wheelSpeed: number = 0.05;

	constructor(app: Tea.App) {
		super(app);
	}

	update(): void {
		var mouse = this.mouse;
		if (mouse.isDown(Mouse.Button.Left)) {
			this.onMouseDownScreen(mouse.position);
		} else if (mouse.isDown(Mouse.Button.Right)) {
			document.addEventListener("mousemove", this.onMouseMove);
			window.addEventListener("mouseup", this.onMouseUp);
			document.body.requestPointerLock();
		} else if (mouse.isHeld(Mouse.Button.Right)) {
			this.move();
		}
		var wheelY = mouse.wheelY;
		if (wheelY !== 0) {
			var object3d = this.object3d;
			object3d.translate(
				object3d.forward.mul$(wheelY * -this.wheelSpeed)
			);
		}
	}

	protected move(): void {
		var keyboard = this.keyboard;
		var object3d = this.object3d;
		var speed = this.moveSpeed;
		var keyCode = Keyboard.Code;

		if (keyboard.isHeld(keyCode.ShiftLeft)
		|| keyboard.isHeld(keyCode.ShiftRight)) {
			speed *= 3;
		}

		if (keyboard.isHeld(keyCode.KeyW)) {
			object3d.translate(
				object3d.forward.mul$(speed)
			);
		} else if (keyboard.isHeld(keyCode.KeyS)) {
			object3d.translate(
				object3d.forward.mul$(-speed)
			);
		}
		if (keyboard.isHeld(keyCode.KeyD)) {
			object3d.translate(
				object3d.right.mul$(speed)
			);
		} else if (keyboard.isHeld(keyCode.KeyA)) {
			object3d.translate(
				object3d.right.mul$(-speed)
			);
		}
		if (keyboard.isHeld(keyCode.KeyE)) {
			object3d.translate(
				object3d.up.mul$(speed)
			);
		} else if (keyboard.isHeld(keyCode.KeyQ)) {
			object3d.translate(
				object3d.up.mul$(-speed)
			);
		}
	}

	protected hitTestScreen(children: Array<Tea.Object3D>, ray: Tea.Ray): Tea.Object3D {
		var target: Tea.Object3D = null;
		children.some((object3d: Tea.Object3D) => {
			var renderer = object3d.getComponent(Tea.MeshRenderer);
			if (renderer == null) {
				target = this.hitTestScreen(object3d.children, ray);
				return target != null;
			}
			var bounds = renderer.bounds;
			if (bounds == null) {
				target = this.hitTestScreen(object3d.children, ray);
				return target != null;
			}
			if (bounds.collideRay(ray)) {
				target = object3d;
				return true;
			}
			target = this.hitTestScreen(object3d.children, ray);
			return target != null;
			
		});
		return target;
	}

	protected onMouseDownScreen(position: Tea.Vector3): void {
		position.z = 1;
		var camera = this.sceneRenderer.camera;
		var scene = this.sceneRenderer.scene;
		var ray = camera.screenPointToRay(position);
		var target = this.hitTestScreen(scene.children, ray);
		var editor = this.sceneRenderer.editor;
		editor.behavior.sceneViewCommand("select", target);
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
