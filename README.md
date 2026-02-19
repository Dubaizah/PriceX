# PriceX - Global AI-Powered Price Comparison Platform

PriceX is an enterprise-grade price comparison platform targeting 10M+ users worldwide with AI-driven predictions, real-time price tracking, and comprehensive product search across 25+ categories.

## 🚀 Features

### Core Capabilities
- **AI Price Predictions**: "Buy Now", "Wait", or "Best Time to Buy" recommendations
- **Real-time Comparison**: Compare prices across 50+ retailers globally
- **Price Alerts**: Get notified when prices drop or products come back in stock
- **25 Product Categories**: Electronics, Fashion, Home, Beauty, Sports, and more
- **Multi-region Support**: 8 regions with localized pricing and currency conversion
- **Loyalty Program**: 5-tier reward system with exclusive benefits

### Enterprise Features
- **B2B Data API**: Real-time pricing data for retailers and market research
- **Advanced Security**: 2FA, fraud detection, audit logging, GDPR/CCPA compliance
- **Multi-language**: 12 languages including RTL (Arabic, Urdu)
- **Mobile Apps**: iOS & Android with offline support

## 🏗️ Architecture

### Tech Stack

#### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management

#### Backend
- **Python FastAPI** - High-performance async API
- **PostgreSQL** - Primary database with Aurora Global
- **Redis** - Caching and session management
- **Elasticsearch** - Full-text search

#### Mobile
- **React Native** - Cross-platform development
- **Zustand** - State management
- **React Query** - Server state management

#### Infrastructure
- **AWS** - Cloud infrastructure
- **CloudFront** - Global CDN
- **Terraform** - Infrastructure as Code
- **Docker** - Containerization

## 📁 Project Structure

```
pricex/
├── src/                          # Next.js frontend
│   ├── app/                      # App router pages
│   ├── components/               # React components
│   ├── lib/                      # Utility functions
│   ├── context/                  # React contexts
│   └── types/                    # TypeScript types
├── backend/                      # FastAPI backend
│   ├── app/
│   │   ├── main.py              # API entry point
│   │   └── models.py            # Database models
│   ├── Dockerfile
│   └── requirements.txt
├── mobile/                       # React Native app
│   ├── src/
│   │   ├── screens/             # App screens
│   │   ├── navigation/          # Navigation config
│   │   ├── services/            # API services
│   │   └── stores/              # State management
│   └── package.json
├── infrastructure/              # Terraform IaC
│   └── main.tf
├── .github/workflows/           # CI/CD pipelines
├── docker-compose.yml          # Local development
└── scripts/                    # Deployment scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- AWS CLI (for deployment)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/your-org/pricex.git
cd pricex
```

2. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start with Docker Compose**
```bash
docker-compose up -d
```

4. **Install frontend dependencies**
```bash
cd pricex
npm install
npm run dev
```

5. **Install backend dependencies**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

6. **Access the application**
- Frontend: http://localhost:3000
- API: http://localhost:8000
- API Docs: http://localhost:8000/api/docs

### Mobile Development

```bash
cd mobile
npm install

# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

## 📊 Revenue Model

**Target**: $10M/month at scale

- **Advertising (50%)**: $5M - Display ads, native ads, video
- **B2B Data (30%)**: $3M - API subscriptions for retailers
- **Affiliate (20%)**: $2M - Commission from sales

**Required Metrics**:
- 500M monthly page views
- 3,250 B2B subscriptions
- $50M affiliate GMV

## 🌍 Regional Rollout

1. **North America** (Launch)
2. **South America** (Month 2)
3. **Europe** (Month 4)
4. **MENA** (Month 6)
5. **Asia** (Month 8)
6. **Africa** (Month 10)
7. **Australia** (Month 12)

## 🔒 Security

- **Authentication**: JWT with refresh tokens, 2FA mandatory
- **Password Policy**: 8-32 chars, complexity requirements, 90-day rotation
- **Fraud Detection**: ML-based anomaly detection
- **Compliance**: GDPR, CCPA, LGPD, PCI DSS ready
- **Audit Logging**: Complete activity trail

## 📈 API Endpoints

### Products
```
GET  /api/v1/search?q={query}        # Search products
GET  /api/v1/products/{id}           # Get product details
GET  /api/v1/trending                # Trending products
POST /api/v1/products/compare        # Compare products
```

### User
```
POST /api/v1/auth/login              # User login
POST /api/v1/auth/register           # User registration
GET  /api/v1/user/saved              # Saved products
POST /api/v1/user/alerts             # Create price alert
```

### B2B
```
GET  /api/v1/b2b/pricing-index       # Pricing data
GET  /api/v1/b2b/predictions         # AI predictions
GET  /api/v1/b2b/trends              # Market trends
```

## 🧪 Testing

```bash
# Frontend tests
npm run test

# Backend tests
cd backend
pytest

# Mobile tests
cd mobile
npm run test
```

## 🚀 Deployment

### Staging
```bash
./scripts/deploy.sh staging
```

### Production
```bash
./scripts/deploy.sh production v1.0.0
```

### Infrastructure
```bash
cd infrastructure
terraform init
terraform plan
terraform apply
```

## 📱 Mobile Apps

### Prerequisites
- **iOS**: macOS with Xcode
- **Android**: Android Studio with SDK

### Build iOS (macOS only)
```bash
cd PriceXMobile
npm install
cd ios && pod install && cd ..
npx react-native run-ios
```

Or use the build script:
```bash
chmod +x ../build-ios.sh
../build-ios.sh
```

### Build Android
```bash
cd PriceXMobile
npm install
npx react-native run-android
```

Or use the build script (Windows):
```bash
..\build-android.bat
```

### App Store QR Code
![iOS QR Code](assets/ios-qr.png)

### Play Store QR Code
![Android QR Code](assets/android-qr.png)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Copyright © 2024 PriceX Inc. All rights reserved.

## 📞 Support

- **Documentation**: https://docs.pricex.com
- **API Reference**: https://api.pricex.com/docs
- **Email**: support@pricex.com
- **Discord**: https://discord.gg/pricex

## 🙏 Acknowledgments

- Built with ❤️ by the PriceX Engineering Team
- Powered by AI/ML technologies
- Cloud infrastructure by AWS
