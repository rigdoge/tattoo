import React, { useState, useEffect } from 'react';
import { artistService } from '../services/artistService';

const ArtistManager = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleDelete = (id) => {
    if (window.confirm('确定要删除这位艺术家吗？')) {
      const updatedArtists = artistService.deleteArtist(id);
      setArtists(updatedArtists);
    }
  };

  const handleReset = () => {
    if (window.confirm('确定要重置所有数据到初始状态吗？这将删除所有修改。')) {
      const initialArtists = artistService.resetToInitial();
      setArtists(initialArtists);
    }
  };

  return (
    <div className="fixed right-4 top-4 z-50">
      <div className="flex space-x-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isOpen ? '关闭管理器' : '管理艺术家'}
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          重置数据
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">艺术家管理</h2>
              <button
                onClick={() => {
                  setIsOpen(false);
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
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* 艺术家列表 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">当前艺术家</h3>
              <div className="space-y-2">
                {artists.map(artist => (
                  <div
                    key={artist.id}
                    className="flex items-center justify-between p-2 bg-gray-100 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={artist.avatar}
                        alt={artist.name}
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: artist.color }}
                      />
                      <div>
                        <span className="font-medium">{artist.name}</span>
                        <span className="text-sm text-gray-500 ml-2">{artist.style}</span>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(artist)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDelete(artist.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 添加/编辑表单 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold">
                {selectedArtist ? '编辑艺术家' : '添加新艺术家'}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">姓名</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">城市</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">国家</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">纬度</label>
                  <input
                    type="number"
                    step="0.0001"
                    name="lat"
                    value={formData.lat}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">经度</label>
                  <input
                    type="number"
                    step="0.0001"
                    name="lng"
                    value={formData.lng}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">风格</label>
                  <input
                    type="text"
                    name="style"
                    value={formData.style}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">头像 URL</label>
                  <input
                    type="text"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">主题色</label>
                  <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Instagram</label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">网站</label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">个人简介</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">专长</label>
                <div className="space-y-2">
                  {formData.specialties.map((specialty, index) => (
                    <input
                      key={index}
                      type="text"
                      name={`specialties[${index}]`}
                      value={specialty}
                      onChange={handleInputChange}
                      placeholder={`专长 ${index + 1}`}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">获奖经历</label>
                <div className="space-y-2">
                  {formData.awards.map((award, index) => (
                    <input
                      key={index}
                      type="text"
                      name={`awards[${index}]`}
                      value={award}
                      onChange={handleInputChange}
                      placeholder={`奖项 ${index + 1}`}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
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
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  重置
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {selectedArtist ? '保存修改' : '添加艺术家'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistManager;
