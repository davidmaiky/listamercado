import React from 'react';

const ListItem = ({ item, onToggle, onDelete, onEdit }) => {
    return (
        <div 
            className={`flex items-center justify-between p-3 mb-2 bg-white rounded-lg shadow-sm border-l-4 ${item.purchased ? 'opacity-50' : ''}`}
            style={{ borderLeftColor: item.category_color || '#ccc' }}
        >
            <div className="flex items-center flex-1" onClick={() => onToggle(item)}>
                <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${item.purchased ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                    {item.purchased && <span className="text-white text-sm">✓</span>}
                </div>
                <div>
                    <h3 className={`font-medium ${item.purchased ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {item.quantity} {item.unit} • {item.category_name}
                    </p>
                </div>
            </div>
            <div className="flex gap-1">
                <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ListItem;
