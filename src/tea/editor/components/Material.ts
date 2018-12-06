import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { ImageSelector } from "../basic/ImageSelector";
import { LocalFile } from "../LocalFile";

@Component({
	template: `
		<div class="Material">
			<ColorPicker
				ref="color"
				:value="color"
				@update="onUpdateColor">Color</ColorPicker>
			<ImageSelector
				ref="mainTexture">Main Texture</ImageSelector>
		</div>
	`,
	data: () => {
		return {
			name: "Material",
			color: ""
		}
	}
})
export class Material extends Vue {
	_material: Tea.Material;
	name: string;
	color: string;

	protected updated(): void {
		this.setMaterial(this._material);
	}

	setMaterial(material: Tea.Material): void {
		this._material = material;
		if (material == null) {
			return;
		}
		this.color = material.color.toCssColor();
		var mainTexture = this.$refs.mainTexture as ImageSelector;
		var url = material.mainTexture.url;
		if (url) {
			mainTexture.url = LocalFile.resolve(url);
		}
	}

	protected onUpdateColor(value: Tea.Color): void {
		this.color = value.toCssColor();
		if (this._material) {
			this._material.color.copy(value);
		}
		this.$emit("update", "color");
	}
}
