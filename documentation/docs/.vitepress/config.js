export default {
  title: 'VaneJS',
  description: 'A lightweight reactive JavaScript library for building user interfaces',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/state-management' },
      { text: 'Examples', link: '/examples/basic' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Core Concepts', link: '/guide/core-concepts' },
            { text: 'Installation', link: '/guide/installation' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'State Management', link: '/api/state-management' },
            { text: 'Store Management', link: '/api/store-management' },
            { text: 'Event Management', link: '/api/event-management' },
            { text: 'DOM Bindings', link: '/api/dom-bindings' },
            { text: 'Conditional Rendering', link: '/api/conditional-rendering' },
            { text: 'List Rendering', link: '/api/list-rendering' }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Basic Counter', link: '/examples/basic' },
            { text: 'Todo List', link: '/examples/todo' },
            { text: 'Dynamic List', link: '/examples/dynamic-list' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/abtahi-tajwar/vanejs' }
    ]
  }
} 
