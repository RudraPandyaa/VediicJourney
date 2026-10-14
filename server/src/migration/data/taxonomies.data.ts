export type MigrationTaxonomy = {
  name: string
  slug: string
  shortDescription: string
  imageFilename?: string
  sortOrder: number
}

export const migrationExperiences: MigrationTaxonomy[] = [
  {
    name: 'Spiritual',
    slug: 'spiritual',
    shortDescription:
      'Meaningful journeys shaped by sacred places, ancient traditions and moments of reflection.',
    imageFilename: 'spiritual.jpg',
    sortOrder: 1,
  },
  {
    name: 'Wellness',
    slug: 'wellness',
    shortDescription:
      'Restorative journeys combining wellbeing, nature, mindful practices and considered stays.',
    imageFilename: 'wellness.jpg',
    sortOrder: 2,
  },
  {
    name: 'Adventure',
    slug: 'adventure',
    shortDescription:
      'Immersive journeys through dramatic landscapes, outdoor experiences and active exploration.',
    imageFilename: 'adventure.jpg',
    sortOrder: 3,
  },
  {
    name: 'Wildlife',
    slug: 'wildlife',
    shortDescription:
      'Remarkable encounters with wildlife and natural habitats through responsible travel experiences.',
    imageFilename: 'wildlife.jpg',
    sortOrder: 4,
  },
  {
    name: 'Culinary',
    slug: 'culinary',
    shortDescription:
      'Discover destinations through regional flavours, local ingredients and memorable dining experiences.',
    imageFilename: 'culinary.jpg',
    sortOrder: 5,
  },
  {
    name: 'Cultural',
    slug: 'cultural',
    shortDescription:
      'Journeys connecting travellers with living traditions, art, heritage and local communities.',
    imageFilename: 'cultural.jpg',
    sortOrder: 6,
  },
  {
    name: 'Luxury',
    slug: 'luxury',
    shortDescription:
      'Refined journeys shaped by exceptional stays, thoughtful service and carefully selected experiences.',
    imageFilename: 'luxury.jpg',
    sortOrder: 7,
  },
  {
    name: 'Romance',
    slug: 'romance',
    shortDescription:
      'Beautifully paced journeys designed for couples, celebrations and memorable shared experiences.',
    imageFilename: 'romance.jpg',
    sortOrder: 8,
  },
  {
    name: 'Family',
    slug: 'family',
    shortDescription:
      'Thoughtfully designed journeys bringing generations together through engaging shared experiences.',
    imageFilename: 'family.jpg',
    sortOrder: 9,
  },
]

export const migrationTravelStyles: MigrationTaxonomy[] = [
  {
    name: 'Solo',
    slug: 'solo',
    shortDescription:
      'Personalised journeys designed around the freedom, interests and pace of independent travellers.',
    sortOrder: 1,
  },
  {
    name: 'Couple',
    slug: 'couple',
    shortDescription:
      'Bespoke journeys designed for two, balancing shared discovery with time to unwind.',
    sortOrder: 2,
  },
  {
    name: 'Family',
    slug: 'family',
    shortDescription:
      'Flexible journeys designed around families, different generations and shared experiences.',
    sortOrder: 3,
  },
  {
    name: 'Honeymoon',
    slug: 'honeymoon',
    shortDescription:
      'Romantic journeys combining distinctive stays, privacy and memorable experiences for two.',
    sortOrder: 4,
  },
  {
    name: 'Corporate',
    slug: 'corporate',
    shortDescription:
      'Considered travel programmes for teams, retreats, incentives and professional groups.',
    sortOrder: 5,
  },
]