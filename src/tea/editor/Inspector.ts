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
				@update="onUpdatePosition">
				Position
			</Vector3>
			<Vector3
				ref="rotation"
				@update="onUpdateRotation">
				Rotation
			</Vector3>
			<Vector3
				ref="scale"
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
		var position = this.$refs.position as Tea.Editor.Vector3;
		var x = value[0], y = value[1], z = value[2];
		x = Math.abs(x) < Tea.Mathf.Epsilon ? 0 : x;
		y = Math.abs(y) < Tea.Mathf.Epsilon ? 0 : y;
		z = Math.abs(z) < Tea.Mathf.Epsilon ? 0 : z;
		position.x = x;
		position.y = y;
		position.z = z;
	}

	setRotation(value: Tea.Vector3): void {
		var rotation = this.$refs.rotation as Tea.Editor.Vector3;
		var x = value[0], y = value[1], z = value[2];
		x = Math.abs(x) < Tea.Mathf.Epsilon ? 0 : x;
		y = Math.abs(y) < Tea.Mathf.Epsilon ? 0 : y;
		z = Math.abs(z) < Tea.Mathf.Epsilon ? 0 : z;
		if (Math.abs(y) === 180.0 && Math.abs(z) === 180.0) {
			x = 180.0 - x;
			y = 0;
			z = 0;
		}
		rotation.x = x;
		rotation.y = y;
		rotation.z = z;
	}

	setScale(value: Tea.Vector3): void {
		var scale = this.$refs.scale as Tea.Editor.Vector3;
		var x = value[0], y = value[1], z = value[2];
		x = Math.abs(x) < Tea.Mathf.Epsilon ? 0 : x;
		y = Math.abs(y) < Tea.Mathf.Epsilon ? 0 : y;
		z = Math.abs(z) < Tea.Mathf.Epsilon ? 0 : z;
		scale.x = x;
		scale.y = y;
		scale.z = z;
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
		//var value = new Tea.Vector3(x, y, z)
		//this.$emit("update", "position", value);
		if (this._object3d != null) {
			this._object3d.localPosition.set(x, y, z);
		}
	}

	protected onUpdateRotation(x: number, y: number, z: number): void {
		//var value = new Tea.Vector3(x, y, z)
		//this.$emit("update", "rotation", value);
		if (this._object3d != null) {
			this._object3d.localRotation.setEuler(x, y, z);
		}
		this.$emit("update", "rotation");
	}

	protected onUpdateScale(x: number, y: number, z: number): void {
		//var value = new Tea.Vector3(x, y, z)
		//this.$emit("update", "scale", value);
		if (this._object3d != null) {
			this._object3d.localScale.set(x, y, z);
		}
	}

	protected onConfig(component: Tea.Component): void {
		this._configComponent = component;
		this.$emit("config", component);
	}
}
