<template>
    <main v-if="category" class="category-page">
        <SiteHeader />

        <section class="category-hero">

            <!-- CURRENT CATEGORY -->
            <div
                ref="heroCurrentSlide"
                class="category-hero__slide"
            >
                <div
                    ref="heroCurrentMedia"
                    class="category-hero__media"
                    :style="{ backgroundImage: `url(${category.image})` }"
                ></div>

                <div class="category-hero__overlay"></div>

                <div
                    ref="heroCurrentContent"
                    class="category-hero__content"
                >
                    <p class="category-hero__eyebrow">
                        EXPERIENCE
                    </p>

                    <h1 class="category-hero__title">
                        {{ category.name }}
                    </h1>

                    <p class="category-hero__description">
                        {{ category.description }}
                    </p>
                </div>
            </div>

            <!-- INCOMING CATEGORY -->
            <div
                v-if="heroIncomingCategory"
                ref="heroIncomingSlide"
                class="category-hero__slide category-hero__slide--incoming"
            >
                <div
                    ref="heroIncomingMedia"
                    class="category-hero__media"
                    :style="{ backgroundImage: `url(${heroIncomingCategory.image})` }"
                ></div>

                <div class="category-hero__overlay"></div>

                <div
                    ref="heroIncomingContent"
                    class="category-hero__content"
                >
                    <p class="category-hero__eyebrow">
                        EXPERIENCE
                    </p>

                    <h1 class="category-hero__title">
                        {{ heroIncomingCategory.name }}
                    </h1>

                    <p class="category-hero__description">
                        {{ heroIncomingCategory.description }}
                    </p>
                </div>
            </div>

            <button
                type="button"
                class="category-hero__control category-hero__control--prev"
                aria-label="Previous experience"
                :disabled="isHeroAnimating"
                @click="previousCategory"
            >
                <Icon name="lucide:arrow-left" />
            </button>

            <button
                type="button"
                class="category-hero__control category-hero__control--next"
                aria-label="Next experience"
                :disabled="isHeroAnimating"
                @click="nextCategory"
            >
                <Icon name="lucide:arrow-right" />
            </button>

            <div class="category-hero__progress" aria-hidden="true">
                <span
                    v-for="item in categories"
                    :key="item.slug"
                    class="category-hero__progress-dot"
                    :class="{
                        'is-active':
                            item.slug === (heroIncomingCategory?.slug ?? category.slug)
                    }"
                ></span>
            </div>

        </section>

        <section class="category-tours">
            <div class="category-tours__header">

                <h2 class="category-tours__heading">
                    {{ category.name }} Journeys
                </h2>

                <p class="category-tours__description">
                    Thoughtfully planned journeys across remarkable destinations,
                    selected around the way you want to experience the world.
                </p>
            </div>

            <div class="category-tours__slider">
                <button
                    type="button"
                    class="category-tours__control category-tours__control--prev"
                    aria-label="Previous tours"
                    @click="previousTour"
                >
                    <Icon name="lucide:arrow-left" />
                </button>

                <div ref="sliderViewport" class="category-tours__viewport">
                    <div
                        class="category-tours__track"
                        :class="{ 'category-tours__track--reset': isResetting }"
                        :style="{ transform: `translate3d(-${currentIndex * slideOffset}px, 0, 0)` }"
                        @transitionend="handleTransitionEnd"
                    >
                        <article
                            v-for="(tour, index) in sliderTours"
                            :key="`${tour.id}-${index}`"
                            class="tour-card"
                        >
                            <div class="tour-card__image">
                                <img :src="tour.image" :alt="tour.title" loading="lazy" />
                            </div>

                            <div class="tour-card__content">
                                <p class="tour-card__meta">
                                    {{ tour.duration }}
                                </p>

                                <h3 class="tour-card__title">
                                    {{ tour.title }}
                                </h3>

                                <p class="tour-card__route">
                                    {{ tour.route }}
                                </p>

                                <p class="tour-card__description">
                                    {{ tour.description }}
                                </p>

                                <NuxtLink
                                    :to="`/contact?experience=${category.slug}&tour=${tour.id}`"
                                    class="tour-card__button"
                                >
                                    <span>Plan This Journey</span>
                                    <Icon name="lucide:arrow-right" />
                                </NuxtLink>
                            </div>
                        </article>
                    </div>
                </div>

                <button
                    type="button"
                    class="category-tours__control category-tours__control--next"
                    aria-label="Next tours"
                    @click="nextTour"
                >
                    <Icon name="lucide:arrow-right" />
                </button>
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import gsap from 'gsap'
import SiteHeader from '~/components/layout/SiteHeader.vue'

