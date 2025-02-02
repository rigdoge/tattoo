import React from 'react';
import ArtistManager from '../components/ArtistManager';
import { Link } from 'react-router-dom';

const Admin = () => {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <Link to="/" className="back-link">返回地球</Link>
        <h1>艺术家管理</h1>
      </div>
      <ArtistManager defaultOpen={true} />
    </div>
  );
};

export default Admin;
