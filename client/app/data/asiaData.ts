export interface ItineraryDay {
  day: string;
  title: string;
  description: string;
}

export interface Place {
  name: string;
  description: string;
  image?: string;
}

export interface StateData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  places: Place[];
  itinerary: ItineraryDay[];
}

export const asiaData: StateData[] = [
  {
    id: 'japan',
    name: 'Japan',
    tagline: 'Land of the Rising Sun',
    description: 'Japan is an island country in East Asia. It is situated in the northwest Pacific Ocean and is bordered on the west by the Sea of Japan, extending from the Sea of Okhotsk in the north toward the East China Sea, Philippine Sea, and Taiwan in the south.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop',
    places: [
      { name: 'Tokyo', description: 'Tokyo, officially the Tokyo Metropolis, is the capital and most populous city of Japan.', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2088&auto=format&fit=crop' },
      { name: 'Kyoto', description: 'Kyoto, officially Kyoto City, is the capital city of Kyoto Prefecture in Japan. It was the imperial capital of Japan for over a millennium.', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Osaka', description: 'Osaka is a designated city in the Kansai region of Honshu in Japan. It is the capital of and most populous city in Osaka Prefecture.', image: 'https://images.unsplash.com/photo-1590559899731-a382839cecdf?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Mount Fuji', description: 'Mount Fuji is an active stratovolcano located on the Japanese island of Honshu, and the country\'s highest peak.', image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?q=80&w=2070&auto=format&fit=crop' }
    ],
    itinerary: [
      { day: 'Day 1-3', title: 'Tokyo Exploration', description: 'Experience the bustling streets of Shibuya, ancient temples in Asakusa, and the vibrant Akihabara district.' },
      { day: 'Day 4-6', title: 'Kyoto Traditions', description: 'Travel via Shinkansen to Kyoto. Visit the Fushimi Inari Shrine and Kinkaku-ji.' },
      { day: 'Day 7', title: 'Osaka Cuisine', description: 'Conclude the trip in Osaka, exploring the culinary delights of Dotonbori.' }
    ]
  },
  {
    id: 'thailand',
    name: 'Thailand',
    tagline: 'Land of Smiles',
    description: 'Thailand, officially the Kingdom of Thailand, is a country in Southeast Asia. It is bordered to the north by Myanmar and Laos, to the east by Laos and Cambodia, to the south by the Gulf of Thailand and Malaysia, and to the west by the Andaman Sea.',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2039&auto=format&fit=crop',
    places: [
      { name: 'Bangkok', description: 'Bangkok is the capital and most populous city of Thailand. The city occupies 1,568.7 square kilometres in the Chao Phraya River delta in central Thailand.', image: 'https://images.unsplash.com/photo-1508009603885-24740f9c2d76?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Chiang Mai', description: 'Chiang Mai is the largest city in northern Thailand and the capital of Chiang Mai Province.', image: 'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Phuket', description: 'Phuket is one of the southern provinces of Thailand. It consists of the island of Phuket, the country\'s largest island.', image: 'https://images.unsplash.com/photo-1589394815804-964ce0ff9657?q=80&w=2070&auto=format&fit=crop' }
    ],
    itinerary: [
      { day: 'Day 1-2', title: 'Vibrant Bangkok', description: 'Visit the Grand Palace, Wat Pho, and enjoy street food at a night market.' },
      { day: 'Day 3-5', title: 'Cultural Chiang Mai', description: 'Explore ancient temples, visit an ethical elephant sanctuary, and learn Thai cooking.' },
      { day: 'Day 6-7', title: 'Beaches of Phuket', description: 'Relax on the pristine beaches of Phuket or take a boat tour to Phi Phi Islands.' }
    ]
  },
  {
    id: 'vietnam',
    name: 'Vietnam',
    tagline: 'Timeless Charm',
    description: 'Vietnam, officially the Socialist Republic of Vietnam, is a country in Southeast Asia. Located at the eastern edge of mainland Southeast Asia, it covers 331,212 square kilometres.',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop',
    places: [
      { name: 'Hanoi', description: 'Hanoi is the capital of Vietnam. It covers an area of 3,358.6 square kilometers.', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Ha Long Bay', description: 'Ha Long Bay is a UNESCO World Heritage Site and popular travel destination in Quảng Ninh Province, Vietnam.', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Ho Chi Minh City', description: 'Ho Chi Minh City, formerly known as Saigon, is the most populous city in Vietnam.', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=2070&auto=format&fit=crop' }
    ],
    itinerary: [
      { day: 'Day 1-2', title: 'Historic Hanoi', description: 'Wander through the Old Quarter and visit the Ho Chi Minh Mausoleum.' },
      { day: 'Day 3-4', title: 'Cruising Ha Long Bay', description: 'Take an overnight cruise through the stunning limestone karsts of Ha Long Bay.' },
      { day: 'Day 5-7', title: 'Dynamic Ho Chi Minh City', description: 'Explore the bustling streets of Saigon, visit the War Remnants Museum, and tour the Cu Chi Tunnels.' }
    ]
  },
  {
    id: 'india',
    name: 'India',
    tagline: 'Incredible India',
    description: 'India, officially the Republic of India, is a country in South Asia. It is the seventh-largest country by area, the most populous country, and the most populous democracy in the world.',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop',
    places: [
      { name: 'New Delhi', description: 'New Delhi is the capital of India and a part of the National Capital Territory of Delhi.', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070&auto=format&fit=crop' },
      { name: 'Agra', description: 'Agra is a city on the banks of the Yamuna river in the Indian state of Uttar Pradesh, home to the Taj Mahal.', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop' },
      { name: 'Jaipur', description: 'Jaipur is the capital and the largest city of the north-western Indian state of Rajasthan.', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070&auto=format&fit=crop' }
    ],
    itinerary: [
      { day: 'Day 1-2', title: 'Delhi Delights', description: 'Explore the historical monuments of Delhi, including the Red Fort, Qutub Minar, and India Gate.' },
      { day: 'Day 3', title: 'Taj Mahal', description: 'Travel to Agra to witness the breathtaking beauty of the Taj Mahal at sunrise.' },
      { day: 'Day 4-6', title: 'Pink City', description: 'Discover the royal heritage of Jaipur, visiting the Amber Fort, Hawa Mahal, and City Palace.' }
    ]
  }
];
