import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Editor } from "../Editor";
import { EditorAssets } from "../EditorAssets";

class KeyModel {
	index: number;
	time: number;
	isAlphaKey: boolean;
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
			if (color[3] <= 0.0) {
				continue;
			}
			context.fillStyle = color.toCssColor();
			context.fillRect(x, 0, 1, height);
		}
	}
}

@Component({
	template: `
		<div
			ref="container"
			class="GradientKey">
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
			icon: EditorAssets.Images.PickerUp
		}
	}
})
export class GradientKey extends Vue {
	static readonly RemoveRange = 20;
	model: KeyModel;
	icon: string;
	protected _mouseDownX: number = 0;
	protected _mouseDownY: number = 0;
	protected _mouseDownTime: number = 0;

	protected mounted(): void {
		if (this.model.isAlphaKey) {
			this.icon = EditorAssets.Images.PickerDown;
		}
		this.updatePosition();
	}

	updatePosition(): void {
		var container = this.$refs.container as HTMLElement;
		var width = this.getParentWidth();
		container.style.left = this.model.time * width + "px";
	}

	protected getParentWidth(): number {
		var parent = this.$parent.$el;
		var rect = parent.getBoundingClientRect();
		return rect.width;
	}

	protected getItemCount(): number {
		var parent = this.$parent as GradientKeys;
		return parent.getCount();
	}

	protected removeMouseEvents(): void {
		document.removeEventListener(
			"mousemove", this.onMouseMoveScreen
		);
		document.removeEventListener(
			"mouseup", this.onMouseUpScreen
		);
	}

	protected onMouseDownImage(e: MouseEvent): void {
		//console.log("onMouseDownImage");
		e.stopPropagation();
		this._mouseDownX = e.screenX;
		this._mouseDownY = e.screenY;
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
		if (this.getItemCount() > 2) {
			var offsetY = e.screenY - this._mouseDownY;
			if (Math.abs(offsetY) > GradientKey.RemoveRange) {
				this.removeMouseEvents();
				this.$emit("remove", this);
				return;
			}
		}
		var offsetX = e.screenX - this._mouseDownX;
		offsetX *= window.innerWidth / window.outerWidth;
		var offsetTime = offsetX / this.getParentWidth();
		var x = this._mouseDownTime + offsetTime;
		x = Tea.Mathf.clamp01(x);
		this.$emit("update", this, x);
	}

	protected onMouseUpScreen(e: MouseEvent): void {
		//console.log("onMouseUpScreen");
		this.removeMouseEvents();
	}
}

@Component({
	template: `
		<div
			ref="container"
			class="GradientKeys"
			@mousedown="onMouseDown">
			<GradientKey
				v-for="(item, index) in items"
				ref="items"
				:key="index"
				:model="item"
				@select="onSelect"
				@update="onUpdate"
				@remove="onRemove">
			</GradientKey>
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
		GradientKey: GradientKey
	}
})
export class GradientKeys extends Vue {
	static readonly MaxKeys = 10;
	items: Array<KeyModel>;
	mode: string;
	_alphaKeys: Array<Tea.GradientAlphaKey>;
	_colorKeys: Array<Tea.GradientColorKey>;

	setGradient(gradient: Tea.Gradient): void {
		this.items = null;
		this.$nextTick(() => {
			if (this.mode === "alpha") {
				this._alphaKeys = gradient.alphaKeys;
				this.items = this.createAlphaKeyItems(gradient);
				return;
			}
			this._colorKeys = gradient.colorKeys;
			this.items = this.createColorKeyItems(gradient);
		});
	}

	getCount(): number {
		return this.items.length;
	}

	protected createAlphaKeyItems(gradient: Tea.Gradient): Array<KeyModel> {
		var items: Array<KeyModel> = [];
		gradient.alphaKeys.forEach((key: Tea.GradientAlphaKey, index: number) => {
			items.push({
				index: index,
				time: key.time,
				isAlphaKey: true
			});
		});
		return items;
	}

	protected createColorKeyItems(gradient: Tea.Gradient): Array<KeyModel> {
		var items: Array<KeyModel> = [];
		gradient.colorKeys.forEach((key: Tea.GradientColorKey, index: number) => {
			items.push({
				index: index,
				time: key.time,
				isAlphaKey: false
			});
		});
		return items;
	}

