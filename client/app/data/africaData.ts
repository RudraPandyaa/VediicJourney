import type { StateData } from './statesData'

export const africaData: StateData[] = [
  {
    id: 'south-africa',
    name: 'South Africa',
    tagline: 'A World in One Country',
    description: 'South Africa, officially the Republic of South Africa (RSA), is the southernmost country in Africa. The country consists of nine provinces, and is bounded to the south by 2,798 kilometres of coastline that stretches along the South Atlantic and Indian Ocean; to the north by the neighbouring countrie...',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2070&auto=format&fit=crop',
    places: [
      { name: 'Cape Town', description: 'Cape Town is the legislative capital of South Africa. It is the country\'s oldest city and the seat of the Parliament of South Africa. Cape Town is the country\'s second-largest city by population, after Johannesburg, and the largest city in the Wester...', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8d/Camps_bay_%2853460319478%29_%28cropped%29.jpg/1280px-Camps_bay_%2853460319478%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
      { name: 'Kruger National Park', description: 'Kruger National Park is a national park in South Africa covering an area of 19,623 km2 (7,576 sq mi) in the provinces of Limpopo and Mpumalanga in the country\'s northeast. It extends 360 km (220 mi) from north to south and 65 km (40 mi) from east to ...', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Kruger_Zebra.JPG/1280px-Kruger_Zebra.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
      { name: 'Stellenbosch', description: 'Stellenbosch is a town in the Western Cape province of South Africa, situated about 50 kilometres east of Cape Town, along the banks of the Eerste River at the foot of the Stellenbosch Mountain. The town became known as the City of Oaks or Eikestad i...', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Stellenbosch_aerial_photo_from_north-west_2024-01.jpg/1280px-Stellenbosch_aerial_photo_from_north-west_2024-01.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
      { name: 'Garden Route', description: 'The Garden Route is a 300-kilometre (190 mi) stretch of the south-eastern coast of South Africa which extends from Witsand in the Western Cape to the border of Tsitsikamma Storms River in the Eastern Cape. The name comes from the verdant and ecologic...', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Gardenroute_overview.gif/1280px-Gardenroute_overview.gif?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
      { name: 'Robben Island', description: 'Robben Island is an island in Table Bay, 6.9 kilometres (4.3 mi) west of the coast of Bloubergstrand, north of Cape Town, South Africa. It takes its name from the archaic Dutch word for seals (robben), hence the Dutch/Afrikaans name Robbeneiland, whi...', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/Robben_Island_-_Cape_Town%2C_South_Africa_%283883849594%29.jpg/1280px-Robben_Island_-_Cape_Town%2C_South_Africa_%283883849594%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
      { name: 'Drakensberg Mountains', description: 'The Drakensberg is the eastern portion of the Great Escarpment, which encloses the central Southern African plateau. The Great Escarpment reaches its greatest elevation – 2,000 to 3,482 metres within the border region of South Africa and Lesotho.' },
      { name: 'Boulders Beach', description: 'Boulders Beach is a sheltered beach made up of inlets between granite boulders, from which the name originated. It is located on the eastern side of the Cape Peninsula, in Simon\'s Town, in the southern region of Cape Town, South Africa. It is also co...', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/Boulders_Beach_Suedafrika.jpg/1280px-Boulders_Beach_Suedafrika.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
      { name: 'Blyde River Canyon', description: 'The Blyde River Canyon is a 26 km long canyon located in Mpumalanga, South Africa. It is the third-largest canyon on Earth, behind the Grand Canyon and the Fish River Canyon. Unlike the Grand and Fish River Canyon, the Blyde River Canyon is a "green ...', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/20131119_162543b.jpg/1280px-20131119_162543b.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' }
    ],
    itinerary: [
      { day: 'Day 1-2', title: 'Cape Town Highlights', description: 'Take the cable car up Table Mountain, explore the V&A Waterfront, and visit Robben Island.' },
      { day: 'Day 3', title: 'The Cape Peninsula', description: 'Drive to the Cape of Good Hope and visit the penguins at Boulders Beach.' },
      { day: 'Day 4-5', title: 'The Winelands', description: 'Travel to Stellenbosch and Franschhoek for world-class wine tasting and culinary delights.' },
      { day: 'Day 6-7', title: 'Kruger Safari', description: 'Fly to Kruger National Park for thrilling morning and evening game drives to spot the Big Five.' }
    ]
  },
  {
    id: 'egypt',
    name: 'Egypt',
    tagline: 'Land of the Pharaohs',
    description: 'Egypt, officially the Arab Republic of Egypt, is a country spanning the northeast corner of Africa and southwest corner of Asia via the Sinai Peninsula. It is bordered by the Mediterranean Sea to the north, Palestine and Israel to the northeast, the Red Sea to the east, Sudan and the Sahara to the s...',
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=2070&auto=format&fit=crop',
    places: [
      { name: 'Giza Necropolis', description: 'The Giza pyramid complex in Egypt is home to the Great Pyramid, the pyramid of Khafre, and the pyramid of Menkaure, along with their associated pyramid complexes and the Great Sphinx. All were built during the Fourth Dynasty of the Old Kingdom of anc...' },
      { name: 'Cairo', description: 'Cairo is the capital and largest city of Egypt and the Cairo Governorate. It is home to more than 9.8 million people. It is also part of the largest urban agglomeration in Africa, the Arab world, and the Middle East. The Greater Cairo metropolitan ar...', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Cairo_Opera_House%2C_Al_Hurriyah_Park_and_the_Nile_river_%2814797782354%29.jpg/1280px-Cairo_Opera_House%2C_Al_Hurriyah_Park_and_the_Nile_river_%2814797782354%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
      { name: 'Luxor', description: 'Luxor is a city in Upper Egypt. Luxor had a population of 284,952 in 2023, with an area of 43.0 km2 (16.6 sq mi) and is the capital of the Luxor Governorate. Nicknamed the City of a Hundred Gates or the City of the Sun, formerly known as Thebes. It w...', image: 'https://upload.wikimedia.org/wikipedia/commons/3/35/LuxorHotelsIbnWalidSt.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled' },
      { name: 'Valley of the Kings', description: 'The Valley of the Kings, also known as the Valley of the Gates of the Kings, is an area in Egypt where, for a period of nearly 500 years from the Eighteenth Dynasty to the Twentieth Dynasty, rock-cut tombs were excavated for pharaohs and powerful nob...', image: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Luxor%2C_Tal_der_K%C3%B6nige_%281995%2C_860x605%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled' },
      { name: 'Aswan', description: 'Aswan is a city in Upper Egypt and the capital of the Aswan Governorate. The city of Aswan is among the oldest continuously inhabited cities, with its recorded history spanning over 2,600 years.', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Panoramic_view_of_Aswan%2C_Egypt.jpg/1280px-Panoramic_view_of_Aswan%2C_Egypt.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
      { name: 'Abu Simbel', description: 'Abu Simbel is a historic site comprising two massive rock-cut temples in the village of Abu Simbel, Aswan Governorate, Upper Egypt, near the border with Sudan. It is located on the western bank of Lake Nasser, about 230 km (140 mi) southwest of Aswan...', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Ramsis%2C_Aswan_Governorate%2C_Egypt_-_panoramio.jpg/1280px-Ramsis%2C_Aswan_Governorate%2C_Egypt_-_panoramio.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
      { name: 'Alexandria', description: 'Alexandria is a major city in Egypt. Lying at the western edge of the Nile River Delta, it extends about 40 km (25 mi) along the country\'s northern coast. It is Egypt\'s principal seaport, the second largest city after Cairo, and the largest city on t...', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/San_Stefano_Grand_Plaza.JPG/1280px-San_Stefano_Grand_Plaza.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
      { name: 'Red Sea Coast', description: 'World-class diving and resorts in destinations like Sharm El Sheikh and Hurghada. Experience a journey like no other, where ancient traditions blend seamlessly with modern wonders. This breathtaking destination offers visitors an unparalleled opportu...' }
    ],
    itinerary: [
      { day: 'Day 1-2', title: 'Pyramids and Cairo', description: 'Marvel at the Great Pyramids of Giza, the Sphinx, and explore the treasures of the Egyptian Museum.' },
      { day: 'Day 3', title: 'Flight to Luxor', description: 'Fly to Luxor. Visit the massive Karnak Temple complex and the beautifully illuminated Luxor Temple at night.' },
      { day: 'Day 4-5', title: 'Nile Cruise to Aswan', description: 'Explore the Valley of the Kings, then board a traditional felucca or cruise ship sailing up the Nile to Aswan.' },
      { day: 'Day 6-7', title: 'Aswan and Abu Simbel', description: 'Visit the Philae Temple. Take an early morning excursion to the breathtaking temples of Abu Simbel.' }
    ]
  },
  {
    id: 'kenya',
    name: 'Kenya',
    tagline: 'The Ultimate Safari Destination',
    description: 'Kenya, officially the Republic of Kenya, is a country located in East Africa. With an estimated population of more than 54.2 million as of mid-2026, it is the 26th-most populous country in the world and the seventh-most populous in Africa. Kenya\'s capital and largest city is Nairobi. The second-larg...',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop',
    places: [
      { name: 'Maasai Mara', description: 'Maasai Mara, sometimes also spelt Masai Mara and locally known simply as The Mara, is a large national game reserve in Narok County, Kenya, contiguous with the Serengeti National Park in Tanzania. It is named in honour of the Maasai people, the ances...', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/17/Masai_Mara_at_Sunset.jpg/1280px-Masai_Mara_at_Sunset.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail' },
      { name: 'Amboseli National Park', description: 'Amboseli National Park, formerly Maasai Amboseli Game Reserve, is a national park in Loitoktok District in Kajiado County, Kenya. It measures 392 km2 (151 sq mi) in size at the core of an 8,000 km2 (3,100 sq mi) ecosystem that spreads across the Keny...' },
      { name: 'Lake Nakuru', description: 'Lake Nakuru is one of the Rift Valley lakes, located at an elevation of 1,754 m (5,755 ft) above sea level. It lies to the south of Nakuru, in the rift valley of Kenya and is protected by Lake Nakuru National Park.' },
      { name: 'Nairobi', description: 'Nairobi, is the capital and largest city of Kenya, located in the south-central part of the country. As of 2026, it has a population of 5.6 million and a metropolitan population of 15.95 million, making it the 8th most populous city in Africa and the...' },
      { name: 'Tsavo National Park', description: 'Tsavo National Park may refer to:Tsavo East National Park, a national park in Kenya on the eastern side of the A109 road Tsavo West National Park, a national park in Kenya on the western side of the A109 road' },
      { name: 'Mombasa', description: 'Mombasa is a coastal city in southeastern Kenya along the Indian Ocean. It was the first capital of British East Africa, before Nairobi was elevated to capital status in 1907. It now serves as the capital of Mombasa County. Buildings in the Central B...' },
      { name: 'Mount Kenya', description: 'Mount Kenya is the second highest mountain in Africa and the namesake of the country Kenya. Located about 150 km north-northeast of the capital of Nairobi and just 16.5 kilometres south of the equator, the mountain\'s highest peaks are Batian, Nelion,...' },
      { name: 'Lamu Island', description: 'Lamu Island is a port, city, and island just off the shore of Kenya in the Indian Ocean approximately 240 kilometers from Mombasa. It is a part of the East African country of Kenya. The settlement at Lamu was founded in the 12th century. Lamu is one ...' }
    ],
    itinerary: [
      { day: 'Day 1-2', title: 'Nairobi Arrivals', description: 'Arrive in Nairobi. Visit the David Sheldrick Wildlife Trust to see orphaned elephants, and the Giraffe Centre.' },
      { day: 'Day 3-4', title: 'Elephants of Amboseli', description: 'Travel to Amboseli National Park. Enjoy game drives with the majestic Mount Kilimanjaro as your backdrop.' },
      { day: 'Day 5-6', title: 'The Maasai Mara', description: 'Fly to the Maasai Mara. Experience world-class game viewing and visit a traditional Maasai village.' },
      { day: 'Day 7', title: 'Coastal Relaxation', description: 'Fly to the coast (Mombasa or Diani Beach) for some relaxation by the warm Indian Ocean.' }
    ]
  },
  {
    id: 'morocco',
    name: 'Morocco',
    tagline: 'Colors of the Maghreb',
    description: 'Morocco, officially the Kingdom of Morocco, is a country in the Maghreb region of North Africa. It has coastlines on the Mediterranean Sea to the north and the Atlantic Ocean to the west, and has land borders with Algeria to the east; the Spanish exclaves of Ceuta, Melilla and Peñón de Vélez de la G...',
    image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2071&auto=format&fit=crop',
    places: [
      { name: 'Marrakech', description: 'Marrakesh or Marrakech is the fourth-largest city in Morocco. It is one of the four imperial cities of Morocco and is the capital of the Marrakesh-Safi region. The city lies west of the foothills of the Atlas Mountains.' },
      { name: 'Fes', description: 'Fez or Fes is a city in northern inland Morocco and the capital of the Fez-Meknes administrative region. It is one of the largest cities in Morocco, with a population of 1.256 million, according to the 2024 census. Located to the northwest of the Atl...' },
      { name: 'Chefchaouen', description: 'Chefchaouen is a city in northwest Morocco. It is the chief town of the province of the same name and is noted for its buildings in shades of blue, for which it is nicknamed the "Blue City". It is situated in a mountainous region in northern Morocco,...' },
      { name: 'Sahara Desert (Merzouga)', description: 'The Sahara is a desert spanning North Africa. With an area of 9,200,000 square kilometres (3,600,000 sq mi), it is the largest hot desert in the world and the third-largest desert overall, smaller only than the deserts of Antarctica and the northern ...' },
      { name: 'Casablanca', description: 'Casablanca is the largest city in Morocco and the country\'s economic and business centre. Located on the Atlantic coast of the Chaouia plain in the central-western part of Morocco, the city has a population of about 3.22 million in the urban area, an...' },
      { name: 'Atlas Mountains', description: 'The Atlas Mountains are a mountain range in the Maghreb in North Africa. They separate the Sahara from the Mediterranean Sea and the Atlantic Ocean; the mountain range stretches around 2,500 km (1,600 mi) through Morocco, Algeria and Tunisia. The mou...' },
      { name: 'Essaouira', description: 'Essaouira, known until the 1960s as Mogador, is a port city in the western Moroccan region of Marrakesh-Safi, on the Atlantic coast. It has 77,966 inhabitants as of 2014.' },
      { name: 'Ait Benhaddou', description: 'Aït Benhaddou is a historic ighrem or ksar along the former caravan route between the Sahara and Marrakesh in Morocco. It is considered a great example of Moroccan earthen clay architecture and has been a UNESCO World Heritage Site since 1987.' }
    ],
    itinerary: [
      { day: 'Day 1-2', title: 'Magic of Marrakech', description: 'Explore the Bahia Palace, the Majorelle Garden, and get lost in the vibrant souks of the Medina.' },
      { day: 'Day 3', title: 'Over the Atlas', description: 'Drive through the High Atlas Mountains via the Tizi n\'Tichka pass to visit the Kasbah of Ait Benhaddou.' },
      { day: 'Day 4-5', title: 'Sahara Desert Trek', description: 'Reach the edge of the Sahara at Merzouga. Ride a camel into the dunes and spend the night in a luxury desert camp.' },
      { day: 'Day 6-7', title: 'The Imperial City of Fes', description: 'Travel north to Fes. Spend a day exploring the massive, ancient, car-free Medina and its historic tanneries.' }
    ]
  }
];
