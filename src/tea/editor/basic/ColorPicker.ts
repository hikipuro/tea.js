import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";

@Component({
	template: `
		<div class="ColorPicker">
			<div
				class="title">
				<slot></slot>
			</div>
			<div
				ref="color"
				class="color"
				:style="{
					backgroundColor: value
				}"
				@click="onClick"
				@change="onChange"></div>
			<Window ref="window">
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
				<InputRange
					:min="0"
					:max="255"
					:value="a"
					@update="onUpdateA">A</InputRange>
			</Window>
		</div>
	`,
	props: {
		value: {
			type: String,
			default: ""
		}
	},
	data: () => {
		return {
			r: 0,
			g: 0,
			b: 0,
			a: 0
		}
	}
})
export class ColorPicker extends Vue {
	value: string;
	r: number;
	g: number;
	b: number;
	a: number;

	protected updated(): void {
		//console.log("updated", this.value);
		var color = Tea.Color.fromCssColor(this.value);
		//console.log("updated", color.toString());
		this.r = Math.floor(color.r * 255);
		this.g = Math.floor(color.g * 255);
		this.b = Math.floor(color.b * 255);
		this.a = Math.floor(color.a * 255);
	}

	protected emitUpdate(r: number, g: number, b: number, a: number): void {
		var rgba = (r << 24) + (g << 16) + (b << 8) + a;
		var color = Tea.Color.fromRGBA32(rgba);
		this.$emit("update", color);
	}

	protected onClick(e: MouseEvent): void {
		e.preventDefault();
		var window = this.$refs.window as Tea.Editor.Window;
		window.isForm = true;
		var y = this.$el.offsetTop + this.$el.clientHeight;
		window.move(e.clientX, y);
		window.show(true);
	}

	protected onChange(): void {
		var color = this.$refs.color as HTMLInputElement;
		this.$emit("update", color.value);
	}

	protected onUpdateR(value: number): void {
		this.emitUpdate(value, this.g, this.b, this.a);
	}

	protected onUpdateG(value: number): void {
		this.emitUpdate(this.r, value, this.b, this.a);
	}

	protected onUpdateB(value: number): void {
		this.emitUpdate(this.r, this.g, value, this.a);
	}

	protected onUpdateA(value: number): void {
		this.emitUpdate(this.r, this.g, this.b, value);
	}
}
