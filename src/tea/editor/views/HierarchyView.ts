import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Editor } from "../Editor";
import { EditorAssets } from "../EditorAssets";
import { TreeView } from "../basic/TreeView";
import { TreeViewItem } from "../basic/TreeViewItem";
import { HierarchyViewCommand } from "../commands/HierarchyViewCommand";
import { SceneInspector } from "../views/SceneInspector";
import { LocalFile } from "../LocalFile";
import { FileItemTag } from "./ProjectView";

@Component({
	template: `
		<div class="HierarchyView">
			<TreeView
				ref="hierarchy"
				tabindex="0"
				@focus="onFocus"
				@select="onSelect"
				@keydown="onKeyDown"
				@doubleClick="onDoubleClick"
				@menu="onMenu"
				@rename="onRename"></TreeView>
		</div>
	`
})
export class HierarchyView extends Vue {
	_command: HierarchyViewCommand;
	_dragSource: TreeViewItem;

	get command(): HierarchyViewCommand {
		return this._command;
	}

	get treeView(): Editor.TreeView {
		var treeView = this.$refs.hierarchy as TreeView;
		return treeView;
	}

	get items(): any {
		return this.treeView.items;
	}
	set items(value: any) {
		this.treeView.items = value;
	}

	getSelectedItem(): TreeViewItem {
		return this.treeView.selectedItem;
	}

	getSelectedObject(): Tea.Object3D {
		var item = this.getSelectedItem();
		if (item == null) {
			return null;
		}
		var editor = this.$root as Editor;
		var id = item.tag as string;
		var scene = editor.status.scene;
		if (scene == null) {
			return null;
		}
		return scene.findChildById(id);
	}

	focus(): void {
		(this.treeView.$el as HTMLElement).focus();
	}

	expandAll(): void {
		this.treeView.expandAll();
	}

	select(item: TreeViewItem): void {
		this.treeView.select(item);
	}

	selectObject(object3d: Tea.Object3D): void {
		if (object3d == null) {
			return;
		}
		var item = this.findItemByTag(object3d.id);
		this.treeView.select(item);
	}

	unselect(): void {
		this.treeView.unselect();
	}

	findItemByTag(tag: string): TreeViewItem {
		return this.treeView.findItemByTag(tag);
	}

	protected created(): void {
		this._command = new HierarchyViewCommand();
		this._command.editor = this.$root as Editor;
	}

	protected mounted(): void {
		var treeView = this.treeView;
		treeView.openIcon = "<img src='" + EditorAssets.Images.FolderOpen + "' />"; 
		treeView.closeIcon = "<img src='" + EditorAssets.Images.FolderClose + "' />"; 
		treeView.draggable = true;

		var dragEvents = treeView.dragEvents;
		dragEvents.dragStart = this.onDragStart;
		dragEvents.dragEnd = this.onDragEnd;
		dragEvents.dragOver = this.onDragOver;
		dragEvents.dragEnter = this.onDragEnter;
		dragEvents.dragLeave = this.onDragLeave;
		dragEvents.drop = this.onDrop;
	}

	protected openSceneInspector(): void {
		var inspectorView = this.command.editor.inspectorView;
		var scene = this.command.editor.status.scene;
		inspectorView.hide();
		inspectorView.component = SceneInspector.extend({
			created: function () {
				var self = this as SceneInspector;
				self._scene = scene;
				scene = undefined;
			}
		});
		inspectorView.show();
	}

	protected onFocus(): void {
		var treeView = this.treeView;
		var item = treeView.selectedItem;
		if (item == null) {
			return;
		}
		//this.$emit("select", item);
		setTimeout(() => {
			var item = treeView.selectedItem;
			if (item == null) {
				return;
			}
			if (item.tag === "") {
				this.openSceneInspector();
			} else {
				var inspectorView = this.command.editor.inspectorView;
				inspectorView.command.updateObjectInspector();
			}
		}, 100);
	}

	protected onSelect(item: Editor.TreeViewItem): void {
		var inspectorView = this.command.editor.inspectorView;
		if (item == null) {
			this.unselect();
			inspectorView.hide();
			return;
		}
		//console.log("select", item.tag);

		if (item.tag === "") {
			this.openSceneInspector();
		} else {
			inspectorView.command.updateObjectInspector();
		}
	}

	protected onKeyDown(e: KeyboardEvent): void {
		switch (e.key) {
			case "F2":
				var item = this.getSelectedItem();
				if (item.tag < 0) {
					return;
				}
				if (item) {
					item.rename();
				}
				break;
		}
	}

	protected onDoubleClick(item: Editor.TreeViewItem): void {
		var editor = this.$root as Editor;
		if (editor.status.app.isSceneView) {
			var object3d = this._command.getSelectedObject();
			editor.status.scene.lockViewToSelected(object3d);
		} else {
			item.toggle();
		}
	}

	protected onMenu(e: MouseEvent): void {
		e.preventDefault();
		this._command.showContextMenu();
	}

	protected onRename(item: Editor.TreeViewItem, value: string): void {
		var treeView = this.treeView;
		if (value == null || value === "") {
			treeView.focus();
			return;
		}
		var object3d = this.getSelectedObject();
		object3d.name = value;
		this._command.update(false, () => {
			treeView.select(item);
			treeView.focus();
		});
		var editor = this.$root as Editor;
		editor.status.isChanged = true;
	}

	protected onDragStart(e: DragEvent, item: Editor.TreeViewItem): void {
		//console.log("onDragStart");
		this._dragSource = item;
		e.dataTransfer.effectAllowed = "move";
		//e.dataTransfer.dropEffect = "move";

		var dragImages = (this.$root as Editor).dragImages;
		dragImages.clear();
		var dragImage = dragImages.addDragImage(item.model.text);
		e.dataTransfer.setDragImage(dragImage, 0, 0);
	}

