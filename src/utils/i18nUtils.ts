export const languages = {
    fr: 'Français',
    en: 'English',
};

export const defaultLang = 'fr';

export function getLocale(preferredLocale: string | undefined) {
    return preferredLocale || defaultLang;
}
