import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="Text">
			<TextArea
				ref="text"
				:value="text"
				@update="onUpdateText">{{ translator.text }}</TextArea>
			<InputNumber
				ref="lineSpacing"
				class="number"
				:value="lineSpacing"
				:min="0"
				@update="onUpdateLineSpacing">{{ translator.lineSpacing }}</InputNumber>
			<SelectEnum
				ref="alignment"
				:keys="alignmentKeys"
				:value="alignment"
				@update="onUpdateAlignment">{{ translator.alignment }}</SelectEnum>
			<InputNumber
				ref="fontSize"
				class="number"
				:value="fontSize"
				:min="1"
				@update="onUpdateFontSize">{{ translator.fontSize }}</InputNumber>
			<SelectEnum
				ref="fontStyle"
				:keys="fontStyleKeys"
				:value="fontStyle"
				@update="onUpdateFontStyle">{{ translator.fontStyle }}</SelectEnum>
			<InputText
				ref="font"
				:value="font"
				@update="onUpdateFont">{{ translator.font }}</InputText>
			<ColorPicker
				ref="color"
				:value="color"
				@update="onUpdateColor">{{ translator.color }}</ColorPicker>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "Text",
			enabled: false,
			text: "",
			lineSpacing: 0,
			alignmentKeys: [],
			alignment: "",
			fontSize: 0,
			fontStyleKeys: [],
			fontStyle: "",
			font: "",
			color: "",
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as UIText;
			self._component.enabled = value;
		}
	}
})
export class UIText extends Vue {
	_component: Tea.UI.Text;
	translator: any;
	name: string;
	enabled: boolean;
	text: string;
	lineSpacing: number;
	alignmentKeys: Array<string>;
	alignment: string;
	fontSize: number;
	fontStyleKeys: Array<string>;
	fontStyle: string;
	font: string;
	color: string;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/Text";
		this.name = translator.getText("Title");
		this.translator.text = translator.getText("Text");
		this.translator.lineSpacing = translator.getText("LineSpacing");
		this.translator.alignment = translator.getText("Alignment");
		this.translator.fontSize = translator.getText("FontSize");
		this.translator.fontStyle = translator.getText("FontStyle");
		this.translator.font = translator.getText("Font");
		this.translator.color = translator.getText("Color");
	}

	protected mounted(): void {
		/*
		var editor = this.$root as Editor;
		var inspector = editor.inspectorView.getObjectInspector();
		if (inspector != null) {
			inspector.is3DObject = false;
		}
		*/

		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
		this.text = component.text;
		this.lineSpacing = component.lineSpacing;
		this.alignmentKeys = Tea.TextAlignment.getKeys();
		this.alignment = Tea.TextAlignment[component.alignment];
		this.fontSize = component.fontSize;
		this.fontStyleKeys = Tea.FontStyle.getKeys();
		this.fontStyle = Tea.FontStyle[component.fontStyle];
		this.font = component.font;
		this.color = component.color.toCssColor();
	}

	protected onUpdateText(value: string): void {
		this.text = value;
		if (this._component) {
			this._component.text = value;
		}
		this.$emit("update", "text");
	}

	protected onUpdateLineSpacing(value: number): void {
		this.lineSpacing = value;
		if (this._component) {
			this._component.lineSpacing = value;
		}
		this.$emit("update", "lineSpacing");
	}

	protected onUpdateAlignment(value: string): void {
		this.alignment = value;
		if (this._component) {
			this._component.alignment = Tea.TextAlignment[value];
		}
		this.$emit("update", "alignment");
	}

	protected onUpdateFontSize(value: number): void {
		this.fontSize = value;
		if (this._component) {
			this._component.fontSize = value;
		}
		this.$emit("update", "fontSize");
	}

	protected onUpdateFontStyle(value: string): void {
		this.fontStyle = value;
		if (this._component) {
			this._component.fontStyle = Tea.FontStyle[value];
		}
		this.$emit("update", "fontStyle");
	}

	protected onUpdateFont(value: string): void {
		this.font = value;
		if (this._component) {
			this._component.font = value;
		}
		this.$emit("update", "font");
	}

	protected onUpdateColor(value: Tea.Color): void {
		this.color = value.toCssColor();
		if (this._component) {
			this._component.color = value.clone();
		}
		this.$emit("update", "color");
	}
}

Tea.UI.Text.editorView = UIText;
