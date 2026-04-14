# Management Module UI/UX & Data Guidelines

## 1. UI Tabs Design (Segmented Control style)
Following the standard Shadcn UI approach, the Top Tabs for configuring management sections (e.g., Quyền, Nhóm Quyền, Người dùng) should implement a Segmented Control switch layout.

```tsx
<Tabs defaultValue="groups" className="flex flex-col gap-6 mt-2">
  <div className="w-full flex justify-center md:items-start md:justify-start">
    <TabsList className="h-12 bg-muted/80 p-1.5 rounded-xl border border-border shadow-inner min-w-[340px]">
      <TabsTrigger
        value="groups"
        className="flex-1 flex items-center justify-center gap-2 px-6 py-2 text-sm font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-[#2E3192] text-muted-foreground transition-all h-full"
      >
        <CheckSquare size={16} /> <span>{t('management.groupsTab')}</span>
      </TabsTrigger>
      {/* ... */}
    </TabsList>
  </div>
</Tabs>
```
*Key notes: Use `h-12`, `p-1.5`, `rounded-xl`, `bg-muted/80`, `shadow-inner` for the wrapper. Use `data-[state=active]` with specific #2E3192 text.*

## 2. Global State & API Refresh Consistency
- **User Session Mapping**: The `UserSessionResponse` from the backend `/auth/refresh` API automatically contains `groupId`, `groupName` and the `groupPermissions` list.
- **Interceptors**: When `apiClient.ts` does an intercept/refresh logic upon `401 / 1102`, it dispatches the `login()` action to update the `session` object in `useAuthStore.ts`.
- **Conclusion**: There is no need to manually refetch permissions on the frontend after a session resume. Any component can directly access `session.groupPermissions` via `useAuthStore()`.

## 3. i18n Internationalization
All UI features deployed to the Management Module must be externalized for localization in two files:
- `src/locales/vi/management.ts`
- `src/locales/en/management.ts`

**Convention for React Components:**
Use the `useTranslation` hook and map strings strictly through `t()`, keeping fallback text for clarity:
```tsx
const { t } = useTranslation();
<Label>
    {t("management.formNameRequired", "Tên Nhóm Quyền")}
</Label>
```

## 4. Multi-Select Forms (Permissions Grouping)
When rendering large arrays of checkbox selections (e.g., Permission assignments to Groups):
- Extract and group them via `useMemo` based on `category`.
- Implement a 2-column or grid layout using `grid-cols-1 md:grid-cols-2`.
- Wrap Checkbox fields in `Label` containers configured as clickable interactive cards (`hover:bg-card border border-border/60 hover:shadow-md hover:border-[#2E3192]/50`).

## 5. Page Header Styling Convention
All major root pages (e.g., Employees, Attendance, Requests, Time Settings) should follow a unified presentation structure using Framer Motion (`motion.div`):
- **Layout Wrap**: `className="w-full p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-6 md:gap-8"`
- **Motion div**: Initial state `-y: 20, opacity: 0`, animate to `0`, `transition duration 0.5`.
- **Title Block**:
  - `h1` sizing: `text-2xl md:text-3xl font-bold text-[#1E2062] flex items-center gap-3`
  - **The Icon**: Wrapped in a rounded box with `span` classes: `p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl flex items-center justify-center`.
- **Subtitle**: `text-muted-foreground text-sm md:text-base ml-1`.
Do not use old, simple `border-l-4 border-indigo-600 pl-3` lines for standard root pages anymore.
