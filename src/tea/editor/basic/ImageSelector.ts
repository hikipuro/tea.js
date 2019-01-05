import Vue from "vue";
import Component from "vue-class-component";
import { Editor } from "../Editor";
import { FileItemTag } from "../views/ProjectView";
import { LocalFile } from "../LocalFile";

@Component({
	template: `
		<div class="ImageSelector">
			<div class="title">
				<slot></slot>
			</div>
			<div
				ref="container"
				class="value"
				draggable="true"
				@dragstart="onDragStart"
				@dragenter="onDragEnter"
				@dragleave="onDragLeave"
				@dragover="onDragOver"
				@drop="onDrop">
				<img
					ref="image"
					:src="url">
				</img>
			</div>
		</div>
	`,
	data: () => {
		return {
			url: null
		}
	}
})
export class ImageSelector extends Vue {
	url: string;
	protected _isHovering: boolean = false;

	get image(): HTMLImageElement {
		return this.$refs.image as HTMLImageElement;
	}

	get imageContainer(): HTMLElement {
		return this.$refs.container as HTMLElement;
	}

	protected get editor(): Editor {
		return this.$root as Editor;
	}

	protected mounted(): void {
	}

	protected beforeDestroy(): void {
	}

	protected isSupportedFileType(path: string): boolean {
		var ext = LocalFile.extname(path);
		if (ext == null) {
			return false;
		}
		switch (ext) {
			case ".bmp":
			case ".jpg":
			case ".gif":
			case ".png":
			case ".svg":
				return true;
		}
		return false;
	}

	protected getFileItemTag(): FileItemTag {
		var item = this.editor.projectView.getDragSource();
		if (item == null) {
			return null;
		}
		if ((item.tag instanceof FileItemTag) === false) {
			return null;
		}
		return item.tag;
	}

	protected onDrag(e: DragEvent): void {
	}

	protected onDragStart(e: DragEvent): void {
		e.preventDefault();
	}

	protected onDragEnd(e: DragEvent): void {
	}

	protected onDragEnter(e: DragEvent): void {
		//console.log("onDragEnter", e.currentTarget)
		var tag = this.getFileItemTag();
		if (tag == null || tag.isFolder) {
			return;
		}
		if (this.isSupportedFileType(tag.path) === false) {
			return;
		}
		var el = e.currentTarget as HTMLElement;
		if (el !== this.imageContainer) {
			return;
		}
		this._isHovering = true;
		el.classList.add("dragEnter");
	}

	protected onDragLeave(e: DragEvent): void {
		//console.log("onDragLeave", e.currentTarget)
		var el = e.currentTarget as HTMLElement;
		if (el !== this.imageContainer) {
			return;
		}
		if (this._isHovering) {
			this._isHovering = false;
		} else {
			el.classList.remove("dragEnter");
		}
	}

	protected onDragOver(e: DragEvent): void {
		//console.log("onDragOver", e.currentTarget)
		var tag = this.getFileItemTag();
		if (tag == null || tag.isFolder) {
			return;
		}
		if (this.isSupportedFileType(tag.path) === false) {
			return;
		}
		var el = e.currentTarget as HTMLElement;
		if (el !== this.imageContainer) {
			return;
		}
		this._isHovering = false;
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	}

	protected onDrop(e: DragEvent): void {
		//console.log("onDrop");
		var tag = this.getFileItemTag();
		if (tag == null || tag.isFolder) {
			return;
		}
		var el = e.currentTarget as HTMLElement;
		if (el !== this.imageContainer) {
			return;
		}
		this._isHovering = false;
		el.classList.remove("dragEnter");
		var path = tag.path;
		this.url = path;
		this.$emit("update", path);
	}
}
