# AI Agents & Skills Configuration

This is the **VNFT Portal** monorepo powered by [Turborepo](https://turborepo.dev/).

Please note that all custom instructions, skills, configuration files, and context guidelines for the AI agents working in this repository are located inside the `.agents/` directory.

👉 **If you are an AI/Agent looking for context or rules, please read the contents of the `.agents/` folder.**

## Monorepo Structure

```
vnft-portal/
├── apps/
│   ├── hrm/          # HRM Portal (Vite + React)
│   ├── crm/          # CRM Portal (future)
│   └── fms/          # FMS Portal (future)
├── packages/
│   ├── ui/           # Shared UI components
│   ├── eslint-config/ # Shared ESLint config
│   └── typescript-config/ # Shared TS config
├── .agents/          # AI agent instructions & skills
├── turbo.json        # Turborepo pipeline config
└── package.json      # Root workspace config
```
