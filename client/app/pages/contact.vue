<template>
    <main class="contact-page">

        <SiteHeader />


        <!-- ==========================================================
         CONTACT FORM
    =========================================================== -->

        <section class="contact-form-section">

            <div class="contact-form-section__inner">

                <!-- LEFT: INTRO -->
                <div class="contact-form-section__intro">

                    <h2 class="contact-form-section__title">
                        TELL US<br />
                        YOUR STORY.
                    </h2>

                    <div class="contact-form-section__line"></div>

                    <p class="contact-form-section__text">
                        Every journey begins with a conversation.
                        Share a few details with us and our team will
                        get back to you to understand your travel plans
                        and create something truly personal.
                    </p>

                </div>


                <!-- RIGHT: FORM -->
                <div class="contact-form">

                    <form class="contact-form__form" @submit.prevent="submitForm">

                        <!-- NAME -->
                        <div class="contact-form__field">

                            <label for="name">
                                Name <span class="required">*</span>
                            </label>

                            <input id="name" v-model="form.name" type="text" name="name" placeholder="Your name"
                                autocomplete="name" required />

                        </div>


                        <!-- EMAIL -->
                        <div class="contact-form__field">

                            <label for="email">
                                Email <span class="required">*</span>
                            </label>

                            <input id="email" v-model="form.email" type="email" name="email"
                                placeholder="Your email address" autocomplete="email" required />

                        </div>


                        <!-- PHONE -->
                        <div class="contact-form__field">

                            <label for="phone">
                                Phone <span class="required">*</span>
                            </label>

                            <div class="contact-form__phone">

                                <!-- COUNTRY PICKER -->
                                <div class="contact-form__country-picker">

                                    <button type="button" class="contact-form__country-trigger"
                                        :aria-expanded="countryDropdownOpen" aria-label="Select country code"
                                        @click.stop="toggleCountryDropdown">

                                        <span class="contact-form__country-selected">

                                            <img class="contact-form__country-flag"
                                                :src="`https://flagcdn.com/w40/${selectedCountry.iso.toLowerCase()}.png`"
                                                :alt="selectedCountry.name" />

                                            <span class="contact-form__country-code">
                                                {{ selectedCountry.code }}
                                            </span>

                                        </span>

                                        <Icon name="lucide:chevron-down" :class="{ 'is-open': countryDropdownOpen }" />

                                    </button>


                                    <!-- DROPDOWN -->
                                    <div v-if="countryDropdownOpen" class="contact-form__country-dropdown" @click.stop>

                                        <!-- SEARCH -->
                                        <div class="contact-form__country-search">

                                            <Icon name="lucide:search" />

                                            <input v-model="countrySearch" type="text" placeholder="Search"
                                                autocomplete="off" @click.stop />

                                        </div>


                                        <!-- COUNTRY LIST -->
                                        <div class="contact-form__country-list"
                                            @wheel.prevent.stop="handleCountryWheel">

                                            <button v-for="country in filteredCountries"
                                                :key="`${country.iso}-${country.code}`" type="button"
                                                class="contact-form__country-option" :class="{
                                                    'is-selected':
                                                        country.iso === selectedCountry.iso
                                                }" @click="selectCountry(country)">

                                                <img class="contact-form__country-flag"
                                                    :src="`https://flagcdn.com/w40/${country.iso.toLowerCase()}.png`"
                                                    :alt="country.name" />

                                                <span class="contact-form__country-name">
                                                    {{ country.name }}
                                                </span>

                                                <span class="contact-form__country-dial">
                                                    {{ country.code }}
                                                </span>

                                            </button>


                                            <p v-if="filteredCountries.length === 0"
                                                class="contact-form__country-empty">
                                                No country found
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                <!-- PHONE NUMBER -->
                                <input id="phone" v-model="form.phone" type="tel" name="phone"
                                    placeholder="Enter your phone number" autocomplete="tel" inputmode="numeric"
                                    pattern="[0-9]+" required aria-required="true" @input="handlePhoneInput" />

                            </div>

                        </div>


                        <!-- WHEN TO TRAVEL -->
                        <div class="contact-form__field">

                            <label for="travel-month">
                                When to Travel <span class="required">*</span>
                            </label>

                            <div class="contact-form__month-picker">

                                <!-- TRIGGER -->
                                <button type="button" class="contact-form__month-trigger" :class="{
                                    'has-error': monthError
                                }" :aria-expanded="monthDropdownOpen" aria-haspopup="listbox" aria-required="true" @click.stop="toggleMonthDropdown">

                                    <span :class="{
                                        'is-placeholder': !form.travelMonth
                                    }">
                                        {{ form.travelMonth || 'Select a month' }}
                                    </span>

                                    <Icon name="lucide:chevron-down" :class="{
                                        'is-open': monthDropdownOpen
                                    }" />

                                </button>


                                <!-- DROPDOWN -->
                                <div v-if="monthDropdownOpen" class="contact-form__month-dropdown" @click.stop>

                                    <div class="contact-form__month-list" role="listbox" @wheel="handleMonthWheel">

                                        <button v-for="month in months" :key="month" type="button"
                                            class="contact-form__month-option" :class="{
                                                'is-selected':
                                                    form.travelMonth === month
                                            }" @click="selectMonth(month)">
                                            {{ month }}
                                        </button>

                                    </div>

                                </div>

                            </div>
                            <p v-if="monthError" class="contact-form__error">
                                Please select a month.
                            </p>

                        </div>


                        <!-- WHERE TO TRAVEL -->
                        <div class="contact-form__field">

                            <label for="destination">
                                Where to Travel <span class="required">*</span>
                            </label>

                            <input id="destination" v-model="form.destination" type="text" name="destination"
                                placeholder="Where would you like to go?" required />

                        </div>


                        <!-- MESSAGE -->
                        <div class="contact-form__field">

                            <label for="message">
                                Send Us a Message
                            </label>

                            <textarea id="message" v-model="form.message" name="message" rows="6"
                                placeholder="Tell us about your travel plans..."></textarea>

                        </div>


                        <!-- SUBMIT -->
                        <button type="submit" class="contact-form__submit">
                            <span>Send Enquiry</span>

                            <span class="contact-form__submit-arrow">
                                <Icon name="lucide:arrow-right" />
                            </span>
                        </button>

                    </form>

                </div>

            </div>

        </section>

    </main>
