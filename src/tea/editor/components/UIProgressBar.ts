import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="ProgressBar">
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
				ref="barColor"
				:value="barColor"
				@update="onUpdateBarColor">{{ translator.barColor }}</ColorPicker>
			<ColorPicker
				ref="railColor"
				:value="railColor"
				@update="onUpdateRailColor">{{ translator.railColor }}</ColorPicker>
			<InputNumber
				ref="borderRadius"
				:value="borderRadius"
				:step="0.25"
				:min="0.0"
				:max="1000.0"
				@update="onUpdateBorderRadius">{{ translator.borderRadius }}</InputNumber>
			<CheckBox
				ref="border"
				:value="border"
				@update="onUpdateBorder">{{ translator.border }}</CheckBox>
			<ColorPicker
				ref="borderColor"
				:value="borderColor"
				@update="onUpdateBorderColor">{{ translator.borderColor }}</ColorPicker>
			<InputNumber
				ref="borderWidth"
				:value="borderWidth"
				:step="0.25"
				:min="0.0"
				:max="1000.0"
				@update="onUpdateBorderWidth">{{ translator.borderWidth }}</InputNumber>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "ProgressBar",
			enabled: false,
			size: [0, 0],
			value: 0,
			barColor: "",
			railColor: "",
			border: false,
			borderRadius: 0,
			borderColor: "",
			borderWidth: 0
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as UIProgressBar;
			self._component.enabled = value;
		}
	}
})
export class UIProgressBar extends Vue {
	_component: Tea.UI.ProgressBar;
	translator: any;
	name: string;
	enabled: boolean;
	size: Array<number>;
	value: number;
	barColor: string;
	railColor: string;
	border: boolean;
	borderRadius: number;
	borderColor: string;
	borderWidth: number;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/ProgressBar";
		this.name = translator.getText("Title");
		this.translator.size = translator.getText("Size");
		this.translator.value = translator.getText("Value");
		this.translator.barColor = translator.getText("BarColor");
		this.translator.railColor = translator.getText("RailColor");
		this.translator.border = translator.getText("Border");
		this.translator.borderRadius = translator.getText("BorderRadius");
		this.translator.borderColor = translator.getText("BorderColor");
		this.translator.borderWidth = translator.getText("BorderWidth");
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
		this.barColor = component.barColor.toCssColor();
		this.railColor = component.railColor.toCssColor();
		this.border = component.border;
		this.borderRadius = component.borderRadius;
		this.borderColor = component.borderColor.toCssColor();
		this.borderWidth = component.borderWidth;
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

	protected onUpdateBarColor(value: Tea.Color): void {
		this.barColor = value.toCssColor();
		if (this._component) {
			this._component.barColor = value;
		}
		this.$emit("update", "barColor");
	}

	protected onUpdateRailColor(value: Tea.Color): void {
		this.railColor = value.toCssColor();
		if (this._component) {
			this._component.railColor = value;
		}
		this.$emit("update", "railColor");
	}

	protected onUpdateBorder(value: boolean): void {
		this.border = value;
		if (this._component) {
			this._component.border = value;
		}
		this.$emit("update", "border");
	}

	protected onUpdateBorderRadius(value: number): void {
		this.borderRadius = value;
		if (this._component) {
			this._component.borderRadius = value;
		}
		this.$emit("update", "borderRadius");
	}

	protected onUpdateBorderColor(value: Tea.Color): void {
		this.borderColor = value.toCssColor();
		if (this._component) {
			this._component.borderColor = value.clone();
		}
		this.$emit("update", "borderColor");
	}

	protected onUpdateBorderWidth(value: number): void {
		this.borderWidth = value;
		if (this._component) {
			this._component.borderWidth = value;
		}
		this.$emit("update", "borderWidth");
	}
}

Tea.UI.ProgressBar.editorView = UIProgressBar;
