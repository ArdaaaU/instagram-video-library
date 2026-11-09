export interface VideoItem {
  id: string;
  url: string;
  type: 'video' | 'post';
  cover?: string;
  title: string;
  caption?: string;
  category: string;
  tags?: string[];
  addedAt: string;
  likes?: number;
  isFavorite?: boolean;
}

export type ViewMode = 'grid' | 'reels';
export type SortOption = 'newest' | 'oldest' | 'title';
