import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../Tea";
import { Translator } from "./translate/Translator";

@Component({
	template: `
		<div class="SceneInspector">
			<div class="title">{{ title }}</div>
			<CheckBox
				ref="antialias"
				:value="antialias"
				@update="onUpdateAntialias">{{ translator.antialias }}</CheckBox>
			<Vector3
				ref="gravity"
				:x="gravity[0]"
				:y="gravity[1]"
				:z="gravity[2]"
				@update="onUpdateGravity">
				{{ translator.gravity }}
			</Vector3>
			<ColorPicker
				ref="ambientLight"
				:value="ambientLight"
				@update="onUpdateAmbientLight">{{ translator.ambientLight }}</ColorPicker>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			title: "",
			antialias: false,
			gravity: [0, 0, 0],
			ambientLight: ""
		}
	}
})
export class SceneInspector extends Vue {
	_scene: Tea.Scene;
	translator: any;
	title: string;
	antialias: boolean;
	gravity: Array<number>;
	ambientLight: string;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "SceneInspector";
		this.title = translator.getText("Title");
		this.translator.antialias = translator.getText("Antialias");
		this.translator.gravity = translator.getText("Gravity");
		this.translator.ambientLight = translator.getText("AmbientLight");
	}

	protected mounted(): void {
		var scene = this._scene;
		if (scene == null) {
			return;
		}
		this.antialias = scene.enablePostProcessing;
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

	protected onUpdateAntialias(value: boolean): void {
		this.antialias = value;
		if (this._scene) {
			this._scene.enablePostProcessing = value;
		}
		this.$emit("update", "antialias");
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
