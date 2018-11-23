import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="Light">
			<SelectEnum
				ref="type"
				name="type"
				:keys="typeKeys"
				:value="type"
				@update="onUpdateType">{{ translator.type }}</SelectEnum>
			<InputNumber
				v-if="type !== 'Directional'"
				ref="range"
				class="range"
				:value="range"
				@update="onUpdateRange">{{ translator.range }}</InputNumber>
			<InputRange
				v-if="type === 'Spot'"
				ref="spotAngle"
				:min="1"
				:max="179"
				:value="spotAngle"
				@update="onUpdateSpotAngle">{{ translator.spotAngle }}</InputRange>
			<ColorPicker
				ref="color"
				:value="color"
				@update="onUpdateColor">{{ translator.color }}</ColorPicker>
			<InputNumber
				ref="intensity"
				class="Intensity"
				:value="intensity"
				@update="onUpdateIntensity">{{ translator.intensity }}</InputNumber>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "Light",
			enabled: false,
			typeKeys: [],
			type: "",
			range: 0,
			spotAngle: 0,
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
	translator: any;
	name: string;
	enabled: boolean;
	typeKeys: Array<string>;
	type: string;
	range: number;
	spotAngle: number;
	color: string;
	intensity: number;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/Light";
		this.name = translator.getText("Title");
		this.translator.type = translator.getText("Type");
		this.translator.color = translator.getText("Color");
		this.translator.intensity = translator.getText("Intensity");
		this.translator.range = translator.getText("Range");
		this.translator.spotAngle = translator.getText("SpotAngle");
	}

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
		this.typeKeys = Tea.LightType.getKeys();
		this.type = Tea.LightType[component.type];
		this.range = component.range;
		this.spotAngle = component.spotAngle;
		this.color = component.color.toCssColor();
		this.intensity = component.intensity;
	}

	protected onUpdateType(value: string): void {
		this.type = value;
		if (this._component) {
			this._component.type = Tea.LightType[value];
		}
		this.$emit("update", "type");
	}

	protected onUpdateRange(value: number): void {
		this.range = value;
		if (this._component) {
			this._component.range = value;
		}
		this.$emit("update", "range");
	}

	protected onUpdateSpotAngle(value: number): void {
		this.spotAngle = value;
		if (this._component) {
			this._component.spotAngle = value;
		}
		this.$emit("update", "spotAngle");
	}

	protected onUpdateColor(value: Tea.Color): void {
		this.color = value.toCssColor();
		if (this._component) {
			this._component.color.copy(value);
		}
		this.$emit("update", "color");
	}

	protected onUpdateIntensity(value: number): void {
		if (value < 0) {
			value = 0;
		}
		this.intensity = value;
		if (this._component) {
			this._component.intensity = value;
		}
		this.$emit("update", "intensity");
	}
}

Tea.Light.editorView = Light;
