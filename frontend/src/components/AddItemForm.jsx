import React, { useState } from 'react';

const AddItemForm = ({ categories, onSave, onCancel, initialData }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [quantity, setQuantity] = useState(initialData?.quantity || '');
    const [unit, setUnit] = useState(initialData?.unit || 'un');
    const [categoryId, setCategoryId] = useState(initialData?.category_id || categories[0]?.id || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !categoryId) return;
        onSave({ 
            id: initialData?.id, // Include ID if editing
            name, 
            quantity: quantity || 1, 
            unit, 
            category_id: categoryId 
        });
        setName('');
        setQuantity('');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-lg font-bold mb-3 text-gray-800">{initialData ? 'Editar Item' : 'Adicionar Item'}</h2>
            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ex: Leite, Pão..."
                    autoFocus
                />
            </div>
            <div className="flex gap-3 mb-3">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qtd</label>
                    <input 
                        type="number" 
                        value={quantity} 
                        onChange={(e) => setQuantity(e.target.value)} 
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="1"
                    />
                </div>
                <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
                    <select 
                        value={unit} 
                        onChange={(e) => setUnit(e.target.value)} 
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="un">un</option>
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="l">l</option>
                        <option value="ml">ml</option>
                        <option value="pct">pct</option>
                    </select>
                </div>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => setCategoryId(cat.id)}
                            className={`px-3 py-1 rounded-full text-sm border ${categoryId === cat.id ? 'ring-2 ring-offset-1' : 'opacity-70'}`}
                            style={{ 
                                backgroundColor: cat.color + '20', 
                                color: cat.color,
                                borderColor: cat.color,
                                ringColor: cat.color
                            }}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Salvar' : 'Adicionar'}</button>
            </div>
        </form>
    );
};

export default AddItemForm;
