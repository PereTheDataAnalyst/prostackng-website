// lib/prostack-services.ts
// Centralised registry of all billable ProStack NG services.
// Import this wherever you need service definitions — route files, frontend, etc.

export const PROSTACK_SERVICES = {
  // Managed Services
  'managed-starter':    { label: 'Managed Service — Starter',             minAmount: 5000000   },
  'managed-growth':     { label: 'Managed Service — Growth',              minAmount: 12000000  },
  'managed-enterprise': { label: 'Managed Service — Enterprise',          minAmount: 20000000  },

  // Consulting
  'consulting-audit':   { label: 'Digital Transformation Audit',          minAmount: 50000000  },
  'consulting-roadmap': { label: 'Audit + Transformation Roadmap',        minAmount: 120000000 },
  'consulting-full':    { label: 'Full Digital Transformation',           minAmount: 300000000 },

  // White Label
  'white-label-setup':    { label: 'White-Label Setup Fee',               minAmount: 10000000  },
  'white-label-monthly':  { label: 'White-Label Monthly Licence',         minAmount: 5000000   },

  // API Access
  'api-starter':    { label: 'API — Starter Plan',    minAmount: 2500000   }, // ₦25,000
  'api-growth':     { label: 'API — Growth Plan',     minAmount: 7500000   }, // ₦75,000
  'api-enterprise': { label: 'API — Enterprise Plan', minAmount: 10000000  }, // custom

  // General
  'deposit': { label: 'ProStack NG Deposit',          minAmount: 1000000   },
  'invoice':  { label: 'ProStack NG Invoice Payment', minAmount: 1000000   },
  'other':    { label: 'Other Service Payment',       minAmount: 1000000   },
} as const;

export type ServiceKey = keyof typeof PROSTACK_SERVICES;
