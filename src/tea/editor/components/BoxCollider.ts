import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { ComponentBase } from "./ComponentBase";

@Component({
	template: `
		<div
			class="Component BoxCollider">
			<ComponentTitle
				ref="title"
				:enabled="enabled"
				@update="onUpdateEnabled"
				@config="onClickConfig">{{ name }}</ComponentTitle>
			<Vector3
				ref="center"
				@update="onUpdateCenter">
				Center
			</Vector3>
			<Vector3
				ref="size"
				@update="onUpdateSize">
				Size
			</Vector3>
		</div>
	`,
	data: () => {
		return {
			name: "BoxCollider",
		}
	}
})
export class BoxCollider extends ComponentBase {
	_component: Tea.BoxCollider;

	mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.setCenter(component.center);
		this.setSize(component.size);
	}

	setCenter(value: Tea.Vector3): void {
		var center = this.$refs.center as Tea.Editor.Vector3;
		var x = value[0], y = value[1], z = value[2];
		x = Math.abs(x) < Tea.Mathf.Epsilon ? 0 : x;
		y = Math.abs(y) < Tea.Mathf.Epsilon ? 0 : y;
		z = Math.abs(z) < Tea.Mathf.Epsilon ? 0 : z;
		center.x = x;
		center.y = y;
		center.z = z;
	}

	setSize(value: Tea.Vector3): void {
		var size = this.$refs.size as Tea.Editor.Vector3;
		var x = value[0], y = value[1], z = value[2];
		x = Math.abs(x) < Tea.Mathf.Epsilon ? 0 : x;
		y = Math.abs(y) < Tea.Mathf.Epsilon ? 0 : y;
		z = Math.abs(z) < Tea.Mathf.Epsilon ? 0 : z;
		size.x = x;
		size.y = y;
		size.z = z;
	}

	protected onUpdateCenter(x: number, y: number, z: number): void {
		if (this._component != null) {
			this._component.center.set(x, y, z);
		}
	}

	protected onUpdateSize(x: number, y: number, z: number): void {
		if (this._component != null) {
			this._component.size.set(x, y, z);
		}
	}
}
