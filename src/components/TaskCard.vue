<template>
  <n-card
    class="task-card limitless-card"
    :bordered="false"
    draggable
    @dragstart="handleDragStart"
    @click="toggleExpanded"
  >
    <div class="task-header">
      <h4 class="task-title">{{ task.title }}</h4>
      <n-button
        size="tiny"
        circle
        type="error"
        ghost
        @click.stop="handleDelete"
        class="delete-btn"
      >
        <template #icon>
          <n-icon><Trash /></n-icon>
        </template>
      </n-button>
    </div>

    <div v-if="task.description" class="task-description">
      <p>{{ task.description }}</p>
    </div>

    <div v-if="task.profiles" class="task-assignee">
      <n-avatar size="small" class="assignee-avatar">
        {{ getInitials(task.profiles.full_name, task.profiles.email) }}
      </n-avatar>
      <span class="assignee-name">
        {{ task.profiles.full_name || task.profiles.email }}
      </span>
    </div>

    <div class="task-footer">
      <div class="task-meta">
        <span class="task-status" :class="`status-${task.status}`">
          {{ formatStatus(task.status) }}
        </span>
        <span class="task-date">
          {{ formatDate(task.created_at) }}
        </span>
      </div>
    </div>

    <!-- Expanded content for comments and typing indicators -->
    <div v-if="isExpanded" class="task-expanded">
      <n-divider />

      <!-- Comments section -->
      <div class="comments-section">
        <h5 class="comments-title">Comments</h5>

        <!-- Comments list -->
        <div class="comments-list">
          <div v-if="comments.length === 0" class="no-comments">
            <p>No comments yet</p>
          </div>

          <div
            v-for="comment in comments"
            :key="comment.id"
            class="comment-item"
          >
            <div class="comment-header">
              <n-avatar size="small">{{ getInitials(comment.user.full_name, comment.user.email) }}</n-avatar>
              <div class="comment-meta">
                <span class="comment-author">{{ comment.user.full_name || comment.user.email }}</span>
                <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
              </div>
            </div>
            <div class="comment-content">
              <p>{{ comment.content }}</p>
            </div>
          </div>
        </div>

        <!-- Typing indicators -->
        <div v-if="typingUsers.length > 0" class="typing-indicators">
          <div
            v-for="user in typingUsers"
            :key="user.id"
            class="typing-indicator"
          >
            <n-avatar size="small" class="typing-avatar">
              {{ getInitials(user.full_name, user.email) }}
            </n-avatar>
            <span class="typing-text">
              {{ user.full_name || user.email }} is typing...
            </span>
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <!-- Comment input -->
        <div class="comment-input">
          <n-input
            v-model:value="newComment"
            type="textarea"
            placeholder="Add a comment..."
            :rows="2"
            @keydown="handleTyping"
            @input="handleCommentInput"
          />
          <div class="comment-actions">
            <n-button
              size="small"
              type="primary"
              :disabled="!newComment.trim()"
              @click="handleAddComment"
              class="limitless-button"
            >
              Comment
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NCard, NButton, NIcon, NAvatar, NDivider, NInput, useMessage } from 'naive-ui'
import { Trash } from '@vicons/ionicons5'
import type { Task } from '@/lib/types'

interface Props {
  task: Task
}

interface Emits {
  (e: 'delete', taskId: string): void
  (e: 'drag-start', task: Task): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const message = useMessage()
const isExpanded = ref(false)
const newComment = ref('')
const comments = ref<any[]>([]) // TODO: Add proper comment type
const typingUsers = ref<any[]>([]) // TODO: Add proper typing user type

const formatStatus = (status: string) => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getInitials = (name: string | null, email: string): string => {
  if (name) {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  return email[0].toUpperCase()
}

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const handleDelete = () => {
  emit('delete', props.task.id)
}

const handleDragStart = (e: DragEvent) => {
  emit('drag-start', props.task)
}

const handleCommentInput = () => {
  // TODO: Implement typing indicator logic
  // This would emit typing events to other users
}

const handleTyping = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleAddComment()
  }
}

const handleAddComment = () => {
  if (!newComment.value.trim()) return

  // TODO: Implement comment creation
  // This would create a comment in the database
  message.success('Comment added (demo)')
  newComment.value = ''
}
</script>

<style scoped>
.task-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin-bottom: 0.75rem;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.task-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
  line-height: 1.4;
}

.delete-btn {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.task-card:hover .delete-btn {
  opacity: 1;
}

.task-description {
  margin-bottom: 0.75rem;
}

.task-description p {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.task-assignee {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.assignee-avatar {
  background: var(--limitless-gradient);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
}

.assignee-name {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-meta {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.task-status {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
}

.status-todo {
  background: rgba(255, 193, 7, 0.1);
  color: #856404;
}

.status-in_progress {
  background: rgba(0, 123, 255, 0.1);
  color: #004085;
}

.status-done {
  background: rgba(40, 167, 69, 0.1);
  color: #155724;
}

.task-date {
  font-size: 0.75rem;
  color: #999;
}

.task-expanded {
  margin-top: 1rem;
}

.comments-section {
  padding-top: 1rem;
}

.comments-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 1rem 0;
}

.comments-list {
  margin-bottom: 1rem;
}

.no-comments {
  text-align: center;
  color: #999;
  padding: 1rem;
  font-style: italic;
}

.comment-item {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 6px;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.comment-meta {
  display: flex;
  flex-direction: column;
}

.comment-author {
  font-size: 0.75rem;
  font-weight: 600;
  color: #333;
}

.comment-date {
  font-size: 0.625rem;
  color: #999;
}

.comment-content p {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
  line-height: 1.4;
}

.typing-indicators {
  margin-bottom: 1rem;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(24, 160, 88, 0.05);
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.typing-avatar {
  background: var(--limitless-gradient);
  color: white;
  font-size: 0.75rem;
}

.typing-text {
  font-size: 0.75rem;
  color: #666;
  font-style: italic;
}

.typing-dots {
  display: flex;
  gap: 2px;
}

.typing-dots span {
  width: 4px;
  height: 4px;
  background: var(--limitless-primary);
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.comment-input {
  margin-top: 1rem;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

:deep(.n-card-content) {
  padding: 1rem;
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
</style>
