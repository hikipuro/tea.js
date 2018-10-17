import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { ComponentBase } from "./ComponentBase";

@Component({
	template: `
		<div
			class="Component Light">
			<ComponentTitle
				ref="title"
				:enabled="enabled"
				@update="onUpdateEnabled"
				@config="onClickConfig">{{ name }}</ComponentTitle>
			<SelectEnum
				ref="type"
				:value="type"
				@update="onUpdateType">Type</SelectEnum>
			<ColorPicker
				ref="color"
				:value="color"
				@update="onUpdateColor">Color</ColorPicker>
			<InputNumber
				ref="intensity"
				class="Intensity"
				:value="intensity"
				@update="onUpdateIntensity">Intensity</InputNumber>
		</div>
	`,
	data: () => {
		return {
			name: "Light",
			type: "",
			color: "",
			intensity: 0,
		}
	}
})
export class Light extends ComponentBase {
	_component: Tea.Light;
	type: string;
	color: string;
	intensity: number;

	mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		var type = this.$refs.type as Vue;
		type.$data.keys = Tea.LightType.getKeys();
		this.$nextTick(() => {
			this.type = Tea.LightType[component.type];
		});
		this.color = component.color.toCssColor();
		this.intensity = component.intensity;
	}

	protected onUpdateType(value: string): void {
		this.type = value;
		if (this._component) {
			this._component.type = Tea.LightType[value];
		}
	}

	protected onUpdateColor(value: string): void {
		this.color = value;
		if (this._component) {
			this._component.color.setCssColor(value);
		}
	}

	protected onUpdateIntensity(value: number): void {
		if (value < 0) {
			value = 0;
		}
		this.intensity = value;
		if (this._component) {
			this._component.intensity = value;
		}
	}
}
