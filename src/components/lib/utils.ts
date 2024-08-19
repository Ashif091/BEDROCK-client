import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function mcn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
