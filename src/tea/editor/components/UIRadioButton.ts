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
			name: "RadioButton",
			enabled: false,
			size: [0, 0],
			text: "",
			fontSize: 0,
			font: ""
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
	text: string;
	fontSize: number;
	font: string;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/RadioButton";
		this.name = translator.getText("Title");
		this.translator.size = translator.getText("Size");
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
		this.$set(this.size, 0, component.width);
		this.$set(this.size, 1, component.height);
		this.text = component.text;
		this.fontSize = component.fontSize;
		this.font = component.font;
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
}

Tea.UI.RadioButton.editorView = UIRadioButton;
