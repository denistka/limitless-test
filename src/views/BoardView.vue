<template>
  <div class="board-container">
    <div class="board-header">
      <div class="board-title">
        <h1 class="limitless-gradient">Task Planning Board</h1>
        <p class="board-subtitle">Collaborate in real-time with your team</p>
      </div>

      <div class="board-actions">
        <PresenceIndicator :users="activeUsers" />
        <n-button
          type="primary"
          ghost
          @click="handleSignOut"
          class="sign-out-btn"
        >
        <template #icon>
          <n-icon><LogOut /></n-icon>
        </template>
          Sign Out
        </n-button>
      </div>
    </div>

    <div class="board-content" v-if="!loading">
      <div class="columns-container">
        <TaskColumn
          title="To Do"
          status="todo"
          :tasks="todoTasks"
          @create-task="handleCreateTask"
          @delete-task="handleDeleteTask"
          @move-task="handleMoveTask"
        />

        <TaskColumn
          title="In Progress"
          status="in_progress"
          :tasks="inProgressTasks"
          @create-task="handleCreateTask"
          @delete-task="handleDeleteTask"
          @move-task="handleMoveTask"
        />

        <TaskColumn
          title="Done"
          status="done"
          :tasks="doneTasks"
          @create-task="handleCreateTask"
          @delete-task="handleDeleteTask"
          @move-task="handleMoveTask"
        />
      </div>
    </div>

    <div v-else class="loading-container">
      <n-spin size="large" />
      <p class="loading-text">Loading your task board...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { LogOut } from '@vicons/ionicons5'
import { useAuthStore } from '@/stores/auth'
import { useTasksStore } from '@/stores/tasks'
import { usePresenceStore } from '@/stores/presence'
import { supabase } from '@/lib/supabase'
import TaskColumn from '@/components/TaskColumn.vue'
import PresenceIndicator from '@/components/PresenceIndicator.vue'
import type { TaskStatus } from '@/lib/types'

const router = useRouter()
const message = useMessage()
const authStore = useAuthStore()
const tasksStore = useTasksStore()
const presenceStore = usePresenceStore()

const loading = ref(true)
const boardId = ref<string | null>(null)
const subscription = ref<any>(null)

const todoTasks = computed(() => tasksStore.getTasksByStatus('todo'))
const inProgressTasks = computed(() => tasksStore.getTasksByStatus('in_progress'))
const doneTasks = computed(() => tasksStore.getTasksByStatus('done'))
const activeUsers = computed(() => presenceStore.activeUsers)

const initializeBoard = async () => {
  if (!authStore.user) {
    router.push('/auth')
    return
  }

  try {
    // Get or create a default board
    boardId.value = await getOrCreateBoard()

    if (boardId.value) {
      // Fetch tasks
      await tasksStore.fetchTasks(boardId.value)

      // Subscribe to real-time updates
      subscription.value = tasksStore.subscribeToTasks(boardId.value)

      // Initialize presence
      presenceStore.initializePresence(boardId.value, authStore.user.id)
    }
  } catch (error: any) {
    message.error('Failed to initialize board: ' + error.message)
  } finally {
    loading.value = false
  }
}

const getOrCreateBoard = async () => {
  if (!authStore.user) return null

  try {
    // Try to get existing board
    const { data: existingBoard } = await supabase
      .from('boards')
      .select('id')
      .limit(1)
      .maybeSingle()

    if (existingBoard) {
      return existingBoard.id
    } else {
      // Create a default board for the user
      const { data: newBoard, error } = await supabase
        .from('boards')
        .insert({
          name: 'Limitless Task Board',
          description: 'Collaborative task management board',
          created_by: authStore.user.id,
        })
        .select('id')
        .single()

      if (error) {
        console.error('Error creating board:', error)
        return null
      }
      return newBoard.id
    }
  } catch (error) {
    console.error('Error getting/creating board:', error)
    return null
  }
}

const handleCreateTask = async (title: string, description: string, status: TaskStatus) => {
  if (!authStore.user || !boardId.value) return

  try {
    await tasksStore.createTask({
      title,
      description,
      status,
      board_id: boardId.value,
      created_by: authStore.user.id
    })
    message.success('Task created successfully')
  } catch (error: any) {
    message.error('Failed to create task: ' + error.message)
  }
}

const handleDeleteTask = async (taskId: string) => {
  try {
    await tasksStore.deleteTask(taskId)
    message.success('Task deleted successfully')
  } catch (error: any) {
    message.error('Failed to delete task: ' + error.message)
  }
}

const handleMoveTask = async (taskId: string, newStatus: TaskStatus) => {
  try {
    await tasksStore.moveTask(taskId, newStatus)
  } catch (error: any) {
    message.error('Failed to move task: ' + error.message)
  }
}

const handleSignOut = async () => {
  try {
    await authStore.signOut()
    router.push('/auth')
  } catch (error: any) {
    message.error('Failed to sign out: ' + error.message)
  }
}

onMounted(() => {
  initializeBoard()
})

onUnmounted(() => {
  if (subscription.value) {
    subscription.value.unsubscribe()
  }
  presenceStore.cleanup()
  tasksStore.clearTasks()
})
</script>

<style scoped>
.board-container {
  min-height: 100vh;
  background: var(--limitless-bg);
  padding: 2rem;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.board-title h1 {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  background: var(--limitless-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.board-subtitle {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}

.board-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sign-out-btn {
  border: 1px solid rgba(24, 160, 88, 0.2);
  color: var(--limitless-primary);
}

.sign-out-btn:hover {
  background: rgba(24, 160, 88, 0.1);
  border-color: var(--limitless-primary);
}

.board-content {
  max-width: 1400px;
  margin: 0 auto;
}

.columns-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  align-items: start;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
}

.loading-text {
  color: #666;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .board-container {
    padding: 1rem;
  }

  .board-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .columns-container {
    grid-template-columns: 1fr;
  }

  .board-title h1 {
    font-size: 2rem;
  }
}
</style>
