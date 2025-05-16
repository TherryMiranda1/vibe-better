import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
      fontFamily: { // Add Montserrat font family
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
      typography: (theme: (path: string) => string) => ({
        DEFAULT: { // Corresponds to `prose`
          css: {
            '--tw-prose-body': theme('colors.foreground'),
            '--tw-prose-headings': theme('colors.foreground'),
            '--tw-prose-lead': theme('colors.foreground'),
            '--tw-prose-links': theme('colors.primary.DEFAULT'),
            '--tw-prose-bold': theme('colors.foreground'),
            '--tw-prose-counters': theme('colors.muted.foreground'),
            '--tw-prose-bullets': theme('colors.muted.foreground'),
            '--tw-prose-hr': theme('colors.border'),
            '--tw-prose-quotes': theme('colors.foreground'),
            '--tw-prose-quote-borders': theme('colors.accent.DEFAULT'),
            '--tw-prose-captions': theme('colors.muted.foreground'),
            '--tw-prose-code': theme('colors.accent.DEFAULT'), // Inline code text color
            '--tw-prose-pre-code': theme('colors.card.foreground'), // Code block text color
            '--tw-prose-pre-bg': theme('colors.card.DEFAULT'), // Code block background
            '--tw-prose-th-borders': theme('colors.border'),
            '--tw-prose-td-borders': theme('colors.border'),
            // Invert for dark mode
            '--tw-prose-invert-body': theme('colors.foreground'),
            '--tw-prose-invert-headings': theme('colors.foreground'),
            '--tw-prose-invert-lead': theme('colors.foreground'),
            '--tw-prose-invert-links': theme('colors.primary.DEFAULT'),
            '--tw-prose-invert-bold': theme('colors.foreground'),
            '--tw-prose-invert-counters': theme('colors.muted.foreground'),
            '--tw-prose-invert-bullets': theme('colors.muted.foreground'),
            '--tw-prose-invert-hr': theme('colors.border'),
            '--tw-prose-invert-quotes': theme('colors.foreground'),
            '--tw-prose-invert-quote-borders': theme('colors.accent.DEFAULT'),
            '--tw-prose-invert-captions': theme('colors.muted.foreground'),
            '--tw-prose-invert-code': theme('colors.accent.DEFAULT'), // Inline code text color for dark
            '--tw-prose-invert-pre-code': theme('colors.card.foreground'), // Code block text color for dark
            '--tw-prose-invert-pre-bg': theme('colors.card.DEFAULT'), // Code block background for dark
            '--tw-prose-invert-th-borders': theme('colors.border'),
            '--tw-prose-invert-td-borders': theme('colors.border'),

            // Customizations beyond default prose variables
            h1: {
              fontWeight: '700',
              marginTop: '1.5em',
              marginBottom: '0.75em',
            },
            h2: {
              fontWeight: '600',
              marginTop: '1.25em',
              marginBottom: '0.6em',
            },
            h3: {
              fontWeight: '600',
              marginTop: '1.1em',
              marginBottom: '0.5em',
            },
            p: {
              marginTop: '0.8em',
              marginBottom: '0.8em',
              lineHeight: '1.6',
            },
            a: {
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            code: { // Inline code
              backgroundColor: 'hsl(var(--muted) / 0.7)',
              padding: '0.2em 0.4em',
              margin: '0 0.1em',
              fontSize: '0.875em', // Slightly smaller than text
              borderRadius: 'var(--radius-sm)',
              border: '1px solid hsl(var(--border) / 0.5)',
              fontFamily: 'monospace, sans-serif', // Ensure monospace for inline code
            },
            'code::before': { content: '""' }, // Remove quotes around inline code
            'code::after': { content: '""' },
            pre: { // Code blocks
              padding: '1em',
              borderRadius: 'var(--radius-md)',
              border: '1px solid hsl(var(--border))',
              lineHeight: '1.5',
            },
            'pre code': { // Code within pre, reset some inline styles
              backgroundColor: 'transparent',
              padding: '0',
              margin: '0',
              fontSize: '0.875em', // Consistent font size in code blocks
              borderRadius: '0',
              border: 'none',
              fontFamily: 'monospace, sans-serif', // Ensure monospace for code blocks
            },
            ul: {
              marginTop: '0.8em',
              marginBottom: '0.8em',
              paddingLeft: '1.5em',
            },
            ol: {
              marginTop: '0.8em',
              marginBottom: '0.8em',
              paddingLeft: '1.5em',
            },
            li: {
              marginTop: '0.3em',
              marginBottom: '0.3em',
            },
            'ul > li::marker': {
              color: 'hsl(var(--muted-foreground))',
            },
            'ol > li::marker': {
              color: 'hsl(var(--muted-foreground))',
            },
            blockquote: {
              marginTop: '1em',
              marginBottom: '1em',
              paddingLeft: '1em',
              borderLeftWidth: '0.25rem',
              fontStyle: 'italic',
            },
            hr: {
              marginTop: '2em',
              marginBottom: '2em',
            },
            table: {
              marginTop: '1em',
              marginBottom: '1em',
              width: '100%',
              fontSize: '0.875em',
            },
            thead: {
              borderBottomWidth: '1px',
              borderBottomColor: 'var(--tw-prose-th-borders)',
            },
            'thead th': {
              padding: '0.5em 0.75em',
              fontWeight: '600',
              textAlign: 'left',
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: 'var(--tw-prose-td-borders)',
            },
            'tbody tr:last-child': {
              borderBottomWidth: '0',
            },
            'tbody td': {
              padding: '0.5em 0.75em',
              verticalAlign: 'top',
            },
          },
        },
        sm: { // For prose-sm
           css: {
            h1: { fontSize: theme('fontSize.xl') },
            h2: { fontSize: theme('fontSize.lg') },
            h3: { fontSize: theme('fontSize.base') }, // Adjusted for sm
            p: {
              marginTop: '0.6em',
              marginBottom: '0.6em',
            },
            ul: {
              marginTop: '0.6em',
              marginBottom: '0.6em',
              paddingLeft: '1.25em',
            },
            ol: {
              marginTop: '0.6em',
              marginBottom: '0.6em',
              paddingLeft: '1.25em',
            },
            li: {
              marginTop: '0.2em',
              marginBottom: '0.2em',
            },
            code: {
              fontSize: '0.85em', // Slightly adjust for prose-sm if needed
            },
            'pre code': {
              fontSize: '0.85em',
            },
            blockquote: {
              paddingLeft: '0.8em',
            },
            table: {
              fontSize: '0.85em',
            },
             'thead th': {
              padding: '0.4em 0.6em',
            },
            'tbody td': {
              padding: '0.4em 0.6em',
            },
          }
        },
        // No need to redefine invert fully if DEFAULT handles --tw-prose-invert-* variables.
        // The plugin will automatically use those for dark:prose-invert.
      }),
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
