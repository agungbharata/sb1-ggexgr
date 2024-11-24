import { IslamicTemplate, QuranVerse } from '../components/templates/types';

export const QURAN_VERSES: QuranVerse[] = [
  {
    surah: "Ar-Rum",
    ayat: 21,
    arabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِقَوْمٍ يَتَفَكَّرُونَ",
    translation: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
    latin: "Wa min āyātihī an khalaqa lakum min anfusikum azwājan litaskunū ilaihā wa ja'ala bainakum mawaddatan wa raḥmah, inna fī żālika la`āyātil liqaumin yatafakkarūn"
  },
  {
    surah: "An-Nur",
    ayat: 32,
    arabic: "وَأَنكِحُوا الْأَيَامَىٰ مِنكُمْ وَالصَّالِحِينَ مِنْ عِبَادِكُمْ وَإِمَائِكُمْ ۚ إِن يَكُونُوا فُقَرَاءَ يُغْنِهِمُ اللَّهُ مِن فَضْلِهِ ۗ وَاللَّهُ وَاسِعٌ عَلِيمٌ",
    translation: "Dan nikahkanlah orang-orang yang masih membujang di antara kamu, dan juga orang-orang yang layak (menikah) dari hamba-hamba sahayamu yang laki-laki dan perempuan. Jika mereka miskin, Allah akan memberi kemampuan kepada mereka dengan karunia-Nya. Dan Allah Mahaluas (pemberian-Nya), Maha Mengetahui.",
    latin: "Wa ankiḥul-ayāmā minkum waṣ-ṣāliḥīna min 'ibādikum wa imā`ikum, iy yakūnū fuqarā`a yugnihimullāhu min faḍlih, wallāhu wāsi'un 'alīm"
  }
];

export const ISLAMIC_TEMPLATES: IslamicTemplate[] = [
  {
    id: 'islamic-modern-1',
    name: 'Modern Geometric',
    category: 'islamic',
    previewImage: '/templates/islamic-modern-1.jpg',
    description: 'Template modern dengan sentuhan geometri Islam yang elegan',
    quranVerses: QURAN_VERSES,
    bismillah: true,
    style: {
      colors: ['#2C3E50', '#E74C3C', '#ECF0F1'],
      patterns: ['geometric-pattern-1.png'],
      borders: ['modern-border-1.png'],
      primaryFont: 'Amiri',
      secondaryFont: 'Lato'
    }
  },
  {
    id: 'islamic-traditional-1',
    name: 'Traditional Arabic',
    category: 'islamic',
    previewImage: '/templates/islamic-traditional-1.jpg',
    description: 'Template tradisional dengan ornamen Arab klasik',
    quranVerses: QURAN_VERSES,
    bismillah: true,
    style: {
      colors: ['#8E44AD', '#2ECC71', '#F1C40F'],
      patterns: ['arabic-pattern-1.png'],
      borders: ['traditional-border-1.png'],
      primaryFont: 'Scheherazade New',
      secondaryFont: 'Montserrat'
    }
  }
];
