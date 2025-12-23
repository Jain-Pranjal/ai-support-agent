# AI Support Agent

An intelligent AI-powered customer support agent built for e-commerce businesses. The system handles customer queries about returns, shipping, products, refunds, and policies with real-time streaming responses.

##  Features

- **Real-time AI Responses**: Streaming responses using Google Gemini AI for natural conversation flow
- **User Authentication**: GitHub OAuth integration via Better Auth
- **Multi-session Chat**: Organize conversations across different chat sessions
- **Persistent Storage**: PostgreSQL database with Drizzle ORM
- **Type-safe APIs**: Full type safety with tRPC
- **Modern UI**: Responsive design with Tailwind CSS and shadcn/ui components
- **Markdown Support**: Formatted AI responses with code highlighting

##  Prerequisites

- Node.js 18+ installed
- PNPM 9+ package manager
- PostgreSQL database (recommend [Neon](https://neon.tech) for serverless Postgres)
- Google Gemini API key (free tier available)
- GitHub OAuth App credentials

##  Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Jain-Pranjal/ai-support-agent
cd ai-support-agent
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and copy the `.env.sample` contents into it. Update the values as needed


### Getting API Keys:

**Google Gemini API:**

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" and create a new key
4. Copy the key to `GEMINI_API_KEY`

**GitHub OAuth:**

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Set Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to your `.env`

### 4. Set Up Database

#### Generate and Run Migrations

```bash
# Generate migration files from schema
pnpm drizzle-kit generate

# Apply migrations to database
pnpm drizzle-kit migrate

# or if you want to directly push schema without generating migration files
pnpm drizzle-kit push
```

### 5. Run Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Architecture Overview

### Backend Architecture

The backend follows a **modular architecture** with clear separation of concerns:

#### 1. **Module-based Organization**

- Each feature (auth, chat, landing) is a self-contained module
- Modules have `server/` (business logic) and `ui/` (components) folders
- Promotes code organization and scalability

#### 2. **API Layer (tRPC)**

- **Type-safe APIs** - Full TypeScript type inference from server to client
- **Routers**: `authRouter`, `chatRouter`, `messageRouter`
- **Procedures**: Queries (read) and Mutations (write)
- **Middleware**: Authentication checks via Better Auth

#### 3. **Database Layer (Drizzle ORM)**

- Schema-first approach with TypeScript definitions
- Type-safe query builder
- Automatic migrations generation
- Tables: `user`, `session`, `account`, `verification`, `chatSession`, `message`

#### 4. **Authentication (Better Auth)**

- GitHub OAuth provider
- Session management with cookies
- Server and client utilities

#### 5. **AI Integration**

- **Dual functions**:
    - `AiChatSupport()` - Non-streaming for simple responses
    - `AiChatSupportStream()` - Generator function for real-time streaming
- **Error handling** - Graceful fallbacks for API issues

#### 6. **Streaming Architecture**

- **Custom SSE endpoint** at `/api/chat/stream`
- **Axios with `onDownloadProgress`** for progressive chunk handling

### Key Design Decisions

1. **Server-Sent Events over WebSockets**
    - Simpler infrastructure (no WebSocket adapter needed)
    - Works with standard HTTP
    - Perfect for one-way streaming from server to client

2. **Custom API Route for Streaming**
    - tRPC subscriptions require WebSocket configuration
    - Custom Next.js API route provides cleaner implementation
    - Better control over streaming behavior

3. **Module Separation**
    - Landing page completely separate from app logic
    - Easy to add new features as modules
    - Clear boundaries between concerns

## 🤖 LLM Configuration

### Provider: Google Gemini AI

I am using **Google Gemini** (`gemini-2.5-flash-lite`) for the following reasons:

- **Free tier available** - No credit card required for development
- **Fast response times** - Optimized for real-time chat
- **Good quality** - Balanced performance and cost
- **Streaming support** - Native support for progressive responses

### Model Configuration

```typescript
{
  model: 'gemini-2.5-flash-lite',
  config: {
    systemInstruction: promptFromFile,
    maxOutputTokens: 1000,
    temperature: 0.7
  }
}
```
For the prompt, the system instruction is loaded from a separate file (`src/lib/prompt.md`) containing few-shot examples and guidelines for customer support interactions.

##  License

[MIT License](LICENSE)