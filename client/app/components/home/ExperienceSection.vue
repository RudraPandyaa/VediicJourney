<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Experience {
  name: string
  slug: string
  description: string
  image: string
}

const experiences: Experience[] = [
  {
    name: 'Spiritual',
    slug: 'spiritual',
    description:
      'Journeys of meaning shaped by ancient traditions, sacred places and moments that invite a deeper connection.',
    image: '/images/experiences/spiritual.jpg'
  },
  {
    name: 'Wellness',
    slug: 'wellness',
    description:
      'Slow down, restore and reconnect through thoughtfully chosen retreats, healing traditions and restorative landscapes.',
    image: '/images/experiences/wellness.jpg'
  },
  {
    name: 'Adventure',
    slug: 'adventure',
    description:
      'Venture beyond the familiar through remarkable landscapes, remote places and experiences that awaken your sense of discovery.',
    image: '/images/experiences/adventure.jpg'
  },
  {
    name: 'Wildlife',
    slug: 'wildlife',
    description:
      'Encounter the natural world through extraordinary habitats, intimate safaris and carefully considered wildlife experiences.',
    image: '/images/experiences/wildlife.jpg'
  },
  {
    name: 'Culinary',
    slug: 'culinary',
    description:
      'Discover a destination through its flavours, people and traditions — from local kitchens to unforgettable dining experiences.',
    image: '/images/experiences/culinary.jpg'
  },
  {
    name: 'Cultural',
    slug: 'cultural',
    description:
      'Step inside living traditions, remarkable architecture and stories that reveal the true character of a place.',
    image: '/images/experiences/cultural.jpg'
  },
  {
    name: 'Luxury',
    slug: 'luxury',
    description:
      'Exceptional stays, private access and beautifully considered details create journeys defined by effortless comfort.',
    image: '/images/experiences/luxury.jpg'
  },
  {
    name: 'Romance',
    slug: 'romance',
    description:
      'Private moments, beautiful settings and journeys thoughtfully designed to be experienced together.',
    image: '/images/experiences/romance.jpg'
  },
  {
    name: 'Family',
    slug: 'family',
    description:
      'Meaningful adventures for every generation, shaped around shared discovery, comfort and time together.',
    image: '/images/experiences/family.jpg'
  }
]

// ============================================================
// REFS / STATE
// ============================================================

const sectionRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const carouselRef = ref<HTMLElement | null>(null)
const descriptionRef = ref<HTMLElement | null>(null)

const activeIndex = ref(0)
const isAnimating = ref(false)

let ctx: gsap.Context | null = null
let mm: gsap.MatchMedia | null = null

let autoplayTimer: ReturnType<typeof setInterval> | null = null
let autoplayResumeTimer: ReturnType<typeof setTimeout> | null = null

let descriptionTween: gsap.core.Timeline | null = null

// ============================================================
// COMPUTED
// ============================================================

const activeExperience = computed<Experience>(() => {
  return experiences[activeIndex.value] ?? experiences[0]!
})

const previousIndex = computed(() => {
  return activeIndex.value === 0
    ? experiences.length - 1
    : activeIndex.value - 1
})

const nextIndex = computed(() => {
  return activeIndex.value === experiences.length - 1
    ? 0
    : activeIndex.value + 1
})

const activeNumber = computed(() => {
  return String(activeIndex.value + 1).padStart(2, '0')
})

const totalNumber = String(experiences.length).padStart(2, '0')

// ============================================================
// AUTOPLAY
// ============================================================

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

const startAutoplay = () => {
  stopAutoplay()

  autoplayTimer = setInterval(() => {
    if (
      document.hidden ||
      isAnimating.value
    ) {
      return
    }

    nextExperience(true)
  }, 3000)
}

const resetAutoplay = () => {
  stopAutoplay()

  if (autoplayResumeTimer) {
    clearTimeout(autoplayResumeTimer)
  }

  autoplayResumeTimer = setTimeout(() => {
    startAutoplay()
  }, 5500)
}

// ============================================================
// CHANGE EXPERIENCE
// ============================================================

