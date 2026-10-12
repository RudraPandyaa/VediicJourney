<template>
  <main class="journey-page">
    <SiteHeader />

    <!-- HERO -->
    <section class="journey-hero">
      <div class="journey-hero__content">

        <h1 class="journey-hero__heading heading-xl">
          Discover the world's most
          <br />
          extraordinary destinations.
        </h1>
      </div>
    </section>

    <!-- =========================================================
         INTERACTIVE WORLD SECTION
    ========================================================== -->
    <section
      ref="worldSection"
      class="world-section"
    >
      <div class="world-section__inner">

        <!-- LEFT : 3D EARTH -->
        <div class="world-globe">
          <div
            class="world-globe__stage"
            @mouseenter="handleGlobeMouseEnter"
            @mouseleave="handleGlobeMouseLeave"
            @mousemove="handleGlobeMouseMove"
            @click="handleGlobeClick"
          >
            <div
              ref="globeContainer"
              class="world-globe__canvas"
            />

            <!-- Country pins legend -->
            <transition name="fade">
              <div
                v-if="showPins"
                class="world-globe__hint"
              >
                <span class="world-globe__hint-dot"></span>
                Hover to discover destinations
              </div>
            </transition>
          </div>

          <!-- Controls sit completely below the earth -->
          <div class="world-globe__controls">
            <button
              type="button"
              class="world-globe__control"
              aria-label="Previous destination"
              @click="previousContinent"
            >
              <Icon name="lucide:arrow-left" />
            </button>

            <div class="world-globe__progress">
              <span
                v-for="(continent, index) in continents"
                :key="continent.slug"
                class="world-globe__progress-dot"
                :class="{
                  'is-active': index === activeIndex
                }"
                @click="selectContinent(index)"
              />
            </div>

            <button
              type="button"
              class="world-globe__control"
              aria-label="Next destination"
              @click="nextContinent"
            >
              <Icon name="lucide:arrow-right" />
            </button>
          </div>
        </div>

        <!-- RIGHT : INFORMATION -->
        <div class="world-content">

          <p class="world-content__eyebrow">
            {{ String(activeIndex + 1).padStart(2, '0') }}
            / {{ String(continents.length).padStart(2, '0') }}
          </p>

          <div class="world-content__heading-wrap">
            <transition
              name="content-slide"
              mode="out-in"
            >
              <h2
                :key="activeContinent.name"
                class="world-content__title"
              >
                {{ activeContinent.name }}
              </h2>
            </transition>
          </div>

          <div class="world-content__line"></div>

          <transition
            name="content-fade"
            mode="out-in"
          >
            <p
              :key="activeContinent.description"
              class="world-content__description body-large"
            >
              {{ activeContinent.description }}
            </p>
          </transition>

          <!-- Country list -->
          <transition
            name="content-fade"
            mode="out-in"
          >
            <div
              :key="activeContinent.slug"
              class="world-content__countries"
            >
              <span
                v-for="country in activeContinent.countries"
                :key="country.name"
                class="world-content__country"
              >
                <span class="world-content__country-dot"></span>
                {{ country.name }}
              </span>
            </div>
          </transition>

          <NuxtLink
            :to="`/destinations/${activeContinent.slug}`"
            class="world-content__explore"
          >
            <span>
              Explore {{ activeContinent.name }}
            </span>

            <span class="world-content__explore-arrow">
              <Icon name="lucide:arrow-right" />
            </span>
          </NuxtLink>

        </div>
      </div>
    </section>  
    <!-- =========================================================
         CONTINENT DESTINATIONS
    ========================================================== -->
    <section class="continent-grid-section">
      <div class="continent-grid-section__inner">

        <div class="continent-grid-section__heading">

          <h2 class="continent-grid-section__title">
            EXPLORE BY CONTINENT
          </h2>
        </div>

        <div class="continent-grid">
          <NuxtLink
            v-for="continent in continentCards"
            :key="continent.slug"
            :to="`/destinations/${continent.slug}`"
            class="continent-card"
          >
            <div class="continent-card__image">
              <img
                :src="continent.image"
                :alt="continent.name"
                loading="lazy"
              />

              <div class="continent-card__overlay"></div>

              <h3 class="continent-card__title">
                {{ continent.name }}
              </h3>

              <span class="continent-card__explore">
                Explore
                <Icon name="lucide:arrow-right" />
              </span>
            </div>
          </NuxtLink>
        </div>

      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  nextTick
} from 'vue'

