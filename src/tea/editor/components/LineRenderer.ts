import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

@Component({
	template: `
		<div class="LineRenderer">
		</div>
	`,
	data: () => {
		return {
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