const changeExperience = (
  newIndex: number,
  direction: 1 | -1,
  fromAutoplay = false
) => {
  if (
    newIndex === activeIndex.value ||
    isAnimating.value
  ) {
    return
  }

  isAnimating.value = true

  if (descriptionTween) {
    descriptionTween.kill()
  }

  const description = descriptionRef.value

  descriptionTween = gsap.timeline({
    onComplete: () => {
      isAnimating.value = false
    }
  })

  // Fade current description out
  if (description) {
    descriptionTween.to(
      description,
      {
        y: direction === 1 ? -18 : 18,
        opacity: 0,
        duration: 0.22,
        ease: 'power2.in'
      },
      0
    )
  }

  // Change active card
  descriptionTween.call(
    () => {
      activeIndex.value = newIndex
    },
    [],
    0.22
  )

  // Fade new description in
  if (description) {
    descriptionTween.fromTo(
      description,
      {
        y: direction === 1 ? 18 : -18,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.45,
        ease: 'power3.out'
      },
      0.28
    )
  }

  if (!fromAutoplay) {
    resetAutoplay()
  }
}

// ============================================================
// CONTROLS
// ============================================================

const nextExperience = (
  fromAutoplay = false
) => {
  const newIndex =
    (activeIndex.value + 1) %
    experiences.length

  changeExperience(
    newIndex,
    1,
    fromAutoplay
  )
}

const previousExperience = () => {
  const newIndex =
    activeIndex.value === 0
      ? experiences.length - 1
      : activeIndex.value - 1

  changeExperience(
    newIndex,
    -1
  )
}

// ============================================================
// ENTRANCE ANIMATION
// ============================================================

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  if (
    !sectionRef.value ||
    !stageRef.value
  ) {
    return
  }

  ctx = gsap.context(() => {
    mm = gsap.matchMedia()

    const setupEntrance = (
      start: string,
      mobile = false
    ) => {
      if (!sectionRef.value) {
        return
      }

      // ------------------------------------------
      // INITIAL STATES
      // ------------------------------------------

      gsap.set(
        '.experiences__eyebrow',
        {
          opacity: 0,
          y: 20
        }
      )

      gsap.set(
        '.experiences__heading-text',
        {
          yPercent: 110
        }
      )

      gsap.set(
        '.experiences__carousel',
        {
          opacity: 0,
          y: mobile ? 25 : 45
        }
      )

      gsap.set(
        '.experiences__content',
        {
          opacity: 0,
          y: 20
        }
      )

      gsap.set(
        '.experiences__side-control',
        {
          opacity: 0
        }
      )

      // ------------------------------------------
      // ENTRANCE TIMELINE
      // ------------------------------------------

      const entrance =
        gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.value,
            start,
            once: true
          }
        })

      entrance
        .to(
          '.experiences__eyebrow',
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out'
          },
          0
        )

        .to(
          '.experiences__heading-text',
          {
            yPercent: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: 'power3.out'
          },
          0.08
        )

        .to(
          '.experiences__carousel',
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out'
          },
          0.25
        )

        .to(
          '.experiences__content',
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power3.out'
          },
          0.48
        )

        .to(
          '.experiences__side-control',
          {
            opacity: 1,
            duration: 0.45,
            stagger: 0.05,
            ease: 'power2.out'
          },
          0.62
        )

      startAutoplay()

      return () => {
        entrance.kill()
        stopAutoplay()
      }
    }

    // Desktop
    mm?.add(
      '(min-width: 769px)',
      () => {
        return setupEntrance(
          'top 78%'
        )
      }
    )

    // Mobile
    mm?.add(
      '(max-width: 768px)',
      () => {
        return setupEntrance(
          'top 82%',
          true
        )
      }
    )
  }, sectionRef.value)
})

// ============================================================
// CLEANUP
// ============================================================

onBeforeUnmount(() => {
  stopAutoplay()

  if (autoplayResumeTimer) {
    clearTimeout(
      autoplayResumeTimer
    )
  }

  if (descriptionTween) {
    descriptionTween.kill()
  }

  mm?.revert()
  ctx?.revert()
})
</script>

