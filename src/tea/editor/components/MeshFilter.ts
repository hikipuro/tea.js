import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

@Component({
	template: `
		<div class="MeshFilter">
		</div>
	`,
	data: () => {
		return {
			name: "MeshFilter",
			enabled: false
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as MeshFilter;
			self._component.enabled = value;
		}
	}
})
export class MeshFilter extends Vue {
	_component: Tea.MeshFilter;
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
