import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="Checkbox">
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
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "Checkbox",
			enabled: false,
			size: [0, 0],
			checked: false,
			text: "",
			fontSize: 0,
			font: "",
			fontColor: "",
			buttonSize: 0
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as UICheckbox;
			self._component.enabled = value;
		}
	}
})
export class UICheckbox extends Vue {
	_component: Tea.UI.Checkbox;
	translator: any;
	name: string;
	enabled: boolean;
	size: Array<number>;
	checked: boolean;
	text: string;
	fontSize: number;
	font: string;
	fontColor: string;
	buttonSize: number;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/Checkbox";
		this.name = translator.getText("Title");
		this.translator.size = translator.getText("Size");
		this.translator.checked = translator.getText("Checked");
		this.translator.text = translator.getText("Text");
		this.translator.fontSize = translator.getText("FontSize");
		this.translator.font = translator.getText("Font");
		this.translator.fontColor = translator.getText("FontColor");
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
		this.checked = component.checked;
		this.text = component.text;
		this.fontSize = component.fontSize;
		this.font = component.font;
		this.fontColor = component.fontColor.toCssColor();
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
}

Tea.UI.Checkbox.editorView = UICheckbox;
