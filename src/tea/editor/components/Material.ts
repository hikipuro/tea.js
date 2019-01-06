import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";
import { ImageSelector } from "../basic/ImageSelector";
import { LocalFile } from "../LocalFile";

@Component({
	template: `
		<div class="Material">
			<ColorPicker
				ref="color"
				:value="color"
				@update="onUpdateColor">{{ translator.color }}</ColorPicker>
			<ImageSelector
				ref="mainTexture"
				@update="onUpdateMainTexture">{{ translator.mainTexture }}</ImageSelector>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "Material",
			color: ""
		}
	}
})
export class Material extends Vue {
	_material: Tea.Material;
	translator: any;
	name: string;
	color: string;

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

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/Material";
		this.translator.color = translator.getText("Color");
		this.translator.mainTexture = translator.getText("MainTexture");
	}

	protected updated(): void {
		this.setMaterial(this._material);
	}

	protected onUpdateColor(value: Tea.Color): void {
		this.color = value.toCssColor();
		if (this._material) {
			this._material.color.copy(value);
		}
		this.$emit("update", "color");
	}

	protected onUpdateMainTexture(value: string): void {
		if (this._material) {
			this._material.mainTexture.load(value);
		}
		this.$emit("update", "mainTexture");
	}
}
