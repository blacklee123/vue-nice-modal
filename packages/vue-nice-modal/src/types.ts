import type { Component, VNodeProps, AllowedComponentProps } from 'vue';

export type INiceModalHandlers<T = any> = {
  callback: (action: 'confirm' | 'cancel', payload?: T) => void;
  resolve: (payload?: T) => void;
  reject: (payload?: T) => void;
  remove: () => void;
  hide: () => void;
};

export type ComponentProps<C extends Component> = C extends new (
  ...args: any
) => any
  ? Omit<
      InstanceType<C>['$props'],
      keyof VNodeProps | keyof AllowedComponentProps
    >
  : never;

export type ExtractOptions<T extends Record<string, any>> = Omit<
  T,
  keyof INiceModalHandlers | 'visible' | 'onUpdate:visible'
>;

export type InferPayloadType<T extends {}> = T extends {
  readonly callback: (action: any, payload?: infer R) => void;
}
  ? R
  : unknown;

// 强制计算类型
export type Simplify<T> = T extends any ? { [P in keyof T]: T[P] } : never;

export type RemoveReadonly<T> = { -readonly [P in keyof T]: T[P] };
