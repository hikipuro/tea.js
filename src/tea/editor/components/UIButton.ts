import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="Button">
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
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "Button",
			enabled: false,
			text: "",
			fontSize: 0,
			font: ""
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
	text: string;
	fontSize: number;
	font: string;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/Button";
		this.name = translator.getText("Title");
		this.translator.text = translator.getText("Text");
		this.translator.fontSize = translator.getText("FontSize");
		this.translator.font = translator.getText("Font");
	}

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
		this.text = component.text;
		this.fontSize = component.fontSize;
		this.font = component.font;
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
}

Tea.UI.Button.editorView = UIButton;
