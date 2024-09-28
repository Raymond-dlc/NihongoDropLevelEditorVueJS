export enum Language {
    English = "english",
    Dutch = "dutch",
    Swedish = 'swedish', 
    Spanish = 'spanish', 
    Portuguese = 'portuguese', 
    French = 'french', 
    Hindi = 'hindi'
}

export function getLanguageCode(language: Language): string {
    switch (language) {
        case Language.English:
            return 'en';
        case Language.Dutch:
            return 'nl';
        case Language.Swedish:
            return 'sv';
        case Language.Spanish:
            return 'es';
        case Language.Portuguese:
            return 'pt';
        case Language.French:
            return 'fr';
        case Language.Hindi:
            return 'hi';
        default:
            return 'unknown';
    }
}