# Augeo - Premium Auction Platform

Auxeo is a high-end, real-time auction platform designed for luxury collectibles, fine art, and jewelry. It provides a seamless experience for both bidders and auction houses.

## 🚀 Features

- **Real-time Bidding**: Powered by Socket.io for instant bid updates and room synchronization.
- **Auto-Bidding**: Set a maximum bid and let the system bid on your behalf.
- **Multi-role Dashboards**: Dedicated interfaces for Admins, Clients (Auction Houses), and Bidders.
- **Secure Payments**: Integrated with Stripe for safe and reliable financial settlements.
- **KYC Verification**: Built-in identity verification process for high-value transactions.
- **Premium UI/UX**: A sophisticated, dark-themed design with smooth animations and responsive layouts.

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, Framer Motion.
- **Backend Integration**: REST API (Axios), WebSockets (Socket.io-client).
- **Payments**: Stripe.

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd augeo-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Production Build

To create a production build:
```bash
npm run build
npm run start
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