import gsap from 'gsap'
import * as THREE from 'three'
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

import SiteHeader from '~/components/layout/SiteHeader.vue'

/* ============================================================
   TYPES
============================================================ */

interface CountryPoint {
  name: string
  lat: number
  lon: number
}

interface Continent {
  name: string
  slug: string
  description: string
  countries: CountryPoint[]
  lat: number
  lon: number
}

/* ============================================================
   DESTINATION DATA
============================================================ */

const continents: Continent[] = [
  {
    name: 'Asia',
    slug: 'asia',
    description:
      'Ancient traditions, soulful landscapes and extraordinary cultures come together in journeys shaped with depth, warmth and discovery.',
    lat: 28,
    lon: 85,
    countries: [
      { name: 'India', lat: 20.5937, lon: 78.9629 },
      { name: 'Nepal', lat: 28.3949, lon: 84.124 },
      { name: 'Japan', lat: 36.2048, lon: 138.2529 },
      { name: 'Thailand', lat: 15.87, lon: 100.9925 }
    ]
  },
  {
    name: 'Europe',
    slug: 'europe',
    description:
      'Timeless cities, beautiful countryside and enduring traditions unfold through journeys that reveal a more intimate side of Europe.',
    lat: 50,
    lon: 15,
    countries: [
      { name: 'France', lat: 46.2276, lon: 2.2137 },
      { name: 'Italy', lat: 41.8719, lon: 12.5674 },
      { name: 'Spain', lat: 40.4637, lon: -3.7492 },
      { name: 'Greece', lat: 39.0742, lon: 21.8243 }
    ]
  },
  {
    name: 'Africa',
    slug: 'africa',
    description:
      'Vast wilderness, remarkable wildlife and powerful landscapes create unforgettable journeys filled with wonder, stillness and connection.',
    lat: 5,
    lon: 20,
    countries: [
      { name: 'Kenya', lat: -0.0236, lon: 37.9062 },
      { name: 'Tanzania', lat: -6.369, lon: 34.8888 },
      { name: 'South Africa', lat: -30.5595, lon: 22.9375 },
      { name: 'Morocco', lat: 31.7917, lon: -7.0926 }
    ]
  },
  {
    name: 'South America',
    slug: 'south-america',
    description:
      'Dramatic landscapes, vibrant cultures and ancient stories come alive through journeys filled with colour, rhythm and discovery.',
    lat: -15,
    lon: -60,
    countries: [
      { name: 'Brazil', lat: -14.235, lon: -51.9253 },
      { name: 'Peru', lat: -9.19, lon: -75.0152 },
      { name: 'Chile', lat: -35.6751, lon: -71.543 },
      { name: 'Argentina', lat: -38.4161, lon: -63.6167 }
    ]
  },
  {
    name: 'Australasia & Oceania',
    slug: 'australasia-oceania',
    description:
      'Remote islands, dramatic coastlines and extraordinary natural beauty create journeys shaped by space, adventure and discovery.',
    lat: -25,
    lon: 135,
    countries: [
      { name: 'Australia', lat: -25.2744, lon: 133.7751 },
      { name: 'New Zealand', lat: -40.9006, lon: 174.886 },
      { name: 'Fiji', lat: -17.7134, lon: 178.065 },
      { name: 'Papua New Guinea', lat: -6.315, lon: 143.9555 }
    ]
  },
]

/* ============================================================
   STATE
============================================================ */