interface Tour {
    id: string
    title: string
    duration: string
    route: string
    description: string
    image: string
}

interface Category {
    name: string
    slug: string
    description: string
    image: string
    tours: Tour[]
}


interface SupportPage {
    title: string
    eyebrow: string
    description: string
    image: string
    intro: string
    points: string[]
    cta: string
}

const categories: Category[] = [
    {
        name: 'Spiritual',
        slug: 'spiritual',
        description:
            'Journeys of meaning shaped by sacred places, living traditions and moments of reflection.',
        image: '/images/experiences/spiritual.jpg',
        tours: [
            {
                id: 'sacred-south-america',
                title: 'Sacred South America',
                duration: '8 NIGHTS / 9 DAYS',
                route: 'Argentina · Bolivia · Brazil',
                description:
                    'A reflective journey through remarkable landscapes, cultural traditions and places of spiritual significance.',
                image: '/images/experiences/spiritual.jpg'
            },
            {
                id: 'japan-and-bali',
                title: 'Temples & Traditions',
                duration: '7 NIGHTS / 8 DAYS',
                route: 'Japan · Indonesia',
                description:
                    'Discover ancient temples, contemplative spaces and enduring traditions across Japan and Indonesia.',
                image: '/images/experiences/spiritual.jpg'
            },
            {
                id: 'sacred-asia',
                title: 'Sacred Asia',
                duration: '9 NIGHTS / 10 DAYS',
                route: 'Singapore · Malaysia · Japan',
                description:
                    'A cultural and spiritual journey through historic temples, rituals and extraordinary Asian cities.',
                image: '/images/experiences/spiritual.jpg'
            }
        ]
    },

    {
        name: 'Wellness',
        slug: 'wellness',
        description:
            'Slow down and reconnect through restorative landscapes, mindful stays and thoughtfully paced journeys.',
        image: '/images/experiences/wellness.jpg',
        tours: [
            {
                id: 'wellness-bali',
                title: 'Bali Wellness Escape',
                duration: '6 NIGHTS / 7 DAYS',
                route: 'Indonesia',
                description:
                    'A restorative escape combining peaceful landscapes, wellness traditions and time to slow down.',
                image: '/images/experiences/wellness.jpg'
            },
            {
                id: 'japan-wellness',
                title: 'Japan Renewal',
                duration: '7 NIGHTS / 8 DAYS',
                route: 'Japan',
                description:
                    'Experience a slower side of Japan through serene surroundings, traditional rituals and considered stays.',
                image: '/images/experiences/wellness.jpg'
            },
            {
                id: 'switzerland-wellness',
                title: 'Alpine Wellbeing',
                duration: '6 NIGHTS / 7 DAYS',
                route: 'Switzerland',
                description:
                    'Mountain landscapes, quiet retreats and restorative days create an unhurried Swiss escape.',
                image: '/images/experiences/wellness.jpg'
            }
        ]
    },

    {
        name: 'Adventure',
        slug: 'adventure',
        description:
            'Venture beyond the familiar through dramatic landscapes, active discoveries and unforgettable routes.',
        image: '/images/experiences/adventure.jpg',
        tours: [
            {
                id: 'patagonia-adventure',
                title: 'Patagonia Adventure',
                duration: '8 NIGHTS / 9 DAYS',
                route: 'Argentina',
                description:
                    'Explore dramatic landscapes and remarkable wilderness on an immersive Argentine adventure.',
                image: '/images/experiences/adventure.jpg'
            },
            {
                id: 'bolivia-highlands',
                title: 'Bolivian Highlands',
                duration: '7 NIGHTS / 8 DAYS',
                route: 'Bolivia',
                description:
                    'Discover high-altitude landscapes, remote routes and extraordinary natural scenery across Bolivia.',
                image: '/images/experiences/adventure.jpg'
            },
            {
                id: 'alpine-adventure',
                title: 'Alpine Discovery',
                duration: '6 NIGHTS / 7 DAYS',
                route: 'Switzerland · France · Italy',
                description:
                    'A journey through dramatic Alpine scenery, historic towns and memorable mountain experiences.',
                image: '/images/experiences/adventure.jpg'
            }
        ]
    },

    {
        name: 'Wildlife',
        slug: 'wildlife',
        description:
            'Encounter extraordinary habitats and natural landscapes through carefully considered wildlife journeys.',
        image: '/images/experiences/wildlife.jpg',
        tours: [
            {
                id: 'patagonia-wildlife',
                title: 'Patagonia Wildlife',
                duration: '7 NIGHTS / 8 DAYS',
                route: 'Argentina',
                description:
                    'Discover remarkable landscapes and wildlife habitats across the wild southern reaches of Argentina.',
                image: '/images/experiences/wildlife.jpg'
            },
            {
                id: 'brazil-wildlife',
                title: 'Brazilian Wilderness',
                duration: '8 NIGHTS / 9 DAYS',
                route: 'Brazil',
                description:
                    'Explore Brazil through extraordinary natural environments and immersive wildlife experiences.',
                image: '/images/experiences/wildlife.jpg'
            },
            {
                id: 'south-africa-wildlife',
                title: 'South Africa Wildlife',
                duration: '8 NIGHTS / 9 DAYS',
                route: 'South Africa',
                description:
                    'A wildlife-focused journey through extraordinary landscapes and some of South Africa’s remarkable natural environments.',
                image: '/images/experiences/wildlife.jpg'
            },
            {
                id: 'wild-russia',
                title: 'Wild Russia',
                duration: '9 NIGHTS / 10 DAYS',
                route: 'Russia',
                description:
                    'Experience vast landscapes and remote natural environments across Russia.',
                image: '/images/experiences/wildlife.jpg'
            }
        ]
    },

    {
        name: 'Culinary',
        slug: 'culinary',
        description:
            'Discover destinations through their flavours, local traditions and unforgettable dining experiences.',
        image: '/images/experiences/culinary.jpg',
        tours: [
            {
                id: 'italian-table',
                title: 'The Italian Table',
                duration: '6 NIGHTS / 7 DAYS',
                route: 'Italy',
                description:
                    'Explore Italy through regional flavours, beautiful cities and memorable culinary experiences.',
                image: '/images/experiences/culinary.jpg'
            },
            {
                id: 'french-flavours',
                title: 'French Flavours',
                duration: '6 NIGHTS / 7 DAYS',
                route: 'France',
                description:
                    'A journey through French food traditions, celebrated cities and intimate local experiences.',
                image: '/images/experiences/culinary.jpg'
            },
            {
                id: 'japan-at-the-table',
                title: 'Japan At The Table',
                duration: '7 NIGHTS / 8 DAYS',
                route: 'Japan',
                description:
                    'Experience Japanese culture through its food, markets, traditions and beautifully considered meals.',
                image: '/images/experiences/culinary.jpg'
            }
        ]
    },

    {
        name: 'Cultural',
        slug: 'cultural',
        description:
            'Step into living traditions, remarkable architecture and stories that reveal the character of a place.',
        image: '/images/experiences/cultural.jpg',
        tours: [
            {
                id: 'european-culture',
                title: 'European Cultural Journey',
                duration: '8 NIGHTS / 9 DAYS',
                route: 'Spain · France · Italy',
                description:
                    'Experience iconic cities, historic architecture and living traditions across Europe.',
                image: '/images/experiences/cultural.jpg'
            },
            {
                id: 'japan-traditions',
                title: 'Japan Through Tradition',
                duration: '7 NIGHTS / 8 DAYS',
                route: 'Japan',
                description:
                    'Discover temples, craftsmanship, historic neighbourhoods and enduring Japanese traditions.',
                image: '/images/experiences/cultural.jpg'
            },
            {
                id: 'south-america-culture',
                title: 'South American Stories',
                duration: '8 NIGHTS / 9 DAYS',
                route: 'Argentina · Bolivia · Brazil',
                description:
                    'Explore diverse cultures, landscapes and stories across three remarkable South American countries.',
                image: '/images/experiences/cultural.jpg'
            }
        ]
    },

    {
        name: 'Luxury',
        slug: 'luxury',
        description:
            'Exceptional stays, private access and beautifully considered details create journeys defined by effortless comfort.',
        image: '/images/experiences/luxury.jpg',
        tours: [
            {
                id: 'dubai-abu-dhabi',
                title: 'Emirates In Style',
                duration: '5 NIGHTS / 6 DAYS',
                route: 'Dubai · Abu Dhabi',
                description:
                    'A refined UAE journey combining exceptional stays, remarkable architecture and private experiences.',
                image: '/images/experiences/luxury.jpg'
            },
            {
                id: 'alpine-luxury',
                title: 'Alpine Luxury',
                duration: '6 NIGHTS / 7 DAYS',
                route: 'Switzerland · France · Italy',
                description:
                    'An elegant journey through the Alps with exceptional stays and beautifully considered experiences.',
                image: '/images/experiences/luxury.jpg'
            },
            {
                id: 'singapore-luxury',
                title: 'Singapore & Beyond',
                duration: '6 NIGHTS / 7 DAYS',
                route: 'Singapore · Malaysia',
                description:
                    'A sophisticated Asian escape combining modern city life, distinctive stays and cultural discovery.',
                image: '/images/experiences/luxury.jpg'
            }
        ]
    },

    {
        name: 'Romance',
        slug: 'romance',
        description:
            'Private moments, beautiful settings and thoughtfully designed journeys created to be experienced together.',
        image: '/images/experiences/romance.jpg',
        tours: [
            {
                id: 'european-romance',
                title: 'European Romance',
                duration: '7 NIGHTS / 8 DAYS',
                route: 'France · Switzerland · Italy',
                description:
                    'A romantic European journey through beautiful cities, scenic landscapes and intimate experiences.',
                image: '/images/experiences/romance.jpg'
            },
            {
                id: 'spain-and-france',
                title: 'Spanish & French Escape',
                duration: '6 NIGHTS / 7 DAYS',
                route: 'Spain · France',
                description:
                    'Slow days, beautiful settings and unforgettable moments across two iconic European destinations.',
                image: '/images/experiences/romance.jpg'
            },
            {
                id: 'dubai-romance',
                title: 'Desert & City Romance',
                duration: '5 NIGHTS / 6 DAYS',
                route: 'Dubai · Abu Dhabi',
                description:
                    'A refined escape combining dramatic desert landscapes, exceptional stays and city experiences.',
                image: '/images/experiences/romance.jpg'
            }
        ]
    },

    {
        name: 'Family',
        slug: 'family',
        description:
            'Meaningful adventures for every generation, shaped around shared discovery, comfort and time together.',
        image: '/images/experiences/family.jpg',
        tours: [
            {
                id: 'family-europe',
                title: 'European Family Discovery',
                duration: '7 NIGHTS / 8 DAYS',
                route: 'Spain · France · Switzerland',
                description:
                    'A comfortable family journey balancing iconic sights, shared experiences and time to explore.',
                image: '/images/experiences/family.jpg'
            },
            {
                id: 'family-singapore-malaysia',
                title: 'Singapore & Malaysia Family Escape',
                duration: '6 NIGHTS / 7 DAYS',
                route: 'Singapore · Malaysia',
                description:
                    'A family-friendly journey combining vibrant cities, cultural discovery and memorable experiences.',
                image: '/images/experiences/family.jpg'
            },
            {
                id: 'family-japan',
                title: 'Japan Family Adventure',
                duration: '7 NIGHTS / 8 DAYS',
                route: 'Japan',
                description:
                    'Discover Japan through a thoughtfully paced family journey filled with culture, food and discovery.',
                image: '/images/experiences/family.jpg'
            }
        ]
    }
]

