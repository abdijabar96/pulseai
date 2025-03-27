import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error(
    'Missing Gemini API key. Please add VITE_GEMINI_API_KEY to your .env file.'
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

// Cache for storing recent analysis results
const analysisCache = new Map<string, { result: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function analyzePlant(imageData: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const base64Data = imageData.split(';base64,').pop();
    if (!base64Data) {
      throw new Error('Invalid image data format');
    }

    const cacheKey = `plant-${base64Data.substring(0, 100)}`;
    const cachedResult = analysisCache.get(cacheKey);
    
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
      return cachedResult.result;
    }

    const prompt = `As a veterinary botanist, analyze this plant image and provide detailed information about its safety for pets. Include:

1. Plant Identification
   - Common and scientific names
   - Key identifying features
   - Typical growing conditions

2. Pet Safety Assessment
   - Toxicity level for dogs and cats
   - Specific toxic compounds
   - Affected body systems
   - Symptoms if ingested

3. Risk Level
   - Overall danger rating
   - Parts that are most toxic
   - Whether toxicity varies by season
   - Common exposure scenarios

4. Safety Recommendations
   - Whether to remove the plant
   - Safe alternatives if toxic
   - Prevention strategies
   - Emergency steps if ingested

Format the response in clear sections with specific, actionable advice for pet owners.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    analysisCache.set(cacheKey, { result: text, timestamp: Date.now() });
    
    return text;
  } catch (error) {
    console.error('Error analyzing plant:', error);
    throw error;
  }
}

export async function generateTreatRecipe(ingredients: string[]): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const ingredientsList = ingredients.join(', ');
    const cacheKey = `recipe-${ingredientsList}`;
    const cachedResult = analysisCache.get(cacheKey);
    
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
      return cachedResult.result;
    }

    const prompt = `As a pet nutritionist and treat expert, create a safe and healthy homemade pet treat recipe using some or all of these ingredients: ${ingredientsList}. Structure the response as follows:

1. Recipe Overview
   - Name of treat
   - Difficulty level
   - Preparation time
   - Shelf life
   - Suitable for (dogs/cats/both)

2. Nutritional Benefits
   - Key nutrients provided
   - Health benefits
   - Any dietary considerations

3. Ingredients List
   - Quantities in standard measurements
   - Possible substitutions
   - Ingredients to avoid

4. Instructions
   - Step-by-step preparation
   - Cooking/baking details
   - Storage recommendations

5. Safety Notes
   - Portion size guidelines
   - Any restrictions
   - Signs of allergic reactions

Ensure all ingredients and preparations are safe for pets. Avoid harmful ingredients like xylitol, chocolate, raisins, etc.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    analysisCache.set(cacheKey, { result: text, timestamp: Date.now() });
    
    return text;
  } catch (error) {
    console.error('Error generating treat recipe:', error);
    throw error;
  }
}

export async function analyzePetMedia(mediaData: string, isVideo: boolean): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const base64Data = mediaData.split(';base64,').pop();
    if (!base64Data) {
      throw new Error('Invalid media data format');
    }

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
          mimeType: isVideo ? "video/mp4" : "image/jpeg",
          data: base64Data
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    analysisCache.set(cacheKey, { result: text, timestamp: Date.now() });
    
    return text;
  } catch (error) {
    console.error('Error analyzing media:', error);
    throw error;
  }
}

export async function analyzePetAudio(audioData: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const base64Data = audioData.split(';base64,').pop();
    if (!base64Data) {
      throw new Error('Invalid audio data format');
    }

    const cacheKey = `audio-${base64Data.substring(0, 100)}`;
    const cachedResult = analysisCache.get(cacheKey);
    
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
      return cachedResult.result;
    }

    const prompt = `As an expert in pet vocalization analysis, analyze this audio recording and provide insights about:

1. Sound Analysis
   - Type of vocalization (bark, meow, whine, etc.)
   - Pitch and intensity
   - Pattern and frequency
   - Duration of sounds

2. Emotional Assessment
   - Primary emotion indicated
   - Level of distress or contentment
   - Urgency of the communication
   - Context clues in the sound

3. Behavioral Context
   - Likely reasons for this vocalization
   - Whether this is normal or concerning
   - Potential triggers
   - Communication intent

4. Recommendations
   - How to respond to this vocalization
   - Environmental adjustments if needed
   - When to seek professional help
   - Training suggestions if relevant

Provide clear, actionable insights that help owners understand and respond to their pet's vocalizations.`;

    const result = await model.generateContent([prompt, base64Data]);
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
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
    
    analysisCache.set(cacheKey, { result: text, timestamp: Date.now() });
    
    return text;
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw error;
  }
}