const continentCards = [
  {
    name: 'Europe',
    slug: 'europe',
    image: '/images/destinations/europe.jpg'
  },
  {
    name: 'South America',
    slug: 'south-america',
    image: '/images/destinations/south-america.jpg'
  },
  {
    name: 'Africa',
    slug: 'africa',
    image: '/images/destinations/africa.jpg'
  },
  {
    name: 'North America',
    slug: 'north-america',
    image: '/images/destinations/north-america.jpg'
  },
  {
    name: 'Asia',
    slug: 'asia',
    image: '/images/destinations/asia.jpg'
  },
  {
    name: 'Australia',
    slug: 'australia',
    image: '/images/destinations/australia.jpg'
  }
]

const activeIndex = ref(0)
const isGlobeHovered = ref(false)
const showPins = ref(false)

const worldSection = ref<HTMLElement | null>(null)
const globeContainer = ref<HTMLElement | null>(null)

const activeContinent = computed(() => {
  return continents[activeIndex.value]
})

/* ============================================================
   THREE.JS VARIABLES
============================================================ */

let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let labelRenderer: CSS2DRenderer | null = null

let earth: THREE.Mesh | null = null
let atmosphere: THREE.Mesh | null = null

let animationFrame = 0

let raycaster: THREE.Raycaster | null = null
let mouse = new THREE.Vector2()

let globeGroup: THREE.Group | null = null
let pinGroup: THREE.Group | null = null
let activeContinentLabel: CSS2DObject | null = null

let rotationTween: gsap.core.Tween | null = null
const rotationState = { progress: 1 }

let autoplayTimer: ReturnType<typeof setInterval> | null = null

let isTransitioning = false

/* ============================================================
   EARTH TEXTURE
============================================================ */

const earthTextureUrl =
  '/images/globe/earth.jpg'

/* ============================================================
   LAT / LONG → THREE.JS POSITION
============================================================ */

function latLonToVector3(
  lat: number,
  lon: number,
  radius: number
) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  const x =
    -(radius * Math.sin(phi) * Math.cos(theta))

  const y =
    radius * Math.cos(phi)

  const z =
    radius * Math.sin(phi) * Math.sin(theta)

  return new THREE.Vector3(x, y, z)
}

/* ============================================================
   CREATE COUNTRY PIN
============================================================ */

function createPin(
  country: CountryPoint
) {
  const group = new THREE.Group()

  const position = latLonToVector3(
    country.lat,
    country.lon,
    2.05
  )

  const pinGeometry =
    new THREE.SphereGeometry(
      0.035,
      12,
      12
    )

  const pinMaterial =
    new THREE.MeshBasicMaterial({
      color: 0xbd9b07
    })

  const pin = new THREE.Mesh(
    pinGeometry,
    pinMaterial
  )

  pin.position.copy(position)

  group.add(pin)

  /* Outer glow */
  const glowGeometry =
    new THREE.RingGeometry(
      0.05,
      0.085,
      24
    )

  const glowMaterial =
    new THREE.MeshBasicMaterial({
      color: 0xbd9b07,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide
    })

  const glow =
    new THREE.Mesh(
      glowGeometry,
      glowMaterial
    )

  glow.position.copy(position)
  glow.lookAt(0, 0, 0)

  group.add(glow)

  group.userData.country = country.name

  return group
}

/* ============================================================
   UPDATE PINS
============================================================ */

function updatePins() {
  if (!pinGroup) return

  pinGroup.clear()

  if (!showPins.value) return

  activeContinent.value.countries.forEach(
    (country) => {
      const pin = createPin(country)
      pinGroup?.add(pin)
    }
  )
}

/* ============================================================
   GLOBE ROTATION
   Keep the Earth's north pole at the top at all times.
   Only rotate around the Y axis so longitude changes while
   latitude stays in the correct north/south position.
============================================================ */

function getLongitudeRotation(longitude: number) {
  /*
   * The lat/lon projection used by this globe places:
   *   longitude 0°  -> +X
   *   longitude 90° -> -Z
   *   longitude -90° -> +Z (the viewer/front)
   *
   * Three.js camera is looking toward the globe from +Z.
   * Therefore the correct Y rotation to bring a longitude
   * to the FRONT of the globe is:
   *
   *     rotationY = -(90° + longitude)
   *
   * The previous calculation used the opposite direction,
   * which made the selected continent face the imaginary
   * person behind the screen.
   *
   * We only rotate around Y, so the North Pole remains at
   * the top and the South Pole remains at the bottom.
   */
  return THREE.MathUtils.degToRad(-90 - longitude)
}