const route = useRoute()
const router = useRouter()

const heroCurrentSlide = ref<HTMLElement | null>(null)
const heroCurrentMedia = ref<HTMLElement | null>(null)
const heroCurrentContent = ref<HTMLElement | null>(null)

const heroIncomingSlide = ref<HTMLElement | null>(null)
const heroIncomingMedia = ref<HTMLElement | null>(null)
const heroIncomingContent = ref<HTMLElement | null>(null)

const heroIncomingCategory = ref<Category | null>(null)

const isHeroAnimating = ref(false)
const heroDirection = ref<'next' | 'prev'>('next')
const heroAnimationDuration = 0.9

const category = computed(() => {
    return categories.find(
        item => item.slug === String(route.params.category).toLowerCase()
    )
})

const getCategoryIndex = () => {
    const currentSlug = String(route.params.category).toLowerCase()

    return categories.findIndex(
        item => item.slug === currentSlug
    )
}

const preloadImage = (src: string) => {
    return new Promise<void>((resolve) => {
        const image = new Image()

        image.onload = () => resolve()
        image.onerror = () => resolve()
        image.src = src
    })
}

const preloadCategoryImages = () => {
    categories.forEach(item => {
        const image = new Image()
        image.src = item.image
    })
}

const goToCategory = async (direction: 'next' | 'prev') => {
    if (isHeroAnimating.value) return

    const currentIndex = getCategoryIndex()

    if (currentIndex === -1) return

    const nextIndex =
        direction === 'next'
            ? (currentIndex + 1) % categories.length
            : (currentIndex - 1 + categories.length) % categories.length

    const nextCategory = categories[nextIndex]

    heroDirection.value = direction
    isHeroAnimating.value = true

    // Make sure the next image is decoded/loaded before the transition starts.
    await preloadImage(nextCategory.image)

    heroIncomingCategory.value = nextCategory

    await nextTick()

    if (
        !heroCurrentSlide.value ||
        !heroCurrentMedia.value ||
        !heroCurrentContent.value ||
        !heroIncomingSlide.value ||
        !heroIncomingMedia.value ||
        !heroIncomingContent.value
    ) {
        heroIncomingCategory.value = null
        isHeroAnimating.value = false
        return
    }

    const directionSign = direction === 'next' ? 1 : -1

    // Incoming slide is already mounted and its image is already cached.
    gsap.set(heroIncomingSlide.value, {
        xPercent: directionSign * 100,
        opacity: 1
    })

    gsap.set(heroIncomingMedia.value, {
        xPercent: directionSign * 8,
        scale: 1.08
    })

    gsap.set(heroIncomingContent.value, {
        xPercent: directionSign * 18,
        opacity: 0
    })

    gsap.set(heroCurrentSlide.value, {
        xPercent: 0,
        opacity: 1
    })

    gsap.set(heroCurrentMedia.value, {
        xPercent: 0,
        scale: 1
    })

    gsap.set(heroCurrentContent.value, {
        xPercent: 0,
        opacity: 1
    })

    const timeline = gsap.timeline({
        onComplete: async () => {
            await router.push(`/experience/${nextCategory.slug}`)

            await nextTick()

            heroIncomingCategory.value = null
            isHeroAnimating.value = false

            gsap.set(heroCurrentSlide.value, {
                xPercent: 0,
                opacity: 1
            })

            gsap.set(heroCurrentMedia.value, {
                xPercent: 0,
                scale: 1
            })

            gsap.set(heroCurrentContent.value, {
                xPercent: 0,
                opacity: 1
            })
        }
    })

    timeline
        // Current image and text leave together.
        .to(
            heroCurrentSlide.value,
            {
                xPercent: -directionSign * 100,
                duration: heroAnimationDuration,
                ease: 'power4.inOut'
            },
            0
        )
        .to(
            heroCurrentMedia.value,
            {
                xPercent: -directionSign * 8,
                scale: 1.02,
                duration: heroAnimationDuration,
                ease: 'power3.inOut'
            },
            0
        )
        .to(
            heroCurrentContent.value,
            {
                xPercent: -directionSign * 18,
                opacity: 0,
                duration: heroAnimationDuration * 0.9,
                ease: 'power3.inOut'
            },
            0
        )

        // New image and text enter at the same time.
        .to(
            heroIncomingSlide.value,
            {
                xPercent: 0,
                duration: heroAnimationDuration,
                ease: 'power4.inOut'
            },
            0
        )
        .to(
            heroIncomingMedia.value,
            {
                xPercent: 0,
                scale: 1,
                duration: heroAnimationDuration,
                ease: 'power3.out'
            },
            0
        )
        .to(
            heroIncomingContent.value,
            {
                xPercent: 0,
                opacity: 1,
                duration: heroAnimationDuration * 0.92,
                ease: 'power3.out'
            },
            0.05
        )
}

