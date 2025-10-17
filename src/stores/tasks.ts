import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Task, TaskCreate, TaskUpdate, TaskStatus } from '@/lib/types'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)

  const fetchTasks = async (boardId: string) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          profiles!tasks_assigned_to_fkey(full_name, email)
        `)
        .eq('board_id', boardId)
        .order('position', { ascending: true })

      if (error) throw error
      tasks.value = data || []
    } catch (error) {
      console.error('Error fetching tasks:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const createTask = async (taskData: TaskCreate) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single()

      if (error) throw error

      // Add to local state
      tasks.value.push(data)
      return data
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  const updateTask = async (taskId: string, updates: TaskUpdate) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single()

      if (error) throw error

      // Update local state
      const index = tasks.value.findIndex(task => task.id === taskId)
      if (index !== -1) {
        tasks.value[index] = data
      }
      return data
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error

      // Remove from local state
      tasks.value = tasks.value.filter(task => task.id !== taskId)
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }

  const moveTask = async (taskId: string, newStatus: TaskStatus, newPosition?: number) => {
    try {
      const updates: TaskUpdate = { status: newStatus }
      if (newPosition !== undefined) {
        updates.position = newPosition
      }

      await updateTask(taskId, updates)
    } catch (error) {
      console.error('Error moving task:', error)
      throw error
    }
  }

  const subscribeToTasks = (boardId: string) => {
    return supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `board_id=eq.${boardId}`,
        },
        () => {
          fetchTasks(boardId)
        }
      )
      .subscribe()
  }

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.value.filter(task => task.status === status)
  }

  const clearTasks = () => {
    tasks.value = []
  }

  return {
    tasks,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    subscribeToTasks,
    getTasksByStatus,
    clearTasks
  }
})
