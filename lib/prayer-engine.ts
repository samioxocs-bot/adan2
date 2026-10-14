import {
  Coordinates,
  CalculationMethod,
  PrayerTimes,
  SunnahTimes,
  Qibla,
  Madhab,
   CalculationParameters,
} from 'adhan'

export type PrayerId = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'
export type CalcMethodId =
  | 'umm_al_qura'
  | 'muslim_world_league'
  | 'egyptian'
  | 'karachi'
  | 'isna'
  | 'dubai'
  | 'kuwait'
  | 'qatar'

export interface CityPreset {
  id: string
  nameAr: string
  nameEn: string
  countryAr: string
  countryEn: string
  lat: number
  lng: number
  timeZone: string
  method: CalcMethodId
}

export const CITY_PRESETS: CityPreset[] = [
  {
    id: 'makkah',
    nameAr: 'مكة المكرمة',
    nameEn: 'Makkah',
    countryAr: 'السعودية',
    countryEn: 'Saudi Arabia',
    lat: 21.4225,
    lng: 39.8262,
    timeZone: 'Asia/Riyadh',
    method: 'umm_al_qura',
  },
  {
    id: 'madinah',
    nameAr: 'المدينة المنورة',
    nameEn: 'Madinah',
    countryAr: 'السعودية',
    countryEn: 'Saudi Arabia',
    lat: 24.4672,
    lng: 39.6112,
    timeZone: 'Asia/Riyadh',
    method: 'umm_al_qura',
  },
  {
    id: 'riyadh',
    nameAr: 'الرياض',
    nameEn: 'Riyadh',
    countryAr: 'السعودية',
    countryEn: 'Saudi Arabia',
    lat: 24.7136,
    lng: 46.6753,
    timeZone: 'Asia/Riyadh',
    method: 'umm_al_qura',
  },
  {
    id: 'cairo',
    nameAr: 'القاهرة',
    nameEn: 'Cairo',
    countryAr: 'مصر',
    countryEn: 'Egypt',
    lat: 30.0444,
    lng: 31.2357,
    timeZone: 'Africa/Cairo',
    method: 'egyptian',
  },
  {
    id: 'dubai',
    nameAr: 'دبي',
    nameEn: 'Dubai',
    countryAr: 'الإمارات',
    countryEn: 'UAE',
    lat: 25.2048,
    lng: 55.2708,
    timeZone: 'Asia/Dubai',
    method: 'dubai',
  },
  {
    id: 'alquds',
    nameAr: 'القدس الشريف',
    nameEn: 'Al-Quds',
    countryAr: 'فلسطين',
    countryEn: 'Palestine',
    lat: 31.7683,
    lng: 35.2137,
    timeZone: 'Asia/Jerusalem',
    method: 'muslim_world_league',
  },
  {
    id: 'doha',
    nameAr: 'الدوحة',
    nameEn: 'Doha',
    countryAr: 'قطر',
    countryEn: 'Qatar',
    lat: 25.2854,
    lng: 51.531,
    timeZone: 'Asia/Qatar',
    method: 'qatar',
  },
  {
    id: 'istanbul',
    nameAr: 'إسطنبول',
    nameEn: 'Istanbul',
    countryAr: 'تركيا',
    countryEn: 'Turkey',
    lat: 41.0082,
    lng: 28.9784,
    timeZone: 'Europe/Istanbul',
    method: 'muslim_world_league',
  },
  {
    id: 'casablanca',
    nameAr: 'الدار البيضاء',
    nameEn: 'Casablanca',
    countryAr: 'المغرب',
    countryEn: 'Morocco',
    lat: 33.5731,
    lng: -7.5898,
    timeZone: 'Africa/Casablanca',
    method: 'muslim_world_league',
  },
  {
    id: 'london',
    nameAr: 'لندن',
    nameEn: 'London',
    countryAr: 'المملكة المتحدة',
    countryEn: 'United Kingdom',
    lat: 51.5074,
    lng: -0.1278,
    timeZone: 'Europe/London',
    method: 'muslim_world_league',
  },
]

