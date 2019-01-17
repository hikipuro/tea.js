import * as Tea from "../Tea";

declare global {
	interface CanvasRenderingContext2D {
		currentTransform: any;
		//currentTransform: DOMMatrix | SVGMatrix;
		direction: string;
		filter: string;
		imageSmoothingQuality: string;
		resetTransform(): void;
		//addHitRegion(options: any): void;
		//removeHitRegion(id: string): void;
		//clearHitRegions(): void;
	}
}

export class Graphics2D {
	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;
	protected _width: number;
	protected _height: number;
	protected _alpha: boolean;
	protected _lineSpacing: number;
	protected _fontSize: number;
	protected _textVerticalAlign: string;

	constructor(width: number = 1, height: number = 1, alpha: boolean = true) {
		if (width <= 0) {
			width = 1;
		}
		if (height <= 0) {
			height = 1;
		}
		var canvas = document.createElement("canvas");
		canvas.width = Tea.Mathf.closestPowerOfTwo(width);
		canvas.height = Tea.Mathf.closestPowerOfTwo(height);
		this._width = width;
		this._height = height;
		this._alpha = alpha;
		this._lineSpacing = 1.0;
		this._fontSize = 12;
		this._textVerticalAlign = "top";
		this.canvas = canvas;
		this.context = this.getContext();
	}

	get width(): number {
		return this._width;
	}
	set width(value: number) {
		if (value <= 0) {
			value = 1;
		}
		if (value === this._width) {
			return;
		}
		this._width = value;
		this.canvas.width = Tea.Mathf.closestPowerOfTwo(value);
		//this.context = this.getContext();
	}

	get height(): number {
		return this._height;
	}
	set height(value: number) {
		if (value <= 0) {
			value = 1;
		}
		if (value === this._height) {
			return;
		}
		this._height = value;
		this.canvas.height = Tea.Mathf.closestPowerOfTwo(value);
		//this.context = this.getContext();
	}

	get lineWidth(): number { return this.context.lineWidth; }
	set lineWidth(value: number) { this.context.lineWidth = value; }
	get lineSpacing(): number { return this._lineSpacing; }
	set lineSpacing(value: number) { this._lineSpacing = value; }
	get lineCap(): string { return this.context.lineCap; }
	set lineCap(value: string) { this.context.lineCap = value as any; }
	get lineJoin(): string { return this.context.lineJoin; }
	set lineJoin(value: string) { this.context.lineJoin = value as any; }
	get miterLimit(): number { return this.context.miterLimit; }
	set miterLimit(value: number) { this.context.miterLimit = value; }
	get lineDashOffset(): number { return this.context.lineDashOffset; }
	set lineDashOffset(value: number) { this.context.lineDashOffset = value; }

	get font(): string { return this.context.font; }
	set font(value: string) {
		this.context.font = value;
		var values = value.split(/\s+/);
		for (var i = 0; i < values.length; i++) {
			var matches = values[i].match(/(.+)px/);
			if (matches) {
				this._fontSize = parseFloat(matches[1]);
				break;
			}
		}
	}
	get fontSize(): number { return this._fontSize; }
	get textAlign(): string { return this.context.textAlign; }
	set textAlign(value: string) { this.context.textAlign = value as any; }
	get textVerticalAlign(): string { return this._textVerticalAlign; }
	set textVerticalAlign(value: string) { this._textVerticalAlign = value; }
	get textBaseline(): string { return this.context.textBaseline; }
	set textBaseline(value: string) { this.context.textBaseline = value as any; }
	get direction(): string { return this.context.direction; }
	set direction(value: string) { this.context.direction = value as any; }

	get fillStyle(): string | CanvasGradient | CanvasPattern { return this.context.fillStyle; }
	set fillStyle(value: string | CanvasGradient | CanvasPattern) { this.context.fillStyle = value; }
	get strokeStyle(): string | CanvasGradient | CanvasPattern { return this.context.strokeStyle; }
	set strokeStyle(value: string | CanvasGradient | CanvasPattern) { this.context.strokeStyle = value; }

	get shadowBlur(): number { return this.context.shadowBlur; }
	set shadowBlur(value: number) { this.context.shadowBlur = value; }
	get shadowColor(): string { return this.context.shadowColor; }
	set shadowColor(value: string) { this.context.shadowColor = value; }
	get shadowOffsetX(): number { return this.context.shadowOffsetX; }
	set shadowOffsetX(value: number) { this.context.shadowOffsetX = value; }
	get shadowOffsetY(): number { return this.context.shadowOffsetY; }
	set shadowOffsetY(value: number) { this.context.shadowOffsetY = value; }