</template>


<script setup lang="ts">

import {
    computed,
    onMounted,
    onUnmounted,
    reactive,
    ref
} from 'vue'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import SiteHeader from '~/components/layout/SiteHeader.vue'

gsap.registerPlugin(ScrollTrigger)


/* ==========================================================
   FORM DATA
========================================================== */

const form = reactive({
    name: '',
    email: '',
    countryCode: '+91',
    phone: '',
    travelMonth: '',
    destination: '',
    message: ''
})


/* ==========================================================
   COUNTRY CODES
========================================================== */

const countryCodes = [
    { code: '+93', name: 'Afghanistan', iso: 'AF', flag: '🇦🇫' },
    { code: '+355', name: 'Albania', iso: 'AL', flag: '🇦🇱' },
    { code: '+213', name: 'Algeria', iso: 'DZ', flag: '🇩🇿' },
    { code: '+54', name: 'Argentina', iso: 'AR', flag: '🇦🇷' },
    { code: '+61', name: 'Australia', iso: 'AU', flag: '🇦🇺' },
    { code: '+880', name: 'Bangladesh', iso: 'BD', flag: '🇧🇩' },
    { code: '+32', name: 'Belgium', iso: 'BE', flag: '🇧🇪' },
    { code: '+55', name: 'Brazil', iso: 'BR', flag: '🇧🇷' },
    { code: '+1', name: 'Canada', iso: 'CA', flag: '🇨🇦' },
    { code: '+86', name: 'China', iso: 'CN', flag: '🇨🇳' },
    { code: '+57', name: 'Colombia', iso: 'CO', flag: '🇨🇴' },
    { code: '+45', name: 'Denmark', iso: 'DK', flag: '🇩🇰' },
    { code: '+20', name: 'Egypt', iso: 'EG', flag: '🇪🇬' },
    { code: '+358', name: 'Finland', iso: 'FI', flag: '🇫🇮' },
    { code: '+33', name: 'France', iso: 'FR', flag: '🇫🇷' },
    { code: '+49', name: 'Germany', iso: 'DE', flag: '🇩🇪' },
    { code: '+30', name: 'Greece', iso: 'GR', flag: '🇬🇷' },
    { code: '+36', name: 'Hungary', iso: 'HU', flag: '🇭🇺' },
    { code: '+354', name: 'Iceland', iso: 'IS', flag: '🇮🇸' },
    { code: '+91', name: 'India', iso: 'IN', flag: '🇮🇳' },
    { code: '+62', name: 'Indonesia', iso: 'ID', flag: '🇮🇩' },
    { code: '+964', name: 'Iraq', iso: 'IQ', flag: '🇮🇶' },
    { code: '+353', name: 'Ireland', iso: 'IE', flag: '🇮🇪' },
    { code: '+39', name: 'Italy', iso: 'IT', flag: '🇮🇹' },
    { code: '+81', name: 'Japan', iso: 'JP', flag: '🇯🇵' },
    { code: '+254', name: 'Kenya', iso: 'KE', flag: '🇰🇪' },
    { code: '+60', name: 'Malaysia', iso: 'MY', flag: '🇲🇾' },
    { code: '+52', name: 'Mexico', iso: 'MX', flag: '🇲🇽' },
    { code: '+31', name: 'Netherlands', iso: 'NL', flag: '🇳🇱' },
    { code: '+64', name: 'New Zealand', iso: 'NZ', flag: '🇳🇿' },
    { code: '+47', name: 'Norway', iso: 'NO', flag: '🇳🇴' },
    { code: '+92', name: 'Pakistan', iso: 'PK', flag: '🇵🇰' },
    { code: '+63', name: 'Philippines', iso: 'PH', flag: '🇵🇭' },
    { code: '+48', name: 'Poland', iso: 'PL', flag: '🇵🇱' },
    { code: '+351', name: 'Portugal', iso: 'PT', flag: '🇵🇹' },
    { code: '+7', name: 'Russia', iso: 'RU', flag: '🇷🇺' },
    { code: '+65', name: 'Singapore', iso: 'SG', flag: '🇸🇬' },
    { code: '+27', name: 'South Africa', iso: 'ZA', flag: '🇿🇦' },
    { code: '+82', name: 'South Korea', iso: 'KR', flag: '🇰🇷' },
    { code: '+34', name: 'Spain', iso: 'ES', flag: '🇪🇸' },
    { code: '+46', name: 'Sweden', iso: 'SE', flag: '🇸🇪' },
    { code: '+41', name: 'Switzerland', iso: 'CH', flag: '🇨🇭' },
    { code: '+66', name: 'Thailand', iso: 'TH', flag: '🇹🇭' },
    { code: '+90', name: 'Turkey', iso: 'TR', flag: '🇹🇷' },
    { code: '+971', name: 'United Arab Emirates', iso: 'AE', flag: '🇦🇪' },
    { code: '+44', name: 'United Kingdom', iso: 'GB', flag: '🇬🇧' },
    { code: '+1', name: 'United States', iso: 'US', flag: '🇺🇸' },
    { code: '+84', name: 'Vietnam', iso: 'VN', flag: '🇻🇳' }
]

