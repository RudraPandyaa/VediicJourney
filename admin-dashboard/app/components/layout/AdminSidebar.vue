<script setup lang="ts">
const route = useRoute()

const sections = [
  {
    label: 'OVERVIEW',
    items: [
      {
        label: 'Dashboard',
        to: '/',
        icon: '⌂',
      },
      {
        label: 'Admin Management',
        to: '/admins',
        icon: '♙',
      },
    ],
  },

  {
    label: 'TRAVEL',
    items: [
      {
        label: 'Regions',
        to: '/regions',
        icon: '◎',
      },
      {
        label: 'Destinations',
        to: '/destinations',
        icon: '◇',
      },
      {
        label: 'Places',
        to: '/places',
        icon: '⌖',
      },
      {
        label: 'Experiences',
        to: '/experiences',
        icon: '✦',
      },
      {
        label: 'Travel Styles',
        to: '/travel-styles',
        icon: '◈',
      },
      {
        label: 'Journeys',
        to: '/journeys',
        icon: '↗',
      },
    ],
  },

  {
    label: 'WEBSITE',
    items: [
      {
        label: 'Pages',
        to: '/pages',
        icon: '▤',
      },
      {
        label: 'Homepage',
        to: '/pages/home',
        icon: '□',
      },
      {
        label: 'About Page',
        to: '/pages/about',
        icon: '□',
      },
      {
        label: 'Contact Page',
        to: '/pages/contact',
        icon: '□',
      },
    ],
  },

  {
    label: 'CONTENT',
    items: [
      {
        label: 'Journal',
        to: '/journal',
        icon: '≡',
      },
      {
        label: 'Trust Content',
        to: '/trust',
        icon: '♢',
      },
      {
        label: 'Media Library',
        to: '/media',
        icon: '▧',
      },
    ],
  },

  {
    label: 'LEADS',
    items: [
      {
        label: 'Enquiries',
        to: '/enquiries',
        icon: '✉',
      },
    ],
  },
]

const isActive = (
  path: string,
) => {
  if (path === '/') {
    return route.path === '/'
  }

  /*
   * Pages listing should only be active
   * on /pages itself.
   *
   * Otherwise /pages would also become
   * active on /pages/home etc.
   */
  if (path === '/pages') {
    return route.path === '/pages'
  }

  return route.path.startsWith(path)
}
</script>

<template>
  <aside class="sidebar">

    <!-- BRAND -->
    <div class="brand">
      <div class="lotus">
        ✦
      </div>

      <div class="brand-copy">
        <strong>
          VEDIC JOURNEY
        </strong>

        <span>
          TRAVEL CONSOLE
        </span>
      </div>
    </div>

    <!-- NAVIGATION -->
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
            :class="{
              active: isActive(item.to),
            }"
          >
            <span class="icon">
              {{ item.icon }}
            </span>

            <span class="nav-text">
              {{ item.label }}
            </span>
          </NuxtLink>
        </nav>
      </div>
    </div>

    <!-- SETTINGS -->
    <NuxtLink
      to="/settings"
      class="settings-link"
      :class="{
        active: isActive('/settings'),
      }"
    >
      <span class="icon">
        ⚙
      </span>

      <span class="nav-text">
        Website Settings
      </span>
    </NuxtLink>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  z-index: 100;
  inset: 0 auto 0 0;

  width: 292px;
  padding: 26px 18px 20px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;

  overflow-y: auto;

  background:
    radial-gradient(
      circle at 0 0,
      rgba(216, 11, 185, 0.1),
      transparent 25%
    ),
    var(--sidebar);

  color: #fff;
}

/* BRAND */

.brand {
  padding: 0 10px 25px;

  display: flex;
  align-items: center;
  gap: 13px;

  border-bottom:
    1px solid rgba(255, 255, 255, 0.07);
}

.lotus {
  width: 44px;
  height: 44px;
  flex: 0 0 44px;

  display: grid;
  place-items: center;

  border-radius: 13px;

  background: var(--brand-gradient);

  color: #fff;
  font-size: 19px;

  box-shadow:
    0 7px 24px
    rgba(216, 11, 185, 0.2);
}

.brand-copy {
  min-width: 0;
}

.brand strong {
  display: block;

  color: #fff;

  font-size: 13px;
  font-weight: 800;
  line-height: 1.3;

  letter-spacing: 0.1em;
}

.brand span {
  display: block;

  margin-top: 5px;

  color: #948a93;

  font-size: 11px;
  font-weight: 650;
  line-height: 1.3;

  letter-spacing: 0.12em;
}

/* NAVIGATION */

.navigation {
  flex: 1;

  padding-top: 23px;
}

.section {
  margin-bottom: 24px;
}

.section-label {
  margin:
    0
    12px
    9px;

  color: #776e76;

  font-size: 11px;
  font-weight: 800;
  line-height: 1.3;

  letter-spacing: 0.14em;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

/* NAV ITEMS */

.nav-item,
.settings-link {
  position: relative;

  min-height: 44px;
  padding: 0 13px;

  display: flex;
  align-items: center;
  gap: 12px;

  border-radius: 9px;

  color: #b1a8b0;

  font-size: 16px;
  font-weight: 550;
  line-height: 1.4;

  text-decoration: none;

  transition:
    background 0.18s ease,
    color 0.18s ease;
}

.nav-item:hover,
.settings-link:hover {
  background:
    rgba(255, 255, 255, 0.05);

  color: #fff;
}

.nav-item.active,
.settings-link.active {
  background:
    linear-gradient(
      90deg,
      rgba(216, 11, 185, 0.16),
      rgba(102, 16, 113, 0.07)
    );

  color: #fff;
}

.nav-item.active::before,
.settings-link.active::before {
  position: absolute;

  top: 50%;
  left: 0;

  width: 3px;
  height: 22px;

  border-radius:
    0
    4px
    4px
    0;

  background: var(--brand);

  content: '';

  transform: translateY(-50%);
}

/* ICON */

.icon {
  width: 21px;
  flex: 0 0 21px;

  display: grid;
  place-items: center;

  color: #817780;

  font-size: 21px;
  line-height: 1;
}

.nav-item:hover .icon,
.settings-link:hover .icon {
  color: #c8bdc6;
}

.active .icon {
  color: #ef2dcc;
}

.nav-text {
  min-width: 0;

  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;
}

/* SETTINGS */

.settings-link {
  flex: 0 0 auto;

  min-height: 50px;
  margin-top: 5px;

  border-top:
    1px solid rgba(255, 255, 255, 0.06);

  border-radius: 0;
}

/* SCROLLBAR */

.sidebar::-webkit-scrollbar {
  width: 5px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  border-radius: 999px;

  background:
    rgba(255, 255, 255, 0.1);
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background:
    rgba(255, 255, 255, 0.16);
}
</style>