---
inclusion: always
---

# Project Structure

## Directory Organization

### Root Level
```
/
├── .additional-resources/   # Competition terms and reference materials
├── .git/                    # Git version control
├── .kiro/                   # Kiro IDE configuration and specs
├── frontend/                # Next.js application (to be created)
├── infrastructure/          # AWS CDK infrastructure (to be created)
├── AGENTS.md               # AI agent directives and constraints
└── README.md               # Project overview (when created)
```

### .kiro/ Directory
```
.kiro/
├── specs/                   # Spec-Driven Development documents
│   ├── requirements.md     # User stories and acceptance criteria
│   ├── design.md           # Architecture, data models, API contracts
│   └── tasks.md            # Granular implementation tasks
├── steering/               # Project rules and guidelines
│   ├── personas/           # Role-specific agent instructions
│   │   ├── aws_architect.md
│   │   ├── business_analyst.md
│   │   └── frontend_engineer.md
│   ├── agents/             # Agent configuration files
│   ├── product.md          # Product overview
│   ├── tech.md             # Technology stack
│   ├── structure.md        # This file
│   └── requirements.md     # Always-included requirements
```

### Frontend Structure (Next.js App Router)
```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (item feed)
│   ├── auth/              # Authentication pages
│   ├── items/             # Item listing and details
│   ├── profile/           # User profile
│   └── messages/          # In-app messaging
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   ├── item/             # Item-related components
│   └── auth/             # Auth-related components
├── lib/                  # Utilities and helpers
│   ├── api/              # API client functions
│   ├── types/            # TypeScript interfaces
│   └── utils/            # Helper functions
├── public/               # Static assets
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── next.config.js        # Next.js configuration
```

### Infrastructure Structure (AWS CDK)
```
infrastructure/
├── bin/                   # CDK app entry point
│   └── app.ts            # Main CDK application
├── lib/                  # Stack and construct definitions
│   ├── ecobid-stack.ts   # Main application stack
│   ├── constructs/       # Reusable CDK constructs
│   │   ├── api.ts        # API Gateway construct
│   │   ├── database.ts   # DynamoDB construct
│   │   ├── storage.ts    # S3 construct
│   │   └── auth.ts       # Cognito construct
│   └── lambda/           # Lambda function code
│       ├── handlers/     # Lambda handler functions
│       │   ├── items.ts
│       │   ├── lottery.ts
│       │   ├── messages.ts
│       │   └── users.ts
│       └── shared/       # Shared Lambda utilities
├── test/                 # Infrastructure tests
├── cdk.json              # CDK configuration
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript configuration
```

## File Naming Conventions

### Frontend
- Pages: `page.tsx` (App Router convention)
- Layouts: `layout.tsx`
- Components: PascalCase (e.g., `ItemCard.tsx`, `LotteryButton.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`, `apiClient.ts`)
- Types: PascalCase interfaces (e.g., `Item.ts`, `User.ts`)

### Infrastructure
- Stacks: PascalCase with `-stack` suffix (e.g., `EcobidStack`)
- Constructs: PascalCase (e.g., `ApiConstruct`, `DatabaseConstruct`)
- Lambda handlers: camelCase (e.g., `createItem.ts`, `selectWinner.ts`)

## Code Organization Principles

1. **Separation of Concerns**: Frontend and infrastructure are completely separate
2. **Single Responsibility**: Each file/component has one clear purpose
3. **Minimal Nesting**: Avoid deep directory hierarchies
4. **Colocation**: Related files stay together (e.g., component + styles + tests)
5. **No Bloat**: No summary files, logs, or documentation outside allowed locations

## Allowed Documentation Locations

Per AGENTS.md anti-bloat rules, Markdown files are ONLY permitted in:
1. `.kiro/specs/` - SDD documents (requirements.md, design.md, tasks.md)
2. `.kiro/steering/` - Project rules and guidelines
3. Root `README.md` - Only when explicitly requested

All other documentation must be inline code comments (JSDoc/TSDoc).