	get currentTransform(): any { return this.context.currentTransform; }
	set currentTransform(value: any) { this.context.currentTransform = value; }

	get globalAlpha(): number { return this.context.globalAlpha; }
	set globalAlpha(value: number) { this.context.globalAlpha = value; }
	get globalCompositeOperation(): string { return this.context.globalCompositeOperation; }
	set globalCompositeOperation(value: string) { this.context.globalCompositeOperation = value; }

	get imageSmoothingEnabled(): boolean { return this.context.imageSmoothingEnabled; }
	set imageSmoothingEnabled(value: boolean) { this.context.imageSmoothingEnabled = value; }
	get imageSmoothingQuality(): string { return this.context.imageSmoothingQuality; }
	set imageSmoothingQuality(value: string) { this.context.imageSmoothingQuality = value as any; }

	get filter(): string { return this.context.filter; }
	set filter(value: string) { this.context.filter = value; }

	destroy(): void {
		this.context = undefined;
		this.canvas = undefined;
		this._width = undefined;
		this._height = undefined;
		this._alpha = undefined;
		this._lineSpacing = undefined;
	}

	clear(): void {
		var w = this.canvas.width;
		var h = this.canvas.height;
		this.context.clearRect(0, 0, w, h);
	}

	clearRect(x: number, y: number, width: number, height: number): void {
		this.context.clearRect(x, y, width, height);
	}

	fillRect(x: number = 0, y: number = 0, width: number = null, height: number = null): void {
		if (width == null) {
			width = this._width;
		}
		if (height == null) {
			height = this._height;
		}
		this.context.fillRect(x, y, width, height);
	}

	storokeRect(x: number = 0, y: number = 0, width: number = null, height: number = null): void {
		if (width == null) {
			width = this._width;
		}
		if (height == null) {
			height = this._height;
		}
		this.context.strokeRect(x, y, width, height);
	}

	fillRoundRect(x: number, y: number, width: number, height: number, radius: number): void {
		this.drawRoundRect(x, y, width, height, radius);
		this.context.fill();
	}

	storokeRoundRect(x: number, y: number, width: number, height: number, radius: number): void {
		this.drawRoundRect(x, y, width, height, radius);
		this.context.stroke();
	}

	protected drawRoundRect(x: number, y: number, width: number, height: number, radius: number): void {
		var context = this.context;
		var right = x + width;
		var bottom = y + height;
		context.beginPath();
		context.moveTo(x + radius, y);
		context.lineTo(right - radius, y);
		//context.quadraticCurveTo(right, y, right, y + radius);
		context.arcTo(right, y, right, y + radius, radius);
		context.lineTo(right, bottom - radius);
		//context.quadraticCurveTo(right, bottom, right - radius, bottom);
		context.arcTo(right, bottom, right - radius, bottom, radius);
		context.lineTo(x + radius, bottom);
		//context.quadraticCurveTo(x, bottom, x, bottom - radius);
		context.arcTo(x, bottom, x, bottom - radius, radius);
		context.lineTo(x, y + radius);
		//context.quadraticCurveTo(x, y, x + radius, y);
		context.arcTo(x, y, x + radius, y, radius);
		context.closePath();
	}

	fillText(text: string, x: number, y: number, maxWidth?: number): void {
		this.context.fillText(text, x, y, maxWidth);
	}

	strokeText(text: string, x: number, y: number, maxWidth: number): void {
		this.context.strokeText(text, x, y, maxWidth);
	}

	measureText(text: string): TextMetrics {
		return this.context.measureText(text);
	}

	fillTextMultiLine(text: string, x: number, y: number, maxWidth?: number): void {
		var context = this.context;
		this.drawTextMultiLine(
			text, x, y, maxWidth,
			(text: string, x: number, y: number, maxWidth: number) => {
				context.fillText(text, x, y, maxWidth);
			}
		);
	}

	strokeTextMultiLine(text: string, x: number, y: number, maxWidth?: number): void {
		var context = this.context;
		this.drawTextMultiLine(
			text, x, y, maxWidth,
			(text: string, x: number, y: number, maxWidth: number) => {
				context.strokeText(text, x, y, maxWidth);
			}
		);
	}

