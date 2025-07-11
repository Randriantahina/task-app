import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateTaskAssignment(
  tasks: string[],
  persons: string[]
) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const prompt = `
  Tu es un assistant qui aide à répartir des tâches dans un foyer. Voici les tâches à effectuer avec le nombre de personnes requis :
  - Balcon, Escalier, Couloir, Toilettes : 1 personne chacune
  - Dressing, Douche : 2 personnes chacune
  - Salle d'info, Cuisine : 3 personnes chacune
  
  Voici les tâches sélectionnées : ${tasks.join(', ')}
  Voici les personnes disponibles : ${persons.join(', ')}
  
  Répartis équitablement les personnes sur les tâches en respectant le nombre requis. Si le nombre de personnes est insuffisant, fais au mieux en précisant dans le résultat que l'effectif est incomplet. Réponds clairement sous forme de liste comme :
  
  - Balcon : Julie
  - Douche : Linda, Fety
  - Cuisine : Murphy, Patricia, Christinah
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
