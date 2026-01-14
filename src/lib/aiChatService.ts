import doctorsData from '@/data/doctors.json';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const SYSTEM_PROMPT = `You are HealthGem AI Assistant, a helpful healthcare appointment booking assistant.

## Your Capabilities:
1. Book Appointments - Help users schedule appointments with doctors
2. Find Doctors - Suggest doctors based on specialty
3. Check Availability - Show available time slots
4. Answer FAQs - Answer healthcare questions

## Available Doctors:
${doctorsData.doctors.map(d => `- ${d.name} (${d.specialty}) at ${d.clinic}`).join('\n')}

## Available Clinics:
- City Health Clinic
- Downtown Medical
- Wellness Center
- Senior Care Plus

## Time Slots (Mon-Sat):
09:00, 09:30, 10:00, 10:30, 11:00, 11:30, 12:00, 14:00, 14:30, 15:00, 15:30, 16:00, 16:30, 17:00

## Appointment Types:
- Consultation, Follow-up, Check-up, Surgery

Be concise, helpful, and professional. Keep responses under 100 words.`;

class AIChatService {
    private conversationHistory: { role: string; content: string }[] = [];

    async sendMessage(userMessage: string): Promise<string> {
        const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;

        if (!apiKey) {
            return '❌ Please add VITE_HUGGINGFACE_API_KEY to your .env file';
        }

        try {
            // Build conversation context
            this.conversationHistory.push({ role: 'user', content: userMessage });

            // Create prompt with context
            const prompt = this.conversationHistory.length === 1
                ? `${SYSTEM_PROMPT}\n\nUser: ${userMessage}\nAssistant:`
                : `User: ${userMessage}\nAssistant:`;

            const response = await fetch(
                'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        inputs: prompt,
                        parameters: {
                            max_new_tokens: 150,
                            temperature: 0.7,
                            return_full_text: false,
                        },
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('HuggingFace API Error:', errorData);

                if (response.status === 503) {
                    // Model is loading, use fallback response
                    return this.getFallbackResponse(userMessage);
                }

                throw new Error(errorData.error || `API Error: ${response.status}`);
            }

            const data = await response.json();
            let aiResponse = '';

            if (Array.isArray(data) && data[0]?.generated_text) {
                aiResponse = data[0].generated_text.trim();
            } else if (data.generated_text) {
                aiResponse = data.generated_text.trim();
            } else {
                // Fallback to smart response
                aiResponse = this.getFallbackResponse(userMessage);
            }

            this.conversationHistory.push({ role: 'assistant', content: aiResponse });

            // Keep history short
            if (this.conversationHistory.length > 10) {
                this.conversationHistory = this.conversationHistory.slice(-10);
            }

            return aiResponse;
        } catch (error: any) {
            console.error('AI Chat Error:', error);

            // Return smart fallback response instead of error
            return this.getFallbackResponse(userMessage);
        }
    }

    private getFallbackResponse(userMessage: string): string {
        const msg = userMessage.toLowerCase();

        // Doctor queries
        if (msg.includes('doctor') || msg.includes('specialist') || msg.includes('cardio') || msg.includes('pediatric')) {
            const specialty = msg.includes('cardio') ? 'Cardiology' :
                msg.includes('pediatric') ? 'Pediatrics' :
                    msg.includes('ortho') ? 'Orthopedics' :
                        msg.includes('derma') ? 'Dermatology' :
                            msg.includes('neuro') ? 'Neurology' : null;

            if (specialty) {
                const doctor = doctorsData.doctors.find(d => d.specialty === specialty && d.status === 'Active');
                if (doctor) {
                    return `For ${specialty}, I recommend **${doctor.name}** at ${doctor.clinic}. They have ${doctor.patients} patients. Would you like to book an appointment?`;
                }
            }

            const activeDoctors = doctorsData.doctors.filter(d => d.status === 'Active').slice(0, 3);
            return `Here are our available doctors:\n${activeDoctors.map(d => `• **${d.name}** - ${d.specialty} at ${d.clinic}`).join('\n')}\n\nWhich specialty do you need?`;
        }

        // Booking queries
        if (msg.includes('book') || msg.includes('appointment') || msg.includes('schedule')) {
            return `I'd be happy to help you book an appointment! 📅\n\nPlease tell me:\n• Which doctor or specialty?\n• Preferred date?\n• Preferred time slot?\n\nOr I can show you available doctors first.`;
        }

        // Time/slot queries
        if (msg.includes('time') || msg.includes('slot') || msg.includes('available') || msg.includes('when')) {
            return `Our available time slots (Mon-Sat):\n\n**Morning:** 09:00, 09:30, 10:00, 10:30, 11:00, 11:30, 12:00\n**Afternoon:** 14:00, 14:30, 15:00, 15:30, 16:00, 16:30, 17:00\n\nWhich doctor would you like to see?`;
        }

        // Clinic queries
        if (msg.includes('clinic') || msg.includes('hospital') || msg.includes('location')) {
            return `Our clinics:\n• **City Health Clinic**\n• **Downtown Medical**\n• **Wellness Center**\n• **Senior Care Plus**\n\nAll clinics are open Mon-Sat, 9 AM to 5 PM.`;
        }

        // Greeting
        if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
            return `Hello! 👋 How can I help you today?\n\nI can assist with:\n• Booking appointments\n• Finding doctors by specialty\n• Checking available time slots`;
        }

        // Default
        return `I can help you with:\n\n• **Book Appointment** - "I want to book an appointment"\n• **Find Doctors** - "Show me cardiologists"\n• **Check Availability** - "What time slots are free?"\n\nWhat would you like to do?`;
    }

    clearHistory() {
        this.conversationHistory = [];
    }
}

export const aiChatService = new AIChatService();