const countryDropdownOpen = ref(false)
const countrySearch = ref('')
const monthError = ref(false)

const handlePhoneInput = (event: Event) => {
    const input = event.target as HTMLInputElement

    form.phone = input.value.replace(/\D/g, '')
}

const selectedCountry = computed(() => {
    return (
        countryCodes.find(
            country => country.code === form.countryCode &&
                country.iso === 'IN'
        ) ||
        countryCodes.find(country => country.code === form.countryCode) ||
        countryCodes[0]
    )
})

const filteredCountries = computed(() => {
    const search = countrySearch.value.trim().toLowerCase()

    if (!search) {
        return countryCodes
    }

    return countryCodes.filter(country =>
        country.name.toLowerCase().includes(search) ||
        country.code.includes(search)
    )
})

const toggleCountryDropdown = () => {
    countryDropdownOpen.value = !countryDropdownOpen.value

    if (countryDropdownOpen.value) {
        countrySearch.value = ''
        monthDropdownOpen.value = false
    }
}

const selectCountry = (country: typeof countryCodes[number]) => {
    form.countryCode = country.code
    countryDropdownOpen.value = false
    countrySearch.value = ''
}

const closeCountryDropdown = (event: MouseEvent) => {
    const target = event.target as HTMLElement

    if (!target.closest('.contact-form__country-picker')) {
        countryDropdownOpen.value = false
    }

    if (!target.closest('.contact-form__month-picker')) {
        monthDropdownOpen.value = false
    }
}
const handleCountryWheel = (event: WheelEvent) => {
    const list = event.currentTarget as HTMLElement

    event.preventDefault()
    event.stopPropagation()

    list.scrollTop += event.deltaY
}


/* ==========================================================
   MONTHS
========================================================== */

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

const monthDropdownOpen = ref(false)

const toggleMonthDropdown = () => {
    monthDropdownOpen.value = !monthDropdownOpen.value

    if (monthDropdownOpen.value) {
        countryDropdownOpen.value = false
    }
}

const selectMonth = (month: string) => {
    form.travelMonth = month
    monthError.value = false
    monthDropdownOpen.value = false
}

const handleMonthWheel = (event: WheelEvent) => {
    const list = event.currentTarget as HTMLElement

    event.preventDefault()
    event.stopPropagation()

    list.scrollTop += event.deltaY
}


/* ==========================================================
   FORM SUBMIT
========================================================== */

const submitForm = () => {

    if (!form.travelMonth) {
        monthError.value = true
        monthDropdownOpen.value = true
        return
    }

    console.log('Contact form submitted:', {
        ...form,
        phone: `${form.countryCode} ${form.phone}`
    })
}


/* ==========================================================
   ANIMATIONS
========================================================== */

let ctx: gsap.Context | null = null

