<script setup lang="ts">
definePageMeta({
  layout: false,
})

const route = useRoute()
const config = useRuntimeConfig()

const token = computed(() => {
  const value = route.query.token

  return typeof value === 'string'
    ? value
    : ''
})

const password = ref('')
const confirmPassword = ref('')

const loading = ref(false)
const success = ref(false)
const error = ref('')

const submit = async () => {
  error.value = ''

  if (!token.value) {
    error.value =
      'Invitation link is invalid.'
    return
  }

  if (password.value.length < 8) {
    error.value =
      'Password must be at least 8 characters.'
    return
  }

  if (
    password.value !==
    confirmPassword.value
  ) {
    error.value =
      'Passwords do not match.'
    return
  }

  loading.value = true

  try {
    await $fetch(
      '/admin/admins/setup-account',
      {
        baseURL:
          config.public.apiBaseUrl,

        method: 'POST',

        body: {
          token: token.value,
          password: password.value,
        },
      },
    )

    success.value = true
  } catch (err: any) {
    error.value =
      err?.data?.message ||
      'Unable to set up your account.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="setup-page">
    <div class="setup-card">

      <div class="brand">
        <img
          src="/images/logo.png"
          alt="Vedic Journey"
        >
      </div>

      <!-- SUCCESS -->
      <template v-if="success">
        <div class="success-icon">
          ✓
        </div>

        <h1>
          Account ready
        </h1>

        <p class="description">
          Your password has been created
          successfully. You can now sign in
          to the Vedic Journey Travel Console.
        </p>

        <NuxtLink
          to="/login"
          class="primary-button"
        >
          Go to Login
        </NuxtLink>
      </template>

      <!-- FORM -->
      <template v-else>
        <p class="eyebrow">
          ADMIN INVITATION
        </p>

        <h1>
          Set up your account
        </h1>

        <p class="description">
          Create a secure password to activate
          your Vedic Journey admin account.
        </p>

        <div
          v-if="!token"
          class="error-box"
        >
          This invitation link is invalid.
        </div>

        <form
          v-else
          @submit.prevent="submit"
        >
          <div class="field">
            <label for="password">
              Password
            </label>

            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="new-password"
              placeholder="Minimum 8 characters"
              required
            >
          </div>

          <div class="field">
            <label for="confirm-password">
              Confirm password
            </label>

            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              autocomplete="new-password"
              placeholder="Enter password again"
              required
            >
          </div>

          <div
            v-if="error"
            class="error-box"
          >
            {{ error }}
          </div>

          <button
            type="submit"
            class="primary-button"
            :disabled="loading"
          >
            {{
              loading
                ? 'Setting up...'
                : 'Set Up Account'
            }}
          </button>
        </form>

        <p class="login-text">
          Already activated your account?

          <NuxtLink to="/login">
            Sign in
          </NuxtLink>
        </p>
      </template>

    </div>
  </main>
</template>

<style scoped>
.setup-page {
  min-height: 100vh;
  padding: 40px 20px;

  display: grid;
  place-items: center;

  background:
    radial-gradient(
      circle at top left,
      rgba(216, 11, 185, 0.08),
      transparent 30%
    ),
    #f7f5f4;
}

.setup-card {
  width: 100%;
  max-width: 510px;

  padding: 48px;

  border: 1px solid #ebe5ea;
  border-radius: 22px;

  background: #fff;

  box-shadow:
    0 20px 60px
    rgba(35, 15, 32, 0.08);
}

.brand {
  margin-bottom: 38px;
}

.brand img {
  display: block;

  width: auto;
  max-width: 180px;
  max-height: 70px;

  object-fit: contain;
}

.eyebrow {
  margin: 0 0 10px;

  color: #a20eac;

  font-size: 12px;
  font-weight: 800;

  letter-spacing: 0.14em;
}

h1 {
  margin: 0;

  color: #211d21;

  font-size: 34px;
  font-weight: 750;
  line-height: 1.15;

  letter-spacing: -0.03em;
}

.description {
  margin: 16px 0 30px;

  color: #80777f;

  font-size: 15px;
  line-height: 1.7;
}

.field {
  margin-bottom: 20px;
}

.field label {
  display: block;

  margin-bottom: 8px;

  color: #3b343a;

  font-size: 14px;
  font-weight: 650;
}

.field input {
  width: 100%;
  height: 50px;

  box-sizing: border-box;

  padding: 0 15px;

  border: 1px solid #ded7dd;
  border-radius: 10px;

  outline: none;

  background: #fff;

  color: #211d21;

  font: inherit;
  font-size: 15px;

  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.field input:focus {
  border-color: #d80bb9;

  box-shadow:
    0 0 0 3px
    rgba(216, 11, 185, 0.08);
}

.error-box {
  margin: 18px 0;

  padding: 13px 15px;

  border: 1px solid
    rgba(185, 74, 85, 0.18);

  border-radius: 9px;

  background:
    rgba(185, 74, 85, 0.06);

  color: #a23d47;

  font-size: 14px;
  line-height: 1.5;
}

.primary-button {
  width: 100%;
  min-height: 50px;

  margin-top: 6px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 10px;

  background:
    linear-gradient(
      135deg,
      #ec12c7 0%,
      #a20eac 52%,
      #651070 100%
    );

  color: #fff;

  font-size: 15px;
  font-weight: 700;

  text-decoration: none;
  cursor: pointer;

  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.primary-button:hover {
  transform: translateY(-1px);
}

.primary-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.login-text {
  margin: 24px 0 0;

  color: #80777f;

  font-size: 14px;
  text-align: center;
}

.login-text a {
  color: #a20eac;
  font-weight: 700;
  text-decoration: none;
}

.success-icon {
  width: 54px;
  height: 54px;

  margin-bottom: 24px;

  display: grid;
  place-items: center;

  border-radius: 50%;

  background:
    rgba(50, 132, 98, 0.1);

  color: #328462;

  font-size: 25px;
  font-weight: 800;
}

@media (max-width: 600px) {
  .setup-card {
    padding: 32px 24px;
  }

  h1 {
    font-size: 29px;
  }
}
</style>