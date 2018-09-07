import * as Tea from "./tea/Tea";

export class TestScript2 extends Tea.Script {
	count: number = 0;

	update(): void {
		//console.log(this.object3d.name);
		//console.log("update");
		this.count++;

		var renderer = this.object3d.getComponent(Tea.LineRenderer);
		//var r = renderer as Tea.LineRenderer;
		renderer.material.color = Tea.Color.fromHSV(this.count % 360 / 360, 1, 1);
	}
}
