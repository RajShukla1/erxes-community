module.exports = {
  name: 'loan',
  port: 3119,
  exposes: {
    './routes': './src/routes.tsx',
    // './settings': './src/Settings.tsx',
    // './contractSection': './contracts/components/common/ContractSection.tsx',
  },
  routes: {
    url: 'http://localhost:3119/remoteEntry.js',
    scope: 'loan',
    module: './routes',
  },
  menus: [
    {
      text: 'Contracts',
      url: '/erxes-plugin-loan/contract-list',
      icon: 'icon-medal',
      location: 'mainNavigation',
      permission: 'showContracts',
    },
    {
      text: 'Contract types',
      image: '/images/icons/erxes-01.svg',
      to: '/erxes-plugin-loan/contract-types/',
      action: 'loanConfig',
      scope: 'loan',
      location: 'settings',
      permissions: ['manageContracts'],
    },
    {
      text: 'Insurance types',
      image: '/images/icons/erxes-13.svg',
      to: '/erxes-plugin-loan/insurance-types/',
      action: 'loanConfig',
      scope: 'loan',
      location: 'settings',
      permissions: ['manageContracts'],
    },
    {
      text: 'Loan config',
      image: '/images/icons/erxes-16.svg',
      to: '/erxes-plugin-loan/holiday-settings/',
      action: 'loanConfig',
      scope: 'loan',
      location: 'settings',
      permissions: ['manageContracts'],
    },
  ],
  // customerRightSidebarSection: [
  //   {
  //     text: 'customerRightSidebarSection',
  //     component: './contractSection',
  //     scope: 'loan',
  //   },
  // ],
  // companyRightSidebarSection: [
  //   {
  //     text: 'companyRightSidebarSection',
  //     component: './contractSection',
  //     scope: 'loan',
  //   },
  // ],
  // dealRightSidebarSection: [
  //   {
  //     text: 'dealRightSidebarSection',
  //     component: './contractSection',
  //     scope: 'loan',
  //   },
  // ],
};
