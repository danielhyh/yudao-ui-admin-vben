<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { useVbenForm } from '#/adapter/form';
import { createNotice, getNotice, updateNotice } from '#/api/system/notice';

import { modalSchema } from './notice.data';

defineOptions({ name: 'NoticeModel' });

const emit = defineEmits(['reload']);

const isUpdate = ref(false);

const [Form, formApi] = useVbenForm({
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  schema: modalSchema,
  handleSubmit: onSubmit,
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  onCancel: async () => {
    modalApi.close();
    await formApi.resetForm();
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
  },
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { id } = modalApi.getData<Record<string, any>>();

      isUpdate.value = !isEmpty(id);
      if (id) {
        const values = await getNotice(id);
        formApi.setValues(values);
      }
      modalApi.setState({ title: isUpdate.value ? '编辑公告' : '新增公告' });
    }
  },
});

async function onSubmit(values: Record<string, any>) {
  await (isUpdate.value
    ? updateNotice(values as any)
    : createNotice(values as any));
  modalApi.close();
  await formApi.resetForm();
  emit('reload');
}
</script>
<template>
  <Modal class="w-1/3">
    <Form />
  </Modal>
</template>
