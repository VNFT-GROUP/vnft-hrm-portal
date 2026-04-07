# VNFT Group — HRM Portal 🚀

Chào mừng đến với dự án **VNFT Group Human Resource Management Portal** — Hệ thống quản trị Nhân sự dành riêng cho công ty vận tải và tiếp vận VNFT Group.

## 🌟 Giới Thiệu
Dự án được xây dựng dựa trên nguyên tắc **chuyên nghiệp, mượt mà và trực quan**. Hệ thống theo sát bộ nhận diện thương hiệu VNFT Group ("Your Success, Our Target") đi kèm công nghệ Frontend tối tân. 

## ⚙️ Công Nghệ (Tech Stack)
Hệ thống sử dụng các bộ thư viện mạnh mẽ:
- **Framework:** React 19 + TypeScript (Vite 8)
- **UI & Styling:** Tailwind CSS v4, Vanilla CSS, `shadcn/ui` (Base UI/Radix)
- **Animation:** Framer Motion
- **Quản lý state:** Zustand, TanStack React Query
- **Routing & i18n:** React Router DOM v7, `i18next`

## ⌨️ Hướng Dẫn Sử Dụng (User Guide)

Hệ thống được thiết kế tối ưu nhất cho tương tác người dùng, với bộ phím tắt và thao tác thông minh:

### 👉 **Phím Tắt Toàn Cầu (Global Shortcuts)**
- **`Alt + S`**: Chuyển hướng nhanh truy cập mọi lúc vào trang **Cài Đặt (Settings)**.
- **`Ctrl + B`** (hoặc Cmd + B): Ẩn/Hiện thanh điều hướng bên trái (Sidebar) nhanh chóng.
- **`Ctrl + I`** (hoặc Cmd + I): Đóng/Mở Dropdown hồ sơ ở góc trên bên phải.
- **`Shift + K`**: Di chuyển tốc hành vào mục Hướng Dẫn Sử Dụng.
- **`Esc`**: Thoát ngay mọi cửa sổ ảo, Pop-up và Popup menu.

### 👉 **Bảng Quản Lý Nhân Viên (Smart Table)**
Ở danh sách giao diện bảng nhân sự, chúng ta có một cải tiến lớn:
- Bạn chỉ cần **Click Chuột Phải (Right Click)** ngay trên dòng của nhân viên bất kỳ để mở ra một **Context Menu** y hệt như Native App bao gồm các tác vụ: Xem chi tiết, Chỉnh sửa thông tin, Chỉnh mức lương, và Hủy kích hoạt tài khoản. 
- Tính năng này giúp loại bỏ hoàn toàn việc phải cuộn chuột dài còng lưng tìm kiếm nút chức năng ở góc khuất, trong khi vẫn không hề vi phạm cấu trúc mượt mà nguyên thủy của HTML `<tbody>`.

### 👉 **Cấu Hình Cá Nhân (Personalization)**
Tất cả các cấu hình như: Thu gọn Sidebar hay *Tắt/hiển thị thanh Chú thích Context Menu* ở màn Quản lý, đều tự động được lưu bền vững vào `localStorage` qua bộ State Control của **Zustand**. Tắt máy mở lại vẫn giữ nguyên ý bạn!

---

## 🛠️ Yêu Cầu Cài Đặt (Getting Started)
Để bắt đầu cài đặt và sử dụng ứng dụng ở môi trường cục bộ (Local):

```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Khởi động môi trường dev
npm run dev

# 3. Chạy build trước khi release
npm run build
```

_© 2026 Bản quyền thuộc về **VNFT Group**. Developed for Advanced Human Resources Administration._
