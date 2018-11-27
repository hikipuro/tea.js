import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Editor } from "../Editor";
import { EditorAssets } from "../EditorAssets";

class ControlPointModel {
	index: number;
	time: number;
	value: number;
}

class AnchorPointModel {
	index: number;
	time: number;
	value: number;
	tangent: number;
	//weight: number;
	//mode: Tea.WeightedMode;
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

		var firstKey = curve.keys[0];
		context.beginPath();
		var y = (1.0 - firstKey.value) * height + 1;
		context.moveTo(0, y);
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
		<div
			ref="container"
			class="ControlPoint">
			<div
				ref="outer"
				class="outer">
				<img
					ref="image"
					:src="icon"
					draggable="false"
					@load.once="onLoadImage"
					@mousedown="onMouseDownImage">
			</div>
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
			icon: EditorAssets.Images.ControlPoint
		}
	}
})
export class ControlPoint extends Vue {
	model: ControlPointModel;
	icon: string;
	protected _mouseDownX: number = 0;
	protected _mouseDownY: number = 0;
	protected _mouseDownTime: number = 0;
	protected _mouseDownValue: number = 0;

	protected mounted(): void {
		this.updatePosition();
	}

	updatePosition(): void {
		var container = this.$refs.container as HTMLElement;
		var rect = this.getParentRect();
		var value = 1.0 - this.model.value;
		container.style.left = this.model.time * rect.width + "px";
		container.style.top = value * rect.height + "px";
	}

	protected getParentRect(): ClientRect {
		var parent = this.$parent.$el;
		var rect = parent.getBoundingClientRect();
		return rect;
	}

	protected addMouseEvents(): void {
		document.addEventListener(
			"mousemove", this.onMouseMoveScreen
		);
		document.addEventListener(
			"mouseup", this.onMouseUpScreen
		);
	}

	protected removeMouseEvents(): void {
		document.removeEventListener(
			"mousemove", this.onMouseMoveScreen
		);
		document.removeEventListener(
			"mouseup", this.onMouseUpScreen
		);
	}

	protected onLoadImage(e: Event): void {
		var outer = this.$refs.outer as HTMLElement;
		var image = this.$refs.image as HTMLImageElement;
		var rect = image.getBoundingClientRect();
		outer.style.width = rect.width + "px";
		outer.style.height = rect.height + "px";
	}

	protected onMouseDownImage(e: MouseEvent): void {
		//console.log("onMouseDownImage");
		e.stopPropagation();
		this._mouseDownX = e.screenX;
		this._mouseDownY = e.screenY;
		this._mouseDownTime = this.model.time;
		this._mouseDownValue = this.model.value;
		this.addMouseEvents();
		this.$emit("select", this);
	}