	protected findItem(model: KeyModel): GradientKey {
		var items = this.$refs.items as Array<GradientKey>;
		return items.find((key: GradientKey) => {
			return key.model.index === model.index;
		});
	}

	protected onMouseDown(e: MouseEvent): void {
		//console.log("onMouseDown");
		if (this.items.length >= GradientKeys.MaxKeys) {
			return;
		}
		var offsetX = e.offsetX;
		offsetX *= window.innerWidth / window.outerWidth;
		var time = offsetX / this.$el.clientWidth;
		time = Tea.Mathf.clamp01(time);
		
		var isAlphaKey = false;
		if (this.mode === "alpha") {
			isAlphaKey = true;
		}
		var length = this.items.length;
		var model = {
			index: length,
			time: time,
			isAlphaKey: isAlphaKey
		};
		this.items.push(model);

		var keys: Array<any> = this._colorKeys;
		if (isAlphaKey) {
			keys = this._alphaKeys;
			keys.push(new Tea.GradientAlphaKey(
				1.0, time
			));
		} else {
			keys.push(new Tea.GradientColorKey(
				Tea.Color.white.clone(), time
			));
		}
		this.$nextTick(() => {
			var item = this.findItem(model);
			item.$emit("select", item);
			this.sortKeys(keys, model);
			keys[model.index].time = time;
			this.$emit("update", model.index, time);
		})
	}

	protected onSelect(key: GradientKey): void {
		this.$emit("select", key);
	}

	protected onUpdate(key: GradientKey, time: number): void {
		//console.log("onUpdate", time);
		var model = key.model;
		model.time = time;
		key.updatePosition();

		if (this.mode === "alpha") {
			this.sortKeys(this._alphaKeys, model);
			this._alphaKeys[model.index].time = time;
		} else {
			this.sortKeys(this._colorKeys, model);
			this._colorKeys[model.index].time = time;
		}

		//console.log("onUpdate", time, index);
		this.$emit("update", model.index, time);
	}

	protected onRemove(key: GradientKey): void {
		var index = key.model.index;
		//console.log("onRemove", index);
		if (this.mode === "alpha") {
			this._alphaKeys.splice(index, 1);
		} else {
			this._colorKeys.splice(index, 1);
		}
		this.$emit("redraw", null);
	}

	protected sortKeys(keys: Array<any>, model: KeyModel): void {
		for (var i = 0; i < 100; i++) {
			var sorted = this._sortKeys(keys, model);
			if (sorted === false) {
				break;
			}
		}
	}

