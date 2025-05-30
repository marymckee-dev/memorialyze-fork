import { Story } from '../types/Story';
import { FamilyMember } from '../types/FamilyMember';

export const sampleAudioFiles = {
  story1: '/audio/story1.mp3',
  story2: '/audio/story2.mp3',
  story3: '/audio/story3.mp3'
};

export const sampleStories: Story[] = [
  {
    id: '8b0a4977-54d7-419e-84b6-dfd6fb87d1b4',
    title: 'Summer at Grandpa\'s Farm',
    excerpt: 'Every summer, we would visit my grandparents\' farm in Iowa. The smell of freshly baked apple pie would greet us before we even got out of the car...',
    narrator: 'Sarah Johnson',
    date: 'June 12, 2023',
    duration: '05:32',
    coverImage: 'https://images.pexels.com/photos/2252315/pexels-photo-2252315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'childhood',
    mediaType: 'audio',
    audioUrl: sampleAudioFiles.story1,
    tags: ['Grandpa', 'Farm', 'Summer']
  },
  {
    id: '693f2d85-d57d-432d-a413-e34d98d09a5d',
    title: 'Dad\'s World War II Stories',
    excerpt: 'My father rarely talked about his experiences in the war, but on his 80th birthday, he opened up about what it was like as a young soldier...',
    narrator: 'Robert Johnson',
    date: 'August 3, 2023',
    duration: '12:45',
    coverImage: 'https://images.pexels.com/photos/39483/landscape-autumn-season-trees-39483.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'historical',
    mediaType: 'audio',
    audioUrl: sampleAudioFiles.story2,
    tags: ['Dad', 'War', 'History']
  },
  {
    id: 'b1d8b321-69b5-4998-9770-7ef9768015a2',
    title: 'The Family Thanksgiving Tradition',
    excerpt: 'Our Thanksgiving tradition started in 1965 when my mother decided that everyone would share something they were grateful for before dinner...',
    narrator: 'Emily Johnson',
    date: 'November 20, 2023',
    duration: '08:15',
    coverImage: 'https://images.pexels.com/photos/5379153/pexels-photo-5379153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'family',
    mediaType: 'audio',
    audioUrl: sampleAudioFiles.story3,
    tags: ['Thanksgiving', 'Traditions', 'Family']
  },
  {
    id: '4922d144-dd53-4d7f-bbef-b64cd8928cc2',
    title: 'How Mom and Dad Met',
    excerpt: 'It was a rainy day in April 1975, and my mother had forgotten her umbrella. My father, a stranger at the time, offered to share his...',
    narrator: 'Michael Johnson',
    date: 'February 14, 2024',
    duration: '06:22',
    coverImage: 'https://images.pexels.com/photos/1261731/pexels-photo-1261731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'family',
    mediaType: 'audio',
    audioUrl: sampleAudioFiles.story1,
    tags: ['Mom', 'Dad', 'Love Story']
  },
  {
    id: '58c9a2ac-5e61-490d-9d81-f5d168325be6',
    title: 'Grandma\'s Secret Recipe',
    excerpt: 'My grandmother was known for her chocolate cake, which won the county fair three years in a row. She finally revealed her secret ingredient...',
    narrator: 'Jessica Smith',
    date: 'March 5, 2024',
    duration: '04:50',
    coverImage: 'https://images.pexels.com/photos/2523650/pexels-photo-2523650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'family',
    mediaType: 'audio',
    audioUrl: sampleAudioFiles.story2,
    tags: ['Grandma', 'Cooking', 'Recipes']
  },
  {
    id: '849b74be-c6b5-4012-9962-ee72732c93db',
    title: 'First Day of School',
    excerpt: 'I still remember my first day of kindergarten. Mom had ironed my new outfit the night before, and I carried my lunch in a Star Wars lunchbox...',
    narrator: 'David Johnson',
    date: 'September 8, 2023',
    duration: '07:10',
    coverImage: 'https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'childhood',
    mediaType: 'audio',
    audioUrl: sampleAudioFiles.story3,
    tags: ['School', 'Childhood', 'Memories']
  }
];

export const sampleFamilyMembers: FamilyMember[] = [
  {
    id: 'abc9204d-2c14-4425-8a2f-f93375503b6e',
    name: 'Elizabeth Johnson',
    birthYear: 1935,
    deathYear: 2020,
    biography: 'The matriarch of the Johnson family, Elizabeth was known for her kindness, incredible baking skills, and dedication to her family. She raised five children and was a schoolteacher for over 40 years.',
    photoUrl: 'https://images.pexels.com/photos/2050994/pexels-photo-2050994.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    storyCount: 5,
    color: '#00afaf'
  },
  {
    id: '8cded6c2-05a4-467d-927e-a215c1ca4b54',
    name: 'Robert Johnson Sr.',
    birthYear: 1932,
    deathYear: 2018,
    biography: 'A World War II veteran and later a civil engineer, Robert Sr. was known for his strong work ethic and sense of humor. He loved fishing and taking his grandchildren camping every summer.',
    photoUrl: 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    storyCount: 8,
    color: '#ffb900'
  },
  {
    id: 'a8b7f096-1c5e-4da1-a6c6-90c0846cbd61',
    name: 'Margaret Wilson',
    birthYear: 1938,
    deathYear: null,
    biography: 'Elizabeth\'s sister Margaret has always been the family historian, documenting events and keeping photos organized. She worked as a librarian and has an incredible memory for family stories.',
    photoUrl: null,
    storyCount: 3,
    color: '#c300ff'
  },
  {
    id: '8519ca1e-b3e7-451a-9a95-a4fcee2849c4',
    name: 'Robert Johnson Jr.',
    birthYear: 1958,
    deathYear: null,
    biography: 'The oldest son of Elizabeth and Robert Sr., he followed in his father\'s footsteps as an engineer. He has three children and enjoys woodworking in his spare time.',
    photoUrl: null,
    storyCount: 2,
    color: '#00afaf'
  },
  {
    id: '0810d068-73f7-4847-a438-52e57d199090',
    name: 'Sarah Johnson',
    birthYear: 1960,
    deathYear: null,
    biography: 'The family organizer who keeps everyone connected. Sarah became a teacher like her mother and is passionate about preserving family stories for future generations.',
    photoUrl: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    storyCount: 6,
    color: '#ffb900'
  },
  {
    id: '658e8281-4bfe-410c-9389-3f189510fc5a',
    name: 'Michael Johnson',
    birthYear: 1962,
    deathYear: null,
    biography: 'The youngest of Elizabeth and Robert Sr.\'s children, Michael is known for his creativity and storytelling abilities. He works as a journalist and has documented many family interviews.',
    photoUrl: null,
    storyCount: 4,
    color: '#c300ff'
  }
];