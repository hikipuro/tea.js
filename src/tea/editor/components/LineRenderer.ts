import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="LineRenderer">
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "LineRenderer",
			enabled: false
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as LineRenderer;
			self._component.enabled = value;
		}
	}
})
export class LineRenderer extends Vue {
	_component: Tea.LineRenderer;
	translator: any;
	name: string;
	enabled: boolean;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/LineRenderer";
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
