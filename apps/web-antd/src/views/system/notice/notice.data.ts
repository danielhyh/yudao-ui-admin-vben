import type { VxeGridProps } from '#/adapter/vxe-table';

import { $t } from '@vben/locales';

import { type VbenFormSchema } from '#/adapter/form';
import { DICT_TYPE, getDictOptions } from '#/utils/dict';

export const formSchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'title',
    label: '公告标题',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
      placeholder: '请选择',
    },
    fieldName: 'status',
    label: '公告状态',
  },
];

export const columns: VxeGridProps['columns'] = [
  { title: '序号', type: 'seq', width: 50 },
  { field: 'id', title: '公告编号' },
  { field: 'title', title: '公告标题' },
  {
    field: 'type',
    title: '公告类型',
    cellRender: {
      name: 'CellDict',
      props: { type: DICT_TYPE.SYSTEM_NOTICE_TYPE },
    },
  },
  {
    field: 'status',
    title: '状态',
    cellRender: { name: 'CellDict', props: { type: DICT_TYPE.COMMON_STATUS } },
  },
  { field: 'createTime', formatter: 'formatDateTime', title: '创建时间' },
  {
    field: 'action',
    fixed: 'right',
    slots: { default: 'action' },
    title: $t('page.action.action'),
    width: 160,
  },
];

export const modalSchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'id',
    label: 'id',
    dependencies: {
      triggerFields: [''],
      show: () => false,
    },
  },
  {
    component: 'Input',
    fieldName: 'title',
    label: '公告标题',
    rules: 'required',
  },
  {
    component: 'Select',
    componentProps: {
      options: getDictOptions(DICT_TYPE.SYSTEM_NOTICE_TYPE, 'number'),
    },
    fieldName: 'type',
    label: '公告类型',
    rules: 'required',
  },
  {
    component: 'Select',
    componentProps: {
      options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
    },
    fieldName: 'status',
    label: '公告状态',
    rules: 'required',
  },
  {
    component: 'Textarea',
    fieldName: 'content',
    label: '内容',
  },
];
