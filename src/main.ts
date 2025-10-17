import { createApp } from 'vue'
import { createPinia } from 'pinia'
import naive from 'naive-ui'
import { create } from 'naive-ui'

import App from './App.vue'
import router from './router'
import './assets/main.css'

// Limitless CNC theme colors
const limitlessTheme = create({
  common: {
    primaryColor: '#18a058', // Teal green from Limitless
    primaryColorHover: '#36ad6a',
    primaryColorPressed: '#0c7a43',
    primaryColorSuppl: '#36ad6a',

    // Secondary colors
    infoColor: '#2080f0', // Blue from Limitless
    infoColorHover: '#4098fc',
    infoColorPressed: '#1060c9',
    infoColorSuppl: '#4098fc',

    successColor: '#18a058',
    warningColor: '#f0a020',
    errorColor: '#d03050',

    // Background colors
    bodyColor: '#ffffff',
    baseColor: '#ffffff',
    cardColor: '#ffffff',
    modalColor: '#ffffff',
    popoverColor: '#ffffff',

    // Text colors
    textColor1: '#000000',
    textColor2: '#666666',
    textColor3: '#999999',
    textColorDisabled: '#cccccc',

    // Border colors
    borderColor: '#e0e0e6',
    borderColorHover: '#d0d0d6',
    borderColorPressed: '#c0c0c6',
    borderColorFocus: '#18a058',

    // Shadow
    boxShadow1: '0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    boxShadow2: '0 4px 8px 0 rgba(0, 0, 0, 0.08), 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    boxShadow3: '0 8px 16px 0 rgba(0, 0, 0, 0.12), 0 4px 8px 0 rgba(0, 0, 0, 0.08)',
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(naive)

// Apply custom theme
app.provide('theme', limitlessTheme)

app.mount('#app')
