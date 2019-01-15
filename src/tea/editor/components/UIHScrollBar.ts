import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="HScrollBar">
			<Vector2
				ref="size"
				:x="size[0]"
				:y="size[1]"
				:step="1"
				@update="onUpdateSize">{{ translator.size }}</Vector2>
			<InputNumber
				ref="value"
				:value="value"
				:step="Math.min(1, max / 100)"
				:min="0.0"
				:max="max"
				@update="onUpdateValue">{{ translator.value }}</InputNumber>
			<InputNumber
				ref="max"
				:value="max"
				:step="1"
				:min="1.0"
				:max="10000.0"
				@update="onUpdateMax">{{ translator.max }}</InputNumber>
			<InputNumber
				ref="thumbRatio"
				:value="thumbRatio"
				:step="0.01"
				:min="0.0"
				:max="1.0"
				@update="onUpdateThumbRatio">{{ translator.thumbRatio }}</InputNumber>
			<ColorPicker
				ref="thumbColor"
				:value="thumbColor"
				@update="onUpdateThumbColor">{{ translator.thumbColor }}</ColorPicker>
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
			name: "HScrollBar",
			enabled: false,
			size: [0, 0],
			value: 0,
			max: 0,
			thumbRatio: 0,
			thumbColor: "",
			railColor: "",
			border: false,
			borderRadius: 0,
			borderColor: "",
			borderWidth: 0
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as UIHScrollBar;
			self._component.enabled = value;
		}
	}
})
export class UIHScrollBar extends Vue {
	_component: Tea.UI.HScrollBar;
	translator: any;
	name: string;
	enabled: boolean;
	size: Array<number>;
	value: number;
	max: number;
	thumbRatio: number;
	thumbColor: string;
	railColor: string;
	border: boolean;
	borderRadius: number;
	borderColor: string;
	borderWidth: number;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/HScrollBar";
		this.name = translator.getText("Title");
		this.translator.size = translator.getText("Size");
		this.translator.value = translator.getText("Value");
		this.translator.max = translator.getText("Max");
		this.translator.thumbRatio = translator.getText("ThumbRatio");
		this.translator.thumbColor = translator.getText("ThumbColor");
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
		this.max = component.max;
		this.thumbRatio = component.thumbRatio;
		this.thumbColor = component.thumbColor.toCssColor();
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

	protected onUpdateMax(value: number): void {
		this.max = value;
		if (this.value > value) {
			this.value = value;
			if (this._component != null) {
				this._component.value = value;
			}
		}
		if (this._component != null) {
			this._component.max = value;
		}
		this.$emit("update", "max");
	}

	protected onUpdateThumbRatio(value: number): void {
		this.thumbRatio = value;
		if (this._component != null) {
			this._component.thumbRatio = value;
		}
		this.$emit("update", "thumbRatio");
	}

	protected onUpdateThumbColor(value: Tea.Color): void {
		this.thumbColor = value.toCssColor();
		if (this._component) {
			this._component.thumbColor = value;
		}
		this.$emit("update", "thumbColor");
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

Tea.UI.HScrollBar.editorView = UIHScrollBar;
