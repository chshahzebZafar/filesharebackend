export interface GeoLocationData {
  country_code: string;
  country_name: string;
}

const countryToLanguage: { [key: string]: string } = {
  'ES': 'es', // Spain
  'MX': 'es', // Mexico
  'FR': 'fr', // France
  'DE': 'de', // Germany
  'US': 'en', // United States
  'GB': 'en', // United Kingdom
  'IN': 'hi', // India
  'CN': 'zh', // China
};

export async function getUserCountryCode(): Promise<string | null> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    console.log('🚀 ~ getUserCountryCode ~ response:', response);
    if (!response.ok) return null;
    const data: GeoLocationData = await response.json();
    console.log('🚀 ~ getUserCountryCode ~ data:', data);
    return data.country_code || null;
  } catch (e) {
    return null;
  }
}

export function getLanguageFromCountry(countryCode: string): string | null {
  return countryToLanguage[countryCode.toUpperCase()] || null;
} 