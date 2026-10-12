<script setup lang="ts">
const route = useRoute()

const sections = [
  {
    label: 'OVERVIEW',
    items: [
      { label: 'Dashboard', to: '/', icon: '⌂' },
    ],
  },
  {
    label: 'TRAVEL',
    items: [
      { label: 'Regions', to: '/regions', icon: '◎' },
      { label: 'Destinations', to: '/destinations', icon: '◇' },
      { label: 'Places', to: '/places', icon: '⌖' },
      { label: 'Experiences', to: '/experiences', icon: '✦' },
      { label: 'Travel Styles', to: '/travel-styles', icon: '◈' },
      { label: 'Journeys', to: '/journeys', icon: '↗' },
    ],
  },
  {
    label: 'WEBSITE',
    items: [
      { label: 'Homepage', to: '/pages/home', icon: '□' },
      { label: 'About Page', to: '/pages/about', icon: '□' },
      { label: 'Contact Page', to: '/pages/contact', icon: '□' },
    ],
  },
  {
    label: 'CONTENT',
    items: [
      { label: 'Journal', to: '/journal', icon: '≡' },
      { label: 'Testimonials', to: '/testimonials', icon: '“' },
      { label: 'Certificates', to: '/certificates', icon: '♢' },
      { label: 'Media Library', to: '/media', icon: '▧' },
    ],
  },
  {
    label: 'LEADS',
    items: [
      { label: 'Enquiries', to: '/enquiries', icon: '✉' },
    ],
  },
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }

  return route.path.startsWith(path)
}
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="lotus">✦</div>

      <div>
        <strong>VEDIC JOURNEY</strong>
        <span>TRAVEL CONSOLE</span>
      </div>
    </div>

    <div class="navigation">
      <div
        v-for="section in sections"
        :key="section.label"
        class="section"
      >
        <p class="section-label">
          {{ section.label }}
        </p>

        <nav>
          <NuxtLink
            v-for="item in section.items"
            :key="item.to"
            :to="item.to"
            class="nav-item"
            :class="{ active: isActive(item.to) }"
          >
            <span class="icon">
              {{ item.icon }}
            </span>

            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>
      </div>
    </div>

    <NuxtLink
      to="/settings"
      class="settings-link"
      :class="{
        active: isActive('/settings'),
      }"
    >
      <span class="icon">⚙</span>
      Website Settings
    </NuxtLink>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  display: flex;
  width: 292px;
  padding: 28px 18px 20px;
  flex-direction: column;
  overflow-y: auto;
  background:
    radial-gradient(
      circle at 0 0,
      rgba(216, 11, 185, 0.1),
      transparent 25%
    ),
    var(--sidebar);
  color: white;
}

.nav-item {
  min-height: 46px;
  padding: 0 16px;
  border-radius: 11px;
  gap: 13px;
  font-size: 13px;
}

.nav-icon {
  width: 20px;
  font-size: 12px;
}

.nav-section-title {
  margin: 28px 0 10px;
  padding: 0 16px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.2em;
}

.sidebar-brand {
  min-height: 94px;
  padding: 22px 20px;
}

.brand-mark {
  width: 46px;
  height: 46px;
  border-radius: 13px;
}

.sidebar-nav {
  padding: 12px 14px 30px;
}

.brand-name {
  font-size: 13px;
}

.brand-subtitle {
  margin-top: 4px;
  font-size: 9px;
}

.brand {
  display: flex;
  padding: 0 10px 28px;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid
    rgba(255, 255, 255, 0.07);
}

.lotus {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  border-radius: 13px;
  place-items: center;
  background: var(--brand-gradient);
  font-size: 19px;
  box-shadow:
    0 7px 24px
    rgba(216, 11, 185, 0.2);
}

.brand strong {
  display: block;
  font-size: 12px;
  letter-spacing: 0.13em;
}

.brand span {
  display: block;
  margin-top: 5px;
  color: #8e838d;
  font-size: 9px;
  letter-spacing: 0.18em;
}

.navigation {
  flex: 1;
  padding-top: 24px;
}

.section {
  margin-bottom: 25px;
}

.section-label {
  margin: 0 12px 8px;
  color: #655d64;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.nav-item,
.settings-link {
  position: relative;
  display: flex;
  min-height: 42px;
  padding: 0 12px;
  border-radius: 9px;
  align-items: center;
  gap: 12px;
  color: #a69da5;
  font-size: 13px;
  text-decoration: none;
  transition: 0.2s ease;
}

.nav-item:hover,
.settings-link:hover {
  background: rgba(255, 255, 255, 0.045);
  color: white;
}

.nav-item.active,
.settings-link.active {
  background:
    linear-gradient(
      90deg,
      rgba(216, 11, 185, 0.15),
      rgba(102, 16, 113, 0.07)
    );
  color: white;
}

.nav-item.active::before,
.settings-link.active::before {
  position: absolute;
  left: 0;
  width: 3px;
  height: 20px;
  border-radius: 0 4px 4px 0;
  background: var(--brand);
  content: '';
}

.icon {
  display: grid;
  width: 20px;
  color: #756c74;
  place-items: center;
}

.active .icon {
  color: #ef2dcc;
}

.settings-link {
  flex: 0 0 auto;
  border-top: 1px solid
    rgba(255, 255, 255, 0.06);
  border-radius: 0;
}
</style>