onMounted(() => {
    document.addEventListener('click', closeCountryDropdown)
    ctx = gsap.context(() => {

        /* ---------------------------------------------------------
           HERO
        --------------------------------------------------------- */

        gsap.from(
            '.contact-hero__eyebrow',
            {
                opacity: 0,
                y: 20,
                duration: 0.9,
                ease: 'power3.out'
            }
        )

        gsap.from(
            '.contact-hero__title',
            {
                opacity: 0,
                y: 50,
                duration: 1.2,
                delay: 0.15,
                ease: 'power3.out'
            }
        )

        gsap.from(
            '.contact-hero__intro',
            {
                opacity: 0,
                y: 25,
                duration: 1,
                delay: 0.3,
                ease: 'power3.out'
            }
        )


        /* ---------------------------------------------------------
           FORM INTRO
        --------------------------------------------------------- */

        gsap.from(
            '.contact-form-section__intro',
            {
                opacity: 0,
                x: -45,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.contact-form-section',
                    start: 'top 75%'
                }
            }
        )


        /* ---------------------------------------------------------
           FORM
        --------------------------------------------------------- */

        gsap.from(
            '.contact-form__field',
            {
                opacity: 0,
                y: 25,
                duration: 0.7,
                stagger: 0.08,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.contact-form',
                    start: 'top 78%'
                }
            }
        )


        gsap.from(
            '.contact-form__submit',
            {
                opacity: 0,
                y: 20,
                duration: 0.8,
                delay: 0.4,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.contact-form',
                    start: 'top 78%'
                }
            }
        )


        /* ---------------------------------------------------------
           BOTTOM CTA
        --------------------------------------------------------- */

        gsap.from(
            '.contact-bottom h2',
            {
                opacity: 0,
                y: 45,
                duration: 1.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.contact-bottom',
                    start: 'top 75%'
                }
            }
        )

    })

})


onUnmounted(() => {
    document.removeEventListener('click', closeCountryDropdown)

    ctx?.revert()

})

</script>


<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;


/* ============================================================
   PAGE
============================================================ */

/*
    Add your background image here when ready:

    --contact-page-background: url('/images/contact/your-image.jpg');

    The image will automatically cover the navbar + contact form area.
*/

.contact-page {
    --contact-page-background: url('/images/support/flights.jpg');

    position: relative;

    min-height: 100svh;

    background-color: $color-ivory;
    background-image: var(--contact-page-background);
    background-position: center top;
    background-size: cover;
    background-repeat: no-repeat;

    color: $color-charcoal;
}



/* ============================================================
   SHARED BACKGROUND — NAVBAR
============================================================ */

.contact-page {
    :deep(.site-header) {
        position: absolute;

        top: 0;
        right: 0;
        left: 0;

        z-index: 1000;

        background: transparent !important;
        box-shadow: none !important;

        pointer-events: auto;
    }
}

/* ============================================================
   HERO
============================================================ */

.contact-hero {
    position: relative;

    display: flex;
    align-items: center;

    width: 100%;
    min-height: 78svh;

    overflow: hidden;

    background: $color-ivory;
    color: #000;

    isolation: isolate;


    /* ----------------------------------------------------------
     HEADER
  ---------------------------------------------------------- */

    :deep(.site-header) {
        position: absolute;

        z-index: 1000;

        top: 0;
        right: 0;
        left: 0;

        pointer-events: auto;
    }


    /* ----------------------------------------------------------
     CONTENT
  ---------------------------------------------------------- */

    &__content {
        position: relative;

        z-index: 2;

        width: 100%;
        max-width: 1050px;

        margin-inline: auto;

        padding:
            clamp(150px, 17vw, 230px) var(--page-padding) clamp(90px, 10vw, 150px);

        text-align: center;
    }


    &__eyebrow {
        margin-bottom: 30px;

        color: #000;
    }


    &__title {
        margin: 0;

        font-family:
            'Bebas Neue',
            sans-serif;

        font-size:
            clamp(4.8rem, 10vw, 10rem);

        font-weight: 400;

        line-height: 0.82;

        letter-spacing: 0.02em;

        color: #000;

        em {
            font-family:
                'Cormorant Garamond',
                Georgia,
                serif;

            font-size: 0.75em;

            font-style: italic;

            letter-spacing: -0.02em;

            color: $color-sand;
        }
    }


    &__intro {
        max-width: 680px;

        margin:
            45px auto 0;

        color: #000;

        line-height: 1.75;
    }
}


/* ============================================================
   FORM SECTION
============================================================ */

