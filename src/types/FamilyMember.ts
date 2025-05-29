export interface Document {
  id: string;
  name: string;
  type: 'image' | 'pdf';
  url: string;
  uploadedAt: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  birthYear: number;
  deathYear: number | null;
  biography: string | null;
  photoUrl: string | null;
  storyCount: number;
  color: string;
  documents?: Document[];
}