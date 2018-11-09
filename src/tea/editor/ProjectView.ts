import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../Tea";
import { Editor } from "./Editor";
import { TreeView } from "./basic/TreeView";

@Component({
	template: `
		<div class="ProjectView">
			<TreeView
				ref="folderList"
				class="folderList"
				tabindex="1"></TreeView>
			<TreeView
				ref="fileList"
				class="fileList"
				tabindex="2"
				@focus="onFocusFileList"></TreeView>
		</div>
	`
})
export class ProjectView extends Vue {
	protected _dragSource: Editor.TreeViewItem;

	getSelectedFolderPath(): string {
		var folderList = this.$refs.folderList as TreeView;
		var item = folderList.selectedItem;
		if (item == null) {
			return null;
		}
		return item.tag;
	}

	getSelectedFilePath(): string {
		var fileList = this.$refs.fileList as TreeView;
		var item = fileList.selectedItem;
		if (item == null) {
			return null;
		}
		return item.tag;
	}

	getDragSource(): Editor.TreeViewItem {
		return this._dragSource;
	}

	protected mounted(): void {
		var folderList = this.$refs.folderList as TreeView;
		var fileList = this.$refs.fileList as TreeView;

		folderList.openIcon = "<img src='images/folder-open.svg' />";
		folderList.closeIcon = "<img src='images/folder-close.svg' />";

		folderList.$on("expand", (item: Editor.TreeViewItem) => {
			//console.log("expand", item);
			var i = item.model;
			if (i == null || i.children.length > 0) {
				return;
			}
			var items = [];
			var files = Tea.Directory.getFilesSync(item.tag);
			files.forEach(file => {
				var item = this.createItems(file);
				if (item == null) {
					return;
				}
				items.push(item);
			});
			i.children = items;
		});
		folderList.$on("collapse", (item: Editor.TreeViewItem) => {
			//console.log("collapse", item);
		});
		folderList.$on("select", (item: Editor.TreeViewItem) => {
			if (item == null) {
				fileList.unselect();
				fileList.items = [];
				return;
			}
			//console.log("select", item.tag);
			var path = item.tag;
			Tea.Directory.getFiles(path, (files: Tea.FileInfo[]) => {
				var items = [];
				files.forEach((file) => {
					if (file.isDirectory) {
						return;
					}
					if (file.name === ".DS_Store") {
						return;
					}
					var item = {
						text: file.name,
						children: [],
						isFolder: false,
						tag: file.fullName
					};
					//console.log(file.fullName);
					items.push(item);
				});
				fileList.unselect();
				fileList.items = items;
			});
		});
		folderList.$on("menu", (e: MouseEvent) => {
			this.$emit("folderListMenu", e);
		});
		fileList.$on("menu", (e: MouseEvent) => {
			this.$emit("fileListMenu", e);
		});

		fileList.draggable = true;
		var dragImages = (this.$root as Editor).dragImages;
		var dragEvents = fileList.dragEvents;
		dragEvents.dragStart = (e: DragEvent, item: Editor.TreeViewItem) => {
			//console.log("onDragStart");
			this._dragSource = item;
			e.dataTransfer.effectAllowed = "move";
			//e.dataTransfer.dropEffect = "move";

			var dragImage = this.createDragImage(item.model.text);
			while (dragImages.firstChild) {
				dragImages.removeChild(dragImages.firstChild);
			}
			dragImages.appendChild(dragImage);
			e.dataTransfer.setDragImage(dragImage, 0, 0);
		};
		dragEvents.dragEnd = (e: DragEvent, item: Editor.TreeViewItem) => {
			this._dragSource = null;
		};

		var items = [];
		Tea.Directory.getFiles(".", (files) => {
			files.forEach(file => {
				var item = this.createItems(file);
				if (item == null) {
					return;
				}
				items.push(item);
			});
		});
		folderList.items = items;
	}

	protected createItems(file: Tea.FileInfo): any {
		if (file == null || file.exists === false) {
			return null;
		}
		if (file.isDirectory === false) {
			return null;
		}
		var item = {
			text: file.name,
			children: [],
			isFolder: file.hasChildDirectory,
			tag: file.fullName
		};
		return item;
	}

	protected createDragImage(text: string): HTMLElement {
		var dragImage = document.createElement("div");
		var imageText = document.createElement("div");
		dragImage.classList.add("dragImage");
		imageText.innerText = text;
		dragImage.appendChild(imageText);
		return dragImage;
	}

	protected onFocusFileList(): void {
		/*
		var fileList = this.$refs.fileList as TreeView;
		if (fileList.selectedItem == null) {
			fileList.selectNext();
		}
		//*/
	}
}
