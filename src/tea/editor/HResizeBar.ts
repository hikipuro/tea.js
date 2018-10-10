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
		isLeft: Boolean
	},
	data: () => {
		return {
		}
	}
})
export class HResizeBar extends Vue {
	isLeft: boolean;
	protected _isMouseDown: boolean = false;
	protected _cursor: string;
	protected _parentX: number;
	protected _mouseDownX: number;

	protected onMouseDown(e: MouseEvent): void {
		window.addEventListener("mousemove", this.onMouseMove);
		window.addEventListener("mouseup", this.onMouseUp);
		this._cursor = document.body.style.cursor;
		document.body.style.cursor = "ew-resize";
		this._isMouseDown = true;
		this._parentX = this.$parent.$el.clientWidth;
		this._mouseDownX = e.screenX;
	}

	protected onMouseMove(e: MouseEvent): void {
		var x = e.screenX - this._mouseDownX;
		if (this.isLeft) {
			x = this._parentX - x;
		} else {
			x += this._parentX;
		}
		this.$parent.$el.style.width = x + "px";
	}

	protected onMouseUp(e: MouseEvent): void {
		window.removeEventListener("mousemove", this.onMouseMove);
		window.removeEventListener("mouseup", this.onMouseUp);
		document.body.style.cursor = this._cursor;
	}
}
