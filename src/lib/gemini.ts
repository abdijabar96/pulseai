import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Cache for storing recent analysis results
const analysisCache = new Map<string, { result: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function analyzePetMedia(mediaData: string, isVideo: boolean): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const base64Data = mediaData.split(';base64,').pop();
    if (!base64Data) {
      throw new Error('Invalid media data format');
    }

    // Generate a cache key based on the first 100 characters of the base64 data
    const cacheKey = `media-${base64Data.substring(0, 100)}`;
    const cachedResult = analysisCache.get(cacheKey);
    
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
      return cachedResult.result;
    }
    
    const prompt = `Analyze this pet ${isVideo ? 'video' : 'photo'} and provide a comprehensive analysis in clear, plain text without any special formatting or markdown characters. Focus on:

1. Emotional State & Mood
   - Facial expressions (relaxed vs. tense)
   - Body posture and positioning
   - Eye contact and blinking patterns
   - Overall emotional indicators
   - Stress or comfort signals
   ${isVideo ? '- Changes in behavior over time\n   - Vocalizations and sounds' : ''}

2. Physical Health Assessment
   - Visible health issues or concerns
   - Coat and skin condition
   - Weight and body condition
   - Any visible injuries or abnormalities
   ${isVideo ? '- Movement patterns and gait\n   - Energy levels' : ''}

3. Environmental Analysis
   - Potential hazards or stressors in the environment
   - Comfort level in current surroundings
   - Interaction with environment
   ${isVideo ? '- Response to environmental changes\n   - Social interactions if present' : ''}

4. Recommendations
   - Suggestions for improving emotional well-being
   - Health-related recommendations
   - Environmental adjustments if needed
   ${isVideo ? '- Behavioral training suggestions if applicable' : ''}

Format the response in clear sections with descriptive headings. Provide specific observations and actionable recommendations. Keep the tone informative but approachable.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: isVideo ? "video/webm" : "image/jpeg",
          data: base64Data
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Cache the result
    analysisCache.set(cacheKey, { result: text, timestamp: Date.now() });
    
    return text;
  } catch (error) {
    console.error('Error analyzing media:', error);
    throw error;
  }
}

export async function analyzePetAudio(audioData: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const base64Data = audioData.split(';base64,').pop();
    if (!base64Data) {
      throw new Error('Invalid audio data format');
    }

    const cacheKey = `audio-${base64Data.substring(0, 100)}`;
    const cachedResult = analysisCache.get(cacheKey);
    
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
      return cachedResult.result;
    }

    const prompt = `You are an AI that analyzes pet audio and determines what the pet is feeling. To analyze pet sounds, consider:

Dogs:
- High-pitched, short barks: Can indicate excitement, playfulness, or alertness
- Low-pitched, growling barks: May signal a threat, warning, or defensiveness
- Repetitive, high-pitched barks: Could be a sign of distress or fear
- Sharp, repetitive barks: Can mean wanting something, like a treat or attention
- Barking and stopping patterns: Might mean the dog is feeling lonely
- Whining: Can indicate seeking attention, appeasement, or distress
- Howling: Can be a response to sirens, music, or locating others
- Growling: A low-pitched, rumbling sound indicating warning or threat
- Panting: Usually indicates exertion, stress, overheating, excitement or relaxation
- Whimpering: Can signal pain, sadness, anxiety, or desire for attention

Cats:
- Meowing: Can indicate need for attention, food, or going outside
- Hissing: Shows fear or aggression
- Purring: Usually contentment but can indicate pain/stress
- Yawning: Can show boredom, relaxation, or stress
- Spitting: Shows annoyance or discomfort

Analyze the provided audio and explain:
1. What type of sounds you hear (pitch, duration, frequency)
2. The likely emotional state of the pet
3. Any recommendations based on the analysis

