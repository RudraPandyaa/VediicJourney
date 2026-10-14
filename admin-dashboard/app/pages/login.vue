<script setup lang="ts">
import { useAuth } from '../composables/useAuth'

definePageMeta({
  layout: false,
})

const {
  login,
  isAuthenticated,
} = useAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const loading = ref(false)
const errorMessage = ref('')

onMounted(() => {
  if (isAuthenticated.value) {
    navigateTo('/')
  }
})

const handleLogin = async () => {
  if (
    !email.value.trim() ||
    !password.value
  ) {
    errorMessage.value =
      'Please enter your email and password.'

    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    await login(
      email.value.trim(),
      password.value,
    )

    await navigateTo('/')
  } catch (error: any) {
    errorMessage.value =
      error?.data?.message ||
      'Unable to sign in. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <!-- LEFT / BRAND EXPERIENCE -->
    <section class="brand-panel">
      <div class="brand-glow glow-one" />
      <div class="brand-glow glow-two" />

      <div class="lotus-decoration lotus-one">
        ✦
      </div>

      <div class="lotus-decoration lotus-two">
        ✦
      </div>

      <div class="brand-top">
        <img
          src="/images/logo.png"
          alt="Vedic Journey"
          class="main-logo"
        >
      </div>

      <div class="brand-copy">
        <p class="brand-eyebrow">
          LUXURY TRAVEL REDEFINED
        </p>

        <h1>
          Curating journeys
          <span>beyond the ordinary.</span>
        </h1>

        <p class="brand-description">
          A dedicated workspace for managing
          destinations, experiences and
          extraordinary journeys across the world.
        </p>
      </div>

      <div class="brand-footer">
        <span class="line" />

        <div>
          <small>VEDIC JOURNEY</small>
          <p>India · Across the World</p>
        </div>
      </div>
    </section>

    <!-- RIGHT / LOGIN -->
    <section class="login-panel">
      <div class="mobile-logo-wrap">
        <img
          src="/images/logo.png"
          alt="Vedic Journey"
          class="mobile-logo"
        >
      </div>

      <div class="login-card">
        <div class="login-heading">
          <div class="brand-chip">
            <span class="chip-dot" />
            TRAVEL CONSOLE
          </div>

          <h2>Welcome back.</h2>

          <p>
            Sign in to manage the Vedic Journey
            experience.
          </p>
        </div>

        <form
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <div class="field">
            <label for="email">
              Email address
            </label>

            <div class="input-wrap">
              <span class="input-icon">
                @
              </span>

              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="admin@vedicjourney.com"
                :disabled="loading"
              >
            </div>
          </div>

          <div class="field">
            <div class="label-row">
              <label for="password">
                Password
              </label>
            </div>

            <div class="input-wrap">
              <span class="input-icon">
                ◇
              </span>

              <input
                id="password"
                v-model="password"
                :type="
                  showPassword
                    ? 'text'
                    : 'password'
                "
                autocomplete="current-password"
                placeholder="Enter your password"
                :disabled="loading"
              >

              <button
                type="button"
                class="password-toggle"
                :aria-label="
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                "
                @click="
                  showPassword =
                    !showPassword
                "
              >
                {{
                  showPassword
                    ? 'Hide'
                    : 'Show'
                }}
              </button>
            </div>
          </div>

          <Transition name="error">
            <div
              v-if="errorMessage"
              class="error-message"
            >
              <span>!</span>

              {{ errorMessage }}
            </div>
          </Transition>

          <button
            type="submit"
            class="login-button"
            :disabled="loading"
          >
            <span>
              {{
                loading
                  ? 'Signing in...'
                  : 'Enter Travel Console'
              }}
            </span>

            <span
              v-if="!loading"
              class="button-arrow"
            >
              →
            </span>

            <span
              v-else
              class="loader"
            />
          </button>
        </form>

        <div class="security">
          <span class="security-icon">
            ◇
          </span>

          <span>
            Secure administrator access
          </span>
        </div>
      </div>

      <footer class="login-footer">
        <span>
          © {{ new Date().getFullYear() }}
          Vedic Journey
        </span>

        <span class="footer-dot">·</span>

        <span>Travel Console</span>
      </footer>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  display: grid;
  min-height: 100vh;
  grid-template-columns:
    minmax(500px, 1.08fr)
    minmax(450px, 0.92fr);
  overflow: hidden;
  background: #faf8f9;
}

/* ===================================
   BRAND PANEL
=================================== */

.brand-panel {
  position: relative;
  display: flex;
  min-height: 100vh;
  padding: clamp(38px, 4vw, 68px);
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  color: #fff;
  background:
    radial-gradient(
      circle at 20% 12%,
      rgba(232, 16, 199, 0.2),
      transparent 31%
    ),
    radial-gradient(
      circle at 82% 72%,
      rgba(108, 13, 127, 0.26),
      transparent 35%
    ),
    linear-gradient(
      145deg,
      #090709 0%,
      #160b17 47%,
      #090709 100%
    );
}

.brand-panel::after {
  position: absolute;
  inset: 0;
  opacity: 0.24;
  pointer-events: none;
  background-image:
    linear-gradient(
      rgba(255, 255, 255, 0.025) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.025) 1px,
      transparent 1px
    );
  background-size: 55px 55px;
  content: '';
  mask-image:
    linear-gradient(
      to bottom,
      black,
      transparent 85%
    );
}

