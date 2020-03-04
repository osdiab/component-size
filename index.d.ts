interface ComponentSize {
  width: number
  height: number
}

interface ComponentSizeOptions {
  ResizeObserver?: ResizeObserver;
}

export default function useComponentSize<T extends Element = Element>(ref: T, opts?: ComponentSizeOptions): ComponentSize
