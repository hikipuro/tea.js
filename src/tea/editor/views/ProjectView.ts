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

class FileItemTag {
	path: string;
	isFolder: boolean;

	static create(path: string, isFolder: boolean): FileItemTag {
		var tag = new FileItemTag ();
		tag.path = path;
		tag.isFolder = isFolder;
		return tag;
	}
}

@Component({
	template: `
		<div class="ProjectView">
			<TreeView
				ref="folderList"
				class="folderList"
				tabindex="1"
				@expand="onExpandFolderList"
				@select="onSelectFolder"
				@doubleClick="onDoubleClickFolderList"
				@menu="onFolderListMenu"></TreeView>
			<TreeView
				ref="fileList"
				class="fileList"
				tabindex="1"
				@focus="onFocusFileList"
				@select="onSelectFile"
				@keydown="onFileListKeyDown"
				@doubleClick="onDoubleClickFile"
				@menu="onFileListMenu"
				@beforeRename="onBeforeRenameFile"
				@rename="onRenameFile"></TreeView>
		</div>
	`
})
export class ProjectView extends Vue {
	protected _dragSourceFile: Editor.TreeViewItem;

	get folderList(): TreeView {
		return this.$refs.folderList as TreeView;
	}

	get fileList(): TreeView {
		return this.$refs.fileList as TreeView;
	}

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
		var tag = item.tag as FileItemTag;
		if (tag == null) {
			return null;
		}
		return tag.path;
	}

	getDragSource(): Editor.TreeViewItem {
		return this._dragSourceFile;
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
				files = this.sortFolders(files);
				files.forEach((file: Tea.FileInfo) => {
					var item = this.createFolderListModel(file);
					if (item == null) {
						return;
					}
					items.push(item);
				});
			});
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
			if (files == null) {
				this.clearFileList();
				return;
			}
			var items = [];
			files = files.sort((a: Tea.FileInfo, b: Tea.FileInfo): number => {
				var folderA = a.isDirectory ? 2 : 0;
				var folderB = b.isDirectory ? 2 : 0;
				var fileA = a.name.toLocaleLowerCase();
				var fileB = b.name.toLocaleLowerCase();
				return (folderB - folderA) + (fileB > fileA ? 0 : 1);
			});
			files.forEach((file: Tea.FileInfo) => {
				/*if (file.isDirectory) {
					return;
				}*/
				if (file.name === ".DS_Store") {
					return;
				}
				var item = this.createFileListModel(file);
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

		folderList.draggable = true;
		var dragEvents = folderList.dragEvents;
		dragEvents.dragStart = this.onFolderDragStart;
		dragEvents.dragOver = this.onFolderDragOver;
		dragEvents.dragEnter = this.onFolderDragEnter;
		dragEvents.dragLeave = this.onFolderDragLeave;
		dragEvents.drop = this.onFolderDrop;

		fileList.draggable = true;
		dragEvents = fileList.dragEvents;
		dragEvents.dragStart = this.onFileDragStart;
		dragEvents.dragEnd = this.onFileDragEnd;
		dragEvents.dragOver = this.onFileDragOver;
		dragEvents.dragEnter = this.onFileDragEnter;
		dragEvents.dragLeave = this.onFileDragLeave;
		dragEvents.drop = this.onFileDrop;
		this.openFolder(process.cwd());
	}

	protected createFolderListModel(file: Tea.FileInfo): TreeView.Model {
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

	protected createFileListModel(file: Tea.FileInfo): TreeView.Model {
		var iconUrl = this.getFileIconUrl(file);
		var icon: string = null;
		if (iconUrl !== "") {
			icon = "<img src='" + iconUrl + "'>";
		}
		var item: TreeView.Model = {
			text: file.name,
			isFolder: false,
			icon: icon,
			indent: "1.7em",
			tag: FileItemTag.create(
				file.fullName,
				file.isDirectory
			),
			children: []
		};
		return item;
	}

	protected clearFileList(): void {
		var fileList = this.$refs.fileList as TreeView;
		fileList.unselect();
		fileList.items = [];
	}

	protected sortFolders(files: Array<Tea.FileInfo>): Array<Tea.FileInfo> {
		if (files == null || files.length <= 0) {
			return files;
		}
		return files.sort((a: Tea.FileInfo, b: Tea.FileInfo): number => {
			var fileA = a.name.toLocaleLowerCase();
			var fileB = b.name.toLocaleLowerCase();
			return fileB > fileA ? 0 : 1;
		});
	}

	protected setFolderListChildItems(item: Editor.TreeViewItem): void {
		var i = item.model;
		if (i == null || i.children.length > 0) {
			return;
		}
		var items: Array<TreeView.Model> = [];
		var files = Tea.Directory.getFilesSync(item.tag);
		if (files == null) {
			return;
		}
		files = this.sortFolders(files);
		files.forEach((file: Tea.FileInfo) => {
			var item = this.createFolderListModel(file);
			if (item == null) {
				return;
			}
			items.push(item);
		});
		i.children = items;
	}

	protected getFileIconUrl(file: Tea.FileInfo): string {
		if (file.isDirectory) {
			return EditorAssets.Images.FolderIcon;
		}
		var ext = nodePath.extname(file.name);
		switch (ext) {
			case ".html":
				return EditorAssets.Images.HtmlIcon;
			case ".js":
				return EditorAssets.Images.JSIcon;
			case ".json":
				return EditorAssets.Images.JsonIcon;
		}
		return "";
	}

	protected openFile(path: string): void {
		if (path == null) {
			return;
		}
		var editor = this.$root as Editor;
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

	protected moveFile(path: string, target: string): boolean {
		var stat = fs.statSync(target);
		if (stat == null || stat.isDirectory() === false) {
			return false;
		}
		var dir = nodePath.dirname(path);
		if (nodePath.relative(dir, target) === "") {
			return false;
		}
		var name = nodePath.basename(path);
		target = nodePath.join(target, name);
		if (fs.existsSync(target)) {
			return false;
		}
		fs.renameSync(path, target);
		return true;
	}

	protected openFileInspector(path: string): void {
		if (path == null) {
			return;
		}
		if (fs.existsSync(path) === false) {
			return;
		}
		var editor = this.$root as Editor;
		var inspectorView = editor.inspectorView;
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

	protected onFolderDragStart(e: DragEvent, item: Editor.TreeViewItem): void {
		//console.log("onDragStart");
		e.preventDefault();
	}

	protected onFolderDragOver(e: DragEvent, item: Editor.TreeViewItem): void {
		if (this._dragSourceFile == null) {
			return;
		}
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	}

	protected onFolderDragEnter(e: DragEvent, item: Editor.TreeViewItem): void {
		//console.log("dragEnter", item.model.text, this._dragSourceFile);
		if (this._dragSourceFile == null) {
			return;
		}
		var el = e.currentTarget as HTMLElement;
		el.classList.add("dragEnter");
	}

	protected onFolderDragLeave(e: DragEvent, item: Editor.TreeViewItem): void {
		//console.log("dragLeave", this, e);
		var el = e.currentTarget as HTMLElement;
		el.classList.remove("dragEnter");
	}

	protected onFolderDrop(e: DragEvent, item: Editor.TreeViewItem): void {
		//console.log("drop", item);
		if (this._dragSourceFile == null) {
			return;
		}
		var el = e.currentTarget as HTMLElement;
		if (el.classList.contains("dragEnter") === false) {
			return;
		}
		el.classList.remove("dragEnter");
		var tagSrc = this._dragSourceFile.model.tag as FileItemTag;
		var targetPath = item.model.tag;
		this._dragSourceFile = null;
		if (tagSrc == null || targetPath == null) {
			return;
		}
		//console.log(tagSrc, targetPath);
		if (this.moveFile(tagSrc.path, targetPath)) {
			var path = nodePath.dirname(tagSrc.path);
			this.updateFileList(path);
			if (tagSrc.isFolder) {
				this.openFolder(process.cwd());
			}
		}
	}

	protected onFileDragStart(e: DragEvent, item: Editor.TreeViewItem): void {
		//console.log("onDragStart");
		this._dragSourceFile = item;
		e.dataTransfer.effectAllowed = "move";
		//e.dataTransfer.dropEffect = "move";

		var dragImages = (this.$root as Editor).dragImages;
		dragImages.clear();
		var dragImage = dragImages.addDragImage(item.model.text);
		e.dataTransfer.setDragImage(dragImage, 0, 0);
	}

	protected onFileDragEnd(e: DragEvent, item: Editor.TreeViewItem): void {
		this._dragSourceFile = null;
	}

	protected onFileDragOver(e: DragEvent, item: Editor.TreeViewItem): void {
		if (this._dragSourceFile == null) {
			return;
		}
		var tag = item.tag as FileItemTag;
		if (tag == null || tag.isFolder === false) {
			return;
		}
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	}

	protected onFileDragEnter(e: DragEvent, item: Editor.TreeViewItem): void {
		//console.log("dragEnter", item.model.text, this._dragSource);
		if (this._dragSourceFile == null) {
			return;
		}
		var tag = item.tag as FileItemTag;
		if (tag == null || tag.isFolder === false) {
			return;
		}
		var el = e.currentTarget as HTMLElement;
		el.classList.add("dragEnter");
	}

	protected onFileDragLeave(e: DragEvent, item: Editor.TreeViewItem): void {
		//console.log("dragLeave", this, e);
		var el = e.currentTarget as HTMLElement;
		el.classList.remove("dragEnter");
	}

	protected onFileDrop(e: DragEvent, item: Editor.TreeViewItem): void {
		//console.log("drop", item);
		if (this._dragSourceFile == null) {
			return;
		}
		var el = e.currentTarget as HTMLElement;
		if (el.classList.contains("dragEnter") === false) {
			return;
		}
		el.classList.remove("dragEnter");
		var tagSrc = this._dragSourceFile.model.tag as FileItemTag;
		var tagDst = item.model.tag as FileItemTag;
		this._dragSourceFile = null;
		if (tagSrc == null || tagDst == null || tagSrc == tagDst) {
			return;
		}
		//console.log(tagSrc, tagDst);
		if (this.moveFile(tagSrc.path, tagDst.path)) {
			var path = nodePath.dirname(tagSrc.path);
			this.updateFileList(path);
			if (tagSrc.isFolder) {
				this.openFolder(process.cwd());
			}
		}
	}

	protected onExpandFolderList(item: Editor.TreeViewItem): void {
		//console.log("expand", item);
		this.setFolderListChildItems(item);
	}

	protected onSelectFolder(item: Editor.TreeViewItem): void {
		if (item == null) {
			this.clearFileList();
			return;
		}
		//console.log("select", item.tag);
		var path = item.tag;
		this.setFolderListChildItems(item);
		this.updateFileList(path);
	}

	protected onDoubleClickFolderList(item: Editor.TreeViewItem): void {
		item.toggle();
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
		var tag = item.tag as FileItemTag;
		this.openFileInspector(tag.path);
	}

	protected onFileListKeyDown(e: KeyboardEvent): void {
		switch (e.key) {
			case "Enter":
				var path = this.getSelectedFilePath();
				this.openFile(path);
				break;
		}
	}

	protected onDoubleClickFile(item: Editor.TreeViewItem): void {
		if (item == null) {
			return;
		}
		var path = this.getSelectedFilePath();
		this.openFile(path);
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
		var tag = item.tag as FileItemTag;
		var oldPath = tag.path;
		var basePath = nodePath.dirname(oldPath);
		var newPath = nodePath.join(basePath, value);
		fs.renameSync(oldPath, newPath);
		item.model.text = value;
		tag.path = newPath;

		var file = new Tea.FileInfo(newPath);
		var iconUrl = this.getFileIconUrl(file);
		if (iconUrl !== "") {
			item.model.icon = "<img src='" + iconUrl + "'>";
		} else {
			item.model.icon = null;
		}

		var stat = fs.statSync(newPath);
		if (stat.isDirectory()) {
			var folderList = this.$refs.folderList as TreeView;
			var item = folderList.findItemByTag(basePath);
			if (item && item.model) {
				item.model.children = [];
				this.setFolderListChildItems(item);
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
				var stat = fs.statSync(path);
				if (stat.isDirectory()) {
					this.selectFolder(path);
					break;
				}
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