export async function getFirstAidGuidance(emergency: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
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

export async function analyzeLocation(location: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const cacheKey = `location-${location.toLowerCase().trim()}`;
    const cachedResult = analysisCache.get(cacheKey);
    
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
      return cachedResult.result;
    }

    const prompt = `As a pet-friendly travel expert, analyze this location and provide detailed insights for pet owners planning to visit or travel with their pets. Structure the response as follows:

1. Pet-Friendly Overview
   - General assessment of pet-friendliness
   - Climate considerations for pets
   - Common pet restrictions or regulations
   - Overall walkability and outdoor access

2. Accommodation Tips
   - Types of pet-friendly lodging available
   - Typical pet policies and fees
   - Recommended areas to stay
   - Essential amenities for pet owners

3. Activities & Attractions
   - Pet-friendly outdoor spaces
   - Indoor activities during bad weather
   - Popular pet-friendly establishments
   - Unique experiences for pets

4. Travel Considerations
   - Transportation options with pets
   - Required documentation
   - Emergency vet locations
   - Seasonal considerations

5. Local Resources
   - Pet supply stores
   - Pet-friendly restaurants
   - Pet daycare/boarding options
   - Local pet communities

Provide practical, actionable information that helps pet owners plan their visit and make the most of the area with their pets.

Analyze this location: ${location}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    analysisCache.set(cacheKey, { result: text, timestamp: Date.now() });
    
    return text;
  } catch (error) {
    console.error('Error analyzing location:', error);
    throw error;
  }
}

export async function generateMemorial(petInfo: {
  name: string;
  species: string;
  years: number;
  description: string;
}): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const cacheKey = `memorial-${JSON.stringify(petInfo)}`;
    const cachedResult = analysisCache.get(cacheKey);
    
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
      return cachedResult.result;
    }

    const prompt = `As a compassionate pet memorial writer, create a heartfelt tribute for ${petInfo.name}, a beloved ${petInfo.species} who shared ${petInfo.years} years of love and joy. Use this description as inspiration: "${petInfo.description}"

Create a memorial that includes:

1. A Loving Tribute
   - Celebrate their unique personality
   - Highlight special memories
   - Describe their impact on their family
   - Honor their legacy

2. Special Characteristics
   - Unique traits and behaviors
   - Favorite activities and toys
   - Special bonds with family members
   - Memorable moments

3. Words of Comfort
   - Acknowledge the grief
   - Offer gentle perspective
   - Share wisdom about pet loss
   - Honor the healing process

4. Lasting Legacy
   - Ways to remember them
   - Their lasting impact
   - Lessons they taught
   - Their continuing influence

Write with warmth, empathy, and understanding, celebrating the special bond between pets and their families.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    analysisCache.set(cacheKey, { result: text, timestamp: Date.now() });
    
    return text;
  } catch (error) {
    console.error('Error generating memorial:', error);
    throw error;
  }
}

export async function analyzeGrowthData(data: {
  age: number;
  weight: number;
  height?: number;
  breed: string;
  species: 'dog' | 'cat';
}): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const cacheKey = `growth-${JSON.stringify(data)}`;
    const cachedResult = analysisCache.get(cacheKey);
    
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
      return cachedResult.result;
    }

    const prompt = `As a veterinary growth specialist, analyze this ${data.species}'s growth data and provide insights. The pet is a ${data.breed}, ${data.age} months old, weighing ${data.weight}kg${data.height ? ` and ${data.height}cm tall` : ''}.

Provide analysis in these sections:

1. Growth Assessment
   - Current size compared to breed standards
   - Growth rate evaluation
   - Projected adult size
   - Key growth milestones

2. Health Indicators
   - Weight status (underweight/healthy/overweight)
   - Body condition recommendations
   - Growth pattern concerns if any
   - Nutritional considerations

3. Breed-Specific Insights
   - Typical growth patterns
   - Breed-specific health considerations
   - Common growth challenges
   - Development timeline

4. Recommendations
   - Dietary adjustments if needed
   - Exercise guidelines
   - Health monitoring tips
   - When to check with vet

Provide specific, actionable advice while considering breed-specific factors and growth patterns.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    analysisCache.set(cacheKey, { result: text, timestamp: Date.now() });
    
    return text;
  } catch (error) {
    console.error('Error analyzing growth data:', error);
    throw error;
  }
}

export async function analyzePetHealth(data: any): Promise<{
  prediction: string;
  risks: string[];
  recommendations: string[];
  severity: string;
}> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const cacheKey = `health-${JSON.stringify(data)}`;
    const cachedResult = analysisCache.get(cacheKey);
    
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
      return cachedResult.result as any;
    }

    const prompt = `As a veterinary AI assistant, analyze this comprehensive pet health data and provide detailed insights and predictions. The data includes:

${JSON.stringify(data, null, 2)}

Provide a thorough analysis covering:

1. Current Health Status
   - Overall health assessment
   - Key health indicators
   - Areas of concern
   - Positive health factors

2. Risk Assessment
   - Potential health risks based on data
   - Breed-specific concerns
   - Age-related considerations
   - Environmental factors

3. Preventive Recommendations
   - Lifestyle adjustments
   - Dietary considerations
   - Exercise modifications
   - Environmental changes

4. Monitoring Guidelines
   - Key metrics to track
   - Warning signs to watch
   - Recommended check-up schedule
   - When to seek veterinary care

Format the response to include:
- A detailed prediction narrative
- A list of specific risk factors
- A list of actionable recommendations
- A severity assessment (Low, Moderate, High)

Remember to emphasize that this is an AI-assisted analysis and does not replace professional veterinary care.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response into structured data
    const sections = text.split('\n\n');
    const prediction = sections[0];
    const risks = sections[1].split('\n').filter(line => line.startsWith('-')).map(line => line.slice(2));
    const recommendations = sections[2].split('\n').filter(line => line.startsWith('-')).map(line => line.slice(2));
    const severity = sections[3].toLowerCase().includes('high') ? 'High' :
                    sections[3].toLowerCase().includes('moderate') ? 'Moderate' : 'Low';

    const structuredResult = {
      prediction,
      risks,
      recommendations,
      severity
    };
    
    analysisCache.set(cacheKey, { result: structuredResult, timestamp: Date.now() });
    
    return structuredResult;
  } catch (error) {
    console.error('Error analyzing pet health:', error);
    throw error;
  }
}