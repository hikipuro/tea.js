import * as Electron from "electron";
import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Editor } from "../Editor";
import { EditorAssets } from "../EditorAssets";
import { EditorMenu } from "../EditorMenu";
import { FileInspector } from "./FileInspector";
import { TreeView } from "../basic/TreeView";
import { LocalDirectory } from "../LocalDirectory";
import { LocalFile } from "../LocalFile";
import { FileType } from "../FileType";

export class FileItemTag {
	path: string;
	isFolder: boolean;

	static create(path: string, isFolder: boolean): FileItemTag {
		var tag = new FileItemTag ();
		tag.path = path;
		tag.isFolder = isFolder;
		return tag;
	}
}

const ScriptTemplate = `class NewScript {
	constructor() {
	}

	start() {
	}

	update() {
	}
}
`;

@Component({
	template: `
		<div class="ProjectView">
			<TreeView
				ref="folderList"
				class="folderList"
				tabindex="1"
				@expand="onExpandFolderList"
				@select="onSelectFolder"
				@keydown="onFolderListKeyDown"
				@doubleClick="onDoubleClickFolderList"
				@menu="onFolderListMenu"
				@rename="onRenameFolder"></TreeView>
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
	protected _folderPath: string;

	get folderList(): TreeView {
		return this.$refs.folderList as TreeView;
	}

	get fileList(): TreeView {
		return this.$refs.fileList as TreeView;
	}

	getSelectedFolderPath(): string {
		var item = this.getSelectedFolderItem();
		if (item == null) {
			return null;
		}
		return item.tag;
	}

	getSelectedFilePath(): string {
		var item = this.getSelectedFileItem();
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
		var folderList = this.folderList;
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

	openFolder(path: string = null): void {
		if (path == null) {
			path = this._folderPath;
		}
		var folderList = this.folderList;
		var selectedItem = folderList.selectedItem;
		var selectedPath = null;
		if (selectedItem != null) {
			selectedPath = selectedItem.tag;
		}
		if (LocalFile.exists(path) === false) {
			this.clearFolderList();
			this.clearFileList();
			return;
		}
		this._folderPath = path;
		var items = this.createFolderListItems(path);
		folderList.items = items;
		if (selectedPath == null) {
			return;
		}
		folderList.$nextTick(() => {
			var item = folderList.findItemByTag(selectedPath);
			if (item == null) {
				return;
			}
			folderList.select(item);
		});
	}

	selectFolder(path: string): void {
		var folderList = this.folderList;
		var item = folderList.findItemByTag(path);
		if (item == null) {
			return;
		}
		var parent = item.parent;
		if (parent instanceof Editor.TreeViewItem) {
			if (parent.isOpen === false) {
				parent.expand();
			}
		}
		folderList.select(item);
	}

	updateFileList(path: string = null): void {
		if (path == null) {
			path = this.getSelectedFolderPath();
		}
		var fileList = this.fileList;
		var files = LocalDirectory.getFilesSync(path);
		if (files == null) {
			this.clearFileList();
			return;
		}
		var selectedItem = fileList.selectedItem;
		var selectedTag = null;
		if (selectedItem != null) {
			selectedTag = selectedItem.tag;
		}
		var items = [];
		files = this.sortFiles(files);
		files.forEach((file: LocalDirectory.FileInfo) => {
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
		if (selectedTag == null) {
			return;
		}
		var dir = LocalFile.dirname(selectedTag.path);
		var relative = LocalFile.relative(dir, path);
		if (relative !== "") {
			return;
		}
		fileList.$nextTick(() => {
			var item = fileList.findItem((item: Editor.TreeViewItem): boolean => {
				return item.tag.path === selectedTag.path;
			});
			if (item == null) {
				return;
			}
			fileList.select(item);
		});
	}

	showFolderListContextMenu(): void {
		var contextMenu = EditorMenu.createProjectViewMenu(
			this.onSelectFolderMenu
		);
		var editor = this.$root as Editor;
		var projectView = editor.projectView;
		var path = projectView.getSelectedFolderPath();
		if (path == null) {
			contextMenu.disableItem("Create");
			contextMenu.disableItem("Delete");
			contextMenu.disableItem("Rename");
		} else {
			var relativePath = LocalFile.relative(process.cwd(), path);
			if (relativePath.toLowerCase() === "assets") {
				contextMenu.disableItem("Delete");
				contextMenu.disableItem("Rename");
			}
		}
		contextMenu.show();
	}

	showFileListContextMenu(): void {
		var contextMenu = EditorMenu.createProjectViewFileMenu(
			this.onSelectFileMenu
		);
		var path = this.getSelectedFilePath();
		if (path == null) {
			contextMenu.disableItem("Open");
			contextMenu.disableItem("Delete");
			contextMenu.disableItem("Rename");
		} else if (LocalFile.extname(path) !== ".obj") {
			contextMenu.hideItem("Convert");
		}
		contextMenu.show();
	}

	protected mounted(): void {
		var folderList = this.folderList;
		var fileList = this.fileList;

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

	protected getSelectedFolderItem(): Editor.TreeViewItem {
		var folderList = this.folderList;
		return folderList.selectedItem;
	}

	protected getSelectedFileItem(): Editor.TreeViewItem {
		var fileList = this.fileList;
		return fileList.selectedItem;
	}

	protected createFolderListModel(file: LocalDirectory.FileInfo): TreeView.Model {
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

	protected createFolderListItems(path: string): Array<TreeView.Model> {
		if (LocalFile.exists(path) === false) {
			return null;
		}
		var items: Array<TreeView.Model> = [];
		var files = LocalDirectory.getFilesSync(path);
		if (files == null) {
			return null;
		}
		files = this.sortFolders(files);
		files.forEach((file: LocalDirectory.FileInfo) => {
			var item = this.createFolderListModel(file);
			if (item == null) {
				return;
			}
			var children = this.createFolderListItems(item.tag);
			if (children) {
				item.children = children;
			}
			items.push(item);
		});
		return items;
	}

	protected createFileListModel(file: LocalDirectory.FileInfo): TreeView.Model {
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

	protected clearFolderList(): void {
		var folderList = this.folderList;
		folderList.unselect();
		folderList.items = [];
	}

	protected clearFileList(): void {
		var fileList = this.fileList;
		fileList.unselect();
		fileList.items = [];
	}

	protected sortFolders(files: Array<LocalDirectory.FileInfo>): Array<LocalDirectory.FileInfo> {
		if (files == null || files.length <= 0) {
			return files;
		}
		return files.sort((a: LocalDirectory.FileInfo, b: LocalDirectory.FileInfo): number => {
			var fileA = a.name.toLocaleLowerCase();
			var fileB = b.name.toLocaleLowerCase();
			return fileB > fileA ? -1 : 1;
		});
	}

	protected sortFiles(files: Array<LocalDirectory.FileInfo>): Array<LocalDirectory.FileInfo> {
		if (files == null || files.length <= 0) {
			return files;
		}
		return files.sort((a: LocalDirectory.FileInfo, b: LocalDirectory.FileInfo): number => {
			var folderA = a.isDirectory ? 2 : -2;
			var folderB = b.isDirectory ? 2 : -2;
			var fileA = a.name.toLocaleLowerCase();
			var fileB = b.name.toLocaleLowerCase();
			return (folderB - folderA) + (fileB > fileA ? -1 : 1);
		});
	}

	protected setFolderListChildItems(item: Editor.TreeViewItem): void {
		if (item == null) {
			return;
		}
		var i = item.model;
		if (i == null || i.children.length > 0) {
			return;
		}
		var items: Array<TreeView.Model> = [];
		var files = LocalDirectory.getFilesSync(item.tag);
		if (files == null) {
			return;
		}
		files = this.sortFolders(files);
		files.forEach((file: LocalDirectory.FileInfo) => {
			var item = this.createFolderListModel(file);
			if (item == null) {
				return;
			}
			items.push(item);
		});
		i.children = items;
	}

	protected getFileIconUrl(file: LocalDirectory.FileInfo): string {
		if (file.isDirectory) {
			return EditorAssets.Images.FolderIcon;
		}
		var ext = LocalFile.extname(file.name);
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
		path = LocalFile.resolve(path);

		if (LocalFile.exists(path) === false) {
			this.openFolder();
			this.updateFileList();
			return;
		}
		if (LocalFile.isFolder(path)) {
			var item = this.folderList.findItemByTag(path);
			if (item != null) {
				this.selectFolder(path);
				return;
			}
			item = this.getSelectedFolderItem();
			if (item == null) {
				return;
			}
			item.model.children = [];
			this.setFolderListChildItems(item);
			this.$nextTick(() => {
				this.openFile(path);
				this.selectFolder(path);
			});
			return;
		}
		var ext = LocalFile.extname(path);
		if (ext === ".json") {
			var data = LocalFile.readText(path);
			if (data == null) {
				console.error("error");
				return;
			}
			var json = JSON.parse(data);
			if (json._type === "Scene") {
				editor.command.loadScene(path);
			} else {
				Electron.shell.openItem(path);
			}
			return;
		}
		Electron.shell.openItem(path);
	}

	protected moveFile(path: string, target: string): boolean {
		if (LocalFile.isFolder(target) === false) {
			return false;
		}
		var dir = LocalFile.dirname(path);
		if (LocalFile.relative(dir, target) === "") {
			return false;
		}
		var name = LocalFile.basename(path);
		target = LocalFile.join(target, name);
		if (LocalFile.exists(target)) {
			return false;
		}
		LocalFile.rename(path, target);
		return true;
	}

	protected openFileInspector(path: string): void {
		if (path == null) {
			return;
		}
		if (LocalFile.exists(path) === false) {
			return;
		}
		if (LocalFile.isFolder(path)) {
			this.openDefaultFileInspector(path, "");
			return;
		}
		var ext = LocalFile.extname(path);
		ext = ext.toLowerCase();
		switch (ext) {
			case ".json":
			case ".html":
			case ".css":
			case ".js":
			case ".ts":
			case ".md":
			case ".txt":
			case ".obj":
			case ".mtl":
				this.openTextFileInspector(path, ext);
				break;
			case ".jpg":
			case ".png":
			case ".gif":
			case ".bmp":
			case ".svg":
				this.openImageFileInspector(path, ext);
				break;
			default:
				this.openDefaultFileInspector(path, ext);
				break;
		}
	}

	protected openTextFileInspector(path: string, ext: string): void {
		var editor = this.$root as Editor;
		var inspectorView = editor.inspectorView;
		var data = LocalFile.readText(path);
		if (data == null) {
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
			if (component == null) {
				return;
			}
			var stat = LocalFile.stat(path);
			component.fileType = FileType.getFileTypeString(ext);
			component.type = FileInspector.Type.Text;
			component.text = data;
			component.setSize(stat.size);
			component.setCreatedTime(stat.birthtime);
			component.setModifiedTime(stat.mtime);
		});
	}

	protected openImageFileInspector(path: string, ext: string): void {
		var editor = this.$root as Editor;
		var inspectorView = editor.inspectorView;
		inspectorView.hide();
		inspectorView.component = FileInspector;
		inspectorView.show();
		inspectorView.$nextTick(() => {
			var component = inspectorView.getComponent() as FileInspector;
			if (component == null) {
				return;
			}
			var stat = LocalFile.stat(path);
			component.fileType = FileType.getFileTypeString(ext);
			component.type = FileInspector.Type.Image;
			component.image = path;
			component.setSize(stat.size);
			component.setCreatedTime(stat.birthtime);
			component.setModifiedTime(stat.mtime);
		});
	}

	protected openDefaultFileInspector(path: string, ext: string): void {
		var editor = this.$root as Editor;
		var inspectorView = editor.inspectorView;
		inspectorView.hide();
		inspectorView.component = FileInspector;
		inspectorView.show();
		inspectorView.$nextTick(() => {
			var component = inspectorView.getComponent() as FileInspector;
			if (component == null) {
				return;
			}
			var stat = LocalFile.stat(path);
			component.fileType = FileType.getFileTypeString(ext);
			component.type = FileInspector.Type.Default;
			if (LocalFile.isFolder(path)) {
				component.type = FileInspector.Type.Folder;
			}
			component.setSize(stat.size);
			component.setCreatedTime(stat.birthtime);
			component.setModifiedTime(stat.mtime);
		});
	}

	protected getNewFileName(targetPath: string, basename: string): string {
		var path = LocalFile.join(targetPath, basename);
		if (LocalFile.exists(path) === false) {
			return basename;
		}
		var n = basename.split(".");
		for (var i = 1; i < 100; i++) {
			var index = i.toString();
			var name = basename + " " + index;
			if (n.length > 1) {
				name = [n[0] + " " + index].concat(n.slice(1)).join(".");
			}
			path = LocalFile.join(targetPath, name);
			if (LocalFile.exists(path) === false) {
				return name;
			}
		}
		return null;
	}

	protected renameFileListItem(path: string): void {
		var item = this.fileList.findItem((item: Editor.TreeViewItem) => {
			var tag = item.tag as FileItemTag;
			if ((tag instanceof FileItemTag) === false) {
				return false;
			}
			return tag.path === path;
		});
		if (item == null) {
			return;
		}
		item.rename();
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
			this.updateFileList();
			if (tagSrc.isFolder) {
				this.openFolder();
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
			this.updateFileList();
			if (tagSrc.isFolder) {
				this.openFolder();
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

	protected onFolderListKeyDown(e: KeyboardEvent): void {
		switch (e.key) {
			case "F2":
				var folderList = this.folderList;
				var item = folderList.selectedItem;
				var path = item.tag;
				var assetsPath = LocalFile.join(
					process.cwd(), "assets"
				);
				if (path === assetsPath) {
					break;
				}
				if (item) {
					item.rename();
				}
				break;
		}
	}

	protected onDoubleClickFolderList(item: Editor.TreeViewItem): void {
		item.toggle();
	}

	protected onFolderListMenu(e: MouseEvent): void {
		e.preventDefault();
		this.showFolderListContextMenu();
	}

	protected onRenameFolder(item: Editor.TreeViewItem, value: string): void {
		var folderList = this.folderList;
		if (value == null) {
			folderList.focus();
			return;
		}
		var oldPath = item.tag as string;
		var basePath = LocalFile.dirname(oldPath);
		var newPath = LocalFile.join(basePath, value);
		if (LocalFile.exists(newPath)) {
			folderList.focus();
			return;
		}
		LocalFile.rename(oldPath, newPath);
		item.model.tag = newPath;
		this.openFolder();
		folderList.focus();
	}

	protected onFocusFileList(): void {
		var item = this.getSelectedFileItem();
		if (item == null) {
			return;
		}
		setTimeout(() => {
			var item = this.getSelectedFileItem();
			this.onSelectFile(item);
		}, 100);
	}

	protected onSelectFile(item: Editor.TreeViewItem): void {
		var editor = this.$root as Editor;
		var inspectorView = editor.inspectorView;
		if (item == null) {
			inspectorView.hide();
			return;
		}
		var tag = item.tag as FileItemTag;
		if (tag == null) {
			inspectorView.hide();
			return;
		}
		this.openFileInspector(tag.path);
	}

	protected onFileListKeyDown(e: KeyboardEvent): void {
		switch (e.key) {
			case "Enter":
				var path = this.getSelectedFilePath();
				this.openFile(path);
				break;
			case "F2":
				var item = this.getSelectedFileItem();
				if (item) {
					item.rename();
				}
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
		e.preventDefault();
		this.showFileListContextMenu();
	}

	protected onBeforeRenameFile(item: Editor.TreeViewItem, rename: HTMLInputElement): void {
		var value = rename.value;
		rename.selectionEnd = value.lastIndexOf(".");
	}

	protected onRenameFile(item: Editor.TreeViewItem, value: string): void {
		var fileList = this.fileList;
		if (value == null) {
			fileList.focus();
			return;
		}
		var tag = item.tag as FileItemTag;
		var oldPath = tag.path;
		var basePath = LocalFile.dirname(oldPath);
		var newPath = LocalFile.join(basePath, value);
		if (LocalFile.exists(newPath)) {
			fileList.focus();
			return;
		}
		LocalFile.rename(oldPath, newPath);
		tag.path = newPath;
		this.updateFileList();
		if (LocalFile.isFolder(newPath)) {
			this.openFolder();
		}
		fileList.focus();
	}

	protected onSelectFolderMenu = (item: Electron.MenuItem): void => {
		var path = this.getSelectedFolderPath();
		if (path == null) {
			path = process.cwd();
		}
		path = LocalFile.resolve(path);

		switch (item.id) {
			case "Show in Explorer":
				if (LocalFile.exists(path) === false) {
					break;
				}
				Electron.shell.openItem(path);
				break;
			case "Reveal in Finder":
				console.log("Reveal in Finder", path);
				if (LocalFile.exists(path) === false) {
					break;
				}
				Electron.shell.openItem(path);
				break;
			case "Create/Folder":
				var name = this.getNewFileName(path, "New Folder");
				if (name != null) {
					path = LocalFile.join(path, name);
					LocalFile.createFolder(path);
					this.openFolder();
					this.updateFileList();
					this.$nextTick(() => {
						this.renameFileListItem(path);
					});
				}
				break;
			case "Create/JavaScript":
				var name = this.getNewFileName(path, "New Script.js");
				if (name != null) {
					path = LocalFile.join(path, name);
					LocalFile.writeText(path, ScriptTemplate);
					this.updateFileList();
					this.$nextTick(() => {
						this.renameFileListItem(path);
					});
				}
				break;
			case "Delete":
				this.selectParentFolder();
				//LocalFile.removeFolder(path);
				Electron.shell.moveItemToTrash(path);
				this.openFolder();
				break;
			case "Rename":
				var folderList = this.folderList;
				var folderItem = folderList.selectedItem;
				if (folderItem) {
					folderItem.rename();
				}
				break;
			case "Copy Path":
				Electron.clipboard.writeText(path);
				break;
			case "Refresh":
				this.openFolder();
				break;
		}
	}

	protected onSelectFileMenu = (item: Electron.MenuItem): void => {
		var path = this.getSelectedFilePath();
		var filePath = path;
		if (path == null) {
			path = this.getSelectedFolderPath();
		}
		if (path == null) {
			return;
		}
		path = LocalFile.resolve(path);

		switch (item.id) {
			case "Create/Folder":
				if (filePath != null) {
					path = LocalFile.dirname(path);
				}
				var name = this.getNewFileName(path, "New Folder");
				if (name != null) {
					path = LocalFile.join(path, name);
					LocalFile.createFolder(path);
					this.openFolder();
					this.updateFileList();
					this.$nextTick(() => {
						this.renameFileListItem(path);
					});
				}
				break;
			case "Create/JavaScript":
				if (filePath != null) {
					path = LocalFile.dirname(path);
				}
				var name = this.getNewFileName(path, "New Script.js");
				if (name != null) {
					path = LocalFile.join(path, name);
					LocalFile.writeText(path, ScriptTemplate);
					this.updateFileList();
					this.$nextTick(() => {
						this.renameFileListItem(path);
					});
				}
				break;
			case "Show in Explorer":
				if (LocalFile.exists(path) === false) {
					break;
				}
				Electron.shell.showItemInFolder(path);
				break;
			case "Reveal in Finder":
				if (LocalFile.exists(path) === false) {
					break;
				}
				Electron.shell.showItemInFolder(path);
				break;
			case "Open":
				if (LocalFile.isFolder(path)) {
					this.openFile(path);
					break;
				}
				Electron.shell.openItem(path);
				console.log("Open", path);
				break;
			case "Delete":
				if (LocalFile.isFolder(path)) {
					//LocalFile.removeFolder(path);
					Electron.shell.moveItemToTrash(path);
					this.openFolder();
				} else {
					//LocalFile.removeFile(path);
					Electron.shell.moveItemToTrash(path);
				}
				this.updateFileList();
				break;
			case "Rename":
				var fileItem = this.getSelectedFileItem();
				if (fileItem) {
					fileItem.rename();
				}
				break;
			case "Copy Path":
				Electron.clipboard.writeText(path);
				break;
			case "Refresh":
				this.updateFileList();
				break;
			case "Convert":
				console.log("select convert")
				Tea.ObjReader.convertToMeshes(path, (meshes: Array<Tea.Mesh>) => {
					//console.log("convertToMeshes", meshes.length);
					if (meshes == null || meshes.length <= 0) {
						return;
					}
					var editor = this.$root as Editor;
					var app = editor.status.app;
					var scene = editor.status.scene;
					var object3d = new Tea.Object3D(app);
					object3d.name = LocalFile.basename(path);
					for (var i = 0; i < meshes.length; i++) {
						var mesh = meshes[i];
						var name = mesh.name;
						var child = this.createMeshObject(app, name, mesh);
						object3d.addChild(child);
					}
					var size = meshes[0].bounds.size;
					var scale = 1.0 / Math.max(size[0], size[1], size[2]);
					object3d.localScale.set(scale, scale, scale);
					scene.addChild(object3d);
					//console.log(mesh);
				});
				break;
		}
	}

	protected createMeshObject(app: Tea.App, name: string, mesh: Tea.Mesh): Tea.Object3D {
		var object3d = new Tea.Object3D(app);
		object3d.name = name;
		var shader = new Tea.Shader(app);
		shader.attach(
			Tea.ShaderSources.defaultVS,
			Tea.ShaderSources.defaultFS
		);
		var renderer = object3d.addComponent(Tea.MeshRenderer);
		//renderer.wireframe = true;
		renderer.material = Tea.Material.getDefault(app);
		renderer.material.shader = shader;
		var meshFilter = object3d.addComponent(Tea.MeshFilter);
		meshFilter.mesh = mesh;
		return object3d;
	}
}
