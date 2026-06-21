import OpenAI from 'openai';

// Initialisation du client pour OpenRouter
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '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',
  defaultHeaders: {
    'HTTP-Referer': 'https://competency-cluster.com', // Optionnel (pour les stats OpenRouter)
    'X-Title': 'Competency Cluster',
  }
});

/**
 * Génère un quiz structuré au format JSON pour Competency Cluster
 * @param {string} theme - Le sujet ou sous-module ciblé (ex: "Les Hooks en React")
 * @param {number} numQuestions - Le nombre de questions souhaité
 * @returns {Promise<Object>} Le quiz sous forme d'objet JSON
 */
export async function generateQuiz(theme, numQuestions = 3) {
  const systemPrompt = `You are an expert educational assistant for the "Competency Cluster" platform. 
Your task is to generate a quiz about a specific sub-module theme.
You MUST respond with a single, valid JSON object following this schema exactly:
{
  "submoduleTitle": "Title of the theme",
  "description": "A short, engaging description of the quiz",
  "questions": [
    {
      "value": "The text of the question?",
      "level": "beginner" | "intermediate" | "advanced",
      "answers": [
        { "value": "Answer option 1", "isGoodAnswer": false },
        { "value": "Answer option 2 (correct)", "isGoodAnswer": true }
      ]
    }
  ]
}
Provide between 3 and 4 answer options per question. Ensure exactly one answer is marked as true (isGoodAnswer: true).`;

  const userPrompt = `Generate a quiz with ${numQuestions} questions about the following sub-module theme: "${theme}". The output must be in French.`;

try {
    const response = await openai.chat.completions.create({
      // 🟢 On change pour un modèle rapide, ultra-généreux en tokens et jamais saturé
      model: 'google/gemini-2.5-flash', 
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      // 🟢 Grosse enveloppe de tokens autorisée
      max_tokens: 4000 
    });

    // 1. Récupération de la réponse brute
    const rawJson = response.choices[0].message.content;

    // 2. Sécurité : Vérifier si rawJson est null ou vide
    if (!rawJson) {
      throw new Error("L'IA n'a renvoyé aucun contenu.");
    }

    // 3. TypeScript sait maintenant que rawJson est obligatoirement une string
    const quizData = JSON.parse(rawJson);
    
    return quizData;

  } catch (error) {
    console.error('Erreur lors de la génération du quiz:', error);
    throw error;
  }
}

// ==========================================
// EXEMPLE D'UTILISATION DU SCRIPT
// ==========================================
async function run() {
  console.log('Génération du quiz en cours...');
  
  const quiz = await generateQuiz('Les Hooks en React (useState, useEffect)', 3);
  
  console.log('\n--- QUIZ GÉNÉRÉ AVEC SÉCURITÉ ---');
  console.log(JSON.stringify(quiz, null, 2));
}

run();