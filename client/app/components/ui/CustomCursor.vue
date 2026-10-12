<script setup lang="ts">
import gsap from 'gsap'

const cursorRef = ref<HTMLElement | null>(null)
const dotRef = ref<HTMLElement | null>(null)

let cleanup: (() => void) | undefined

onMounted(() => {
  if (!cursorRef.value || !dotRef.value) return

  // Don't use custom cursor on touch devices.
  if (!window.matchMedia('(pointer: fine)').matches) {
    return
  }

  const cursor = cursorRef.value
  const dot = dotRef.value

  const moveCursorX = gsap.quickTo(cursor, 'x', {
    duration: 0.45,
    ease: 'power3.out'
  })

  const moveCursorY = gsap.quickTo(cursor, 'y', {
    duration: 0.45,
    ease: 'power3.out'
  })

  const moveDotX = gsap.quickTo(dot, 'x', {
    duration: 0.08,
    ease: 'power2.out'
  })

  const moveDotY = gsap.quickTo(dot, 'y', {
    duration: 0.08,
    ease: 'power2.out'
  })

  const handleMouseMove = (event: MouseEvent) => {
    moveCursorX(event.clientX)
    moveCursorY(event.clientY)

    moveDotX(event.clientX)
    moveDotY(event.clientY)

    gsap.to([cursor, dot], {
      opacity: 1,
      duration: 0.25
    })
  }

  const handleMouseLeave = () => {
    gsap.to([cursor, dot], {
      opacity: 0,
      duration: 0.25
    })
  }

  const handleMouseEnter = () => {
    gsap.to([cursor, dot], {
      opacity: 1,
      duration: 0.25
    })
  }

  const handleMouseOver = (event: MouseEvent) => {
    const target = event.target as HTMLElement

    const interactive = target.closest(
      'a, button, [data-cursor="interactive"]'
    )

    if (interactive) {
      cursor.classList.add('custom-cursor--active')
    } else {
      cursor.classList.remove('custom-cursor--active')
    }
  }

  window.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseleave', handleMouseLeave)
  document.addEventListener('mouseenter', handleMouseEnter)
  document.addEventListener('mouseover', handleMouseOver)

  cleanup = () => {
    window.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseleave', handleMouseLeave)
    document.removeEventListener('mouseenter', handleMouseEnter)
    document.removeEventListener('mouseover', handleMouseOver)
  }
})

onUnmounted(() => {
  cleanup?.()
})
</script>

<template>
  <div
    ref="cursorRef"
    class="custom-cursor"
    aria-hidden="true"
  />

  <div
    ref="dotRef"
    class="custom-cursor-dot"
    aria-hidden="true"
  />
</template>

<style lang="scss" scoped>
.custom-cursor,
.custom-cursor-dot {
  position: fixed;
  z-index: 9999;

  top: 0;
  left: 0;

  pointer-events: none;

  opacity: 0;

  transform: translate(-50%, -50%);
}

.custom-cursor {
  width: 42px;
  height: 42px;

  border: 1px solid rgba(244, 240, 232, 0.75);
  border-radius: 50%;

  mix-blend-mode: difference;

  transition:
    width 400ms cubic-bezier(0.22, 1, 0.36, 1),
    height 400ms cubic-bezier(0.22, 1, 0.36, 1),
    margin 400ms cubic-bezier(0.22, 1, 0.36, 1),
    background-color 400ms cubic-bezier(0.22, 1, 0.36, 1);

  &--active {
    width: 62px;
    height: 62px;

    margin-top: -31px;
    margin-left: -31px;

    background: rgba(244, 240, 232, 0.12);
  }
}

.custom-cursor-dot {
  width: 5px;
  height: 5px;

  border-radius: 50%;

  background: #f4f0e8;

  mix-blend-mode: difference;
}

@media (pointer: coarse) {
  .custom-cursor,
  .custom-cursor-dot {
    display: none;
  }
}
</style>