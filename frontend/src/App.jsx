import React, { useState, useEffect } from 'react';
import { getItems, addItem, updateItem, deleteItem, getCategories } from './api';
import ListItem from './components/ListItem';
import AddItemForm from './components/AddItemForm';

function App() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();

    const API_URL = import.meta.env.VITE_API_URL || '/api';
    const eventSource = new EventSource(`${API_URL}/items/events`);

    eventSource.onmessage = (event) => {
      if (event.data === 'update') {
        loadData(false);
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const loadData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const [itemsData, categoriesData] = await Promise.all([
        getItems(),
        getCategories()
      ]);
      setItems(itemsData.data || []);
      setCategories(categoriesData.data || []);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleSaveItem = async (item) => {
    try {
      if (item.id) {
        await updateItem(item.id, item);
      } else {
        await addItem(item);
      }
      setShowForm(false);
      setEditingItem(null);
      loadData();
    } catch (error) {
      console.error("Failed to save item", error);
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };


  const handleToggleItem = async (item) => {
    try {
      // Optimistic update
      const updatedItems = items.map(i => 
        i.id === item.id ? { ...i, purchased: !i.purchased } : i
      );
      setItems(updatedItems);
      
      await updateItem(item.id, { purchased: !item.purchased ? 1 : 0 });
      // Reload to ensure sync (optional, could just rely on optimistic)
      // loadData(); 
    } catch (error) {
      console.error("Failed to toggle item", error);
      loadData(); // Revert on error
    }
  };

  const handleDeleteItem = async (id) => {
    if (!confirm('Tem certeza que deseja remover este item?')) return;
    try {
      await deleteItem(id);
      setItems(items.filter(i => i.id !== id));
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  // Group items by purchased status
  const pendingItems = items.filter(i => !i.purchased);
  const purchasedItems = items.filter(i => i.purchased);

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10">
        <h1 className="text-xl font-bold">Lista de Mercado</h1>
        <p className="text-blue-100 text-sm">{pendingItems.length} itens pendentes</p>
      </header>

      <main className="p-4 max-w-md mx-auto">
        {showForm && (
          <AddItemForm 
            categories={categories} 
            onSave={handleSaveItem} 
            onCancel={() => { setShowForm(false); setEditingItem(null); }} 
            initialData={editingItem}
          />
        )}

        {loading ? (
          <div className="text-center py-10 text-gray-500">Carregando...</div>
        ) : (
          <>
            {items.length === 0 && !showForm && (
              <div className="text-center py-10 text-gray-500">
                Sua lista está vazia. Adicione itens!
              </div>
            )}

            <div className="space-y-2">
              {pendingItems.map(item => (
                <ListItem 
                  key={item.id} 
                  item={item} 
                  onToggle={handleToggleItem} 
                  onDelete={handleDeleteItem} 
                  onEdit={handleEditClick}
                />
              ))}
            </div>

            {purchasedItems.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Comprados</h2>
                <div className="space-y-2 opacity-75">
                  {purchasedItems.map(item => (
                    <ListItem 
                      key={item.id} 
                      item={item} 
                      onToggle={handleToggleItem} 
                      onDelete={handleDeleteItem} 
                      onEdit={handleEditClick}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <button 
        onClick={() => { setEditingItem(null); setShowForm(true); }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform hover:scale-105 active:scale-95"
        aria-label="Adicionar item"
      >
        +
      </button>
    </div>
  );
}

export default App;
