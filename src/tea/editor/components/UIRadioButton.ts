import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="RadioButton">
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
			<TextArea
				ref="text"
				:value="text"
				@update="onUpdateText">{{ translator.text }}</TextArea>
			<InputNumber
				ref="indent"
				class="number"
				:value="indent"
				:step="1"
				@update="onUpdateIndent">{{ translator.indent }}</InputNumber>
			<InputNumber
				ref="fontSize"
				class="number"
				:value="fontSize"
				:min="1"
				@update="onUpdateFontSize">{{ translator.fontSize }}</InputNumber>
			<InputText
				ref="font"
				:value="font"
				@update="onUpdateFont">{{ translator.font }}</InputText>
			<ColorPicker
				ref="fontColor"
				:value="fontColor"
				@update="onUpdateFontColor">{{ translator.fontColor }}</ColorPicker>
			<InputNumber
				ref="buttonSize"
				class="number"
				:value="buttonSize"
				:min="1"
				@update="onUpdateButtonSize">{{ translator.buttonSize }}</InputNumber>
			<ColorPicker
				ref="buttonColor"
				:value="buttonColor"
				@update="onUpdateButtonColor">{{ translator.buttonColor }}</ColorPicker>
			<ColorPicker
				ref="checkColor"
				:value="checkColor"
				@update="onUpdateCheckColor">{{ translator.checkColor }}</ColorPicker>
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
			name: "RadioButton",
			enabled: false,
			size: [0, 0],
			checked: false,
			text: "",
			indent: 0,
			fontSize: 0,
			font: "",
			fontColor: "",
			buttonSize: 0,
			buttonColor: "",
			checkColor: "",
			border: false,
			borderWidth: 0,
			borderColor: ""
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as UIRadioButton;
			self._component.enabled = value;
		}
	}
})
export class UIRadioButton extends Vue {
	_component: Tea.UI.RadioButton;
	translator: any;
	name: string;
	enabled: boolean;
	size: Array<number>;
	checked: boolean;
	text: string;
	indent: number;
	fontSize: number;
	font: string;
	fontColor: string;
	buttonSize: number;
	buttonColor: string;
	checkColor: string;
	border: boolean;
	borderWidth: number;
	borderColor: string;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/RadioButton";
		this.name = translator.getText("Title");
		this.translator.size = translator.getText("Size");
		this.translator.checked = translator.getText("Checked");
		this.translator.text = translator.getText("Text");
		this.translator.indent = translator.getText("Indent");
		this.translator.fontSize = translator.getText("FontSize");
		this.translator.font = translator.getText("Font");
		this.translator.fontColor = translator.getText("FontColor");
		this.translator.buttonSize = translator.getText("ButtonSize");
		this.translator.buttonColor = translator.getText("ButtonColor");
		this.translator.checkColor = translator.getText("CheckColor");
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
		this.text = component.text;
		this.indent = component.indent;
		this.fontSize = component.fontSize;
		this.font = component.font;
		this.fontColor = component.fontColor.toCssColor();
		this.buttonSize = component.buttonSize;
		this.buttonColor = component.buttonColor.toCssColor();
		this.checkColor = component.checkColor.toCssColor();
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

	protected onUpdateText(value: string): void {
		this.text = value;
		if (this._component) {
			this._component.text = value;
		}
		this.$emit("update", "text");
	}

	protected onUpdateIndent(value: number): void {
		this.indent = value;
		if (this._component) {
			this._component.indent = value;
		}
		this.$emit("update", "indent");
	}

	protected onUpdateFontSize(value: number): void {
		this.fontSize = value;
		if (this._component) {
			this._component.fontSize = value;
		}
		this.$emit("update", "fontSize");
	}
	
	protected onUpdateFont(value: string): void {
		this.font = value;
		if (this._component) {
			this._component.font = value;
		}
		this.$emit("update", "font");
	}

	protected onUpdateFontColor(value: Tea.Color): void {
		this.fontColor = value.toCssColor();
		if (this._component) {
			this._component.fontColor = value;
		}
		this.$emit("update", "fontColor");
	}

	protected onUpdateButtonSize(value: number): void {
		this.buttonSize = value;
		if (this._component) {
			this._component.buttonSize = value;
		}
		this.$emit("update", "buttonSize");
	}

	protected onUpdateButtonColor(value: Tea.Color): void {
		this.buttonColor = value.toCssColor();
		if (this._component) {
			this._component.buttonColor = value;
		}
		this.$emit("update", "buttonColor");
	}

	protected onUpdateCheckColor(value: Tea.Color): void {
		this.checkColor = value.toCssColor();
		if (this._component) {
			this._component.checkColor = value;
		}
		this.$emit("update", "checkColor");
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

Tea.UI.RadioButton.editorView = UIRadioButton;
