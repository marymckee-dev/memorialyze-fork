import { Story } from '../types/Story';
import { FamilyMember } from '../types/FamilyMember';

export const sampleAudioFiles = {
  story1: '/audio/story1.mp3',
  story2: '/audio/story2.mp3',
  story3: '/audio/story3.mp3'
};

export const sampleStories: Story[] = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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
    id: '4',
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
    id: '5',
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
    id: '6',
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
    id: '1',
    name: 'Elizabeth Johnson',
    birthYear: 1935,
    deathYear: 2020,
    biography: 'The matriarch of the Johnson family, Elizabeth was known for her kindness, incredible baking skills, and dedication to her family. She raised five children and was a schoolteacher for over 40 years.',
    photoUrl: 'https://images.pexels.com/photos/2050994/pexels-photo-2050994.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    storyCount: 5,
    color: '#00afaf'
  },
  {
    id: '2',
    name: 'Robert Johnson Sr.',
    birthYear: 1932,
    deathYear: 2018,
    biography: 'A World War II veteran and later a civil engineer, Robert Sr. was known for his strong work ethic and sense of humor. He loved fishing and taking his grandchildren camping every summer.',
    photoUrl: 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    storyCount: 8,
    color: '#ffb900'
  },
  {
    id: '3',
    name: 'Margaret Wilson',
    birthYear: 1938,
    deathYear: null,
    biography: 'Elizabeth\'s sister Margaret has always been the family historian, documenting events and keeping photos organized. She worked as a librarian and has an incredible memory for family stories.',
    photoUrl: null,
    storyCount: 3,
    color: '#c300ff'
  },
  {
    id: '4',
    name: 'Robert Johnson Jr.',
    birthYear: 1958,
    deathYear: null,
    biography: 'The oldest son of Elizabeth and Robert Sr., he followed in his father\'s footsteps as an engineer. He has three children and enjoys woodworking in his spare time.',
    photoUrl: null,
    storyCount: 2,
    color: '#00afaf'
  },
  {
    id: '5',
    name: 'Sarah Johnson',
    birthYear: 1960,
    deathYear: null,
    biography: 'The family organizer who keeps everyone connected. Sarah became a teacher like her mother and is passionate about preserving family stories for future generations.',
    photoUrl: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    storyCount: 6,
    color: '#ffb900'
  },
  {
    id: '6',
    name: 'Michael Johnson',
    birthYear: 1962,
    deathYear: null,
    biography: 'The youngest of Elizabeth and Robert Sr.\'s children, Michael is known for his creativity and storytelling abilities. He works as a journalist and has documented many family interviews.',
    photoUrl: null,
    storyCount: 4,
    color: '#c300ff'
  }
];