const nextCategory = () => {
    void goToCategory('next')
}

const previousCategory = () => {
    void goToCategory('prev')
}

const visibleSlides = ref(3)
const currentIndex = ref(0)
const sliderViewport = ref<HTMLElement | null>(null)
const slideOffset = ref(0)

const categoryWithTours = computed(() => {
  if (!category.value) return null

  const baseTours = category.value.tours ?? []
  const fallbacks = [
    {
      id: 'journey-4',
      title: `${category.value.name} Discovery`,
      duration: '7 NIGHTS / 6 DAYS',
      route: category.value.tours?.[0]?.route ?? '',
      description: `A curated ${String(category.value.name).toLowerCase()} journey across remarkable destinations.`,
      image: category.value.image
    },
    {
      id: 'journey-5',
      title: `${category.value.name} Escape`,
      duration: '5 NIGHTS / 4 DAYS',
      route: category.value.tours?.[category.value.tours.length - 1]?.route ?? '',
      description: `A thoughtfully planned ${String(category.value.name).toLowerCase()} escape with memorable experiences.`,
      image: category.value.image
    }
  ]

  return {
    ...category.value,
    tours: [...baseTours, ...fallbacks].slice(0, 5)
  }
})

const isResetting = ref(false)

const sliderTours = computed(() => {
    const tours = categoryWithTours.value?.tours ?? []

    if (tours.length <= visibleSlides.value) {
        return tours
    }

    return [...tours, ...tours.slice(0, visibleSlides.value)]
})