.brand-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(3px);
  pointer-events: none;
}

.glow-one {
  top: -180px;
  left: -150px;
  width: 500px;
  height: 500px;
  background:
    radial-gradient(
      circle,
      rgba(235, 12, 200, 0.15),
      transparent 68%
    );
  animation:
    float-glow 8s ease-in-out infinite;
}

.glow-two {
  right: -190px;
  bottom: -200px;
  width: 570px;
  height: 570px;
  background:
    radial-gradient(
      circle,
      rgba(107, 14, 126, 0.2),
      transparent 68%
    );
  animation:
    float-glow 10s ease-in-out
    infinite reverse;
}

.brand-top,
.brand-copy,
.brand-footer {
  position: relative;
  z-index: 2;
}

.main-logo {
  display: block;
  width: min(330px, 52%);
  height: auto;
  object-fit: contain;
  object-position: left center;
  filter:
    drop-shadow(
      0 8px 24px
      rgba(223, 12, 191, 0.12)
    );
  animation:
    logo-enter 0.8s
    cubic-bezier(0.22, 1, 0.36, 1)
    both;
}

.brand-copy {
  max-width: 690px;
  animation:
    copy-enter 0.8s 0.12s
    cubic-bezier(0.22, 1, 0.36, 1)
    both;
}

.brand-eyebrow {
  margin: 0 0 20px;
  color: #e721c5;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.26em;
}

.brand-copy h1 {
  max-width: 680px;
  margin: 0;
  font-family:
    Georgia,
    'Times New Roman',
    serif;
  font-size: clamp(46px, 4.8vw, 76px);
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: -0.045em;
}

.brand-copy h1 span {
  display: block;
  margin-top: 9px;
  background:
    linear-gradient(
      90deg,
      #f329d1,
      #bc27c5,
      #9160c9
    );
  background-clip: text;
  color: transparent;
  font-style: italic;
}

.brand-description {
  max-width: 540px;
  margin: 27px 0 0;
  color: rgba(255, 255, 255, 0.58);
  font-size: 16px;
  line-height: 1.8;
}

.brand-footer {
  display: flex;
  align-items: center;
  gap: 16px;
}

.line {
  width: 45px;
  height: 1px;
  background:
    linear-gradient(
      90deg,
      #e615c3,
      #781382
    );
}

.brand-footer small {
  color: #e51ac4;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.22em;
}

.brand-footer p {
  margin: 5px 0 0;
  color: rgba(255, 255, 255, 0.55);
  font-size: 14px;
}

.lotus-decoration {
  position: absolute;
  z-index: 1;
  color: rgba(224, 14, 191, 0.08);
  font-size: 220px;
  line-height: 1;
  pointer-events: none;
  user-select: none;
}

.lotus-one {
  top: 25%;
  right: -50px;
  transform: rotate(12deg);
}

.lotus-two {
  bottom: -50px;
  left: 25%;
  font-size: 160px;
  transform: rotate(-18deg);
}

