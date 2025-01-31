import { distributors as initialDistributors } from '../data/distributors';

// 从 localStorage 获取数据，如果没有则使用初始数据
const getDistributors = () => {
  const stored = localStorage.getItem('distributors');
  if (stored) {
    return JSON.parse(stored);
  }
  // 首次使用时，将初始数据保存到 localStorage
  localStorage.setItem('distributors', JSON.stringify(initialDistributors));
  return initialDistributors;
};

// 保存所有经销商数据
const saveDistributors = (distributors) => {
  localStorage.setItem('distributors', JSON.stringify(distributors));
};

// 添加新经销商
const addDistributor = (distributor) => {
  const distributors = getDistributors();
  const newDistributor = {
    ...distributor,
    id: Math.max(...distributors.map(d => d.id), 0) + 1,
    altitude: 0.1,
    radius: 0.35
  };
  const newDistributors = [...distributors, newDistributor];
  saveDistributors(newDistributors);
  return newDistributors;
};

// 更新经销商
const updateDistributor = (id, updatedData) => {
  const distributors = getDistributors();
  const newDistributors = distributors.map(distributor =>
    distributor.id === id ? { ...distributor, ...updatedData } : distributor
  );
  saveDistributors(newDistributors);
  return newDistributors;
};

// 删除经销商
const deleteDistributor = (id) => {
  const distributors = getDistributors();
  const newDistributors = distributors.filter(distributor => distributor.id !== id);
  saveDistributors(newDistributors);
  return newDistributors;
};

// 重置为初始数据
const resetToInitial = () => {
  localStorage.setItem('distributors', JSON.stringify(initialDistributors));
  return initialDistributors;
};

export const distributorService = {
  getDistributors,
  addDistributor,
  updateDistributor,
  deleteDistributor,
  resetToInitial
};
