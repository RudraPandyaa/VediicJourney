export const HOME_PAGE_CONTENT = {
  hero: {
    eyebrow: 'Bespoke journeys, thoughtfully designed',
    title: 'Travel beyond the ordinary',
    description:
      'Meaningful journeys shaped around you — bringing together remarkable places, thoughtful experiences and the freedom to travel your own way.',

    primaryCta: {
      label: 'Plan Your Journey',
      href: '/contact',
    },

    videoFilename: 'hero.mp4',
  },

  destinations: {
    eyebrow: 'Explore the world',
    title: 'Where will your journey take you?',
    description:
      'From ancient cultures and extraordinary landscapes to vibrant cities and remote escapes, discover places worth travelling for.',

    /*
     * These are references by slug, not duplicated
     * destination/region data.
     *
     * Client will resolve/render them from the
     * Regions/Destinations APIs.
     */
    featuredRegionSlugs: [
      'asia',
      'europe',
      'africa',
      'middle-east',
      'south-america',
      'australia',
      'north-america',
    ],
  },

  experiences: {
    title: 'How do you want to experience the world?',

    featuredExperienceSlugs: [
      'spiritual',
      'wellness',
      'adventure',
      'wildlife',
      'culinary',
      'cultural',
      'luxury',
      'romance',
      'family',
    ],
  },

  indiaSpotlight: {
    label: 'THE SOUL OF INDIA',

    description: [
      'India is a journey through ancient traditions, living cultures, sacred landscapes and stories that have travelled through generations. From timeless cities and spiritual places to rich flavours, vibrant communities and extraordinary experiences, every journey reveals another side of the country.',

      'Discover India beyond the familiar — thoughtfully, slowly and through experiences that bring you closer to its people, places and heritage.',
    ],

    cta: {
      label: 'EXPLORE INDIA',
      href: '/destinations/asia/india',
    },

    displayLines: [
      "LET'S",
      'EXPERIENCE',
      'INDIA,',
      'BEYOND',
      'THE ORDINARY.',
    ],

    videoFilename: 'hero.mp4',
  },

  journeys: {
    displayLines: [
      "LET'S",
      'MAKE',
      'SOMETHING',
      'GREAT',
      'TOGETHER!',
    ],

    featuredRegionSlugs: [
      'europe',
      'africa',
      'asia',
      'south-america',
    ],
  },

  philosophy: {
    eyebrow: 'Our Philosophy',

    title:
      'Journeys designed around what matters to you.',

    description:
      'We believe meaningful travel begins with understanding you. Every journey is thoughtfully shaped around your interests, pace and way of experiencing the world.',

    cta: {
      label: 'Discover Our Story',
      href: '/about',
    },

    imageFilename: 'philosophy.jpg',
  },

  whyVedic: {
    eyebrow: 'Why Vedic Journey',

    title:
      'Travel should feel personal, effortless and unforgettable.',

    items: [
      {
        title: 'Designed Around You',
        description:
          'Every journey begins with your interests, preferences and pace.',
      },
      {
        title: 'Thoughtfully Curated',
        description:
          'Places, stays and experiences are selected with purpose and care.',
      },
      {
        title: 'Trusted Expertise',
        description:
          'Local knowledge and trusted partners help create seamless journeys.',
      },
      {
        title: 'Support Throughout',
        description:
          'From planning to your return home, thoughtful support is always within reach.',
      },
    ],

    imageFilename: 'why-vedic.jpg',
  },

  travelSupport: {
    title: 'EVERY DETAIL TAKEN CARE OF',

    description:
      'From the practical to the personal, we help make every part of your journey feel considered, seamless and effortless.',

    services: [
      {
        title: 'Visa Assistance',
        slug: 'visa',
        description:
          'Clear guidance through visa requirements and documentation, helping make the process feel straightforward from the start.',
        imageFilename: 'visa.jpg',
      },
      {
        title: 'Flights & Connections',
        slug: 'flights',
        description:
          'Thoughtfully considered routes and connections designed around comfort, timing and the rhythm of your journey.',
        imageFilename: 'flights.jpg',
      },
      {
        title: 'Private Transfers',
        slug: 'private-chauffeur',
        description:
          'Seamless arrivals, departures and private transfers arranged so every transition feels effortless.',
        imageFilename: 'transfers.jpg',
      },
      {
        title: 'On-ground Support',
        slug: 'on-ground-support',
        description:
          'Personal assistance throughout your journey, with trusted local support whenever and wherever it is needed.',
        imageFilename: 'support.jpg',
      },
    ],

    cta: {
      title: 'Make your visa process feel effortless.',
      label: 'Explore Visa Assistance',
      href: '/support/visa',
    },
  },

  certificates: {
    title: 'Our Certificates',

    /*
     * Certificate cards themselves should come
     * from the Trust/Certificates collection.
     */
  },
}

export const HOME_PAGE_SEO = {
  title: 'Vedic Journey | Luxury Travel Redefined',

  description:
    'Discover bespoke journeys across India and the world with Vedic Journey. Thoughtfully designed travel experiences shaped around you.',
}