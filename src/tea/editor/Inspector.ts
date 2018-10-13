import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../Tea";

@Component({
	template: `
		<div class="AddComponent">
			<button>
				<slot></slot>
			</button>
		</div>
	`,
	props: {
	}
})
export class AddComponent extends Vue {
	protected onUpdateNear(value: number): void {
		this.$emit("update", "near", value);
	}

	protected onUpdateFar(value: number): void {
		this.$emit("update", "far", value);
	}
}

@Component({
	template: `
		<div
			class="Inspector">
			<template v-if="isVisible">
			<ObjectTitle
				ref="title"
				:isActive="isActive"
				:name="name"
				@update="onUpdateTitle"></ObjectTitle>
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
				:key="index"
				@config="onConfig">
			</component>
			<AddComponent>Add Component</AddComponent>
			</template>
		</div>
	`,
	data: () => { return {
		isVisible: false,
		name: "",
		isActive: false,
		position: [0, 0, 0],
		rotation: [0, 0, 0],
		scale: [0, 0, 0],
		components: []
	}},
	components: {
		"AddComponent": AddComponent
	}
})
export class Inspector extends Vue {
	_object3d: Tea.Object3D;
	isVisible: boolean;
	name: string;
	isActive: boolean;
	position: Array<number>;
	rotation: Array<number>;
	scale: Array<number>;
	components: Array<any>;
	_configComponent: Tea.Component;

	get lastComponent(): Vue {
		var components = this.$refs.components as Vue[];
		return components[components.length - 1];
	}

	setObject3D(object3d: Tea.Object3D): void {
		if (object3d == null) {
			return;
		}
		this._object3d = object3d;
		this.name = object3d.name;
		this.isActive = object3d.isActive;
		this.clearComponents();
		var components = object3d.getComponents(Tea.Component);
		components.forEach((component: Tea.Component) => {
			//console.log(component.editorView);
			var componentClass = component.constructor as any;
			var editorView = componentClass.editorView;
			if (editorView == null) {
				return;
			}
			var vue = editorView.extend({
				created: function () {
					(this as any)._component = component;
				}
			});
			this.components.push(vue);
		});
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

	protected onUpdateTitle(type: string, value: string | boolean): void {
		switch (type) {
			case "isActive":
				var bValue = value as boolean;
				this.isActive = bValue;
				if (this._object3d != null) {
					this._object3d.isActive = bValue;
				}
				break;
			case "name":
				var sValue = value as string;
				this.name = sValue;
				if (this._object3d != null) {
					this._object3d.name = sValue;
				}
				this.$emit("update", "name", sValue);
				break;
		}
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

	protected onConfig(component: Tea.Component): void {
		this._configComponent = component;
		this.$emit("config", component);
	}
}
