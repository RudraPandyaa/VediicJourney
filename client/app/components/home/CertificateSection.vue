<template>
  <section
    v-if="certificates.length"
    ref="sectionRef"
    class="certificates"
  >
    <div class="certificates__inner">

      <div class="certificates__heading-wrap">
        <h2 class="certificates__heading heading-xl">
          {{ certificateContent?.title || 'Our Certificates' }}
        </h2>
      </div>

      <div class="certificates__grid">
        <article
          v-for="certificate in certificates"
          :key="certificate._id"
          class="certificates__item"
        >
          <div
            v-if="certificate.image?.url"
            class="certificates__image"
          >
            <img
              :src="certificate.image.url"
              :alt="
                certificate.image.altText ||
                certificate.title ||
                'Vedic Journey certificate'
              "
              loading="lazy"
              :width="certificate.image.width"
              :height="certificate.image.height"
            />
          </div>
        </article>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface CertificateMedia {
  _id?: string
  url: string
  altText?: string
  width?: number
  height?: number
}

interface Certificate {
  _id: string
  title?: string
  type?: string
  organization?: string
  description?: string
  image?: CertificateMedia | null
  externalUrl?: string
  sortOrder?: number
}

interface CertificateContent {
  title?: string
}

defineProps<{
  certificateContent?: CertificateContent | null
  certificates: Certificate[]
}>()

const sectionRef = ref<HTMLElement | null>(null)

let ctx: gsap.Context | null = null

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  if (!sectionRef.value) return

  const section = sectionRef.value

  ctx = gsap.context(() => {
    gsap.from('.certificates__heading', {
      y: 35,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
        once: true
      }
    })

    const grid = section.querySelector(
      '.certificates__grid'
    )

    if (grid) {
      gsap.from('.certificates__item', {
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 82%',
          once: true
        }
      })
    }
  }, section)
})

onBeforeUnmount(() => {
  ctx?.revert()
})
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;


// ============================================================
// SECTION
// ============================================================

.certificates {
  position: relative;

  width: 100%;

  background: $color-ivory;

  color: $color-charcoal;

  overflow: hidden;
}


// ============================================================
// INNER
// ============================================================

.certificates__inner {
  width: 100%;
  max-width: $container-max;

  margin-inline: auto;

  padding:
    clamp(80px, 9vw, 130px)
    var(--page-padding)
    clamp(90px, 10vw, 150px);
}


// ============================================================
// HEADING
// ============================================================

.certificates__heading-wrap {
  width: 100%;

  margin-bottom:
    clamp(48px, 5vw, 72px);

  text-align: center;
}


.certificates__heading {
  margin: 0;

  font-family:
    'Bebas Neue',
    sans-serif;

  font-size:
    clamp(
      3.8rem,
      6vw,
      6.8rem
    );

  font-weight: 400;

  line-height: 0.86;

  letter-spacing: 0.02em;

  color: $color-charcoal;
}


// ============================================================
// CERTIFICATE GRID
// ============================================================

.certificates__grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap:
    clamp(18px, 2.2vw, 32px);

  width: 100%;
}


// ============================================================
// CERTIFICATE ITEM
// ============================================================

.certificates__item {
  min-width: 0;
}


// ============================================================
// CERTIFICATE IMAGE
// ============================================================

.certificates__image {
  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;

  aspect-ratio: 1 / 1.28;

  overflow: hidden;

  background: $color-ivory-light;

  border:
    1px solid
    rgba($color-charcoal, 0.12);

  img {
    display: block;

    width: 100%;
    height: 100%;

    object-fit: cover;

    transition:
      transform $transition-fast;
  }
}


.certificates__item:hover {
  .certificates__image img {
    transform: scale(1.015);
  }
}


// ============================================================
// TABLET
// ============================================================

@media (max-width: 900px) {
  .certificates__grid {
    gap: 16px;
  }
}


// ============================================================
// MOBILE
// ============================================================

@media (max-width: 640px) {
  .certificates__inner {
    padding:
      70px
      var(--page-padding)
      80px;
  }

  .certificates__heading-wrap {
    margin-bottom: 38px;
  }

  .certificates__grid {
    grid-template-columns: 1fr;

    max-width: 520px;

    margin-inline: auto;

    gap: 20px;
  }

  .certificates__image {
    aspect-ratio: 1 / 1.28;
  }
}


// ============================================================
// REDUCED MOTION
// ============================================================

@media (prefers-reduced-motion: reduce) {
  .certificates__heading,
  .certificates__item,
  .certificates__image img {
    transform: none !important;
    transition: none !important;
  }
}
</style>