	protected onDragEnd(e: DragEvent, item: Editor.TreeViewItem): void {
		this._dragSource = null;
	}

	protected onDragOver(e: DragEvent, item: Editor.TreeViewItem): void {
		e.preventDefault();
		if (this._dragSource == null) {
			return;
		}
		e.dataTransfer.dropEffect = "move";
		var el = e.currentTarget as HTMLElement;
		var text = el.querySelector(".text");
		var clientHeight = el.clientHeight;
		var borderSize = el.clientHeight * 0.3;
		var offsetY = e.offsetY;
		if (offsetY < borderSize) {
			el.classList.remove("dragEnter");
			text.classList.remove("dragOverBottom");
			text.classList.add("dragOverTop");
		} else if (clientHeight - offsetY < borderSize) {
			el.classList.remove("dragEnter");
			text.classList.remove("dragOverTop");
			text.classList.add("dragOverBottom");
		} else {
			el.classList.add("dragEnter");
			text.classList.remove("dragOverTop");
			text.classList.remove("dragOverBottom");
		}
	}

	protected onDragEnter(e: DragEvent, item: Editor.TreeViewItem): void {
		//console.log("dragEnter", item.model.text);
		var el = e.currentTarget as HTMLElement;
		el.classList.add("dragEnter");
	}

	protected onDragLeave(e: DragEvent, item: Editor.TreeViewItem): void {
		//console.log("dragLeave", this, e);
		var el = e.currentTarget as HTMLElement;
		var text = el.querySelector(".text");
		el.classList.remove("dragEnter");
		text.classList.remove("dragOverTop");
		text.classList.remove("dragOverBottom");
	}

	protected onDrop(e: DragEvent, item: Editor.TreeViewItem): void {
		//console.log("drop", item);
		var mode = 0;
		var el = e.currentTarget as HTMLElement;
		var text = el.querySelector(".text");
		if (text.classList.contains("dragOverTop")) {
			mode = 1;
		} else if (text.classList.contains("dragOverBottom")) {
			mode = 2;
		}
		el.classList.remove("dragEnter");
		text.classList.remove("dragOverTop");
		text.classList.remove("dragOverBottom");
		if (this._dragSource == null) {
			this.onDropFromProjectView(item);
			return;
		}
		var idSrc = this._dragSource.model.tag as string;
		var idDst = item.model.tag as string;
		this._dragSource = null;
		if (idSrc == null || idDst == null) {
			return;
		}
		if (idSrc == idDst) {
			return;
		}
		this.onDropFromHierarchyView(mode, idSrc, idDst);
	}

	protected onDropFromHierarchyView(mode: number, idSrc: string, idDst: string): void {
		//console.log("drop", idSrc, idDst, item.model.text);
		var editor = this.$root as Editor;
		var scene = editor.status.scene;
		var object3dSrc = scene.findChildById(idSrc);
		var object3dDst = scene.findChildById(idDst);
		if (object3dSrc == null || object3dDst == null) {
			return;
		}
		if (object3dDst.isChildOf(object3dSrc)) {
			return;
		}
		//console.log(mode);
		var item: Editor.TreeViewItem = null;
		switch (mode) {
			case 0:
				object3dSrc.parent = object3dDst;
				this._command.update(false, () => {
					item = this.findItemByTag(object3dDst.id);
					//console.log("item", item);
					if (item != null) {
						item.expand();
						item = this.findItemByTag(object3dSrc.id);
						if (item != null) {
							this.select(item);
						}
					}
				});
				break;
			case 1:
				scene.moveChild(object3dSrc, object3dDst);
				this._command.update(false, () => {
					item = this.findItemByTag(object3dSrc.id);
					if (item != null) {
						this.select(item);
					}
				});
				break;
			case 2:
				scene.moveChild(object3dSrc, object3dDst, false);
				this._command.update(false, () => {
					item = this.findItemByTag(object3dSrc.id);
					if (item != null) {
						this.select(item);
					}
				});
				break;
		}
		editor.status.isChanged = true;
	}

	protected onDropFromProjectView(item: Editor.TreeViewItem): void {
		var editor = this.$root as Editor;
		var projectView = editor.projectView;
		var dragSource = projectView.getDragSource();
		//console.log("onDropFromProjectView", item, dragSource.tag);
		var id = item.tag as string;
		var scene = editor.status.scene;
		var object3d = scene.findChildById(id);
		if (object3d == null) {
			return;
		}
		var tag = dragSource.tag as FileItemTag;
		var filename = LocalFile.relativeFromAssets(tag.path);
		if (filename == null) {
			return;
		}
		var ext = LocalFile.extname(filename);
		var app = editor.status.app;
		switch (ext) {
			case ".js":
				Tea.ScriptLoader.load(
					app, filename,
					(script: Tea.Script) => {
						if (script == null) {
							return;
						}
						object3d.addComponentInstance(script);

						var selectedObject = this._command.getSelectedObject();
						if (selectedObject != null) {
							this._command.selectItem(selectedObject);
						}
						editor.status.isChanged = true;
					}
				);
				break;
			case ".jpg":
			case ".png":
			case ".svg":
				var selectedObject = this._command.getSelectedObject();
				if (selectedObject == null) {
					return;
				}
				var renderer = selectedObject.getComponent(Tea.MeshRenderer);
				if (renderer == null) {
					return;
				}
				renderer.material.mainTexture.load(tag.path, (err: string, url: string) => {
					if (err) {
						return;
					}
					var inspectorView = this.command.editor.inspectorView;
					inspectorView.command.updateObjectInspector();
					editor.status.isChanged = true;
				});
				break;
		}
	}
}