export const CALC_METHODS: {
  id: CalcMethodId
  nameAr: string
  nameEn: string
}[] = [
  { id: 'umm_al_qura', nameAr: 'تقويم أم القرى (مكة المكرمة)', nameEn: 'Umm Al-Qura University, Makkah' },
  { id: 'muslim_world_league', nameAr: 'رابطة العالم الإسلامي', nameEn: 'Muslim World League (MWL)' },
  { id: 'egyptian', nameAr: 'الهيئة المصرية العامة للمساحة', nameEn: 'Egyptian General Authority' },
  { id: 'dubai', nameAr: 'دائرة الشؤون الإسلامية بدبي', nameEn: 'Dubai Islamic Affairs' },
  { id: 'qatar', nameAr: 'دار التقويم القطري', nameEn: 'Qatar Calendar House' },
  { id: 'kuwait', nameAr: 'وزارة الأوقاف الكويتية', nameEn: 'Kuwait Ministry of Awqaf' },
  { id: 'isna', nameAr: 'الجمعية الإسلامية لأمريكا الشمالية', nameEn: 'ISNA (North America)' },
  { id: 'karachi', nameAr: 'جامعة العلوم الإسلامية بكراتشي', nameEn: 'University of Islamic Sciences, Karachi' },
]

export function getCalculationParams(method: CalcMethodId, madhab: 'shafi' | 'hanafi' = 'shafi'): CalculationParameters {
  let params: CalculationParameters
  switch (method) {
    case 'umm_al_qura':
      params = CalculationMethod.UmmAlQura()
      break
    case 'egyptian':
      params = CalculationMethod.Egyptian()
      break
    case 'dubai':
      params = CalculationMethod.Dubai()
      break
    case 'qatar':
      params = CalculationMethod.Qatar()
      break
    case 'kuwait':
      params = CalculationMethod.Kuwait()
      break
    case 'isna':
      params = CalculationMethod.NorthAmerica()
      break
    case 'karachi':
      params = CalculationMethod.Karachi()
      break
    case 'muslim_world_league':
    default:
      params = CalculationMethod.MuslimWorldLeague()
      break
  }
  params.madhab = madhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi
  return params
}

export interface PrayerScheduleItem {
  id: PrayerId
  nameAr: string
  nameEn: string
  time: Date
  formatted24: string
  formatted12Ar: string
  formatted12En: string
  isNext: boolean
  isPassed: boolean
  verseAr: string
  verseRefAr: string
  verseEn: string
  recommendedWindowMinutes: number
}

export interface ComputedPrayerDay {
  dateIso: string
  hijriDateAr: string
  hijriDateEn: string
  hijriMonthAr: string
  hijriDay: number
  hijriYear: number
  gregorianAr: string
  gregorianEn: string
  prayers: PrayerScheduleItem[]
  sunrise: {
    time: Date
    formatted12Ar: string
    formatted12En: string
  }
  imsak: {
    time: Date
    formatted12Ar: string
    formatted12En: string
  }
  iftar: {
    time: Date
    formatted12Ar: string
    formatted12En: string
  }
  lastThirdOfNight: {
    time: Date
    formatted12Ar: string
    formatted12En: string
  }
  nextPrayer: {
    id: PrayerId
    nameAr: string
    nameEn: string
    time: Date
    formatted12Ar: string
    formatted12En: string
    remainingSeconds: number
    remainingFormatted: string
    alertState: 'none' | 'pre15' | 'pre5' | 'now'
  }
  qiblaAngle: number
  distanceToKaabaKm: number
}

const PRAYER_META: Record<
  PrayerId,
  {
    nameAr: string
    nameEn: string
    verseAr: string
    verseRefAr: string
    verseEn: string
    recommendedWindowMinutes: number
  }
