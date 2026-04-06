---
name: modularize
description: Always split complex pages and large components into smaller, logical sub-components grouped in a local `components` directory.
---

# Modularize

Great React applications rely on modular, reusable, and readable code. Keep your `index.tsx` entry points slim by delegating logic and UI to well-defined sub-components.

## Core Rules

1. **Rule of File Size**: If a single `.tsx` file (especially a page's `index.tsx`) exceeds ~150-200 lines or contains distinctly separate layout sections (e.g. Table, Form Modal, Header), you MUST extract them.
2. **Local Component Directory**: Do not dump page-specific components into the global `@/components`. Instead, create a `components/` folder adjacent to your page `index.tsx`.
   - Example: `src/pages/dashboard/components/DashboardStats.tsx`
3. **Keep State High, Pass Props Down**: It is completely fine to keep the state in the parent `index.tsx` container and pass down state handlers as props.
4. **Prop Typing**: Make sure to define sensible Typescript `interface Props` for the separated components so it's strictly typed.

## Example

```tsx
// ❌ BAD: Giant index.tsx
export default function Page() {
  const [data, setData] = useState([]);
  return (
    <div>
      <Header />
      <Toolbar onSearch={...} />
      <LargeTable data={data} ... />
      <SideFormSheet isOpen={...} ... />
    </div>
  )
}
// the definition of LargeTable and SideFormSheet are all hardcoded inside Page.
```

```tsx
// ✅ GOOD: Modularized
import PageHeader from "./components/PageHeader";
import DataTable from "./components/DataTable";
import SideForm from "./components/SideForm";

export default function Page() {
  // State logic
  return (
    <div>
      <PageHeader />
      <DataTable data={data} onDelete={handleDelete} />
      <SideForm isOpen={isOpen} onSave={handleSave} />
    </div>
  )
}
```
