import React from 'react';
import PropTypes from 'prop-types';
import { MdOutlineAddBusiness } from 'react-icons/md';

const ItemList = ({ items, onItemClick, emptyMessage, itemKey, itemTitle, itemDescription }) => {
  const colors = [
    'bg-red-200', 'bg-green-100', 'bg-blue-100', 'bg-yellow-100', 'bg-purple-100', 'bg-pink-100', 'bg-indigo-100'
  ];

  return (
    <div>
      {items.length === 0 ? (
        <div className="text-center">
          <MdOutlineAddBusiness className="text-6xl mx-auto text-gray-400" />
          <p className="text-gray-500 mt-2">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={item[itemKey]}
              className={`p-4 rounded shadow cursor-pointer ${colors[index % colors.length]}`}
              onClick={() => onItemClick(item[itemKey])}
            >
              <h2 className="text-xl font-bold">{item[itemTitle]}</h2>
              <p className="mt-2">{item[itemDescription]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ItemList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onItemClick: PropTypes.func.isRequired,
  emptyMessage: PropTypes.string.isRequired,
  itemKey: PropTypes.string.isRequired,
  itemTitle: PropTypes.string.isRequired,
  itemDescription: PropTypes.string.isRequired,
};

export default ItemList;