function normalizeAngle(angle: number) {
  const twoPi = Math.PI * 2
  return ((angle + Math.PI) % twoPi + twoPi) % twoPi - Math.PI
}

function rotateToContinent(
  index: number,
  immediate = false
) {
  if (!globeGroup) return

  const targetY = getLongitudeRotation(
    continents[index].lon
  )

  const currentY = globeGroup.rotation.y
  const shortestTarget =
    currentY +
    normalizeAngle(targetY - currentY)

  if (rotationTween) {
    rotationTween.kill()
    rotationTween = null
  }

  if (immediate) {
    globeGroup.rotation.set(
      0,
      shortestTarget,
      0
    )

    rotationState.progress = 1
    updateActiveContinentLabel()
    updatePins()
    return
  }

  isTransitioning = true

  const startY = globeGroup.rotation.y

  rotationState.progress = 0

  rotationTween = gsap.to(rotationState, {
    progress: 1,
    duration: 2.8,
    ease: 'power2.inOut',

    onUpdate: () => {
      if (!globeGroup) return

      const progress = rotationState.progress

      /*
       * Interpolate only the Y axis.
       * X is always 0 => north pole stays at the top.
       * Z is always 0 => no sideways/tilted Earth.
       */
      globeGroup.rotation.set(
        0,
        THREE.MathUtils.lerp(
          startY,
          shortestTarget,
          progress
        ),
        0
      )

      updateActiveContinentLabel()
    },

    onComplete: () => {
      if (!globeGroup) return

      globeGroup.rotation.set(
        0,
        shortestTarget,
        0
      )

      isTransitioning = false
      rotationTween = null

      updateActiveContinentLabel()
      updatePins()
    }
  })
}

/* ============================================================
   ACTIVE CONTINENT LABEL
   Only the currently selected continent is shown.
============================================================ */

function updateActiveContinentLabel() {
  if (!activeContinentLabel || !globeGroup) return

  const continent = activeContinent.value
  const element =
    activeContinentLabel.element as HTMLButtonElement

  element.textContent =
    continent.name.toUpperCase()

  element.setAttribute(
    'aria-label',
    `Explore ${continent.name}`
  )

  activeContinentLabel.position.copy(
    latLonToVector3(
      continent.lat,
      continent.lon,
      2.13
    )
  )

  element.classList.add('is-active')
}

/* ============================================================
   THREE.JS INITIALIZATION
============================================================ */

function initGlobe() {
  if (!globeContainer.value) return

  const container = globeContainer.value

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(
    38,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  )

  camera.position.z = 6.8

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  })

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)

  labelRenderer = new CSS2DRenderer()
  labelRenderer.setSize(container.clientWidth, container.clientHeight)
  labelRenderer.domElement.style.position = 'absolute'
  labelRenderer.domElement.style.top = '0'
  labelRenderer.domElement.style.left = '0'
  labelRenderer.domElement.style.pointerEvents = 'none'
  labelRenderer.domElement.className = 'world-globe__labels'
  container.appendChild(labelRenderer.domElement)

  scene.add(new THREE.AmbientLight(0xffffff, 2))

  globeGroup = new THREE.Group()
  scene.add(globeGroup)

  const earthGeometry = new THREE.SphereGeometry(2, 96, 96)
  const textureLoader = new THREE.TextureLoader()
  const earthTexture = textureLoader.load(earthTextureUrl, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
  })

  const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture,
    shininess: 8
  })

  earth = new THREE.Mesh(earthGeometry, earthMaterial)
  globeGroup.add(earth)

  const atmosphereGeometry = new THREE.SphereGeometry(2.08, 64, 64)
  const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x6f9fb2,
    transparent: true,
    opacity: 0.12,
    side: THREE.BackSide
  })

  atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
  globeGroup.add(atmosphere)

  pinGroup = new THREE.Group()
  globeGroup.add(pinGroup)

  /*
   * One label only.
   * We deliberately do NOT render all continents at once:
   * when Asia is selected, only ASIA is visible.
   */
  const label = document.createElement('button')
  label.type = 'button'
  label.className = 'world-globe__continent-label'
  label.textContent = activeContinent.value.name.toUpperCase()
  label.setAttribute(
    'aria-label',
    `Explore ${activeContinent.value.name}`
  )
  label.style.pointerEvents = 'auto'

  label.addEventListener('click', (event) => {
    event.stopPropagation()
    navigateTo(
      `/destinations/${activeContinent.value.slug}`
    )
  })

  activeContinentLabel = new CSS2DObject(label)

  globeGroup.add(activeContinentLabel)

  raycaster = new THREE.Raycaster()

  rotateToContinent(activeIndex.value, true)
  updateActiveContinentLabel()
  updatePins()
  animate()

  window.addEventListener('resize', handleResize)
}

