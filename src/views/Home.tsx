import { useState } from 'react';
import { Button } from 'react-bootstrap';
import AccordionComponent from "../components/AccordionComponent";
import { ActionItem } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'

const Home = () => {
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
    Swal.fire({
      title: '¿Estás seguro de Elimina esta opción?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
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
        Swal.fire(
          '¡Eliminado!',
          'La opción ha sido eliminada.',
          'success'
        )
      }
    })
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
      <h1 className="text-center mt-4" style={{ color: "#95a880" }}>Configuración y Opciones de Respuestas</h1>

      <div className="d-flex justify-content-end mb-4 container ">
        <Button
          variant="success"
          onClick={addRootAction}
          className="d-flex align-items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />Agregar Acción
        </Button>
      </div>
      <div className="d-flex justify-content-center">
        <div className="layout">
          {actions.map((action) => (
            <div key={action.id} className="shadow p-3 mb-5 bg-body-tertiary rounded container">
              <AccordionComponent
                item={action}
                level={0}
                onAddChild={addChildAction}
                onDelete={deleteAction}
                onEdit={editAction}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Home

