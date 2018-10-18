import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

@Component({
	template: `
		<div class="Script">
		</div>
	`,
	data: () => {
		return {
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
	name: string;
	enabled: boolean;

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.name = component.className + " (Script)";
		this.enabled = component.enabled;
	}
}
