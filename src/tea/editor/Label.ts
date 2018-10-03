import Vue from "vue/dist/vue.common";

//console.log("Vue", Vue);

export class Label {
	vue: Vue;

	constructor() {
		var element = document.createElement("div");
		element.id = "app2";
		element.innerText = "{{ message }}";
		document.body.appendChild(element);
		setTimeout(() => {
			this.vue = new Vue({
				el: '#app2',
				data: {
					message: 'Hello Vue!'
				}
			})
		}, 1000);
	}

	set text(value: string) {
		this.vue.$data.message = "test";
	}
}