/* ============================================================
   ANIMATION LOOP
============================================================ */

function animate() {
  animationFrame = requestAnimationFrame(animate)

  if (!scene || !camera || !renderer) return

  /*
   * No idle rotation.
   * The only movement is the controlled continent-to-continent
   * transition in rotateToContinent().
   */

  renderer.render(scene, camera)
  labelRenderer?.render(scene, camera)
}

/* ============================================================
   RESIZE
============================================================ */

function handleResize() {
  if (
    !globeContainer.value ||
    !camera ||
    !renderer
  ) {
    return
  }

  const width =
    globeContainer.value.clientWidth

  const height =
    globeContainer.value.clientHeight

  camera.aspect =
    width / height

  camera.updateProjectionMatrix()

  renderer.setSize(width, height)
  labelRenderer?.setSize(width, height)
}

/* ============================================================
   MOUSE POSITION
============================================================ */

function handleGlobeMouseMove(event: MouseEvent) {
  if (!globeContainer.value) return

  const rect =
    globeContainer.value.getBoundingClientRect()

  mouse.x =
    ((event.clientX - rect.left) /
      rect.width) * 2 - 1

  mouse.y =
    -(
      ((event.clientY - rect.top) /
        rect.height) * 2 - 1
    )

  /*
   * The selected continent is the only destination represented
   * on the globe. Hovering the globe reveals only that continent's
   * country pins.
   */
  showPins.value = true
  updatePins()
}

function handleGlobeMouseEnter() {
  isGlobeHovered.value = true
  stopAutoplay()

  showPins.value = true
  updatePins()
}

function handleGlobeMouseLeave() {
  isGlobeHovered.value = false
  showPins.value = false
  updatePins()

  startAutoplay()
}

/* ============================================================
   CLICK GLOBE
============================================================ */

function handleGlobeClick() {
  if (isTransitioning) return

  navigateTo(
    `/destinations/${activeContinent.value.slug}`
  )
}

/* ============================================================
   CONTINENT NAVIGATION
============================================================ */

function selectContinent(index: number) {
  if (
    index === activeIndex.value ||
    index < 0 ||
    index >= continents.length
  ) {
    return
  }

  activeIndex.value = index

  updateActiveContinentLabel()
  rotateToContinent(index)

  restartAutoplay()
}

function nextContinent() {
  const next =
    (activeIndex.value + 1) %
    continents.length

  activeIndex.value = next

  updateActiveContinentLabel()
  rotateToContinent(next)

  restartAutoplay()
}

function previousContinent() {
  const previous =
    (activeIndex.value -
      1 +
      continents.length) %
    continents.length

  activeIndex.value = previous

  updateActiveContinentLabel()
  rotateToContinent(previous)

  restartAutoplay()
}

/* ============================================================
   AUTOPLAY
============================================================ */

function startAutoplay() {
  stopAutoplay()

  autoplayTimer =
    setInterval(() => {
      if (
        !isGlobeHovered.value &&
        !isTransitioning
      ) {
        nextContinent()
      }
    }, 7500)
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(
      autoplayTimer
    )

    autoplayTimer = null
  }
}

