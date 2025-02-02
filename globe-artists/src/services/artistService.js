import { artists as initialArtists } from '../data/artists';

class ArtistService {
  constructor() {
    this.artists = [...initialArtists];
  }

  getArtists() {
    return this.artists;
  }

  addArtist(artistData) {
    const newArtist = {
      ...artistData,
      id: Math.max(...this.artists.map(a => a.id)) + 1
    };
    this.artists.push(newArtist);
    return [...this.artists];
  }

  updateArtist(id, artistData) {
    const index = this.artists.findIndex(a => a.id === id);
    if (index !== -1) {
      this.artists[index] = { ...artistData, id };
    }
    return [...this.artists];
  }

  deleteArtist(id) {
    this.artists = this.artists.filter(a => a.id !== id);
    return [...this.artists];
  }
}

export const artistService = new ArtistService();
