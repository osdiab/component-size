interface ComponentSize {
  width: number
  height: number
}

interface ComponentSizeOptions {
  ResizeObserver?: ResizeObserver;
}

export default function useComponentSize<T = any>(ref: T | React.RefObject<T>, opts?: ComponentSizeOptions): ComponentSize
