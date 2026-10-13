<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="open && enquiry"
        class="drawer-shell"
      >
        <div
          class="backdrop"
          @click="$emit('close')"
        />

        <aside class="drawer">
          <header>
            <div>
              <span class="eyebrow">
                {{ formatLabel(enquiry.type) }}
                ENQUIRY
              </span>

              <h2>{{ enquiry.name }}</h2>

              <p>
                Received
                {{ formatDateTime(enquiry.createdAt) }}
              </p>
            </div>

            <button
              class="close"
              @click="$emit('close')"
            >
              ×
            </button>
          </header>

          <div class="drawer-body">
            <!-- STATUS -->
            <section class="panel">
              <div class="section-title">
                <h3>Enquiry Status</h3>
                <p>
                  Track this request through
                  your sales process.
                </p>
              </div>

              <div class="field">
                <label>Status</label>

                <select v-model="form.status">
                  <option value="new">
                    New
                  </option>

                  <option value="contacted">
                    Contacted
                  </option>

                  <option value="in_progress">
                    In Progress
                  </option>

                  <option value="converted">
                    Converted
                  </option>

                  <option value="closed">
                    Closed
                  </option>
                </select>
              </div>
            </section>

            <!-- CONTACT -->
            <section class="panel">
              <div class="section-title">
                <h3>Traveller</h3>
                <p>
                  Contact information supplied
                  with the enquiry.
                </p>
              </div>

              <div class="info-grid">
                <InfoItem
                  label="Name"
                  :value="enquiry.name"
                />

                <InfoItem
                  label="Country"
                  :value="enquiry.country"
                />

                <InfoItem
                  label="Email"
                  :value="enquiry.email"
                />

                <InfoItem
                  label="Phone"
                  :value="enquiry.phone"
                />
              </div>
            </section>

            <!-- TRAVEL -->
            <section class="panel">
              <div class="section-title">
                <h3>Travel Requirements</h3>
              </div>

              <div class="info-grid">
                <InfoItem
                  label="Destination"
                  :value="enquiry.destination"
                />

                <InfoItem
                  label="Journey"
                  :value="journeyName"
                />

                <InfoItem
                  label="Travel Style"
                  :value="travelStyleName"
                />

                <InfoItem
                  label="Travel Date"
                  :value="
                    formatDate(
                      enquiry.travelDate,
                    )
                  "
                />

                <InfoItem
                  label="Duration"
                  :value="
                    enquiry.duration
                      ? `${enquiry.duration} days`
                      : undefined
                  "
                />

                <InfoItem
                  label="Travellers"
                  :value="
                    enquiry.travellers
                      ? String(
                          enquiry.travellers,
                        )
                      : undefined
                  "
                />
              </div>
            </section>

            <!-- FLIGHT -->
            <section
              v-if="
                enquiry.type === 'flight' ||
                hasFlightDetails
              "
              class="panel"
            >
              <div class="section-title">
                <h3>Flight Requirements</h3>
              </div>

              <div class="info-grid">
                <InfoItem
                  label="Departure City"
                  :value="
                    enquiry.departureCity
                  "
                />

                <InfoItem
                  label="Arrival City"
                  :value="
                    enquiry.arrivalCity
                  "
                />

                <InfoItem
                  label="Departure Date"
                  :value="
                    formatDate(
                      enquiry.departureDate,
                    )
                  "
                />

                <InfoItem
                  label="Return Date"
                  :value="
                    formatDate(
                      enquiry.returnDate,
                    )
                  "
                />

                <InfoItem
                  label="Travel Class"
                  :value="
                    enquiry.travelClass
                  "
                />

                <InfoItem
                  label="Passengers"
                  :value="
                    enquiry.passengers
                      ? String(
                          enquiry.passengers,
                        )
                      : undefined
                  "
                />
              </div>
            </section>

            <!-- MESSAGE -->
            <section
              v-if="enquiry.message"
              class="panel"
            >
              <div class="section-title">
                <h3>Traveller Message</h3>
              </div>

              <div class="message">
                {{ enquiry.message }}
              </div>
            </section>

            <!-- NOTES -->
            <section class="panel">
              <div class="section-title">
                <h3>Internal Notes</h3>

                <p>
                  Private notes visible only
                  inside the admin dashboard.
                </p>
              </div>

              <div class="field">
                <textarea
                  v-model="form.notes"
                  rows="8"
                  maxlength="10000"
                  placeholder="Add follow-up notes, call details or internal context..."
                />
              </div>
            </section>

            <p
              v-if="formError"
              class="form-error"
            >
              {{ formError }}
            </p>

            <section class="danger-zone">
              <div>
                <strong>Delete enquiry</strong>

                <span>
                  Permanently remove this enquiry.
                </span>
              </div>

              <button
                :disabled="
                  saving || deleting
                "
                @click="remove"
              >
                {{
                  deleting
                    ? 'Deleting...'
                    : 'Delete'
                }}
              </button>
            </section>
          </div>

          <footer>
            <button
              class="cancel"
              :disabled="saving"
              @click="$emit('close')"
            >
              Cancel
            </button>

            <button
              class="save"
              :disabled="saving"
              @click="save"
            >
              {{
                saving
                  ? 'Saving...'
                  : 'Save Changes'
              }}
            </button>
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type {
  Enquiry,
  EnquiryStatus,
} from '~/composables/useEnquiries'

