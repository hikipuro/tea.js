import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Editor } from "../Editor";
import { EditorAssets } from "../EditorAssets";

class Model {
	index: number;
	time: number;
	colorKey?: Tea.GradientColorKey;
	alphaKey?: Tea.GradientAlphaKey;
}

@Component({
	template: `
		<div
			ref="container"
			class="GradientImage">
			<canvas ref="canvas"></canvas>
		</div>
	`
})
export class GradientImage extends Vue {
	protected mounted(): void {
		var container = this.$refs.container as HTMLElement;
		container.style.backgroundImage = "url(" + EditorAssets.Images.Transparent + ")";
	}

	draw(gradient: Tea.Gradient): void {
		var canvas = this.$refs.canvas as HTMLCanvasElement;
		var context = canvas.getContext("2d");
		var width = canvas.width;
		var height = canvas.height;
		context.clearRect(0, 0, width, height);
		for (var x = 0; x < width; x++) {
			var time = x / width;
			var color = gradient.evaluate(time);
			context.fillStyle = color.toCssColor();
			context.fillRect(x, 0, 1, height);
		}
	}
}

@Component({
	template: `
		<div
			ref="anchor"
			class="GradientAnchor">
			<img
				ref="image"
				:src="icon"
				draggable="false"
				@mousedown="onMouseDownImage">
		</div>
	`,
	props: {
		model: {
			type: Object,
			default: null
		}
	},
	data: () => {
		return {
			width: 200,
			icon: EditorAssets.Images.PickerUp
		}
	}
})
export class GradientAnchor extends Vue {
	model: Model;
	width: number;
	icon: string;
	protected _mouseDownX: number = 0;
	protected _mouseDownTime: number = 0;

	protected mounted(): void {
		if (this.model.alphaKey) {
			this.icon = EditorAssets.Images.PickerDown;
		}
		this.updatePosition();
	}

	protected updated(): void {
	}

	updatePosition(): void {
		var anchor = this.$refs.anchor as HTMLElement;
		anchor.style.left = this.model.time * this.width + "px";
	}

	protected onMouseDownImage(e: MouseEvent): void {
		//console.log("onMouseDownImage");
		this._mouseDownX = e.screenX;
		this._mouseDownTime = this.model.time;
		document.addEventListener(
			"mousemove", this.onMouseMoveScreen
		);
		document.addEventListener(
			"mouseup", this.onMouseUpScreen
		);
		this.$emit("select", this);
	}

	protected onMouseMoveScreen(e: MouseEvent): void {
		var offsetX = e.screenX - this._mouseDownX;
		offsetX *= window.innerWidth / window.outerWidth;
		var offsetTime = offsetX / this.width;
		var x = this._mouseDownTime + offsetTime;
		x = Tea.Mathf.clamp01(x);
		this.$emit("update", this, x);
	}

	protected onMouseUpScreen(e: MouseEvent): void {
		//console.log("onMouseUpScreen");
		document.removeEventListener(
			"mousemove", this.onMouseMoveScreen
		);
		document.removeEventListener(
			"mouseup", this.onMouseUpScreen
		);
	}
}

@Component({
	template: `
		<div
			ref="container"
			class="GradientTimePicker">
			<GradientAnchor
				v-for="(item, index) in items"
				ref="items"
				:key="index"
				:model="item"
				@select="onSelectAnchor"
				@update="onUpdateAnchor">
			</GradientAnchor>
		</div>
	`,
	props: {
		mode: {
			type: String,
			default: "color"
		}
	},
	data: () => {
		return {
			items: []
		}
	},
	components: {
		GradientAnchor: GradientAnchor
	}
})
export class GradientTimePicker extends Vue {
	items: Array<Model>;
	mode: string;

	protected mounted(): void {
	}

	setGradient(gradient: Tea.Gradient): void {
		var items: Array<Model> = [];
		if (this.mode === "alpha") {
			gradient.alphaKeys.forEach((key: Tea.GradientAlphaKey, index: number) => {
				items.push({
					index: index,
					time: key.time,
					alphaKey: key.clone()
				});
			});
			this.items = items;
			return;
		}
		gradient.colorKeys.forEach((key: Tea.GradientColorKey, index: number) => {
			items.push({
				index: index,
				time: key.time,
				colorKey: key.clone()
			});
		});
		this.items = items;
	}

