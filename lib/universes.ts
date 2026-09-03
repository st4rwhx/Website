export type Universe = {
  id: string;
  emoji: string;
  label: string;
  /** Thème transmis tel quel à la génération IA. */
  theme: string;
};

export const UNIVERSES: Universe[] = [
  { id: "pirates", emoji: "🏴‍☠️", label: "Pirates", theme: "une chasse au trésor entre pirates" },
  { id: "espace", emoji: "🚀", label: "Espace", theme: "un voyage parmi les étoiles et les planètes" },
  { id: "magie", emoji: "🪄", label: "Magie", theme: "une école de petits sorciers et sorcières" },
  { id: "dinosaures", emoji: "🦕", label: "Dinosaures", theme: "une aventure au temps des dinosaures" },
  { id: "ocean", emoji: "🐠", label: "Océan", theme: "une exploration sous-marine avec les créatures de l'océan" },
  { id: "foret", emoji: "🦉", label: "Forêt enchantée", theme: "une forêt enchantée peuplée d'animaux qui parlent" },
  { id: "super-heros", emoji: "🦸", label: "Super-héros", theme: "une mission de super-héros pour aider les autres" },
  { id: "ferme", emoji: "🐮", label: "Ferme", theme: "une journée à la ferme avec les animaux" },
  { id: "coucher", emoji: "🌙", label: "L'heure du coucher", theme: "l'heure du coucher" },
  { id: "partage", emoji: "🤝", label: "Le partage", theme: "le partage avec les autres" },
  { id: "rentree", emoji: "🎒", label: "La rentrée", theme: "la rentrée des classes" },
  { id: "anniversaire", emoji: "🎂", label: "Anniversaire", theme: "un anniversaire surprise" },
  { id: "peur-du-noir", emoji: "🌒", label: "Peur du noir", theme: "apprivoiser la peur du noir" },
  { id: "nouveau-bebe", emoji: "👶", label: "Nouveau petit frère/sœur", theme: "l'arrivée d'un nouveau petit frère ou d'une petite sœur" },
  { id: "amitie", emoji: "💛", label: "L'amitié", theme: "l'amitié et se faire de nouveaux amis" },
];
