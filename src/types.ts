export interface Story {
  id: string;
  title: string;
  author: string;
  location: string;
  category: string;
  description: string;
  audioUrl?: string;
  date: string;
}

export interface FishingSpot {
  id: string;
  name: string;
  species: string;
  season: string;
  sustainable: string;
  notes: string;
  lat: number;
  lng: number;
  date: string;
}

export interface UserProfile {
  name: string;
  community: string;
  role: string;
}

export interface InternetTest {
  id: string;
  download: string;
  upload: string;
  ping: string;
  quality: string;
  date: string;
}
