const PIECE_IMAGES = {
  'alternateur': 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
  'demarreur': 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=400',
  'embrayage': 'https://images.pexels.com/photos/4488645/pexels-photo-4488645.jpeg?auto=compress&cs=tinysrgb&w=400',
  'frein': 'https://images.pexels.com/photos/65623/pexels-photo-65623.jpeg?auto=compress&cs=tinysrgb&w=400',
  'plaquette': 'https://images.pexels.com/photos/65623/pexels-photo-65623.jpeg?auto=compress&cs=tinysrgb&w=400',
  'disque': 'https://images.pexels.com/photos/65623/pexels-photo-65623.jpeg?auto=compress&cs=tinysrgb&w=400',
  'turbo': 'https://images.pexels.com/photos/7565170/pexels-photo-7565170.jpeg?auto=compress&cs=tinysrgb&w=400',
  'pompe': 'https://images.pexels.com/photos/11074558/pexels-photo-11074558.jpeg?auto=compress&cs=tinysrgb&w=400',
  'direction': 'https://images.pexels.com/photos/35827909/pexels-photo-35827909.jpeg?auto=compress&cs=tinysrgb&w=400',
  'moteur': 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
  'courroie': 'https://images.pexels.com/photos/4488645/pexels-photo-4488645.jpeg?auto=compress&cs=tinysrgb&w=400',
  'batterie': 'https://images.pexels.com/photos/924243/pexels-photo-924243.jpeg?auto=compress&cs=tinysrgb&w=400',
  'amortisseur': 'https://images.pexels.com/photos/2394/pexels-photo-2394.jpeg?auto=compress&cs=tinysrgb&w=400',
  'pont': 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=400',
  'arbre': 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
  'boitier': 'https://images.pexels.com/photos/35827909/pexels-photo-35827909.jpeg?auto=compress&cs=tinysrgb&w=400',
  'barre': 'https://images.pexels.com/photos/22240793/pexels-photo-22240793.jpeg?auto=compress&cs=tinysrgb&w=400',
  'dessicateur': 'https://images.pexels.com/photos/11074558/pexels-photo-11074558.jpeg?auto=compress&cs=tinysrgb&w=400',
  'default': 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=400'
};

export function getPieceImage(pieceName, originalUrl) {
  if (originalUrl && originalUrl.startsWith('http')) return originalUrl;
  const normalized = (pieceName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [keyword, url] of Object.entries(PIECE_IMAGES)) {
    if (normalized.includes(keyword)) return url;
  }
  return PIECE_IMAGES.default;
}
