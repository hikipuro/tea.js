import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="AudioSource">
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "AudioSource",
			enabled: false
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as AudioSource;
			self._component.enabled = value;
		}
	}
})
export class AudioSource extends Vue {
	_component: Tea.AudioSource;
	translator: any;
	name: string;
	enabled: boolean;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/AudioSource";
		this.name = translator.getText("Title");
	}

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
	}
}

Tea.AudioSource.editorView = AudioSource;
