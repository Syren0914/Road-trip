# Travel Roadmap App

A modern, responsive travel planning application built with Next.js, TypeScript, and Supabase. Track your road trip progress, manage expenses, and stay organized on your journey.

## Features

- 🗺️ **Interactive Roadmap**: Plan and track your travel stops
- 💰 **Expense Tracking**: Monitor your budget and expenses in real-time
- 📱 **Mobile Responsive**: Optimized for all device sizes
- 🔐 **User Authentication**: Secure login with Supabase Auth
- ⚡ **Real-time Updates**: Live synchronization across devices
- 🎨 **Modern UI**: Beautiful interface with Tailwind CSS and shadcn/ui

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd road-trip
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Run the SQL schema in your Supabase SQL editor:

```sql
-- Copy the contents of supabase/schema.sql
```

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

The application uses three main tables:

- **roadmaps**: User roadmaps with budget and metadata
- **roadmap_items**: Individual stops/activities in a roadmap
- **expenses**: Additional expenses not tied to specific roadmap items

All tables include Row Level Security (RLS) policies for data protection.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Yes |
| `NEXT_PUBLIC_APP_URL` | Your app URL (for OAuth callbacks) | Yes |

## Features Overview

### Roadmap Management
- Add, edit, and delete travel stops
- Mark stops as completed
- Reorder stops by drag and drop
- Categorize stops (pickup, fuel, food, hotel, etc.)

### Expense Tracking
- Add expenses with categories
- Track budget vs. actual spending
- Visual progress indicators
- Real-time budget calculations

### User Authentication
- Email/password authentication
- Google OAuth integration
- Secure session management
- User-specific data isolation

### Real-time Features
- Live updates across devices
- Real-time expense tracking
- Collaborative planning (future feature)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.

## Roadmap

- [ ] Collaborative roadmaps
- [ ] Offline support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Integration with mapping services
- [ ] Photo attachments for stops
- [ ] Weather integration
- [ ] Route optimization
