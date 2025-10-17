<template>
  <div class="task-column">
    <n-card class="column-card limitless-card" :bordered="false">
      <template #header>
        <div class="column-header">
          <h3 class="column-title">{{ title }}</h3>
          <span class="task-count">({{ tasks.length }})</span>
          <n-button
            size="small"
            circle
            @click="toggleCreateMode"
            class="add-task-btn"
          >
            <template #icon>
              <n-icon>
                <Add v-if="!isCreating" />
                <Close v-else />
              </n-icon>
            </template>
          </n-button>
        </div>
      </template>

      <div class="column-content">
        <!-- Create Task Form -->
        <n-card v-if="isCreating" class="create-task-form" size="small">
          <n-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-placement="top"
            size="small"
          >
            <n-form-item label="Title" path="title">
              <n-input
                v-model:value="formData.title"
                placeholder="Task title"
                :disabled="loading"
              />
            </n-form-item>

            <n-form-item label="Description" path="description">
              <n-input
                v-model:value="formData.description"
                type="textarea"
                placeholder="Description (optional)"
                :disabled="loading"
                :rows="3"
              />
            </n-form-item>

            <div class="form-actions">
              <n-button
                type="primary"
                size="small"
                :loading="loading"
                @click="handleCreate"
                class="limitless-button"
              >
                Create
              </n-button>
              <n-button
                size="small"
                @click="cancelCreate"
                :disabled="loading"
              >
                Cancel
              </n-button>
            </div>
          </n-form>
        </n-card>

        <!-- Task Cards -->
        <div class="task-list" @dragover="handleDragOver" @drop="handleDrop">
          <TaskCard
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            @delete="handleDelete"
            @drag-start="handleDragStart"
          />

          <div v-if="tasks.length === 0 && !isCreating" class="empty-column">
            <p class="empty-text">No tasks yet</p>
            <n-button
              text
              type="primary"
              @click="toggleCreateMode"
              class="empty-action"
            >
              Add your first task
            </n-button>
          </div>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { NCard, NButton, NIcon, NForm, NFormItem, NInput, useMessage } from 'naive-ui'
import { Add, Close } from '@vicons/ionicons5'
import TaskCard from './TaskCard.vue'
import type { Task, TaskStatus } from '@/lib/types'

interface Props {
  title: string
  status: TaskStatus
  tasks: Task[]
}

interface Emits {
  (e: 'create-task', title: string, description: string, status: TaskStatus): void
  (e: 'delete-task', taskId: string): void
  (e: 'move-task', taskId: string, newStatus: TaskStatus): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const message = useMessage()
const formRef = ref()
const isCreating = ref(false)
const loading = ref(false)

const formData = reactive({
  title: '',
  description: ''
})

const rules = {
  title: [
    { required: true, message: 'Please enter a task title', trigger: 'blur' }
  ]
}

const toggleCreateMode = () => {
  isCreating.value = !isCreating.value
  if (!isCreating.value) {
    resetForm()
  }
}

const resetForm = () => {
  formData.title = ''
  formData.description = ''
}

const cancelCreate = () => {
  isCreating.value = false
  resetForm()
}

const handleCreate = async () => {
  try {
    await formRef.value?.validate()
    if (!formData.title.trim()) return

    loading.value = true
    emit('create-task', formData.title.trim(), formData.description.trim(), props.status)

    resetForm()
    isCreating.value = false
  } catch (error) {
    // Validation failed
  } finally {
    loading.value = false
  }
}

const handleDelete = (taskId: string) => {
  emit('delete-task', taskId)
}

const handleDragStart = (task: Task) => {
  // Store the dragged task for drop handling
  window.draggedTask = task
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  e.dataTransfer!.dropEffect = 'move'
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  const draggedTask = window.draggedTask as Task

  if (draggedTask && draggedTask.status !== props.status) {
    emit('move-task', draggedTask.id, props.status)
  }

  // Clean up
  window.draggedTask = null
}

// Extend window interface for drag and drop
declare global {
  interface Window {
    draggedTask: Task | null
  }
}
</script>

<style scoped>
.task-column {
  min-height: 500px;
}

.column-card {
  height: 100%;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.column-card:hover {
  transform: translateY(-2px);
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.column-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
}

.task-count {
  color: #666;
  font-size: 0.875rem;
  font-weight: 500;
}

.add-task-btn {
  background: var(--limitless-gradient);
  border: none;
  color: white;
}

.add-task-btn:hover {
  transform: scale(1.1);
}

.column-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.create-task-form {
  border: 2px dashed rgba(24, 160, 88, 0.3);
  background: rgba(24, 160, 88, 0.05);
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 200px;
}

.empty-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: #999;
}

.empty-text {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
}

.empty-action {
  font-size: 0.875rem;
}

:deep(.n-card-header) {
  padding: 1rem 1rem 0.75rem 1rem;
}

:deep(.n-card-content) {
  padding: 0.75rem 1rem 1rem 1rem;
}

:deep(.n-button.n-button--primary-type) {
  background: var(--limitless-gradient);
  border: none;
}

:deep(.n-button.n-button--primary-type:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(24, 160, 88, 0.3);
}

:deep(.n-input) {
  border-radius: 6px;
}

:deep(.n-card) {
  border-radius: 8px;
}

@media (max-width: 768px) {
  .column-header {
    flex-wrap: wrap;
  }

  .column-title {
    font-size: 1.1rem;
  }

  .column-content {
    max-height: calc(100vh - 150px);
  }
}
</style>
