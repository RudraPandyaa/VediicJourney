export type MigrationRegion = {
  name: string
  slug: string
  shortDescription: string
  imageFilename?: string
  sortOrder: number
}

export const migrationRegions: MigrationRegion[] = [
  {
    name: 'Asia',
    slug: 'asia',
    shortDescription:
      'Ancient traditions, vibrant cultures and extraordinary landscapes across Asia.',
    imageFilename: 'asia.jpg',
    sortOrder: 1,
  },
  {
    name: 'Europe',
    slug: 'europe',
    shortDescription:
      'History, art, cuisine and timeless landscapes across Europe.',
    imageFilename: 'europe.jpg',
    sortOrder: 2,
  },
  {
    name: 'Africa',
    slug: 'africa',
    shortDescription:
      'Wild landscapes, remarkable cultures and unforgettable journeys across Africa.',
    imageFilename: 'africa.jpg',
    sortOrder: 3,
  },
  {
    name: 'Middle East',
    slug: 'middle-east',
    shortDescription:
      'Heritage, desert landscapes and contemporary luxury across the Middle East.',
    imageFilename: 'middle-east.jpg',
    sortOrder: 4,
  },
  {
    name: 'South America',
    slug: 'south-america',
    shortDescription:
      'Dramatic landscapes, vibrant cultures and immersive journeys across South America.',
    imageFilename: 'south-america.jpg',
    sortOrder: 5,
  },
  {
    name: 'Australia',
    slug: 'australia',
    shortDescription:
      'Distinctive landscapes, coastlines and experiences across Australia.',
    imageFilename: 'australia.jpg',
    sortOrder: 6,
  },
  {
    name: 'North America',
    slug: 'north-america',
    shortDescription:
      'Diverse landscapes, cities and experiences across North America.',
    imageFilename: 'north-america.jpg',
    sortOrder: 7,
  },
]