function restartAutoplay() {
  stopAutoplay()

  if (!isGlobeHovered.value) {
    startAutoplay()
  }
}

/* ============================================================
   GSAP PAGE ANIMATION
============================================================ */

let ctx: gsap.Context | null = null

onMounted(async () => {
  await nextTick()

  initGlobe()

  ctx = gsap.context(() => {

    gsap.from(
      '.journey-hero__eyebrow',
      {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2
      }
    )

    gsap.from(
      '.journey-hero__heading',
      {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.4
      }
    )

    gsap.from(
      '.world-globe',
      {
        opacity: 0,
        x: -60,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.world-section',
          start: 'top 75%',
          toggleActions:
            'play none none reverse'
        }
      }
    )

    gsap.from(
      '.world-content',
      {
        opacity: 0,
        x: 60,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.world-section',
          start: 'top 75%',
          toggleActions:
            'play none none reverse'
        }
      }
    )

  })

  startAutoplay()
})

/* ============================================================
   CLEANUP
============================================================ */

onUnmounted(() => {
  stopAutoplay()

  cancelAnimationFrame(
    animationFrame
  )

  window.removeEventListener(
    'resize',
    handleResize
  )

  ctx?.revert()

  if (renderer) {
    renderer.dispose()

    if (
      globeContainer.value &&
      renderer.domElement.parentNode
    ) {
      renderer.domElement.parentNode.removeChild(
        renderer.domElement
      )
    }
  }

  if (earth) {
    earth.geometry.dispose()

    if (
      Array.isArray(
        earth.material
      )
    ) {
      earth.material.forEach(
        (material) =>
          material.dispose()
      )
    } else {
      earth.material.dispose()
    }
  }

  rotationTween?.kill()
  rotationTween = null

  labelRenderer?.domElement.remove()

  scene = null
  camera = null
  renderer = null
  labelRenderer = null
  earth = null
  atmosphere = null
  globeGroup = null
  pinGroup = null
  activeContinentLabel = null
  raycaster = null
})
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

/* ============================================================
   PAGE
============================================================ */

.journey-page {
  background: $color-ivory;
  color: $color-charcoal;
  min-height: 100svh;
  padding-top: 120px;
}

/* ============================================================
   HERO
============================================================ */

.journey-hero {
  padding:
    clamp(60px, 8vw, 10px)
    var(--page-padding);

  text-align: center;

  &__eyebrow {
    margin-bottom: 24px;
  }

  &__heading {
    margin: 0 auto;
    max-width: 1200px;

    font-family: 'Bebas Neue', sans-serif;
    letter-spacing: 0.02em;

    font-weight: 400;
    line-height: 1.1;

    em {
      font-style: italic;
    }
  }
}

/* ============================================================
   WORLD SECTION
============================================================ */

.world-section {
  min-height: 100svh;

  padding:
    clamp(80px, 8vw, 130px)
    var(--page-padding)
    clamp(30px, 4vw, 60px);

  display: flex;
  align-items: center;
}

.world-section__inner {
  width: 100%;
  max-width: $container-max;
  margin-inline: auto;

  display: grid;

  grid-template-columns:
    minmax(0, 1.15fr)
    minmax(320px, 0.85fr);

  gap:
    clamp(50px, 7vw, 110px);

  align-items: center;
}

/* ============================================================
   GLOBE
============================================================ */

.world-globe {
  position: relative;
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.world-globe__stage {
  position: relative;
  width: 100%;
  min-height: clamp(500px, 45vw, 650px);
  height: clamp(500px, 45vw, 650px);
  overflow: visible;
}

.world-globe__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  :deep(.world-globe__labels) {
    overflow: visible;
  }

  :deep(.world-globe__continent-label) {
    appearance: none;
    border: 1px solid rgba($color-charcoal, 0.16);
    border-radius: 999px;
    padding: 9px 20px;
    background: rgba($color-ivory, 0.94);
    box-shadow: 0 5px 18px rgba(0, 0, 0, 0.12);
    color: #bd9b07;
    font-family: 'Manrope', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
    cursor: pointer;
    transition: transform $transition-fast, background $transition-fast, color $transition-fast;

    &:hover,
    &.is-active {
      background: #bd9b07;
      color: $color-ivory;
      transform: translateY(-2px);
    }
  }
}

