<script setup lang="ts">
import { ref } from 'vue';
import { Dialog } from 'vant';
import { INiceModalHandlers } from '@qaq-public/vue-nice-modal';
// inject hide/remove/callback methods by vue-nice-modal
interface IProps extends INiceModalHandlers<number> {
  visible: boolean;
  // props you need
  title: string;
  content: string;
}

interface IEmits {
  (e: 'update:visible', visible: boolean): void;
}

const props = defineProps<IProps>();

// @ts-ignore
const emit = defineEmits<IEmits>();

const loading = ref(false);

const handleCancel = () => {
  props.hide(); // or emit('update:visible', false)
  props.callback('cancel'); // reject the promise
};

function getRandomIntInRange(min: number, max: number): number {
  // Math.random() 生成一个0到1之间的随机数
  // 乘以 (max - min + 1) 将范围扩大到0到(max - min + 1)之间
  // Math.floor 则用于去除小数部分，提升整数部分
  // 加上 min 将范围平移到 [min, max] 之间
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const handleConfirm = async () => {
  // mock async function call
  const sleep = (ms: number): Promise<number> =>
    new Promise((res) =>
      setTimeout(() => {
        res(ms);
      }, ms)
    );

  loading.value = true;
  const payload = await sleep(getRandomIntInRange(1000, 2000));
  loading.value = false;

  // resolve the promise with payload
  props.callback('confirm', payload);
};
</script>

<template>
  <Dialog
    :show="visible"
    @update:show="(val) => $emit('update:visible', val)"
    @cancel="handleCancel"
    @confirm="handleConfirm"
    @closed="remove"
    :title="title"
    :content="content"
    show-cancel-button
    class="demo-dialog"
  >
    <span>{{ content }}</span>
    <!-- component registered at main app instance -->
    <van-icon name="chat-o" />
    <img src="https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg" />
  </Dialog>
</template>

<style scoped>
.demo-dialog img {
  box-sizing: border-box;
  width: 100%;
  padding: 25px 20px 0;
}
</style>
