<template>
  <n-config-provider :theme="theme">
    <n-global-style />
    <n-message-provider>
      <n-notification-provider>
        <n-dialog-provider>
          <n-loading-bar-provider>
            <router-view />
          </n-loading-bar-provider>
        </n-dialog-provider>
      </n-notification-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import {
  NConfigProvider,
  NGlobalStyle,
  NMessageProvider,
  NNotificationProvider,
  NDialogProvider,
  NLoadingBarProvider,
  type GlobalTheme
} from 'naive-ui'

const theme = inject<GlobalTheme>('theme')

// Global styles for Limitless CNC branding
const globalStyles = `
  body {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .limitless-gradient {
    background: linear-gradient(135deg, #18a058 0%, #2080f0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .limitless-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(24, 160, 88, 0.1);
    transition: all 0.3s ease;
  }

  .limitless-card:hover {
    border-color: rgba(24, 160, 88, 0.2);
    box-shadow: 0 8px 32px rgba(24, 160, 88, 0.1);
  }

  .limitless-button {
    background: linear-gradient(135deg, #18a058 0%, #2080f0 100%);
    border: none;
    transition: all 0.3s ease;
  }

  .limitless-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(24, 160, 88, 0.3);
  }
`
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --limitless-primary: #18a058;
  --limitless-secondary: #2080f0;
  --limitless-gradient: linear-gradient(135deg, #18a058 0%, #2080f0 100%);
  --limitless-bg: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

body {
  background: var(--limitless-bg);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 0;
}

.limitless-gradient {
  background: var(--limitless-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.limitless-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(24, 160, 88, 0.1);
  transition: all 0.3s ease;
}

.limitless-card:hover {
  border-color: rgba(24, 160, 88, 0.2);
  box-shadow: 0 8px 32px rgba(24, 160, 88, 0.1);
}

.limitless-button {
  background: var(--limitless-gradient);
  border: none;
  transition: all 0.3s ease;
}

.limitless-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(24, 160, 88, 0.3);
}
</style>
