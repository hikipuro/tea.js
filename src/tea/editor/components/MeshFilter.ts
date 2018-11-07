import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="MeshFilter">
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "MeshFilter"
		}
	}
})
export class MeshFilter extends Vue {
	_component: Tea.MeshFilter;
	translator: any;
	name: string;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/MeshFilter";
		this.name = translator.getText("Title");
	}

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
	}
}
