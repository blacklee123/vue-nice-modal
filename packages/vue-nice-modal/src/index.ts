import type { ComponentPublicInstance, Component, AppContext } from 'vue';
import { h, createApp, getCurrentInstance } from 'vue';

import { extend, inBrowser, noop } from './utils';
import { useModalState } from './use-modal-state';
import type {
  INiceModalHandlers,
  ComponentProps,
  ExtractOptions,
  InferPayloadType,
  Simplify,
  RemoveReadonly,
} from './types';
export type { INiceModalHandlers } from './types';

function createVueInstance(
  ModalComponent: Component,
  modalProps: Record<string, unknown>,
  parentAppContext: AppContext | undefined
) {
  const App = {
    setup() {
      const { state, toggle } = useModalState(modalProps);
      return () =>
        h(ModalComponent, {
          ...state,
          'onUpdate:visible': toggle,
        });
    },
  };

  const app = createApp(App);
  parentAppContext && Object.assign(app._context, parentAppContext);

  const root = document.createElement('div');
  const container = document.createElement('div');
  root.className = 'vue-nice-modal-root';
  root.appendChild(container);
  document.body.appendChild(root);

  return {
    instance: app.mount(container),
    destroyVueInstance() {
      app.unmount();
      document.body.removeChild(root);
    },
  };
}

export function create<C extends Component>(ModalComponent: C) {
  // 重新设置一遍provides，好像没有什么效果
  const parentAppContext = getCurrentInstance()?.appContext;
  if (parentAppContext) {
    const currentProvides = (getCurrentInstance() as any)?.provides;
    Reflect.set(parentAppContext, 'provides', {
      ...parentAppContext.provides,
      ...currentProvides,
    });
  }

  let vueInstance: ComponentPublicInstance<{}, any> | null = null;
  let remove = noop;
  let hide = noop;

  type Options = Simplify<RemoveReadonly<ExtractOptions<ComponentProps<C>>>>;

  const show = (
    modalProps: Options
  ): Promise<Simplify<InferPayloadType<ComponentProps<C>>>> => {
    if (!inBrowser) return Promise.reject();

    return new Promise((_resolve, _reject) => {
      const handler: INiceModalHandlers = {
        callback: (action: 'confirm' | 'cancel', payload) => {
          action === 'confirm' ? _resolve(payload) : _reject(payload);
        },
        resolve: (payload) => {
          _resolve(payload);
        },
        reject: (payload) => {
          _reject(payload);
        },
        remove: () => remove(),
        hide: () => hide(),
      };

      const _modalProps = { ...modalProps, ...handler };

      if (!vueInstance) {
        const { instance, destroyVueInstance } = createVueInstance(
          ModalComponent,
          _modalProps,
          parentAppContext
        );
        vueInstance = instance;
        remove = () => {
          vueInstance = null;
          destroyVueInstance();
        };
        hide = () => {
          if (vueInstance) {
            vueInstance.toggle(false);
          }
        };
        vueInstance.open();
      } else {
        vueInstance.open(extend({}, _modalProps));
      }
    });
  };

  return {
    show,
    hide: () => hide(),
    remove: () => remove(),
  };
}
