import React from 'react';
import PropTypes from 'prop-types';
import { MdOutlineAddBusiness } from 'react-icons/md';

const ItemList = ({ items, onItemClick, emptyMessage, itemKey, itemTitle, itemDescription }) => {

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div>
      {items.length === 0 ? (
        <div className="text-center">
          <MdOutlineAddBusiness className="text-6xl mx-auto text-gray-400" />
          <p className="text-gray-500 mt-2">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item[itemKey]}
              className="p-4 rounded shadow cursor-pointer"
              style={{ backgroundColor: generateRandomColor() }}
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
