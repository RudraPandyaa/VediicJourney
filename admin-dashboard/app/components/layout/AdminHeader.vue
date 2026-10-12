<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { admin, logout } = useAuth()

const loggingOut = ref(false)

const handleLogout = async () => {
  loggingOut.value = true

  try {
    await logout()
  } finally {
    loggingOut.value = false
  }
}

const initials = computed(() => {
  if (!admin.value?.name) {
    return 'A'
  }

  return admin.value.name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})
</script>

<template>
  <header class="header">
    <div>
      <p class="context">
        VEDIC JOURNEY
      </p>

      <p class="context-subtitle">
        Luxury Travel Management
      </p>
    </div>

    <div class="header-right">
      <div class="admin">
        <div class="avatar">
          {{ initials }}
        </div>

        <div class="admin-details">
          <strong>
            {{ admin?.name || 'Administrator' }}
          </strong>

          <span>
            {{ admin?.email }}
          </span>
        </div>
      </div>

      <button
        class="logout"
        :disabled="loggingOut"
        @click="handleLogout"
      >
        {{
          loggingOut
            ? 'Signing out...'
            : 'Logout'
        }}
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  min-height: 82px;
  padding: 0 36px;
  border-bottom: 1px solid var(--border);
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.92);
}

.admin-header {
  min-height: 82px;
  padding: 0 34px;
}

.header-eyebrow {
  font-size: 10px;
  letter-spacing: 0.17em;
}

.header-subtitle {
  margin-top: 4px;
  font-size: 11px;
}

.context {
  margin: 0;
  color: var(--brand-dark);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.context-subtitle {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 12px;
}

.header-right,
.admin {
  display: flex;
  align-items: center;
}

.header-right {
  gap: 20px;
}

.admin {
  gap: 11px;
}

.admin-avatar {
  width: 42px;
  height: 42px;
  font-size: 11px;
}

.admin-name {
  font-size: 12px;
  font-weight: 650;
}

.admin-email {
  margin-top: 3px;
  font-size: 9px;
}

.avatar {
  display: grid;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  place-items: center;
  background: var(--brand-gradient);
  color: white;
  font-size: 11px;
  font-weight: 700;
}

.logout-button {
  min-height: 38px;
  padding: 0 16px;
  border-radius: 9px;
  font-size: 10px;
}

.admin-details strong,
.admin-details span {
  display: block;
}

.admin-details strong {
  color: var(--text);
  font-size: 12px;
}

.admin-details span {
  margin-top: 3px;
  color: var(--muted);
  font-size: 10px;
}

.logout {
  padding: 9px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: white;
  color: var(--text);
  font-size: 11px;
  font-weight: 600;
}

.logout:hover {
  border-color: #d8c4d4;
  color: var(--brand-dark);
}
</style>