.world-globe__label {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 4;
  font-family: 'Manrope', sans-serif;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: $color-text-muted;
  pointer-events: none;
}

.world-globe__hint {
  position: absolute;
  left: 50%;
  bottom: 20px;
  z-index: 4;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 9px;
  font-family: 'Manrope', sans-serif;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: $color-text-muted;
  pointer-events: none;
  white-space: nowrap;
}

.world-globe__hint-dot {
  width: 6px;
  height: 6px;
  flex: 0 0 6px;
  border-radius: 50%;
  background: #bd9b07;
}

.world-globe__controls {
  position: relative;
  z-index: 5;
  margin-top: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
}

.world-globe__control {
  width: 42px;
  height: 42px;
  border: 1px solid rgba($color-charcoal, 0.3);
  border-radius: 50%;
  background: transparent;
  color: $color-charcoal;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background $transition-fast, color $transition-fast, border-color $transition-fast;

  :deep(svg) {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: $color-charcoal;
    color: $color-ivory;
    border-color: $color-charcoal;
  }
}

.world-globe__progress {
  display: flex;
  align-items: center;
  gap: 7px;
}

.world-globe__progress-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba($color-charcoal, 0.25);
  cursor: pointer;
  transition: transform $transition-fast, background $transition-fast;

  &.is-active {
    background: #bd9b07;
    transform: scale(1.7);
  }
}

/* ============================================================
   CONTENT
============================================================ */

.world-content {
  max-width: 520px;

  &__eyebrow {
    margin: 0 0 30px;

    font-family:
      'Manrope',
      sans-serif;

    font-size: 11px;

    letter-spacing:
      0.18em;

    color:
      $color-text-muted;
  }

  &__heading-wrap {
    overflow: hidden;
  }

  &__title {
    margin: 0;

    font-family:
      'Bebas Neue',
      sans-serif;

    font-size:
      clamp(4rem, 7vw, 7.5rem);

    font-weight: 400;

    line-height: 0.9;

    letter-spacing:
      0.02em;

    text-transform:
      uppercase;

    color:
      $color-charcoal;
  }

  &__line {
    width: 100%;
    height: 1px;

    margin:
      clamp(30px, 4vw, 48px)
      0;

    background:
      rgba($color-charcoal, 0.18);
  }

  &__description {
    max-width: 470px;

    margin: 0;

    color:
      $color-text-muted;

    line-height: 1.7;
  }

  &__countries {
    display: flex;
    flex-wrap: wrap;

    gap:
      10px 22px;

    margin-top: 30px;
  }

  &__country {
    display: inline-flex;
    align-items: center;

    gap: 8px;

    font-family:
      'Manrope',
      sans-serif;

    font-size: 11px;

    letter-spacing:
      0.08em;

    text-transform:
      uppercase;

    color:
      $color-charcoal;
  }

  &__country-dot {
    width: 5px;
    height: 5px;

    border-radius: 50%;

    background:
      #bd9b07;
  }

  &__explore {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 16px;

  margin-top:
    clamp(35px, 4vw, 55px);

  padding: 14px 22px;

  border: 1px solid $color-charcoal;
  border-radius: 0;

  background: $color-charcoal;
  color: $color-ivory;

  text-decoration: none;

  font-family:
    'Manrope',
    sans-serif;

  font-size: 12px;

  font-weight: 500;

  letter-spacing:
    0.12em;

  text-transform: uppercase;

  transition:
    background $transition-fast,
    color $transition-fast,
    border-color $transition-fast;

  &:hover {
    background: transparent;
    color: $color-charcoal;
    border-color: $color-charcoal;
  }
}

&__explore-arrow {
  display: flex;
  align-items: center;

  :deep(svg) {
    width: 17px;
    height: 17px;
  }
}
}

