import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { FaEdit, FaTrash, FaPlus, FaGripVertical } from 'react-icons/fa';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// DraggableItem component
const DraggableItem = ({ item, index, moveItem, children }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'ITEM',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'ITEM',
    hover(draggedItem) {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <li
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="item"
    >
      <div className="drag-handle">
        <FaGripVertical />
      </div>
      {children}
    </li>
  );
};

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Carregar itens do Supabase ao iniciar
  useEffect(() => {
    fetchItems();
  }, []);

  // Buscar todos os itens da lista
  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      setError('Erro ao carregar itens: ' + error.message);
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar novo item
  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    try {
      const { data, error } = await supabase
        .from('items')
        .insert([{ name: newItem, completed: false }])
        .select();

      if (error) throw error;
      
      setItems([...data, ...items]);
      setNewItem('');
    } catch (error) {
      setError('Erro ao adicionar item: ' + error.message);
      console.error('Erro:', error);
    }
  };

  // Atualizar status de conclusão do item
  const toggleComplete = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('items')
        .update({ completed: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      setItems(items.map(item => {
        if (item.id === id) {
          return { ...item, completed: !item.completed };
        }
        return item;
      }));
    } catch (error) {
      setError('Erro ao atualizar item: ' + error.message);
      console.error('Erro:', error);
    }
  };

  // Iniciar edição de um item
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditText(item.name);
  };

  // Salvar edição de um item
  const saveEdit = async () => {
    if (!editText.trim()) return;

    try {
      const { error } = await supabase
        .from('items')
        .update({ name: editText })
        .eq('id', editingId);

      if (error) throw error;

      setItems(items.map(item => {
        if (item.id === editingId) {
          return { ...item, name: editText };
        }
        return item;
      }));
      setEditingId(null);
    } catch (error) {
      setError('Erro ao editar item: ' + error.message);
      console.error('Erro:', error);
    }
  };

  // Excluir um item
  const deleteItem = async (id) => {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      setError('Erro ao excluir item: ' + error.message);
      console.error('Erro:', error);
    }
  };

  const moveItem = async (fromIndex, toIndex) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setItems(newItems);

    try {
      // Update the position in the database if needed
      // This is optional - you can implement this later if you want to persist the order
      // You would need to add a 'position' column in your database
    } catch (error) {
      setError('Erro ao reordenar item: ' + error.message);
      console.error('Erro:', error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container">
        <h1>Lista de Mercado</h1>
        
        {error && <div className="error">{error}</div>}

        <form onSubmit={addItem} className="form-container">
          <input
            type="text"
            placeholder="Adicionar novo item..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <button type="submit">
            <FaPlus />
          </button>
        </form>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <ul className="item-list">
            {items.length === 0 ? (
              <div className="loading">Nenhum item na lista. Adicione algo!</div>
            ) : (
              items.map((item, index) => (
                <DraggableItem
                  key={item.id}
                  item={item}
                  index={index}
                  moveItem={moveItem}
                >
                  {editingId === item.id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        className="edit-input"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <button className="save-btn" onClick={saveEdit}>Salvar</button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="checkbox"
                        className="item-checkbox"
                        checked={item.completed}
                        onChange={() => toggleComplete(item.id, item.completed)}
                      />
                      <span className={`item-text ${item.completed ? 'completed' : ''}`}>
                        {item.name}
                      </span>
                      <div className="item-actions">
                        <button className="edit-btn" onClick={() => startEdit(item)}>
                          <FaEdit />
                        </button>
                        <button className="delete-btn" onClick={() => deleteItem(item.id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </>
                  )}
                </DraggableItem>
              ))
            )}
          </ul>
        )}
      </div>
    </DndProvider>
  );
}

export default App;