> = {
  fajr: {
    nameAr: 'الفجر',
    nameEn: 'Fajr',
    verseAr: 'أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ إِلَىٰ غَسَقِ اللَّيْلِ وَقُرْآنَ الْفَجْرِ ۖ إِنَّ قُرْآنَ الْفَجْرِ كَانَ مَشْهُودًا',
    verseRefAr: 'سورة الإسراء - آية 78',
    verseEn: 'Indeed, the recitation of dawn is ever witnessed. (Al-Isra 17:78)',
    recommendedWindowMinutes: 20,
  },
  dhuhr: {
    nameAr: 'الظهر',
    nameEn: 'Dhuhr',
    verseAr: 'حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ',
    verseRefAr: 'سورة البقرة - آية 238',
    verseEn: 'Maintain with care the obligatory prayers and stand before Allah devoutly. (Al-Baqarah 2:238)',
    recommendedWindowMinutes: 25,
  },
  asr: {
    nameAr: 'العصر',
    nameEn: 'Asr',
    verseAr: 'وَالْعَصْرِ * إِنَّ الْإِنسَانَ لَفِي خُسْرٍ * إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ',
    verseRefAr: 'سورة العصر - آية 1-3',
    verseEn: 'By time, indeed mankind is in loss, except those who believe and do righteous deeds. (Al-Asr 103:1-3)',
    recommendedWindowMinutes: 20,
  },
  maghrib: {
    nameAr: 'المغرب',
    nameEn: 'Maghrib',
    verseAr: 'فَسُبْحَانَ اللَّهِ حِينَ تُمْسُونَ وَحِينَ تُصْبِحُونَ',
    verseRefAr: 'سورة الروم - آية 17',
    verseEn: 'So exalted is Allah when you reach the evening and when you reach the morning. (Ar-Rum 30:17)',
    recommendedWindowMinutes: 12,
  },
  isha: {
    nameAr: 'العشاء',
    nameEn: 'Isha',
    verseAr: 'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا',
    verseRefAr: 'سورة النساء - آية 103',
    verseEn: 'Indeed, prayer has been decreed upon the believers a decree of specified times. (An-Nisa 4:103)',
    recommendedWindowMinutes: 30,
  },
}

export function formatTime12Ar(date: Date, timeZone = 'Asia/Riyadh'): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone,
  }).formatToParts(date)
  const hour = parts.find((p) => p.type === 'hour')?.value || '12'
  const minute = parts.find((p) => p.type === 'minute')?.value || '00'
  const dayPeriod = parts.find((p) => p.type === 'dayPeriod')?.value || 'AM'
  const suffix = dayPeriod.toUpperCase().includes('P') ? 'م' : 'ص'
  return `${hour}:${minute} ${suffix}`
}

export function formatTime12En(date: Date, timeZone = 'Asia/Riyadh'): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone,
  }).format(date)
}

export function formatTime24(date: Date, timeZone = 'Asia/Riyadh'): string {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone,
  }).format(date)
}

