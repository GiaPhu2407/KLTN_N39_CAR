# 💻Tech Stack

![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Next.js](https://img.shields.io/badge/next.js-%23000000.svg?style=for-the-badge&logo=next.js&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white) ![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white) ![Jira](https://img.shields.io/badge/jira-%230A0FFF.svg?style=for-the-badge&logo=jira&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white) ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
# 📊 XDWBSTCCT0819 - Xây dựng website bán xe tích hợp chatbot AI tư vấn & đặt lịch hẹn trải nghiệm 

## 🚀 Giới thiệu
Đây là dự án Hệ thống Quản lý Chi tiêu Thông Minh ứng dụng AI, giúp người dùng:
- Theo dõi và quản lý thu nhập, chi tiêu cá nhân.
- Thiết lập ngân sách, mục tiêu tài chính.
- Phân tích xu hướng tài chính và phát hiện bất thường bằng AI.
- Hỗ trợ cảnh báo vượt ngân sách, gợi ý tiết kiệm.

Dự án được thực hiện bởi nhóm 10, gồm các thành viên:
- Cao Ngô Gia Phú (nhóm trưởng)
- Trần Lê Huy 
- Văn Bá Việt
- Võ Tấn Trí
- Nguyễn Đăng Quốc Thịnh.

## 🏗️ Cấu trúc dự án
```
XDHTQLCT0819/
├── BE/                # Backend - Laravel API
├── FE/                # Frontend - Vue.js (Vue 3)
├── .gitignore
└── README.md          # Tài liệu mô tả dự án
```

## 🟦 Backend (BE)
- Ngôn ngữ: PHP Laravel 10
- Chức năng:
  - Đăng ký / Đăng nhập / Quản lý người dùng.
  - CRUD: Tài khoản tài chính, danh mục thu/chi, giao dịch, ngân sách.
  - Phân tích tài chính bằng AI.
  - Thông báo, nhật ký hoạt động.

### ⚙️ Cài đặt Backend:
```bash
cd BE/admin
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

## 🟩 Frontend (FE)
- Framework: **Vue.js 3 + Vue Router + Axios**
- Chức năng:
  - Giao diện đăng nhập, đăng ký.
  - Quản lý chi tiêu, theo dõi giao dịch.
  - Thiết lập ngân sách, mục tiêu tài chính.
  - Hiển thị báo cáo tài chính, cảnh báo AI.

### ⚙️ Cài đặt Frontend:
```bash
cd FE
npm install
npm run serve
```

## 🔐 Tính năng chính:
| Chức năng                     | Mô tả                                  |
|---------------------------------|----------------------------------------|
| Quản lý người dùng             | Đăng ký, đăng nhập, phân quyền         |
| Quản lý tài khoản tài chính    | Ngân hàng, ví điện tử, crypto…         |
| Giao dịch tài chính            | Thu/chi, giao dịch định kỳ             |
| Ngân sách cá nhân              | Thiết lập giới hạn chi tiêu theo danh mục |
| Mục tiêu tài chính             | Đặt mục tiêu tiết kiệm, đầu tư         |
| Thông báo, cảnh báo            | Vượt ngân sách, nhắc nhở định kỳ       |
| AI phân tích tài chính         | Phát hiện bất thường, gợi ý tiết kiệm  |
| Nhật ký hoạt động              | Lưu lại lịch sử thao tác người dùng    |

## 🌐 Công nghệ sử dụng:
- Laravel 10 (PHP) - Backend RESTful API
- MySQL- Database
- Vue.js 3 - Frontend SPA (Single Page Application)
- Axios - HTTP Client
- scikit-learn (Python) - AI phân tích tài chính

## 👨‍💻 Contributors
- Cao Ngô Gia Phú (nhóm trưởng)
- Trần Lê Huy 
- Văn Bá Việt
- Võ Tấn Trí
- Nguyễn Đăng Quốc Thịnh.

## 📩 Liên hệ
> Mọi ý kiến đóng góp xin gửi về email của nhóm: hpvy.work@gmail.com ( nhóm trưởng ).
