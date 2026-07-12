/**
 * Țări pentru joc — nume și capitale în română.
 * base = nivel ușor/mediu (50 țări)
 * hard = se adaugă la nivel greu
 */

export const CONTINENTS = {
  europe: { id: 'europe', name: 'Europa', emoji: '🏰', color: '#5B8DEF' },
  asia: { id: 'asia', name: 'Asia', emoji: '🏯', color: '#FF8A5B' },
  africa: { id: 'africa', name: 'Africa', emoji: '🦁', color: '#F4C430' },
  americas: { id: 'americas', name: 'America', emoji: '🌎', color: '#4ECDC4' },
  oceania: { id: 'oceania', name: 'Oceania', emoji: '🏝️', color: '#A78BFA' },
}

/** Convertește cod ISO (ex: "ro") în emoji steag */
export function codeToFlag(code) {
  if (!code || code.length !== 2) return '🏳️'
  const c = code.toUpperCase()
  return String.fromCodePoint(
    ...[...c].map((ch) => 0x1f1e6 - 65 + ch.charCodeAt(0)),
  )
}

const base = [
  { id: 'ro', code: 'ro', name: 'România', capital: 'București', continent: 'europe' },
  { id: 'md', code: 'md', name: 'Republica Moldova', capital: 'Chișinău', continent: 'europe' },
  { id: 'ua', code: 'ua', name: 'Ucraina', capital: 'Kiev', continent: 'europe' },
  { id: 'bg', code: 'bg', name: 'Bulgaria', capital: 'Sofia', continent: 'europe' },
  { id: 'hu', code: 'hu', name: 'Ungaria', capital: 'Budapesta', continent: 'europe' },
  { id: 'rs', code: 'rs', name: 'Serbia', capital: 'Belgrad', continent: 'europe' },
  { id: 'de', code: 'de', name: 'Germania', capital: 'Berlin', continent: 'europe' },
  { id: 'fr', code: 'fr', name: 'Franța', capital: 'Paris', continent: 'europe' },
  { id: 'it', code: 'it', name: 'Italia', capital: 'Roma', continent: 'europe' },
  { id: 'es', code: 'es', name: 'Spania', capital: 'Madrid', continent: 'europe' },
  { id: 'pt', code: 'pt', name: 'Portugalia', capital: 'Lisabona', continent: 'europe' },
  { id: 'gb', code: 'gb', name: 'Regatul Unit', capital: 'Londra', continent: 'europe' },
  { id: 'ie', code: 'ie', name: 'Irlanda', capital: 'Dublin', continent: 'europe' },
  { id: 'nl', code: 'nl', name: 'Olanda', capital: 'Amsterdam', continent: 'europe' },
  { id: 'be', code: 'be', name: 'Belgia', capital: 'Bruxelles', continent: 'europe' },
  { id: 'ch', code: 'ch', name: 'Elveția', capital: 'Berna', continent: 'europe' },
  { id: 'at', code: 'at', name: 'Austria', capital: 'Viena', continent: 'europe' },
  { id: 'pl', code: 'pl', name: 'Polonia', capital: 'Varșovia', continent: 'europe' },
  { id: 'cz', code: 'cz', name: 'Cehia', capital: 'Praga', continent: 'europe' },
  { id: 'gr', code: 'gr', name: 'Grecia', capital: 'Atena', continent: 'europe' },
  { id: 'se', code: 'se', name: 'Suedia', capital: 'Stockholm', continent: 'europe' },
  { id: 'no', code: 'no', name: 'Norvegia', capital: 'Oslo', continent: 'europe' },
  { id: 'fi', code: 'fi', name: 'Finlanda', capital: 'Helsinki', continent: 'europe' },
  { id: 'dk', code: 'dk', name: 'Danemarca', capital: 'Copenhaga', continent: 'europe' },
  { id: 'tr', code: 'tr', name: 'Turcia', capital: 'Ankara', continent: 'asia' },
  { id: 'ru', code: 'ru', name: 'Rusia', capital: 'Moscova', continent: 'europe' },
  { id: 'us', code: 'us', name: 'Statele Unite', capital: 'Washington', continent: 'americas' },
  { id: 'ca', code: 'ca', name: 'Canada', capital: 'Ottawa', continent: 'americas' },
  { id: 'mx', code: 'mx', name: 'Mexic', capital: 'Mexico', continent: 'americas' },
  { id: 'br', code: 'br', name: 'Brazilia', capital: 'Brasilia', continent: 'americas' },
  { id: 'ar', code: 'ar', name: 'Argentina', capital: 'Buenos Aires', continent: 'americas' },
  { id: 'cl', code: 'cl', name: 'Chile', capital: 'Santiago', continent: 'americas' },
  { id: 'co', code: 'co', name: 'Columbia', capital: 'Bogota', continent: 'americas' },
  { id: 'pe', code: 'pe', name: 'Peru', capital: 'Lima', continent: 'americas' },
  { id: 'cn', code: 'cn', name: 'China', capital: 'Pekin', continent: 'asia' },
  { id: 'jp', code: 'jp', name: 'Japonia', capital: 'Tokio', continent: 'asia' },
  { id: 'kr', code: 'kr', name: 'Coreea de Sud', capital: 'Seul', continent: 'asia' },
  { id: 'in', code: 'in', name: 'India', capital: 'New Delhi', continent: 'asia' },
  { id: 'th', code: 'th', name: 'Thailanda', capital: 'Bangkok', continent: 'asia' },
  { id: 'vn', code: 'vn', name: 'Vietnam', capital: 'Hanoi', continent: 'asia' },
  { id: 'id', code: 'id', name: 'Indonezia', capital: 'Jakarta', continent: 'asia' },
  { id: 'au', code: 'au', name: 'Australia', capital: 'Canberra', continent: 'oceania' },
  { id: 'nz', code: 'nz', name: 'Noua Zeelandă', capital: 'Wellington', continent: 'oceania' },
  { id: 'eg', code: 'eg', name: 'Egipt', capital: 'Cairo', continent: 'africa' },
  { id: 'za', code: 'za', name: 'Africa de Sud', capital: 'Pretoria', continent: 'africa' },
  { id: 'ng', code: 'ng', name: 'Nigeria', capital: 'Abuja', continent: 'africa' },
  { id: 'ke', code: 'ke', name: 'Kenya', capital: 'Nairobi', continent: 'africa' },
  { id: 'ma', code: 'ma', name: 'Maroc', capital: 'Rabat', continent: 'africa' },
  { id: 'sa', code: 'sa', name: 'Arabia Saudită', capital: 'Riad', continent: 'asia' },
  { id: 'ae', code: 'ae', name: 'Emiratele Arabe Unite', capital: 'Abu Dhabi', continent: 'asia' },
]

