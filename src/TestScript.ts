import * as Tea from "./tea/Tea";
import { Keyboard } from "./tea/Keyboard";

export class TestScript extends Tea.Script {
	count: number = 0;
	speedY: number = 0;

	start(): void {
		console.log("TestScript.start");
	}

	update(): void {
		//console.log("update");
		this.count++;
		//this.position.x = Math.cos(Tea.radians(this.count)) * 5;
		//this.position.z = Math.sin(Tea.radians(this.count)) * 5;
		//console.log(this.count, this.position);

		//this.rotation.x = Tea.radians(this.count / 3);
		this.rotation.y += Tea.radians(this.speedY * 2);

		const keyboard = this.app.keyboard;
		//console.log(keyboard.isDown(Keyboard.Keys.ArrowLeft));
		if (keyboard.isDown(Keyboard.Codes.Space)) {
			console.log("down");
		}
		if (keyboard.isUp(Keyboard.Codes.Space)) {
			console.log("up");
		}
		if (keyboard.isHeld(Keyboard.Codes.Space)) {
			console.log("held");
		}

		const mouse = this.app.mouse;
		if (mouse.isMoved) {
			this.speedY = mouse.x / this.app.width;
			//console.log(this.speedY);
			//console.log(mouse.x, mouse.y, mouse.prevX, mouse.prevY);
			this.position.x = -0.5 + mouse.x / this.app.width;
			this.position.y = 0.5 + mouse.y / this.app.height;
		}
		if (mouse.isDown(0)) {
			console.log("mouse down");
		}
		if (mouse.isUp(0)) {
			console.log("mouse up");
		}

		//console.log(this.app.keyboard._keys);
	}
}
