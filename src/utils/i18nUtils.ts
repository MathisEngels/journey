export const languages = {
    fr: 'Français',
    en: 'English',
};

export const defaultLang = 'fr';

export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split('/');
    if (lang in languages) return lang as keyof typeof languages;
    return defaultLang;
}
