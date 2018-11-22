import Vue from "vue";
import Component from "vue-class-component";
import { NoCache } from "./NoCache";
import { TreeView } from "./TreeView";

@Component({
	template: `
		<li>
			<div
				class="container"
				:class="{ selected: isSelected }">
				<div
					class="item"
					ref="item"
					:style="{ paddingLeft: itemIndent }"
					:title="model.title"
					:draggable="draggable"
					@click.stop="onClick"
					@dblclick.stop="onDoubleClick"
					@contextmenu="onContextMenu">
					<div
						class="folder"
						:style="{ minWidth: iconMinWidth }"
						@click.stop="toggle"
						v-html="folderIcon">
					</div>
					<div
						class="text"
						v-if="!isRenaming">{{ model.text }}</div>
					<input
						ref="rename"
						type="text"
						v-if="isRenaming"
						:value="model.text"
						@keydown="onKeyDownRename"
						@mousedown="onMouseDownRename">
				</div>
			</div>
			<ul v-show="isOpen" v-if="isFolder">
				<TreeViewItem
					v-for="(model, index) in model.children"
					ref="items"
					:key="index"
					:model="model"
					:depth="depth + 1"
					@create="onCreate"
					@select="onSelect"
					@doubleClick="$emit('doubleClick', $event)">
				</TreeViewItem>
			</ul>
		</li>
	`,
	props: {
		model: {
			type: Object,
			default: null
		},
		depth: {
			type: Number,
			default: 0
		}
	},
	data: () => {
		return {
			isOpen: false,
			isSelected: false,
			isRenaming: false,
			title: null,
			openIcon: "📂",
			closeIcon: "📁",
			draggable: false,
			indent: "1.3em"
		}
	},
	components: {
		TreeViewItem: TreeViewItem
	}
})
export class TreeViewItem extends Vue {
	model: TreeView.Model;
	depth: number;
	isOpen: boolean;
	isSelected: boolean;
	isRenaming: boolean;
	title: string;
	openIcon: string;
	closeIcon: string;
	draggable: boolean;
	indent: string;
	dragEvents: TreeView.DragEvents;

	@NoCache
	get text(): string {
		return this.model.text;
	}

	@NoCache
	get tag(): any {
		return this.model.tag;
	}

	@NoCache
	get isFolder(): boolean {
		return this.model.isFolder;
	}

	@NoCache
	get index(): number {
		var parent = this.$parent as TreeViewItem | TreeView;
		var items = parent.getItemComponents();
		return items.indexOf(this);
	}

	@NoCache
	get folderIcon(): string {
		if (this.isFolder === false) {
			if (this.model.icon) {
				return this.model.icon;
			}
			return "";
		}
		if (this.isOpen) {
			return this.openIcon;
		}
		return this.closeIcon;
	}

	@NoCache
	get parent(): TreeViewItem {
		var parent = this.$parent as TreeViewItem;
		if (parent instanceof TreeViewItem) {
			return parent;
		}
		return null;
	}

	@NoCache
	get firstChild(): TreeViewItem {
		return this.getItemComponents()[0];
	}

	@NoCache
	get lastChild(): TreeViewItem {
		var items = this.getItemComponents();
		var length = items.length;
		return items[length - 1];
	}

	@NoCache
	get nextSibling(): TreeViewItem {
		var parent = this.$parent as TreeViewItem | TreeView;
		var items = parent.getItemComponents();
		var index = items.indexOf(this);
		return items[index + 1];
	}

	@NoCache
	get prevSibling(): TreeViewItem {
		var parent = this.$parent as TreeViewItem | TreeView;
		var items = parent.getItemComponents();
		var index = items.indexOf(this);
		return items[index - 1];
	}

	protected get itemIndent(): string {
		var indent = this.indent;
		if (this.model.indent) {
			indent = this.model.indent;
		}
		return "calc(" + indent + " * " + this.depth + ")";
	}

	protected get iconMinWidth(): string {
		if (this.model.indent) {
			return this.model.indent;
		}
		return this.indent;
	}

	getItemComponents(): Array<TreeViewItem> {
		var items = this.$refs.items as Array<TreeViewItem>;
		if (items == null) {
			return [];
		}
		return items;
	}

	expand(): void {
		if (this.isFolder === false) {
			return;
		}
		if (this.isOpen) {
			return;
		}
		this.isOpen = true;
		var parent = this.findTreeView();
		parent.$emit("expand", this);
	}

	collapse(): void {
		if (this.isFolder === false) {
			return;
		}
		if (this.isOpen === false) {
			return;
		}
		this.isOpen = false;
		var treeView = this.findTreeView();
		if (treeView != null) {
			var selectedItem = treeView.selectedItem;
			if (selectedItem != null) {
				this.forEachChild((item: TreeViewItem): boolean => {
					if (selectedItem === item) {
						treeView.unselect();
						return true;
					}
					return false;
				});
			}
		}
		var parent = this.findTreeView();
		parent.$emit("collapse", this);
	}

	toggle(): void {
		if (this.isFolder === false) {
			return;
		}
		if (this.isOpen) {
			this.collapse();
		} else {
			this.expand();
		}
	}

	select(value: boolean = true): void {
		this.isSelected = value;
	}

