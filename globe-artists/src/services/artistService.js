import { artists as initialArtists } from '../data/artists';

// 从 localStorage 获取数据，如果没有则使用初始数据
const getArtists = () => {
  const stored = localStorage.getItem('artists');
  if (stored) {
    return JSON.parse(stored);
  }
  // 首次使用时，将初始数据保存到 localStorage
  localStorage.setItem('artists', JSON.stringify(initialArtists));
  return initialArtists;
};

// 保存所有艺术家数据
const saveArtists = (artists) => {
  localStorage.setItem('artists', JSON.stringify(artists));
};

// 添加新艺术家
const addArtist = (artist) => {
  const artists = getArtists();
  const newArtist = {
    ...artist,
    id: Math.max(...artists.map(d => d.id), 0) + 1,
    altitude: 0.1,
    radius: 0.35
  };
  const newArtists = [...artists, newArtist];
  saveArtists(newArtists);
  return newArtists;
};

// 更新艺术家
const updateArtist = (id, updatedData) => {
  const artists = getArtists();
  const newArtists = artists.map(artist =>
    artist.id === id ? { ...artist, ...updatedData } : artist
  );
  saveArtists(newArtists);
  return newArtists;
};

// 删除艺术家
const deleteArtist = (id) => {
  const artists = getArtists();
  const newArtists = artists.filter(artist => artist.id !== id);
  saveArtists(newArtists);
  return newArtists;
};

// 重置为初始数据
const resetToInitial = () => {
  localStorage.setItem('artists', JSON.stringify(initialArtists));
  return initialArtists;
};

export const artistService = {
  getArtists,
  addArtist,
  updateArtist,
  deleteArtist,
  resetToInitial
};
