import Vue, { VueConstructor } from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";
import { InputNumber } from "../basic/InputNumber";

@Component({
	template: `
		<div class="Script">
			<component
				ref="fields"
				v-for="(item, index) in vueFields"
				:is="item.vue"
				:key="index"
				:value="fields[item.key]"
				@updateField="onUpdateField"></component>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "Script",
			enabled: false,
			fields: {},
			vueFields: []
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as Script;
			self._component.enabled = value;
		}
	}
})
export class Script extends Vue {
	static scriptKeys: Array<string> = null;
	_component: Tea.Script;
	translator: any;
	name: string;
	enabled: boolean;
	fields: any;
	vueFields: Array<any>;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/Script";
		this.name = translator.getText("Title");
	}

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		if (component.name === "Script") {
			this.name = component.className + " (" + this.name + ")";
		} else {
			this.name = component.name + " (" + this.name + ")";
		}
		this.enabled = component.enabled;

		var keys = this.getObjectKeys();
		//console.log(keys);
		keys.forEach((key: string) => {
			var value = component[key];
			var vue: any = null;
			switch (typeof value) {
				case "number":
					this.$set(this.fields, key, value);
					vue = InputNumber.extend({
						mounted: function () {
							var self = this as Vue;
							var title = self.$refs.title as HTMLElement;
							title.innerHTML = key;
							self.$on("update", (value: number) => {
								self.$emit("updateField", self, value);
							});
						}
					});
					break;
			}
			if (vue == null) {
				return;
			}
			this.vueFields.push({
				vue: vue,
				key: key
			});
		});
	}

	protected getObjectKeys(): Array<string> {
		if (Script.scriptKeys == null) {
			Script.scriptKeys = Object.keys(new Tea.Script(null));
		}
		var keys1 = Script.scriptKeys;
		var keys2 = Object.keys(this._component);
		return keys2.filter((value) => {
			return !(keys1 as any).includes(value);
		});
	}

	protected onUpdateField(sender: Vue, value: any): void {
		var title = sender.$refs.title as HTMLElement;
		var key = title.textContent;
		if (key == null) {
			return;
		}
		var component = this._component;
		this.fields[key] = value;
		component[key] = value;
	}
}

Tea.Script.editorView = Script;
