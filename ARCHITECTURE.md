# VNFT Portal Frontend Architecture & Best Practices

## 1. Nguyên tắc tổ chức (Domain-Driven & Co-location)

Cốt lõi của kiến trúc là **Co-location**: _"Cái gì chỉ dùng cho một tính năng thì phải đặt bên trong thư mục của tính năng đó, không được ném ra ngoài Global"_. Điều này giúp dự án dễ dàng scale, tránh rác (bloat) các thư mục dùng chung khi dự án lớn dần.

### Quy chuẩn thư mục `src`

```text
src/
├── components/     # UI thuần & Components dùng chung (Global)
├── config/         # Cấu hình môi trường (Gateway URLs, etc.)
├── constants/      # Hằng số, Labels, Options dùng toàn cục
├── hooks/          # Custom hooks tiện ích hệ thống (useDebounce, v.v.)
├── lib/            # Tiện ích cốt lõi, axios instances, formatters
├── locales/        # Ngôn ngữ (i18n)
├── pages/          # Các trang phân theo tính năng (Domain-driven)
├── routes/         # Cấu hình đường dẫn, Guards & Dữ liệu Sidebar
├── services/       # Lớp gọi API backend (Axios calls)
├── store/          # Quản lý Global State (Zustand)
└── types/          # Khai báo Interfaces, Enums phân theo Domain
```

## 2. Chi tiết Checklist chuẩn hóa

### 📁 Khu vực Tính năng (Features/Pages)

Toàn bộ UI và Logic cụ thể của từng tính năng phải được gom nhóm tại `src/pages/`.

- **Component cục bộ**: Các component chỉ dành cho một trang (VD: `RequestFormModal.tsx`) **phải** được đặt tại `pages/.../requests/components/`, không được đặt ở `src/components/`.
- **Hook cục bộ**: Các hook gọi API riêng biệt (VD: `useProfitReports.ts`) **phải** đặt tại `pages/.../profit-report/hooks/`.

### 🧩 Khu vực Dùng chung (Global Shared Layer)

Chỉ những code được tái sử dụng từ **2 nơi trở lên** mới được đặt ngoài global:

- `src/components/ui/`: Chứa các "Dumb Components" (không chứa logic API) như `Button`, `Input`, `Dialog` (thường gen từ shadcn/ui).
- `src/components/custom/`: Chứa các "Smart/Complex Components" dùng chung toàn hệ thống (VD: `LoadingPage`).
- `src/hooks/`: Chỉ dành cho Utility hooks (VD: `useDebounce`, `useLocalStorage`).
- `src/constants/`: Gom các khai báo mảng/object hằng số cố định.

### 📡 Quản lý Dữ liệu và API (Types & Services)

- **Types**: Interfaces Request/Response/Enum phải được nhóm **theo từng nghiệp vụ** (VD: `types/requestform/`). Không tạo thư mục `requests` hay `responses` chung chung.
- **Services**: Lớp trung gian tương tác với Backend. Có thể dùng file lẻ (VD: `auth.ts`) cho logic nhỏ, hoặc tạo folder (`services/user/`) nếu module có nhiều tính năng con.

### 🚦 Điều hướng (Routes & Navigation)

- `src/routes/`: Là trái tim điều phối của Frontend.
  - `index.tsx`: Nơi đăng ký cấu hình `react-router-dom`, Lazy loading và Protected Routes Guard.
  - `navigation.tsx`: Chứa dữ liệu của Sidebar, Menu động dựa trên Quyền hạn (Permissions).

### 📦 Quản lý State

- **Global State**: Sử dụng Zustand/Redux trong `src/store/` chỉ cho các state **bắt buộc** phải dùng chung toàn app (Session Auth, Theme, Layout status).
- **Server State**: Xử lý hoàn toàn qua React Query (`useQuery`, `useMutation`).
- **Local State**: Các state đóng/mở UI, data form đang nhập dở... quản lý bằng `useState`/`useReducer` ngay tại Component cục bộ.

## 3. Quy chuẩn Naming Convention (Đặt tên)

1. **Component / Page**: Sử dụng `PascalCase.tsx` (Ví dụ: `RequestFormModal.tsx`, `HomePage.tsx`).
2. **Hooks**: Bắt đầu bằng chữ `use` và sử dụng `camelCase.ts` (Ví dụ: `useDebounce.ts`, `useSalesmanMappings.ts`).
3. **Services / Utils / Types**: Sử dụng `camelCase.ts`
4. **Hằng số (Constants)**: Tên biến hằng số phải là `UPPER_SNAKE_CASE` (Ví dụ: `REQUEST_FORM_TYPE_LABELS`).
