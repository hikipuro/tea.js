import * as Tea from "./tea/Tea";

export class TestScript extends Tea.Script {
	count: number = 0;

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
		this.rotation.y = Tea.radians(this.count / 3);
	}
}
