// ===================================
// Vista de Detalle y Edición de Flujo
// ===================================

/**
* @fileoverview Componente para visualizar y editar los pasos de un flujo de trabajo
* Permite agregar, ordenar, modificar y eliminar pasos mediante drag & drop
*/

import { useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave, faDiagramProject } from '@fortawesome/free-solid-svg-icons';
import { Step } from '../types';
import NewStepModal from '../components/steps/NewStepModal';
import { StepBuilder } from '../components/steps/StepBuilder';
import JsonTreeView from '../components/JsonTree';
import axiosInstance from '../axiosConfig';
import Swal from "sweetalert2";
import LoadingComponent from '../components/layout/LoadingComponent';

/**
* @component FlowView
* @description Componente principal para la gestión de pasos en un flujo de trabajo
*/
const FlowView = () => {
  // ===================================
  // Hooks y Estado
  // ===================================
  const { id } = useParams();
  const [steps, setSteps] = useState<Step[]>([]);
  const [originalSteps, setOriginalSteps] = useState<Step[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>({
    mensaje: '',
    tipo: 'mensaje',
    // tipo_entrada: 'texto'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading,setIsLoading] = useState(false);

  // ===================================
  // Funciones de Manejo de Pasos
  // ===================================

  /**
   * Maneja el reordenamiento de pasos mediante drag & drop
   * @param {Object} result - Resultado del evento drag & drop
   */
  const handleDragEnd = (result: any) => {
    // Si no hay destino válido (ej: drop fuera de la zona), no hacemos nada
    if (!result.destination) return;

    // Creamos una copia del array para no mutar el estado directamente
    const items = Array.from(steps);

    // Removemos el elemento arrastrado de su posición original
    // splice() retorna un array con el elemento removido, lo destructuramos
    const [reorderedItem] = items.splice(result.source.index, 1);

    // Insertamos el elemento en su nueva posición
    // splice() con 0 como segundo argumento no elimina elementos
    items.splice(result.destination.index, 0, reorderedItem);

    // Actualizamos el estado con el nuevo orden
    setSteps(items);
  };

  /**
   * Guarda todos los pasos en el servidor
   */
  const handleSaveAllSteps = async () => {
    setIsSaving(true);
    try {
      await axiosInstance.post(`/api/detalle_flujos/${id}`, steps);
      Swal.fire({
        icon: "success",
        title: "Pasos Agregados",
        text: "Pasos guardados exitosamente.",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err instanceof Error ? err.message : "Ocurrió un error inesperado.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Agrega un nuevo paso al flujo
   */
  const addStep = () => {
    // Agregamos el nuevo paso al final del array usando spread operator
    // para mantener la inmutabilidad del estado
    setSteps([...steps, currentStep]);

    // Reiniciamos el paso actual a sus valores por defecto
    // Esto limpia el formulario para futuros ingresos
    setCurrentStep({
      mensaje: '',
      tipo: 'mensaje',
      tipo_entrada: 'texto'
    });

    // Cerramos el modal de creación
    setShowModal(false);
  };
  /**
   * Actualiza un paso existente
   * @param {number} index - Índice del paso a actualizar
   * @param {Step} newStep - Nuevos datos del paso
   */
  const updateStep = (index: number, newStep: Step) => {
    const newSteps = [...steps];
    newSteps[index] = newStep;
    setSteps(newSteps);
  };

  /**
   * Elimina un paso del flujo
   * @param {number} index - Índice del paso a eliminar
   */
  const deleteStep = (index: number) => {
    Swal.fire({
      title: `¿Deseas eliminar la opción ${index + 1}?`,
      text: `Luego de Eliminarla debera guardar los cambios`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setSteps(steps.filter((_, idx) => idx !== index));

        Swal.fire(
          '¡Eliminado!',
          'La opción ha sido eliminada.',
          'success'
        );
      }
    });

  };

  /**
   * Obtiene los pasos del flujo desde el servidor
   */
  const fetchStep = async () => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get(`/api/detalle_flujos/${id}`);
      setSteps(response.data);
      setOriginalSteps(response.data);
    } catch (error) {
      console.error('Error al obtener los detalles del flujo:', error);
    }finally{
      setIsLoading(false)

    }
  };

  // Cargar pasos al montar el componente
  useEffect(() => {
    fetchStep();
  }, [id]);

  if (isLoading) return <LoadingComponent title={"Pasos del flujo"} />;

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-end align-items-center mb-4">
        <div className="d-flex gap-2">
          <Button
            variant="success"
            onClick={() => setShowModal(true)}
            className="d-flex align-items-center shadow"
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Agregar Paso
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveAllSteps}
            className="d-flex align-items-center shadow"
            disabled={steps.length === 0 || isSaving}
          >
            {isSaving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className="me-2" />
                Guardar Todos los Pasos
              </>
            )}
          </Button>
        </div>
      </div>
      {JSON.stringify(steps) !== JSON.stringify(originalSteps) && (
        <div className="alert alert-warning" role="alert">
          ¡Tienes cambios sin guardar! Si no guardas antes de recargar la página, los cambios se perderán.
        </div>
      )}


      {steps.length === 0 ? (
        <div className="text-center py-5">
          <Card className="border-0 shadow-sm">
            <Card.Body className="py-5">
              <div className="mb-4">
                <FontAwesomeIcon
                  icon={faDiagramProject}
                  style={{
                    fontSize: '5rem',
                    color: '#6c757d',
                    opacity: '0.5'
                  }}
                />
              </div>
              <h3 className="text-secondary mb-3">No hay pasos configurados</h3>
              <p className="text-muted mb-4">
                Comience agregando un nuevo paso para crear su flujo de trabajo
              </p>
              <Button
                variant="success"
                size="lg"
                onClick={() => setShowModal(true)}
                className="d-flex align-items-center mx-auto"
                style={{ width: 'fit-content' }}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Agregar Primer Paso
              </Button>
            </Card.Body>
          </Card>
        </div>
      ) : (
        /**
        * Contenedor principal que divide la vista en dos columnas:
        * - Columna izquierda: Vista en árbol JSON de los pasos
        * - Columna derecha: Lista ordenable de pasos con drag & drop
        */
        <div className="row">
          {/* Panel lateral con vista JSON */}
          <div className="col-md-3">
            <JsonTreeView data={steps} />
          </div>

          {/* Panel principal con lista de pasos */}
          <div className="col-md-9">
            {/* Contexto para manejo de drag & drop */}
            <DragDropContext onDragEnd={handleDragEnd}>
              {/* Área donde se pueden soltar elementos */}
              <Droppable droppableId="steps">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {/* Mapeo de cada paso a un elemento arrastrable */}
                    {steps.map((step, index) => (
                      <Draggable
                        key={index.toString()}
                        draggableId={index.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <Card className="mb-3 shadow-sm">
                              <Card.Body>
                                <div className="d-flex align-items-start">
                                  {/* Manejador para arrastrar */}
                                  <div
                                    {...provided.dragHandleProps}
                                    className="me-3 cursor-grab"
                                    style={{ cursor: 'grab' }}
                                  >
                                    ⋮⋮
                                  </div>
                                  {/* Contenido del paso */}
                                  <div className="flex-grow-1">
                                    <StepBuilder
                                      step={step}
                                      onStepChange={(newStep) => updateStep(index, newStep)}
                                      onDelete={() => deleteStep(index)}
                                    />
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {/* Placeholder necesario para el drag & drop */}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      )}

      {/* Modal para nuevo paso */}
      <NewStepModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={() => console.log('Guardar nuevo paso')}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        addStep={addStep}
        newOpcion={true}
      />
    </Container>
  );
}

export default FlowView;