.contact-form-section {
    position: relative;
    z-index: 1;

    min-height: 100svh;

    padding:
        150px var(--page-padding) 120px;

    background: transparent;


    &__inner {
        display: grid;

        grid-template-columns:
            minmax(0, 0.75fr) minmax(0, 1.25fr);

        gap:
            clamp(60px, 9vw, 150px);

        width: 100%;
        max-width: $container-max;

        margin-inline: auto;

        align-items: start;
    }


    /* ----------------------------------------------------------
     INTRO
  ---------------------------------------------------------- */

    &__intro {
        max-width: 520px;

        padding-top: 15px;
    }


    &__eyebrow {
        margin-bottom: 24px;
    }


    &__title {
        margin: 0;

        font-family:
            'Bebas Neue',
            sans-serif;

        font-size:
            clamp(4rem, 6vw, 6.5rem);

        font-weight: 400;

        line-height: 0.86;

        letter-spacing: 0.02em;

        color: $color-charcoal;

        em {
            font-family:
                'Cormorant Garamond',
                Georgia,
                serif;

            font-size: 0.76em;

            font-style: italic;

            letter-spacing: -0.02em;

            color: $color-charcoal;
        }
    }


    &__line {
        width: 100%;
        height: 1px;

        margin:
            38px 0 30px;

        background:
            rgba($color-charcoal, 0.18);
    }


    &__text {
        max-width: 500px;

        margin: 0;

        font-family:
            'Manrope',
            sans-serif;

        font-size:
            var(--fs-body);

        line-height: 1.75;

        color:
            $color-text-muted;
    }
}


/* ============================================================
   FORM
============================================================ */

.contact-form {
    width: 100%;

    padding:
        clamp(30px, 4vw, 55px);

    border:
        1px solid rgba($color-charcoal, 0.15);

    background:
        $color-ivory;
}


.contact-form__form {
    display: flex;

    flex-direction: column;

    gap: 28px;
}


/* ============================================================
   FIELD
============================================================ */

.contact-form__field {
    display: flex;

    flex-direction: column;

    gap: 10px;


    label {
        font-family:
            'Manrope',
            sans-serif;

        font-size: 14px;

        .required {
            color: #b3261e;
        }

        font-weight: 600;

        letter-spacing: 0.14em;

        text-transform: uppercase;

        color: $color-charcoal;
    }

    .contact-form__error {
        margin: 7px 0 0;

        color: #b3261e;

        font-family: 'Manrope', sans-serif;

        font-size: 12px;
    }


    input,
    textarea,
    select {
        width: 100%;

        border: 0;

        border-bottom:
            1px solid rgba($color-charcoal, 0.28);

        border-radius: 0;

        outline: none;

        background: transparent;

        color: $color-charcoal;

        font-family:
            'Manrope',
            sans-serif;

        font-size: 14px;

        line-height: 1.6;

        transition:
            border-color $transition-fast;


        &::placeholder {
            color:
                rgba($color-charcoal, 0.4);
        }


        &:focus {
            border-bottom-color:
                $color-charcoal;
        }
    }


    input,
    select {
        height: 48px;
    }


    textarea {
        min-height: 135px;

        padding-top: 8px;

        resize: vertical;
    }


    select {
        appearance: none;

        cursor: pointer;

        padding-right: 35px;
    }
}


/* ============================================================
   PHONE
============================================================ */

.contact-form__phone {
    position: relative;

    display: grid;

    grid-template-columns:
        155px minmax(0, 1fr);

    gap: 14px;

    width: 100%;

    align-items: start;

    overflow: visible;

    z-index: 50;
}

.contact-form__field {
    position: relative;

    overflow: visible;
}

.contact-form__field:has(.contact-form__country-picker) {
    position: relative;
    z-index: 100;
}

.contact-form__field:has(.contact-form__month-picker) {
    position: relative;
    z-index: 90;
}

/* ============================================================
   COUNTRY PICKER
============================================================ */

.contact-form__country-picker {
    position: relative;

    width: 100%;

    min-width: 0;

    z-index: 20;
}


/* ============================================================
   COUNTRY TRIGGER
============================================================ */

.contact-form__country-trigger {
    display: flex;

    align-items: center;
    justify-content: space-between;

    width: 100%;
    height: 48px;

    padding:
        0 13px;

    border:
        1px solid rgba($color-charcoal, 0.35);

    border-radius: 0;

    background:
        $color-ivory;

    color:
        $color-charcoal;

    cursor: pointer;

    font-family:
        'Manrope',
        sans-serif;

    font-size: 13px;

    line-height: 1;

    appearance: none;

    transition:
        border-color $transition-fast,
        background $transition-fast;


    &:hover,
    &:focus {
        border-color:
            $color-charcoal;

        outline: none;
    }


    >svg {
        width: 15px;
        height: 15px;

        flex-shrink: 0;

        color:
            $color-charcoal;

        transition:
            transform $transition-fast;
    }


    >svg.is-open {
        transform:
            rotate(180deg);
    }
}


/* ============================================================
   SELECTED COUNTRY
============================================================ */

