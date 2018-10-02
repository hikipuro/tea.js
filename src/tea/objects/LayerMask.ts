export class LayerMask {
	static readonly layers: Array<string> = new Array(32);
	value: number;

	constructor(value: number) {
		this.value = Math.floor(value);
	}

	static getMask(...layerNames: string[]): number {
		var mask = 0;
		var length = layerNames.length;
		for (var i = 0; i < length; i++) {
			var layer = this.nameToLayer(layerNames[i]);
			if (layer < 0) {
				continue;
			}
			layer = 1 << layer;
			mask |= layer;
		}
		return mask;
	}

	static layerToName(layer: number): string {
		if (layer < 0 || layer > 31) {
			return "";
		}
		return LayerMask.layers[layer];
	}

	static nameToLayer(layerName: string): number {
		if (layerName == null || layerName === "") {
			return -1;
		}
		var layers = LayerMask.layers;
		var length = layers.length;
		for (var i = 0; i < length; i++) {
			if (layers[i] === layerName) {
				return i;
			}
		}
		return -1;
	}
}

LayerMask.layers.fill("");
