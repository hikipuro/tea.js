import * as Tea from "../../Tea";
import { UICommand } from "./UICommand";
import { UICommandTarget } from "./UICommandTarget";
import { HierarchyView } from "../HierarchyView";
import { InspectorView } from "../InspectorView";
import { ObjectInspector } from "../ObjectInspector";
import { EditorBehavior } from "../EditorBehavior";

export class UICommands {
	static readonly DefaultMaxCommands: number = 100;
	maxCommands: number;
	items: Array<UICommand>;
	index: number;
	isUndoOrRedo: boolean;
	behavior: EditorBehavior;
	hierarchyView: HierarchyView;
	inspectorView: InspectorView;

	constructor() {
		this.maxCommands = UICommands.DefaultMaxCommands;
		this.items = [];
		this.index = 0;
		this.isUndoOrRedo = false;
	}

	get hierarchyViewItem(): Tea.Object3D {
		var hierarchyView = this.hierarchyView;
		var item = hierarchyView.getSelectedItem();
		if (item == null) {
			return null;
		}
		var id = item.tag as number;
		return this.behavior.scene.findChildById(id);
	}

	add(command: UICommand): void {
		if (command == null) {
			return;
		}
		if (this.isUndoOrRedo) {
			this.isUndoOrRedo = false;
			return;
		}
		var items = this.items;
		if (this.index < items.length) {
			items.splice(this.index);
		}
		items.push(command);
		if (items.length > this.maxCommands) {
			items.shift();
		}
		this.index = items.length;
		console.log("add", command.value);
	}

	addHierarchyViewCommand(type: string, value: any): void {
		if (this.isUndoOrRedo) {
			this.isUndoOrRedo = false;
			return;
		}
		var command = new UICommand(
			UICommandTarget.HierarchyView,
			type, value
		);
		this.add(command);
	}

	addInspectorViewCommand(type: string, value: any): void {
		if (this.isUndoOrRedo) {
			this.isUndoOrRedo = false;
			return;
		}
		var command = new UICommand(
			UICommandTarget.InspectorView,
			type, value
		);
		this.add(command);
	}

	undo(): void {
		if (this.index - 2 < 0) {
			return;
		}
		this.index--;
		this.isUndoOrRedo = true;
		var command = this.items[this.index - 1];
		console.log("undo", this.index, command);
		this.runCommand(command, true);
	}

	redo(): void {
		if (this.index >= this.items.length) {
			return;
		}
		this.isUndoOrRedo = true;
		var command = this.items[this.index];
		if (this.index < this.items.length) {
			this.index++;
		}
		console.log("redo", this.index);
		this.runCommand(command, false);
	}

	peek(): UICommand {
		if (this.index <= 0) {
			return null;
		}
		return this.items[this.index - 1];
	}

	runLastCommand(): void {
		console.log("runLastCommand", this.index);
		//this.isUndoOrRedo = true;
		var command = this.items[this.index - 1];
		this.runCommand(command, false);
	}

	protected runCommand(command: UICommand, isUndo: boolean): void {
		if (command == null) {
			return;
		}
		switch (command.target) {
			case UICommandTarget.HierarchyView:
				this.runHierarchyViewCommand(
					command.type, command.value, isUndo
				);
				break;
			case UICommandTarget.InspectorView:
				this.runInspectorViewCommand(
					command.type, command.value, isUndo
				);
				break;
		}
	}

	protected runHierarchyViewCommand(type: string, value: any, isUndo: boolean): void {
		var hierarchyView = this.hierarchyView;
		var inspectorView = this.inspectorView;

		switch (type) {
			case "select":
				if (value == null) {
					hierarchyView.unselect();
					inspectorView.hide();
					break;
				}
				var item = hierarchyView.findItemByTag(value);
				hierarchyView.select(item);
				hierarchyView.focusTreeView();
				var object3d = this.hierarchyViewItem;
				if (object3d == null) {
					return;
				}
				inspectorView.hide();
				//setTimeout(() => {
					var commands = this;
					inspectorView.component = ObjectInspector.extend({
						created: function () {
							//(this as any)._object3d = object3d;
							var self = this as ObjectInspector;
							self._commands = commands;
							self.setObject3D(object3d);
							object3d = undefined;
							commands = undefined;
						}
					});
					//inspectorView.setObject3D(object3d);
					inspectorView.show();
				//}, 1000);
				break;
		}
	}

	protected runInspectorViewCommand(type: string, value: any, isUndo: boolean): void {
		var hierarchyView = this.hierarchyView;
		var inspectorView = this.inspectorView;

		switch (type) {
			case "name":
				var object3d = value.object3d;
				if (this.hierarchyViewItem != object3d) {
					var item = hierarchyView.findItemByTag(object3d.id);
					this.isUndoOrRedo = true;
					this.runHierarchyViewCommand("select", item.tag, false);
				}
				var name = value.name;
				hierarchyView.$nextTick(() => {
					var inspector = inspectorView.$refs.component as ObjectInspector;
					inspector.name = name;
					inspector._object3d.name = name;
					hierarchyView.getSelectedItem().model.text = name;
				});
				break;
		}
	}
}
