export interface StoryDocument {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'audio';
  url: string;
  uploadedAt: string;
  thumbnail?: string;
}

export interface RelatedStory {
  id: string;
  title: string;
  date: string;
  relationship: 'continuation' | 'related' | 'response';
}

export interface Story {
  id: string;
  title: string;
  excerpt: string;
  narrator: string;
  date: string;
  duration: string;
  coverImage: string;
  category: 'childhood' | 'family' | 'historical';
  mediaType: 'audio' | 'text';
  audioUrl?: string;
  tags: string[];
  documents?: StoryDocument[];
  relatedStories?: RelatedStory[];
}

export interface FileUpload {
  id: string;
  file: File;
  preview: string;
  progress?: number;
  error?: string;
}