const props = defineProps<{
  open: boolean
  enquiry?: Enquiry | null
}>()

const emit = defineEmits<{
  close: []
  updated: [enquiry: Enquiry]
  deleted: []
}>()

const {
  updateEnquiry,
  deleteEnquiry,
} = useEnquiries()

const saving = ref(false)
const deleting = ref(false)

const formError =
  ref<string | null>(null)

const form = reactive({
  status: 'new' as EnquiryStatus,
  notes: '',
})

const journeyName = computed(() => {
  const value =
    props.enquiry?.journey

  return value &&
    typeof value === 'object'
    ? value.title
    : undefined
})

const travelStyleName =
  computed(() => {
    const value =
      props.enquiry?.travelStyle

    return value &&
      typeof value === 'object'
      ? value.name
      : undefined
  })

const hasFlightDetails = computed(
  () => {
    const item = props.enquiry

    if (!item) return false

    return Boolean(
      item.departureCity ||
      item.arrivalCity ||
      item.departureDate ||
      item.returnDate ||
      item.travelClass ||
      item.passengers,
    )
  },
)

watch(
  () => props.enquiry,
  value => {
    if (!value) return

    form.status = value.status
    form.notes = value.notes || ''
    formError.value = null
  },
  {
    immediate: true,
  },
)

const save = async () => {
  if (
    !props.enquiry ||
    saving.value
  ) {
    return
  }

  saving.value = true
  formError.value = null

  try {
    const updated =
      await updateEnquiry(
        props.enquiry._id,
        {
          status: form.status,
          notes: form.notes,
        },
      )

    emit('updated', updated)
  } catch (err: any) {
    formError.value =
      err?.data?.message ||
      'Unable to update enquiry.'
  } finally {
    saving.value = false
  }
}

const remove = async () => {
  if (
    !props.enquiry ||
    deleting.value
  ) {
    return
  }

  const confirmed =
    window.confirm(
      `Permanently delete the enquiry from "${props.enquiry.name}"?`,
    )

  if (!confirmed) return

  deleting.value = true
  formError.value = null

  try {
    await deleteEnquiry(
      props.enquiry._id,
    )

    emit('deleted')
  } catch (err: any) {
    formError.value =
      err?.data?.message ||
      'Unable to delete enquiry.'
  } finally {
    deleting.value = false
  }
}

const formatLabel = (
  value: string,
) => {
  return value
    .replace(/_/g, ' ')
    .replace(
      /\b\w/g,
      char => char.toUpperCase(),
    )
}

const formatDate = (
  value?: string,
) => {
  if (!value) return '—'

  return new Intl.DateTimeFormat(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  ).format(new Date(value))
}

const formatDateTime = (
  value?: string,
) => {
  if (!value) return '—'

  return new Intl.DateTimeFormat(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(new Date(value))
}
</script>

<script lang="ts">
import {
  defineComponent,
  h,
} from 'vue'

export const InfoItem =
  defineComponent({
    props: {
      label: {
        type: String,
        required: true,
      },

      value: {
        type: [
          String,
          Number,
        ],
        default: undefined,
      },
    },

    setup(props) {
      return () =>
        h(
          'div',
          {
            class: 'info-item',
          },
          [
            h(
              'span',
              props.label,
            ),

            h(
              'strong',
              props.value ||
                '—',
            ),
          ],
        )
    },
  })
</script>

<style scoped>
.drawer-shell {
  position: fixed;
  z-index: 10000;
  inset: 0;
}

.backdrop {
  position: absolute;
  inset: 0;
  background: rgba(13, 11, 14, .58);
  backdrop-filter: blur(5px);
}

.drawer {
  position: absolute;
  top: 0;
  right: 0;
  width: min(700px, 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f6f7;
  box-shadow:
    -25px 0 70px rgba(12, 6, 11, .18);
}

/* HEADER */

header {
  padding: 25px 26px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid var(--border);
  background: #fff;
}

.eyebrow {
  display: block;
  color: var(--brand-dark);
  font-size: 12px;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: .12em;
}

header h2 {
  margin: 8px 0 0;
  color: var(--text);
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -.02em;
}

header p {
  margin: 7px 0 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.45;
}

.close {
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 9px;
  display: grid;
  place-items: center;
  background: #fff;
  color: #70666e;
  font-size: 23px;
  line-height: 1;
  cursor: pointer;
  transition:
    background .18s ease,
    border-color .18s ease;
}

.close:hover {
  border-color: #d9cdd6;
  background: #faf7f9;
}

/* BODY */

.drawer-body {
  min-height: 0;
  padding: 19px;
  overflow-y: auto;
}

/* PANELS */

.panel {
  margin-bottom: 14px;
  padding: 21px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 6px 20px rgba(35, 15, 32, .025);
}

.section-title {
  margin-bottom: 17px;
}

.section-title h3 {
  margin: 0;
  color: #373136;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.35;
}

.section-title p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.5;
}

/* FORM */

.field label {
  margin-bottom: 8px;
  display: block;
  color: #514950;
  font-size: 14px;
  font-weight: 700;
}

.field select,
.field textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--border);
  border-radius: 9px;
  outline: none;
  background: #fff;
  color: var(--text);
  font: inherit;
  font-size: 14px;
  transition:
    border-color .2s ease,
    box-shadow .2s ease;
}

