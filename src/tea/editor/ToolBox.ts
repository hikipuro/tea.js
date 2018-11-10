import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../Tea";

@Component({
	template: `
		<div class="ToolBox">
			<button @click="onClickPlayButton">Play</button>
			<button @click="onClickStopButton">Stop</button>
		</div>
	`
})
export class ToolBox extends Vue {
	protected onClickPlayButton(): void {
		this.$emit("play");
	}

	protected onClickStopButton(): void {
		this.$emit("stop");
	}
}
