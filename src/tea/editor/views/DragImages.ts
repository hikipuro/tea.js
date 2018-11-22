import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div
			ref="images"
			class="DragImages">
		</div>
	`
})
export class DragImages extends Vue {
	clear(): void {
		var images = this.$refs.images as HTMLElement;
		while (images.firstChild) {
			images.removeChild(images.firstChild);
		}
	}

	addDragImage(text: string): HTMLElement {
		var images = this.$refs.images as HTMLElement;
		var image = this.createDragImage(text);
		images.appendChild(image);
		return image;
	}

	protected createDragImage(text: string): HTMLElement {
		var dragImage = document.createElement("div");
		var imageText = document.createElement("div");
		dragImage.classList.add("dragImage");
		imageText.innerText = text;
		dragImage.appendChild(imageText);
		return dragImage;
	}
}
