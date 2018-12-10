import { LocalFile } from "./LocalFile";

export class FileType {
	static readonly Extensions = {
		// Documents
		TXT:  "Text document",
		HTML: "HTML document",
		CSS:  "CSS document",
		JSON:  "JSON document",
		MD:   "Markdown document",

		// Scripts
		JS:   "JavaScript",
		TS:   "TypeScript",

		// Images
		JPG:  "JPEG image",
		JPEG: "JPEG image",
		PNG:  "PNG image",
		GIF:  "GIF image",
		BMP:  "BMP image",
		SVG:  "SVG image",

		// 3D Assets
		OBJ:  "Geometry Definition File Format",
		MTL:  "OBJ material file",
		DAE:  "Digital Asset Exchange",
		FBX:  "FBX file",

		// Audio
		MP3:  "MP3 audio",

		// Archives
		ZIP:  "ZIP archive"
	};

	static getFileTypeString(path: string): string {
		if (path == null || path === "") {
			return "";
		}
		var ext = LocalFile.extname(path);
		if (ext.indexOf(".") === 0) {
			ext = ext.substr(1);
		}
		ext = ext.toUpperCase();
		if (FileType.Extensions[ext]) {
			return FileType.Extensions[ext];
		}
		return ext;
	}
}
