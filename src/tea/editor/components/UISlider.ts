import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="Slider">
			<Vector2
				ref="size"
				:x="size[0]"
				:y="size[1]"
				:step="1"
				@update="onUpdateSize">{{ translator.size }}</Vector2>
			<InputNumber
				ref="value"
				:value="value"
				:step="0.01"
				:min="0.0"
				:max="1.0"
				@update="onUpdateValue">{{ translator.value }}</InputNumber>
			<ColorPicker
				ref="buttonColor"
				:value="buttonColor"
				@update="onUpdateButtonColor">{{ translator.buttonColor }}</ColorPicker>
			<ColorPicker
				ref="railColor"
				:value="railColor"
				@update="onUpdateRailColor">{{ translator.railColor }}</ColorPicker>
			<ColorPicker
				ref="borderColor"
				:value="borderColor"
				@update="onUpdateBorderColor">{{ translator.borderColor }}</ColorPicker>
			<CheckBox
				ref="border"
				:value="border"
				@update="onUpdateBorder">{{ translator.border }}</CheckBox>
			<InputNumber
				ref="borderWidth"
				:value="borderWidth"
				:step="0.25"
				:min="0.0"
				:max="1000.0"
				@update="onUpdateBorderWidth">{{ translator.borderWidth }}</InputNumber>
			<InputNumber
				ref="buttonSize"
				class="number"
				:value="buttonSize"
				:step="0.25"
				:min="1"
				@update="onUpdateButtonSize">{{ translator.buttonSize }}</InputNumber>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "Slider",
			enabled: false,
			size: [0, 0],
			value: 0,
			buttonColor: "",
			railColor: "",
			borderColor: "",
			border: false,
			borderWidth: 0,
			buttonSize: 0
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as UISlider;
			self._component.enabled = value;
		}
	}
})
export class UISlider extends Vue {
	_component: Tea.UI.Slider;
	translator: any;
	name: string;
	enabled: boolean;
	size: Array<number>;
	value: number;
	buttonColor: string;
	railColor: string;
	borderColor: string;
	border: boolean;
	borderWidth: number;
	buttonSize: number;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/Slider";
		this.name = translator.getText("Title");
		this.translator.size = translator.getText("Size");
		this.translator.value = translator.getText("Value");
		this.translator.buttonColor = translator.getText("ButtonColor");
		this.translator.railColor = translator.getText("RailColor");
		this.translator.borderColor = translator.getText("BorderColor");
		this.translator.border = translator.getText("Border");
		this.translator.borderWidth = translator.getText("BorderWidth");
		this.translator.buttonSize = translator.getText("ButtonSize");
	}

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
		this.$set(this.size, 0, component.width);
		this.$set(this.size, 1, component.height);
		this.value = component.value;
		this.buttonColor = component.buttonColor.toCssColor();
		this.railColor = component.railColor.toCssColor();
		this.borderColor = component.borderColor.toCssColor();
		this.border = component.border;
		this.borderWidth = component.borderWidth;
		this.buttonSize = component.buttonSize;
	}

	protected onUpdateSize(x: number, y: number): void {
		this.$set(this.size, 0, x);
		this.$set(this.size, 1, y);
		if (this._component != null) {
			this._component.width = x;
			this._component.height = y;
		}
		this.$emit("update", "size");
	}

	protected onUpdateValue(value: number): void {
		this.value = value;
		if (this._component != null) {
			this._component.value = value;
		}
		this.$emit("update", "value");
	}

	protected onUpdateButtonColor(value: Tea.Color): void {
		this.buttonColor = value.toCssColor();
		if (this._component) {
			this._component.buttonColor = value.clone();
		}
		this.$emit("update", "buttonColor");
	}

	protected onUpdateRailColor(value: Tea.Color): void {
		this.railColor = value.toCssColor();
		if (this._component) {
			this._component.railColor = value.clone();
		}
		this.$emit("update", "railColor");
	}

	protected onUpdateBorderColor(value: Tea.Color): void {
		this.borderColor = value.toCssColor();
		if (this._component) {
			this._component.borderColor = value.clone();
		}
		this.$emit("update", "borderColor");
	}

	protected onUpdateBorder(value: boolean): void {
		this.border = value;
		if (this._component) {
			this._component.border = value;
		}
		this.$emit("update", "border");
	}
	
	protected onUpdateBorderWidth(value: number): void {
		this.borderWidth = value;
		if (this._component) {
			this._component.borderWidth = value;
		}
		this.$emit("update", "borderWidth");
	}

	protected onUpdateButtonSize(value: number): void {
		this.buttonSize = value;
		if (this._component) {
			this._component.buttonSize = value;
		}
		this.$emit("update", "buttonSize");
	}
}

Tea.UI.Slider.editorView = UISlider;
