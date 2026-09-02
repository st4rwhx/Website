import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type ChildProfile = {
  name: string;
  age: number;
  gender?: string | null;
  personality: string;
  likes: string;
  dislikes?: string | null;
  favoriteCharacters?: string | null;
};

export type StoryRequest = {
  theme: string;
  moral?: string | null;
  length: "courte" | "moyenne" | "longue";
};

const LENGTH_GUIDANCE: Record<StoryRequest["length"], string> = {
  courte: "environ 300 mots, pour une histoire du soir rapide",
  moyenne: "environ 600 mots",
  longue: "environ 1000 mots, avec plusieurs petites péripéties",
};

export async function generateStory(child: ChildProfile, request: StoryRequest) {
  const systemPrompt = `Tu es un auteur d'histoires pour enfants, bienveillant et créatif.
Tu écris des histoires personnalisées, adaptées à l'âge de l'enfant, jamais effrayantes au point de faire de vrais cauchemars, sans violence explicite, sans contenu inapproprié.
Le ton est chaleureux, rassurant et plein d'imagination. Le vocabulaire est adapté à l'âge de l'enfant.
Réponds UNIQUEMENT avec un objet JSON valide de la forme {"title": string, "content": string}, sans texte autour, sans balises markdown.
Le champ "content" contient l'histoire complète en français, avec des paragraphes séparés par des sauts de ligne doubles.`;

  const userPrompt = `Écris une histoire personnalisée pour cet enfant :
- Prénom : ${child.name}
- Âge : ${child.age} ans
- Genre : ${child.gender ?? "non précisé"}
- Personnalité / caractère : ${child.personality}
- Ce qu'il/elle aime : ${child.likes}
- Ce qu'il/elle n'aime pas ou craint (à éviter ou à transformer positivement) : ${child.dislikes ?? "non précisé"}
- Personnages ou héros préférés (à intégrer si pertinent) : ${child.favoriteCharacters ?? "aucun en particulier"}

Thème demandé pour l'histoire : ${request.theme}
${request.moral ? `Morale ou leçon à faire passer subtilement : ${request.moral}` : ""}
Longueur souhaitée : ${LENGTH_GUIDANCE[request.length]}.

L'enfant, ${child.name}, doit être le héros ou l'héroïne de l'histoire. Utilise sa personnalité et ses goûts pour rendre l'histoire vraiment unique et personnelle.`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const block = message.content.find((b) => b.type === "text");
  const raw = block && block.type === "text" ? block.text : "{}";

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  const jsonText = jsonMatch ? jsonMatch[0] : raw;

  try {
    const parsed = JSON.parse(jsonText) as { title: string; content: string };
    return parsed;
  } catch {
    return { title: `L'histoire de ${child.name}`, content: raw };
  }
}
