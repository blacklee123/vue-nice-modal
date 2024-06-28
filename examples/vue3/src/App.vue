<script setup lang="ts">
import * as MyDialog from './MyDialog';
import { Button } from 'vant';
import { ref } from 'vue';

const result = ref<number>();

function getRandomIntInRange(min: number, max: number): number {
  // Math.random() 生成一个0到1之间的随机数
  // 乘以 (max - min + 1) 将范围扩大到0到(max - min + 1)之间
  // Math.floor 则用于去除小数部分，提升整数部分
  // 加上 min 将范围平移到 [min, max] 之间
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const showDialog = async () => {
  try {
    result.value = await MyDialog.show({
      title: 'My Dialog Title',
      content: 'My Dialog Content' + getRandomIntInRange(1, 100),
    });
  } catch (error) {
    console.log('reject', error);
  }
};
</script>

<template>
  <div class="demo">
    <Button @click="showDialog">Show Dialog</Button>
    <p>result:{{ result || '-' }}</p>
  </div>
</template>

<style scoped>
.demo {
  margin-top: 72px;
  margin-left: 120px;
}
</style>