Keep the response clear and actionable for pet owners.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "audio/wav",
          data: base64Data
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    analysisCache.set(cacheKey, { result: text, timestamp: Date.now() });
    
    return text;
  } catch (error) {
    console.error('Error analyzing audio:', error);
    throw error;
  }
}

export async function analyzePetSymptoms(symptoms: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Generate a cache key based on the symptoms
    const cacheKey = `symptoms-${symptoms.toLowerCase().trim()}`;
    const cachedResult = analysisCache.get(cacheKey);
    
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
      return cachedResult.result;
    }

    const prompt = `As a veterinary AI assistant, analyze these pet symptoms and provide a preliminary assessment. The response should be structured as follows:

1. Possible Conditions
   - List potential conditions that match the symptoms
   - Order from most to least likely
   - Include brief explanations for each

2. Severity Assessment
   - Indicate urgency level (Emergency, Urgent, Non-urgent)
   - Explain why this urgency level was chosen
   - List any red flags that require immediate attention

3. Recommendations
   - Immediate care steps owners can take
   - Whether veterinary care is needed and how soon
   - Preventive measures to avoid worsening

4. Important Notes
   - Any crucial warnings or considerations
   - Symptoms to watch for that would indicate worsening
   - When to seek emergency care

Remember this is a preliminary assessment only. Always recommend consulting with a veterinarian for proper diagnosis and treatment.

Analyze these symptoms: ${symptoms}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Cache the result
    analysisCache.set(cacheKey, { result: text, timestamp: Date.now() });
    
    return text;
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw error;
  }
}

export async function getFirstAidGuidance(emergency: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const cacheKey = `firstaid-${emergency.toLowerCase().trim()}`;
    const cachedResult = analysisCache.get(cacheKey);
    
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
      return cachedResult.result;
    }

    const prompt = `As a veterinary first aid expert, provide clear, step-by-step emergency guidance for the following pet emergency situation. Structure the response as follows:

1. Initial Assessment
   - Immediate danger signs to check
   - Quick vital signs to monitor
   - Signs that indicate severity

2. Emergency Steps
   - Numbered, clear steps to take immediately
   - What to do while waiting for veterinary care
   - What NOT to do (common mistakes)

3. When to Seek Emergency Care
   - Clear indicators for emergency vet visit
   - Signs of worsening condition
   - Maximum wait time before professional care

4. Prevention Tips
   - How to prevent similar situations
   - Warning signs to watch for
   - Preparation recommendations

IMPORTANT: Always emphasize that this is first aid guidance only and does not replace professional veterinary care.

Emergency situation: ${emergency}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    analysisCache.set(cacheKey, { result: text, timestamp: Date.now() });
    
    return text;
  } catch (error) {
    console.error('Error getting first aid guidance:', error);
    throw error;
  }
}

export async function analyzeBehavior(behavior: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const cacheKey = `behavior-${behavior.toLowerCase().trim()}`;
    const cachedResult = analysisCache.get(cacheKey);
    
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
      return cachedResult.result;
    }

    const prompt = `As a professional pet behaviorist, analyze this behavioral issue and provide detailed training guidance. Structure the response as follows:

1. Behavior Analysis
   - Root causes of the behavior
   - Common triggers and patterns
   - Impact on pet's well-being
   - Environmental factors

2. Training Plan
   - Step-by-step training exercises
   - Positive reinforcement techniques
   - Timeline for improvement
   - Required tools or resources

3. Prevention Strategies
   - Environmental modifications
   - Daily routine adjustments
   - Alternative behaviors to encourage
   - Management techniques

4. Progress Tracking
   - Success indicators
   - Milestones to monitor
   - When to adjust the approach
   - Signs of improvement

Remember to emphasize positive reinforcement and force-free training methods. For serious behavioral issues, always recommend consulting with a professional trainer or behaviorist.

Analyze this behavior: ${behavior}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    analysisCache.set(cacheKey, { result: text, timestamp: Date.now() });
    
    return text;
  } catch (error) {
    console.error('Error analyzing behavior:', error);
    throw error;
  }
}