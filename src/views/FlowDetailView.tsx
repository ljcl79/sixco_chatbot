import { useState } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave, faDiagramProject } from '@fortawesome/free-solid-svg-icons';
import { Step } from '../types';
import NewStepModal from '../components/steps/NewStepModal';
import { StepBuilder } from '../components/steps/StepBuilder';
import JsonTreeView from '../components/JsonTree';

const FlowView = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>({
    mensaje: '',
    tipo: 'mensaje',
    tipo_entrada: 'texto'
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSteps(items);
  };

  const handleSaveAllSteps = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Enviando pasos a la API:', JSON.stringify(steps, null, 2));
      console.log('Pasos guardados exitosamente');
    } catch (error) {
      console.error('Error al guardar los pasos:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addStep = () => {
    setSteps([...steps, currentStep]);
    setCurrentStep({ mensaje: '', tipo: 'mensaje', tipo_entrada: 'texto' });
    setShowModal(false);
  };

  const updateStep = (index: number, newStep: Step) => {
    const newSteps = [...steps];
    newSteps[index] = newStep;
    setSteps(newSteps);
  };

  const deleteStep = (index: number) => {
    setSteps(steps.filter((_, idx) => idx !== index));
  };

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
        <div className="row">
          <div className="col-md-3">
            <JsonTreeView data={steps} />
          </div>
          <div className="col-md-9">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="steps">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
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
                                  <div
                                    {...provided.dragHandleProps}
                                    className="me-3 cursor-grab"
                                    style={{ cursor: 'grab' }}
                                  >
                                    ⋮⋮
                                  </div>
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
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      )}

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