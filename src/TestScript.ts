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
		if (keyboard.isDown(Tea.Keyboard.Codes.Space)) {
			console.log("down");
		}
		if (keyboard.isUp(Tea.Keyboard.Codes.Space)) {
			console.log("up");
		}
		if (keyboard.isHeld(Tea.Keyboard.Codes.Space)) {
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
		}
		if (mouse.isUp(0)) {
			//console.log("mouse up");
		}
		if (mouse.wheelY != 0) {
			var camera = this.scene.mainCamera;
			var fov = camera.fieldOfView;
			fov += mouse.wheelY / 3;
			fov = Math.min(120, fov);
			fov = Math.max(20, fov);
			camera.fieldOfView = fov;
		}

		var box1 = this.object3d.getComponent(Tea.BoxCollider);
		var box2 = this.cube.getComponent(Tea.BoxCollider);
		var r = this.cube.getComponent(Tea.Renderer);
		//console.log(box1.toString());
		if (box1.testBoxCollider(box2)) {
			//console.log("true");
			r.material.color = Tea.Color.red;
		} else {
			//console.log("false");
			r.material.color = Tea.Color.white;
		}

		//console.log(this.app.keyboard._keys);
	}

	lateUpdate(): void {
		//console.log("TestScript lateUpdate");
	}
}
