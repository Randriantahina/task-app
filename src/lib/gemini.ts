import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateTaskAssignment(
  tasks: string[],
  persons: string[]
) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const prompt = `
Tu es un assistant chargé de répartir des tâches dans un foyer, avec des contraintes précises sur le nombre de personnes nécessaires par tâche.

Règles obligatoires :
- Chaque tâche doit être remplie avec le nombre exact de personnes demandé, même si cela nécessite que certaines personnes fassent plusieurs tâches.
- Ne laisse jamais une tâche vide.
- Si le nombre de personnes disponibles est insuffisant, redistribue équitablement et mentionne que certains font plusieurs tâches.

Tâches avec nombre de personnes requis :
- Balcon, Escalier, Couloir, Toilettes : 1 personne chacune
- Dressing, Douche : 2 personnes chacune
- Salle d'info, Cuisine : 3 personnes chacune

Voici les tâches sélectionnées : ${tasks.join(', ')}
Voici les personnes disponibles : ${persons.join(', ')}

Réponds exactement dans ce format (comme une liste propre) :
- Balcon : Murphy
- Douche : Stella, Michella
- Cuisine : Jeanelah, Noemy, Lindà

Si tu dois répartir plusieurs fois une personne, ne le précise pas. Juste affiche la liste comme si tout allait bien.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
