<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  exportNotice,
  getNoticePage,
  type NoticeVO,
} from '#/api/system/notice';
import { ActionButtons, IconEnum } from '#/components/action-buttons';

import { columns, formSchema } from './notice.data';
import NoticeForm from './notice-form.vue';

defineOptions({ name: 'SystemNotice' });

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: formSchema,
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};

const gridOptions: VxeGridProps<NoticeVO> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'id',
  },
  columns,
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getNoticePage({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
};

const [Grid, tableApi] = useVbenVxeGrid({ formOptions, gridOptions });

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: NoticeForm,
});

function handleCreate() {
  formModalApi.setData({});
  formModalApi.open();
}
async function handleEdit(id: number) {
  formModalApi.setData({ id });
  formModalApi.open();
}
// TODO
function handleDelete(id: number) {
  message.success(id);
}
// TODO
async function handleExport() {
  await exportNotice(tableApi.formApi.form.values);
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <ActionButtons
          :actions="[
            {
              type: 'primary',
              label: $t('page.action.add'),
              icon: IconEnum.ADD,
              auth: ['system:notice:create'],
              onClick: handleCreate.bind(null),
            },
            {
              label: $t('page.action.export'),
              icon: IconEnum.EXPORT,
              auth: ['system:notice:export'],
              onClick: handleExport.bind(null),
            },
          ]"
        />
      </template>
      <template #action="{ row }">
        <ActionButtons
          :actions="[
            {
              type: 'link',
              label: $t('page.action.edit'),
              icon: IconEnum.EDIT,
              auth: ['system:notice:update'],
              onClick: handleEdit.bind(null, row.id),
            },
            {
              popConfirm: {
                title: $t('page.action.delete'),
                icon: IconEnum.DELETE,
                confirm: handleDelete.bind(null, row.id),
              },
              type: 'link',
              danger: true,
              label: $t('page.action.delete'),
              auth: ['system:notice:delete'],
            },
          ]"
        />
      </template>
    </Grid>
    <FormModal @reload="tableApi.query()" />
  </Page>
</template>
