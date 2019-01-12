import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="CanvasRenderer">
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "CanvasRenderer",
			enabled: false,
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as CanvasRenderer;
			self._component.enabled = value;
		}
	}
})
export class CanvasRenderer extends Vue {
	_component: Tea.UI.CanvasRenderer;
	translator: any;
	name: string;
	enabled: boolean;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/CanvasRenderer";
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

Tea.UI.CanvasRenderer.editorView = CanvasRenderer;
