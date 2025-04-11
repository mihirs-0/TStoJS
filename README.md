# JSON Constructor Agent

A Next.js application that helps users construct JSON objects through a conversational AI interface.

## Project Overview

This project aims to simplify the process of creating complex JSON objects by providing an intuitive chat interface where users can describe their desired JSON structure in natural language. The AI agent then helps construct the JSON object according to the user's specifications.

## Architecture

### Frontend
- **Next.js 14**: The application is built using Next.js 14 with App Router
- **React 18**: For building the user interface
- **Ant Design**: For UI components and styling
- **Client Components**:
  - `AgentPageClient`: Main page component for the JSON construction interface
  - `ChatUIClient`: Handles the chat interface and message display
  - `JsonViewerClient`: Displays and allows editing of the constructed JSON

### Backend
- **Next.js API Routes**: Handles API requests
- **MongoDB**: For storing conversation history and user data
- **Services**:
  - `AgentService`: Manages the AI agent's logic and responses
  - `MongoDB Service`: Handles database operations
  - `Entity Services`: Manage data models and business logic

### AI Integration
- **OpenAI API**: For natural language processing and JSON construction
- **Anthropic API**: Alternative AI provider for enhanced capabilities

## Key Features
1. **Natural Language Interface**: Users can describe their desired JSON structure in plain English
2. **Real-time JSON Construction**: The AI agent helps build JSON objects step by step
3. **Interactive JSON Editor**: Users can directly edit the constructed JSON
4. **Conversation History**: Previous interactions are saved for context
5. **Multiple AI Providers**: Support for both OpenAI and Anthropic APIs

## Project Structure
```
src/
├── app/                    # Next.js app router pages
│   ├── agent/             # JSON construction interface
│   └── api/               # API routes
├── services/              # Business logic and data services
│   ├── agent/            # AI agent service
│   ├── mongo/            # MongoDB service
│   └── ent/              # Entity services
└── webpages/             # React components
    └── agent/            # Agent page components
        ├── ChatUI/       # Chat interface components
        └── InterfaceInput/ # JSON input components
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your API keys:
   ```
   OPENAI_API_KEY=your_openai_key
   ANTHROPIC_API_KEY=your_anthropic_key
   CUSTOMCONNSTR_MONGODB_URI=your_mongodb_uri
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development Status
- [x] Basic chat interface
- [x] JSON construction logic
- [x] MongoDB integration
- [x] Multiple AI provider support
- [ ] User authentication
- [ ] Advanced JSON validation
- [ ] Template system for common JSON structures

## Contributing
Feel free to submit issues and enhancement requests!

## License
This project is licensed under the MIT License.
