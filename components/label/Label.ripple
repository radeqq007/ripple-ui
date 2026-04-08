import { cn } from "@/lib/utils";
import type { Children } from 'ripple';

interface Props {
	children: Children;
	[key: string]: any;
}

export component Label(&{ children, class: className, ...props }: Props) {
  <label
    data-slot="label"
    class={cn(
        "cn-label flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed",
        className
    )}
    {...props}
  >
		<children />
  </label>
}
