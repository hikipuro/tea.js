import * as Tea from "./tea/Tea";

export class TestScript extends Tea.Script {
	count: number = 0;
	speedY: number = 0;

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

		//this.rotation.x = Tea.radians(this.count / 3);
		this.localRotation = this.localRotation.mul(Tea.Quaternion.euler(0, 3, 0));// Tea.radians(this.speedY * 2);
		var r = this.object3d.getComponent(Tea.Renderer);
		var i = Math.sin(this.count / 40);
		r.material.mainTextureOffset = new Tea.Vector2(0, i);
		r.material.mainTextureScale = new Tea.Vector2(1 + i / 2, 1 + i / 2);

		const keyboard = this.app.keyboard;
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

		const mouse = this.app.mouse;
		if (mouse.isMoved) {
			this.speedY = mouse.x / this.app.width;
			//console.log(this.speedY);
			//console.log(mouse.x, mouse.y, mouse.prevX, mouse.prevY);
			//this.position.x = -0.5 + mouse.x / this.app.width;
			//this.position.y = 0.5 + mouse.y / this.app.height;
			let p = new Tea.Vector3(mouse.x, mouse.y, 10);
			p = this.object3d.scene.camera.screenToWorldPoint(p);
			this.localPosition = p;
			//console.log(p.toString());
		}
		if (mouse.isDown(0)) {
			console.log("mouse down");
			let p2 = new Tea.Vector3(mouse.x, mouse.y, 10);
			const p = this.object3d.scene.camera.screenToViewportPoint(p2);
			console.log(p);
		}
		if (mouse.isUp(0)) {
			console.log("mouse up");
		}

		//console.log(this.app.keyboard._keys);
	}
}
