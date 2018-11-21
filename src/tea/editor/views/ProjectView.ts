import * as nodePath from "path";
import * as fs from "fs";
import * as Electron from "electron";
import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Editor } from "../Editor";
import { EditorAssets } from "../EditorAssets";
import { EditorMenu } from "../EditorMenu";
import { FileInspector } from "./FileInspector";
import { TreeView } from "../basic/TreeView";

@Component({
	template: `
		<div class="ProjectView">
			<TreeView
				ref="folderList"
				class="folderList"
				tabindex="1"
				@expand="onExpandFolderList"
				@select="onSelectFolder"
				@menu="onFolderListMenu"></TreeView>
			<TreeView
				ref="fileList"
				class="fileList"
				tabindex="2"
				@focus="onFocusFileList"
				@select="onSelectFile"
				@doubleClick="onDoubleClickFile"
				@menu="onFileListMenu"></TreeView>
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

	selectParentFolder(): void {
		var folderList = this.$refs.folderList as TreeView;
		var item = folderList.selectedItem;
		if (item == null) {
			return;
		}
		var parent = item.parent;
		if (parent == null) {
			return;
		}
		folderList.select(parent);
	}

	openFolder(path: string): void {
		var folderList = this.$refs.folderList as TreeView;
		var selectedItem = folderList.selectedItem;
		Tea.File.exists(path, (exists: boolean) => {
			if (exists === false) {
				return;
			}
			var items = [];
			Tea.Directory.getFiles(path, (files) => {
				files.forEach(file => {
					var item = this.createItems(file);
					if (item == null) {
						return;
					}
					items.push(item);
				});
			});
			var folderList = this.$refs.folderList as TreeView;
			folderList.items = items;
			if (selectedItem == null) {
				return;
			}
			folderList.$nextTick(() => {
				var tag = selectedItem.tag;
				var item = folderList.findItemByTag(tag);
				if (item) {
					item.select();
				}
			});
		});
	}

	updateFileList(path: string): void {
		var fileList = this.$refs.fileList as TreeView;
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
	}

	showProjectViewMenu(): void {
		var contextMenu = EditorMenu.createProjectViewMenu(
			this.onSelectProjectViewMenu
		);
		var editor = this.$root as Editor;
		var projectView = editor.projectView;
		var path = projectView.getSelectedFolderPath();
		var relativePath = nodePath.relative(process.cwd(), path);
		if (relativePath.toLowerCase() === "assets") {
			var deleteItem = contextMenu.getMenuItemById("Delete");
			deleteItem.enabled = false;
		}
		contextMenu.show();
	}

	showProjectViewFileMenu(): void {
		var contextMenu = EditorMenu.createProjectViewFileMenu(
			this.onSelectProjectViewFileMenu
		);
		contextMenu.show();
	}

	protected mounted(): void {
		var folderList = this.$refs.folderList as TreeView;
		var fileList = this.$refs.fileList as TreeView;

		folderList.openIcon = "<img src='" + EditorAssets.Images.FolderOpen + "' />";
		folderList.closeIcon = "<img src='" + EditorAssets.Images.FolderClose + "' />";

		fileList.draggable = true;
		
		var dragEvents = fileList.dragEvents;
		dragEvents.dragStart = this.onDragStart;
		dragEvents.dragEnd = this.onDragEnd;
		this.openFolder(process.cwd());
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

	protected onDragStart(e: DragEvent, item: Editor.TreeViewItem): void {
		//console.log("onDragStart");
		this._dragSource = item;
		e.dataTransfer.effectAllowed = "move";
		//e.dataTransfer.dropEffect = "move";

		var dragImages = (this.$root as Editor).dragImages;
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

	protected onExpandFolderList(item: Editor.TreeViewItem): void {
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
	}

	protected onSelectFolder(item: Editor.TreeViewItem): void {
		var fileList = this.$refs.fileList as TreeView;
		if (item == null) {
			fileList.unselect();
			fileList.items = [];
			return;
		}
		//console.log("select", item.tag);
		var path = item.tag;
		this.updateFileList(path);
	}

	protected onFolderListMenu(e: MouseEvent): void {
		if (this.getSelectedFolderPath() == null) {
			return;
		}
		e.preventDefault();
		this.showProjectViewMenu();
	}

	protected onFocusFileList(): void {
		var fileList = this.$refs.fileList as TreeView;
		var item = fileList.selectedItem;
		if (item == null) {
			return;
		}
		this.onSelectFile(item);
	}

	protected onSelectFile(item: Editor.TreeViewItem): void {
		var editor = this.$root as Editor;
		var inspectorView = editor.inspectorView;
		if (item == null) {
			inspectorView.hide();
			return;
		}
		var path = item.tag;
		if (fs.existsSync(path) === false) {
			return;
		}
		var ext = Tea.File.extension(path);
		ext = ext.toLowerCase();
		switch (ext) {
			case "json":
			case "html":
			case "css":
			case "js":
			case "ts":
			case "md":
			case "txt":
				Tea.File.readText(path, (err, data) => {
					if (err) {
						return;
					}
					var maxSize = 1024 * 64;
					if (data.length > maxSize) {
						data = data.substr(0, maxSize);
					}
					inspectorView.hide();
					inspectorView.component = FileInspector;
					inspectorView.show();
					inspectorView.$nextTick(() => {
						var component = inspectorView.getComponent() as FileInspector;
						var stat = fs.statSync(path);
						component.fileType = ext.toUpperCase();
						component.text = data;
						component.setSize(stat.size);
						component.setCreatedTime(stat.birthtime);
						component.setModifiedTime(stat.mtime);
					});
				});
				break;
		}
	}

	protected onDoubleClickFile(item: Editor.TreeViewItem): void {
		if (item == null) {
			return;
		}
		var editor = this.$root as Editor;
		var path = this.getSelectedFilePath();
		path = nodePath.resolve(path);
		var ext = nodePath.extname(path);
		if (ext === ".json") {
			Tea.File.readText(path, (err: any, data: string) => {
				if (err) {
					console.error(err);
					return;
				}
				var json = JSON.parse(data);
				if (json._type === "Scene") {
					editor.command.loadScene(path);
				} else {
					Electron.shell.openItem(path);
				}
			});
			return;
		}
		Electron.shell.openItem(path);
	}

	protected onFileListMenu(e: MouseEvent): void {
		if (this.getSelectedFilePath() == null) {
			return;
		}
		e.preventDefault();
		this.showProjectViewFileMenu();
	}

	protected onSelectProjectViewMenu = (item: Electron.MenuItem): void => {
		var path = this.getSelectedFolderPath();
		path = nodePath.resolve(path);

		switch (item.id) {
			case "Show in Explorer":
				if (fs.existsSync(path) === false) {
					break;
				}
				Electron.shell.openItem(path);
				break;
			case "Reveal in Finder":
				console.log("Reveal in Finder", path);
				if (fs.existsSync(path) === false) {
					break;
				}
				Electron.shell.openItem(path);
				break;
			case "Create/Folder":
				path = nodePath.join(path, "New Folder");
				fs.mkdirSync(path);
				this.openFolder(process.cwd());
				break;
			case "Create/JavaScript":
				path = nodePath.join(path, "New Script.js");
				var script = `class NewScript {
	constructor() {
	}

	start() {
	}

	update() {
	}
}
`;
				fs.writeFileSync(path, script);
				this.updateFileList(
					this.getSelectedFolderPath()
				);
				break;
			case "Delete":
				this.selectParentFolder();
				Tea.File.removeFolder(path);
				this.openFolder(process.cwd());
				break;
			case "Refresh":
				this.openFolder(process.cwd());
				break;
		}
	}

	protected onSelectProjectViewFileMenu = (item: Electron.MenuItem): void => {
		var path = this.getSelectedFilePath();
		path = nodePath.resolve(path);

		switch (item.id) {
			case "Open":
				Electron.shell.openItem(path);
				console.log("Open", path);
				break;
		}
	}
}
