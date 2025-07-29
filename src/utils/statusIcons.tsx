import { Ionicons } from '@expo/vector-icons';

const statusIconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
  free: 'checkmark',
  busy: 'close',
  meeting: 'briefcase',
  sleeping: 'moon',
  custom: 'person',
  coffee: 'cafe',
  check: 'checkmark',
  times: 'close',
  briefcase: 'briefcase',
  moon: 'moon',
  user: 'person',
  heart: 'heart',
  smile: 'happy',
  zap: 'flash',
  star: 'star',
  music: 'musical-notes',
  book: 'book',
  car: 'car',
  plane: 'airplane',
  home: 'home',
  phone: 'call',
  'message-circle': 'chatbubble',
  camera: 'camera',
  'gamepad-2': 'game-controller',
  headphones: 'headset',
  laptop: 'laptop',
  clock: 'time',
  'map-pin': 'location',
  gift: 'gift',
  utensils: 'restaurant',
  dumbbell: 'fitness',
  'tree-pine': 'leaf',
  sun: 'sunny',
  'cloud-rain': 'rainy',
  flame: 'flame',
  snowflake: 'snow',
  umbrella: 'umbrella',
};

export function getStatusIcon(iconName: string) {
  const iconKey = statusIconMap[iconName] || 'person';
  return ({ size = 24, color = '#000' }) => (
    <Ionicons name={iconKey} size={size} color={color} />
  );
}