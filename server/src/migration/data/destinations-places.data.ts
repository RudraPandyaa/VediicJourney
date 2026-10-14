export type MigrationPlace = {
  name: string
  slug: string
  shortDescription: string
  imageFilename?: string
}

export type MigrationDestination = {
  name: string
  slug: string
  regionSlug: string
  shortDescription: string
  overview: string
  heroImageFilename?: string
  isFeatured?: boolean
  sortOrder: number
  places: MigrationPlace[]
}

export const migrationDestinations: MigrationDestination[] = [
  // =========================================================
  // ASIA
  // =========================================================

  {
    name: 'Japan',
    slug: 'japan',
    regionSlug: 'asia',
    shortDescription:
      'Ancient traditions, futuristic cities and serene landscapes in the Land of the Rising Sun.',
    overview:
      'Japan brings together contemporary city life, centuries-old traditions, remarkable cuisine and dramatic natural scenery. From Tokyo and Kyoto to Osaka and Mount Fuji, it offers a journey shaped by culture, craftsmanship and contrast.',
    heroImageFilename: 'Japan.jpg',
    isFeatured: true,
    sortOrder: 1,
    places: [
      {
        name: 'Tokyo',
        slug: 'tokyo',
        shortDescription:
          'Japan’s dynamic capital, known for contemporary culture, exceptional dining and distinctive neighbourhoods.',
      },
      {
        name: 'Kyoto',
        slug: 'kyoto',
        shortDescription:
          'A cultural heart of Japan filled with historic districts, shrines, gardens and traditional experiences.',
      },
      {
        name: 'Osaka',
        slug: 'osaka',
        shortDescription:
          'A lively Japanese city celebrated for its food culture, entertainment and energetic atmosphere.',
      },
      {
        name: 'Mount Fuji',
        slug: 'mount-fuji',
        shortDescription:
          'Japan’s highest mountain and one of the country’s most recognisable natural landmarks.',
      },
    ],
  },

  {
    name: 'Thailand',
    slug: 'thailand',
    regionSlug: 'asia',
    shortDescription:
      'Temples, tropical coastlines, vibrant cities and warm hospitality across Southeast Asia.',
    overview:
      'Thailand combines energetic cities, northern cultural traditions and tropical island escapes. Bangkok, Chiang Mai and Phuket create a varied journey through food, heritage, wellness and coastal landscapes.',
    sortOrder: 2,
    places: [
      {
        name: 'Bangkok',
        slug: 'bangkok',
        shortDescription:
          'Thailand’s vibrant capital, combining temples, markets, contemporary dining and lively neighbourhoods.',
      },
      {
        name: 'Chiang Mai',
        slug: 'chiang-mai',
        shortDescription:
          'Northern Thailand’s cultural centre, surrounded by mountains, temples and traditional communities.',
      },
      {
        name: 'Phuket',
        slug: 'phuket',
        shortDescription:
          'A tropical island destination known for beaches, coastal resorts and access to the Andaman Sea.',
      },
    ],
  },

  {
    name: 'Vietnam',
    slug: 'vietnam',
    regionSlug: 'asia',
    shortDescription:
      'Historic cities, dramatic bays, rich cuisine and compelling landscapes.',
    overview:
      'Vietnam offers a journey through historic neighbourhoods, distinctive regional cuisine and spectacular scenery. Hanoi, Ha Long Bay and Ho Chi Minh City reveal different sides of the country’s culture and energy.',
    sortOrder: 3,
    places: [
      {
        name: 'Hanoi',
        slug: 'hanoi',
        shortDescription:
          'Vietnam’s capital, known for its Old Quarter, lakes, street food and layered cultural heritage.',
      },
      {
        name: 'Ha Long Bay',
        slug: 'ha-long-bay',
        shortDescription:
          'A celebrated seascape of limestone islands and emerald waters in northern Vietnam.',
      },
      {
        name: 'Ho Chi Minh City',
        slug: 'ho-chi-minh-city',
        shortDescription:
          'A fast-moving southern metropolis combining history, food, culture and contemporary city life.',
      },
    ],
  },

  {
    name: 'India',
    slug: 'india',
    regionSlug: 'asia',
    shortDescription:
      'Spiritual traditions, wellness, wildlife, landscapes, cuisine and living cultural heritage.',
    overview:
      'India offers extraordinary diversity through sacred cities, Himalayan landscapes, wildlife reserves, coastal retreats, traditional wellness, regional cuisine and centuries of living culture. Vedic Journey creates immersive experiences that reveal India through meaningful local connections.',
    heroImageFilename: 'india.jpg',
    isFeatured: true,
    sortOrder: 4,
    places: [
      {
        name: 'Rishikesh',
        slug: 'rishikesh',
        shortDescription:
          'A Himalayan gateway on the Ganges known for yoga, wellness, spirituality and outdoor experiences.',
      },
      {
        name: 'Varanasi',
        slug: 'varanasi',
        shortDescription:
          'One of India’s oldest living cities, offering deeply spiritual experiences along the Ganges.',
      },
      {
        name: 'Kerala',
        slug: 'kerala',
        shortDescription:
          'A southern Indian destination of backwaters, tropical landscapes, Ayurveda and distinctive cuisine.',
      },
      {
        name: 'Rajasthan',
        slug: 'rajasthan',
        shortDescription:
          'A region of desert landscapes, colourful traditions, craftsmanship and distinctive heritage.',
        imageFilename: 'Rajasthan.jpg',
      },
    ],
  },

  // =========================================================
  // EUROPE
  // =========================================================

  {
    name: 'Spain',
    slug: 'spain',
    regionSlug: 'europe',
    shortDescription:
      'Art, gastronomy, Mediterranean landscapes and vibrant regional cultures.',
    overview:
      'Spain offers an expressive blend of architecture, food, art, coastline and regional traditions. Barcelona, Madrid, Seville and Mallorca each reveal a distinctive character.',
    sortOrder: 1,
    places: [
      {
        name: 'Barcelona',
        slug: 'barcelona',
        shortDescription:
          'A Mediterranean city celebrated for architecture, design, cuisine and an energetic cultural scene.',
      },
      {
        name: 'Madrid',
        slug: 'madrid',
        shortDescription:
          'Spain’s capital, home to major museums, elegant neighbourhoods and a celebrated culinary culture.',
      },
      {
        name: 'Seville',
        slug: 'seville',
        shortDescription:
          'An Andalusian city known for flamenco, atmospheric streets and a rich cultural identity.',
      },
      {
        name: 'Mallorca',
        slug: 'mallorca',
        shortDescription:
          'A Mediterranean island combining secluded coves, mountains, villages and sophisticated coastal stays.',
      },
    ],
  },

  {
    name: 'Italy',
    slug: 'italy',
    regionSlug: 'europe',
    shortDescription:
      'Art, history, cuisine and timeless Mediterranean landscapes.',
    overview:
      'Italy combines extraordinary art and architecture with regional cuisine, celebrated cities and beautiful countryside. Rome, Florence, Venice and the Amalfi Coast create a journey rich in history and atmosphere.',
    heroImageFilename: 'Rome.jpg',
    isFeatured: true,
    sortOrder: 2,
    places: [
      {
        name: 'Rome',
        slug: 'rome',
        shortDescription:
          'Italy’s capital, where ancient history, art, neighbourhood life and contemporary culture meet.',
        imageFilename: 'Rome.jpg',
      },
      {
        name: 'Florence',
        slug: 'florence',
        shortDescription:
          'The Tuscan city renowned for Renaissance art, architecture and craftsmanship.',
      },
      {
        name: 'Venice',
        slug: 'venice',
        shortDescription:
          'A remarkable lagoon city of canals, historic architecture and distinctive Venetian culture.',
      },
      {
        name: 'Amalfi Coast',
        slug: 'amalfi-coast',
        shortDescription:
          'A dramatic Mediterranean coastline of cliffside towns, sea views and elegant retreats.',
      },
    ],
  },

  {
    name: 'France',
    slug: 'france',
    regionSlug: 'europe',
    shortDescription:
      'Refined culture, celebrated cuisine, art and diverse landscapes.',
    overview:
      'France offers exceptional variety, from Parisian art and architecture to Provence, the Riviera and historic wine regions. Its cuisine, landscapes and cultural heritage make it ideal for carefully paced journeys.',
    heroImageFilename: 'France.jpg',
    sortOrder: 3,
    places: [
      {
        name: 'Paris',
        slug: 'paris',
        shortDescription:
          'France’s capital and a global centre for art, architecture, fashion and gastronomy.',
      },
      {
        name: 'Provence',
        slug: 'provence',
        shortDescription:
          'A southern region of villages, markets, lavender landscapes and Mediterranean flavours.',
      },
      {
        name: 'French Riviera',
        slug: 'french-riviera',
        shortDescription:
          'A glamorous Mediterranean coastline encompassing elegant seaside towns and resorts.',
      },
      {
        name: 'Loire Valley',
        slug: 'loire-valley',
        shortDescription:
          'A scenic region of historic estates, gardens, vineyards and countryside.',
      },
    ],
  },

  {
    name: 'Switzerland',
    slug: 'switzerland',
    regionSlug: 'europe',
    shortDescription:
      'Alpine scenery, pristine lakes and memorable mountain journeys.',
    overview:
      'Switzerland is defined by dramatic Alpine landscapes, beautiful lakes and exceptionally scenic rail journeys. Lucerne, Interlaken, Zermatt and Lake Geneva offer distinct perspectives on the country.',
    sortOrder: 4,
    places: [
      {
        name: 'Lucerne',
        slug: 'lucerne',
        shortDescription:
          'A picturesque lakeside city surrounded by the mountains of central Switzerland.',
      },
      {
        name: 'Interlaken',
        slug: 'interlaken',
        shortDescription:
          'An Alpine base between two lakes with access to some of Switzerland’s finest mountain scenery.',
      },
      {
        name: 'Zermatt',
        slug: 'zermatt',
        shortDescription:
          'A mountain village beneath the Matterhorn known for hiking, skiing and dramatic Alpine views.',
      },
      {
        name: 'Lake Geneva',
        slug: 'lake-geneva',
        shortDescription:
          'A beautiful Alpine lake surrounded by vineyards, towns and mountain landscapes.',
      },
    ],
  },

  {
    name: 'Greece',
    slug: 'greece',
    regionSlug: 'europe',
    shortDescription:
      'Ancient heritage, Aegean islands and beautiful Mediterranean coastlines.',
    overview:
      'Greece combines extraordinary ancient heritage with island landscapes, Mediterranean cuisine and relaxed coastal living. Athens, Santorini, Mykonos and Crete provide contrasting experiences.',
    sortOrder: 5,
    places: [
      {
        name: 'Athens',
        slug: 'athens',
        shortDescription:
          'The Greek capital, where classical heritage sits alongside energetic contemporary neighbourhoods.',
      },
      {
        name: 'Santorini',
        slug: 'santorini',
        shortDescription:
          'A volcanic Aegean island famous for dramatic caldera views and distinctive whitewashed villages.',
      },
      {
        name: 'Mykonos',
        slug: 'mykonos',
        shortDescription:
          'A Cycladic island combining beaches, elegant stays and atmospheric island towns.',
      },
      {
        name: 'Crete',
        slug: 'crete',
        shortDescription:
          'Greece’s largest island, rich in landscapes, cuisine, beaches and ancient heritage.',
      },
    ],
  },

  // =========================================================
  // AFRICA
  // =========================================================

  {
    name: 'South Africa',
    slug: 'south-africa',
    regionSlug: 'africa',
    shortDescription:
      'Safari, coastlines, vineyards and remarkable natural diversity.',
    overview:
      'South Africa brings together wildlife, dramatic coastline, vibrant cities and celebrated food and wine regions. Cape Town, the Winelands and major safari reserves create a highly varied journey.',
    heroImageFilename: 'South Africa.jpg',
    isFeatured: true,
    sortOrder: 1,
    places: [
      {
        name: 'Cape Town',
        slug: 'cape-town',
        shortDescription:
          'A spectacular coastal city framed by Table Mountain and surrounded by beaches and vineyards.',
      },
      {
        name: 'Kruger National Park',
        slug: 'kruger-national-park',
        shortDescription:
          'One of Africa’s renowned wildlife destinations, offering exceptional safari experiences.',
      },
      {
        name: 'Stellenbosch',
        slug: 'stellenbosch',
        shortDescription:
          'A historic Winelands town surrounded by vineyards, mountains and acclaimed restaurants.',
      },
      {
        name: 'Garden Route',
        slug: 'garden-route',
        shortDescription:
          'A scenic coastal journey through forests, beaches, lagoons and nature reserves.',
      },
    ],
  },

  {
    name: 'Egypt',
    slug: 'egypt',
    regionSlug: 'africa',
    shortDescription:
      'Ancient civilisation, Nile landscapes and extraordinary archaeological heritage.',
    overview:
      'Egypt offers a journey through one of the world’s great ancient civilisations. Cairo, Giza, Luxor and Aswan reveal monumental archaeology alongside the landscapes and traditions of the Nile.',
    sortOrder: 2,
    places: [
      {
        name: 'Giza',
        slug: 'giza',
        shortDescription:
          'Home to the celebrated pyramid complex and the Great Sphinx on the edge of Cairo.',
      },
      {
        name: 'Cairo',
        slug: 'cairo',
        shortDescription:
          'Egypt’s energetic capital and a gateway to the country’s extraordinary historical heritage.',
      },
      {
        name: 'Luxor',
        slug: 'luxor',
        shortDescription:
          'An Upper Egyptian city surrounded by some of the country’s most significant ancient sites.',
      },
      {
        name: 'Aswan',
        slug: 'aswan',
        shortDescription:
          'A relaxed Nile city known for river scenery, islands and Nubian cultural connections.',
      },
    ],
  },

  {
    name: 'Kenya',
    slug: 'kenya',
    regionSlug: 'africa',
    shortDescription:
      'Exceptional wildlife, sweeping savannahs and Indian Ocean landscapes.',
    overview:
      'Kenya is one of Africa’s classic safari destinations, combining celebrated wildlife reserves with dramatic scenery and an Indian Ocean coastline.',
    sortOrder: 3,
    places: [
      {
        name: 'Maasai Mara',
        slug: 'maasai-mara',
        shortDescription:
          'A world-renowned wildlife reserve of open savannah and exceptional game viewing.',
      },
      {
        name: 'Amboseli National Park',
        slug: 'amboseli-national-park',
        shortDescription:
          'A celebrated safari landscape known for elephants and views toward Mount Kilimanjaro.',
      },
      {
        name: 'Nairobi',
        slug: 'nairobi',
        shortDescription:
          'Kenya’s capital and a convenient gateway to the country’s wildlife and cultural experiences.',
      },
      {
        name: 'Mombasa',
        slug: 'mombasa',
        shortDescription:
          'A historic Indian Ocean city offering coastal culture and access to Kenya’s beaches.',
      },
    ],
  },

  {
    name: 'Morocco',
    slug: 'morocco',
    regionSlug: 'africa',
    shortDescription:
      'Medinas, mountains, desert landscapes and vibrant North African culture.',
    overview:
      'Morocco offers atmospheric cities, Atlas Mountain landscapes, desert experiences and a rich tradition of craft, architecture and cuisine.',
    sortOrder: 4,
    places: [
      {
        name: 'Marrakech',
        slug: 'marrakech',
        shortDescription:
          'A vibrant Moroccan city of gardens, markets, traditional architecture and celebrated cuisine.',
      },
      {
        name: 'Fes',
        slug: 'fes',
        shortDescription:
          'A historic city renowned for its extensive medina, traditional crafts and cultural heritage.',
      },
      {
        name: 'Chefchaouen',
        slug: 'chefchaouen',
        shortDescription:
          'A mountain town in northern Morocco known for its distinctive blue-painted streets.',
      },
      {
        name: 'Atlas Mountains',
        slug: 'atlas-mountains',
        shortDescription:
          'A dramatic mountain range offering villages, hiking and spectacular North African scenery.',
      },
    ],
  },

  // =========================================================
  // MIDDLE EAST
  // =========================================================

  {
    name: 'United Arab Emirates',
    slug: 'uae',
    regionSlug: 'middle-east',
    shortDescription:
      'Contemporary luxury, desert landscapes and distinctive Emirati culture.',
    overview:
      'The United Arab Emirates combines ambitious contemporary cities with desert landscapes, cultural institutions and sophisticated hospitality. Dubai and Abu Dhabi offer contrasting perspectives on the Emirates.',
    heroImageFilename: 'Dubai.jpg',
    isFeatured: true,
    sortOrder: 1,
    places: [
      {
        name: 'Dubai',
        slug: 'dubai',
        shortDescription:
          'A global city known for contemporary architecture, hospitality, dining and ambitious experiences.',
        imageFilename: 'Dubai.jpg',
      },
      {
        name: 'Abu Dhabi',
        slug: 'abu-dhabi',
        shortDescription:
          'The UAE capital, combining major cultural institutions, waterfront districts and refined hospitality.',
      },
      {
        name: 'Dubai Desert Conservation Reserve',
        slug: 'dubai-desert-conservation-reserve',
        shortDescription:
          'A protected desert landscape offering wildlife encounters and carefully managed desert experiences.',
      },
      {
        name: 'Ras Al Khaimah',
        slug: 'ras-al-khaimah',
        shortDescription:
          'An emirate combining mountains, desert landscapes and Arabian Gulf resorts.',
      },
    ],
  },

  {
    name: 'Jordan',
    slug: 'jordan',
    regionSlug: 'middle-east',
    shortDescription:
      'Ancient archaeology, dramatic desert landscapes and memorable natural experiences.',
    overview:
      'Jordan combines remarkable archaeological heritage with desert scenery and distinctive landscapes. Petra, Wadi Rum, Amman and the Dead Sea form the foundations of a compelling journey.',
    sortOrder: 2,
    places: [
      {
        name: 'Petra',
        slug: 'petra',
        shortDescription:
          'Jordan’s celebrated archaeological city, carved into sandstone cliffs in the country’s south.',
      },
      {
        name: 'Wadi Rum',
        slug: 'wadi-rum',
        shortDescription:
          'A vast desert landscape of sandstone formations, open valleys and memorable night skies.',
      },
      {
        name: 'Dead Sea',
        slug: 'dead-sea-jordan',
        shortDescription:
          'A remarkable salt lake landscape known for mineral-rich waters and restorative stays.',
      },
      {
        name: 'Amman',
        slug: 'amman',
        shortDescription:
          'Jordan’s capital, combining archaeological heritage, neighbourhood culture and contemporary dining.',
      },
    ],
  },

  // =========================================================
  // SOUTH AMERICA
  // =========================================================

  {
    name: 'Peru',
    slug: 'peru',
    regionSlug: 'south-america',
    shortDescription:
      'Andean landscapes, Inca heritage and one of South America’s great culinary cultures.',
    overview:
      'Peru brings together extraordinary archaeology, high-altitude landscapes and a celebrated culinary tradition. Lima, Cusco, the Sacred Valley and Machu Picchu create an unforgettable journey.',
    heroImageFilename: 'peru.jpg',
    isFeatured: true,
    sortOrder: 1,
    places: [
      {
        name: 'Machu Picchu',
        slug: 'machu-picchu',
        shortDescription:
          'The celebrated Inca citadel set high in the dramatic landscapes of the Peruvian Andes.',
      },
      {
        name: 'Cusco',
        slug: 'cusco',
        shortDescription:
          'A historic Andean city and important gateway to the Sacred Valley and Machu Picchu.',
      },
      {
        name: 'Sacred Valley',
        slug: 'sacred-valley',
        shortDescription:
          'An Andean valley of archaeological sites, villages and dramatic mountain scenery.',
      },
      {
        name: 'Lima',
        slug: 'lima',
        shortDescription:
          'Peru’s coastal capital and one of Latin America’s most exciting gastronomic destinations.',
      },
    ],
  },

  {
    name: 'Brazil',
    slug: 'brazil',
    regionSlug: 'south-america',
    shortDescription:
      'Energetic cities, immense natural landscapes and rich cultural traditions.',
    overview:
      'Brazil offers exceptional scale and variety, from Rio de Janeiro and the Atlantic coast to the Amazon and Iguazu Falls. Music, cuisine, wildlife and landscapes shape journeys across the country.',
    heroImageFilename: 'Brazil.jpg',
    sortOrder: 2,
    places: [
      {
        name: 'Rio de Janeiro',
        slug: 'rio-de-janeiro',
        shortDescription:
          'A spectacular coastal city framed by mountains, beaches and an unmistakable cultural energy.',
      },
      {
        name: 'Iguazu Falls',
        slug: 'iguazu-falls-brazil',
        shortDescription:
          'One of the world’s great waterfall systems, surrounded by subtropical rainforest.',
      },
      {
        name: 'Amazon Rainforest',
        slug: 'amazon-rainforest-brazil',
        shortDescription:
          'An immense tropical ecosystem offering extraordinary biodiversity and immersive nature experiences.',
      },
      {
        name: 'Pantanal',
        slug: 'pantanal',
        shortDescription:
          'One of the world’s largest tropical wetlands and an exceptional destination for wildlife viewing.',
      },
    ],
  },

  {
    name: 'Argentina',
    slug: 'argentina',
    regionSlug: 'south-america',
    shortDescription:
      'Tango, wine, Patagonian wilderness and sophisticated city culture.',
    overview:
      'Argentina stretches from the cultural energy of Buenos Aires to Mendoza’s vineyards and the dramatic landscapes of Patagonia. Its scale makes it ideal for varied journeys combining food, nature and adventure.',
    heroImageFilename: 'Argentina.jpg',
    sortOrder: 3,
    places: [
      {
        name: 'Buenos Aires',
        slug: 'buenos-aires',
        shortDescription:
          'Argentina’s cosmopolitan capital, celebrated for architecture, dining, neighbourhood culture and tango.',
      },
      {
        name: 'Mendoza',
        slug: 'mendoza',
        shortDescription:
          'Argentina’s leading wine region, set against the dramatic backdrop of the Andes.',
      },
      {
        name: 'Perito Moreno Glacier',
        slug: 'perito-moreno-glacier',
        shortDescription:
          'A spectacular Patagonian glacier within Los Glaciares National Park.',
      },
      {
        name: 'Ushuaia',
        slug: 'ushuaia',
        shortDescription:
          'A southern Patagonian city surrounded by mountains, forests and the Beagle Channel.',
      },
    ],
  },
]