.field select {
  height: 46px;
  padding: 0 12px;
  cursor: pointer;
}

.field textarea {
  min-height: 150px;
  padding: 12px 13px;
  line-height: 1.65;
  resize: vertical;
}

.field select:focus,
.field textarea:focus {
  border-color: rgba(216, 11, 185, .4);
  box-shadow: 0 0 0 4px rgba(216, 11, 185, .05);
}

.field textarea::placeholder {
  color: #aaa1a8;
}

/* INFO GRID */

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 11px;
}

:deep(.info-item) {
  min-height: 68px;
  padding: 13px;
  box-sizing: border-box;
  border: 1px solid #f0eaee;
  border-radius: 9px;
  background: #faf8f9;
}

:deep(.info-item span) {
  display: block;
  color: #81767e;
  font-size: 11px;
  font-weight: 800;
  line-height: 1.3;
  text-transform: uppercase;
  letter-spacing: .06em;
}

:deep(.info-item strong) {
  margin-top: 7px;
  display: block;
  overflow-wrap: anywhere;
  color: #40383e;
  font-size: 14px;
  font-weight: 650;
  line-height: 1.45;
}

/* TRAVELLER MESSAGE */

.message {
  padding: 16px;
  border: 1px solid #f0eaee;
  border-radius: 10px;
  background: #faf8f9;
  color: #514950;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-wrap;
}

/* ERROR */

.form-error {
  margin: 0 0 14px;
  padding: 11px 13px;
  border: 1px solid #f0dadd;
  border-radius: 8px;
  background: #fff7f8;
  color: var(--danger);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.45;
}

/* DANGER ZONE */

.danger-zone {
  padding: 17px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border: 1px solid #f0dadd;
  border-radius: 13px;
  background: #fff8f8;
}

.danger-zone strong,
.danger-zone span {
  display: block;
}

.danger-zone strong {
  color: #9e3f49;
  font-size: 14px;
  font-weight: 750;
}

.danger-zone span {
  margin-top: 5px;
  color: #946f74;
  font-size: 12px;
  line-height: 1.4;
}

.danger-zone button {
  min-height: 39px;
  padding: 0 14px;
  border: 1px solid #e5bdc2;
  border-radius: 8px;
  background: #fff;
  color: #b94a55;
  font: inherit;
  font-size: 13px;
  font-weight: 750;
  cursor: pointer;
}

.danger-zone button:hover:not(:disabled) {
  background: #fff2f3;
}

.danger-zone button:disabled {
  opacity: .55;
  cursor: default;
}

/* FOOTER */

footer {
  padding: 16px 22px;
  display: flex;
  justify-content: flex-end;
  gap: 9px;
  border-top: 1px solid var(--border);
  background: #fff;
}

footer button {
  min-height: 43px;
  padding: 0 17px;
  border-radius: 9px;
  font: inherit;
  font-size: 13px;
  font-weight: 750;
  cursor: pointer;
}

footer button:disabled {
  opacity: .55;
  cursor: default;
}

.cancel {
  border: 1px solid var(--border);
  background: #fff;
  color: #5d545b;
}

.cancel:hover:not(:disabled) {
  background: #faf7f9;
}

.save {
  border: 0;
  background: var(--brand-gradient);
  color: #fff;
  box-shadow:
    0 7px 18px rgba(162, 14, 172, .15);
}

/* ANIMATION */

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity .2s ease;
}

.drawer-enter-active .drawer,
.drawer-leave-active .drawer {
  transition: transform .24s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .drawer,
.drawer-leave-to .drawer {
  transform: translateX(100%);
}

/* RESPONSIVE */

@media (max-width: 600px) {
  header {
    padding: 20px;
  }

  header h2 {
    font-size: 24px;
  }

  .drawer-body {
    padding: 13px;
  }

  .panel {
    padding: 17px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .danger-zone {
    align-items: stretch;
    flex-direction: column;
  }

  .danger-zone button {
    width: 100%;
  }

  footer {
    padding: 13px;
  }

  footer button {
    flex: 1;
  }
}
</style>