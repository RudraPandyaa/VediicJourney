<template>
  <header class="site-header" :class="{ 'site-header--dark': isDestinationsPage }">
    <div class="site-header__inner">
      <!-- Brand -->
      <NuxtLink to="/" class="site-header__brand" aria-label="Vedic Journey home">
        <img src="/images/logo/logo.png" alt="Vedic Journey" class="site-header__logo">
      </NuxtLink>

      <!-- Desktop Navigation -->
      <nav class="site-header__nav" aria-label="Main navigation">
        <NuxtLink to="/">
          Home
        </NuxtLink>

        <NuxtLink to="/destinations">
          Destinations
        </NuxtLink>

        <NuxtLink to="/about">
          About Us
        </NuxtLink>

        <NuxtLink to="/contact">
          Contact Us
        </NuxtLink>

        <NuxtLink to="/blogs">
          Blogs
        </NuxtLink>
      </nav>

      <!-- Mobile Menu -->
      <button class="site-header__menu" type="button" aria-label="Open navigation">
        <span />
        <span />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()

const isDestinationsPage = computed(() => {
  return route.path === '/destinations' 
})
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.site-header {
  position: absolute;
  z-index: $z-header;
  top: 0;
  left: 0;

  width: 100%;
  padding:
    clamp(22px, 2.2vw, 32px) var(--page-padding);

  color: $color-ivory-light;

  // Dark navigation on the white Destinations pages
  &--dark {
    color: $color-charcoal;
    font-weight: 500;
  }

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    max-width: $container-max;

    margin-inline: auto;
  }

  &__brand {
    display: inline-flex;
    align-items: center;

    justify-self: start;

    width: fit-content;
  }

  &__logo {
    display: block;

    width: clamp(140px, 10vw, 175px);
    height: auto;

    object-fit: contain;
  }

  // ----------------------------------------------------------
  // BRAND
  // ----------------------------------------------------------

  &__brand {
    display: inline-flex;
    align-items: center;
    justify-self: start;
    gap: 13px;

    width: fit-content;
  }

  // &__mark {
  //   display: grid;
  //   place-items: center;

  //   width: 34px;
  //   height: 34px;

  //   border: 1px solid rgba(255, 255, 255, 0.55);
  //   border-radius: 50%;

  //   font-family: 'Cormorant Garamond', serif;
  //   font-size: 0.8rem;
  //   letter-spacing: 0.04em;
  // }

  // &__name {
  //   font-family: 'Cormorant Garamond', serif;
  //   font-size: 1.15rem;
  //   font-weight: 500;
  //   letter-spacing: 0.08em;
  //   text-transform: uppercase;
  // }

  // ----------------------------------------------------------
  // NAVIGATION
  // ----------------------------------------------------------

  &__nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(30px, 3vw, 55px);

    a {
      position: relative;

      padding-block: 10px;

      font-size: var(--fs-nav);
      font-weight: 500;
      letter-spacing: 0.13em;
      text-transform: uppercase;
      font-family: 'Manrope', sans-serif;

      &::after {
        position: absolute;
        bottom: 2px;
        left: 0;

        width: 100%;
        height: 1px;

        background: currentColor;

        content: '';

        transform: scaleX(0);
        transform-origin: right center;
        transition: transform $transition-fast;
      }

      &:hover::after {
        transform: scaleX(1);
        transform-origin: left center;
      }
    }
  }

  // ----------------------------------------------------------
  // CTA
  // ----------------------------------------------------------

  &__cta {
    display: flex;
    align-items: center;
    justify-self: end;
    gap: 16px;

    font-family: 'Manrope', sans-serif;
    font-size: var(--fs-nav);
    font-weight: 500;
    letter-spacing: 0.13em;
    text-transform: uppercase;

    &-line {
      width: 34px;
      height: 1px;

      background: currentColor;

      transition: width $transition-medium;
    }

    &:hover &-line {
      width: 50px;
    }
  }

  // ----------------------------------------------------------
  // MOBILE MENU
  // ----------------------------------------------------------

  &__menu {
    display: none;

    width: 34px;

    span {
      display: block;

      width: 100%;
      height: 1px;

      background: currentColor;

      &:last-child {
        width: 70%;
        margin-top: 7px;
        margin-left: auto;
      }
    }
  }
}

// ------------------------------------------------------------
// TABLET / MOBILE
// ------------------------------------------------------------

@media (max-width: 1024px) {
  .site-header {
    padding-top: 24px;

    &__inner {
      display: flex;
      justify-content: space-between;
    }

    &__nav,
    &__cta {
      display: none;
    }

    &__menu {
      display: block;
    }
  }
}

@media (max-width: 600px) {
  .site-header {
    padding-top: 22px;

    &__logo {
      width: 155px;
    }

    &__mark {
      width: 30px;
      height: 30px;
    }

    &__name {
      font-size: 0.95rem;
    }
  }
}
</style>