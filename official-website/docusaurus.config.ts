import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import path from 'path';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'EZ Tattoo',
  tagline: 'Global Tattoo Artist Platform',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://www.eztattoosupply.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'rigdoge', // Usually your GitHub org/user name.
  projectName: 'tattoo', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-Hans'],
    localeConfigs: {
      en: {
        htmlLang: 'en',
        label: 'English',
      },
      'zh-Hans': {
        htmlLang: 'zh-Hans',
        label: '简体中文',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/rigdoge/tattoo/tree/main/official-website/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/rigdoge/tattoo/tree/main/official-website/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/social-card.jpg',
    navbar: {
      title: 'EZ Tattoo',
      logo: {
        alt: 'EZ Tattoo Logo',
        src: 'img/logo.svg',
      },
      items: [
        // 左侧导航
        {
          to: '/artists-globe',
          label: 'Artists Globe',
          position: 'left',
        },
        {
          to: '/distributors-globe',
          label: 'Distributors Map',
          position: 'left',
        },
        {
          to: '/artists-community',
          label: 'Artists Community',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {to: '/about', label: 'About Us', position: 'left'},
        // 右侧导航
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/rigdoge/tattoo',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Products',
          items: [
            {
              label: 'Artists Globe',
              to: '/artists-globe',
            },
            {
              label: 'Distributors Map',
              to: '/distributors-globe',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Artists Community',
              to: '/artists-community',
            },
            {
              label: 'Documentation',
              to: '/docs/intro',
            },
            {
              label: 'Blog',
              to: '/blog',
            },
          ],
        },
        {
          title: 'Connect',
          items: [
            {
              label: 'Facebook',
              href: 'https://facebook.com/eztattoosupply',
            },
            {
              label: 'Instagram',
              href: 'https://instagram.com/eztattoosupply',
            },
            {
              label: 'X (Twitter)',
              href: 'https://x.com/eztattoosupply',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} EZ Tattoo. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  plugins: [
    function tailwindPlugin() {
      return {
        name: 'docusaurus-globe-plugin',
        configureWebpack() {
          return {
            resolve: {
              alias: {
                '@globe-artists': path.resolve(__dirname, '../globe-artists/src'),
              },
            },
          };
        },
      };
    },
  ],
};

export default config;
