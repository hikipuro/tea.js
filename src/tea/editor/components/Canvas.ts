import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="Canvas">
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "Canvas",
			enabled: false,
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as Canvas;
			self._component.enabled = value;
		}
	}
})
export class Canvas extends Vue {
	_component: Tea.Canvas;
	translator: any;
	name: string;
	enabled: boolean;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/Canvas";
		this.name = translator.getText("Title");
	}

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
	}
}

Tea.Canvas.editorView = Canvas;