<template>
  <section
    ref="sectionRef"
    class="experiences"
  >
    <div
      ref="stageRef"
      class="experiences__stage"
    >

      <!-- ==================================================
           HEADER
      =================================================== -->

      <div class="experiences__top">

        <h2
          class="experiences__heading heading-lg"
        >

          <span
            class="experiences__heading-line"
          >
            <span
              class="experiences__heading-text"
            >
              How do you want
            </span>
          </span>

          <span
            class="experiences__heading-line"
          >
            <span
              class="experiences__heading-text"
            >
              to experience
              the world?
            </span>
          </span>

        </h2>

      </div>


      <!-- ==================================================
           MAIN
      =================================================== -->

      <div class="experiences__main">

        <!-- ==================================================
             IMAGE CAROUSEL
        =================================================== -->

        <div
          ref="carouselRef"
          class="experiences__carousel"
        >

          <!-- ------------------------------------------
               PREVIOUS BUTTON
          ------------------------------------------- -->

          <button
            type="button"
            class="experiences__side-control experiences__side-control--previous"
            aria-label="Previous experience"
            @click="previousExperience"
          >
            <Icon
              name="lucide:arrow-left"
            />
          </button>


          <!-- ------------------------------------------
               EXPERIENCE CARDS
          ------------------------------------------- -->

          <NuxtLink
            v-for="(
              experience,
              index
            ) in experiences"
            :key="experience.slug"
            :to="`/experience/${experience.slug}`"
            class="experiences__card"
            :class="{
              'experiences__card--active':
                activeIndex === index,

              'experiences__card--previous':
                index === previousIndex,

              'experiences__card--next':
                index === nextIndex
            }"
            :aria-label="`Explore ${experience.name} experiences`"
          >

            <img
  :src="experience.image"
  :alt="experience.name"
  class="experiences__image"
  loading="eager"
  decoding="async"
/>

<div
  class="experiences__image-overlay"
 />

<div class="experiences__explore-button">
  Explore now
</div>

<div
  class="experiences__card-title"
>
  {{ experience.name }}
</div>

          </NuxtLink>


          <!-- ------------------------------------------
               NEXT BUTTON
          ------------------------------------------- -->

          <button
            type="button"
            class="experiences__side-control experiences__side-control--next"
            aria-label="Next experience"
            @click="nextExperience()"
          >
            <Icon
              name="lucide:arrow-right"
            />
          </button>

        </div>


        <!-- ==================================================
             DESCRIPTION
        =================================================== -->

        <div
          class="experiences__content"
        >

          <div
            class="experiences__content-inner"
          >

            <div
              class="experiences__description-mask"
            >

              <p
                ref="descriptionRef"
                class="experiences__description"
              >
                {{
                  activeExperience.description
                }}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  </section>
</template>


<style lang="scss" scoped>

@use '~/assets/scss/variables' as *;


// ============================================================
// SECTION
// ============================================================

.experiences {
  position: relative;

  min-height: 100svh;

  overflow: hidden;

  background: $color-charcoal;

  color: $color-ivory;
}


// ============================================================
// STAGE
// ============================================================

.experiences__stage {
  position: relative;

  width: 100%;

  min-height: 100svh;

  overflow: hidden;

  padding:
    clamp(55px, 5vw, 80px)
    var(--page-padding)
    clamp(60px, 5vw, 90px);
}


// ============================================================
// HEADER
// ============================================================

.experiences__top {
  position: relative;

  z-index: 20;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  width: 100%;

  text-align: center;
}


.experiences__eyebrow {
  margin: 0 0 18px;

  color:
    rgba(
      244,
      240,
      232,
      0.5
    );
}


.experiences__heading {
  max-width: 900px;

  margin: 0;

  color: $color-ivory;

  line-height: 0.9;

  letter-spacing: -0.04em;
}


.experiences__heading-line {
  display: block;

  overflow: hidden;

  padding-right: 0.16em;

  padding-bottom: 0.12em;
}


.experiences__heading-text {
  display: block;
  font-family: 'Bebas Neue', sans-serif;
    letter-spacing: 0.02em;
  will-change: transform;
}



// ============================================================
// MAIN
// ============================================================

.experiences__main {
  position: relative;

  z-index: 5;

  width: 100%;

  margin-top:
    clamp(
      48px,
      5vw,
      72px
    );
}


// ============================================================
// CAROUSEL
// ============================================================

.experiences__carousel {
  --center-width:
    clamp(
      620px,
      62vw,
      930px
    );

  --side-width:
    clamp(
      170px,
      16vw,
      240px
    );

  --carousel-height:
    clamp(
      430px,
      43vw,
      620px
    );

  --image-gap:
    clamp(
      7px,
      0.55vw,
      10px
    );

  position: relative;

  width: 100%;

  height: var(--carousel-height);

  overflow: hidden;
}


// ============================================================
// CARDS
// ============================================================

