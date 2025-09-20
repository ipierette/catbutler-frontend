// Componente simples para otimizar imagens de avatar
// Usando imagens otimizadas da pasta public
const axelImg = '/images/axel.webp';
const frajonildaImg = '/images/frajonilda.webp';
const misscatImg = '/images/misscat.webp';
const oliverImg = '/images/oliver.webp';
const catianGoghImg = '/images/avatar-especial-1-optimized.png';

export const avatarImages = {
  axel: axelImg,
  frajonilda: frajonildaImg,
  misscat: misscatImg,
  oliver: oliverImg,
  'catian-gogh': catianGoghImg
};

export const avatarList = [
  { id: 'axel', name: 'Axel', src: axelImg, unlocked: true },
  { id: 'frajonilda', name: 'Frajonilda', src: frajonildaImg, unlocked: true },
  { id: 'misscat', name: 'Miss Cat', src: misscatImg, unlocked: true },
  { id: 'oliver', name: 'Oliver', src: oliverImg, unlocked: true }
];

export const specialAvatarList = [
  { 
    id: 'catian-gogh', 
    name: 'Catian Gogh', 
    src: catianGoghImg, 
    unlocked: false,
    cost: 20,
    description: 'Avatar especial inspirado no famoso pintor Van Gogh',
    rarity: 'epic'
  }
];

// Lista completa de avatares (gratuitos + especiais)
export const allAvatars = [...avatarList, ...specialAvatarList];