import { reactive } from 'vue';

import { extend } from './utils';
import { useExpose } from './use-expose';

export function useModalState(initOptions: Record<string, unknown>) {
  const state = reactive<{
    visible: boolean;
    [key: string]: any;
  }>({
    visible: false,
    ...initOptions,
  });

  const toggle = (visible: boolean) => {
    state.visible = visible;
  };

  const open = (props?: Record<string, any>) => {
    props && extend(state, props);
    toggle(true);
  };

  useExpose({ open, toggle });

  return {
    open,
    state,
    toggle,
  };
}
