import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div
			class="VResizeBar"
			:style="{
				top: isTop ? '0' : null
			}"
			@mousedown="onMouseDown">
		</div>
	`,
	props: {
		isTop: {
			type: Boolean,
			default: false
		}
	}
})
export class VResizeBar extends Vue {
	isTop: boolean;
	static readonly Cursor = "ns-resize";
	protected _isMouseDown: boolean = false;
	protected _cursor: string;
	protected _parentY: number;
	protected _mouseDownY: number;

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
		this.setCursor(VResizeBar.Cursor);
		this._isMouseDown = true;
		this._parentY = 0;
		var parent = this.$parent;
		if (parent && parent.$el) {
			this._parentY = parent.$el.clientHeight;
		}
		this._mouseDownY = e.screenY;
	}

	protected onMouseMove(e: MouseEvent): void {
		var y = e.screenY - this._mouseDownY;
		if (this.isTop) {
			y = this._parentY - y;
		} else {
			y += this._parentY;
		}
		var parent = this.$parent;
		if (parent && parent.$el) {
			var el = parent.$el as HTMLElement;
			el.style.height = y + "px";
		}
		this.$emit("resize");
	}

	protected onMouseUp(e: MouseEvent): void {
		this.removeMouseEvents();
		this.setCursor(this._cursor);
	}
}