	protected onMouseMoveScreen(e: MouseEvent): void {
		var screenScale = window.innerWidth / window.outerWidth;
		var rect = this.getParentRect();
		var offsetX = (e.screenX - this._mouseDownX) * screenScale;
		var offsetY = (this._mouseDownY - e.screenY) * screenScale;
		var x = this._mouseDownTime + (offsetX / rect.width);
		var y = this._mouseDownValue + (offsetY / rect.height);
		x = Tea.Mathf.clamp01(x);
		y = Tea.Mathf.clamp01(y);
		this.$emit("update", this, x, y);
		//console.log("onMouseMoveScreen", x, y);
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
			class="AnchorPoint"
			v-if="visible">
			<div
				ref="outer"
				class="outer">
				<img
					ref="image"
					:src="icon"
					draggable="false"
					@load.once="onLoadImage"
					@mousedown="onMouseDownImage">
			</div>
		</div>
	`,
	props: {
		isLeft: {
			type: Boolean,
			default: false
		}
		/*model: {
			type: Object,
			default: null
		}*/
	},
	data: () => {
		return {
			model: null,
			icon: EditorAssets.Images.AnchorPoint,
			visible: false
		}
	}
})
export class AnchorPoint extends Vue {
	model: AnchorPointModel;
	icon: string;
	visible: boolean;
	isLeft: boolean;

	protected mounted(): void {
		//this.updatePosition();
	}

	updatePosition(): void {
		this.$nextTick(() => {
			var container = this.$refs.container as HTMLElement;
			var rect = this.getParentRect();
			var model = this.model;
			var x = model.time;
			var y = model.value;
			var weight = 1.0 / 3.0;
			var tangent = model.tangent;
			var angle = Math.atan(tangent);
			//console.log(tangent, angle);
			var dx = Math.cos(angle) * weight;

			var left = x * rect.width;
			if (this.isLeft) {
				left -= dx * rect.height;
				y -= Math.sin(angle) * weight;
			} else {
				left += dx * rect.height;
				y += Math.sin(angle) * weight;
			}
			y = 1.0 - y;
			container.style.left = left + "px";
			container.style.top = y * rect.height + "px";
		});
	}

	protected getParentRect(): ClientRect {
		var parent = this.$parent.$el;
		var rect = parent.getBoundingClientRect();
		return rect;
	}

	protected getControlPoint(): ControlPoint {
		var parent = this.$parent as Keyframes;
		return parent.getControlPoint(this.model.index);
	}

	protected addMouseEvents(): void {
		var keyframes = this.$parent as Keyframes;
		var canvas = keyframes.$refs.canvas as HTMLElement;

		canvas.addEventListener(
			"mousemove", this.onMouseMoveScreen
		);
		/*document.addEventListener(
			"mousemove", this.onMouseMoveScreen
		);*/
		document.addEventListener(
			"mouseup", this.onMouseUpScreen
		);
	}

	protected removeMouseEvents(): void {
		var keyframes = this.$parent as Keyframes;
		var canvas = keyframes.$refs.canvas as HTMLElement;

		canvas.removeEventListener(
			"mousemove", this.onMouseMoveScreen
		);
		/*document.removeEventListener(
			"mousemove", this.onMouseMoveScreen
		);*/
		document.removeEventListener(
			"mouseup", this.onMouseUpScreen
		);
	}

	protected onLoadImage(e: Event): void {
		var outer = this.$refs.outer as HTMLElement;
		var image = this.$refs.image as HTMLImageElement;
		var rect = image.getBoundingClientRect();
		outer.style.width = rect.width + "px";
		outer.style.height = rect.height + "px";
	}

	protected onMouseDownImage(e: MouseEvent): void {
		//console.log("onMouseDownImage anchor");
		e.stopPropagation();
		this.addMouseEvents();
		this.$emit("select", this);
	}

	protected onMouseMoveScreen(e: MouseEvent): void {
		var screenScale = window.innerWidth / window.outerWidth;
		var rect = this.getParentRect();
		var controlPoint = this.getControlPoint();
		if (controlPoint == null) {
			return;
		}
		var el = controlPoint.$el as HTMLElement;
		var x = e.offsetX - el.offsetLeft;
		var y = -e.offsetY + el.offsetTop;
		//console.log(x, y);
		x /= rect.width;
		y /= rect.height;
		var tangent = 0.0;
		if (x > 0) {
			tangent = y / x;
		}
		this.$emit("update", this, tangent);
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
			class="Keyframes">
			<canvas ref="canvas"></canvas>
			<ControlPoint
				v-for="(item, index) in controlPoints"
				ref="controlPoints"
				:key="index"
				:model="item"
				@select="onSelectControlPoint"
				@update="onUpdateControlPoint">
			</ControlPoint>
			<AnchorPoint
				ref="anchorRight"
				:isLeft="false"
				@update="onUpdateAnchorPoint"></AnchorPoint>
			<AnchorPoint
				ref="anchorLeft"
				:isLeft="true"></AnchorPoint>
		</div>
	`,
	data: () => {
		return {
			controlPoints: []
		}
	},
	components: {
		ControlPoint: ControlPoint,
		AnchorPoint: AnchorPoint
	}
})
export class Keyframes extends Vue {
	static readonly MaxCount = 10;
	controlPoints: Array<ControlPointModel>;
	//anchorPoint: AnchorPoint;
	_keys: Array<Tea.Keyframe>;

	setAnimationCurve(curve: Tea.AnimationCurve): void {
		this.controlPoints = null;
		this.$nextTick(() => {
			this._keys = curve.keys;
			this.controlPoints = this.createControlPoints();
		});
	}

	getCount(): number {
		return this.controlPoints.length;
	}

	getControlPoint(index: number): ControlPoint {
		var controlPoints = this.$refs.controlPoints as Array<ControlPoint>;
		return controlPoints.find((point: ControlPoint) => {
			return point.model.index === index;
		});
	}

	getAnchorRight(): AnchorPoint {
		return this.$refs.anchorRight as AnchorPoint;
	}

	getAnchorLeft(): AnchorPoint {
		return this.$refs.anchorLeft as AnchorPoint;
	}

