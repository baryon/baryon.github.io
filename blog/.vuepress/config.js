
const nav = require("./navi")

module.exports = {
  title: "重粒子空间",
  description: "Young, Simple, Naive, Stupid",
  head: [
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Fira+Code&display=swap",
      },
    ], //https://font.googleapis.com/css?family=Rubik&display=swap
    [
      "link",
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;400;500;700&display=swap",
      },
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;700&display=swap",
      },
    ],
    [
      "link",
      {
        rel: "shortcut icon",
        href: "/favicon.png",
      },
    ],
    [
      "meta",
      {
        name: "keywords",
        content: "李龙,李龍,baryon,bitcoin,比特币,BSV",
      },
    ],
    [
      "meta",
      {
        name: "author",
        content: "LI Long",
      },
    ],
    // [ 'link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/markdown-it-texmath/css/texmath.min.css', crossorigin: 'anonymous' } ],

    [ 'link', { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", crossorigin: "anonymous" } ],

    [
      "script",
      {
        "data-ad-client": "ca-pub-2028497727822047",
        async: true,
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      }
    ]
  ],
  theme: "@vuepress/theme-blog",
  themeConfig: {
    dateFormat: 'YYYY-MM-DD h:mm A',
    nav,
    components: {
      afterPage: 'MyAfterPage'
    },
    footer: {
      contact: [
        {
          type: "github",
          link: "https://github.com/baryon",
        },
        {
          type: "mail",
          link: "mailto:lilong@gmail.com",
        },
        {
          type: "twitter",
          link: "https://twitter.com/lilong",
        },
      ],
      copyright: [
        {
          text: "LI Long © 2020",
          link: "",
        },
        {
          text: "Made with ❤",
          link: "",
        },
        {
          text: "CC BY-NC-SA 2.5",
          link: "https://creativecommons.org/licenses/by-nc-sa/2.5/cn/",
        },
      ],
    },
    /**
     * Ref: https://vuepress-theme-blog.ulivz.com/config/#sitemap
     */
    sitemap: {
      hostname: 'https://lilong.net/'
    },
    /**
     * Ref: https://vuepress-theme-blog.ulivz.com/config/#comment
     */
    comment: {
      service: 'vssue',
      platform: "github",
      owner: "baryon",
      repo: "baryon.github.io",
      clientId: "Iv1.f57a4abe2786be54",
      clientSecret: "62a146a09afb51188c829a8ec4adf6659c64f9ac",
    },
    /**
     * Ref: https://vuepress-theme-blog.ulivz.com/config/#newsletter
     */
    // newsletter: {
    //   endpoint: 'https://billyyyyy3320.us4.list-manage.com/subscribe/post?u=4905113ee00d8210c2004e038&amp;id=bd18d40138'
    // },
    /**
     * Ref: https://vuepress-theme-blog.ulivz.com/config/#feed
     */
    feed: {
      canonical_base: 'https://lilong.net/',
    },
    /**
     * Ref: https://vuepress-theme-blog.ulivz.com/config/#smoothscroll
     */
    smoothScroll: true
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    [
      '@vuepress/last-updated',
      {
        transformer: (timestamp, lang) => {
          // Don't forget to install moment yourself
          return (new Date(timestamp)).toISOString()
        }
      }
    ],
    ['one-click-copy', {
        copySelector: ['div[class*="language-"] pre', 'div[class*="aside-code"] aside'],
        copyMessage: '拷贝完成', // default is 'Copy successfully and then paste it for use.'
        duration: 500, // prompt message display time.
        showInMobile: false // whether to display on the mobile side, default: false.
    }],
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    'vuepress-plugin-table-of-contents',
    'vuepress-plugin-mermaidjs',
    ["md-enhance", 
    {
      // 启用下角标功能
      sub: true,
      // 启用上角标
      sup: true,
      // 启用自定义对齐
      align: true,
      // 启用脚注
      footnote: true,
      // 开启标记
      mark: true,
      // 启用流程图
      flowchart: true,
      // 启用 TeX 支持
      tex: true
    }],
    "vuepress-plugin-smooth-scroll",
    // "vuepress-plugin-baidu-autopush",
    ["@vuepress/google-analytics",{
      ga: "G-K22SWWLJF8",
    }],
    ['seo', {
      siteTitle: ( _, $site ) => $site.title,
      title: ( $page ) => $page.title,
      description: ( $page ) => $page.frontmatter.description,
      author: ( _, $site ) => $site.themeConfig.author,
      tags: ( $page ) => $page.frontmatter.tags,
      // twitterCard: _ => 'summary_large_image',
      type: ( $page ) =>
        [ "articles", "posts", "blog" ].some( ( folder ) =>
          $page.regularPath.startsWith( "/" + folder )
        )
          ? "article"
          : "website",
      url: ( _, $site, path ) => ( $site.themeConfig.domain || "" ) + path,
      image: ( $page, $site ) =>
        $page.frontmatter.image &&
        ( $site.themeConfig.domain || "" ) + $page.frontmatter.image,
      publishedAt: ( $page ) =>
        $page.frontmatter.date && new Date( $page.frontmatter.date ),
      modifiedAt: ( $page ) => $page.lastUpdated && new Date( $page.lastUpdated ),
    }],
    ['container', {
      type: "theorem",
      before: ( info ) => `<div class="theorem"><p class="title">${info}</p>`,
      after: "</div>",
    }],
    ['container', {
      type: "right",
      defaultTitle: "",
    }],
    ['container', {
      type: "tip",
      defaultTitle: "提示",
    }],
    "img-lazy",
  ],

  markdown: {
    extendMarkdown: md => {
      // use more markdown-it plugins!
      md.use(require('markdown-it-plantuml'))
      md.use(require('markdown-it-task-lists'))
    }
  }

}
