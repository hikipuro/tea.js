import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../Tea";
import { ComponentPanel } from "./components/ComponentPanel";
import { Translator } from "./translate/Translator";

@Component({
	template: `
		<div class="ObjectInspector">
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
				@update="onUpdatePosition"
				@change="onChangePosition">{{ translator.position }}</Vector3>
			<Vector3
				ref="rotation"
				:x="rotation[0]"
				:y="rotation[1]"
				:z="rotation[2]"
				@update="onUpdateRotation"
				@change="onChangeRotation">{{ translator.rotation }}</Vector3>
			<Vector3
				ref="scale"
				:x="scale[0]"
				:y="scale[1]"
				:z="scale[2]"
				@update="onUpdateScale"
				@change="onChangeScale">{{ translator.scale }}</Vector3>
			<ComponentPanel
				ref="components"
				v-for="(item, index) in components"
				:type="item"
				:key="index"
				@update="onUpdateComponent"
				@change="onChangeComponent"
				@config="onComponentMenu">
			</ComponentPanel>
			<div class="AddComponent">
				<button
					@click="onClickAddComponent">
					{{ translator.addComponent }}
				</button>
			</div>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "",
			isActive: false,
			position: [0, 0, 0],
			rotation: [0, 0, 0],
			scale: [0, 0, 0],
			components: []
		}
	},
	components: {
		ComponentPanel: ComponentPanel
	}
})
export class ObjectInspector extends Vue {
	_object3d: Tea.Object3D;
	translator: any;
	name: string;
	isActive: boolean;
	position: Array<number>;
	rotation: Array<number>;
	scale: Array<number>;
	components: Array<Vue>;
	_configComponent: Tea.Component;

	setObject3D(object3d: Tea.Object3D): void {
		if (object3d == null) {
			return;
		}
		this._object3d = object3d;
		this.name = object3d.name;
		this.isActive = object3d.isActive;
		this.setPosition(object3d.localPosition);
		this.setRotation(object3d.localRotation.eulerAngles);
		this.setScale(object3d.localScale);
		this.clearComponents();
		var components = object3d.getComponents(Tea.Component);
		components.forEach((component: Tea.Component) => {
			//console.log(component.editorView);
			var componentClass = component.constructor as any;
			var editorView = componentClass.editorView;
			if (editorView == null) {
				if (component instanceof Tea.Script) {
					editorView = Tea.Script.editorView;
				}
			}
			if (editorView == null) {
				return;
			}
			componentClass = undefined;
			var vue = editorView.extend({
				created: function () {
					(this as any)._component = component;
					editorView = undefined;
					component = undefined;
				}
			});
			this.components.push(vue);
		});
	}

	setPosition(value: Tea.Vector3): void {
		var x = value[0], y = value[1], z = value[2];
		x = Math.abs(x) < Tea.Mathf.Epsilon ? 0 : x;
		y = Math.abs(y) < Tea.Mathf.Epsilon ? 0 : y;
		z = Math.abs(z) < Tea.Mathf.Epsilon ? 0 : z;
		var position = this.position;
		this.$set(position, 0, x);
		this.$set(position, 1, y);
		this.$set(position, 2, z);
	}

	setRotation(value: Tea.Vector3): void {
		var x = value[0], y = value[1], z = value[2];
		x = Math.abs(x) < Tea.Mathf.Epsilon ? 0 : x;
		y = Math.abs(y) < Tea.Mathf.Epsilon ? 0 : y;
		z = Math.abs(z) < Tea.Mathf.Epsilon ? 0 : z;
		if (Math.abs(y) === 180.0 && Math.abs(z) === 180.0) {
			x = 180.0 - x;
			y = 0;
			z = 0;
		}
		var rotation = this.rotation;
		this.$set(rotation, 0, x);
		this.$set(rotation, 1, y);
		this.$set(rotation, 2, z);
	}

	setScale(value: Tea.Vector3): void {
		var x = value[0], y = value[1], z = value[2];
		x = Math.abs(x) < Tea.Mathf.Epsilon ? 0 : x;
		y = Math.abs(y) < Tea.Mathf.Epsilon ? 0 : y;
		z = Math.abs(z) < Tea.Mathf.Epsilon ? 0 : z;
		var scale = this.scale;
		this.$set(scale, 0, x);
		this.$set(scale, 1, y);
		this.$set(scale, 2, z);
	}

	hasFocus(): boolean {
		return this.$el.querySelector(":focus") != null;
	}

	clearComponents(): void {
		var components = this.components;
		components.splice(0, components.length);
	}

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "ObjectInspector";
		this.translator.position = translator.getText("Position");
		this.translator.rotation = translator.getText("Rotation");
		this.translator.scale = translator.getText("Scale");
		this.translator.addComponent = translator.getText("AddComponent");
	}

	protected onUpdateTitle(type: string, value: string | boolean): void {
		switch (type) {
			case "isActive":
				var bValue = value as boolean;
				this.isActive = bValue;
				if (this._object3d != null) {
					this._object3d.isActive = bValue;
				}
				this.$emit("update", "ObjectInspector", "isActive", bValue);
				break;
			case "name":
				var sValue = value as string;
				/*
				this._commands.addInspectorViewCommand("name", {
					object3d: this._object3d,
					name: this.name
				});
				this._commands.addInspectorViewCommand("name", {
					object3d: this._object3d,
					name: sValue
				});
				this._commands.runLastCommand();
				*/
				this.name = sValue;
				if (this._object3d != null) {
					this._object3d.name = sValue;
				}
				this.$emit("update", "ObjectInspector", "name", sValue);
				break;
		}
	}

	protected onUpdatePosition(x: number, y: number, z: number): void {
		var position = this.position;
		this.$set(position, 0, x);
		this.$set(position, 1, y);
		this.$set(position, 2, z);
		if (this._object3d != null) {
			this._object3d.localPosition.set(x, y, z);
		}
		this.$emit("update", "ObjectInspector", "position", position);
	}

	protected onUpdateRotation(x: number, y: number, z: number): void {
		var rotation = this.rotation;
		this.$set(rotation, 0, x);
		this.$set(rotation, 1, y);
		this.$set(rotation, 2, z);
		if (this._object3d != null) {
			this._object3d.localRotation.setEuler(x, y, z);
		}
		this.$emit("update", "ObjectInspector", "rotation", rotation);
	}

	protected onUpdateScale(x: number, y: number, z: number): void {
		var scale = this.scale;
		this.$set(scale, 0, x);
		this.$set(scale, 1, y);
		this.$set(scale, 2, z);
		if (this._object3d != null) {
			this._object3d.localScale.set(x, y, z);
		}
		this.$emit("update", "ObjectInspector", "rotation", scale);
	}

	protected onChangePosition(x: number, y: number, z: number): void {
		console.log("onChangePosition", x, y, z);
		this.$emit("change", "position", {
			x: x,
			y: y,
			z: z
		});
	}

	protected onChangeRotation(x: number, y: number, z: number): void {
		console.log("onChangeRotation", x, y, z);
		this.$emit("change", "rotation", {
			x: x,
			y: y,
			z: z
		});
	}

	protected onChangeScale(x: number, y: number, z: number): void {
		console.log("onChangeScale", x, y, z);
		this.$emit("change", "scale", {
			x: x,
			y: y,
			z: z
		});
	}

	protected onUpdateComponent(property: string, value: any): void {
		this.$emit("update", "ObjectInspector", property, value);
	}

	protected onChangeComponent(type: any, property: string, value: any): void {
		this.$emit("change", type, property, value);
	}

	protected onComponentMenu(component: Tea.Component): void {
		if (component == null) {
			return;
		}
		this._configComponent = component;
		this.$emit("menu", "component", component);
	}

	protected onClickAddComponent(): void {
		this.$emit("menu", "addComponent");
	}
}
