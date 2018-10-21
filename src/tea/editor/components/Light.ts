import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

@Component({
	template: `
		<div class="Light">
			<SelectEnum
				ref="type"
				name="type"
				:keys="typeKeys"
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
			enabled: false,
			typeKeys: [],
			type: "",
			color: "",
			intensity: 0,
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as Light;
			self._component.enabled = value;
		}
	}
})
export class Light extends Vue {
	_component: Tea.Light;
	name: string;
	enabled: boolean;
	typeKeys: Array<string>;
	type: string;
	color: string;
	intensity: number;

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
		this.typeKeys = Tea.LightType.getKeys();
		this.type = Tea.LightType[component.type];
		this.color = component.color.toCssColor();
		this.intensity = component.intensity;
	}

	protected onUpdateType(value: string): void {
		this.type = value;
		if (this._component) {
			this._component.type = Tea.LightType[value];
		}
	}

	protected onUpdateColor(value: Tea.Color): void {
		this.color = value.toCssColor();
		if (this._component) {
			this._component.color.copy(value);
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