const updateVisibleSlides = () => {
    if (typeof window === 'undefined') return

    if (window.innerWidth <= 700) {
        visibleSlides.value = 1
    } else if (window.innerWidth <= 1000) {
        visibleSlides.value = 2
    } else {
        visibleSlides.value = 3
    }

    currentIndex.value = 0

    nextTick(updateSliderMetrics)
}

const updateSliderMetrics = () => {
    const viewport = sliderViewport.value

    if (!viewport) return

    const gap = window.innerWidth <= 700
        ? 0
        : window.innerWidth <= 1000
            ? 20
            : 24

    slideOffset.value =
        (viewport.clientWidth - gap * (visibleSlides.value - 1)) /
            visibleSlides.value +
        gap
}

const nextTour = () => {
    if ((categoryWithTours.value?.tours.length ?? 0) <= visibleSlides.value) return

    isResetting.value = false
    currentIndex.value += 1
}

const previousTour = () => {
    const totalTours = categoryWithTours.value?.tours.length ?? 0

    if (totalTours <= visibleSlides.value) return

    if (currentIndex.value === 0) {
        isResetting.value = true
        currentIndex.value = totalTours

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                isResetting.value = false
                currentIndex.value = totalTours - 1
            })
        })

        return
    }

    isResetting.value = false
    currentIndex.value -= 1
}

