import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const EstagioPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#e9f9f0',
            100: '#c8f1d9',
            200: '#a6e8c2',
            300: '#85e0ab',
            400: '#63d795',
            500: '#22C55E',
            600: '#1db054',
            700: '#189a4a',
            800: '#15803D',
            900: '#10622f',
            950: '#0b4220'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '#F9FAFB',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                    950: '#030712'
                }
            }
        }
    },
    components: {
        card: {
            colorScheme: {
                light: {
                    root: {
                        background: '{surface.0}',
                        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                    }
                }
            }
        },
        tag: {
            colorScheme: {
                light: {
                    success: {
                        background: '#dcfce7',
                        color: '#166534'
                    },
                    info: {
                        background: '#dbeafe',
                        color: '#1e40af'
                    },
                    warn: {
                        background: '#fef3c7',
                        color: '#92400e'
                    },
                    danger: {
                        background: '#fee2e2',
                        color: '#991b1b'
                    }
                }
            }
        },
        chip: {
            colorScheme: {
                light: {
                    root: {
                        background: '#f3f4f6',
                        color: '#374151'
                    }
                }
            }
        },
        avatar: {
            colorScheme: {
                light: {
                    root: {
                        background: '{primary.500}',
                        color: '#ffffff'
                    }
                }
            }
        }
    }
});
