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

		// Audio
		MP3:  "MP3 audio",

		// Archives
		ZIP:  "ZIP archive"
	};

	static getFileTypeString(extension: string): string {
		if (extension.indexOf(".") === 0) {
			extension = extension.substr(1);
		}
		extension = extension.toUpperCase();
		if (FileType.Extensions[extension]) {
			return FileType.Extensions[extension];
		}
		return extension;
	}
}
