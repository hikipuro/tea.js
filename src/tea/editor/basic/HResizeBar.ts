import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div
			class="HResizeBar"
			:style="{
				left: isLeft ? '0' : null
			}"
			@mousedown="onMouseDown">
		</div>
	`,
	props: {
		isLeft: {
			type: Boolean,
			default: false
		}
	}
})
export class HResizeBar extends Vue {
	isLeft: boolean;
	static readonly Cursor = "ew-resize";
	protected _isMouseDown: boolean = false;
	protected _cursor: string;
	protected _parentX: number;
	protected _mouseDownX: number;

	protected setCursor(cursor: string): void {
		document.body.style.cursor = cursor;
	}

	protected addMouseEvents(): void {
		window.addEventListener("mousemove", this.onMouseMove);
		window.addEventListener("mouseup", this.onMouseUp);
	}

	protected removeMouseEvents(): void {
		window.removeEventListener("mousemove", this.onMouseMove);
		window.removeEventListener("mouseup", this.onMouseUp);
	}

	protected onMouseDown(e: MouseEvent): void {
		this.addMouseEvents();
		this._cursor = document.body.style.cursor;
		this.setCursor(HResizeBar.Cursor);
		this._isMouseDown = true;
		this._parentX = 0;
		var parent = this.$parent;
		if (parent && parent.$el) {
			this._parentX = parent.$el.clientWidth;
		}
		this._mouseDownX = e.screenX;
	}

	protected onMouseMove(e: MouseEvent): void {
		var x = e.screenX - this._mouseDownX;
		if (this.isLeft) {
			x = this._parentX - x;
		} else {
			x += this._parentX;
		}
		var parent = this.$parent;
		if (parent && parent.$el) {
			var el = parent.$el as HTMLElement;
			el.style.width = x + "px";
		}
		this.$emit("resize");
	}

	protected onMouseUp(e: MouseEvent): void {
		this.removeMouseEvents();
		this.setCursor(this._cursor);
	}
}
