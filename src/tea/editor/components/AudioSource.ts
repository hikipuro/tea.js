import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

@Component({
	template: `
		<div class="AudioSource">
		</div>
	`,
	data: () => {
		return {
			name: "AudioSource",
			enabled: false
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as AudioSource;
			self._component.enabled = value;
		}
	}
})
export class AudioSource extends Vue {
	_component: Tea.AudioSource;
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
