import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div
			class="Window"
			v-if="isVisible"
			:style="{
				left: x + 'px',
				top: y + 'px'
			}"
			@mousedown="onMouseDown">
			<slot></slot>
		</div>
	`,
	data: () => { return {
		x: 0,
		y: 0,
		isVisible: false,
		isForm: false,
		items: []
	}}
})
export class Window extends Vue {
	x: number;
	y: number;
	isVisible: boolean;
	isForm: boolean;

	move(x: number, y: number): void {
		this.x = x;
		this.y = y;
	}

	show(fitPosition: boolean = false): void {
		if (this.isVisible) {
			return;
		}
		this.isVisible = true;
		if (this.isForm) {
			document.addEventListener(
				"mousedown", this.onMouseDownScreen
			);
		}
		if (fitPosition) {
			this.$nextTick(() => {
				this.fitPosition();
			});
		}
	}

	hide(): void {
		this.isVisible = false;
		document.removeEventListener(
			"mousedown", this.onMouseDownScreen
		);
		this.$emit("hide", this);
	}

	protected fitPosition(): void {
		var screenWidth = document.body.clientWidth;
		var screenHeight = document.body.clientHeight;
		var width = this.$el.clientWidth;
		var height = this.$el.clientHeight;
		var xMax = this.x + width;
		var yMax = this.y + height;
		if (xMax > screenWidth) {
			this.x = screenWidth - width;
		}
		if (yMax > screenHeight) {
			this.y = screenHeight - height;
		}
	}

	protected onMouseDown(e: MouseEvent): void {
		e.stopPropagation();
	}

	protected onMouseDownScreen(e: MouseEvent): void {
		this.hide();
	}
}