.contact-form__country-selected {
    display: flex;

    align-items: center;

    gap: 8px;

    min-width: 0;
}


.contact-form__country-flag {
    display: block;

    width: 24px;
    min-width: 24px;

    height: 16px;

    object-fit: cover;

    flex-shrink: 0;

    border: 1px solid rgba($color-charcoal, 0.12);
}


.contact-form__country-code {
    font-family:
        'Manrope',
        sans-serif;

    font-size: 13px;

    font-weight: 500;

    white-space: nowrap;
}


/* ============================================================
   COUNTRY DROPDOWN
============================================================ */

.contact-form__country-dropdown {
    position: absolute;

    z-index: 100;

    top: calc(100% + 6px);
    left: 0;

    width: 330px;

    max-width: 330px;

    border:
        1px solid rgba($color-charcoal, 0.3);

    background:
        $color-ivory;

    box-shadow:
        0 12px 35px rgba(0, 0, 0, 0.14);

    overflow: hidden;
}


/* ============================================================
   SEARCH
============================================================ */

.contact-form__country-search {
    position: relative;

    display: flex;

    align-items: center;

    margin: 12px;

    border:
        1px solid rgba($color-charcoal, 0.35);

    background:
        $color-ivory;

    height: 42px;


    >svg {
        position: absolute;

        left: 12px;

        width: 17px;
        height: 17px;

        color:
            $color-charcoal;

        pointer-events: none;
    }


    input {
        width: 100%;
        height: 100%;

        padding:
            0 12px 0 38px;

        border: 0;

        outline: none;

        background:
            transparent;

        color:
            $color-charcoal;

        font-family:
            'Manrope',
            sans-serif;

        font-size: 13px;


        &::placeholder {
            color:
                rgba($color-charcoal, 0.55);
        }
    }
}


/* ============================================================
   COUNTRY LIST
============================================================ */

.contact-form__country-list {
    width: 100%;

    max-height: 250px;

    overflow-y: auto;

    overflow-x: hidden;

    overscroll-behavior: contain;

    scrollbar-width: thin;

    scrollbar-color:
        rgba($color-charcoal, 0.4) rgba($color-charcoal, 0.06);


    &::-webkit-scrollbar {
        width: 7px;
    }


    &::-webkit-scrollbar-track {
        background:
            rgba($color-charcoal, 0.05);
    }


    &::-webkit-scrollbar-thumb {
        background:
            rgba($color-charcoal, 0.4);

        border-radius: 10px;
    }


    &::-webkit-scrollbar-thumb:hover {
        background:
            rgba($color-charcoal, 0.6);
    }
}


/* ============================================================
   COUNTRY PICKER
============================================================ */

.contact-form__country-picker {
    position: relative;

    width: 100%;

    min-width: 0;

    z-index: 100;
}


/* ============================================================
   COUNTRY TRIGGER
============================================================ */

.contact-form__country-trigger {
    display: flex;

    align-items: center;
    justify-content: space-between;

    width: 100%;
    height: 48px;

    padding: 0 12px;

    border: 1px solid rgba($color-charcoal, 0.4);

    border-radius: 0;

    background: $color-ivory;

    color: $color-charcoal;

    cursor: pointer;

    font-family: 'Manrope', sans-serif;

    font-size: 13px;

    line-height: 1;

    appearance: none;

    box-sizing: border-box;

    transition:
        border-color $transition-fast,
        background $transition-fast;


    &:hover,
    &:focus {
        border-color: $color-charcoal;

        outline: none;
    }


    >svg {
        width: 14px;
        height: 14px;

        flex-shrink: 0;

        color: $color-charcoal;

        transition:
            transform $transition-fast;
    }


    >svg.is-open {
        transform: rotate(180deg);
    }
}


/* ============================================================
   SELECTED COUNTRY
============================================================ */

.contact-form__country-selected {
    display: flex;

    align-items: center;

    gap: 9px;

    min-width: 0;
}


.contact-form__country-code {
    font-family: 'Manrope', sans-serif;

    font-size: 13px;

    font-weight: 500;

    white-space: nowrap;
}


/* ============================================================
   COUNTRY DROPDOWN
============================================================ */

.contact-form__country-dropdown {
    position: absolute;

    z-index: 1000;

    top: calc(100% + 6px);

    left: 0;

    width: 340px;

    max-width: min(340px,
            calc(100vw - 40px));

    border: 1px solid rgba($color-charcoal, 0.35);

    background: $color-ivory;

    box-shadow:
        0 18px 40px rgba(0, 0, 0, 0.15);

    box-sizing: border-box;

    overflow: hidden;
}


/* ============================================================
   SEARCH
============================================================ */