const handleTransitionEnd = () => {
    const totalTours = categoryWithTours.value?.tours.length ?? 0

    if (totalTours <= visibleSlides.value) return

    if (currentIndex.value >= totalTours) {
        isResetting.value = true
        currentIndex.value = 0

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                isResetting.value = false
            })
        })
    }
}

watch(
    () => route.params.category,
    async () => {
        currentIndex.value = 0

        await nextTick()

        updateSliderMetrics()

        if (!isHeroAnimating.value) {
            heroIncomingCategory.value = null

            gsap.set(
                [
                    heroCurrentSlide.value,
                    heroCurrentMedia.value,
                    heroCurrentContent.value
                ],
                {
                    clearProps: 'transform,opacity'
                }
            )
        }
    }
)

onMounted(() => {
    updateVisibleSlides()

    // Preload every category image so subsequent hero transitions
    // never wait for the network after the slide has started.
    preloadCategoryImages()

    nextTick(() => {
        updateSliderMetrics()

        gsap.set(
            [
                heroCurrentSlide.value,
                heroCurrentMedia.value,
                heroCurrentContent.value
            ],
            {
                xPercent: 0,
                opacity: 1
            }
        )

        gsap.set(heroCurrentMedia.value, {
            scale: 1
        })
    })

    window.addEventListener('resize', updateVisibleSlides)
})

onUnmounted(() => {
    window.removeEventListener('resize', updateVisibleSlides)

    gsap.killTweensOf([
        heroCurrentSlide.value,
        heroCurrentMedia.value,
        heroCurrentContent.value,
        heroIncomingSlide.value,
        heroIncomingMedia.value,
        heroIncomingContent.value
    ])
})

useSeoMeta({
    title: () => `${category.value?.name ?? 'Experience'} Journeys | Vedic Journey`,
    description: () =>
        category.value?.description ??
        'Explore curated journeys with Vedic Journey.'
})
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.category-page {
    min-height: 100svh;
    background: $color-ivory;
    color: $color-charcoal;
}

