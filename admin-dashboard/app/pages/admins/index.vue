<script setup lang="ts">
import InviteAdminModal from '~/components/admins/InviteAdminModal.vue'
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const {
  admin: currentAdmin,
} = useAuth()

const {
  admins,
  loading,
  fetchAdmins,
  updateAdminStatus,
} = useAdmins()

const inviteOpen = ref(false)
const error = ref('')
const actionId = ref<string | null>(null)

const formatDate = (
  value: string | null,
) => {
  if (!value) {
    return 'Never'
  }

  return new Intl.DateTimeFormat(
    'en-IN',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    },
  ).format(
    new Date(value),
  )
}

const statusLabel = (
  status: string,
) => {
  if (status === 'active') {
    return 'Active'
  }

  if (status === 'invited') {
    return 'Invited'
  }

  return 'Disabled'
}

const changeStatus = async (
  member: typeof admins.value[number],
) => {
  if (
    member.id ===
    currentAdmin.value?.id
  ) {
    return
  }

  const enabling =
    !member.isActive

  const confirmed =
    window.confirm(
      enabling
        ? `Enable ${member.name}?`
        : `Disable ${member.name}?`,
    )

  if (!confirmed) {
    return
  }

  error.value = ''
  actionId.value = member.id

  try {
    await updateAdminStatus(
      member.id,
      enabling,
    )
  } catch (err: any) {
    error.value =
      err?.data?.message ||
      err?.message ||
      'Unable to update admin.'
  } finally {
    actionId.value = null
  }
}

onMounted(async () => {
  try {
    await fetchAdmins()
  } catch (err: any) {
    error.value =
      err?.data?.message ||
      err?.message ||
      'Unable to load administrators.'
  }
})
</script>

