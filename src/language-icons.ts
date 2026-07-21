import * as simpleIcons from 'simple-icons';

export interface LanguageIconInfo {
    path: string;
    hex: string;
    title: string;
}

const CUSTOM_SLUG_MAP: Record<string, string> = {
    'c++': 'cplusplus',
    'c#': 'csharp',
    'jupyter notebook': 'jupyter',
    html: 'html5',
    css: 'css3',
    scss: 'sass',
    shell: 'gnubash',
    bash: 'gnubash',
    vue: 'vuedotjs',
    dockerfile: 'docker',
    vim: 'vim',
    'vim script': 'vim',
    tex: 'latex',
};

const iconCache: Record<string, LanguageIconInfo | null> = {};

export const getLanguageIcon = (langName: string): LanguageIconInfo | null => {
    if (!langName) {
        return null;
    }
    const lower = langName.trim().toLowerCase();
    if (lower in iconCache) {
        return iconCache[lower];
    }

    const targetSlug = CUSTOM_SLUG_MAP[lower] || lower;

    const match = Object.values(simpleIcons).find(
        (icon) =>
            icon &&
            typeof icon === 'object' &&
            'slug' in icon &&
            (icon.slug === targetSlug ||
                icon.title.toLowerCase() === lower ||
                icon.slug === lower),
    );

    if (match && 'path' in match && typeof match.path === 'string') {
        const info: LanguageIconInfo = {
            path: match.path,
            hex: typeof match.hex === 'string' ? match.hex : '',
            title: typeof match.title === 'string' ? match.title : langName,
        };
        iconCache[lower] = info;
        return info;
    }

    iconCache[lower] = null;
    return null;
};
