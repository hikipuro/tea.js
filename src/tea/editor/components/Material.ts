import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

@Component({
	template: `
		<div class="Material">
			Material
			Shader: {{ shader }},
			Main Texture: {{ mainTexture }}
		</div>
	`,
	data: () => {
		return {
			name: "Material",
			shader: "",
			mainTexture: ""
		}
	}
})
export class Material extends Vue {
	_component: Tea.Material;
	name: string;
	shader: string;
	mainTexture: string;

	protected updated(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		console.log("mounted", component.mainTexture.url);
		//this.shader = "test";//component.shader.toJSON().toString();
		this.mainTexture = component.mainTexture.url;
	}
}
