export type MigrationJourneyDay = {
  day: number
  title: string
  description: string
  placeSlug?: string
}

export type MigrationJourney = {
  title: string
  slug: string
  shortDescription: string
  overview: string
  durationDays: number

  destinationSlugs: string[]
  placeSlugs: string[]

  heroImageFilename?: string

  highlights: string[]
  itinerary: MigrationJourneyDay[]

  isFeatured: boolean
  sortOrder: number
}

export const migrationJourneys: MigrationJourney[] = [
  {
    title: 'Sacred India',
    slug: 'sacred-india',

    shortDescription:
      'A soulful journey through India’s spiritual traditions, sacred landscapes and living culture.',

    overview:
      'Experience India through places where spirituality remains part of everyday life. This journey connects the Himalayan atmosphere of Rishikesh with the ancient rituals of Varanasi and the restorative landscapes of Kerala, creating a thoughtful introduction to India beyond conventional sightseeing.',

    durationDays: 7,

    destinationSlugs: [
      'india',
    ],

    placeSlugs: [
      'rishikesh',
      'varanasi',
      'kerala',
    ],

    // sacred-india.jpg intentionally NOT used
    // until visually verified as non-Mughal.

    highlights: [
      'Yoga and spiritual traditions in Rishikesh',
      'Sacred rituals along the Ganges',
      'Living heritage of Varanasi',
      'Kerala wellness and tropical landscapes',
      'Meaningful local cultural experiences',
    ],

    itinerary: [
      {
        day: 1,
        title: 'Arrival in Rishikesh',
        description:
          'Arrive in Rishikesh and settle into the Himalayan atmosphere along the Ganges. Begin the journey with a relaxed introduction to the town and its spiritual character.',
        placeSlug: 'rishikesh',
      },
      {
        day: 2,
        title: 'Yoga and the Ganges',
        description:
          'Experience a morning yoga session followed by time exploring the riverside neighbourhoods, ashrams and spiritual traditions of Rishikesh.',
        placeSlug: 'rishikesh',
      },
      {
        day: 3,
        title: 'Journey to Varanasi',
        description:
          'Travel onward to Varanasi and experience the atmosphere of one of India’s oldest living cities along the sacred Ganges.',
        placeSlug: 'varanasi',
      },
      {
        day: 4,
        title: 'Sacred Varanasi',
        description:
          'Discover the ghats, narrow lanes and living traditions of Varanasi, with time to experience the city from the river.',
        placeSlug: 'varanasi',
      },
      {
        day: 5,
        title: 'Journey South',
        description:
          'Travel to Kerala and transition from India’s sacred cities to its tropical southern landscapes.',
        placeSlug: 'kerala',
      },
      {
        day: 6,
        title: 'Kerala Wellness',
        description:
          'Enjoy a slower day shaped around wellness, regional cuisine and the natural surroundings of Kerala.',
        placeSlug: 'kerala',
      },
      {
        day: 7,
        title: 'Reflection and Departure',
        description:
          'Conclude the journey with a relaxed morning before departure, carrying forward the contrasts and traditions experienced across India.',
        placeSlug: 'kerala',
      },
    ],

    isFeatured: true,
    sortOrder: 1,
  },

  {
    title: 'Timeless Italy',
    slug: 'timeless-italy',

    shortDescription:
      'Art, cuisine and romance through Rome, Florence, Venice and the Amalfi Coast.',

    overview:
      'Discover Italy through its historic cities, artistic heritage, regional cuisine and Mediterranean landscapes. From ancient Rome and Renaissance Florence to Venice and the Amalfi Coast, this journey brings together some of the country’s most distinctive experiences.',

    durationDays: 7,

    destinationSlugs: [
      'italy',
    ],

    placeSlugs: [
      'rome',
      'florence',
      'venice',
      'amalfi-coast',
    ],

    heroImageFilename: 'italy.jpg',

    highlights: [
      'Ancient heritage of Rome',
      'Renaissance art in Florence',
      'Venetian canals and neighbourhoods',
      'Mediterranean scenery of the Amalfi Coast',
      'Regional Italian cuisine',
    ],

    itinerary: [
      {
        day: 1,
        title: 'Arrival in Rome',
        description:
          'Arrive in Rome and begin exploring the neighbourhoods, piazzas and atmosphere of the Italian capital.',
        placeSlug: 'rome',
      },
      {
        day: 2,
        title: 'Ancient Rome',
        description:
          'Explore the remarkable archaeological heritage of Rome and experience the layers of history found throughout the city.',
        placeSlug: 'rome',
      },
      {
        day: 3,
        title: 'Renaissance Florence',
        description:
          'Travel to Florence and discover the city’s Renaissance art, architecture and celebrated historic centre.',
        placeSlug: 'florence',
      },
      {
        day: 4,
        title: 'Florence and Tuscany',
        description:
          'Continue exploring Florence with time for regional cuisine, craftsmanship and the landscapes surrounding the city.',
        placeSlug: 'florence',
      },
      {
        day: 5,
        title: 'Venice',
        description:
          'Travel to Venice and experience its canals, historic neighbourhoods and unique lagoon setting.',
        placeSlug: 'venice',
      },
      {
        day: 6,
        title: 'Amalfi Coast',
        description:
          'Continue south to the Amalfi Coast for dramatic Mediterranean scenery and relaxed coastal experiences.',
        placeSlug: 'amalfi-coast',
      },
      {
        day: 7,
        title: 'Mediterranean Departure',
        description:
          'Enjoy a final morning along the coast before concluding the Italian journey.',
        placeSlug: 'amalfi-coast',
      },
    ],

    isFeatured: true,
    sortOrder: 2,
  },

  {
    title: 'Peru: Heart of the Andes',
    slug: 'peru-heart-of-the-andes',

    shortDescription:
      'An Andean journey through Lima, Cusco, the Sacred Valley and Machu Picchu.',

    overview:
      'Explore Peru through its celebrated cuisine, Andean landscapes and extraordinary Inca heritage. Beginning in Lima before travelling into the mountains, this journey connects Cusco, the Sacred Valley and Machu Picchu.',

    durationDays: 7,

    destinationSlugs: [
      'peru',
    ],

    placeSlugs: [
      'lima',
      'cusco',
      'sacred-valley',
      'machu-picchu',
    ],

    heroImageFilename: 'peru.jpg',

    highlights: [
      'Lima’s acclaimed culinary culture',
      'Historic streets of Cusco',
      'Andean communities of the Sacred Valley',
      'Scenic journey through the Andes',
      'Machu Picchu',
    ],

    itinerary: [
      {
        day: 1,
        title: 'Arrival in Lima',
        description:
          'Arrive in Peru’s coastal capital and begin discovering its neighbourhoods and renowned culinary scene.',
        placeSlug: 'lima',
      },
      {
        day: 2,
        title: 'Culinary Lima',
        description:
          'Explore Lima through local flavours, markets and contemporary Peruvian gastronomy.',
        placeSlug: 'lima',
      },
      {
        day: 3,
        title: 'Into the Andes',
        description:
          'Fly to Cusco and take time to acclimatise while discovering the historic character of the city.',
        placeSlug: 'cusco',
      },
      {
        day: 4,
        title: 'Sacred Valley',
        description:
          'Travel into the Sacred Valley to experience Andean landscapes, communities and archaeological heritage.',
        placeSlug: 'sacred-valley',
      },
      {
        day: 5,
        title: 'Deeper into the Valley',
        description:
          'Continue exploring the Sacred Valley with a relaxed pace and meaningful cultural experiences.',
        placeSlug: 'sacred-valley',
      },
      {
        day: 6,
        title: 'Machu Picchu',
        description:
          'Take the scenic journey toward Machu Picchu and spend time exploring the extraordinary Inca citadel.',
        placeSlug: 'machu-picchu',
      },
      {
        day: 7,
        title: 'Andean Departure',
        description:
          'Enjoy a final morning surrounded by the Andean landscape before beginning the journey home.',
        placeSlug: 'machu-picchu',
      },
    ],

    isFeatured: true,
    sortOrder: 3,
  },

  {
    title: 'Wild South Africa',
    slug: 'wild-south-africa',

    shortDescription:
      'Cape Town, the Winelands and unforgettable wildlife experiences in South Africa.',

    overview:
      'Experience the remarkable diversity of South Africa through Cape Town, the Winelands, scenic landscapes and a classic African safari. This journey balances food, culture, coastline and wildlife.',

    durationDays: 7,

    destinationSlugs: [
      'south-africa',
    ],

    placeSlugs: [
      'cape-town',
      'stellenbosch',
      'garden-route',
      'kruger-national-park',
    ],

    heroImageFilename: 'africa-wild.jpg',

    highlights: [
      'Cape Town and Table Mountain landscapes',
      'Cape Peninsula scenery',
      'South African Winelands',
      'Scenic Garden Route',
      'Wildlife safari in Kruger National Park',
    ],

    itinerary: [
      {
        day: 1,
        title: 'Arrival in Cape Town',
        description:
          'Arrive in Cape Town and begin discovering one of Africa’s most spectacularly situated cities.',
        placeSlug: 'cape-town',
      },
      {
        day: 2,
        title: 'Cape Town',
        description:
          'Explore Cape Town through its coastline, neighbourhoods, food and iconic mountain landscapes.',
        placeSlug: 'cape-town',
      },
      {
        day: 3,
        title: 'The Winelands',
        description:
          'Travel into the Cape Winelands for vineyard landscapes, regional cuisine and time in Stellenbosch.',
        placeSlug: 'stellenbosch',
      },
      {
        day: 4,
        title: 'Garden Route',
        description:
          'Continue along the Garden Route through forests, coastal scenery and protected natural landscapes.',
        placeSlug: 'garden-route',
      },
      {
        day: 5,
        title: 'Into the Wild',
        description:
          'Travel toward Kruger National Park and settle into the safari environment.',
        placeSlug: 'kruger-national-park',
      },
      {
        day: 6,
        title: 'Kruger Safari',
        description:
          'Experience morning and evening game drives in search of South Africa’s remarkable wildlife.',
        placeSlug: 'kruger-national-park',
      },
      {
        day: 7,
        title: 'Final Safari and Departure',
        description:
          'Enjoy a final wildlife experience before concluding the South African journey.',
        placeSlug: 'kruger-national-park',
      },
    ],

    isFeatured: true,
    sortOrder: 4,
  },
]