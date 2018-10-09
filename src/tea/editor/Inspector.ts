import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../Tea";

@Component({
	template: `
		<div
			class="Inspector">
			<template v-if="isVisible">
			<div class="name">{{ name }}</div>
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
			<component
				ref="components"
				v-for="(item, index) in components"
				:is="item"
				:key="index">
			</component>
			</template>
		</div>
	`,
	data: () => { return {
		isVisible: false,
		name: "",
		position: [0, 0, 0],
		rotation: [0, 0, 0],
		scale: [0, 0, 0],
		components: []
	}}
})
export class Inspector extends Vue {
	isVisible: boolean;
	name: string;
	position: Array<number>;
	rotation: Array<number>;
	scale: Array<number>;
	components: Array<any>;

	get lastComponent(): Vue {
		var components = this.$refs.components as Vue[];
		return components[components.length - 1];
	}

	setPosition(value: Tea.Vector3): void {
		var position = this.position;
		Vue.set(position, 0, value[0]);
		Vue.set(position, 1, value[1]);
		Vue.set(position, 2, value[2]);
	}

	setRotation(value: Tea.Vector3): void {
		var rotation = this.rotation;
		Vue.set(rotation, 0, value[0]);
		Vue.set(rotation, 1, value[1]);
		Vue.set(rotation, 2, value[2]);
	}

	setScale(value: Tea.Vector3): void {
		var scale = this.scale;
		Vue.set(scale, 0, value[0]);
		Vue.set(scale, 1, value[1]);
		Vue.set(scale, 2, value[2]);
	}

	show(): void {
		this.isVisible = true;
	}

	hide(): void {
		this.isVisible = false;
	}

	hasFocus(): boolean {
		return this.$el.querySelector(":focus") != null;
	}

	clearComponents(): void {
		var components = this.components;
		components.splice(0, components.length);
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
