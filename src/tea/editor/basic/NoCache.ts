import Vue, { ComponentOptions } from "vue";
import { createDecorator } from "vue-class-component";

export const NoCache = createDecorator((options: ComponentOptions<Vue>, key: string, index: number) => {
	(options.computed[key] as any).cache = false
});
