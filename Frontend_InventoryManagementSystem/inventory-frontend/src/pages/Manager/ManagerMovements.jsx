import React from 'react';
import UserMovements from '../../components/UserMovements';

const ManagerMovements = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Team Movements</h1>
      <UserMovements />
    </div>
  );
};

export default ManagerMovements;
