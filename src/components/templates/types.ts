export interface QuranVerse {
  surah: string;
  ayat: number;
  arabic: string;
  translation: string;
  latin?: string;
}

export interface IslamicTemplate {
  id: string;
  name: string;
  category: 'islamic';
  previewImage: string;
  description: string;
  quranVerses: QuranVerse[];
  bismillah: boolean;
  style: {
    colors: string[];
    patterns: string[];
    borders: string[];
    primaryFont: string;
    secondaryFont: string;
  };
}
