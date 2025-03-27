<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { computed, markRaw, useTemplateRef, watchEffect } from 'vue';

import { AuthenticationLogin, SliderCaptcha, z } from '@vben/common-ui';
import { useAppConfig } from '@vben/hooks';
import { $t } from '@vben/locales';
import { useTenantStore } from '@vben/stores';

import { getTenantByWebsite, getTenantIdByName } from '#/api';
import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const { tenantEnable, captchaEnable } = useAppConfig(
  import.meta.env,
  import.meta.env.PROD,
);

const authStore = useAuthStore();
const tenantStore = useTenantStore();

const loginRef =
  useTemplateRef<InstanceType<typeof AuthenticationLogin>>('loginRef');

const formSchema = computed((): VbenFormSchema[] => {
  const baseSchema = [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.tenantName'),
      },
      fieldName: 'tenantName',
      label: $t('authentication.tenantName'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.tenantNameTip') })
        .default(import.meta.env.VITE_APP_DEFAULT_TENANT_NAME),
      dependencies: {
        triggerFields: ['tenantName'],
        if: tenantEnable && !tenantStore.tenantId,
        trigger: (values) => {
          tenantStore.setTenantName(values.tenantName);
        },
      },
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.usernameTip') })
        .default(import.meta.env.VITE_APP_DEFAULT_USERNAME),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.passwordTip') })
        .default(import.meta.env.VITE_APP_DEFAULT_PASSWORD),
    },
  ];

  // 如果启用验证码，则添加验证码组件到表单中
  if (captchaEnable) {
    baseSchema.push({
      component: markRaw(SliderCaptcha),
      fieldName: 'captcha',
      rules: z.boolean().refine((value) => value, {
        message: $t('authentication.verifyRequiredTip'),
      }),
    });
  }

  return baseSchema;
});

/**
 * 处理登录
 */
async function handleLogin(values: any) {
  // 是否开启租户
  if (tenantEnable && !tenantStore.tenantId) {
    const tenantId = await getTenantIdByName(values.tenantName);
    if (tenantId) {
      tenantStore.setTenantId(tenantId);
    }
  }

  // 登录处理
  try {
    await authStore.authLogin(values);
  } catch (error) {
    console.error('Error in handleLogin:', error);
    // 登录失败时重置验证码
    loginRef.value
      ?.getFormApi()
      ?.getFieldComponentRef<InstanceType<typeof SliderCaptcha>>('captcha')
      ?.resume();
  }
}

watchEffect(async () => {
  if (tenantEnable) {
    const website = window.location.hostname;
    const tenant = await getTenantByWebsite(website);
    if (tenant) {
      tenantStore.setTenant({
        tenantId: tenant.id,
        tenantName: tenant.name,
      });
    }
  }
});
</script>

<template>
  <div>
    <AuthenticationLogin
      ref="loginRef"
      :form-schema="formSchema"
      :loading="authStore.loginLoading"
      @submit="handleLogin"
    />
  </div>
</template>
