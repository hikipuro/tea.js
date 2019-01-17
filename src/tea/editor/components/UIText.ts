import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="Text">
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
			<SelectEnum
				ref="verticalAlignment"
				:keys="verticalAlignmentKeys"
				:value="verticalAlignment"
				@update="onUpdateVerticalAlignment">{{ translator.verticalAlignment }}</SelectEnum>
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
				ref="fontColor"
				:value="fontColor"
				@update="onUpdateFontColor">{{ translator.fontColor }}</ColorPicker>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "Text",
			enabled: false,
			size: [0, 0],
			text: "",
			lineSpacing: 0,
			alignmentKeys: [],
			alignment: "",
			verticalAlignmentKeys: [],
			verticalAlignment: "",
			fontSize: 0,
			fontStyleKeys: [],
			fontStyle: "",
			font: "",
			fontColor: "",
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
	size: Array<number>;
	text: string;
	lineSpacing: number;
	alignmentKeys: Array<string>;
	alignment: string;
	verticalAlignmentKeys: Array<string>;
	verticalAlignment: string;
	fontSize: number;
	fontStyleKeys: Array<string>;
	fontStyle: string;
	font: string;
	fontColor: string;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/Text";
		this.name = translator.getText("Title");
		this.translator.size = translator.getText("Size");
		this.translator.text = translator.getText("Text");
		this.translator.lineSpacing = translator.getText("LineSpacing");
		this.translator.alignment = translator.getText("Alignment");
		this.translator.verticalAlignment = translator.getText("VerticalAlignment");
		this.translator.fontSize = translator.getText("FontSize");
		this.translator.fontStyle = translator.getText("FontStyle");
		this.translator.font = translator.getText("Font");
		this.translator.fontColor = translator.getText("FontColor");
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
		this.$set(this.size, 0, component.width);
		this.$set(this.size, 1, component.height);
		this.text = component.text;
		this.lineSpacing = component.lineSpacing;
		this.alignmentKeys = Tea.TextAlignment.getKeys();
		this.alignment = Tea.TextAlignment[component.alignment];
		this.verticalAlignmentKeys = Tea.TextVerticalAlignment.getKeys();
		this.verticalAlignment = Tea.TextVerticalAlignment[component.verticalAlignment];
		this.fontSize = component.fontSize;
		this.fontStyleKeys = Tea.FontStyle.getKeys();
		this.fontStyle = Tea.FontStyle[component.fontStyle];
		this.font = component.font;
		this.fontColor = component.fontColor.toCssColor();
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

	protected onUpdateVerticalAlignment(value: string): void {
		this.verticalAlignment = value;
		if (this._component) {
			this._component.verticalAlignment = Tea.TextVerticalAlignment[value];
		}
		this.$emit("update", "verticalAlignment");
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

	protected onUpdateFontColor(value: Tea.Color): void {
		this.fontColor = value.toCssColor();
		if (this._component) {
			this._component.fontColor = value.clone();
		}
		this.$emit("update", "fontColor");
	}
}

Tea.UI.Text.editorView = UIText;
