
export interface CharacterData {
  id: string;
  name: string;
  image: string;
  modelUrl: string;
  description: string;
  stats: {
    strength: number;
    speed: number;
    technique: number;
    magic: number;
  };
  color: string;
}

export const characters: CharacterData[] = [
  {
    id: 'pablo',
    name: 'Pablo Dev',
    image: './assets/Posters/Pablo.jpeg',
    modelUrl: './assets/Models/pablo.glb',
    description: 'A stealthy warrior who specializes in quick strikes and evasion.',
    stats: {
      strength: 7,
      speed: 9,
      technique: 8,
      magic: 3
    },
    color: '#8B5CF6'
  },
  {
    id: 'anajulia',
    name: 'Ana Julia',
    image: './assets/Posters/Anajulia.jpg',
    modelUrl: './assets/Models/anajulia.glb',
    description: 'A disciplined warrior with powerful strikes and unwavering honor.',
    stats: {
      strength: 8,
      speed: 6,
      technique: 9,
      magic: 4
    },
    color: '#EF4444'
  },
  {
    id: 'pietro',
    name: 'Pietro Travadão',
    image: './assets/Posters/Pietro.jpg',
    modelUrl: './assets/Models/pietro.glb',
    description: 'A master of the arcane arts with devastating magical abilities.',
    stats: {
      strength: 3,
      speed: 5,
      technique: 7,
      magic: 10
    },
    color: '#0EA5E9'
  },
  {
    id: 'velho',
    name: 'Victor Velho',
    image: './assets/Posters/Velho.jpg',
    modelUrl: './assets/Models/velho.glb',
    description: 'A heavily armored warrior specializing in defense and powerful weapons.',
    stats: {
      strength: 9,
      speed: 4,
      technique: 7,
      magic: 2
    },
    color: '#22C55E'
  },
  {
    id: 'babuino',
    name: 'babuinagem',
    image: './assets/Posters/babuino.jpg',
    modelUrl: './assets/Models/babuino.glb',
    description: 'A nimble fighter who strikes from the shadows with deadly precision.',
    stats: {
      strength: 6,
      speed: 10,
      technique: 8,
      magic: 2
    },
    color: '#F97316'
  },
  {
    id: 'resnatao',
    name: 'Resnatao Max',
    image: './assets/Posters/Resnatao.jpg',
    modelUrl: './assets/Models/resnatao.glb',
    description: 'A disciplined martial artist who harnesses inner chi for powerful techniques.',
    stats: {
      strength: 7,
      speed: 8,
      technique: 10,
      magic: 7
    },
    color: '#D946EF'
  },
  {
    id: 'luir',
    name: 'Luir Fernan',
    image: './assets/Posters/Luir.jpg',
    modelUrl: './assets/Models/luir.glb',
    description: 'A disciplined martial artist who harnesses inner chi for powerful techniques.',
    stats: {
      strength: 1,
      speed: 3,
      technique: 10,
      magic: 10
    },
    color: '#ccff12'
  }
];
