import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../Tea";

@Component({
	template: `
		<div class="SceneInspector">
			Scene Settings
			<Vector3
				ref="gravity"
				:x="gravity[0]"
				:y="gravity[1]"
				:z="gravity[2]"
				@update="onUpdateGravity">
				Gravity
			</Vector3>
			<ColorPicker
				ref="ambientLight"
				:value="ambientLight"
				@update="onUpdateAmbientLight">Ambient Light</ColorPicker>
		</div>
	`,
	data: () => {
		return {
			gravity: [0, 0, 0],
			ambientLight: ""
		}
	}
})
export class SceneInspector extends Vue {
	_scene: Tea.Scene;
	gravity: Array<number>;
	ambientLight: string;

	protected mounted(): void {
		var scene = this._scene;
		if (scene == null) {
			return;
		}
		this.setGravity(scene.physics.gravity);
		this.ambientLight = scene.renderSettings.ambientLight.toCssColor();
	}

	setGravity(value: Tea.Vector3): void {
		var x = value[0], y = value[1], z = value[2];
		x = Math.abs(x) < Tea.Mathf.Epsilon ? 0 : x;
		y = Math.abs(y) < Tea.Mathf.Epsilon ? 0 : y;
		z = Math.abs(z) < Tea.Mathf.Epsilon ? 0 : z;
		var gravity = this.gravity;
		this.$set(gravity, 0, x);
		this.$set(gravity, 1, y);
		this.$set(gravity, 2, z);
	}

	protected onUpdateGravity(x: number, y: number, z: number): void {
		var gravity = this.gravity;
		this.$set(gravity, 0, x);
		this.$set(gravity, 1, y);
		this.$set(gravity, 2, z);
		if (this._scene != null) {
			this._scene.physics.gravity.set(x, y, z);
		}
		this.$emit("update", "gravity");
	}

	protected onUpdateAmbientLight(value: Tea.Color): void {
		this.ambientLight = value.toCssColor();
		if (this._scene) {
			this._scene.renderSettings.ambientLight.copy(value);
		}
		this.$emit("update", "ambientLight");
	}
}
