<template>
  <div class="presence-indicator">
    <span class="presence-label">Active users:</span>
    <div class="presence-avatars">
      <n-avatar
        v-for="(user, index) in users"
        :key="index"
        :size="32"
        class="presence-avatar"
        :class="{ 'animate-pulse': true }"
      >
        {{ getInitials(user.full_name, user.email) }}
      </n-avatar>
      <div v-if="users.length === 0" class="no-users">
        <span class="no-users-text">No other users online</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NAvatar, NTooltip } from 'naive-ui'
import type { Profile } from '@/lib/types'

interface Props {
  users: Profile[]
}

defineProps<Props>()

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
</script>

<style scoped>
.presence-indicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.presence-label {
  font-size: 0.875rem;
  color: #666;
  white-space: nowrap;
}

.presence-avatars {
  display: flex;
  align-items: center;
  gap: -0.5rem; /* Overlap avatars slightly */
}

.presence-avatar {
  border: 2px solid white;
  background: var(--limitless-gradient);
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
  margin-left: -0.5rem;
  transition: all 0.3s ease;
}

.presence-avatar:first-child {
  margin-left: 0;
}

.presence-avatar:hover {
  transform: scale(1.1);
  z-index: 10;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.no-users {
  display: flex;
  align-items: center;
}

.no-users-text {
  font-size: 0.875rem;
  color: #999;
  font-style: italic;
}

@media (max-width: 768px) {
  .presence-indicator {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .presence-avatars {
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .presence-avatar {
    margin-left: 0;
  }
}
</style>
