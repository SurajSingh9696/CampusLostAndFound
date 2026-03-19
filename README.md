# 🔍 Campus Lost & Found - Next.js Enhanced Version

A modern, feature-rich lost and found management system for campus communities built with Next.js 14, featuring real-time updates, QR code generation, image compression, and a beautiful responsive UI.

## ✨ Features

### Core Features
- 🔐 **User Authentication** - Secure JWT-based authentication
- 📝 **Post Items** - Lost or Found items with detailed information
- 🔍 **Advanced Search** - Real-time search with debouncing
- 🎯 **Smart Filters** - Filter by type, category, status, location, and more
- 💬 **Comments System** - Discuss and verify item ownership
- ✅ **Claim Items** - Users can claim items they've found
- 📊 **Statistics Dashboard** - Track success rates and activity
- ⭐ **Reputation System** - Build trust through helpful actions

### Enhanced Features
- 📱 **Mobile-First Design** - Fully responsive across all devices
- 🎨 **Modern UI** - Clean, warm color palette with smooth animations
- 📸 **Image Upload** - With automatic compression (max 1MB)
- 🖼️ **Image Optimization** - Using Sharp for server-side processing
- 📦 **File Upload with Busboy** - Efficient file handling on the backend
- 🔢 **QR Code Generation** - Unique QR codes for each item
- 🏷️ **Tagging System** - Add custom tags for better discoverability
- 🎯 **Priority Levels** - Mark items as Low, Medium, High, or Urgent
- 📍 **Location Details** - Building, floor, and specific location
- 🔔 **Toast Notifications** - Real-time feedback for user actions
- 🌟 **View Counter** - Track item popularity
- 📈 **Pagination** - Efficient loading of large datasets
- ⚡ **Fast Performance** - Optimized with Next.js App Router
- 🎭 **Smooth Animations** - Using Framer Motion

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Icons** - Icon library
- **React Hot Toast** - Notification system
- **Zustand** - State management
- **SWR** - Data fetching and caching

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Busboy** - Multipart form data parser
- **Sharp** - High-performance image processing
- **QRCode** - QR code generator
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

## 📦 Installation

1. **Clone the repository**
   ```bash
   cd campus-lost-found-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/campus-lost-found-next
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Usage

### For Students

1. **Register/Login**
   - Create an account with your campus email
   - Fill in your department and student ID

2. **Post a Lost Item**
   - Click "Post Item" in the navigation
   - Select "Lost" type
   - Fill in details, location, and upload an image
   - Set priority level and add tags

3. **Post a Found Item**
   - Same process, but select "Found" type
   - Help others by providing detailed description

4. **Search for Items**
   - Use the search bar on the browse page
   - Apply filters for category, location, status
   - Sort by newest, most viewed, etc.

5. **Claim an Item**
   - View item details
   - Use comments to verify ownership
   - Click "Claim" button when ready

6. **Download QR Code**
   - Each item has a unique QR code
   - Print and share for offline visibility

### For Administrators

- Access admin panel for moderation
- View comprehensive statistics
- Manage users and items
- Monitor platform activity

## 🎨 Color Palette

The application uses a warm, inviting color scheme:

- **Primary** (Orange): #f8a912 - Main actions and highlights
- **Secondary** (Green): #4caf50 - Success states and positive actions
- **Accent** (Deep Orange): #ff9800 - Urgent items and warnings
- **Neutral** (Stone): Shades from #fafaf9 to #1c1917

## 📱 Responsive Design

The application is built mobile-first and works seamlessly on:
- 📱 Mobile phones (320px and up)
- 📱 Tablets (768px and up)
- 💻 Laptops (1024px and up)
- 🖥️ Desktops (1280px and up)

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ File size and type validation
- ✅ Protected API routes
- ✅ CORS configuration

## 🎯 Key Improvements Over Original

1. **Modern Stack** - Next.js 14 with App Router vs older React
2. **Better Performance** - Server-side rendering and optimization
3. **Enhanced UI** - Modern design with animations
4. **File Handling** - Busboy with 1MB limit and compression
5. **Image Processing** - Sharp for optimization
6. **QR Codes** - For offline sharing
7. **Better UX** - Toast notifications, real-time feedback
8. **Mobile-First** - Responsive design from ground up
9. **Advanced Features** - Priority levels, tags, reputation
10. **Clean Architecture** - Organized code structure

## 📂 Project Structure

```
campus-lost-found-nextjs/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/          # API routes
│   │   ├── browse/       # Browse items page
│   │   ├── items/        # Item details pages
│   │   ├── login/        # Login page
│   │   ├── register/     # Registration page
│   │   ├── post-item/    # Post item page
│   │   ├── profile/      # User profile page
│   │   ├── layout.js     # Root layout
│   │   ├── page.js       # Home page
│   │   └── globals.css   # Global styles
│   ├── components/       # Reusable components
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   ├── ItemCard.js
│   │   ├── LoadingSpinner.js
│   │   └── EmptyState.js
│   ├── lib/              # Utility functions
│   │   ├── api.js        # API client
│   │   ├── auth.js       # Auth utilities
│   │   ├── mongodb.js    # Database connection
│   │   ├── upload.js     # File upload with Busboy
│   │   ├── utils.js      # Helper functions
│   │   └── constants.js  # App constants
│   ├── models/           # Mongoose models
│   │   ├── User.js
│   │   └── Item.js
│   └── store/            # State management
│       └── authStore.js  # Zustand auth store
├── public/               # Static files
├── .env.local           # Environment variables
├── package.json         # Dependencies
├── tailwind.config.js   # Tailwind configuration
├── next.config.js       # Next.js configuration
└── README.md            # Documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👥 Support

For support, email lostandfound@campus.edu or join our campus community forum.

## 🎉 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting capabilities
- MongoDB for the database
- All contributors and campus community members

---

Made with ❤️ for the campus community
# CampusLostAndFound
