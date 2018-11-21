import Vue, { VueConstructor } from "vue";
import Component from "vue-class-component";
import { Editor } from "../Editor";
import { InspectorViewCommand } from "../commands/InspectorViewCommand";

@Component({
	template: `
		<div class="InspectorView">
			<component
				ref="component"
				v-if="isVisible"
				:is="component"
				@update="onUpdate"
				@change="onChange"
				@menu="onMenu"></component>
		</div>
	`,
	data: () => {
		return {
			isVisible: false,
		}
	}
})
export class InspectorView extends Vue {
	isVisible: boolean;
	component: VueConstructor<Record<never, any> & Vue>;
	_command: InspectorViewCommand;

	get command(): InspectorViewCommand {
		return this._command;
	}

	show(): void {
		this.isVisible = true;
	}

	hide(): void {
		this.isVisible = false;
		this.clear();
	}

	getComponent(): Vue {
		return this.$refs.component as Vue;
	}

	hasFocus(): boolean {
		return this.$el.querySelector(":focus") != null;
	}

	clear(): void {
		this.component = null;
	}

	translate(): void {
		var component = this.getComponent();
		if (component && component["translate"]) {
			component["translate"]();
		}
	}

	protected created(): void {
		var editor = this.$root as Editor;
		this._command = new InspectorViewCommand();
		this._command.editor = editor;
		this._command.objectInspectorCommand.editor = editor;
	}

	protected onUpdate(...args: Array<any>): void {
		var type = args[0];
		var key = args[1];
		var value = args[2];
		var editor = this.$root as Editor;
		var hierarchyView = editor.hierarchyView;

		if (type === "ObjectInspector") {
			if (hierarchyView.getSelectedItem() == null) {
				return;
			}
			var object3d = hierarchyView.command.getSelectedObject();
			if (object3d == null) {
				return;
			}
			editor.status.isChanged = true;
			switch (key) {
				case "name":
					hierarchyView.getSelectedItem().model.text = value;
					break;
				case "rotation":
					this._command.objectInspectorCommand.snoozeUpdateTimer(1000);
					break;
			}
		}
		if (type === "SceneInspector") {
			editor.status.isChanged = true;
		}
	}

	protected onChange(...args: Array<any>): void {
		console.log("change", args);
	}

	protected onMenu(...args: Array<any>): void {
		var type = args[0];
		switch (type) {
			case "component":
				this._command.objectInspectorCommand.showComponentMenu();
				break;
			case "addComponent":
				this._command.objectInspectorCommand.showAddComponentMenu();
				break;
		}
	}
}
