import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { ActionItem as ActionItemComponent } from './components/ActionItem';
import { ActionItem } from './types';

const App=()=> {
  const [actions, setActions] = useState<ActionItem[]>([
    {
      id: '1',
      title: 'Iniciar transporte',
      children: [
        { id: '1.1', title: 'Nueva' },
        { id: '1.2', title: 'En tránsito' },
        { id: '1.3', title: 'Casi finalizando' },
      ],
    },
    {
      id: '2',
      title: 'Problemas en el camino',
      children: [
        { id: '2.1', title: 'Mecánico' },
        { id: '2.2', title: 'Personal' },
        { id: '2.3', title: 'Climático' },
      ],
    },
  ]);

  const addRootAction = () => {
    const newId = String(actions.length + 1);
    setActions([...actions, { id: newId, title: 'Nueva acción' }]);
  };

  const addChildAction = (parentId: string) => {
    const updateItems = (items: ActionItem[]): ActionItem[] => {
      return items.map((item) => {
        if (item.id === parentId) {
          const children = item.children || [];
          const newChild = {
            id: `${item.id}.${(children.length + 1)}`,
            title: 'Nueva sub-acción',
          };
          return { ...item, children: [...children, newChild] };
        }
        if (item.children) {
          return { ...item, children: updateItems(item.children) };
        }
        return item;
      });
    };
    setActions(updateItems(actions));
  };

  const deleteAction = (id: string) => {
    const filterItems = (items: ActionItem[]): ActionItem[] => {
      return items
        .filter((item) => item.id !== id)
        .map((item) => {
          if (item.children) {
            return { ...item, children: filterItems(item.children) };
          }
          return item;
        });
    };
    setActions(filterItems(actions));
  };

  const editAction = (id: string, newTitle: string) => {
    const updateItems = (items: ActionItem[]): ActionItem[] => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, title: newTitle };
        }
        if (item.children) {
          return { ...item, children: updateItems(item.children) };
        }
        return item;
      });
    };
    setActions(updateItems(actions));
  };

  return (
    <div >
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0">Maqueta acciones anidadas</h1>
        <Button
          variant="primary"
          onClick={addRootAction}
          className="d-flex align-items-center gap-2"
        >
          Agregar Acción
        </Button>
      </div>
      {actions.map((action) => (
        <div key={action.id} className="action-group">
          <ActionItemComponent
            item={action}
            level={0}
            onAddChild={addChildAction}
            onDelete={deleteAction}
            onEdit={editAction}
          />
        </div>
      ))}
    </div>
  );
}

export default App;