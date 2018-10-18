import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

@Component({
	template: `
		<div class="Rigidbody">
		</div>
	`,
	data: () => {
		return {
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
	name: string;
	enabled: boolean;

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
	}
}
