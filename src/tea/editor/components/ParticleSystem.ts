import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

@Component({
	template: `
		<div class="ParticleSystem">
		</div>
	`,
	data: () => {
		return {
			name: "ParticleSystem",
			enabled: false
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as ParticleSystem;
			self._component.enabled = value;
		}
	}
})
export class ParticleSystem extends Vue {
	_component: Tea.ParticleSystem;
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
