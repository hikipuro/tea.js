import Vue from "vue";
//import Vue from "vue/dist/vue.common";

//console.log("Vue", Vue);

export var Button = Vue.extend({
	data: () => {
		return {
			text: 'Hello Vue!'
		};
	},
	template: "<button>{{text}}</button>",
	/*
	set text(value: string) {
		console.log("***** TEST");
		this.$data.text = value;
	}
	*/
});