.category-hero {
    position: relative;

    min-height: 68svh;

    overflow: hidden;

    background: $color-charcoal;

    color: $color-ivory-light;
    isolation: isolate;

    &__slide {
        position: absolute;
        inset: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        padding:
            150px var(--page-padding) 90px;

        overflow: hidden;

        will-change: transform, opacity;

        z-index: 1;

        &--incoming {
            z-index: 2;
        }
    }

    &__media {
        position: absolute;
        inset: -2%;

        z-index: 0;

        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;

        will-change: transform;
    }

    &__overlay {
        position: absolute;
        inset: 0;
        z-index: 1;

        background: rgba(7, 7, 6, 0.56);
    }

    &__content {
        position: relative;
        z-index: 2;

        width: 100%;
        max-width: 900px;

        margin-inline: auto;

        text-align: center;

        will-change: transform, opacity;
    }

    &__eyebrow {
        margin: 0 0 20px;

        font-family: 'Manrope', sans-serif;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.16em;
        text-transform: uppercase;

        color: rgba(250, 248, 243, 0.72);
    }

    &__title {
        margin: 0;

        font-family: 'Bebas Neue', sans-serif;
        font-size: clamp(5rem, 11vw, 10rem);
        font-weight: 400;
        line-height: 0.82;
        letter-spacing: 0.02em;

        color: #fff;
    }

    &__description {
        max-width: 650px;

        margin: 38px auto 0;

        font-family: 'Manrope', sans-serif;
        font-size: var(--fs-body);
        font-weight: 400;
        line-height: 1.7;

        color: rgba(250, 248, 243, 0.9);
    }

    &__control {
        position: absolute;
        top: 50%;
        z-index: 5;

        display: inline-flex;
        align-items: center;
        justify-content: center;

        width: 52px;
        height: 52px;

        padding: 0;

        border: 1px solid rgba(250, 248, 243, 0.58);
        border-radius: 0;

        background: rgba(7, 7, 6, 0.12);
        color: $color-ivory-light;

        transform: translateY(-50%);

        cursor: pointer;

        transition:
            background $transition-fast,
            border-color $transition-fast,
            color $transition-fast;

        :deep(svg) {
            width: 19px;
            height: 19px;

            transition: none;
        }

        &:hover {
            background: $color-ivory-light;
            border-color: $color-ivory-light;
            color: $color-charcoal;
        }

        &:disabled {
            opacity: 0.55;
            cursor: default;
        }

        &--prev {
            left: clamp(24px, 4vw, 64px);
        }

        &--next {
            right: clamp(24px, 4vw, 64px);
        }
    }

    &__progress {
        position: absolute;
        left: 50%;
        bottom: 30px;
        z-index: 5;

        display: flex;
        align-items: center;
        gap: 7px;

        transform: translateX(-50%);
    }

    &__progress-dot {
        display: block;

        width: 5px;
        height: 5px;

        border-radius: 50%;

        background: rgba(250, 248, 243, 0.38);

        transition:
            width $transition-fast,
            background $transition-fast;

        &.is-active {
            width: 22px;
            border-radius: 999px;
            background: $color-ivory-light;
        }
    }
}

.category-tours {
    padding:
        clamp(90px, 10vw, 140px) var(--page-padding) clamp(100px, 12vw, 170px);

    &__header {
        width: 100%;
        max-width: 760px;

        margin:
            0 auto clamp(50px, 6vw, 75px);

        text-align: center;
    }

    &__eyebrow {
        margin: 0 0 18px;

        font-family: 'Manrope', sans-serif;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.16em;
        text-transform: uppercase;

        color: $color-text-muted;
    }

    &__heading {
        margin: 0;

        font-family: 'Bebas Neue', sans-serif;
        font-size: clamp(3.8rem, 6vw, 6.8rem);
        font-weight: 400;
        line-height: 0.86;
        letter-spacing: 0.02em;

        color: $color-charcoal;
    }

    &__description {
        max-width: 620px;

        margin: 25px auto 0;

        font-family: 'Manrope', sans-serif;
        font-size: var(--fs-body);
        font-weight: 400;
        line-height: 1.7;

        color: $color-text-muted;
    }

    &__slider {
        position: relative;

        width: 100%;
        max-width: 1280px;

        margin-inline: auto;

        padding-inline: 58px;
    }

    &__viewport {
        width: 100%;
        overflow: hidden;
    }

    &__track {
        display: flex;
        align-items: stretch;
        gap: 24px;

        width: 100%;

        transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);

        &--reset {
            transition: none;
        }
    }

    &__control {
        position: absolute;
        z-index: 3;
        top: 50%;

        display: grid;
        place-items: center;

        width: 42px;
        height: 42px;

        padding: 0;

        border: 1px solid rgba($color-charcoal, 0.3);
        border-radius: 0;

        background: transparent;
        color: $color-charcoal;

        cursor: pointer;

        transform: translateY(-50%);

        transition:
            background $transition-fast,
            color $transition-fast,
            border-color $transition-fast;

        :deep(svg) {
            width: 16px;
            height: 16px;
        }

        &:hover {
            background: $color-charcoal;
            color: $color-ivory;
            border-color: $color-charcoal;
        }

        &--prev {
            left: 0;
        }

        &--next {
            right: 0;
        }
    }
}