<template>
  <div class="page">
    <header class="page-header">
      <div>
        <p class="eyebrow">
          TEAM ACCESS
        </p>

        <h1>
          Admin Management
        </h1>

        <p class="subtitle">
          Manage who can access the
          Vedic Journey Travel Console.
        </p>
      </div>

      <button
        class="invite-button"
        @click="inviteOpen = true"
      >
        + Invite Admin
      </button>
    </header>

    <div
      v-if="error"
      class="error-box"
    >
      {{ error }}
    </div>

    <section class="card">
      <div class="card-header">
        <div>
          <h2>
            Administrators
          </h2>

          <p>
            {{ admins.length }}
            team member{{
              admins.length === 1
                ? ''
                : 's'
            }}
          </p>
        </div>
      </div>

      <div
        v-if="loading"
        class="state"
      >
        Loading administrators...
      </div>

      <div
        v-else-if="!admins.length"
        class="state"
      >
        No administrators found.
      </div>

      <div
        v-else
        class="table-wrap"
      >
        <table>
          <thead>
            <tr>
              <th>Administrator</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Joined</th>
              <th class="action-heading">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="member in admins"
              :key="member.id"
            >
              <td>
                <div class="admin-cell">
                  <div class="avatar">
                    {{
                      member.name
                        .charAt(0)
                        .toUpperCase()
                    }}
                  </div>

                  <div>
                    <div class="admin-name">
                      {{ member.name }}

                      <span
                        v-if="
                          member.id ===
                          currentAdmin?.id
                        "
                        class="you"
                      >
                        YOU
                      </span>
                    </div>

                    <div class="email">
                      {{ member.email }}
                    </div>
                  </div>
                </div>
              </td>

              <td>
                <span
                  class="status"
                  :class="member.status"
                >
                  <span class="dot" />

                  {{
                    statusLabel(
                      member.status,
                    )
                  }}
                </span>
              </td>

              <td class="date">
                {{
                  formatDate(
                    member.lastLoginAt,
                  )
                }}
              </td>

              <td class="date">
                {{
                  formatDate(
                    member.createdAt,
                  )
                }}
              </td>

              <td class="action-cell">
                <span
                  v-if="
                    member.id ===
                    currentAdmin?.id
                  "
                  class="current-label"
                >
                  Current account
                </span>

                <span
                  v-else-if="
                    member.status ===
                    'invited'
                  "
                  class="pending-label"
                >
                  Awaiting setup
                </span>

                <button
                  v-else
                  class="status-button"
                  :class="{
                    danger:
                      member.isActive,
                  }"
                  :disabled="
                    actionId ===
                    member.id
                  "
                  @click="
                    changeStatus(member)
                  "
                >
                  {{
                    actionId ===
                    member.id
                      ? 'Updating...'
                      : member.isActive
                        ? 'Disable'
                        : 'Enable'
                  }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <InviteAdminModal
      :open="inviteOpen"
      @close="inviteOpen = false"
    />
  </div>
</template>

<style scoped>
.page {
  padding: 38px 42px 60px;
}

.page-header {
  margin-bottom: 30px;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 30px;
}

.eyebrow {
  margin: 0 0 8px;

  color: var(--brand-dark);

  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

h1 {
  margin: 0;

  color: var(--text);

  font-size: 42px;
  line-height: 1.1;
  letter-spacing: -0.035em;
}

.subtitle {
  margin: 12px 0 0;

  color: var(--muted);

  font-size: 15px;
  line-height: 1.6;
}

.invite-button {
  min-height: 48px;
  padding: 0 20px;

  border: 0;
  border-radius: 11px;

  background: var(--brand-gradient);

  color: #fff;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  box-shadow:
    0 8px 25px
    rgba(216, 11, 185, 0.17);
}

.card {
  overflow: hidden;

  border: 1px solid var(--border);
  border-radius: var(--radius-lg);

  background: var(--surface);

  box-shadow: var(--shadow);
}

.card-header {
  padding: 23px 25px;

  border-bottom:
    1px solid var(--border);
}

.card-header h2 {
  margin: 0;

  color: var(--text);

  font-size: 19px;
}

.card-header p {
  margin: 6px 0 0;

  color: var(--muted);

  font-size: 14px;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;

  border-collapse: collapse;
}

th {
  padding: 14px 20px;

  background: var(--surface-soft);

  color: var(--muted);

  font-size: 12px;
  font-weight: 750;
  letter-spacing: 0.05em;

  text-align: left;
}

td {
  padding: 18px 20px;

  border-top:
    1px solid var(--border);

  color: var(--text);

  font-size: 14px;
}

tbody tr:first-child td {
  border-top: 0;
}

.admin-cell {
  min-width: 260px;

  display: flex;
  align-items: center;
  gap: 13px;
}

.avatar {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;

  display: grid;
  place-items: center;

  border-radius: 12px;

  background:
    linear-gradient(
      135deg,
      rgba(236, 18, 199, 0.12),
      rgba(101, 16, 112, 0.1)
    );

  color: var(--brand-dark);

  font-size: 16px;
  font-weight: 800;
}

.admin-name {
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 15px;
  font-weight: 700;
}

.email {
  margin-top: 4px;

  color: var(--muted);

  font-size: 13px;
}

.you {
  padding: 3px 6px;

  border-radius: 5px;

  background:
    rgba(216, 11, 185, 0.08);

  color: var(--brand-dark);

  font-size: 11px;
  font-weight: 800;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding: 6px 9px;

  border-radius: 999px;

  font-size: 13px;
  font-weight: 700;
}

.dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: currentColor;
}

.status.active {
  background:
    rgba(50, 132, 98, 0.09);

  color: var(--success);
}

.status.invited {
  background:
    rgba(168, 119, 50, 0.1);

  color: var(--warning);
}

.status.disabled {
  background:
    rgba(185, 74, 85, 0.08);

  color: var(--danger);
}

.date {
  min-width: 150px;

  color: var(--muted);
}

.action-heading,
.action-cell {
  text-align: right;
}

.status-button {
  min-height: 38px;
  padding: 0 13px;

  border:
    1px solid var(--border);
  border-radius: 8px;

  background: #fff;

  color: var(--success);

  font-size: 13px;
  font-weight: 700;

  cursor: pointer;
}

.status-button.danger {
  color: var(--danger);
}

.status-button:disabled {
  opacity: 0.5;
}

.current-label,
.pending-label {
  color: var(--muted);

  font-size: 13px;
  font-weight: 600;
}

.pending-label {
  color: var(--warning);
}

.state {
  padding: 50px 25px;

  color: var(--muted);

  font-size: 15px;
  text-align: center;
}

.error-box {
  margin-bottom: 20px;

  padding: 13px 15px;

  border-radius: 10px;

  background:
    rgba(185, 74, 85, 0.07);

  color: var(--danger);

  font-size: 14px;
}

@media (max-width: 900px) {
  .page {
    padding: 30px 24px;
  }

  h1 {
    font-size: 34px;
  }

  .page-header {
    flex-direction: column;
  }
}
</style>