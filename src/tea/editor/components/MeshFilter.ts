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
			name: "MeshFilter"
		}
	}
})
export class MeshFilter extends Vue {
	_component: Tea.MeshFilter;
	name: string;

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
	}
}