.tour-card {
    flex: 0 0 calc((100% - 48px) / 3);

    box-sizing: border-box;

    display: flex;
    flex-direction: column;

    min-width: 0;
    overflow: hidden;

    border: 1px solid rgba($color-charcoal, 0.14);

    background: $color-ivory-light;

    &__image {
        width: 100%;
        aspect-ratio: 1.55 / 1;
        overflow: hidden;

        flex-shrink: 0;

        background: $color-charcoal;

        img {
            display: block;

            width: 100%;
            height: 100%;

            object-fit: cover;

            transition: transform $transition-fast;
        }
    }

    &__content {
        display: flex;
        flex: 1;
        flex-direction: column;

        min-height: 390px;
        padding: 30px 30px 30px;
    }

    &__meta {
        margin: 0 0 14px;

        font-family: 'Manrope', sans-serif;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.12em;
        text-transform: uppercase;

        color: $color-text-muted;
    }

    &__title {
        margin: 0;

        font-family: 'Bebas Neue', sans-serif;
        font-size: clamp(2.5rem, 3.4vw, 3.8rem);
        font-weight: 400;
        line-height: 0.9;
        letter-spacing: 0.02em;

        color: $color-charcoal;
    }

    &__route {
        margin: 18px 0 0;

        font-family: 'Manrope', sans-serif;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;

        color: $color-charcoal;
    }

    &__description {
        margin: 16px 0 0;

        font-family: 'Manrope', sans-serif;
        font-size: var(--fs-body);
        font-weight: 400;
        line-height: 1.7;

        color: $color-text-muted;
    }

    &__button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        align-self: center;
        gap: 14px;

        width: max-content;
        min-width: 185px;

        margin-top: auto;
        padding: 14px 20px;

        border: 1px solid $color-charcoal;
        border-radius: 0;

        background: $color-charcoal;
        color: $color-ivory;

        font-family: 'Manrope', sans-serif;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        text-decoration: none;

        transition:
            background $transition-fast,
            color $transition-fast,
            border-color $transition-fast;

        :deep(svg) {
            width: 16px;
            height: 16px;
        }

        &:hover {
            background: transparent;
            color: $color-charcoal;
            border-color: $color-charcoal;
        }
    }

    &:hover {
        .tour-card__image img {
            transform: scale(1.03);
        }
    }
}

@media (max-width: 1000px) {
    .category-tours__slider {
        padding-inline: 52px;
    }

    .category-tours__track {
        gap: 20px;
    }

    .tour-card {
        flex-basis: calc((100% - 20px) / 2);

        &__content {
            min-height: 360px;
            padding: 26px;
        }
    }
}

@media (max-width: 700px) {
    .category-hero {
        min-height: 62svh;

        &__slide {
            padding:
                130px var(--page-padding) 70px;
        }

        &__control {
            width: 44px;
            height: 44px;

            &--prev {
                left: 16px;
            }

            &--next {
                right: 16px;
            }
        }

        &__progress {
            bottom: 22px;
        }
    }

    .category-tours__slider {
        padding-inline: 48px;
    }

    .category-tours__track {
        gap: 0;
    }

    .tour-card {
        flex-basis: 100%;

        &__content {
            min-height: 330px;
            padding: 26px;
        }
    }
}
</style>
