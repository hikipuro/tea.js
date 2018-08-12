import * as Tea from "./tea/Tea";

export class TestScript2 extends Tea.Script {
	count: number = 0;

	update(): void {
		//console.log(this.object3d.name);
		//console.log("update");
		this.count++;

		let r = this.object3d.renderer as Tea.LineRenderer;
		r.color = Tea.Color.fromHSB(this.count % 360 / 360, 1, 1);
	}
}
