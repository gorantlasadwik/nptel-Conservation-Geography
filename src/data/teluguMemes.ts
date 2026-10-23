export type MemeTier = 'super_praise' | 'good_effort' | 'warning_wakeup' | 'savage_roast';

export interface TeluguMeme {
  id: string;
  cleanName: string;
  title: string;
  translit: string;
  meaning: string;
  tier: MemeTier;
  emoji: string;
}

export const TELUGU_MEMES: TeluguMeme[] = [
  // Super Praise (80% - 99%)
  {
    id: 'wow_andham',
    cleanName: 'wow-enti-me-andham.mp3',
    title: 'వావ్ ఏంటి మీ అందం!',
    translit: 'Wow enti me andham',
    meaning: 'Brahmanandam in awe of your brilliance & beauty!',
    tier: 'super_praise',
    emoji: '🌟',
  },
  {
    id: 'hi_boys_pandago',
    cleanName: 'hi-boys-pandago.mp3',
    title: 'హాయ్ బాయ్స్ పండగ ఎంజాయ్ మ్యాన్!',
    translit: 'Hi boys pandago enjoy man',
    meaning: "Sunil's iconic festival celebration mode!",
    tier: 'super_praise',
    emoji: '🎉',
  },
  {
    id: 'enjoy_pandago',
    cleanName: 'enjoy-pandago.mp3',
    title: 'Enjoy Pandago!',
    translit: 'Enjoy pandago',
    meaning: 'Pandago star full celebratory vibes!',
    tier: 'super_praise',
    emoji: '🕺',
  },
  {
    id: 'aatagade',
    cleanName: 'aatagade.mp3',
    title: 'ఆటగాడే!',
    translit: 'Aatagade',
    meaning: 'What a player! Pro level answers!',
    tier: 'super_praise',
    emoji: '🔥',
  },
  {
    id: 'manchodivi_anna',
    cleanName: 'manchodivi-anna.mp3',
    title: 'మంచోడివి అన్నా నువ్వు!',
    translit: 'Manchodivi anna nuvvu',
    meaning: 'Heartfelt respect and appreciation for your score!',
    tier: 'super_praise',
    emoji: '❤️',
  },
  {
    id: 'flash_man',
    cleanName: 'flash-man.mp3',
    title: 'ఓ మై గాడ్ ఫ్లాష్ మ్యాన్!',
    translit: 'Oh my god flash man',
    meaning: 'Lightning speed intellectual genius!',
    tier: 'super_praise',
    emoji: '⚡',
  },
  {
    id: 'thalapathy',
    cleanName: 'thalapathy.mp3',
    title: 'దళపతి దళపతి!',
    translit: 'Thalapathy Thalapathy',
    meaning: 'Mass hero elevation chant!',
    tier: 'super_praise',
    emoji: '👑',
  },

  // Good Effort (65% - 79%)
  {
    id: 'nijamga_chepthunna',
    cleanName: 'nijamga-chepthunna.mp3',
    title: 'నిజంగా చెప్తున్నా అండి!',
    translit: 'Nijamga chepthunna andi',
    meaning: "I'm telling you truly, honest good effort!",
    tier: 'good_effort',
    emoji: '🤝',
  },
  {
    id: 'indhuvadana',
    cleanName: 'indhuvadana.mp3',
    title: 'ఇందువదన కుందరదన...',
    translit: 'Indhuvadana Kundaradana',
    meaning: "Brahmanandam's classic poetic musical parody!",
    tier: 'good_effort',
    emoji: '🎶',
  },
  {
    id: 'mellaga_karagani',
    cleanName: 'mellaga-karagani.mp3',
    title: 'మెల్లగా కరగని...',
    translit: 'Mellaga karagani',
    meaning: 'Smooth, steady, and consistent effort!',
    tier: 'good_effort',
    emoji: '🧊',
  },
  {
    id: 'namaskaram',
    cleanName: 'namaskaram.mp3',
    title: 'నమస్కారం!',
    translit: 'Namaskaram',
    meaning: 'Brahmanandam folding hands with peaceful respect!',
    tier: 'good_effort',
    emoji: '🙏',
  },
  {
    id: 'chinna_sekalu',
    cleanName: 'chinna-sekalu.mp3',
    title: 'చిన్న చేష్టలు లేవు రా!',
    translit: 'Chinna sekalu levu ra',
    meaning: 'No small antics, full style performance!',
    tier: 'good_effort',
    emoji: '😎',
  },
  {
    id: 'puvvu_purugu',
    cleanName: 'puvvu-purugu.mp3',
    title: 'పువ్వు ఉంటది పురుగు ఉంటది!',
    translit: 'Puvvu untadhi purugu untadhi',
    meaning: 'A mix of flowers and worms — half right, half wrong!',
    tier: 'good_effort',
    emoji: '🌸',
  },

  // Warning / Reality Check (45% - 64%)
  {
    id: 'podhunne_legandra',
    cleanName: 'podhunne-legandra.mp3',
    title: 'పొద్దున్నే లెగండ్రా!',
    translit: 'Podhunne legandra',
    meaning: 'Wake up early in the morning and hit the books!',
    tier: 'warning_wakeup',
    emoji: '⏰',
  },
  {
    id: 'intlo_padukovadam',
    cleanName: 'intlo-padukovadam.mp3',
    title: 'ఇంట్లో పడుకోవడం కాదు!',
    translit: 'Intlo padukovadam kadhu',
    meaning: "Sleeping at home won't pass the exam, wake up!",
    tier: 'warning_wakeup',
    emoji: '🛌',
  },
  {
    id: 'leendi_saar',
    cleanName: 'leendi-saar.mp3',
    title: 'లేవండి సార్!',
    translit: 'Leendi saar',
    meaning: 'Brahmanandam waking you up to prepare!',
    tier: 'warning_wakeup',
    emoji: '🥱',
  },
  {
    id: 'style_unnav',
    cleanName: 'style-unnav.mp3',
    title: 'స్టైల్ దేంగటానికే ఉన్నావ్!',
    translit: 'Style Dengatanike unnav',
    meaning: 'All style and no revision — need more practice!',
    tier: 'warning_wakeup',
    emoji: '🕶️',
  },
  {
    id: 'ma_atta_intlo',
    cleanName: 'ma-atta-intlo.mp3',
    title: 'మా అత్త వాళ్ళ ఇంట్లో ఉన్నాను!',
    translit: 'Ma atta vala intlo unnanu',
    meaning: 'Giving excuses about being busy elsewhere!',
    tier: 'warning_wakeup',
    emoji: '🏠',
  },
  {
    id: 'daddy_ra_daddy',
    cleanName: 'daddy-ra-daddy.mp3',
    title: 'డాడీ రా డాడీ!',
    translit: 'Daddy ra daddy',
    meaning: 'Daddy is checking your marks sheet!',
    tier: 'warning_wakeup',
    emoji: '👨‍👦',
  },
  {
    id: 'nela_chesadu',
    cleanName: 'nela-chesadu.mp3',
    title: 'నెల చేసాడు వచ్చేసాడు!',
    translit: 'Nela chesadu vachesadu',
    meaning: 'Comic reality check dialogue!',
    tier: 'warning_wakeup',
    emoji: '😅',
  },
  {
    id: 'enni_ra_pampichedi',
    cleanName: 'enni-ra-pampichedi.mp3',
    title: 'ఎన్ని రా పంపించేది, ఫోన్ హ్యాంగ్ అవుతుంది!',
    translit: 'Enni ra pampichedi, phn hang avthundhi',
    meaning: 'So many wrong clicks that the whole phone hung!',
    tier: 'warning_wakeup',
    emoji: '📱',
  },

  // Savage Roast / Epic Fail (0% - 44%)
  {
    id: 'chi_waste_bathuku',
    cleanName: 'chi-waste-bathuku.mp3',
    title: 'ఛీ ఎందుకు రా నీకు ఈ వేస్ట్ బతుకు!',
    translit: 'Chi endhuku ra neku e waste bathuku',
    meaning: "Brahmanandam's legendary savage roast of a failed test!",
    tier: 'savage_roast',
    emoji: '🤦‍♂️',
  },
  {
    id: 'good_lkg',
    cleanName: 'good-lkg.mp3',
    title: 'గుడ్, LKG లో పడేయండి!',
    translit: 'Good LKG lo Padeyandi',
    meaning: 'Jai Chiranjeeva: Send this candidate back to LKG Kindergarten!',
    tier: 'savage_roast',
    emoji: '👶',
  },
  {
    id: 'dhukkam_vasthundha',
    cleanName: 'dhukkam-vasthundha.mp3',
    title: 'ఏ నాన్న దుఃఖం వస్తుందా?',
    translit: 'A nanna dhukkam vasthundha',
    meaning: 'Are tears rolling down your cheeks seeing this score?',
    tier: 'savage_roast',
    emoji: '😢',
  },
  {
    id: 'gorrelu',
    cleanName: 'gorrelu.mp3',
    title: 'గొర్రెలు వచ్చేశారు!',
    translit: 'Gorrelu vachesaru',
    meaning: 'The blind guessing sheep have arrived in the quiz!',
    tier: 'savage_roast',
    emoji: '🐑',
  },
  {
    id: 'sairam',
    cleanName: 'sairam.mp3',
    title: 'సాయిరామ్...',
    translit: 'Sairam',
    meaning: 'Stunned silence in utter shock and despair!',
    tier: 'savage_roast',
    emoji: '🧘',
  },
  {
    id: 'sairam_sairam',
    cleanName: 'sairam-sairam.mp3',
    title: 'సాయిరామ్ సాయిరామ్...',
    translit: 'Sairam sairam',
    meaning: 'Praying repeatedly to God for divine mercy on marks!',
    tier: 'savage_roast',
    emoji: '😱',
  },
  {
    id: 'address_pettu',
    cleanName: 'address-pettu.mp3',
    title: 'అడ్రస్ పెట్టు!',
    translit: 'Address pettu',
    meaning: 'Send your address! Ready to challenge whoever set this test!',
    tier: 'savage_roast',
    emoji: '🥊',
  },
  {
    id: 'gudiseti',
    cleanName: 'gudiseti.mp3',
    title: 'గుడిసేటి నా కొడకా!',
    translit: 'Gudiseti na kodaka',
    meaning: 'Extreme raw frustrated roast!',
    tier: 'savage_roast',
    emoji: '🤬',
  },
  {
    id: 'erripuko',
    cleanName: 'erripuko.mp3',
    title: 'ఎర్రి...',
    translit: 'Erripuko',
    meaning: 'Raw comedic trolling roast dialogue!',
    tier: 'savage_roast',
    emoji: '💥',
  },
  {
    id: 'omae_wa_mou',
    cleanName: 'omae-wa-mou.mp3',
    title: 'Omae Wa Mou Shindeiru!',
    translit: 'Omae wa mou shindeiru (NANI?!)',
    meaning: 'You are already dead! Fatal test score!',
    tier: 'savage_roast',
    emoji: '💀',
  },
];

