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
				@menu="onFileListMenu"
				@before-rename="onBeforeRenameFile"
				@rename="onRenameFile"></TreeView>
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
			var items: Array<TreeView.Model> = [];
			Tea.Directory.getFiles(path, (files: Array<Tea.FileInfo>) => {
				files = files.sort((a: Tea.FileInfo, b: Tea.FileInfo): number => {
					var fileA = a.name.toLocaleLowerCase();
					var fileB = b.name.toLocaleLowerCase();
					return fileB > fileA ? 0 : 1;
				});
				files.forEach(file => {
					var item = this.createTreeViewItem(file);
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

	selectFolder(path: string): void {
		var folderList = this.$refs.folderList as TreeView;
		var item = folderList.findItemByTag(path);
		if (item) {
			var parent = item.parent;
			if (parent instanceof Editor.TreeViewItem) {
				if (parent.isOpen === false) {
					parent.expand();
				}
			}
			folderList.select(item);
		}
	}

	updateFileList(path: string): void {
		var fileList = this.$refs.fileList as TreeView;
		Tea.Directory.getFiles(path, (files: Tea.FileInfo[]) => {
			var items = [];
			files = files.sort((a: Tea.FileInfo, b: Tea.FileInfo): number => {
				var folderA = a.isDirectory ? 2 : 0;
				var folderB = b.isDirectory ? 2 : 0;
				var fileA = a.name.toLocaleLowerCase();
				var fileB = b.name.toLocaleLowerCase();
				return (folderB - folderA) + (fileB > fileA ? 0 : 1);
			});
			files.forEach((file) => {
				/*if (file.isDirectory) {
					return;
				}*/
				if (file.name === ".DS_Store") {
					return;
				}
				var icon: string = null;
				if (file.isDirectory) {
					icon = "<img src='" + EditorAssets.Images.FolderIcon + "'>";
				} else {
					var ext = nodePath.extname(file.name);
					switch (ext) {
						case ".html":
							icon = "<img src='" + EditorAssets.Images.HtmlIcon + "'>";
							break;
						case ".js":
							icon = "<img src='" + EditorAssets.Images.JSIcon + "'>";
							break;
						case ".json":
							icon = "<img src='" + EditorAssets.Images.JsonIcon + "'>";
							break;
					}
				}
				var item: TreeView.Model = {
					text: file.name,
					isFolder: false,
					icon: icon,
					indent: "1.7em",
					tag: file.fullName,
					children: []
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
			this.onSelectFolderMenu
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
			this.onSelectFileMenu
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

	protected createTreeViewItem(file: Tea.FileInfo): TreeView.Model {
		if (file == null || file.exists === false) {
			return null;
		}
		if (file.isDirectory === false) {
			return null;
		}
		var item: TreeView.Model = {
			text: file.name,
			isFolder: file.hasChildDirectory,
			tag: file.fullName,
			children: []
		};
		return item;
	}

	protected setChildFolderItems(item: Editor.TreeViewItem): void {
		var i = item.model;
		if (i == null || i.children.length > 0) {
			return;
		}
		var items: Array<TreeView.Model> = [];
		var files = Tea.Directory.getFilesSync(item.tag);
		files.forEach(file => {
			var item = this.createTreeViewItem(file);
			if (item == null) {
				return;
			}
			items.push(item);
		});
		i.children = items;
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

	protected onExpandFolderList(item: Editor.TreeViewItem): void {
		//console.log("expand", item);
		this.setChildFolderItems(item);
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
		this.setChildFolderItems(item);
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
		if (path == null) {
			return;
		}
		path = nodePath.resolve(path);

		var stat = fs.statSync(path);
		if (stat.isDirectory()) {
			this.selectFolder(path);
			return;
		}
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

	protected onBeforeRenameFile(item: Editor.TreeViewItem, rename: HTMLInputElement): void {
		var value = rename.value;
		rename.selectionEnd = value.lastIndexOf(".");
	}

	protected onRenameFile(item: Editor.TreeViewItem, value: string): void {
		var oldPath = item.tag;
		var basePath = nodePath.dirname(oldPath);
		var newPath = nodePath.join(basePath, value);
		fs.renameSync(oldPath, newPath);
		item.model.text = value;
		item.model.tag = newPath;
		var stat = fs.statSync(newPath);
		if (stat.isDirectory()) {
			var folderList = this.$refs.folderList as TreeView;
			var item = folderList.findItemByTag(basePath);
			if (item && item.model) {
				item.model.children = [];
				this.setChildFolderItems(item);
			}
		}
	}

	protected onSelectFolderMenu = (item: Electron.MenuItem): void => {
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

	protected onSelectFileMenu = (item: Electron.MenuItem): void => {
		var path = this.getSelectedFilePath();
		path = nodePath.resolve(path);

		switch (item.id) {
			case "Open":
				Electron.shell.openItem(path);
				console.log("Open", path);
				break;
			case "Rename":
				var fileList = this.$refs.fileList as TreeView;
				var fileItem = fileList.selectedItem;
				if (fileItem) {
					fileItem.rename();
				}
				break;
		}
	}
}