	protected drawTextMultiLine(
		text: string, x: number, y: number, maxWidth: number,
		callback: (text: string, x: number, y: number, maxWidth: number) => void
	): void {
		if (text == null || text === "") {
			return;
		}
		/*
		var textBaseline = this.textBaseline.toLowerCase();
		switch (textBaseline) {
			case "middle":
				//y += fontSize / 2;
				break;
		}
		//*/
		var lines = text.split(/\r\n|\r|\n/);
		var lineCount = lines.length;
		if (lineCount <= 1) {
			callback(text, x, y, maxWidth);
			return;
		}
		var fontSize = this._fontSize;
		var lineSpacing = this._lineSpacing * 1.2;
		var lineHeight = fontSize * lineSpacing;
		var textVerticalAlign = this._textVerticalAlign.toLowerCase();
		for (var i = 0; i < lineCount; i++) {
			var line = lines[i];
			var ty = y;
			switch (textVerticalAlign) {
				case "middle":
					var ratio = (i / (lineCount - 1) - 0.5) * 2.0;
					ty += lineHeight * ratio * (lineCount / 2.0 - 0.5);
					break;
				case "bottom":
					var ratio = 1.0 - (i / (lineCount - 1));
					ty -= lineHeight * ratio * (lineCount - 1);
					break;
				default:
					ty += lineHeight * i;
					break;
			}
			callback(line, x, ty, maxWidth);
		}
	}

	getLineDash(): number[] {
		return this.context.getLineDash();
	}

	setLineDash(segments: number[]): void {
		this.context.setLineDash(segments);
	}

	createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
		return this.context.createLinearGradient(x0, y0, x1, y1);
	}

	createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient {
		return this.context.createRadialGradient(x0, y0, r0, x1, y1, r1);
	}

	//createPattern(image: CanvasImageSource, repetition: string): CanvasPattern | null {
	createPattern(image: any, repetition: string): CanvasPattern | null {
		return this.context.createPattern(image, repetition);
	}

	beginPath(): void {
		this.context.beginPath();
	}

	closePath(): void {
		this.context.closePath();
	}
	
    moveTo(x: number, y: number): void {
		this.context.moveTo(x, y);
	}

	lineTo(x: number, y: number): void {
		this.context.lineTo(x, y);
	}

	bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
		this.context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
	}

	quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
		this.context.quadraticCurveTo(cpx, cpy, x, y);
	}

	arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
		this.context.arc(x, y, radius, startAngle, endAngle, anticlockwise);
	}

	arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
		this.context.arcTo(x1, y1, x2, y2, radius);
	}

	fillCircle(x: number, y: number, radius: number): void {
		var context = this.context;
		context.beginPath();
		context.arc(x, y, radius, 0, Math.PI * 2);
		context.fill();
	}

	strokeCircle(x: number, y: number, radius: number): void {
		var context = this.context;
		context.beginPath();
		context.arc(x, y, radius, 0, Math.PI * 2);
		context.stroke();
	}

	ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
		this.context.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
	}

	rect(x: number, y: number, w: number, h: number): void {
		this.context.rect(x, y, w, h);
	}

	fill(fillRule?: CanvasFillRule): void;
	fill(path: Path2D, fillRule?: CanvasFillRule): void;
	fill(arg0?: CanvasFillRule | Path2D, fillRule?: CanvasFillRule): void {
		if (arg0 == null) {
			this.context.fill();
			return;
		}
		if (fillRule == null) {
			this.context.fill(arg0 as any);
			return;
		}
		this.context.fill(arg0 as any, fillRule);
	}

	stroke(path?: Path2D): void {
		if (path == null) {
			this.context.stroke();
			return;
		}
		this.context.stroke(path);
	}

	drawFocusIfNeeded(element: Element): void;
	drawFocusIfNeeded(path: Path2D, element: Element): void;
	drawFocusIfNeeded(arg0: Element | Path2D, element?: Element): void {
		if (element == null) {
			this.context.drawFocusIfNeeded(arg0 as any);
			return;
		}
		this.context.drawFocusIfNeeded(arg0 as any, element);
	}

	clip(fillRule?: CanvasFillRule): void;
	clip(path: Path2D, fillRule?: CanvasFillRule): void;
	clip(arg0?: CanvasFillRule | Path2D, fillRule?: CanvasFillRule): void {
		if (arg0 == null) {
			this.context.clip();
			return;
		}
		if (fillRule == null) {
			this.context.clip(arg0 as any);
			return;
		}
		this.context.clip(arg0 as any, fillRule);
	}

	isPointInPath(x: number, y: number, fillRule?: CanvasFillRule): boolean;
	isPointInPath(path: Path2D, x: number, y: number, fillRule?: CanvasFillRule): boolean;
	isPointInPath(arg0: number | Path2D, arg1: number, arg2?: number | CanvasFillRule, fillRule?: CanvasFillRule): boolean {
		if (fillRule == null) {
			return this.context.isPointInPath(arg0 as any, arg1, arg2 as any);
		}
		return this.context.isPointInPath(arg0 as any, arg1, arg2 as any, fillRule);
	}

	isPointInStroke(x: number, y: number): boolean;
	isPointInStroke(path: Path2D, x: number, y: number): boolean;
	isPointInStroke(arg0: number | Path2D, arg1: number, arg2?: number): boolean {
		if (arg2 == null) {
			return this.context.isPointInStroke(arg0 as any, arg1);
		}
		return this.context.isPointInStroke(arg0 as any, arg1, arg2);
	}

	rotate(angle: number): void {
		this.context.rotate(angle);
	}

	scale(x: number, y: number): void {
		this.context.scale(x, y);
	}

	translate(x: number, y: number): void {
		this.context.translate(x, y);
	}

	transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
		this.context.transform(a, b, c, d, e, f);
	}

	setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void {
		this.context.setTransform(a, b, c, d, e, f);
	}

	resetTransform(): void {
		this.context.resetTransform();
	}

	drawImage(image: any, dx: number, dy: number): void;
	drawImage(image: any, dx: number, dy: number, dw: number, dh: number): void;
	drawImage(image: any, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
	drawImage(image: any, sx: number, sy: number, sw?: number, sh?: number, dx?: number, dy?: number, dw?: number, dh?: number): void {
		if (sw == null) {
			this.context.drawImage(image, sx, sy);
			return;
		}
		if (dx == null) {
			this.context.drawImage(image, sx, sy, sw, sh);
			return;
		}
		this.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
	}

	createImageData(sw: number, sh: number): ImageData;
	createImageData(imagedata: ImageData): ImageData;
	createImageData(arg0: number | ImageData, arg1?: number): ImageData {
		if (arg1 == null) {
			return this.context.createImageData(arg0 as ImageData);
		}
		return this.context.createImageData(arg0 as any, arg1);
	}

	getImageData(sx: number, sy: number, sw: number = null, sh: number = null): ImageData {
		if (sw == null) {
			sw = this._width;
		}
		if (sh == null) {
			sh = this._height;
		}
		return this.context.getImageData(sx, sy, sw, sh);
	}

	putImageData(imagedata: ImageData, dx: number, dy: number): void;
	putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void;
	putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX?: number, dirtyY?: number, dirtyWidth?: number, dirtyHeight?: number): void {
		if (dirtyX == null) {
			this.context.putImageData(imagedata, dx, dy);
			return;
		}
		this.context.putImageData(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
	}

	save(): void {
		this.context.save();
	}

	restore(): void {
		this.context.restore();
	}

	//addHitRegion(options: any): void {
	//	this.context.addHitRegion(options);
	//}

	resize(width: number, height: number): void {
		var canvas = this.canvas;
		this._width = width;
		this._height = height;
		canvas.width = Tea.Mathf.closestPowerOfTwo(width);
		canvas.height = Tea.Mathf.closestPowerOfTwo(height);
		//this.context = this.getContext();
	}

	transformColor(offset: Tea.Color, multiplier: Tea.Color = null): void {
		var image = this.getImageData(0, 0);
		var data = image.data;
		var length = data.length;
		var or = offset[0] * 255;
		var og = offset[1] * 255;
		var ob = offset[2] * 255;
		var oa = offset[3] * 255;
		var mr = 1.0, mg = 1.0, mb = 1.0, ma = 1.0;
		if (multiplier != null) {
			mr = multiplier[0];
			mg = multiplier[1];
			mb = multiplier[2];
			ma = multiplier[3];
		}
		for (var i = 0; i < length; i += 4) {
			data[i    ] = (data[i    ] * mr) + or;
			data[i + 1] = (data[i + 1] * mg) + og;
			data[i + 2] = (data[i + 2] * mb) + ob;
			data[i + 3] = (data[i + 3] * ma) + oa;
			data[i    ] = Math.max(Math.min(data[i    ], 255), 0);
			data[i + 1] = Math.max(Math.min(data[i + 1], 255), 0);
			data[i + 2] = Math.max(Math.min(data[i + 2], 255), 0);
			data[i + 3] = Math.max(Math.min(data[i + 3], 255), 0);
		}
		this.putImageData(image, 0, 0);
	}

	protected getContext(): CanvasRenderingContext2D {
		return this.canvas.getContext("2d", {
			alpha: this._alpha
		});
	}
}
