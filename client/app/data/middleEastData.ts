import type { StateData } from './statesData'

export const middleEastData: StateData[] = [
  {
    id: 'uae',
    name: 'United Arab Emirates',
    tagline: 'Where the Future Meets Tradition',
    description: 'The United Arab Emirates (UAE), also known simply as the Emirates, is a country in West Asia, situated at the eastern end of the Arabian Peninsula. It is a federal semi-constitutional monarchy made up of seven emirates, with Abu Dhabi serving as its national capital. The UAE borders Oman to the east...',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop',
    places: [
      { name: 'Dubai (Burj Khalifa & Mall)', description: 'Dubai is the most populous city in the United Arab Emirates and the capital of the Emirate of Dubai. It is on a creek on the southeastern coast of the Persian Gulf. As of 2025, its population stands at 4 million, 92% of whom are expatriates. The wide...' },
      { name: 'Abu Dhabi (Sheikh Zayed Mosque)', description: 'Abu Dhabi is the capital city of the United Arab Emirates (UAE), and of the Emirate of Abu Dhabi, the seat of the Abu Dhabi Central Capital District and the UAE\'s second-most populous city, after Dubai. Situated on a T-shaped island, Abu Dhabi extend...' },
      { name: 'The Palm Jumeirah', description: 'The Palm Jumeirah, also known as the Palm Islands, (Arabic: نخلة جميرا) is an archipelago of artificial islands on the Persian Gulf in Jumeirah, Dubai, United Arab Emirates. It is part of a larger series of developments called the Palm Islands, inclu...' },
      { name: 'Dubai Desert Conservation Reserve', description: 'The Dubai Desert Conservation Reserve, DDCR, is a 225-square-kilometre (87 sq mi) natural reserve in the emirate of Dubai in the United Arab Emirates. It was established by Emiri decree on 9 January 2002 and comprises some 5% of the Emirate of Dubai\'...' },
      { name: 'Louvre Abu Dhabi', description: 'The Louvre Abu Dhabi is an art museum located on Saadiyat Island in Abu Dhabi, United Arab Emirates. It runs under an agreement between the UAE and France, signed in March 2007, that allows it to use the Louvre\'s name until 2047, and has been describ...' },
      { name: 'Sharjah', description: 'Sharjah is a major port city and the third-most populous city in the United Arab Emirates, after Dubai and Abu Dhabi. It is the capital of the Emirate of Sharjah and forms part of the Dubai-Sharjah-Ajman metropolitan area. The emirate shares legal, p...' },
      { name: 'Al Ain', description: 'Al Ain is a city in the Emirate of Abu Dhabi, United Arab Emirates, and the seat of the administrative division of the Al Ain Region. The city is bordered to the east by the Omani town of Al-Buraimi. Al Ain is the largest inland city in the Emirates,...' },
      { name: 'Ras Al Khaimah', description: 'Ras Al Khaimah, often referred to its initials RAK, is an industrial port city and the largest city and capital of the Emirate of Ras Al Khaimah in the United Arab Emirates. The city had a population of 191,753 people in 2025, and is the sixth-most p...' }
    ],
    itinerary: [
      { day: 'Day 1-2', title: 'Futuristic Dubai', description: 'Go to the top of the Burj Khalifa, watch the Dubai Fountain show, and explore the Dubai Mall.' },
      { day: 'Day 3', title: 'Arabian Desert Safari', description: 'Head into the dunes for a 4x4 safari, sunset camel ride, and a traditional Bedouin dinner under the stars.' },
      { day: 'Day 4-5', title: 'Cultural Abu Dhabi', description: 'Travel to Abu Dhabi. Marvel at the Sheikh Zayed Grand Mosque and visit the spectacular Louvre Abu Dhabi.' },
      { day: 'Day 6-7', title: 'Luxury and Departure', description: 'Relax at a luxury resort on Palm Jumeirah before heading to the airport for your flight home.' }
    ]
  },
  {
    id: 'jordan',
    name: 'Jordan',
    tagline: 'Jewel of the Middle East',
    description: 'Jordan, officially the Hashemite Kingdom of Jordan, is a country in the Southern Levant region of West Asia. Jordan is bordered by Syria to the north, Iraq to the east, Saudi Arabia to the south, and both Israel and Palestine to the west. The Jordan River, flowing into the Dead Sea, is located along...',
    image: 'https://images.unsplash.com/photo-1548661710-7f540c9c56d6?q=80&w=2070&auto=format&fit=crop',
    places: [
      { name: 'Petra', description: 'Petra, originally known to its inhabitants as Raqmu, is an ancient city and archaeological site in southern Jordan. Famous for its rock-cut architecture and water conduit systems, Petra is also called the "Rose City" because of the colour of the sand...' },
      { name: 'Wadi Rum', description: 'Wadi Rum (Arabic: وادي رم Wādī Ramm, also Wādī al-Ramm, known also as the Valley of the Moon or Red mountains, is a valley cut into the sandstone and granite rock in southern Jordan, near the border with Saudi Arabia and about 60 km to the east of th...' },
      { name: 'The Dead Sea', description: 'The Dead Sea, also known by other names, is a landlocked salt lake bordered by Jordan to the east, the West Bank to the west and Israel to the southwest. It lies in the endorheic basin of the Jordan Rift Valley, and its main tributary is the Jordan R...' },
      { name: 'Amman', description: 'Amman is the capital and the largest city of Jordan, and the country\'s economic, political, and cultural center. With a population of five million as of 2024, Amman is Jordan\'s primate city and is the largest city in the Levant region, the seventh-la...' },
      { name: 'Jerash', description: 'Jerash or Jarash is a city in northern Jordan. The city is the administrative center of the Jerash Governorate, and has a population of 50,745 as of 2015. It is located 30.0 miles north of the capital city Amman.' },
      { name: 'Mount Nebo', description: 'Mount Nebo is an elevated ridge located in Jordan, approximately 700 metres (2,300 ft) above sea level. Part of the Abarim mountain range, Mount Nebo is mentioned in the Bible as the place where Moses was granted a view of the Promised Land before hi...' },
      { name: 'Aqaba', description: 'Aqābaʾ is the only coastal city in Jordan and the largest and most populous city on the Gulf of Aqaba. Situated in southernmost Jordan, Aqaba is the administrative center of the Aqaba Governorate. The city had a population of 148,398 in 2015 and a la...' },
      { name: 'Dana Biosphere Reserve', description: 'The Dana Biosphere Reserve is Jordan\'s largest nature reserve, located in south-central Jordan. Dana Biosphere Reserve was founded in 1989 in the area in and around the Dana village and Wadi Dana comprising 308 square kilometres (119 sq mi).' }
    ],
    itinerary: [
      { day: 'Day 1-2', title: 'Amman and Ancient Jerash', description: 'Explore the Amman Citadel and take a day trip north to the incredibly preserved Roman ruins of Jerash.' },
      { day: 'Day 3-4', title: 'The Rose City of Petra', description: 'Travel the King\'s Highway to Petra. Spend a full day walking through the Siq to marvel at the Treasury and Monastery.' },
      { day: 'Day 5', title: 'Martian Landscapes of Wadi Rum', description: 'Take a 4x4 tour through the dramatic desert of Wadi Rum and sleep in a luxury Martian dome tent.' },
      { day: 'Day 6-7', title: 'Floating in the Dead Sea', description: 'Head down to the Dead Sea. Cover yourself in mineral-rich mud, float in the waters, and relax before departure.' }
    ]
  }
];
