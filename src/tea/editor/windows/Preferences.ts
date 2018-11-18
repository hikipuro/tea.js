import Vue from "vue";
import Component from "vue-class-component";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div id="Preferences">
			<div class="language">
				Language:
				<select
					ref="language"
					@change="onChangeLanguage">
					<option value="en">English</option>
					<option value="ja">Japanese</option>
					<option value="zhCN">Chinese (Simplified)</option>
				</select>
			</div>
			<button
				ref="okButton"
				@click="onClickOKButton">OK</button>
		</div>
	`,
	data: () => {
		return {
			translator: {},
		}
	}
})
export class Preferences extends Vue {
	static instance: Preferences;
	translator: any;

	translate(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Windows/Preferences";
	}

	protected created(): void {
		window.addEventListener("message", this.onWindowMessage);
		this.translate();
		this.emitToParent("ready", null);
	}

	protected emitToParent(key: string, value: any): void {
		var data = {
			type: "preferences",
			key: key,
			value: value
		}
		window.opener.postMessage(data, "*");
	}

	protected onWindowMessage(e: MessageEvent): void {
		console.log(e);
		var json = e.data;
		switch (json.key) {
			case "language":
				var language = this.$refs.language as HTMLInputElement;
				language.value = json.value;
				break;
		}
	}

	protected onChangeLanguage(): void {
		var language = this.$refs.language as HTMLInputElement;
		console.log(language.value);
		this.emitToParent("language", language.value);
	}

	protected onClickOKButton(): void {
		window.close();
	}
}

var loaded = () => {
	document.removeEventListener(
		"DOMContentLoaded", loaded
	);
	var id = "#Preferences";
	var main = document.querySelector(id);
	if (main == null) {
		return;
	}
	Preferences.instance = new Preferences({
		el: id
	});
};
document.addEventListener(
	"DOMContentLoaded", loaded
);
