import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)

  const isAuthenticated = computed(() => !!user.value)

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { data, error } = await auth.signUp(email, password, fullName)
    if (error) throw error
    return data
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await auth.signIn(email, password)
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await auth.signOut()
    if (error) throw error
    user.value = null
  }

  const initializeAuth = () => {
    auth.onAuthStateChange((event, session) => {
      user.value = session?.user ?? null
      loading.value = false
    })
  }

  const getCurrentUser = async () => {
    const currentUser = await auth.getCurrentUser()
    user.value = currentUser
    loading.value = false
    return currentUser
  }

  return {
    user,
    loading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    initializeAuth,
    getCurrentUser
  }
})
