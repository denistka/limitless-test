<template>
  <div class="auth-container">
    <div class="auth-card limitless-card">
      <div class="auth-header">
        <h1 class="limitless-gradient">Limitless Task Board</h1>
        <p class="auth-subtitle">
          {{ isLogin ? 'Sign in to your account' : 'Create your account' }}
        </p>
      </div>

      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="top"
        size="large"
      >
        <n-form-item v-if="!isLogin" label="Full Name" path="fullName">
          <n-input
            v-model:value="formData.fullName"
            placeholder="John Doe"
            :disabled="loading"
          />
        </n-form-item>

        <n-form-item label="Email" path="email">
          <n-input
            v-model:value="formData.email"
            type="email"
            placeholder="you@example.com"
            :disabled="loading"
          />
        </n-form-item>

        <n-form-item label="Password" path="password">
          <n-input
            v-model:value="formData.password"
            type="password"
            placeholder="••••••••"
            :disabled="loading"
          />
        </n-form-item>

        <n-button
          type="primary"
          size="large"
          block
          :loading="loading"
          class="limitless-button"
          @click="handleSubmit"
        >
          {{ isLogin ? 'Sign In' : 'Sign Up' }}
        </n-button>
      </n-form>

      <div class="auth-footer">
        <n-button
          text
          type="primary"
          :disabled="loading"
          @click="toggleMode"
        >
          {{ isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in" }}
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const message = useMessage()
const authStore = useAuthStore()

const isLogin = ref(true)
const loading = ref(false)
const formRef = ref()

const formData = reactive({
  email: '',
  password: '',
  fullName: ''
})

const rules = {
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please enter your password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ],
  fullName: [
    { required: !isLogin.value, message: 'Please enter your full name', trigger: 'blur' }
  ]
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  // Update validation rules for fullName
  rules.fullName[0].required = !isLogin.value
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true

    if (isLogin.value) {
      await authStore.signIn(formData.email, formData.password)
      message.success('Welcome back!')
      router.push('/board')
    } else {
      await authStore.signUp(formData.email, formData.password, formData.fullName)
      message.success('Account created! You can now sign in.')
      isLogin.value = true
    }
  } catch (error: any) {
    message.error(error.message || 'An error occurred')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: var(--limitless-bg);
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  background: var(--limitless-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.auth-subtitle {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
}

:deep(.n-button.n-button--primary-type) {
  background: var(--limitless-gradient);
  border: none;
  height: 48px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.n-button.n-button--primary-type:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(24, 160, 88, 0.3);
}

:deep(.n-input) {
  border-radius: 8px;
}

:deep(.n-form-item-label) {
  font-weight: 500;
  color: #333;
}
</style>