.contact-form__country-search {
    position: relative;

    display: flex;

    align-items: center;

    height: 42px;

    margin: 10px;

    border: 1px solid rgba($color-charcoal, 0.35);

    background: $color-ivory;

    box-sizing: border-box;


    >svg {
        position: absolute;

        left: 12px;
        width: 16px;
        height: 16px;

        color: $color-charcoal;

        pointer-events: none;
    }


    input {
        width: 100%;
        height: 100%;

        padding:
            0 12px 0 38px;

        border: 0;

        outline: none;

        background: transparent;

        color: $color-charcoal;

        font-family: 'Manrope', sans-serif;

        font-size: 13px;

        box-sizing: border-box;


        &::placeholder {
            color:
                rgba($color-charcoal, 0.5);
        }
    }
}


/* ============================================================
   COUNTRY LIST
============================================================ */

.contact-form__country-list {
    max-height: 260px;

    width: 100%;

    overflow-x: hidden;

    overflow-y: auto;

    overscroll-behavior: contain;

    box-sizing: border-box;

    scrollbar-width: thin;

    scrollbar-color:
        rgba($color-charcoal, 0.4) rgba($color-charcoal, 0.06);


    &::-webkit-scrollbar {
        width: 7px;
    }


    &::-webkit-scrollbar-track {
        background:
            rgba($color-charcoal, 0.05);
    }


    &::-webkit-scrollbar-thumb {
        background:
            rgba($color-charcoal, 0.4);

        border-radius: 10px;
    }


    &::-webkit-scrollbar-thumb:hover {
        background:
            rgba($color-charcoal, 0.6);
    }
}


/* ============================================================
   COUNTRY OPTION
============================================================ */

.contact-form__country-option {
    display: grid;

    grid-template-columns:
        30px minmax(0, 1fr) auto;

    align-items: center;

    gap: 10px;

    width: 100%;

    min-height: 46px;

    padding: 0 14px;

    border: 0;

    border-bottom:
        1px solid rgba($color-charcoal, 0.07);

    background: transparent;

    color: $color-charcoal;

    cursor: pointer;

    text-align: left;

    font-family: 'Manrope', sans-serif;

    font-size: 13px;

    box-sizing: border-box;


    &:hover {
        background:
            rgba($color-charcoal, 0.06);
    }


    &.is-selected {
        background:
            rgba($color-sand, 0.25);
    }
}


.contact-form__country-option .contact-form__country-flag {
    width: 24px;

    height: 16px;
}


/* ============================================================
   COUNTRY TEXT
============================================================ */

.contact-form__country-name {
    overflow: hidden;

    text-overflow: ellipsis;

    white-space: nowrap;
}


.contact-form__country-dial {
    color: $color-text-muted;

    font-size: 12px;

    white-space: nowrap;
}


.contact-form__country-empty {
    margin: 0;

    padding: 20px;

    color: $color-text-muted;

    text-align: center;

    font-family: 'Manrope', sans-serif;

    font-size: 12px;
}


/* ============================================================
   MONTH PICKER
============================================================ */

.contact-form__month-picker {
    position: relative;

    width: 100%;

    min-width: 0;

    z-index: 100;
}


/* ============================================================
   MONTH TRIGGER
============================================================ */

.contact-form__month-trigger {
    display: flex;

    align-items: center;
    justify-content: space-between;

    width: 100%;
    height: 48px;

    margin: 0;

    padding:
        0 12px;

    border:
        1px solid rgba($color-charcoal, 0.4);

    border-radius: 0;

    background:
        $color-ivory;

    color:
        $color-charcoal;

    cursor: pointer;

    font-family:
        'Manrope',
        sans-serif;

    font-size: 14px;

    line-height: 1;

    text-align: left;

    appearance: none;

    box-sizing: border-box;

    transition:
        border-color $transition-fast,
        background $transition-fast;


    &:hover,
    &:focus {
        border-color:
            $color-charcoal;

        outline: none;
    }


    >span {
        overflow: hidden;

        text-overflow: ellipsis;

        white-space: nowrap;
    }


    >span.is-placeholder {
        color:
            rgba($color-charcoal, 0.45);
    }


    >svg {
        width: 15px;
        height: 15px;

        flex-shrink: 0;

        color:
            $color-charcoal;

        transition:
            transform $transition-fast;
    }


    >svg.is-open {
        transform:
            rotate(180deg);
    }
}


/* ============================================================
   MONTH DROPDOWN
============================================================ */

.contact-form__month-dropdown {
    position: absolute;

    z-index: 1000;

    top: calc(100% + 4px);
    left: 0;

    width: 100%;

    border:
        1px solid rgba($color-charcoal, 0.35);

    background:
        $color-ivory;

    box-shadow:
        0 18px 40px rgba(0, 0, 0, 0.15);

    box-sizing: border-box;

    overflow: hidden;

    pointer-events: auto;
}


/* ============================================================
   MONTH LIST
============================================================ */

