import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="TextMesh">
			<TextArea
				ref="text"
				:value="text"
				@update="onUpdateText">{{ translator.text }}</TextArea>
			<InputNumber
				ref="characterSize"
				class="number"
				:value="characterSize"
				@update="onUpdateCharacterSize">{{ translator.characterSize }}</InputNumber>
			<InputNumber
				ref="lineSpacing"
				class="number"
				:value="lineSpacing"
				@update="onUpdateLineSpacing">{{ translator.lineSpacing }}</InputNumber>
			<SelectEnum
				ref="anchor"
				:keys="anchorKeys"
				:value="anchor"
				@update="onUpdateAnchor">{{ translator.anchor }}</SelectEnum>
			<SelectEnum
				ref="alignment"
				:keys="alignmentKeys"
				:value="alignment"
				@update="onUpdateAlignment">{{ translator.alignment }}</SelectEnum>
			<InputNumber
				ref="fontSize"
				class="number"
				:value="fontSize"
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
			name: "TextMesh",
			enabled: false,
			text: "",
			characterSize: 0,
			lineSpacing: 0,
			anchorKeys: [],
			anchor: "",
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
			var self = this as TextMesh;
			self._component.enabled = value;
		}
	}
})
export class TextMesh extends Vue {
	_component: Tea.TextMesh;
	translator: any;
	name: string;
	enabled: boolean;
	text: string;
	characterSize: number;
	lineSpacing: number;
	anchorKeys: Array<string>;
	anchor: string;
	alignmentKeys: Array<string>;
	alignment: string;
	fontSize: number;
	fontStyleKeys: Array<string>;
	fontStyle: string;
	font: string;
	color: string;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/TextMesh";
		this.name = translator.getText("Title");
		this.translator.text = translator.getText("Text");
		this.translator.characterSize = translator.getText("CharacterSize");
		this.translator.lineSpacing = translator.getText("LineSpacing");
		this.translator.anchor = translator.getText("Anchor");
		this.translator.alignment = translator.getText("Alignment");
		this.translator.fontSize = translator.getText("FontSize");
		this.translator.fontStyle = translator.getText("FontStyle");
		this.translator.font = translator.getText("Font");
		this.translator.color = translator.getText("Color");
	}

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
		this.text = component.text;
		this.characterSize = component.characterSize;
		this.lineSpacing = component.lineSpacing;
		this.anchorKeys = Tea.TextAnchor.getKeys();
		this.anchor = Tea.TextAnchor[component.anchor];
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

	protected onUpdateCharacterSize(value: number): void {
		//if (value < 0) {
		//	value = 0;
		//}
		this.characterSize = value;
		if (this._component) {
			this._component.characterSize = value;
			//this._component.update();
		}
		this.$emit("update", "characterSize");
	}

	protected onUpdateLineSpacing(value: number): void {
		this.lineSpacing = value;
		if (this._component) {
			this._component.lineSpacing = value;
		}
		this.$emit("update", "lineSpacing");
	}

	protected onUpdateAnchor(value: string): void {
		this.anchor = value;
		if (this._component) {
			this._component.anchor = Tea.TextAnchor[value];
		}
		this.$emit("update", "anchor");
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

Tea.TextMesh.editorView = TextMesh;
