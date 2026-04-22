import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'SISEPUEDE Course',
  tagline: 'Decarbonization modeling under deep uncertainty',
  favicon: 'img/favicon.ico',
  url: 'https://sisepuede-framework.github.io',
  baseUrl: '/sisepuede/',
  organizationName: 'sisepuede-framework',
  projectName: 'sisepuede',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    localeConfigs: {
      en: {label: 'English'},
      es: {label: 'Español'},
    },
  },
  markdown: {mermaid: true},
  themes: ['@docusaurus/theme-mermaid'],
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/sisepuede-framework/sisepuede/tree/main/course/',
          routeBasePath: '/',
        },
        blog: false,
        theme: {customCss: './src/css/custom.css'},
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    image: 'img/social-card.png',
    navbar: {
      title: 'SISEPUEDE Course',
      logo: {alt: 'SISEPUEDE', src: 'img/sisepuede-logo.svg'},
      items: [
        {type: 'docSidebar', sidebarId: 'courseSidebar', position: 'left', label: 'Course'},
        {href: 'https://sisepuede.readthedocs.io/', label: 'Reference Docs', position: 'right'},
        {href: 'https://github.com/jcsyme/sisepuede', label: 'GitHub', position: 'right'},
        {type: 'localeDropdown', position: 'right'},
      ],
    },
    colorMode: {defaultMode: 'light', respectPrefersColorScheme: true},
    prism: {additionalLanguages: ['python', 'julia', 'bash']},
  } satisfies Preset.ThemeConfig,
};

config.plugins = [
  [
    require.resolve('@easyops-cn/docusaurus-search-local'),
    {hashed: true, language: ['en', 'es'], indexBlog: false},
  ],
];

config.plugins.push(function tailwindPlugin() {
  return {
    name: 'docusaurus-tailwind',
    configurePostCss(postcssOptions) {
      postcssOptions.plugins.push(require('tailwindcss'));
      postcssOptions.plugins.push(require('autoprefixer'));
      return postcssOptions;
    },
  };
});

export default config;