export function calculateDistanceToKaabaKm(lat: number, lng: number): number {
  const kaabaLat = 21.422487
  const kaabaLng = 39.826206
  const R = 6371
  const dLat = ((kaabaLat - lat) * Math.PI) / 180
  const dLng = ((kaabaLng - lng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((kaabaLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

export function computePrayerSchedule(
  lat: number,
  lng: number,
  method: CalcMethodId = 'umm_al_qura',
  madhab: 'shafi' | 'hanafi' = 'shafi',
  now: Date = new Date(),
  timeZone = 'Asia/Riyadh'
): ComputedPrayerDay {
  const coords = new Coordinates(lat, lng)
  const params = getCalculationParams(method, madhab)
  const prayerTimes = new PrayerTimes(coords, now, params)
  const sunnahTimes = new SunnahTimes(prayerTimes)
  const qiblaAngle = Math.round(Qibla(coords) * 10) / 10

  // Imsak is traditionally 10 minutes before Fajr
  const imsakTime = new Date(prayerTimes.fajr.getTime() - 10 * 60 * 1000)
  const iftarTime = prayerTimes.maghrib

  const rawEntries: { id: PrayerId; time: Date }[] = [
    { id: 'fajr', time: prayerTimes.fajr },
    { id: 'dhuhr', time: prayerTimes.dhuhr },
    { id: 'asr', time: prayerTimes.asr },
    { id: 'maghrib', time: prayerTimes.maghrib },
    { id: 'isha', time: prayerTimes.isha },
  ]

  // Find next prayer
  let nextPrayerEntry = rawEntries.find((item) => item.time.getTime() > now.getTime())
  let isTomorrowFajr = false

  if (!nextPrayerEntry) {
    // Next prayer is tomorrow's Fajr
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const tomorrowPrayers = new PrayerTimes(coords, tomorrow, params)
    nextPrayerEntry = { id: 'fajr', time: tomorrowPrayers.fajr }
    isTomorrowFajr = true
  }

  const remainingMs = Math.max(0, nextPrayerEntry.time.getTime() - now.getTime())
  const remainingSeconds = Math.floor(remainingMs / 1000)
  const hrs = Math.floor(remainingSeconds / 3600)
  const mins = Math.floor((remainingSeconds % 3600) / 60)
  const secs = remainingSeconds % 60
  const remainingFormatted = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

  let alertState: 'none' | 'pre15' | 'pre5' | 'now' = 'none'
  if (remainingSeconds <= 60) {
    alertState = 'now'
  } else if (remainingSeconds <= 5 * 60) {
    alertState = 'pre5'
  } else if (remainingSeconds <= 15 * 60) {
    alertState = 'pre15'
  }

  const prayers: PrayerScheduleItem[] = rawEntries.map((entry) => {
    const meta = PRAYER_META[entry.id]
    const isNext = !isTomorrowFajr && nextPrayerEntry?.id === entry.id
    const isPassed = entry.time.getTime() <= now.getTime()
    return {
      id: entry.id,
      nameAr: meta.nameAr,
      nameEn: meta.nameEn,
      time: entry.time,
      formatted24: formatTime24(entry.time, timeZone),
      formatted12Ar: formatTime12Ar(entry.time, timeZone),
      formatted12En: formatTime12En(entry.time, timeZone),
      isNext,
      isPassed,
      verseAr: meta.verseAr,
      verseRefAr: meta.verseRefAr,
      verseEn: meta.verseEn,
      recommendedWindowMinutes: meta.recommendedWindowMinutes,
    }
  })

  // Hijri date formatting with Latin numerals for clean cross-platform rendering
  let hijriDateAr = ''
  let hijriDateEn = ''
  let hijriMonthAr = ''
  let hijriDay = 1
  let hijriYear = 1448

  try {
    hijriDateAr = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone,
    }).format(now)
    hijriDateEn = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone,
    }).format(now)
    hijriMonthAr = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      month: 'long',
      timeZone,
    }).format(now)
    const parts = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
      day: 'numeric',
      year: 'numeric',
      timeZone,
    }).formatToParts(now)
    const dPart = parts.find((p) => p.type === 'day')
    const yPart = parts.find((p) => p.type === 'year')
    if (dPart) hijriDay = parseInt(dPart.value, 10) || 1
    if (yPart) hijriYear = parseInt(yPart.value, 10) || 1448
  } catch {
    hijriDateAr = '14 رمضان 1448 هـ'
    hijriDateEn = '14 Ramadan 1448 AH'
    hijriMonthAr = 'رمضان'
  }

  const gregorianAr = new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  }).format(now)

  const gregorianEn = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  }).format(now)

  const nextMeta = PRAYER_META[nextPrayerEntry.id]

  return {
    dateIso: now.toISOString().split('T')[0],
    hijriDateAr,
    hijriDateEn,
    hijriMonthAr,
    hijriDay,
    hijriYear,
    gregorianAr,
    gregorianEn,
    prayers,
    sunrise: {
      time: prayerTimes.sunrise,
      formatted12Ar: formatTime12Ar(prayerTimes.sunrise, timeZone),
      formatted12En: formatTime12En(prayerTimes.sunrise, timeZone),
    },
    imsak: {
      time: imsakTime,
      formatted12Ar: formatTime12Ar(imsakTime, timeZone),
      formatted12En: formatTime12En(imsakTime, timeZone),
    },
    iftar: {
      time: iftarTime,
      formatted12Ar: formatTime12Ar(iftarTime, timeZone),
      formatted12En: formatTime12En(iftarTime, timeZone),
    },
    lastThirdOfNight: {
      time: sunnahTimes.lastThirdOfTheNight,
      formatted12Ar: formatTime12Ar(sunnahTimes.lastThirdOfTheNight, timeZone),
      formatted12En: formatTime12En(sunnahTimes.lastThirdOfTheNight, timeZone),
    },
    nextPrayer: {
      id: nextPrayerEntry.id,
      nameAr: nextMeta.nameAr,
      nameEn: nextMeta.nameEn,
      time: nextPrayerEntry.time,
      formatted12Ar: formatTime12Ar(nextPrayerEntry.time, timeZone),
      formatted12En: formatTime12En(nextPrayerEntry.time, timeZone),
      remainingSeconds,
      remainingFormatted,
      alertState,
    },
    qiblaAngle,
    distanceToKaabaKm: calculateDistanceToKaabaKm(lat, lng),
  }
}