	protected onSelectAnchor(anchor: GradientAnchor): void {
		this.$emit("select", anchor);
	}

	protected onUpdateAnchor(anchor: GradientAnchor, time: number): void {
		//console.log("onUpdateAnchor", time);
		/*
		var model = anchor.model;
		model.time = time;
		if (model.colorKey) {
			model.colorKey.time = time;
		} else {
			model.alphaKey.time = time;
		}
		*/
		var model = anchor.model;
		model.time = time;
		anchor.updatePosition();
		this.$emit("update", anchor.model.index, time);
	}
}


@Component({
	template: `
		<div class="Gradient">
			<div
				class="title">
				<slot></slot>
			</div>
			<div 
				ref="container"
				class="container"
				tabindex="0"
				@keydown="onKeyDown"
				@click="onClick"
				@change="onChange">
				<div class="bg"></div>
				<div
					ref="color"
					class="color"
					:style="{
						backgroundColor: value
					}"></div>
			</div>
			<Window
				ref="window"
				@hide="onHideWindow">
				<GradientTimePicker
					ref="pickerAlpha"
					mode="alpha"
					@select="onSelectAlphaTimePicker"
					@update="onUpdateAlphaTimePicker"></GradientTimePicker>
				<GradientImage
					ref="image"></GradientImage>
				<GradientTimePicker
					ref="picker"
					@select="onSelectColorTimePicker"
					@update="onUpdateColorTimePicker"></GradientTimePicker>
				<template
					v-if="mode === 'color'">
					<InputRange
						:min="0"
						:max="255"
						:value="r"
						@update="onUpdateR">R</InputRange>
					<InputRange
						:min="0"
						:max="255"
						:value="g"
						@update="onUpdateG">G</InputRange>
					<InputRange
						:min="0"
						:max="255"
						:value="b"
						@update="onUpdateB">B</InputRange>
				</template>
				<InputRange
					v-if="mode === 'alpha'"
					:min="0"
					:max="255"
					:value="a"
					@update="onUpdateA">A</InputRange>
			</Window>
		</div>
	`,
	props: {
		value: {
			type: String,
			default: ""
		}
	},
	data: () => {
		return {
			mode: "none",
			r: 0,
			g: 0,
			b: 0,
			a: 0
		}
	},
	components: {
		GradientImage: GradientImage,
		GradientTimePicker: GradientTimePicker,
	}
})
export class Gradient extends Vue {
	mode: string;
	value: string;
	r: number;
	g: number;
	b: number;
	a: number;
	protected _gradient: Tea.Gradient;
	protected _alphaKey: Tea.GradientAlphaKey;
	protected _colorKey: Tea.GradientColorKey;

	show(x: number = null, y: number = null): void {
		var window = this.$refs.window as Editor.Window;
		window.isForm = true;
		if (x == null || y == null) {
			var el = this.$el;
			var rect = el.getBoundingClientRect();
			if (x == null) {
				var container = this.$refs.container as HTMLElement;
				x = rect.left + container.offsetLeft;
			}
			if (y == null) {
				y = rect.bottom;
			}
		}
		window.move(x, y);
		window.show(true);
		window.$nextTick(() => {
			var gradient = new Tea.Gradient();
			gradient.setKeys([
				new Tea.GradientColorKey(Tea.Color.blue, 0),
				new Tea.GradientColorKey(Tea.Color.red, 0.1),
				new Tea.GradientColorKey(Tea.Color.yellow, 0.5),
				new Tea.GradientColorKey(Tea.Color.white, 1)
			], [
				new Tea.GradientAlphaKey(1, 0),
				new Tea.GradientAlphaKey(0, 1)
			]);
			this._gradient = gradient;
			var image = this.$refs.image as GradientImage;
			image.draw(gradient);
			var picker = this.$refs.picker as GradientTimePicker;
			picker.setGradient(gradient);
			var pickerAlpha = this.$refs.pickerAlpha as GradientTimePicker;
			pickerAlpha.setGradient(gradient);
		});
	}