	rename(): void {
		this.isRenaming = true;
		this.$nextTick(() => {
			var rename = this.$refs.rename as HTMLInputElement;
			rename.select();
			document.addEventListener(
				"mousedown", this.onMouseDownScreen
			);
			this.$emit("before-rename", this, rename);
		});
	}

	findTreeView(): TreeView {
		var treeView = this.$parent;
		var length = TreeView.maxDepth;
		for (var i = 0; i < length; i++) {
			if (treeView == null) {
				return null;
			}
			if (treeView instanceof TreeView) {
				return treeView;
			}
			treeView = treeView.$parent;
		}
		return null;
	}

	protected created(): void {
		if (this.dragEvents == null) {
			this.dragEvents = new TreeView.DragEvents();
		}
		this.$emit("create", this);
	}

	protected mounted(): void {
		if (this.draggable) {
			var item = this.$refs.item as HTMLElement;
			item.addEventListener("drag", this.onDrag);
			item.addEventListener("dragstart", this.onDragStart);
			item.addEventListener("dragend", this.onDragEnd);
			item.addEventListener("dragenter", this.onDragEnter);
			item.addEventListener("dragleave", this.onDragLeave);
			item.addEventListener("dragover", this.onDragOver);
			item.addEventListener("drop", this.onDrop);
		}
		var isOpen = this.model.isOpen;
		if (isOpen != null) {
			if (isOpen === true) {
				this.expand();
			} else {
				this.collapse();
			}
		}
	}

	protected updated(): void {
		var isOpen = this.model.isOpen;
		if (isOpen != null) {
			if (isOpen === true) {
				this.expand();
			} else {
				this.collapse();
			}
		}
	}

	protected beforeDestroy(): void {
		if (this.draggable) {
			var item = this.$refs.item as HTMLElement;
			item.removeEventListener("drag", this.onDrag);
			item.removeEventListener("dragstart", this.onDragStart);
			item.removeEventListener("dragend", this.onDragEnd);
			item.removeEventListener("dragenter", this.onDragEnter);
			item.removeEventListener("dragleave", this.onDragLeave);
			item.removeEventListener("dragover", this.onDragOver);
			item.removeEventListener("drop", this.onDrop);
		}
	}

	protected forEachChild(callback: (item: TreeViewItem) => boolean) {
		var forEach = (item: TreeViewItem): boolean => {
			if ((item instanceof TreeViewItem) === false) {
				return false;
			}
			var result = callback(item);
			if (result) {
				return true;
			}
			item.getItemComponents().some((item: TreeViewItem) => {
				return forEach(item);
			});
			return false;
		};
		this.getItemComponents().some((item: TreeViewItem) => {
			return forEach(item);
		});
	}

	protected emitRenameEvent(): void {
		var rename = this.$refs.rename as HTMLInputElement;
		var value = rename.value;
		if (value == null || value === "") {
			return;
		}
		if (value === this.model.text) {
			return;
		}
		this.$emit("rename", this, value);
	}

	protected onClick(): void {
		this.$emit("select", this);
	}

	protected onDoubleClick(): void {
		this.$emit("doubleClick", this);
	}

	protected onContextMenu(): void {
		this.$emit("select", this);
	}

	protected onCreate(item: TreeViewItem): void {
		if (this.openIcon != null) {
			item.openIcon = this.openIcon;
		}
		if (this.closeIcon != null) {
			item.closeIcon = this.closeIcon;
		}
		item.draggable = this.draggable;
		if (this.draggable) {
			item.dragEvents = this.dragEvents;
		}
	}

	protected onSelect(item: TreeViewItem): void {
		this.$emit("select", item);
	}

	protected onKeyDownRename(e: KeyboardEvent): void {
		if (e.key === "Enter") {
			this.isRenaming = false;
			document.removeEventListener(
				"mousedown", this.onMouseDownScreen
			);
			this.emitRenameEvent();
		}
	}

	protected onMouseDownRename(e: MouseEvent): void {
		e.stopPropagation();
	}

	protected onMouseDownScreen(e: MouseEvent): void {
		this.isRenaming = false;
		document.removeEventListener(
			"mousedown", this.onMouseDownScreen
		);
		this.emitRenameEvent();
	}

	protected onDrag(e: DragEvent): void {
		if (this.dragEvents.drag) {
			this.dragEvents.drag(e, this);
		}
	}

	protected onDragStart(e: DragEvent): void {
		if (this.isRenaming) {
			e.preventDefault();
			return;
		}
		if (this.dragEvents.dragStart) {
			this.dragEvents.dragStart(e, this);
		}
	}

	protected onDragEnd(e: DragEvent): void {
		if (this.dragEvents.dragEnd) {
			this.dragEvents.dragEnd(e, this);
		}
	}

	protected onDragEnter(e: DragEvent): void {
		if (this.dragEvents.dragEnter) {
			this.dragEvents.dragEnter(e, this);
		}
	}

	protected onDragLeave(e: DragEvent): void {
		if (this.dragEvents.dragLeave) {
			this.dragEvents.dragLeave(e, this);
		}
	}

	protected onDragOver(e: DragEvent): void {
		if (this.dragEvents.dragOver) {
			this.dragEvents.dragOver(e, this);
		}
	}

	protected onDrop(e: DragEvent): void {
		if (this.dragEvents.drop) {
			this.dragEvents.drop(e, this);
		}
	}
}
