import { appRoute } from '@genkit-ai/next';
import { fiestronChatFlow } from '@/ai/chatbot-flow';

export const POST = appRoute(fiestronChatFlow);