/**
 * Returns audio URL compatible with GitHub Pages base URL and localhost.
 */
export function getMemeAudioUrl(cleanName: string): string {
  const base = import.meta.env.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}audio/memes/${cleanName}`;
}

/**
 * Given score details, selects the appropriate Telugu meme.
 * If 100% score (accuracy >= 100 or all questions correct with 100%),
 * returns null because Rebel Saab is dedicated for 100%.
 */
export function selectTeluguMemeForScore(
  accuracy: number,
  totalQuestions: number,
  correctCount: number
): TeluguMeme | null {
  // If 100% score -> Rebel Saab takes over
  if (accuracy >= 100 || (totalQuestions > 0 && correctCount === totalQuestions && accuracy >= 99.5)) {
    return null;
  }

  let targetTier: MemeTier;
  if (accuracy >= 80) {
    targetTier = 'super_praise';
  } else if (accuracy >= 65) {
    targetTier = 'good_effort';
  } else if (accuracy >= 45) {
    targetTier = 'warning_wakeup';
  } else {
    targetTier = 'savage_roast';
  }

  const pool = TELUGU_MEMES.filter((m) => m.tier === targetTier);
  if (pool.length === 0) return TELUGU_MEMES[0];

  // Pick a random meme from the matched tier
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

/**
 * Gets another random meme from the same tier (for shuffle / next meme feature)
 */
export function getRandomMemeFromTier(tier: MemeTier, excludeId?: string): TeluguMeme {
  const pool = TELUGU_MEMES.filter((m) => m.tier === tier && m.id !== excludeId);
  if (pool.length === 0) {
    const allInTier = TELUGU_MEMES.filter((m) => m.tier === tier);
    return allInTier[0] || TELUGU_MEMES[0];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Categorized audio pool for Correct Answers (Praise, elevation & celebration)
 */
export const CORRECT_ANSWER_MEME_FILES: string[] = [
  'NOICE_BASE64', // embedded noice
  'wow-enti-me-andham.mp3',
  'hi-boys-pandago.mp3',
  'enjoy-pandago.mp3',
  'aatagade.mp3',
  'flash-man.mp3',
  'thalapathy.mp3',
  'manchodivi-anna.mp3',
  'nijamga-chepthunna.mp3',
  'indhuvadana.mp3',
  'mellaga-karagani.mp3',
  'namaskaram.mp3',
  'chinna-sekalu.mp3',
];

/**
 * Categorized audio pool for Wrong Answers (Roasts, comedy warnings & despair)
 */
export const WRONG_ANSWER_MEME_FILES: string[] = [
  'FAHH_BASE64', // embedded fahh
  'chi-waste-bathuku.mp3',
  'good-lkg.mp3',
  'dhukkam-vasthundha.mp3',
  'gorrelu.mp3',
  'sairam.mp3',
  'sairam-sairam.mp3',
  'address-pettu.mp3',
  'gudiseti.mp3',
  'erripuko.mp3',
  'omae-wa-mou.mp3',
  'podhunne-legandra.mp3',
  'intlo-padukovadam.mp3',
  'style-unnav.mp3',
  'leendi-saar.mp3',
  'ma-atta-intlo.mp3',
  'daddy-ra-daddy.mp3',
  'nela-chesadu.mp3',
  'enni-ra-pampichedi.mp3',
  'puvvu-purugu.mp3',
];

export function getRandomCorrectMemeFile(): string {
  const idx = Math.floor(Math.random() * CORRECT_ANSWER_MEME_FILES.length);
  return CORRECT_ANSWER_MEME_FILES[idx];
}

export function getRandomWrongMemeFile(): string {
  const idx = Math.floor(Math.random() * WRONG_ANSWER_MEME_FILES.length);
  return WRONG_ANSWER_MEME_FILES[idx];
}
