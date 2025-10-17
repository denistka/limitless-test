import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/types'

export const usePresenceStore = defineStore('presence', () => {
  const activeUsers = ref<Profile[]>([])
  const presenceInterval = ref<NodeJS.Timeout | null>(null)
  const presenceSubscription = ref<any>(null)

  const updatePresence = async (userId: string, boardId: string) => {
    try {
      await supabase
        .from('user_presence')
        .upsert({
          user_id: userId,
          board_id: boardId,
          last_seen: new Date().toISOString(),
        })
    } catch (error) {
      console.error('Error updating presence:', error)
    }
  }

  const fetchActiveUsers = async (boardId: string) => {
    try {
      const { data } = await supabase
        .from('user_presence')
        .select(`
          profiles:user_id(full_name, email)
        `)
        .eq('board_id', boardId)
        .gte('last_seen', new Date(Date.now() - 60000).toISOString()) // Active in last minute

      if (data) {
        activeUsers.value = data
          .map(d => d.profiles)
          .filter(Boolean) as Profile[]
      }
    } catch (error) {
      console.error('Error fetching active users:', error)
    }
  }

  const initializePresence = (boardId: string, userId: string) => {
    // Update presence immediately
    updatePresence(userId, boardId)

    // Set up periodic presence updates
    presenceInterval.value = setInterval(() => {
      updatePresence(userId, boardId)
      fetchActiveUsers(boardId)
    }, 30000) // Update every 30 seconds

    // Fetch initial active users
    fetchActiveUsers(boardId)

    // Set up real-time subscription for presence changes
    presenceSubscription.value = supabase
      .channel('presence-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence',
          filter: `board_id=eq.${boardId}`,
        },
        () => {
          fetchActiveUsers(boardId)
        }
      )
      .subscribe()
  }

  const cleanup = async () => {
    if (presenceInterval.value) {
      clearInterval(presenceInterval.value)
      presenceInterval.value = null
    }

    if (presenceSubscription.value) {
      presenceSubscription.value.unsubscribe()
      presenceSubscription.value = null
    }

    // Clean up presence record
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('user_presence')
          .delete()
          .eq('user_id', user.id)
      }
    } catch (error) {
      console.error('Error cleaning up presence:', error)
    }

    activeUsers.value = []
  }

  return {
    activeUsers,
    initializePresence,
    cleanup
  }
})
