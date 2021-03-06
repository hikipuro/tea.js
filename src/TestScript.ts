import * as Tea from "./tea/Tea";

export class TestScript extends Tea.Script {
	count: number = 0;
	speedY: number = 0;
	cube: Tea.Object3D;

	awake(): void {
		console.log("TestScript.awake");
	}

	start(): void {
		console.log("TestScript.start");
	}

	update(): void {
		//console.log(this.object3d.name);
		//console.log("update");
		this.count++;
		//this.position.x = Math.cos(Tea.radians(this.count)) * 5;
		//this.position.z = Math.sin(Tea.radians(this.count)) * 5;
		//console.log(this.count, this.position);

		this.rotate(0., 3., 0.);
		var r = this.renderer;
		var i = Math.sin(this.count / 40);
		r.material.mainTextureOffset.set(0.0, i);
		r.material.mainTextureScale.set(1.0 + i / 2.0, 1.0 + i / 2.0);

		var keyboard = this.app.keyboard;
		//console.log(keyboard.isDown(Keyboard.Keys.ArrowLeft));
		if (keyboard.isDown(Tea.Keyboard.Code.Space)) {
			console.log("down");
		}
		if (keyboard.isUp(Tea.Keyboard.Code.Space)) {
			console.log("up");
		}
		if (keyboard.isHeld(Tea.Keyboard.Code.Space)) {
			console.log("held");
		}

		var mouse = this.mouse;
		if (mouse.isMoved) {
			//this.speedY = mouse.x / this.app.width;
			//console.log(this.speedY);
			//console.log(mouse.x, mouse.y, mouse.prevX, mouse.prevY);
			//this.position.x = -0.5 + mouse.x / this.app.width;
			//this.position.y = 0.5 + mouse.y / this.app.height;
			var p = mouse.position;
			p.z = 10;
			p = this.object3d.scene.mainCamera.screenToWorldPoint(p);
			this.localPosition = p;
			//console.log(p.toString());
		}
		//this.localPosition.z = Math.sin(this.count / 40) * 3.5 - 5;
		if (mouse.isDown(0)) {
			//console.log("mouse down");
			var p2 = new Tea.Vector3(mouse.x, mouse.y, 10);
			var p = this.object3d.scene.mainCamera.screenToViewportPoint(p2);
			//console.log(p);
			this.object3d.destroy();
			return;
		}
		if (mouse.isUp(0)) {
			//console.log("mouse up");
		}
		if (mouse.wheelX != 0) {
			var camera = this.scene.mainCamera;
			var rotation = camera.object3d.rotation;
			rotation.rotateEuler(0, mouse.wheelX / 10, 0);
		}
		if (mouse.wheelY != 0) {
			/*
			var camera = this.scene.mainCamera;
			var fov = camera.fieldOfView;
			fov += mouse.wheelY / 3;
			fov = Math.min(120, fov);
			fov = Math.max(20, fov);
			camera.fieldOfView = fov;
			*/
			var camera = this.scene.mainCamera;
			var rotation = camera.object3d.rotation;
			rotation.rotateEuler(mouse.wheelY / 10, 0, 0);
		}

		var gamepad = this.gamepad;
		var axisX = gamepad.axis(0, 0);
		if (Math.abs(axisX) > 0.2) {
			this.object3d.translate(axisX / 10, 0, 0);
		}
		var axisY = gamepad.axis(0, 1);
		if (Math.abs(axisY) > 0.2) {
			this.object3d.translate(0, -axisY / 10, 0);
		}

		var box1 = this.object3d.getComponent(Tea.BoxCollider);
		var box2 = this.cube.getComponent(Tea.BoxCollider);
		if (box2 != null) {
			var r = this.cube.getComponent(Tea.Renderer);
			//console.log(box1.toString());
			if (Tea.HitTest.boxBox(box1, box2)) {
				//console.log("true");
				r.material.color = Tea.Color.red;
			} else {
				//console.log("false");
				r.material.color = Tea.Color.white;
			}
		}

		//console.log(this.app.keyboard._keys);
	}

	lateUpdate(): void {
		//console.log("TestScript lateUpdate");
	}
}