	protected _sortKeys(keys: Array<any>, model: KeyModel): boolean {
		var items = this.items;
		var index = model.index;
		var lastIndex = items.length - 1;
		if (index !== 0) {
			var prevIndex = index - 1;
			var prev = items.find((item: KeyModel) => {
				return item.index === prevIndex;
			});
			if (prev && model.time < prev.time) {
				var key = keys[index];
				keys[index] = keys[prevIndex];
				keys[prevIndex] = key;
				var i = model.index;
				model.index = prev.index;
				prev.index = i;
				return true;
			}
		}
		if (index !== lastIndex) {
			var nextIndex = index + 1;
			var next = items.find((item: KeyModel) => {
				return item.index === nextIndex;
			});
			if (next && model.time > next.time) {
				var key = keys[index];
				keys[index] = keys[nextIndex];
				keys[nextIndex] = key;
				var i = model.index;
				model.index = next.index;
				next.index = i;
				return true;
			}
		}
		return false;
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
				<div
					ref="bg"
					class="bg"></div>
				<GradientImage
					ref="color"
					class="color"></GradientImage>
			</div>
			<Window
				ref="window"
				@hide="onHideWindow">
				<div class="container">
					<GradientKeys
						ref="alphaKeys"
						mode="alpha"
						@select="onSelectAlphaKey"
						@update="onUpdateAlphaKey"
						@redraw="onRequestRedrawKeys"></GradientKeys>
					<GradientImage
						ref="image"></GradientImage>
					<GradientKeys
						ref="colorKeys"
						@select="onSelectColorKey"
						@update="onUpdateColorKey"
						@redraw="onRequestRedrawKeys"></GradientKeys>
				</div>
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
		GradientKeys: GradientKeys,
	}
})
export class Gradient extends Vue {
	mode: string;
	r: number;
	g: number;
	b: number;
	a: number;
	_gradient: Tea.Gradient;
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
			this.updateImage();
			this.setKeys();
		});
	}

	hide(): void {
		var window = this.$refs.window as Editor.Window;
		window.hide();
	}

	updateImage(): void {
		var gradient = this._gradient;
		if (gradient == null) {
			return;
		}
		var image = this.$refs.image as GradientImage;
		if (image) {
			image.draw(gradient);
		}
		var color = this.$refs.color as GradientImage;
		if (color) {
			color.draw(gradient);
		}
	}

	protected mounted(): void {
		var bg = this.$refs.bg as HTMLElement;
		bg.style.backgroundImage = "url(" + EditorAssets.Images.Transparent + ")";
	}

	protected updated(): void {
		/*var gradient = this._gradient;
		if (gradient) {
			var color = this.$refs.color as GradientImage;
			color.draw(gradient);
		}*/
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

	protected setKeys(): void {
		var gradient = this._gradient;
		if (gradient == null) {
			return;
		}
		var alphaKeys = this.$refs.alphaKeys as GradientKeys;
		alphaKeys.setGradient(gradient);
		var colorKeys = this.$refs.colorKeys as GradientKeys;
		colorKeys.setGradient(gradient);
	}

	protected emitUpdate(): void {
		this.$emit("update", this._gradient);
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

	protected onRequestRedrawKeys(): void {
		this.mode = "none";
		this._alphaKey = null;
		this._colorKey = null;
		this.updateImage();
		this.setKeys();
	}

	protected onSelectAlphaKey(key: GradientKey): void {
		//console.log("onSelectAlphaKey");
		if (key == null) {
			this.mode = "none";
			this._alphaKey = null;
			return;
		}
		this.mode = "alpha";
		var index = key.model.index;
		var alphaKey = this._gradient.alphaKeys[index];
		this._alphaKey = alphaKey;
		if (alphaKey) {
			var alpha = alphaKey.alpha;
			this.a = Math.floor(alpha * 255);
		}
	}

	protected onSelectColorKey(key: GradientKey): void {
		if (key == null) {
			this.mode = "none";
			this._colorKey = null;
			return;
		}
		this.mode = "color";
		var index = key.model.index;
		var colorKey = this._gradient.colorKeys[index];
		//console.log("onSelectColorKey", index, colorKey);
		this._colorKey = colorKey;
		if (colorKey) {
			var color = colorKey.color;
			this.r = Math.floor(color[0] * 255);
			this.g = Math.floor(color[1] * 255);
			this.b = Math.floor(color[2] * 255);
		}
	}

	protected onUpdateAlphaKey(index: number, time: number): void {
		//var gradient = this._gradient;
		//gradient.alphaKeys[index].time = time;
		this.updateImage();
		this.emitUpdate();
	}

	protected onUpdateColorKey(index: number, time: number): void {
		//var gradient = this._gradient;
		//gradient.colorKeys[index].time = time;
		this.updateImage();
		this.emitUpdate();
	}

	protected onUpdateR(value: number): void {
		this.r = value;
		if (this._colorKey) {
			this._colorKey.color[0] = value / 255.0;
		}
		this.updateImage();
		this.emitUpdate();
	}

	protected onUpdateG(value: number): void {
		this.g = value;
		if (this._colorKey) {
			this._colorKey.color[1] = value / 255.0;
		}
		this.updateImage();
		this.emitUpdate();
	}

	protected onUpdateB(value: number): void {
		this.b = value;
		if (this._colorKey) {
			this._colorKey.color[2] = value / 255.0;
		}
		this.updateImage();
		this.emitUpdate();
	}

	protected onUpdateA(value: number): void {
		this.a = value;
		if (this._alphaKey) {
			this._alphaKey.alpha = value / 255.0;
		}
		this.updateImage();
		this.emitUpdate();
	}
}
