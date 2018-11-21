import Vue from "vue";
import Component from "vue-class-component";
import { EditorAssets } from "../EditorAssets";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="ToolBox">
			<button
				ref="play"
				v-html="playIcon"
				@click="onClickPlayButton"></button>
			<button
				ref="stop"
				v-html="stopIcon"
				disabled="disabled"
				@click="onClickStopButton"></button>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			playIcon: "",
			stopIcon: "",
		}
	}
})
export class ToolBox extends Vue {
	translator: any;
	playIcon: string;
	stopIcon: string;

	translate(): void {
		var translator = Translator.getInstance();
		translator.basePath = "ToolBox";
		this.playIcon = "<img src='" + EditorAssets.Images.PlayButton + "' draggable='false' />";
		this.stopIcon = "<img src='" + EditorAssets.Images.StopButton + "' draggable='false' />";
	}

	play(): void {
		var play = this.$refs.play as HTMLButtonElement;
		var stop = this.$refs.stop as HTMLButtonElement;
		play.disabled = true;
		stop.disabled = false;
	}

	stop(): void {
		var play = this.$refs.play as HTMLButtonElement;
		var stop = this.$refs.stop as HTMLButtonElement;
		play.disabled = false;
		stop.disabled = true;
	}

	protected created(): void {
		this.translate();
	}

	protected onClickPlayButton(): void {
		this.$emit("play");
	}

	protected onClickStopButton(): void {
		this.$emit("stop");
	}
}
