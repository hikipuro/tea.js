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
			<ColorPicker
				ref="background"
				:value="background"
				@update="onUpdateBackground">{{ translator.background }}</ColorPicker>
			<InputNumber
				ref="borderRadius"
				:value="borderRadius"
				:step="0.25"
				:min="0.0"
				:max="1000.0"
				@update="onUpdateBorderRadius">{{ translator.borderRadius }}</InputNumber>
			<CheckBox
				ref="border"
				:value="border"
				@update="onUpdateBorder">{{ translator.border }}</CheckBox>
			<InputNumber
				ref="borderWidth"
				:value="borderWidth"
				:step="0.25"
				:min="0.0"
				:max="1000.0"
				@update="onUpdateBorderWidth">{{ translator.borderWidth }}</InputNumber>
			<ColorPicker
				ref="borderColor"
				:value="borderColor"
				@update="onUpdateBorderColor">{{ translator.borderColor }}</ColorPicker>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "Image",
			enabled: false,
			size: [0, 0],
			src: null,
			background: "",
			border: false,
			borderWidth: 0,
			borderRadius: 0,
			borderColor: ""
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
	background: string;
	border: boolean;
	borderWidth: number;
	borderRadius: number;
	borderColor: string;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/Image";
		this.name = translator.getText("Title");
		this.translator.size = translator.getText("Size");
		this.translator.background = translator.getText("Background");
		this.translator.border = translator.getText("Border");
		this.translator.borderWidth = translator.getText("BorderWidth");
		this.translator.borderRadius = translator.getText("BorderRadius");
		this.translator.borderColor = translator.getText("BorderColor");
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
		this.background = component.background.toCssColor();
		this.border = component.border;
		this.borderWidth = component.borderWidth;
		this.borderRadius = component.borderRadius;
		this.borderColor = component.borderColor.toCssColor();
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

	protected onUpdateBackground(value: Tea.Color): void {
		this.background = value.toCssColor();
		if (this._component) {
			this._component.background = value;
		}
		this.$emit("update", "background");
	}

	protected onUpdateBorder(value: boolean): void {
		this.border = value;
		if (this._component) {
			this._component.border = value;
		}
		this.$emit("update", "border");
	}

	protected onUpdateBorderWidth(value: number): void {
		this.borderWidth = value;
		if (this._component) {
			this._component.borderWidth = value;
		}
		this.$emit("update", "borderWidth");
	}

	protected onUpdateBorderRadius(value: number): void {
		this.borderRadius = value;
		if (this._component) {
			this._component.borderRadius = value;
		}
		this.$emit("update", "borderRadius");
	}

	protected onUpdateBorderColor(value: Tea.Color): void {
		this.borderColor = value.toCssColor();
		if (this._component) {
			this._component.borderColor = value;
		}
		this.$emit("update", "borderColor");
	}
}

Tea.UI.Image.editorView = UIImage;
