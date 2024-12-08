import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './locales/en/translation.json';
import arTranslation from './locales/ar/translation.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  ar: {
    translation: arTranslation,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("language"),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already has xss protection
    },
  });

export default i18n;
