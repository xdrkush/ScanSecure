import { extendTheme } from '@chakra-ui/react'

const global = {
    // styles for the `body`
    body: {
        bg: 'primary.500',
        color: '#000',
    },
    // styles for the `a`
    a: {
        color: 'accent.500',
        _hover: {
            textDecoration: 'underline',
        },
    },
}

// Colors
const colors = {
    transparent: 'transparent',
    black: '#000',
    white: '#fff',
    gray: {
        50: '#f7fafc',
        900: '#171923',
    },
    brand: {
        100: "#f7fafc",
        // ...
        900: "#1a202c",
    },
    primary: {
        100: "#2933F4",
        300: "#252EDB",
        500: "#2028BD",
        700: "#141975",
        900: "#090B36",
    },
    secondary: {
        100: "#87CCF5",
        300: "#79B7DB",
        500: "#679DBC",
        700: "#416275",
        900: "#1D2D36",
    },
    accent: {
        100: "#AB6FF5",
        300: "#9963DB",
        500: "#7E51B5",
        700: "#523575",
        900: "#251836",
    },
}

// Typography
const typography = {
    fonts: {
        body: "system-ui, sans-serif",
        heading: "Georgia, serif",
        mono: "Menlo, monospace",
    },
    fontSizes: {
        xs: "0.75rem",
        sm: "0.875rem",
        md: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
        "7xl": "4.5rem",
        "8xl": "6rem",
        "9xl": "8rem",
    },
    fontWeights: {
        hairline: 100,
        thin: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
    },
    lineHeights: {
        normal: "normal",
        none: 1,
        shorter: 1.25,
        short: 1.375,
        base: 1.5,
        tall: 1.625,
        taller: "2",
        "3": ".75rem",
        "4": "1rem",
        "5": "1.25rem",
        "6": "1.5rem",
        "7": "1.75rem",
        "8": "2rem",
        "9": "2.25rem",
        "10": "2.5rem",
    },
    letterSpacings: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
    },
};

// Breakpoint
const breakpoints = {
    sm: '30em',
    md: '48em',
    lg: '62em',
    xl: '80em',
    '2xl': '96em',
}

const components = {
    Button: {
        // 1. We can update the base styles
        baseStyle: {
            fontWeight: 'bold', // Normally, it is "semibold"
        },
        // 2. We can add a new button size or extend existing
        sizes: {
            xl: {
                h: '56px',
                fontSize: 'lg',
                px: '32px',
            },
        },
        // 3. We can add a new visual variant
        variants: {
            // 'with-shadow': {
            //     bg: 'red.400',
            //     boxShadow: '0 0 2px 2px #efdfde',
            // },
            // // 4. We can override existing variants
            // solid: (props) => ({
            //     bg: props.colorMode === 'dark' ? 'red.300' : 'red.500',
            // }),
            // // 5. We can add responsive variants
            // sm: {
            //     bg: 'teal.500',
            //     fontSize: 'md',
            // },
        },
        // 6. We can overwrite defaultProps
        defaultProps: {
            size: 'lg', // default is md
            variant: 'sm', // default is solid
            colorScheme: 'green', // default is gray
        },
    },
    Menu: {
        variants: {
            droped: {
                list: {
                    "--menu-bg": "colors.primary.500",
                    "--menu-shadow": "shadows.sm",
                    bg: "var(--menu-bg)",
                    borderRadius: "md",
                    borderWidth: "1px",
                    boxShadow: "var(--menu-shadow)",
                    color: "inherit",
                    minW: "3xs",
                    py: "2",
                    zIndex: 1,
                    _dark: {
                        "--menu-bg": "colors.primary.900",
                        "--menu-shadow": "shadows.dark-lg",
                    },
                },
                item: {
                    bg: "var(--menu-bg)",
                    px: "3",
                    py: "1.5",
                    transitionDuration: "ultra-fast",
                    transitionProperty: "background",
                    transitionTimingFunction: "ease-in",
                    _hover: {
                        "--menu-bg": "colors.accent.500",
                        "--menu-shadow": "shadows.dark-lg",
                    },
                    _dark: {
                        _hover: {
                            "--menu-bg": "colors.accent.500",
                            "--menu-shadow": "shadows.dark-lg",
                        },
                    },
                }
            }
        }
    },
    Container: {
        baseStyle: {
            maxW: "prose",
            mx: "auto",
            px: "4",
            w: "100%"
        },
        variants: {
            styled1: {
                boxShadow: '0 0 20px 20px accent.300',
                p: 5,
                border: '#000',
                borderRadius: '5',
            },
        },

    },
}

const config = {
    initialColorMode: "light",
    useSystemColorMode: true,
}

const theme = extendTheme({ config, global, colors, typography, breakpoints, components })
export default theme
