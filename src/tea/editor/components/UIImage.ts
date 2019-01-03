import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";
import { ImageSelector } from "../basic/ImageSelector";
import { LocalFile } from "../LocalFile";

@Component({
	template: `
		<div class="Image">
			<ImageSelector
				ref="image"
				@update="onUpdateImage">Image</ImageSelector>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "Image",
			enabled: false,
			src: null
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as UIImage;
			self._component.enabled = value;
		}
	}
})
export class UIImage extends Vue {
	_component: Tea.UI.Image;
	translator: any;
	name: string;
	enabled: boolean;
	src: string;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/Image";
		this.name = translator.getText("Title");
	}

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
		var image = this.$refs.image as ImageSelector;
		var url = component.src;
		if (url) {
			image.url = url;
			//image.url = LocalFile.resolve(url);
		}
	}

	protected onUpdateImage(value: string): void {
		if (this._component) {
			this._component.src = value;
		}
		this.$emit("update", "src");
	}
}

Tea.UI.Image.editorView = UIImage;