	hide(): void {
		var window = this.$refs.window as Editor.Window;
		window.hide();
	}

	protected mounted(): void {
		var bg = this.$refs.bg as HTMLElement;
		bg.style.backgroundImage = "url(" + EditorAssets.Images.Transparent + ")";
	}

	protected updated(): void {
		/*
		//console.log("updated", this.value);
		var color = Tea.Color.fromCssColor(this.value);
		//console.log("updated", color.toString());
		this.r = Math.floor(color.r * 255);
		this.g = Math.floor(color.g * 255);
		this.b = Math.floor(color.b * 255);
		this.a = Math.floor(color.a * 255);
		*/
	}

	protected emitUpdate(r: number, g: number, b: number, a: number): void {
		var rgba = (r << 24) + (g << 16) + (b << 8) + a;
		var color = Tea.Color.fromRGBA32(rgba);
		this.$emit("update", color);
	}

	protected updateImage(): void {
		var image = this.$refs.image as GradientImage;
		var gradient = this._gradient;
		image.draw(gradient);
	}

	protected onKeyDown(e: KeyboardEvent): void {
		switch (e.key) {
			case " ":
			case "Enter":
				this.show();
				break;
			case "Escape":
				this.hide();
				break;
		}
	}

	protected onClick(e: MouseEvent): void {
		e.preventDefault();
		this.show();
	}

	protected onChange(): void {
		var color = this.$refs.color as HTMLInputElement;
		this.$emit("update", color.value);
	}

	protected onHideWindow(): void {
		this.mode = "none";
	}

	protected onSelectAlphaTimePicker(anchor: GradientAnchor): void {
		console.log("onSelectAlphaTimePicker");
		this.mode = "alpha";
		var alphaKey: Tea.GradientAlphaKey = null;
		var index = anchor.model.index;
		alphaKey = this._gradient.alphaKeys[index];
		this._alphaKey = alphaKey;
		if (alphaKey) {
			var alpha = alphaKey.alpha;
			this.a = Math.floor(alpha * 255);
		}
	}

	protected onSelectColorTimePicker(anchor: GradientAnchor): void {
		this.mode = "color";
		var colorKey: Tea.GradientColorKey = null;
		var index = anchor.model.index;
		colorKey = this._gradient.colorKeys[index];
		//console.log("onSelectColorTimePicker", index, colorKey);
		this._colorKey = colorKey;
		if (colorKey) {
			var color = colorKey.color;
			this.r = Math.floor(color[0] * 255);
			this.g = Math.floor(color[1] * 255);
			this.b = Math.floor(color[2] * 255);
		}
	}

	protected onUpdateAlphaTimePicker(index: number, time: number): void {
		var gradient = this._gradient;
		gradient.alphaKeys[index].time = time;
		this.updateImage();
	}

	protected onUpdateColorTimePicker(index: number, time: number): void {
		var gradient = this._gradient;
		gradient.colorKeys[index].time = time;
		this.updateImage();
	}

	protected onUpdateR(value: number): void {
		this.r = value;
		if (this._colorKey) {
			this._colorKey.color[0] = value / 255.0;
		}
		this.updateImage();
		//this.emitUpdate(value, this.g, this.b, this.a);
	}

	protected onUpdateG(value: number): void {
		this.g = value;
		if (this._colorKey) {
			this._colorKey.color[1] = value / 255.0;
		}
		this.updateImage();
		//this.emitUpdate(this.r, value, this.b, this.a);
	}

	protected onUpdateB(value: number): void {
		this.b = value;
		if (this._colorKey) {
			this._colorKey.color[2] = value / 255.0;
		}
		this.updateImage();
		//this.emitUpdate(this.r, this.g, value, this.a);
	}

	protected onUpdateA(value: number): void {
		this.a = value;
		if (this._alphaKey) {
			this._alphaKey.alpha = value / 255.0;
		}
		this.updateImage();
		//this.emitUpdate(this.r, this.g, this.b, value);
	}
}
