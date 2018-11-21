import * as nodePath from "path";
import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Editor } from "../Editor";
import { EditorAssets } from "../EditorAssets";
import { TreeView } from "../basic/TreeView";
import { HierarchyViewCommand } from "../commands/HierarchyViewCommand";
import { SceneInspector } from "../views/SceneInspector";

@Component({
	template: `
		<div class="HierarchyView">
			<TreeView
				ref="hierarchy"
				tabindex="0"
				@focus="onFocus"
				@select="onSelect"
				@doubleClick="onDoubleClick"
				@menu="onMenu"></TreeView>
		</div>
	`
})
export class HierarchyView extends Vue {
	_command: HierarchyViewCommand;
	_dragSource: Editor.TreeViewItem

	get command(): HierarchyViewCommand {
		return this._command;
	}

	get items(): any {
		var treeView = this.$refs.hierarchy as TreeView;
		return treeView.items;
	}
	set items(value: any) {
		var treeView = this.$refs.hierarchy as TreeView;
		treeView.items = value;
	}

	getSelectedItem(): TreeView.Item {
		var treeView = this.$refs.hierarchy as TreeView;
		return treeView.selectedItem;
	}

	focus(): void {
		var treeView = this.$refs.hierarchy as TreeView;
		treeView.$el.focus();
	}

	expandAll(): void {
		var treeView = this.$refs.hierarchy as TreeView;
		treeView.expandAll();
	}

	select(item: TreeView.Item): void {
		var treeView = this.$refs.hierarchy as TreeView;
		treeView.select(item);
	}

	unselect(): void {
		var treeView = this.$refs.hierarchy as TreeView;
		treeView.unselect();
	}

	findItemByTag(tag: number): TreeView.Item {
		var treeView = this.$refs.hierarchy as TreeView;
		return treeView.findItemByTag(tag);
	}

	protected created(): void {
		this._command = new HierarchyViewCommand();
		this._command.editor = this.$root as Editor;
	}

	protected mounted(): void {
		var treeView = this.$refs.hierarchy as TreeView;
		treeView.openIcon = "<img src='" + EditorAssets.Images.FolderOpen + "' />"; 
		treeView.closeIcon = "<img src='" + EditorAssets.Images.FolderClose + "' />"; 
		treeView.draggable = true;

		var dragEvents = treeView.dragEvents;
		dragEvents.dragStart = this.onDragStart;
		dragEvents.dragEnd = this.onDragEnd;
		dragEvents.dragOver = this.onDragOver
		dragEvents.dragEnter = this.onDragEnter;
		dragEvents.dragLeave = this.onDragLeave;
		dragEvents.drop = this.onDrop;
	}

	protected getDragImages(): HTMLElement {
		return (this.$root as Editor).dragImages;
	}

	protected createDragImage(text: string): HTMLElement {
		var dragImage = document.createElement("div");
		var imageText = document.createElement("div");
		dragImage.classList.add("dragImage");
		imageText.innerText = text;
		dragImage.appendChild(imageText);
		return dragImage;
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
		var treeView = this.$refs.hierarchy as TreeView;
		var item = treeView.selectedItem;
		if (item == null) {
			return;
		}
		this.$emit("select", item);
	}

	protected onSelect(item: Editor.TreeViewItem): void {
		var inspectorView = this.command.editor.inspectorView;
		if (item == null) {
			this.unselect();
			inspectorView.hide();
			return;
		}
		//console.log("select", item.tag);

		if (item.tag == -1) {
			this.openSceneInspector();
		} else {
			inspectorView.command.updateObjectInspector();
		}
	}

	protected onDoubleClick(): void {
		var object3d = this._command.getSelectedObject();
		this._command.editor.status.scene.lockViewToSelected(object3d);
	}

	protected onMenu(e: MouseEvent): void {
		e.preventDefault();
		this._command.showContextMenu();
	}

	protected onDragStart(e: DragEvent, item: Editor.TreeViewItem): void {
		//console.log("onDragStart");
		this._dragSource = item;
		e.dataTransfer.effectAllowed = "move";
		//e.dataTransfer.dropEffect = "move";

		var dragImages = this.getDragImages();
		var dragImage = this.createDragImage(item.model.text);
		while (dragImages.firstChild) {
			dragImages.removeChild(dragImages.firstChild);
		}
		dragImages.appendChild(dragImage);
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
		//console.log(e.offsetY, el.clientHeight);
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
		var idSrc = this._dragSource.model.tag as number;
		var idDst = item.model.tag as number;
		this._dragSource = null;
		if (idSrc == null || idDst == null) {
			return;
		}
		if (idSrc == idDst) {
			return;
		}
		this.onDropFromHierarchyView(mode, idSrc, idDst);
	}

	protected onDropFromHierarchyView(mode: number, idSrc: number, idDst: number): void {
		//console.log("drop", idSrc, idDst, item.model.text);
		var editor = this.$root as Editor;
		var scene = editor.status.scene;
		var object3dSrc = scene.findChildById(idSrc);
		var object3dDst = scene.findChildById(idDst);
		if (object3dSrc == null || object3dDst == null) {
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
		var id = item.tag as number;
		var scene = editor.status.scene;
		var object3d = scene.findChildById(id);
		if (object3d == null) {
			return;
		}
		var currentPath = nodePath.resolve(".");
		var filename = dragSource.tag as string;
		if (filename.indexOf(currentPath) !== 0) {
			return;
		}
		filename = nodePath.relative(currentPath, filename);
		if (filename.indexOf("assets") !== 0) {
			return;
		}
		filename = nodePath.relative("assets", filename);
		var ext = Tea.File.extension(filename);
		ext = ext.toLowerCase();
		var app = editor.status.app;
		switch (ext) {
			case "js":
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
			case "jpg":
			case "png":
				var selectedObject = this._command.getSelectedObject();
				if (selectedObject == null) {
					return;
				}
				var renderer = selectedObject.getComponent(Tea.MeshRenderer);
				if (renderer == null) {
					return;
				}
				Tea.File.exists(filename, (exists: boolean) => {
					if (exists === false) {
						return;
					}
					renderer.material.mainTexture.load(filename, (err, url) => {
						if (err) {
							return;
						}
						var inspectorView = this.command.editor.inspectorView;
						inspectorView.command.updateObjectInspector();
					});
				});
				break;
		}
	}
}