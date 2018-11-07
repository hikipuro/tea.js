import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="Script">
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "Script",
			enabled: false
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as Script;
			self._component.enabled = value;
		}
	}
})
export class Script extends Vue {
	_component: Tea.Script;
	translator: any;
	name: string;
	enabled: boolean;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/Script";
		this.name = translator.getText("Title");
	}

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		if (component.name === "Script") {
			this.name = component.className + " (" + this.name + ")";
		} else {
			this.name = component.name + " (" + this.name + ")";
		}
		this.enabled = component.enabled;
	}
}
