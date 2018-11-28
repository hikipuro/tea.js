export module EditorAssets {
	export module Images {
		export const Transparent = "images/transparent.svg";
		export const PickerUp = "images/picker-up.svg";
		export const PickerDown = "images/picker-down.svg";
		export const ControlPoint = "images/control-point.svg";
		export const AnchorPoint = "images/anchor-point.svg";
		export const PlayButton = "images/play.svg";
		export const StopButton = "images/stop.svg";
		export const FolderOpen = "images/folder-open.svg";
		export const FolderClose = "images/folder-close.svg";
		export const FolderIcon = "images/folder.svg";
		export const HtmlIcon = "images/html.svg";
		export const JSIcon = "images/js.svg";
		export const JsonIcon = "images/json.svg";
	}

	export function cacheImages(): void {
		var images = EditorAssets.Images;
		var keys = Object.keys(images);
		keys.forEach((key: string) => {
			var url = images[key];
			var image = new Image();
			image.src = url;
		});
	}
}
