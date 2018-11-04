import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../Tea";
import { TreeView } from "./basic/TreeView";
import { Editor } from "./Editor";

@Component({
	template: `
		<div class="HierarchyView">
			<TreeView ref="hierarchy" tabindex="0"></TreeView>
		</div>
	`
})
export class HierarchyView extends Vue {
	getSelectedItem(): TreeView.Item {
		var treeView = this.$refs.hierarchy as TreeView;
		return treeView.selectedItem;
	}

	get items(): any {
		var treeView = this.$refs.hierarchy as TreeView;
		return treeView.items;
	}
	set items(value: any) {
		var treeView = this.$refs.hierarchy as TreeView;
		treeView.items = value;
	}

	focusTreeView(): void {
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

	protected mounted(): void {
		var treeView = this.$refs.hierarchy as TreeView;
		treeView.openIcon = "<img src='../images/folder-open.svg' />";
		treeView.closeIcon = "<img src='../images/folder-close.svg' />";
		treeView.draggable = true;

		var dragImages = (this.$root as Editor).dragImages;
		var dragSource: Tea.Editor.TreeViewItem = null;
		var dragEvents = treeView.dragEvents;
		dragEvents.dragStart = (e: DragEvent, item: Tea.Editor.TreeViewItem) => {
			//console.log("onDragStart");
			dragSource = item;
			e.dataTransfer.effectAllowed = "move";
			//e.dataTransfer.dropEffect = "move";

			var dragImage = this.createDragImage(item.model.text);
			while (dragImages.firstChild) {
				dragImages.removeChild(dragImages.firstChild);
			}
			dragImages.appendChild(dragImage);
			e.dataTransfer.setDragImage(dragImage, 0, 0);
		};
		dragEvents.dragEnd = (e: DragEvent, item: Tea.Editor.TreeViewItem) => {
			dragSource = null;
		};
		dragEvents.dragOver = (e: DragEvent, item: Tea.Editor.TreeViewItem) => {
			if (dragSource == null) {
				e.preventDefault();
				return;
			}
			e.preventDefault();
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
		};
		dragEvents.dragEnter = (e: DragEvent, item: Tea.Editor.TreeViewItem) => {
			//console.log("dragEnter", item.model.text);
			var el = e.currentTarget as HTMLElement;
			el.classList.add("dragEnter");
		};
		dragEvents.dragLeave = (e: DragEvent, item: Tea.Editor.TreeViewItem) => {
			//console.log("dragLeave", this, e);
			var el = e.currentTarget as HTMLElement;
			var text = el.querySelector(".text");
			el.classList.remove("dragEnter");
			text.classList.remove("dragOverTop");
			text.classList.remove("dragOverBottom");
		};
		dragEvents.drop = (e: DragEvent, item: Tea.Editor.TreeViewItem) => {
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
			if (dragSource == null) {
				this.$emit("dropFromProjectView", item);
				return;
			}
			var idSrc = dragSource.model.tag as number;
			var idDst = item.model.tag as number;
			dragSource = null;
			if (idSrc == null || idDst == null) {
				return;
			}
			if (idSrc == idDst) {
				return;
			}
			this.$emit("drop", mode, idSrc, idDst);
		};

		treeView.$on("menu", (e: MouseEvent) => {
			this.$emit("menu", e);
		});

		treeView.$on("select", (item: Tea.Editor.TreeViewItem) => {
			this.$emit("select", item);
		});
	}

	createDragImage(text: string): HTMLElement {
		var dragImage = document.createElement("div");
		var imageText = document.createElement("div");
		dragImage.classList.add("dragImage");
		imageText.innerText = text;
		dragImage.appendChild(imageText);
		return dragImage;
	}
}
