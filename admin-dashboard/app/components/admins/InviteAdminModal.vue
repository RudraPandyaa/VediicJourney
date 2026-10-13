<script setup lang="ts">
const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  invited: []
}>()

const {
  inviteAdmin,
} = useAdmins()

const name = ref('')
const email = ref('')

const submitting = ref(false)
const error = ref('')

watch(
  () => props.open,
  (open) => {
    if (open) {
      name.value = ''
      email.value = ''
      error.value = ''
    }
  },
)

const submit = async () => {
  error.value = ''

  if (
    !name.value.trim() ||
    !email.value.trim()
  ) {
    error.value =
      'Name and email are required.'
    return
  }

  submitting.value = true

  try {
    await inviteAdmin(
      name.value.trim(),
      email.value.trim(),
    )

    emit('invited')
    emit('close')
  } catch (err: any) {
    error.value =
      err?.data?.message ||
      err?.message ||
      'Unable to send invitation.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="overlay"
      @click.self="emit('close')"
    >
      <div class="modal">
        <div class="modal-header">
          <div>
            <p class="eyebrow">
              TEAM ACCESS
            </p>

            <h2>
              Invite Admin
            </h2>
          </div>

          <button
            class="close-button"
            type="button"
            @click="emit('close')"
          >
            ×
          </button>
        </div>

        <p class="description">
          Send an invitation to a new Vedic
          Journey administrator. They will
          create their own password.
        </p>

        <form
          @submit.prevent="submit"
        >
          <div class="field">
            <label>
              Name
            </label>

            <input
              v-model="name"
              type="text"
              placeholder="Admin name"
              autocomplete="name"
            >
          </div>

          <div class="field">
            <label>
              Email Address
            </label>

            <input
              v-model="email"
              type="email"
              placeholder="admin@example.com"
              autocomplete="email"
            >
          </div>

          <div
            v-if="error"
            class="error"
          >
            {{ error }}
          </div>

          <div class="actions">
            <button
              type="button"
              class="secondary-button"
              :disabled="submitting"
              @click="emit('close')"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="primary-button"
              :disabled="submitting"
            >
              {{
                submitting
                  ? 'Sending...'
                  : 'Send Invite'
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  z-index: 1000;
  inset: 0;

  padding: 24px;

  display: grid;
  place-items: center;

  background: rgba(13, 11, 14, 0.58);
  backdrop-filter: blur(5px);
}

.modal {
  width: 100%;
  max-width: 520px;

  padding: 30px;

  border-radius: 20px;

  background: #fff;

  box-shadow:
    0 30px 80px
    rgba(20, 10, 18, 0.2);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.eyebrow {
  margin: 0 0 7px;

  color: var(--brand-dark);

  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.13em;
}

h2 {
  margin: 0;

  color: var(--text);

  font-size: 28px;
  line-height: 1.2;
}

.close-button {
  width: 38px;
  height: 38px;

  border: 1px solid var(--border);
  border-radius: 10px;

  background: var(--surface-soft);

  color: var(--text);

  font-size: 23px;
  cursor: pointer;
}

.description {
  margin: 15px 0 25px;

  color: var(--muted);

  font-size: 15px;
  line-height: 1.65;
}

.field {
  margin-bottom: 19px;
}

.field label {
  display: block;

  margin-bottom: 8px;

  color: var(--text);

  font-size: 14px;
  font-weight: 650;
}

.field input {
  width: 100%;
  height: 50px;

  box-sizing: border-box;
  padding: 0 14px;

  border: 1px solid var(--border);
  border-radius: 10px;

  outline: none;

  color: var(--text);

  font-size: 15px;
}

.field input:focus {
  border-color: var(--brand);

  box-shadow:
    0 0 0 3px
    rgba(216, 11, 185, 0.07);
}

.error {
  margin-bottom: 18px;

  padding: 12px 14px;

  border-radius: 9px;

  background:
    rgba(185, 74, 85, 0.08);

  color: var(--danger);

  font-size: 14px;
}

.actions {
  margin-top: 27px;

  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.secondary-button,
.primary-button {
  min-height: 46px;
  padding: 0 20px;

  border-radius: 10px;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;
}

.secondary-button {
  border: 1px solid var(--border);

  background: #fff;

  color: var(--text);
}

.primary-button {
  border: 0;

  background: var(--brand-gradient);

  color: #fff;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>