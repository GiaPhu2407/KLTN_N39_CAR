# 💻Tech Stack

![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Next.js](https://img.shields.io/badge/next.js-%23000000.svg?style=for-the-badge&logo=next.js&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white) ![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white) ![Jira](https://img.shields.io/badge/jira-%230A0FFF.svg?style=for-the-badge&logo=jira&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white) ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
XDHTQLCT0819/
├── app/                          # Thư mục chính của NextJS
│   ├── api/                      # API routes cho Backend
│   │   ├── auth/                 # Routes xác thực
│   │   │   ├── login/route.js    
│   │   │   ├── register/route.js
│   │   │   └── logout/route.ts
│   │   ├── car/route.js # API giao dịch
│   │   ├── payment/route.js   # API danh mục
│   │   ├── testdriveappointment/route.js      # API ngân sách
│   │   └── deposit/route.js    # API phân tích
│   ├
│   │   
│   ├── dashboard/                # Trang dashboard
│   │   ├── page.jsx
│   │   ├── layout.jsx
│   │   ├── CarManager/page.jsx
│   │   ├── TypeCarManager/page.jsx
│   │   └── component/
│   │   │       ├── Table
│   │   │           ├── TableCarMangager.tsx
│   │   │            ├── TableEvaluation.tsx
│   │   │            ├── TableUsers.tsx
│   │   │            └── ....
│   │   │
│   │   ├── ImportExportCar.tsx
│   │   ├── ReportDeposit.tsx
│   │         
│   ├── settings/                 # Trang cài đặt
│   │   └── page.jsx
│   ├── layout.jsx                # Root layout
│   └── page.jsx                  # Trang chủ
├── components/                   # Các component tái sử dụng
│   ├── ui/                       # UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   └── Card.jsx
├── lib/                          # Các utility và thư viện
│   ├── db.js                     # Kết nối database
│   ├── auth.js                   # Cấu hình NextAuth
│   └── utils.js                  # Utility functions
├── models/                       # Schema models
│   ├── User.js
│   ├── Transaction.js
│   ├── Category.js
│   
├── public/                       # Static assets
│   ├── images/
│   └── icons/
├── styles/                       # CSS/Tailwind styles
│   └── globals.css
├── .env.local                    # Environment variables
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.js
└── README.md
XDHTQLCT0819/
├── app/                          # Thư mục chính của NextJS
│   ├── api/                      # API routes cho Backend
│   │   ├── auth/                 # Routes xác thực
│   │   │   ├── login/route.js    
│   │   │   ├── register/route.js
│   │   │   └── [...nextauth]/route.js
│   │   ├── transactions/route.js # API giao dịch
│   │   ├── categories/route.js   # API danh mục
│   │   ├── budgets/route.js      # API ngân sách
│   │   └── analytics/route.js    # API phân tích
│   ├── (auth)/                   # Group route xác thực
│   │   ├── login/page.jsx
│   │   └── register/page.jsx
│   ├── dashboard/                # Trang dashboard
│   │   ├── page.jsx
│   │   ├── layout.jsx
│   │   ├── transactions/page.jsx
│   │   ├── budgets/page.jsx
│   │   └── analytics/page.jsx
│   ├── settings/                 # Trang cài đặt
│   │   └── page.jsx
│   ├── layout.jsx                # Root layout
│   └── page.jsx                  # Trang chủ
├── components/                   # Các component tái sử dụng
│   ├── ui/                       # UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   └── Card.jsx
│   ├── forms/                    # Form components
│   │   ├── TransactionForm.jsx
│   │   └── BudgetForm.jsx
│   └── dashboard/                # Dashboard components
│       ├── TransactionList.jsx
│       ├── BudgetChart.jsx
│       └── AnalyticsView.jsx
├── lib/                          # Các utility và thư viện
│   ├── db.js                     # Kết nối database
│   ├── auth.js                   # Cấu hình NextAuth
│   └── utils.js                  # Utility functions
├── models/                       # Schema models
│   ├── User.js
│   ├── Transaction.js
│   ├── Category.js
│   └── Budget.js
├── public/                       # Static assets
│   ├── images/
│   └── icons/
├── styles/                       # CSS/Tailwind styles
│   └── globals.css
├── .env.local                    # Environment variables
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.js
└── README.md
