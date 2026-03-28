import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const EstagioPreset = definePreset(Aura, {
    semantic: {
        transitionDuration: '0.2s',
        iconSize: '1rem',
        focusRing: {
            width: '2px',
            style: 'solid',
            color: '{primary.400}',
            offset: '1px',
            shadow: 'none'
        },
        formField: {
            borderRadius: '0.5rem',
            paddingX: '0.75rem',
            paddingY: '0.625rem',
            focusRing: {
                width: '2px',
                style: 'solid',
                color: '{primary.300}',
                offset: '0',
                shadow: 'none'
            }
        },
        content: {
            borderRadius: '0.75rem'
        },
        overlay: {
            select: {
                borderRadius: '0.75rem',
                shadow: '0 12px 28px -10px rgba(3, 7, 18, 0.18)'
            },
            popover: {
                borderRadius: '0.75rem',
                padding: '0.5rem',
                shadow: '0 12px 28px -10px rgba(3, 7, 18, 0.18)'
            },
            modal: {
                borderRadius: '0.9rem',
                padding: '1rem',
                shadow: '0 16px 40px -16px rgba(3, 7, 18, 0.3)'
            },
            navigation: {
                shadow: '0 12px 28px -10px rgba(3, 7, 18, 0.18)'
            }
        },
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
                },
                primary: {
                    color: '{primary.600}',
                    contrastColor: '#ffffff',
                    hoverColor: '{primary.700}',
                    activeColor: '{primary.800}'
                },
                highlight: {
                    background: '{primary.50}',
                    focusBackground: '{primary.100}',
                    color: '{primary.900}',
                    focusColor: '{primary.900}'
                },
                text: {
                    color: '{surface.800}',
                    hoverColor: '{surface.900}',
                    mutedColor: '{surface.600}',
                    hoverMutedColor: '{surface.700}'
                },
                content: {
                    background: '{surface.0}',
                    hoverBackground: '{surface.50}',
                    borderColor: '{surface.200}',
                    color: '{surface.800}',
                    hoverColor: '{surface.900}'
                },
                formField: {
                    background: '{surface.0}',
                    disabledBackground: '{surface.100}',
                    filledBackground: '{surface.50}',
                    filledHoverBackground: '{surface.100}',
                    filledFocusBackground: '{surface.0}',
                    borderColor: '{surface.300}',
                    hoverBorderColor: '{surface.400}',
                    focusBorderColor: '{primary.500}',
                    invalidBorderColor: '#ef4444',
                    color: '{surface.800}',
                    disabledColor: '{surface.500}',
                    placeholderColor: '{surface.500}',
                    invalidPlaceholderColor: '#ef4444',
                    floatLabelColor: '{surface.600}',
                    floatLabelFocusColor: '{primary.600}',
                    floatLabelActiveColor: '{surface.700}',
                    floatLabelInvalidColor: '#ef4444',
                    iconColor: '{surface.500}',
                    shadow: 'none'
                },
                overlay: {
                    select: {
                        background: '{surface.0}',
                        borderColor: '{surface.200}',
                        color: '{surface.800}'
                    },
                    popover: {
                        background: '{surface.0}',
                        borderColor: '{surface.200}',
                        color: '{surface.800}'
                    },
                    modal: {
                        background: '{surface.0}',
                        borderColor: '{surface.200}',
                        color: '{surface.800}'
                    }
                },
                list: {
                    option: {
                        focusBackground: '{surface.100}',
                        selectedBackground: '{primary.50}',
                        selectedFocusBackground: '{primary.100}',
                        color: '{surface.700}',
                        focusColor: '{surface.900}',
                        selectedColor: '{primary.900}',
                        selectedFocusColor: '{primary.900}',
                        icon: {
                            color: '{surface.500}',
                            focusColor: '{surface.700}'
                        }
                    },
                    optionGroup: {
                        background: '{surface.0}',
                        color: '{surface.600}'
                    }
                },
                navigation: {
                    item: {
                        focusBackground: '{surface.100}',
                        activeBackground: '{primary.50}',
                        color: '{surface.700}',
                        focusColor: '{surface.900}',
                        activeColor: '{primary.900}',
                        icon: {
                            color: '{surface.500}',
                            focusColor: '{surface.700}',
                            activeColor: '{primary.700}'
                        }
                    },
                    submenuLabel: {
                        background: 'transparent',
                        color: '{surface.600}'
                    },
                    submenuIcon: {
                        color: '{surface.500}',
                        focusColor: '{surface.700}',
                        activeColor: '{primary.700}'
                    }
                }
            }
        }
    },
    components: {
        button: {
            root: {
                borderRadius: '0.5rem',
                paddingX: '0.9rem',
                paddingY: '0.6rem',
                label: {
                    fontWeight: '600'
                },
                transitionDuration: '0.2s',
                focusRing: {
                    width: '2px',
                    style: 'solid',
                    offset: '1px'
                }
            },
            colorScheme: {
                light: {
                    root: {
                        primary: {
                            background: '{primary.600}',
                            hoverBackground: '{primary.700}',
                            activeBackground: '{primary.800}',
                            borderColor: '{primary.600}',
                            hoverBorderColor: '{primary.700}',
                            activeBorderColor: '{primary.800}',
                            color: '#ffffff',
                            hoverColor: '#ffffff',
                            activeColor: '#ffffff',
                            focusRing: {
                                color: '{primary.300}',
                                shadow: 'none'
                            }
                        },
                        secondary: {
                            background: '{surface.100}',
                            hoverBackground: '{surface.200}',
                            activeBackground: '{surface.300}',
                            borderColor: '{surface.300}',
                            hoverBorderColor: '{surface.400}',
                            activeBorderColor: '{surface.400}',
                            color: '{surface.800}',
                            hoverColor: '{surface.900}',
                            activeColor: '{surface.900}'
                        }
                    }
                }
            }
        },
        inputtext: {
            colorScheme: {
                light: {
                    root: {
                        background: '{surface.0}',
                        borderColor: '{surface.300}',
                        hoverBorderColor: '{surface.400}',
                        focusBorderColor: '{primary.500}',
                        color: '{surface.800}',
                        placeholderColor: '{surface.500}',
                        shadow: 'none',
                        focusRing: {
                            width: '2px',
                            style: 'solid',
                            color: '{primary.300}',
                            offset: '0',
                            shadow: 'none'
                        }
                    }
                }
            }
        },
        drawer: {
            colorScheme: {
                light: {
                    root: {
                        background: '{surface.0}',
                        borderColor: '{surface.200}',
                        color: '{surface.800}',
                        shadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                    }
                }
            }
        },
        menu: {
            colorScheme: {
                light: {
                    root: {
                        background: '{surface.0}',
                        borderColor: '{surface.200}',
                        color: '{surface.800}',
                        shadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
                    },
                    item: {
                        color: '{surface.700}',
                        focusColor: '{surface.900}',
                        focusBackground: '{surface.100}',
                        icon: {
                            color: '{surface.500}',
                            focusColor: '{surface.700}'
                        }
                    },
                    submenuLabel: {
                        color: '{surface.600}',
                        background: 'transparent'
                    },
                    separator: {
                        borderColor: '{surface.200}'
                    }
                }
            }
        },
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
