import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="Rigidbody">
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "Rigidbody",
			enabled: false
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as Rigidbody;
			self._component.enabled = value;
		}
	}
})
export class Rigidbody extends Vue {
	_component: Tea.Rigidbody;
	translator: any;
	name: string;
	enabled: boolean;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/Rigidbody";
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
