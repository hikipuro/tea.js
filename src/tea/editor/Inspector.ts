import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../Tea";

@Component({
	template: `
		<div
			class="Inspector">
			<template v-if="isVisible">
			<div>{{ name }}</div>
			<Vector3
				ref="position"
				:x="position[0]"
				:y="position[1]"
				:z="position[2]"
				@update="onUpdatePosition">
				Position
			</Vector3>
			<Vector3
				ref="rotation"
				:x="rotation[0]"
				:y="rotation[1]"
				:z="rotation[2]"
				@update="onUpdateRotation">
				Rotation
			</Vector3>
			<Vector3
				ref="scale"
				:x="scale[0]"
				:y="scale[1]"
				:z="scale[2]"
				@update="onUpdateScale">
				Scale
			</Vector3>
			</template>
		</div>
	`,
	data: () => { return {
		isVisible: false,
		name: "",
		position: [0, 0, 0],
		rotation: [0, 0, 0],
		scale: [0, 0, 0]
	}}
})
export class Inspector extends Vue {
	isVisible: boolean;
	name: string;
	position: Array<number>;
	rotation: Array<number>;
	scale: Array<number>;

	/*
	protected _position: Tea.Vector3;

	setPosition(value: Tea.Vector3): void {
		this.position = value.clone();
		this._position = value;
	}
	*/

	show(): void {
		this.isVisible = true;
	}

	hide(): void {
		this.isVisible = false;
	}

	hasFocus(): boolean {
		return this.$el.querySelector(":focus") != null;
	}

	protected onUpdatePosition(x: number, y: number, z: number): void {
		this.position[0] = x;
		this.position[1] = y;
		this.position[2] = z;
		this.$forceUpdate();
		var value = new Tea.Vector3(x, y, z)
		this.$emit("update", "position", value);
	}

	protected onUpdateRotation(x: number, y: number, z: number): void {
		this.rotation[0] = x;
		this.rotation[1] = y;
		this.rotation[2] = z;
		this.$forceUpdate();
		var value = new Tea.Vector3(x, y, z)
		this.$emit("update", "rotation", value);
	}

	protected onUpdateScale(x: number, y: number, z: number): void {
		this.scale[0] = x;
		this.scale[1] = y;
		this.scale[2] = z;
		this.$forceUpdate();
		var value = new Tea.Vector3(x, y, z)
		this.$emit("update", "scale", value);
	}
}
