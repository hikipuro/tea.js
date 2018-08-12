import * as Tea from "../Tea";

export class Cursor {
	protected _app: Tea.App;
	protected _type: CursorType = CursorType.auto;

	constructor(app: Tea.App) {
		this._app = app;
		this._type = CursorType.auto;
	}

	get type(): CursorType {
		return this._type;
	}

	set type(value: CursorType) {
		this._type = value;
		this._app.canvas.style.cursor = value;
	}
}

export enum CursorType {
	auto = "auto",
	default = "default",
	crosshair = "crosshair",
	pointer = "pointer",
	move = "move",
	help = "help",
	text = "text",
	wait = "wait",
	nResize = "n-resize",
	eResize = "e-resize",
	sResize = "s-resize",
	wResize = "w-resize",
	neResize = "ne-resize",
	seResize = "se-resize",
	swResize = "sw-resize",
	nwResize = "nw-resize",
	none = "none"
}