	protected drawLine(point: ControlPoint): void {
		var canvas = this.$refs.canvas as HTMLCanvasElement;
		var context = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.strokeStyle = "red";
		context.lineWidth = 1;
		var x = point.model.time * canvas.width;
		var y = (1.0 - point.model.value) * canvas.height;

		var weight = 1.0 / 3.0;
		var anchorRight = this.getAnchorRight();
		var angle = Math.atan(anchorRight.model.tangent);
		var dx = Math.cos(angle) * weight;
		var dy = -Math.sin(angle) * weight;
		var ax = x + dx * canvas.height;
		var ay = y + dy * canvas.height;
		context.beginPath();
		context.moveTo(x, y);
		context.lineTo(ax, ay);
		context.stroke();

		var anchorLeft = this.getAnchorLeft();
		angle = Math.atan(anchorLeft.model.tangent);
		dx = -Math.cos(angle) * weight;
		dy = Math.sin(angle) * weight;
		ax = x + dx * canvas.height;
		ay = y + dy * canvas.height;
		context.beginPath();
		context.moveTo(x, y);
		context.lineTo(ax, ay);
		context.stroke();
	}

	protected createControlPoints(): Array<ControlPointModel> {
		var items: Array<ControlPointModel> = [];
		var length = this._keys.length;
		for (var i = 0; i < length; i++) {
			var key = this._keys[i];
			items.push({
				index: i,
				time: key.time,
				value: key.value
			});
		}
		return items;
	}

	protected findModel(index: number): ControlPointModel {
		return this.controlPoints.find((item: ControlPointModel) => {
			return item.index === index;
		});
	}

	protected swapKeys(keys: Array<any>, modelA: ControlPointModel, modelB: ControlPointModel): void {
		var indexA = modelA.index;
		var indexB = modelB.index;
		var key = keys[indexA];
		keys[indexA] = keys[indexB];
		keys[indexB] = key;
		modelA.index = indexB;
		modelB.index = indexA;
	}

	protected sortKeys(keys: Array<any>, model: ControlPointModel): void {
		var items = this.controlPoints;
		var lastIndex = items.length - 1;
		var length = Keyframes.MaxCount;
		for (var i = 0; i < length; i++) {
			var index = model.index;
			if (index !== 0) {
				var prev = this.findModel(index - 1);
				if (prev && model.time < prev.time) {
					this.swapKeys(keys, model, prev);
					continue;
				}
			}
			if (index !== lastIndex) {
				var next = this.findModel(index + 1);
				if (next && model.time > next.time) {
					this.swapKeys(keys, model, next);
					continue;
				}
			}
			break;
		}
	}

	protected updateAnchorPoint(point: ControlPoint): void {
		var model = point.model;
		var key = this._keys[model.index];
		//console.log(key.time);

		var newModel = {
			index: model.index,
			time: key.time,
			value: key.value,
			tangent: key.outTangent,
			//weight: key.outWeight,
			//mode: key.weightedMode
		};

		var anchorRight = this.getAnchorRight();
		anchorRight.model = newModel;
		anchorRight.visible = true;
		anchorRight.updatePosition();

		var anchorLeft = this.getAnchorLeft();
		anchorLeft.model = newModel;
		anchorLeft.visible = true;
		anchorLeft.updatePosition();
	}

	protected onSelectControlPoint(point: ControlPoint): void {
		this.updateAnchorPoint(point);
		this.drawLine(point);
	}

	protected onUpdateControlPoint(point: ControlPoint, time: number, value: number): void {
		//console.log("onUpdate");
		var model = point.model;
		var key = this._keys[model.index];
		key.time = time;
		key.value = value;
		model.time = time;
		model.value = value;
		point.updatePosition();
		this.updateAnchorPoint(point);
		this.drawLine(point);
		this.$emit("update");
	}

	protected onUpdateAnchorPoint(point: AnchorPoint, tangent: number): void {
		//console.log("onUpdateAnchorPoint", time, value);
		var model = point.model;
		var key = this._keys[model.index];
		key.outTangent = tangent;
		//key.outWeight = weight;
		model.tangent = tangent;
		//point.updatePosition();

		var controlPoint = this.getControlPoint(model.index);
		this.updateAnchorPoint(controlPoint);
		this.drawLine(controlPoint);
		this.$emit("update");
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
					<Keyframes
						ref="keyframes"
						@update="onUpdateKeyframes"></Keyframes>
				</div>
			</Window>
		</div>
	`,
	props: {
	},
	components: {
		AnimationCurveImage: AnimationCurveImage,
		Keyframes: Keyframes
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
			var keys = this._curve.keys;
			//keys[0].weightedMode = Tea.WeightedMode.Both;
			keys[0].outTangent = 0;
			//keys[0].outWeight = 1;
			this._curve.keys.forEach((key) => {
				//key.weightedMode = Tea.WeightedMode.Both;
				console.log(
					key.time, key.value,
					key.inTangent, key.outTangent,
					//key.inWeight, key.outWeight,
					//key.weightedMode
				);
			});
			this.updateImage();
			var keyframes = this.$refs.keyframes as Keyframes;
			keyframes.setAnimationCurve(this._curve);
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

	protected onUpdateKeyframes(): void {
		this.updateImage();
	}
}
