import React, { useState, useEffect } from 'react';
import { distributorService } from '../services/distributorService';

const DistributorManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [distributors, setDistributors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    country: '',
    lat: '',
    lng: '',
    color: '#000000',
    logo: '',
    phone: '',
    email: '',
    social: {
      instagram: '',
      facebook: '',
      website: ''
    }
  });

  // 加载数据
  useEffect(() => {
    const loadedDistributors = distributorService.getDistributors();
    setDistributors(loadedDistributors);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        social: {
          ...prev.social,
          [socialField]: value
        }
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
    if (selectedDistributor) {
      // 更新现有经销商
      const updatedDistributors = distributorService.updateDistributor(selectedDistributor.id, formData);
      setDistributors(updatedDistributors);
    } else {
      // 添加新经销商
      const updatedDistributors = distributorService.addDistributor(formData);
      setDistributors(updatedDistributors);
    }
    
    // 重置表单
    setSelectedDistributor(null);
    setFormData({
      name: '',
      city: '',
      country: '',
      lat: '',
      lng: '',
      color: '#000000',
      logo: '',
      phone: '',
      email: '',
      social: {
        instagram: '',
        facebook: '',
        website: ''
      }
    });
  };

  const handleEdit = (distributor) => {
    setSelectedDistributor(distributor);
    setFormData(distributor);
    setIsOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('确定要删除这个经销商吗？')) {
      const updatedDistributors = distributorService.deleteDistributor(id);
      setDistributors(updatedDistributors);
    }
  };

  const handleReset = () => {
    if (window.confirm('确定要重置所有数据到初始状态吗？这将删除所有修改。')) {
      const initialDistributors = distributorService.resetToInitial();
      setDistributors(initialDistributors);
    }
  };

  return (
    <div className="fixed right-4 top-4 z-50">
      <div className="flex space-x-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isOpen ? '关闭管理器' : '管理经销商'}
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
              <h2 className="text-2xl font-bold">经销商管理</h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedDistributor(null);
                  setFormData({
                    name: '',
                    city: '',
                    country: '',
                    lat: '',
                    lng: '',
                    color: '#000000',
                    logo: '',
                    phone: '',
                    email: '',
                    social: {
                      instagram: '',
                      facebook: '',
                      website: ''
                    }
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* 经销商列表 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">当前经销商</h3>
              <div className="space-y-2">
                {distributors.map(distributor => (
                  <div
                    key={distributor.id}
                    className="flex items-center justify-between p-2 bg-gray-100 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={distributor.logo}
                        alt={distributor.name}
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: distributor.color }}
                      />
                      <span>{distributor.name}</span>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(distributor)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDelete(distributor.id)}
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
                {selectedDistributor ? '编辑经销商' : '添加新经销商'}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">名称</label>
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
                  <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                  <input
                    type="text"
                    name="logo"
                    value={formData.logo}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">电话</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">邮箱</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Instagram</label>
                  <input
                    type="text"
                    name="social.instagram"
                    value={formData.social.instagram}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Facebook</label>
                  <input
                    type="text"
                    name="social.facebook"
                    value={formData.social.facebook}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">网站</label>
                  <input
                    type="text"
                    name="social.website"
                    value={formData.social.website}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDistributor(null);
                    setFormData({
                      name: '',
                      city: '',
                      country: '',
                      lat: '',
                      lng: '',
                      color: '#000000',
                      logo: '',
                      phone: '',
                      email: '',
                      social: {
                        instagram: '',
                        facebook: '',
                        website: ''
                      }
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
                  {selectedDistributor ? '保存修改' : '添加经销商'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributorManager;
