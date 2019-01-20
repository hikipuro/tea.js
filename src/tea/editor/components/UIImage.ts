import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";
import { ImageSelector } from "../basic/ImageSelector";
import { LocalFile } from "../LocalFile";

@Component({
	template: `
		<div class="Image">
			<Vector2
				ref="size"
				:x="size[0]"
				:y="size[1]"
				:step="1"
				@update="onUpdateSize">{{ translator.size }}</Vector2>
			<ImageSelector
				ref="image"
				@update="onUpdateImage">{{ name }}</ImageSelector>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "Image",
			enabled: false,
			size: [0, 0],
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
	size: Array<number>;
	src: string;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/Image";
		this.name = translator.getText("Title");
		this.translator.size = translator.getText("Size");
	}

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
		this.$set(this.size, 0, component.width);
		this.$set(this.size, 1, component.height);
		var image = this.$refs.image as ImageSelector;
		var url = component.url;
		if (url) {
			url = LocalFile.resolve("assets", url);
			image.url = url;
			//image.url = LocalFile.resolve(url);
		}
	}

	protected onUpdateSize(x: number, y: number): void {
		this.$set(this.size, 0, x);
		this.$set(this.size, 1, y);
		if (this._component != null) {
			this._component.width = x;
			this._component.height = y;
		}
		this.$emit("update", "size");
	}
	
	protected onUpdateImage(value: string): void {
		if (this._component) {
			this._component.url = value;
		}
		this.$emit("update", "src");
	}
}

Tea.UI.Image.editorView = UIImage;