export interface MuezzinProfile {
  id: string
  nameAr: string
  nameEn: string
  mosqueAr: string
  mosqueEn: string
  maqamAr: string
  baseFreq: number
}

export const MUEZZIN_PROFILES: MuezzinProfile[] = [
  {
    id: 'makkah_haram',
    nameAr: 'الشيخ علي أحمد ملا',
    nameEn: 'Sheikh Ali Ahmed Mulla',
    mosqueAr: 'المسجد الحرام - مكة المكرمة',
    mosqueEn: 'Masjid Al-Haram, Makkah',
    maqamAr: 'مقام الحجاز الأصيل',
    baseFreq: 293.66, // D4 Hijaz
  },
  {
    id: 'madinah_haram',
    nameAr: 'الشيخ عصام بخاري',
    nameEn: 'Sheikh Essam Bukhari',
    mosqueAr: 'المسجد النبوي الشريف',
    mosqueEn: 'Al-Masjid An-Nabawi, Madinah',
    maqamAr: 'مقام البياتي المدني',
    baseFreq: 329.63, // E4 Bayati
  },
  {
    id: 'alafasy',
    nameAr: 'الشيخ مشاري راشد العفاسي',
    nameEn: 'Sheikh Mishary Rashid Alafasy',
    mosqueAr: 'المسجد الكبير - الكويت',
    mosqueEn: 'Grand Mosque, Kuwait',
    maqamAr: 'مقام النهاوند الخاشع',
    baseFreq: 261.63, // C4 Nahawand
  },
  {
    id: 'abdulbasit',
    nameAr: 'الشيخ عبد الباسط عبد الصمد',
    nameEn: 'Sheikh Abdulbasit Abdulsamad',
    mosqueAr: 'مسجد الإمام الشافعي - القاهرة',
    mosqueEn: 'Imam Shafi Mosque, Cairo',
    maqamAr: 'مقام الراست المصري',
    baseFreq: 349.23, // F4 Rast
  },
]

export interface FiqhTopic {
  id: string
  categoryAr: string
  categoryEn: string
  titleAr: string
  titleEn: string
  summaryAr: string
  summaryEn: string
  detailsAr: string[]
  evidenceAr: string
}

