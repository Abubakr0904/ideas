/**
 * Athkar (Supplications / Remembrances)
 * Organized by category: Morning, Evening, After Prayer, and General
 */

export interface Dhikr {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  repeat: number;
  reference: string;
}

export interface AthkarCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  items: Dhikr[];
}

export const athkarData: AthkarCategory[] = [
  {
    id: 'morning',
    title: 'Morning Athkar',
    icon: 'weather-sunny',
    description: 'Recite after Fajr prayer',
    items: [
      {
        id: 'morning_1',
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ',
        transliteration: "Asbahna wa asbahal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah",
        translation: 'We have reached the morning and at this very time the whole kingdom belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.',
        repeat: 1,
        reference: 'Muslim 4/2088',
      },
      {
        id: 'morning_2',
        arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
        transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namootu wa ilaykan-nushoor",
        translation: 'O Allah, by Your leave we have reached the morning, by Your leave we have reached the evening, by Your leave we live and die, and unto You is our resurrection.',
        repeat: 1,
        reference: 'At-Tirmidhi 5/466',
      },
      {
        id: 'morning_3',
        arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ',
        transliteration: "SubhanAllahi wa bihamdih",
        translation: 'Glory is to Allah and praise is to Him.',
        repeat: 100,
        reference: 'Muslim 4/2071',
      },
      {
        id: 'morning_4',
        arabic: 'لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        transliteration: "La ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadeer",
        translation: 'None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.',
        repeat: 10,
        reference: 'Bukhari 4/95, Muslim 4/2071',
      },
      {
        id: 'morning_5',
        arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        transliteration: "A'oodhu bi kalimatillahit-tammaati min sharri ma khalaq",
        translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
        repeat: 3,
        reference: 'Muslim 4/2081',
      },
      {
        id: 'morning_6',
        arabic: 'بِسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
        transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-samee'ul-'aleem",
        translation: 'In the name of Allah, with whose name nothing on earth or in the heavens can cause harm, and He is the All-Hearing, the All-Knowing.',
        repeat: 3,
        reference: 'Abu Dawud 4/323, At-Tirmidhi 5/465',
      },
      {
        id: 'morning_7',
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ',
        transliteration: "Allahumma inni as'alukal-'afiyata fid-dunya wal-akhirah",
        translation: "O Allah, I ask You for well-being in this world and the Hereafter.",
        repeat: 1,
        reference: 'Abu Dawud 4/324, Ibn Majah 2/332',
      },
      {
        id: 'morning_8',
        arabic: 'حَسْبِيَ اللَّهُ لاَ إِلَـهَ إِلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
        transliteration: "Hasbiyallahu la ilaha illa huwa, 'alayhi tawakkaltu wa huwa rabbul-'arshil-'adheem",
        translation: 'Allah is sufficient for me. None has the right to be worshipped except Him. I put my trust in Him and He is the Lord of the Mighty Throne.',
        repeat: 7,
        reference: 'Abu Dawud',
      },
    ],
  },
  {
    id: 'evening',
    title: 'Evening Athkar',
    icon: 'weather-night',
    description: 'Recite after Asr prayer',
    items: [
      {
        id: 'evening_1',
        arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ',
        transliteration: "Amsayna wa amsal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah",
        translation: 'We have reached the evening and at this very time the whole kingdom belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.',
        repeat: 1,
        reference: 'Muslim 4/2088',
      },
      {
        id: 'evening_2',
        arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
        transliteration: "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namootu wa ilaykal-maseer",
        translation: 'O Allah, by Your leave we have reached the evening, by Your leave we have reached the morning, by Your leave we live and die, and unto You is our return.',
        repeat: 1,
        reference: 'At-Tirmidhi 5/466',
      },
      {
        id: 'evening_3',
        arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ',
        transliteration: "SubhanAllahi wa bihamdih",
        translation: 'Glory is to Allah and praise is to Him.',
        repeat: 100,
        reference: 'Muslim 4/2071',
      },
      {
        id: 'evening_4',
        arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        transliteration: "A'oodhu bi kalimatillahit-tammaati min sharri ma khalaq",
        translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
        repeat: 3,
        reference: 'Muslim 4/2081',
      },
      {
        id: 'evening_5',
        arabic: 'بِسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
        transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-samee'ul-'aleem",
        translation: 'In the name of Allah, with whose name nothing on earth or in the heavens can cause harm, and He is the All-Hearing, the All-Knowing.',
        repeat: 3,
        reference: 'Abu Dawud 4/323, At-Tirmidhi 5/465',
      },
      {
        id: 'evening_6',
        arabic: 'حَسْبِيَ اللَّهُ لاَ إِلَـهَ إِلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
        transliteration: "Hasbiyallahu la ilaha illa huwa, 'alayhi tawakkaltu wa huwa rabbul-'arshil-'adheem",
        translation: 'Allah is sufficient for me. None has the right to be worshipped except Him. I put my trust in Him and He is the Lord of the Mighty Throne.',
        repeat: 7,
        reference: 'Abu Dawud',
      },
    ],
  },
  {
    id: 'after_prayer',
    title: 'After Prayer',
    icon: 'hands-pray',
    description: 'Recite after each obligatory prayer',
    items: [
      {
        id: 'after_1',
        arabic: 'أَسْتَغْفِرُ اللَّهَ',
        transliteration: "Astaghfirullah",
        translation: 'I seek forgiveness from Allah.',
        repeat: 3,
        reference: 'Muslim 1/414',
      },
      {
        id: 'after_2',
        arabic: 'اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ',
        transliteration: "Allahumma antas-salam, wa minkas-salam, tabarakta ya dhal-jalali wal-ikram",
        translation: 'O Allah, You are As-Salam and from You is peace. Blessed are You, O Possessor of Majesty and Honor.',
        repeat: 1,
        reference: 'Muslim 1/414',
      },
      {
        id: 'after_3',
        arabic: 'سُبْحَانَ اللهِ',
        transliteration: "SubhanAllah",
        translation: 'Glory is to Allah.',
        repeat: 33,
        reference: 'Muslim 1/418',
      },
      {
        id: 'after_4',
        arabic: 'الْحَمْدُ لِلَّهِ',
        transliteration: "Alhamdulillah",
        translation: 'All praise is for Allah.',
        repeat: 33,
        reference: 'Muslim 1/418',
      },
      {
        id: 'after_5',
        arabic: 'اللهُ أَكْبَرُ',
        transliteration: "Allahu Akbar",
        translation: 'Allah is the Greatest.',
        repeat: 33,
        reference: 'Muslim 1/418',
      },
      {
        id: 'after_6',
        arabic: 'لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        transliteration: "La ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadeer",
        translation: 'None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.',
        repeat: 1,
        reference: 'Muslim 1/418',
      },
      {
        id: 'after_7',
        arabic: 'آية الكرسي',
        transliteration: "Ayatul Kursi (Al-Baqarah 2:255)",
        translation: 'Allah! There is no god but He, the Living, the Self-subsisting, the Eternal. No slumber can seize Him, nor sleep...',
        repeat: 1,
        reference: 'An-Nasai, Ibn As-Sunni',
      },
    ],
  },
  {
    id: 'sleep',
    title: 'Before Sleep',
    icon: 'bed',
    description: 'Recite before going to sleep',
    items: [
      {
        id: 'sleep_1',
        arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        transliteration: "Bismika Allahumma amootu wa ahya",
        translation: 'In Your name, O Allah, I die and I live.',
        repeat: 1,
        reference: 'Bukhari 11/113',
      },
      {
        id: 'sleep_2',
        arabic: 'سُبْحَانَ اللَّهِ',
        transliteration: "SubhanAllah",
        translation: 'Glory is to Allah.',
        repeat: 33,
        reference: 'Bukhari 4/346, Muslim 4/2091',
      },
      {
        id: 'sleep_3',
        arabic: 'الْحَمْدُ لِلَّهِ',
        transliteration: "Alhamdulillah",
        translation: 'All praise is for Allah.',
        repeat: 33,
        reference: 'Bukhari 4/346, Muslim 4/2091',
      },
      {
        id: 'sleep_4',
        arabic: 'اللهُ أَكْبَرُ',
        transliteration: "Allahu Akbar",
        translation: 'Allah is the Greatest.',
        repeat: 34,
        reference: 'Bukhari 4/346, Muslim 4/2091',
      },
    ],
  },
];