/** Țări extra pentru nivel greu (~+50) */
const hardExtra = [
  { id: 'hr', code: 'hr', name: 'Croația', capital: 'Zagreb', continent: 'europe' },
  { id: 'si', code: 'si', name: 'Slovenia', capital: 'Ljubljana', continent: 'europe' },
  { id: 'sk', code: 'sk', name: 'Slovacia', capital: 'Bratislava', continent: 'europe' },
  { id: 'lt', code: 'lt', name: 'Lituania', capital: 'Vilnius', continent: 'europe' },
  { id: 'lv', code: 'lv', name: 'Letonia', capital: 'Riga', continent: 'europe' },
  { id: 'ee', code: 'ee', name: 'Estonia', capital: 'Tallinn', continent: 'europe' },
  { id: 'is', code: 'is', name: 'Islanda', capital: 'Reykjavík', continent: 'europe' },
  { id: 'al', code: 'al', name: 'Albania', capital: 'Tirana', continent: 'europe' },
  { id: 'mk', code: 'mk', name: 'Macedonia de Nord', capital: 'Skopje', continent: 'europe' },
  { id: 'ba', code: 'ba', name: 'Bosnia și Herțegovina', capital: 'Sarajevo', continent: 'europe' },
  { id: 'me', code: 'me', name: 'Muntenegru', capital: 'Podgorica', continent: 'europe' },
  { id: 'by', code: 'by', name: 'Belarus', capital: 'Minsk', continent: 'europe' },
  { id: 'ge', code: 'ge', name: 'Georgia', capital: 'Tbilisi', continent: 'asia' },
  { id: 'am', code: 'am', name: 'Armenia', capital: 'Erevan', continent: 'asia' },
  { id: 'az', code: 'az', name: 'Azerbaidjan', capital: 'Baku', continent: 'asia' },
  { id: 'il', code: 'il', name: 'Israel', capital: 'Ierusalim', continent: 'asia' },
  { id: 'ir', code: 'ir', name: 'Iran', capital: 'Teheran', continent: 'asia' },
  { id: 'iq', code: 'iq', name: 'Irak', capital: 'Bagdad', continent: 'asia' },
  { id: 'pk', code: 'pk', name: 'Pakistan', capital: 'Islamabad', continent: 'asia' },
  { id: 'bd', code: 'bd', name: 'Bangladesh', capital: 'Dacca', continent: 'asia' },
  { id: 'ph', code: 'ph', name: 'Filipine', capital: 'Manila', continent: 'asia' },
  { id: 'my', code: 'my', name: 'Malaezia', capital: 'Kuala Lumpur', continent: 'asia' },
  { id: 'sg', code: 'sg', name: 'Singapore', capital: 'Singapore', continent: 'asia' },
  { id: 'kz', code: 'kz', name: 'Kazahstan', capital: 'Astana', continent: 'asia' },
  { id: 'uz', code: 'uz', name: 'Uzbekistan', capital: 'Tașkent', continent: 'asia' },
  { id: 'mn', code: 'mn', name: 'Mongolia', capital: 'Ulan Bator', continent: 'asia' },
  { id: 'np', code: 'np', name: 'Nepal', capital: 'Katmandu', continent: 'asia' },
  { id: 'lk', code: 'lk', name: 'Sri Lanka', capital: 'Colombo', continent: 'asia' },
  { id: 'et', code: 'et', name: 'Etiopia', capital: 'Addis Abeba', continent: 'africa' },
  { id: 'gh', code: 'gh', name: 'Ghana', capital: 'Accra', continent: 'africa' },
  { id: 'tz', code: 'tz', name: 'Tanzania', capital: 'Dodoma', continent: 'africa' },
  { id: 'ug', code: 'ug', name: 'Uganda', capital: 'Kampala', continent: 'africa' },
  { id: 'sn', code: 'sn', name: 'Senegal', capital: 'Dakar', continent: 'africa' },
  { id: 'ci', code: 'ci', name: 'Coasta de Fildeș', capital: 'Yamoussoukro', continent: 'africa' },
  { id: 'cm', code: 'cm', name: 'Camerun', capital: 'Yaounde', continent: 'africa' },
  { id: 'tn', code: 'tn', name: 'Tunisia', capital: 'Tunis', continent: 'africa' },
  { id: 'dz', code: 'dz', name: 'Algeria', capital: 'Alger', continent: 'africa' },
  { id: 'ly', code: 'ly', name: 'Libia', capital: 'Tripoli', continent: 'africa' },
  { id: 'sd', code: 'sd', name: 'Sudan', capital: 'Khartoum', continent: 'africa' },
  { id: 'ao', code: 'ao', name: 'Angola', capital: 'Luanda', continent: 'africa' },
  { id: 'mz', code: 'mz', name: 'Mozambic', capital: 'Maputo', continent: 'africa' },
  { id: 'zw', code: 'zw', name: 'Zimbabwe', capital: 'Harare', continent: 'africa' },
  { id: 'cu', code: 'cu', name: 'Cuba', capital: 'Havana', continent: 'americas' },
  { id: 've', code: 've', name: 'Venezuela', capital: 'Caracas', continent: 'americas' },
  { id: 'ec', code: 'ec', name: 'Ecuador', capital: 'Quito', continent: 'americas' },
  { id: 'bo', code: 'bo', name: 'Bolivia', capital: 'Sucre', continent: 'americas' },
  { id: 'uy', code: 'uy', name: 'Uruguay', capital: 'Montevideo', continent: 'americas' },
  { id: 'py', code: 'py', name: 'Paraguay', capital: 'Asuncion', continent: 'americas' },
  { id: 'cr', code: 'cr', name: 'Costa Rica', capital: 'San Jose', continent: 'americas' },
  { id: 'pa', code: 'pa', name: 'Panama', capital: 'Panama', continent: 'americas' },
  { id: 'fj', code: 'fj', name: 'Fiji', capital: 'Suva', continent: 'oceania' },
  { id: 'pg', code: 'pg', name: 'Papua-Noua Guinee', capital: 'Port Moresby', continent: 'oceania' },
]

export const BASE_COUNTRIES = base.map((c) => ({ ...c, difficulty: 'base' }))
export const HARD_COUNTRIES = hardExtra.map((c) => ({ ...c, difficulty: 'hard' }))
export const ALL_COUNTRIES = [...BASE_COUNTRIES, ...HARD_COUNTRIES]

export function getCountriesForDifficulty(difficulty) {
  if (difficulty === 'hard') return ALL_COUNTRIES
  return BASE_COUNTRIES
}

export function getCountriesByContinent(continentId, difficulty = 'easy') {
  return getCountriesForDifficulty(difficulty).filter((c) => c.continent === continentId)
}

export function getCountryById(id) {
  return ALL_COUNTRIES.find((c) => c.id === id)
}