.experiences__card {
  position: absolute;

  top: 50%;

  left: 50%;

  height: var(--carousel-height);

  overflow: hidden;

  transform:
    translate(-50%, -50%);

  opacity: 0;

  z-index: 1;

  pointer-events: none;

  text-decoration: none;

  cursor: pointer;

  will-change:
    left,
    width,
    transform,
    opacity;

  transition:
    left 800ms
      cubic-bezier(
        0.22,
        1,
        0.36,
        1
      ),

    width 800ms
      cubic-bezier(
        0.22,
        1,
        0.36,
        1
      ),

    transform 800ms
      cubic-bezier(
        0.22,
        1,
        0.36,
        1
      ),

    opacity 650ms ease;
}


// ============================================================
// ACTIVE CENTER IMAGE
// ============================================================

.experiences__card--active {
  width: var(--center-width);

  left: 50%;

  transform:
    translate(-50%, -50%);

  opacity: 1;

  z-index: 5;

  pointer-events: auto;
}


// ============================================================
// PREVIOUS IMAGE
// ============================================================

.experiences__card--previous {
  width: var(--side-width);

  pointer-events: auto;

  left:
    calc(
      50%
      -
      (
        var(--center-width) / 2
      )
      -
      var(--image-gap)
      -
      (
        var(--side-width) / 2
      )
    );

  transform:
    translate(-50%, -50%);

  opacity: 1;

  z-index: 3;
}


// ============================================================
// NEXT IMAGE
// ============================================================

.experiences__card--next {
  width: var(--side-width);

  pointer-events: auto;

  left:
    calc(
      50%
      +
      (
        var(--center-width) / 2
      )
      +
      var(--image-gap)
      +
      (
        var(--side-width) / 2
      )
    );

  transform:
    translate(-50%, -50%);

  opacity: 1;

  z-index: 3;
}


// ============================================================
// IMAGE
// ============================================================

.experiences__image {
  display: block;

  width: 100%;

  height: 100%;

  object-fit: cover;

  object-position: center;

  transform:
    scale(1.005);

  will-change:
    transform;
}



// ============================================================
// OVERLAY
// ============================================================

.experiences__image-overlay {
  position: absolute;

  z-index: 2;

  inset: 0;

  pointer-events: none;

  background:
    linear-gradient(
      to top,
      rgba(
        7,
        7,
        6,
        0.76
      )
      0%,

      rgba(
        7,
        7,
        6,
        0.28
      )
      38%,

      rgba(
        7,
        7,
        6,
        0.03
      )
      72%,

      transparent
      100%
    );
}

// ============================================================
// EXPLORE NOW BUTTON
// ============================================================

.experiences__explore-button {
  position: absolute;

  top: 24px;

  right: 24px;

  z-index: 6;

  padding:
    12px
    12px;

  background: #fff;

  color: #000;

  border: none;

  border-radius: 0;

  font-family:
    'Bebas Neue',
    sans-serif;

  font-size: 20px;

  font-weight: 500;

  line-height: 0.6;

  letter-spacing: 0.04em;

  text-transform: uppercase;

  white-space: nowrap;

  opacity: 0;

  transform:
    translateY(-8px);

  pointer-events: none;

  transition:
    opacity 250ms ease,
    transform 250ms ease;
}


// ============================================================
// SHOW EXPLORE BUTTON ON IMAGE HOVER
// ============================================================

.experiences__card:hover
.experiences__explore-button {
  opacity: 1;

  transform:
    translateY(0);
}


// ============================================================
// TITLE OVER CENTER IMAGE
// ============================================================

.experiences__card-title {
  position: absolute;

  z-index: 4;

  bottom:
    clamp(
      30px,
      4vw,
      58px
    );

  left: 50%;

  width: 90%;

  transform:
    translateX(-50%);

  color: $color-ivory;

  font-family:
    'Bebas Neue',
    sans-serif;

  font-size:
    clamp(
      4rem,
      6vw,
      7rem
    );

  font-weight: 400;

  line-height: 0.84;

  letter-spacing: 0.04em;

  text-align: center;

  text-transform: uppercase;

  text-shadow:
    0 4px 28px
    rgba(
      0,
      0,
      0,
      0.42
    );

  pointer-events: none;
}


// ============================================================
// SIDE ARROWS
// ============================================================

.experiences__side-control {
  position: absolute;

  top: 50%;

  z-index: 20;

  display: grid;

  width: 54px;

  height: 54px;

  place-items: center;

  padding: 0;

  border: 1px solid rgba(15, 15, 13, 0.22);


  background: #000;

  color: #fff;

  cursor: pointer;


  transform:
    translateY(-50%);

  transition:
    background $transition-fast,
    color $transition-fast,
    border-color $transition-fast,
    transform $transition-medium;

  :deep(svg) {
    width: 18px;
    height: 18px;
  }

  &:hover {
    border-color: #fff;

    background: #fff;

    color: #000;

  }
}


