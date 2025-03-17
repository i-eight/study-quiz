# Technical Context: Study Quiz App

## Technology Stack

### Frontend

- **Next.js**: React framework for server-rendered applications
- **React**: JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework for styling

### Backend

- **Next.js API Routes**: Serverless functions for backend logic
- **Google Cloud Vision API**: For extracting text from images
- **OpenAI API**: For generating quiz questions based on extracted text

### Infrastructure

- **Docker**: For containerizing the application
- **GitHub Actions**: For CI/CD pipeline
- **Google Cloud Run**: For serverless container deployment
- **Google Artifact Registry**: For storing Docker images

## Development Environment

- **Node.js**: JavaScript runtime
- **npm**: Package manager
- **TypeScript**: Typed superset of JavaScript
- **ESLint**: For code linting
- **Prettier**: For code formatting

## Dependencies

- **@google-cloud/vision**: Client library for Google Cloud Vision API
- **graphai**: Framework for AI agent workflows
- **dotenv**: For loading environment variables
- **yaml**: For parsing YAML files

## Technical Constraints

- **API Rate Limits**: Both Google Cloud Vision and OpenAI APIs have rate limits
- **Stateless Architecture**: Cloud Run instances are ephemeral and stateless
- **Cold Start**: Serverless functions may experience cold start latency
- **Image Size**: Large images may impact performance and API costs
- **Browser Compatibility**: Camera API support varies across browsers

## Environment Variables

- **OPENAI_API_KEY**: Required for OpenAI API access
- **GOOGLE_CLOUD_QUOTA_PROJECT**: Required for Google Cloud Vision API access

## Deployment Configuration

- **Dockerfile**: Multi-stage build for optimized container size
- **GitHub Actions Workflow**: Automated deployment to Google Cloud Run
- **Cloud Run Configuration**: Environment variables, memory allocation, and scaling settings

## Security Considerations

- API keys stored as GitHub Secrets
- Environment variables for sensitive configuration
- No persistent storage of user data
- HTTPS for all communications
