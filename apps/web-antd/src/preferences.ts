import { defineOverridesPreferences } from '@vben/preferences';

import { VBEN_DEFAULT_AVATAR_URL, VBEN_LOGO_URL } from './constants/vben';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    name: import.meta.env.VITE_APP_TITLE,
    /** 后端路由模式 */
    accessMode: 'backend',
    enableRefreshToken: true,
    defaultAvatar: VBEN_DEFAULT_AVATAR_URL,
  },
  footer: {
    enable: true,
    fixed: true,
  },
  copyright: {
    companyName: import.meta.env.VITE_APP_TITLE,
    companySiteLink: 'https://gitee.com/yudaocode/yudao-ui-admin-vben',
  },
  logo: {
    enable: true,
    source: VBEN_LOGO_URL,
  },
});
