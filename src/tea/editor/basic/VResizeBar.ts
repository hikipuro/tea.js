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
	protected _isMouseDown: boolean = false;
	protected _cursor: string;
	protected _parentY: number;
	protected _mouseDownY: number;

	protected onMouseDown(e: MouseEvent): void {
		window.addEventListener("mousemove", this.onMouseMove);
		window.addEventListener("mouseup", this.onMouseUp);
		this._cursor = document.body.style.cursor;
		document.body.style.cursor = "ns-resize";
		this._isMouseDown = true;
		this._parentY = this.$parent.$el.clientHeight;
		this._mouseDownY = e.screenY;
	}

	protected onMouseMove(e: MouseEvent): void {
		var y = e.screenY - this._mouseDownY;
		if (this.isTop) {
			y = this._parentY - y;
		} else {
			y += this._parentY;
		}
		this.$parent.$el.style.height = y + "px";
		this.$emit("resize");
	}

	protected onMouseUp(e: MouseEvent): void {
		window.removeEventListener("mousemove", this.onMouseMove);
		window.removeEventListener("mouseup", this.onMouseUp);
		document.body.style.cursor = this._cursor;
	}
}
