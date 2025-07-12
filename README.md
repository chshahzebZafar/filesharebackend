# File Transfer Application

A modern, secure file transfer application built with React, TypeScript, and Node.js. Upload files up to 2GB and share them instantly with secure links and QR codes.

## Features

### Frontend (React + TypeScript)
- 🎨 **Modern UI**: Beautiful, responsive design with dark/light theme
- 📁 **Drag & Drop Upload**: Intuitive file upload with drag and drop support
- 🔗 **Share Links**: Generate secure, time-limited share links
- 📱 **QR Codes**: Automatic QR code generation for easy mobile sharing
- 🛡️ **Password Protection**: Optional password protection for files
- ⚡ **Real-time Progress**: Live upload progress tracking
- 🌙 **Dark Mode**: Toggle between light and dark themes

### Backend (Node.js + Express)
- 🔐 **Secure File Upload**: Support for files up to 2GB with optional encryption
- 🔗 **Share Links**: Generate secure, time-limited share links with optional passwords
- 📱 **QR Code Generation**: Automatic QR code generation for easy mobile sharing
- 🗑️ **Automatic Cleanup**: Automatic deletion of expired files
- 🛡️ **Security**: Rate limiting, CORS protection, and security headers
- 📊 **Statistics**: File upload statistics and storage monitoring
- 🔄 **Multiple File Upload**: Support for uploading multiple files simultaneously

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Query
- **Notifications**: Sonner

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **File Handling**: Multer, fs-extra
- **Security**: bcryptjs, crypto, helmet, express-rate-limit
- **QR Codes**: qrcode
- **Compression**: compression

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd file-transfer-app
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up the backend**
   ```bash
   npm run setup
   ```

4. **Start both frontend and backend**
   ```bash
   npm run dev
   ```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Alternative Setup

#### Frontend Only
```bash
npm install
npm run dev
```

#### Backend Only
```bash
cd backend
npm install
npm run setup
npm run dev
```

## API Endpoints

### Upload
- `POST /api/upload/single` - Upload a single file
- `POST /api/upload/multiple` - Upload multiple files
- `GET /api/upload/stats` - Get upload statistics

### Download
- `GET /api/download/:shareId` - Download a file
- `GET /api/download/:shareId/info` - Get file information
- `GET /api/download/:shareId/check-password` - Check if password required

### Health & Info
- `GET /health` - Health check
- `GET /api` - API information

## Configuration

### Frontend Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3001/api
```

### Backend Environment Variables
The setup script will create a `.env` file in the `backend` directory:
```env
PORT=3001
NODE_ENV=development
MAX_FILE_SIZE=2147483648
UPLOAD_DIR=uploads
TEMP_DIR=temp
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ENCRYPTION_KEY=your-32-character-encryption-key-here
```

## Project Structure

```
file-transfer-app/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── hooks/             # Custom hooks
│   └── ...
├── backend/               # Backend source code
│   ├── src/
│   │   ├── config/        # Configuration
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utility functions
│   │   └── index.ts       # Main server file
│   ├── uploads/           # Uploaded files
│   ├── temp/              # Temporary files
│   └── ...
├── package.json
└── README.md
```

## Development

### Available Scripts

#### Root (Full Stack)
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend
- `npm run install:all` - Install dependencies for both frontend and backend
- `npm run setup` - Set up backend environment

#### Frontend Only
- `npm run dev:frontend` - Start frontend development server
- `npm run build:frontend` - Build frontend for production
- `npm run preview` - Preview production build

#### Backend Only
- `npm run dev:backend` - Start backend development server
- `npm run build:backend` - Build backend for production
- `npm run start:backend` - Start production backend server

### Development Workflow

1. **Start development servers**
   ```bash
   npm run dev
   ```

2. **Make changes to frontend** (src/)
   - Changes will hot reload automatically

3. **Make changes to backend** (backend/src/)
   - Backend will restart automatically with nodemon

4. **Test the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api

## Security Features

- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS Protection**: Configurable cross-origin resource sharing
- **Security Headers**: Helmet.js for security headers
- **File Encryption**: Optional AES-256-GCM encryption
- **Password Protection**: Optional password protection for files
- **Automatic Cleanup**: Removes expired files automatically

## File Storage

Files are stored in the `backend/uploads/` directory with the following structure:
```
uploads/
├── abc123def456_document.pdf
├── xyz789image.jpg
└── ...
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
