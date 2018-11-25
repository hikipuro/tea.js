import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Editor } from "../Editor";
import { EditorAssets } from "../EditorAssets";

class KeyModel {
	index: number;
	time: number;
}

@Component({
	template: `
		<div
			ref="container"
			class="AnimationCurveImage">
			<canvas ref="canvas"></canvas>
		</div>
	`
})
export class AnimationCurveImage extends Vue {
	draw(curve: Tea.AnimationCurve, lineWidth: number = 1): void {
		var canvas = this.$refs.canvas as HTMLCanvasElement;
		var rect = canvas.getBoundingClientRect();
		if (rect.width !== 0 && rect.height !== 0) {
			canvas.width = rect.width;
			canvas.height = rect.height;
		}
		var context = canvas.getContext("2d");
		context.imageSmoothingEnabled = false;
		var width = canvas.width;
		var height = canvas.height;
		//console.log("draw", rect);
		context.clearRect(0, 0, width, height);
		context.strokeStyle = "orange";
		context.lineWidth = lineWidth;

		height -= 2;
		context.beginPath();
		context.moveTo(0, height);
		var y = 0;
		for (var x = 0; x < width; x++) {
			var time = x / width;
			var value = curve.evaluate(time);
			y = (1.0 - value) * height + 1;
			//console.log(x, value);
			//context.strokeRect(x, y, 1, 1);
			context.lineTo(x, y);
			context.moveTo(x, y);
		}
		context.lineTo(x, y);
		//context.closePath();
		context.stroke();
	}
}

@Component({
	template: `
		<div class="AnimationCurve">
			<div class="title">
				<slot></slot>
			</div>
			<div 
				ref="container"
				class="container"
				tabindex="0"
				@keydown="onKeyDown"
				@click="onClick"
				@change="onChange">
				<AnimationCurveImage
					ref="image"
					class="curve"></AnimationCurveImage>
			</div>
			<Window
				ref="window">
				<div class="container">
					<AnimationCurveImage
						ref="bigImage"></AnimationCurveImage>
				</div>
			</Window>
		</div>
	`,
	props: {
	},
	components: {
		AnimationCurveImage: AnimationCurveImage
	}
})
export class AnimationCurve extends Vue {
	_curve: Tea.AnimationCurve;

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
		});
	}

	hide(): void {
		var window = this.$refs.window as Editor.Window;
		window.hide();
	}

	updateImage(): void {
		var curve = this._curve;
		if (curve == null) {
			return;
		}
		var image = this.$refs.image as AnimationCurveImage;
		if (image) {
			image.draw(curve);
		}
		var bigImage = this.$refs.bigImage as AnimationCurveImage;
		if (bigImage) {
			bigImage.draw(curve);
		}
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
		var image = this.$refs.image as HTMLInputElement;
		//this.$emit("update", image.value);
	}
}