/* ===================================
   LOGIN PANEL
=================================== */

.login-panel {
  position: relative;
  display: flex;
  min-height: 100vh;
  padding: 50px;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(
      circle at 100% 0%,
      rgba(216, 11, 185, 0.06),
      transparent 30%
    ),
    radial-gradient(
      circle at 0% 100%,
      rgba(102, 16, 113, 0.035),
      transparent 27%
    ),
    #fbf9fa;
}

.login-card {
  width: 100%;
  max-width: 430px;
  animation:
    login-enter 0.7s 0.15s
    cubic-bezier(0.22, 1, 0.36, 1)
    both;
}

.mobile-logo-wrap {
  display: none;
}

.brand-chip {
  display: inline-flex;
  margin-bottom: 22px;
  padding: 7px 10px;
  border: 1px solid
    rgba(180, 14, 168, 0.12);
  border-radius: 100px;
  align-items: center;
  gap: 7px;
  background: rgba(216, 11, 185, 0.04);
  color: #8d168d;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.chip-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #d80bb9;
  box-shadow:
    0 0 0 4px
    rgba(216, 11, 185, 0.08);
}

.login-heading h2 {
  margin: 0;
  color: #201b20;
  font-family:
    Georgia,
    'Times New Roman',
    serif;
  font-size: clamp(40px, 3.5vw, 52px);
  font-weight: 400;
  letter-spacing: -0.04em;
}

.login-heading > p {
  max-width: 370px;
  margin: 13px 0 37px;
  color: #857b83;
  font-size: 16px;
  line-height: 1.7;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 21px;
}

.field label {
  display: block;
  color: #453e44;
  font-size: 14px;
  font-weight: 650;
}

.label-row {
  display: flex;
  margin-bottom: 9px;
  align-items: center;
  justify-content: space-between;
}

.field:not(:has(.label-row)) label {
  margin-bottom: 9px;
}

.input-wrap {
  position: relative;
}

.input-icon {
  position: absolute;
  top: 50%;
  left: 16px;
  z-index: 1;
  color: #a49aa2;
  font-size: 16px;
  transform: translateY(-50%);
  transition: color 0.2s ease;
}

.input-wrap input {
  width: 100%;
  height: 54px;
  padding: 0 70px 0 43px;
  border: 1px solid #e7e0e5;
  border-radius: 11px;
  outline: none;
  background: rgba(255, 255, 255, 0.82);
  color: #241e23;
  font: inherit;
  font-size: 16px;
  box-shadow:
    0 5px 20px
    rgba(43, 22, 39, 0.025);
  transition:
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease;
}

.input-wrap input::placeholder {
  color: #b4abb2;
}

.input-wrap input:focus {
  border-color:
    rgba(216, 11, 185, 0.48);
  background: #fff;
  box-shadow:
    0 0 0 4px
    rgba(216, 11, 185, 0.055),
    0 8px 24px
    rgba(46, 17, 41, 0.04);
}

.input-wrap:focus-within .input-icon {
  color: #c30dab;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 14px;
  padding: 7px;
  border: 0;
  outline: 0;
  background: transparent;
  color: #9b2596;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transform: translateY(-50%);
}

.password-toggle:hover {
  color: #d80bb9;
}

.error-message {
  display: flex;
  margin-top: -5px;
  padding: 11px 13px;
  border: 1px solid #efd7dd;
  border-radius: 9px;
  align-items: center;
  gap: 9px;
  background: #fff7f8;
  color: #a83e55;
  font-size: 11px;
}

.error-message span {
  display: grid;
  width: 17px;
  height: 17px;
  flex: 0 0 auto;
  border-radius: 50%;
  place-items: center;
  background: #a83e55;
  color: white;
  font-size: 9px;
  font-weight: 700;
}

.login-button {
  position: relative;
  display: flex;
  width: 100%;
  height: 55px;
  margin-top: 2px;
  padding: 0 19px;
  border: 0;
  border-radius: 11px;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  background:
    linear-gradient(
      110deg,
      #c60caf,
      #8e108f,
      #651071
    );
  background-size: 160% 100%;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow:
    0 12px 28px
    rgba(161, 13, 154, 0.2);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background-position 0.4s ease;
}

