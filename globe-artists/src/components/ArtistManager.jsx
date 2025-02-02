import React, { useState, useEffect } from 'react';
import { artistService } from '../services/artistService';
import './ArtistManager.css';

const ArtistManager = ({ defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artists, setArtists] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    country: '',
    lat: '',
    lng: '',
    style: '',
    specialties: ['', '', ''],
    avatar: '',
    color: '#000000',
    instagram: '',
    website: '',
    bio: '',
    awards: ['', '']
  });

  // 加载数据
  useEffect(() => {
    const loadedArtists = artistService.getArtists();
    setArtists(loadedArtists);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('specialties[')) {
      const index = parseInt(name.match(/\[(\d+)\]/)[1]);
      setFormData(prev => ({
        ...prev,
        specialties: prev.specialties.map((s, i) => i === index ? value : s)
      }));
    } else if (name.startsWith('awards[')) {
      const index = parseInt(name.match(/\[(\d+)\]/)[1]);
      setFormData(prev => ({
        ...prev,
        awards: prev.awards.map((a, i) => i === index ? value : a)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedFormData = {
      ...formData,
      specialties: formData.specialties.filter(s => s.trim() !== ''),
      awards: formData.awards.filter(a => a.trim() !== '')
    };

    if (selectedArtist) {
      const updatedArtists = artistService.updateArtist(selectedArtist.id, cleanedFormData);
      setArtists(updatedArtists);
    } else {
      const updatedArtists = artistService.addArtist(cleanedFormData);
      setArtists(updatedArtists);
    }
    
    setSelectedArtist(null);
    setFormData({
      name: '',
      city: '',
      country: '',
      lat: '',
      lng: '',
      style: '',
      specialties: ['', '', ''],
      avatar: '',
      color: '#000000',
      instagram: '',
      website: '',
      bio: '',
      awards: ['', '']
    });
  };

  const handleEdit = (artist) => {
    setSelectedArtist(artist);
    setFormData({
      ...artist,
      specialties: [
        ...artist.specialties,
        ...Array(3 - artist.specialties.length).fill('')
      ],
      awards: [
        ...artist.awards,
        ...Array(2 - artist.awards.length).fill('')
      ]
    });
    setIsOpen(true);
  };

  return (
    <div className="artist-manager">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="toggle-button"
      >
        {isOpen ? '关闭管理' : '艺术家管理'}
      </button>

      {isOpen && (
        <div className="manager-panel">
          <h2>{selectedArtist ? '编辑艺术家' : '添加新艺术家'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>姓名:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>城市:</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>国家:</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>纬度:</label>
              <input
                type="number"
                name="lat"
                value={formData.lat}
                onChange={handleInputChange}
                required
                step="any"
              />
            </div>

            <div className="form-group">
              <label>经度:</label>
              <input
                type="number"
                name="lng"
                value={formData.lng}
                onChange={handleInputChange}
                required
                step="any"
              />
            </div>

            <div className="form-group">
              <label>风格:</label>
              <input
                type="text"
                name="style"
                value={formData.style}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>专长:</label>
              {formData.specialties.map((specialty, index) => (
                <input
                  key={index}
                  type="text"
                  name={`specialties[${index}]`}
                  value={specialty}
                  onChange={handleInputChange}
                  placeholder={`专长 ${index + 1}`}
                />
              ))}
            </div>

            <div className="form-group">
              <label>头像URL:</label>
              <input
                type="text"
                name="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>主题色:</label>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Instagram:</label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>网站:</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>简介:</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>获奖经历:</label>
              {formData.awards.map((award, index) => (
                <input
                  key={index}
                  type="text"
                  name={`awards[${index}]`}
                  value={award}
                  onChange={handleInputChange}
                  placeholder={`获奖 ${index + 1}`}
                />
              ))}
            </div>

            <button type="submit">
              {selectedArtist ? '更新' : '添加'}
            </button>
            {selectedArtist && (
              <button 
                type="button" 
                onClick={() => {
                  setSelectedArtist(null);
                  setFormData({
                    name: '',
                    city: '',
                    country: '',
                    lat: '',
                    lng: '',
                    style: '',
                    specialties: ['', '', ''],
                    avatar: '',
                    color: '#000000',
                    instagram: '',
                    website: '',
                    bio: '',
                    awards: ['', '']
                  });
                }}
              >
                取消
              </button>
            )}
          </form>

          <div className="artists-list">
            <h3>现有艺术家</h3>
            {artists.map(artist => (
              <div key={artist.id} className="artist-item">
                <img src={artist.avatar} alt={artist.name} />
                <div className="artist-info">
                  <h4>{artist.name}</h4>
                  <p>{artist.country}</p>
                </div>
                <button onClick={() => handleEdit(artist)}>编辑</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistManager;
