import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="Switch">
			<Vector2
				ref="size"
				:x="size[0]"
				:y="size[1]"
				:step="1"
				@update="onUpdateSize">{{ translator.size }}</Vector2>
			<CheckBox
				ref="checked"
				:value="checked"
				@update="onUpdateChecked">{{ translator.checked }}</CheckBox>
			<ColorPicker
				ref="baseColorOff"
				:value="baseColorOff"
				@update="onUpdateBaseColorOff">{{ translator.baseColorOff }}</ColorPicker>
			<ColorPicker
				ref="baseColorOn"
				:value="baseColorOn"
				@update="onUpdateBaseColorOn">{{ translator.baseColorOn }}</ColorPicker>
			<ColorPicker
				ref="thumbColor"
				:value="thumbColor"
				@update="onUpdateThumbColor">{{ translator.thumbColor }}</ColorPicker>
			<InputNumber
				ref="thumbMargin"
				:value="thumbMargin"
				:step="0.25"
				:min="0.0"
				:max="1000.0"
				@update="onUpdateThumbMargin">{{ translator.thumbMargin }}</InputNumber>
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
			<ColorPicker
				ref="borderColor"
				:value="borderColor"
				@update="onUpdateBorderColor">{{ translator.borderColor }}</ColorPicker>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "Switch",
			enabled: false,
			size: [0, 0],
			checked: false,
			baseColorOff: "",
			baseColorOn: "",
			thumbColor: "",
			thumbMargin: 0,
			border: false,
			borderWidth: 0,
			borderColor: ""
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as UISwitch;
			self._component.enabled = value;
		}
	}
})
export class UISwitch extends Vue {
	_component: Tea.UI.Switch;
	translator: any;
	name: string;
	enabled: boolean;
	size: Array<number>;
	checked: boolean;
	baseColorOff: string;
	baseColorOn: string;
	thumbColor: string;
	thumbMargin: number;
	border: boolean;
	borderWidth: number;
	borderColor: string;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/Switch";
		this.name = translator.getText("Title");
		this.translator.size = translator.getText("Size");
		this.translator.checked = translator.getText("Checked");
		this.translator.baseColorOff = translator.getText("BaseColorOff");
		this.translator.baseColorOn = translator.getText("BaseColorOn");
		this.translator.thumbColor = translator.getText("ThumbColor");
		this.translator.thumbMargin = translator.getText("ThumbMargin");
		this.translator.border = translator.getText("Border");
		this.translator.borderWidth = translator.getText("BorderWidth");
		this.translator.borderColor = translator.getText("BorderColor");
	}

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
		this.$set(this.size, 0, component.width);
		this.$set(this.size, 1, component.height);
		this.checked = component.checked;
		this.baseColorOff = component.baseColorOff.toCssColor();
		this.baseColorOn = component.baseColorOn.toCssColor();
		this.thumbColor = component.thumbColor.toCssColor();
		this.thumbMargin = component.thumbMargin;
		this.border = component.border;
		this.borderWidth = component.borderWidth;
		this.borderColor = component.borderColor.toCssColor();
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

	protected onUpdateChecked(value: boolean): void {
		this.checked = value;
		if (this._component) {
			this._component.checked = value;
		}
		this.$emit("update", "checked");
	}

	protected onUpdateBaseColorOff(value: Tea.Color): void {
		this.baseColorOff = value.toCssColor();
		if (this._component) {
			this._component.baseColorOff = value;
		}
		this.$emit("update", "baseColorOff");
	}

	protected onUpdateBaseColorOn(value: Tea.Color): void {
		this.baseColorOn = value.toCssColor();
		if (this._component) {
			this._component.baseColorOn = value;
		}
		this.$emit("update", "baseColorOn");
	}

	protected onUpdateThumbColor(value: Tea.Color): void {
		this.thumbColor = value.toCssColor();
		if (this._component) {
			this._component.thumbColor = value;
		}
		this.$emit("update", "thumbColor");
	}

	protected onUpdateThumbMargin(value: number): void {
		this.thumbMargin = value;
		if (this._component) {
			this._component.thumbMargin = value;
		}
		this.$emit("update", "thumbMargin");
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

	protected onUpdateBorderColor(value: Tea.Color): void {
		this.borderColor = value.toCssColor();
		if (this._component) {
			this._component.borderColor = value;
		}
		this.$emit("update", "borderColor");
	}
}

Tea.UI.Switch.editorView = UISwitch;