// ============================================================
// PREVIOUS ARROW POSITION
// ============================================================

.experiences__side-control--previous {
  left:
    calc(
      50%
      -
      (
        var(--center-width) / 2
      )
      -
      var(--image-gap)
      -
      (
        var(--side-width) / 2
      )
    );
}


// ============================================================
// NEXT ARROW POSITION
// ============================================================

.experiences__side-control--next {
  left:
    calc(
      50%
      +
      (
        var(--center-width) / 2
      )
      +
      var(--image-gap)
      +
      (
        var(--side-width) / 2
      )
    );

  right: auto;
}


// ============================================================
// DESCRIPTION
// ============================================================

.experiences__content {
  position: relative;

  z-index: 10;

  display: flex;

  justify-content: center;

  width: 100%;

  margin-top:
    clamp(
      25px,
      3vw,
      40px
    );

  text-align: center;
}


.experiences__content-inner {
  width:
    min(
      100%,
      650px
    );
}


.experiences__description-mask {
  overflow: hidden;
}


.experiences__description {
  max-width: 620px;

  margin: 0 auto;

  color:
    rgba(
      244,
      240,
      232,
      0.68
    );

  font-family:
    'Manrope',
    sans-serif;

  font-size: 15px;

  line-height: 1.7;

  will-change:
    transform,
    opacity;
}


// ============================================================
// TABLET
// ============================================================

@media (max-width: 1100px) {

  .experiences__carousel {
    --center-width:
      clamp(
        540px,
        60vw,
        760px
      );

    --side-width:
      clamp(
        145px,
        15vw,
        200px
      );

    --carousel-height:
      clamp(
        420px,
        46vw,
        540px
      );
  }


  .experiences__side-control {
    width: 48px;

    height: 48px;
  }


  .experiences__card-title {
    font-size:
      clamp(
        3.5rem,
        6vw,
        5.5rem
      );
  }
}


// ============================================================
// MOBILE
// ============================================================

@media (max-width: 768px) {

  .experiences {
    min-height: auto;
  }


  .experiences__stage {
    min-height: auto;

    padding:
      76px
      var(--page-padding)
      70px;
  }


  .experiences__heading {
    max-width: 560px;
  }


  .experiences__main {
    margin-top: 44px;
  }


  .experiences__carousel {
    --center-width:
      min(
        82vw,
        430px
      );

    --side-width:
      0px;

    --image-gap: 0px;

    --carousel-height: 450px;

    overflow: hidden;
  }


  .experiences__card--previous,
  .experiences__card--next {
    width: var(--center-width);

    opacity: 0;

    pointer-events: none;
  }


  .experiences__card--previous {
    left: -100%;
  }


  .experiences__card--next {
    left: 200%;
  }


  .experiences__card--active {
    left: 50%;

    width: var(--center-width);
  }


  .experiences__card-title {
    bottom: 38px;

    font-size:
      clamp(
        3.5rem,
        15vw,
        5.5rem
      );
  }


  .experiences__side-control {
    width: 46px;

    height: 46px;
  }


  .experiences__side-control--previous {
    left: 12px;
  }


  .experiences__side-control--next {
    left: auto;

    right: 12px;
  }


  .experiences__content {
    margin-top: 28px;
  }


  .experiences__description {
    max-width: 500px;

    font-size: 14px;

    line-height: 1.65;
  }
}


// ============================================================
// SMALL MOBILE
// ============================================================

@media (max-width: 480px) {

  .experiences__stage {
    padding:
      66px
      var(--page-padding)
      60px;
  }


  .experiences__main {
    margin-top: 38px;
  }


  .experiences__carousel {
    --center-width: 84vw;

    --carousel-height: 400px;
  }


  .experiences__card-title {
    bottom: 30px;

    font-size:
      clamp(
        3.2rem,
        15vw,
        4.6rem
      );
  }


  .experiences__side-control {
    width: 42px;

    height: 42px;
  }


  .experiences__side-control--previous {
    left: 8px;
  }


  .experiences__side-control--next {
    right: 8px;
  }


  .experiences__description {
    font-size: 13.5px;
  }
}


// ============================================================
// REDUCED MOTION
// ============================================================

@media (
  prefers-reduced-motion: reduce
) {

  .experiences__card {
    transition: none;
  }

  .experiences__image {
    transition: none;
  }
}

</style>