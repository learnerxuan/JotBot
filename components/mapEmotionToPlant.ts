export interface PlantVisualConfig {
  color: string;
  shape: string;
  animation: string;
}

export function mapEmotionToPlant(emotion: string, intensity: number): PlantVisualConfig {
  switch (emotion) {
    case 'joy':
      return {
        color: `hsl(50, 95%, ${80 - intensity * 20}%)`, // bright yellow, more intense = deeper
        shape: 'bloom',
        animation: 'gentle',
      };
    case 'calm':
      return {
        color: `hsl(120, 60%, ${85 - intensity * 15}%)`, // soft green
        shape: 'sprout',
        animation: 'sway',
      };
    case 'stress':
      return {
        color: `hsl(30, 20%, ${70 - intensity * 30}%)`, // dull brown
        shape: 'wilt',
        animation: 'shake',
      };
    case 'sadness':
      return {
        color: `hsl(210, 70%, ${80 - intensity * 30}%)`, // blue tint
        shape: 'droop',
        animation: 'drop',
      };
    case 'anger':
      return {
        color: `hsl(0, 80%, ${65 - intensity * 20}%)`, // red accents
        shape: 'cactus',
        animation: 'pulse',
      };
    default:
      return {
        color: 'hsl(120, 20%, 80%)', // fallback green
        shape: 'default',
        animation: 'none',
      };
  }
} 