.login-button::before {
  position: absolute;
  top: -80%;
  left: -30%;
  width: 35%;
  height: 250%;
  background:
    rgba(255, 255, 255, 0.15);
  content: '';
  transform: rotate(20deg);
  transition: left 0.55s ease;
}

.login-button:hover:not(:disabled) {
  background-position: 100% 0;
  box-shadow:
    0 15px 35px
    rgba(161, 13, 154, 0.28);
  transform: translateY(-2px);
}

.login-button:hover::before {
  left: 120%;
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  cursor: wait;
  opacity: 0.75;
}

.button-arrow {
  position: relative;
  z-index: 1;
  font-size: 17px;
  transition: transform 0.2s ease;
}

.login-button:hover .button-arrow {
  transform: translateX(3px);
}

.loader {
  width: 15px;
  height: 15px;
  border: 2px solid
    rgba(255, 255, 255, 0.35);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.security {
  display: flex;
  margin-top: 25px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #9d949b;
  font-size: 16px;
  letter-spacing: 0.04em;
}

.security-icon {
  color: #b40ca2;
  font-size: 16px;
}

.login-footer {
  position: absolute;
  right: 32px;
  bottom: 24px;
  left: 32px;
  display: flex;
  justify-content: center;
  gap: 8px;
  color: #aaa1a8;
  font-size: 16px;
}

.footer-dot {
  color: #d80bb9;
}

/* ===================================
   ANIMATION
=================================== */

@keyframes login-enter {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes copy-enter {
  from {
    opacity: 0;
    transform: translateY(22px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes logo-enter {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float-glow {
  0%,
  100% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(20px, 16px);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-enter-active,
.error-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* ===================================
   RESPONSIVE
=================================== */

@media (max-width: 1100px) {
  .login-page {
    grid-template-columns:
      minmax(420px, 0.9fr)
      minmax(430px, 1fr);
  }

  .brand-panel {
    padding: 42px;
  }

  .main-logo {
    width: min(300px, 68%);
  }

  .brand-copy h1 {
    font-size: 52px;
  }

  .login-panel {
    padding: 42px;
  }
}

@media (max-width: 850px) {
  .login-page {
    display: block;
    min-height: 100dvh;
  }

  .brand-panel {
    display: none;
  }

  .login-panel {
    min-height: 100dvh;
    padding:
      45px
      max(24px, 8vw)
      75px;
    flex-direction: column;
  }

  .mobile-logo-wrap {
    display: flex;
    width: 100%;
    max-width: 430px;
    margin-bottom: 45px;
    justify-content: center;
  }

  .mobile-logo {
    width: 230px;
    max-width: 70%;
    height: auto;
    object-fit: contain;
  }

  .login-heading h2 {
    font-size: 43px;
  }
}

@media (max-width: 520px) {
  .login-panel {
    padding:
      32px 20px
      68px;
    justify-content: flex-start;
  }

  .mobile-logo-wrap {
    margin-bottom: 38px;
  }

  .mobile-logo {
    width: 195px;
  }

  .login-card {
    max-width: 100%;
  }

  .brand-chip {
    margin-bottom: 17px;
  }

  .login-heading h2 {
    font-size: 37px;
  }

  .login-heading > p {
    margin-bottom: 29px;
    font-size: 12px;
  }

  .input-wrap input {
    height: 52px;
  }

  .login-button {
    height: 53px;
  }

  .login-footer {
    bottom: 19px;
  }
}

@media (max-height: 700px)
  and (min-width: 851px) {
  .brand-panel {
    padding-top: 34px;
    padding-bottom: 34px;
  }

  .main-logo {
    width: 230px;
  }

  .brand-copy h1 {
    font-size: 48px;
  }

  .brand-description {
    margin-top: 18px;
  }

  .login-heading > p {
    margin-bottom: 25px;
  }

  .login-form {
    gap: 16px;
  }
}

@media (
  prefers-reduced-motion: reduce
) {
  .login-card,
  .brand-copy,
  .main-logo,
  .brand-glow,
  .loader {
    animation-duration: 0.01ms;
    animation-iteration-count: 1;
  }

  .login-button,
  .input-wrap input {
    transition-duration: 0.01ms;
  }
}
</style>