/* ============================================================
   TRANSITIONS
============================================================ */

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.35s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.content-slide-enter-active,
.content-slide-leave-active {
  transition:
    all 0.45s ease;
}

.content-slide-enter-from {
  opacity: 0;
  transform:
    translateY(30px);
}

.content-slide-leave-to {
  opacity: 0;
  transform:
    translateY(-30px);
}

.content-fade-enter-active,
.content-fade-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}

.content-fade-enter-from {
  opacity: 0;
  transform:
    translateY(12px);
}

.content-fade-leave-to {
  opacity: 0;
  transform:
    translateY(-12px);
}

/* ============================================================
   TABLET
============================================================ */


/* ============================================================
   CONTINENT GRID
============================================================ */

.continent-grid-section {
  padding:
    clamp(45px, 5vw, 75px)
    var(--page-padding)
    clamp(100px, 10vw, 150px);

  background: $color-ivory;
  color: $color-charcoal;
}

.continent-grid-section__inner {
  width: 100%;
  max-width: $container-max;
  margin-inline: auto;
}

.continent-grid-section__heading {
  margin-bottom: clamp(45px, 5vw, 70px);
}

.continent-grid-section__eyebrow {
  margin: 0 0 18px;

  font-family: 'Manrope', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.continent-grid-section__title {
  margin: 0;

  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(4rem, 7vw, 7rem);
  font-weight: 400;
  line-height: 0.86;
  letter-spacing: 0.015em;
}

.continent-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.continent-card {
  display: block;
  min-width: 0;

  color: inherit;
  text-decoration: none;

  &:hover {
    .continent-card__image img {
      transform: scale(1.045);
    }

    .continent-card__explore {
      transform: translateX(4px);
    }
  }
}

.continent-card__image {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: $color-charcoal;
}

.continent-card__image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform $transition-medium;
}

.continent-card__overlay {
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.08) 0%,
      rgba(0, 0, 0, 0.08) 38%,
      rgba(0, 0, 0, 0.62) 100%
    );
}

.continent-card__title {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 1;

  margin: 0;

  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2.7rem, 4vw, 4.7rem);
  font-weight: 400;
  line-height: 0.9;
  letter-spacing: 0.015em;

  color: $color-ivory-light;
}

.continent-card__explore {
  position: absolute;
  right: 24px;
  bottom: 22px;
  z-index: 1;

  display: inline-flex;
  align-items: center;
  gap: 9px;

  font-family: 'Manrope', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  color: $color-ivory-light;

  transition: transform $transition-fast;

  :deep(svg) {
    width: 14px;
    height: 14px;
  }
}

@media (max-width: 991px) {
  .continent-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }

  .continent-card__title {
    top: 20px;
    left: 20px;
  }

  .continent-card__explore {
    right: 20px;
    bottom: 19px;
  }

  .world-section {
    min-height: auto;
  }

  .world-section__inner {
    grid-template-columns: 1fr;

    gap: 50px;
  }

  .world-globe__stage {
    min-height: clamp(450px, 75vw, 650px);
  }

  .world-content {
    max-width: 700px;
  }
}

/* ============================================================
   MOBILE
============================================================ */

@media (max-width: 600px) {
  .continent-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .journey-page {
    padding-top: 90px;
  }

  .journey-hero {
    padding:
      50px
      var(--page-padding)
      70px;
  }

  .world-section {
    padding:
      60px
      var(--page-padding)
      100px;
  }

  .world-globe__stage {
    min-height: 390px;
    height: 390px;

    .world-globe__label {
      font-size: 9px;
    }

    .world-globe__hint {
      bottom: 20px;
      font-size: 8px;
    }
  }

  .world-globe__control {
    width: 38px;
    height: 38px;
  }

  .world-content {
    &__title {
      font-size:
        clamp(4rem, 18vw, 6rem);
    }

    &__description {
      font-size: 15px;
    }

    &__countries {
      gap: 10px 16px;
    }
  }
}
</style>