.contact-form__month-list {
    width: 100%;

    height: 260px;

    max-height: 260px;

    overflow-x: hidden;

    overflow-y: auto;

    overscroll-behavior: contain;

    box-sizing: border-box;

    scrollbar-width: thin;

    scrollbar-color:
        rgba($color-charcoal, 0.4) rgba($color-charcoal, 0.06);


    &::-webkit-scrollbar {
        width: 7px;
    }


    &::-webkit-scrollbar-track {
        background:
            rgba($color-charcoal, 0.05);
    }


    &::-webkit-scrollbar-thumb {
        background:
            rgba($color-charcoal, 0.4);

        border-radius: 10px;
    }


    &::-webkit-scrollbar-thumb:hover {
        background:
            rgba($color-charcoal, 0.6);
    }
}


/* ============================================================
   MONTH OPTION
============================================================ */

.contact-form__month-option {
    display: flex;

    align-items: center;

    width: 100%;

    min-height: 46px;

    margin: 0;

    padding:
        0 14px;

    border: 0;

    border-bottom:
        1px solid rgba($color-charcoal, 0.07);

    background:
        transparent;

    color:
        $color-charcoal;

    cursor: pointer;

    text-align: left;

    font-family:
        'Manrope',
        sans-serif;

    font-size: 13px;

    box-sizing: border-box;

    transition:
        background $transition-fast;


    &:hover {
        background:
            rgba($color-charcoal, 0.06);
    }


    &.is-selected {
        background:
            rgba($color-sand, 0.25);
    }
}


/* ============================================================
   SUBMIT BUTTON
============================================================ */

.contact-form__submit {
    display: inline-flex;

    align-items: center;
    justify-content: center;

    align-self: flex-start;

    gap: 18px;

    min-height: 54px;

    margin-top: 10px;

    padding:
        0 26px;

    border:
        1px solid $color-charcoal;

    background:
        $color-charcoal;

    color:
        $color-ivory;

    cursor: pointer;

    font-family:
        'Manrope',
        sans-serif;

    font-size: 11px;

    font-weight: 500;

    letter-spacing: 0.12em;

    text-transform: uppercase;

    transition:
        background $transition-fast,
        color $transition-fast,
        border-color $transition-fast;


    &:hover {
        background: transparent;

        color: $color-charcoal;

        border-color: $color-charcoal;


        .contact-form__submit-arrow {
            transform: none;
        }
    }
}


/* ------------------------------------------------------------
   ARROW — INTENTIONALLY STATIC
------------------------------------------------------------ */

.contact-form__submit-arrow {
    display: flex;

    align-items: center;

    transform: none;

    transition: none;


    :deep(svg) {
        width: 17px;
        height: 17px;

        transform: none;

        transition: none;
    }
}


/* ============================================================
   BOTTOM CTA
============================================================ */

.contact-bottom {
    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    min-height: 55vh;

    padding:
        100px var(--page-padding);

    background:
        $color-charcoal;

    color:
        $color-ivory;

    text-align: center;


    &__eyebrow {
        margin-bottom: 28px;

        color:
            rgba($color-ivory, 0.5);
    }


    h2 {
        margin: 0;

        font-family:
            'Bebas Neue',
            sans-serif;

        font-size:
            clamp(5rem, 10vw, 10rem);

        font-weight: 400;

        line-height: 0.84;

        letter-spacing: 0.02em;


        em {
            font-family:
                'Cormorant Garamond',
                Georgia,
                serif;

            font-size: 0.75em;

            font-style: italic;

            letter-spacing: -0.02em;

            color:
                $color-sand;
        }
    }
}


/* ============================================================
   RESPONSIVE
============================================================ */

@media (max-width: 900px) {

    .contact-form-section {

        &__inner {
            grid-template-columns: 1fr;

            gap: 70px;
        }


        &__intro {
            max-width: 650px;
        }

    }

}


@media (max-width: 600px) {

    .contact-hero {
        min-height: 75svh;


        &__content {
            padding-top: 145px;
        }


        &__title {
            font-size:
                clamp(4rem, 18vw, 6rem);
        }


        &__intro {
            margin-top: 35px;
        }
    }


    .contact-form-section {
        padding:
            85px var(--page-padding);


        &__title {
            font-size:
                clamp(3.8rem, 16vw, 5.5rem);
        }
    }


    .contact-form {
        padding: 25px 20px;
    }


    .contact-form__form {
        gap: 25px;
    }


    .contact-form__phone {
        grid-template-columns:
            120px minmax(0, 1fr);

        gap: 10px;
    }


    .contact-form__submit {
        width: 100%;
    }


    .contact-bottom {
        min-height: 45vh;


        h2 {
            font-size:
                clamp(4rem, 17vw, 6rem);
        }
    }

}
</style>