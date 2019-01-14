import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="Button">
			<Vector2
				ref="size"
				:x="size[0]"
				:y="size[1]"
				:step="1"
				@update="onUpdateSize">{{ translator.size }}</Vector2>
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
			<ColorPicker
				ref="background"
				:value="background"
				@update="onUpdateBackground">{{ translator.background }}</ColorPicker>
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
			name: "Button",
			enabled: false,
			size: [0, 0],
			text: "",
			fontSize: 0,
			font: "",
			fontColor: "",
			background: "",
			border: false,
			borderWidth: 0,
			borderRadius: 0,
			borderColor: ""
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as UIButton;
			self._component.enabled = value;
		}
	}
})
export class UIButton extends Vue {
	_component: Tea.UI.Button;
	translator: any;
	name: string;
	enabled: boolean;
	size: Array<number>;
	text: string;
	fontSize: number;
	font: string;
	fontColor: string;
	background: string;
	border: boolean;
	borderWidth: number;
	borderRadius: number;
	borderColor: string;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/Button";
		this.name = translator.getText("Title");
		this.translator.size = translator.getText("Size");
		this.translator.text = translator.getText("Text");
		this.translator.fontSize = translator.getText("FontSize");
		this.translator.font = translator.getText("Font");
		this.translator.fontColor = translator.getText("FontColor");
		this.translator.background = translator.getText("Background");
		this.translator.border = translator.getText("Border");
		this.translator.borderWidth = translator.getText("BorderWidth");
		this.translator.borderRadius = translator.getText("BorderRadius");
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
		this.text = component.text;
		this.fontSize = component.fontSize;
		this.font = component.font;
		this.fontColor = component.fontColor.toCssColor();
		this.background = component.background.toCssColor();
		this.border = component.border;
		this.borderWidth = component.borderWidth;
		this.borderRadius = component.borderRadius;
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

	protected onUpdateBackground(value: Tea.Color): void {
		this.background = value.toCssColor();
		if (this._component) {
			this._component.background = value;
		}
		this.$emit("update", "background");
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
			this._component.borderColor = value;
		}
		this.$emit("update", "borderColor");
	}
}

Tea.UI.Button.editorView = UIButton;