export const FIQH_TOPICS: FiqhTopic[] = [
  {
    id: 'shuroot',
    categoryAr: 'الشروط والأركان',
    categoryEn: 'Conditions & Pillars',
    titleAr: 'شروط صحة الصلاة التسعة',
    titleEn: 'The Nine Conditions of Valid Prayer',
    summaryAr: 'الشروط التي تسبق الصلاة ويجب تحققها لصحة الأداء والقبول.',
    summaryEn: 'Prerequisites that must be fulfilled before and during prayer.',
    detailsAr: [
      'الإسلام والعقل والتمييز',
      'رفع الحدث الأصغر بالوضوء والأكبر بالاغتسال',
      'إزالة النجاسة عن البدن والثوب والمكان',
      'ستر العورة ودخول الوقت الشرعي المحدد فلكياً',
      'استقبال القبلة والنية بالقلب دون التلفظ بها',
    ],
    evidenceAr: 'قال تعالى: {إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا} [النساء: 103]',
  },
  {
    id: 'arkan',
    categoryAr: 'الشروط والأركان',
    categoryEn: 'Conditions & Pillars',
    titleAr: 'أركان الصلاة الأربعة عشر',
    titleEn: 'The Fourteen Pillars of Prayer',
    summaryAr: 'الأجزاء الأساسية التي لا تسقط سهواً ولا جهلاً ولا عمداً.',
    summaryEn: 'Essential integrals of prayer that cannot be omitted intentionally or by forgetfulness.',
    detailsAr: [
      'القيام في الفرض مع القدرة وتكبيرة الإحرام',
      'قراءة الفاتحة في كل ركعة والركوع والاعتدال منه',
      'السجود على الأعضاء السبعة والجلوس بين السجدتين',
      'الطمأنينة في جميع الأركان والتشهد الأخير والجلوس له',
      'الصلاة على النبي ﷺ والتسليمتان والترتيب بين الأركان',
    ],
    evidenceAr: 'حديث المسيء صلاته: «إذا قمت إلى الصلاة فكبر، ثم اقرأ ما تيسر معك من القرآن...» متفق عليه',
  },
  {
    id: 'sujood_sahw',
    categoryAr: 'أحكام السهو',
    categoryEn: 'Forgetfulness Prostration',
    titleAr: 'أحكام سجود السهو وأسبابه الثلاثة',
    titleEn: 'Rulings of Sujood As-Sahw (Forgetfulness)',
    summaryAr: 'كيفية جبر الخلل الواقع في الصلاة بسبب الزيادة أو النقص أو الشك.',
    summaryEn: 'How to remedy unintended additions, omissions, or doubts during prayer.',
    detailsAr: [
      'إذا زاد المصلي فعلاً من جنس الصلاة سهواً سجد للسهو بعد السلام',
      'إذا ترك واجباً كالتشهد الأول ناسياً سجد للسهو قبل السلام',
      'إذا شك في عدد الركعات بنى على اليقين (الأقل) وسجد قبل السلام، وإن ترجح عنده غلبة ظن عمل بها وسجد بعد السلام',
    ],
    evidenceAr: 'قال النبي ﷺ: «إذا شك أحدكم في صلاته فليطرح الشك وليبن على ما استيقن» رواه مسلم',
  },
  {
    id: 'musafir',
    categoryAr: 'الرخص الشرعية',
    categoryEn: 'Travel & Concessions',
    titleAr: 'قصر الصلاة وجمعها للمسافر',
    titleEn: 'Shortening & Combining Prayers for Travelers',
    summaryAr: 'تيسير الشريعة الإسلامية في قصر الرباعية إلى ركعتين والجمع بين الصلاتين.',
    summaryEn: 'Islamic ease allowing 4-unit prayers to be shortened to 2 units during travel.',
    detailsAr: [
      'تقصر الصلاة الرباعية (الظهر، العصر، العشاء) إلى ركعتين عند مفارقة عمران البلد',
      'يجوز الجمع بين الظهر والعصر، وبين المغرب والعشاء جمع تقديم أو جمع تأخير حسب الأرفق بالمسافر',
      'الفجر والمغرب لا يدخلهما القصر ويبقيان على عدد ركعاتهما',
    ],
    evidenceAr: 'قال تعالى: {وَإِذَا ضَرَبْتُمْ فِي الْأَرْضِ فَلَيْسَ عَلَيْكُمْ جُنَاحٌ أَن تَقْصُرُوا مِنَ الصَّلَاةِ} [النساء: 101]',
  },
  {
    id: 'khushu',
    categoryAr: 'فقه القلوب',
    categoryEn: 'Spiritual Focus',
    titleAr: 'وسائل تحقيق الخشوع في الصلاة',
    titleEn: 'Keys to Deep Khushu & Presence in Prayer',
    summaryAr: 'خطوات عملية لاستحضار عظمة الله والتخلص من شرود الذهن أثناء الصلاة.',
    summaryEn: 'Practical spiritual steps to cultivate mindfulness and tranquility in Salah.',
    detailsAr: [
      'الاستعداد المبكر منذ سماع التنبيه قبل الأذان بـ 15 دقيقة وتفريغ القلب من الشواغل',
      'إسباغ الوضوء مع استحضار تساقط الذنوب مع قطرات الماء',
      'تدبر معاني الفاتحة وتنويع سور القراءة والأذكار الواردة في الركوع والسجود',
      'النظر إلى موضع السجود وتجنب الالتفات أو الانشغال بالهاتف قبل التكبير',
    ],
    evidenceAr: 'قال تعالى: {قَدْ أَفْلَحَ الْمُؤْمِنُونَ * الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ} [المؤمنون: 1-2]',
  },
]
