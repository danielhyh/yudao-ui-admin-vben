import { requestClient } from '#/api/request';

export interface NoticeVO {
  id: number;
  title: string;
  type: number;
  content: string;
  status: number;
  remark: string;
  creator: string;
  createTime: Date;
}

// 查询岗位列表
export function getNoticePage(params: any) {
  return requestClient.get('/system/notice/page', { params });
}

// 获取岗位精简信息列表
export function getSimpleNoticeList() {
  return requestClient.get('/system/notice/simple-list');
}

// 查询岗位详情
export function getNotice(id: number) {
  return requestClient.get(`/system/notice/get?id=${id}`);
}

// 新增岗位
export function createNotice(data: NoticeVO) {
  return requestClient.post('/system/notice/create', data);
}

// 修改岗位
export function updateNotice(data: NoticeVO) {
  return requestClient.put('/system/notice/update', data);
}

// 删除岗位
export function deleteNotice(id: number) {
  return requestClient.delete(`/system/notice/delete?id=${id}`);
}

// 导出岗位
export function exportNotice(params: any) {
  return requestClient.download('/system/notice/export', params);
}
