import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

@Component({
	template: `
		<div class="TextMesh">
			<TextArea
				ref="text"
				:value="text"
				@update="onUpdateText">Text</TextArea>
			<InputNumber
				ref="characterSize"
				class="number"
				:value="characterSize"
				@update="onUpdateCharacterSize">Character Size</InputNumber>
			<InputNumber
				ref="lineSpacing"
				class="number"
				:value="lineSpacing"
				@update="onUpdateLineSpacing">Line Spacing</InputNumber>
			<SelectEnum
				ref="anchor"
				:value="anchor"
				@update="onUpdateAnchor">Anchor</SelectEnum>
			<SelectEnum
				ref="alignment"
				:value="alignment"
				@update="onUpdateAlignment">Alignment</SelectEnum>
			<InputNumber
				ref="fontSize"
				class="number"
				:value="fontSize"
				@update="onUpdateFontSize">Font Size</InputNumber>
			<SelectEnum
				ref="fontStyle"
				:value="fontStyle"
				@update="onUpdateFontStyle">Font Style</SelectEnum>
			<InputText
				ref="font"
				:value="font"
				@update="onUpdateFont">Font</InputText>
			<ColorPicker
				ref="color"
				:value="color"
				@update="onUpdateColor">Color</ColorPicker>
		</div>
	`,
	data: () => {
		return {
			name: "TextMesh",
			enabled: false,
			text: "",
			characterSize: 0,
			lineSpacing: 0,
			anchor: "",
			alignment: "",
			fontSize: 0,
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
	name: string;
	enabled: boolean;
	text: string;
	characterSize: number;
	lineSpacing: number;
	anchor: string;
	alignment: string;
	fontSize: number;
	fontStyle: string;
	font: string;
	color: string;

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
		this.text = component.text;
		this.characterSize = component.characterSize;
		this.lineSpacing = component.lineSpacing;
		var anchor = this.$refs.anchor as Vue;
		anchor.$data.keys = Tea.TextAnchor.getKeys();
		var alignment = this.$refs.alignment as Vue;
		alignment.$data.keys = Tea.TextAlignment.getKeys();
		this.fontSize = component.fontSize;
		var fontStyle = this.$refs.fontStyle as Vue;
		fontStyle.$data.keys = Tea.FontStyle.getKeys();
		this.font = component.font;
		this.color = component.color.toCssColor();
		this.$nextTick(() => {
			this.anchor = Tea.TextAnchor[component.anchor];
			this.alignment = Tea.TextAlignment[component.alignment];
			this.fontStyle = Tea.FontStyle[component.fontStyle];
		});
	}

	protected onUpdateText(value: string): void {
		this.text = value;
		if (this._component) {
			this._component.text = value;
		}
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
	}

	protected onUpdateLineSpacing(value: number): void {
		this.lineSpacing = value;
		if (this._component) {
			this._component.lineSpacing = value;
		}
	}

	protected onUpdateAnchor(value: string): void {
		this.anchor = value;
		if (this._component) {
			this._component.anchor = Tea.TextAnchor[value];
		}
	}

	protected onUpdateAlignment(value: string): void {
		this.alignment = value;
		if (this._component) {
			this._component.alignment = Tea.TextAlignment[value];
		}
	}

	protected onUpdateFontSize(value: number): void {
		this.fontSize = value;
		if (this._component) {
			this._component.fontSize = value;
		}
	}

	protected onUpdateFontStyle(value: string): void {
		this.fontStyle = value;
		if (this._component) {
			this._component.fontStyle = Tea.FontStyle[value];
		}
	}

	protected onUpdateFont(value: string): void {
		this.font = value;
		if (this._component) {
			this._component.font = value;
		}
	}

	protected onUpdateColor(value: Tea.Color): void {
		this.color = value.toCssColor();
		if (this._component) {
			this._component.color = value.clone();
		}
	}
}
