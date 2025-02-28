import React, { useState } from 'react';
import { Form, Button, Card, Collapse } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faGripVertical, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Step, StepType, StepTypesData, Option } from '../../types/index';
import Swal from 'sweetalert2';
import { useFlows } from '../../context/FlowsContext';


/**
 * Paleta de colores para niveles jerárquicos del flujo.
 * Comienza con blanco y progresa a tonos más oscuros de azul.
 */
const levelColors = [
  'rgba(255, 255, 255, 1)',
  'rgba(240, 248, 255, 0.9)',
  'rgba(230, 240, 250, 0.9)',
  'rgba(220, 235, 245, 0.9)',
  'rgba(210, 230, 240, 0.9)',
  'rgba(200, 225, 235, 0.9)',
  'rgba(195, 220, 225, 0.9)'
];

/**
 * Obtiene el color de fondo según el nivel de profundidad.
 * Para niveles más allá de la paleta, reduce gradualmente la opacidad.
 * 
 * @param depth - Nivel de profundidad
 * @returns Color en formato rgba
 */
const getBackgroundColor = (depth: number): string => {
  if (depth < levelColors.length) {
    return levelColors[depth];
  }

  const baseOpacity = 0.9;
  const opacityStep = 0.5;
  const extraDepth = depth - levelColors.length + 1;
  const newOpacity = Math.max(baseOpacity - (opacityStep * extraDepth), 0.5);

  return `rgba(200, 225, 235, ${newOpacity})`;
};

interface StepBuilderProps {
  step: Step;
  onStepChange: (step: Step) => void;
  onDelete?: () => void;
  depth?: number;
  newOpcion?: boolean;
}

export const StepBuilder: React.FC<StepBuilderProps> = ({
  step,
  onStepChange,
  onDelete,
  depth = 0,
  newOpcion
}) => {

  // Validación para mostrar el boton desplegble.
  const shouldShowExpandButton =
    depth > 0 &&
    (
      step.tipo === 'seleccion_lista' ||
      step.tipo === 'seleccion_botones'
    );

  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedOptions, setExpandedOptions] = useState<{ [key: number]: boolean }>({});
  const { actions } = useFlows();

  const stepTypes: StepType[] = [
    'mensaje',
    'seleccion_lista',
    'seleccion_botones',
    'entrada_numero',
    'entrada_texto',
    'entrada_imagen',
    'accion'
  ];

  const stepTypesData: StepTypesData[] = [
    'texto',
    'numero',
    'imagen',
    'telefono'
  ];

  const stepTypesActions = actions.map((item: any) => item.texto)

  const toggleOption = (optionIndex: number) => {
    setExpandedOptions(prev => ({
      ...prev,
      [optionIndex]: !prev[optionIndex]
    }));
  };

  const addOption = () => {
    const newOption = {
      valor: step.opciones?.length ? String(step.opciones.length + 1) : "1",
      mensaje: '',
      proximo_paso: []
    };

    onStepChange({
      ...step,
      opciones: [...(step.opciones || []), newOption]
    });
  };

  const deleteOption = (optionIndex: number) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la opción ${optionIndex + 1}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed && step.opciones) {
        const newOptions = [...step.opciones];
        newOptions.splice(optionIndex, 1);
        const updatedOptions = newOptions.map((option, index) => ({
          ...option,
          valor: String(index + 1)
        }));

        onStepChange({
          ...step,
          opciones: updatedOptions
        });

        Swal.fire(
          '¡Eliminado!',
          'La opción ha sido eliminada.',
          'success'
        );
      }
    });
  };

  const updateOption = (index: number, field: keyof Option, value: any) => {
    if (!step.opciones) return;

    const newOptions = [...step.opciones];
    newOptions[index] = { ...newOptions[index], [field]: value };

    onStepChange({
      ...step,
      opciones: newOptions
    });
  };

  const handleOptionsReorder = (result: any) => {
    if (!result.destination || !step.opciones) return;

    const items = Array.from(step.opciones);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Reajustar los valores después de reordenar
    const updatedOptions = items.map((option, index) => ({
      ...option,
      valor: String(index + 1)
    }));

    onStepChange({
      ...step,
      opciones: updatedOptions
    });
  };

  const handleNextStepsDragEnd = (result: any, optionIndex: number) => {
    if (!result.destination || !step.opciones) return;

    const option = step.opciones[optionIndex];
    if (!option.proximo_paso) return;

    const items = Array.from(option.proximo_paso);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const newOptions = [...step.opciones];
    newOptions[optionIndex] = {
      ...option,
      proximo_paso: items
    };

    onStepChange({
      ...step,
      opciones: newOptions
    });
  };

  const addNextStep = (optionIndex: number) => {
    if (!step.opciones) return;

    const newOptions = [...step.opciones];
    const option = newOptions[optionIndex];

    newOptions[optionIndex] = {
      ...option,
      proximo_paso: [
        ...(option.proximo_paso || []),
        { mensaje: '', tipo: 'mensaje', tipo_entrada: 'texto' }
      ]
    };

    onStepChange({
      ...step,
      opciones: newOptions
    });
  };

  const updateNextStep = (optionIndex: number, stepIndex: number, newStep: Step) => {
    if (!step.opciones) return;

    const newOptions = [...step.opciones];
    const option = newOptions[optionIndex];

    if (!option.proximo_paso) return;

    const newNextSteps = [...option.proximo_paso];
    newNextSteps[stepIndex] = newStep;

    newOptions[optionIndex] = {
      ...option,
      proximo_paso: newNextSteps
    };

    onStepChange({
      ...step,
      opciones: newOptions
    });
  };

  const deleteNextStep = (optionIndex: number, stepIndex: number) => {
    if (!step.opciones) return;

    const newOptions = [...step.opciones];
    const option = newOptions[optionIndex];

    if (!option.proximo_paso) return;

    const newNextSteps = option.proximo_paso.filter((_, idx) => idx !== stepIndex);

    newOptions[optionIndex] = {
      ...option,
      proximo_paso: newNextSteps
    };

    onStepChange({
      ...step,
      opciones: newOptions
    });
  };

  return (
    <div className={`border-start ps-3 mb-3 ${depth > 0 ? 'ms-3' : ''}`} style={{
      backgroundColor: getBackgroundColor(depth),
      padding: '15px',
      borderRadius: '8px',
    }}>
      <div className="mb-3">
        <div className="d-flex w-100">
          {/* Boton para expandir secciones internas */}
          <div>
            {shouldShowExpandButton && (
              <Button
                variant="link"
                className="p-0 me-2"
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ color: 'inherit' }}
              >
                <FontAwesomeIcon icon={isExpanded ? faChevronDown : faChevronRight} />
              </Button>
            )}
          </div>
          <div className="row w-100">
            <div className="col-md-11">
              <Form.Select
                value={step.tipo ?? ''}
                onChange={(e: any) => onStepChange({ ...step, tipo: e.target.value as StepType })}
              >
                {stepTypes.map(type => (
                  <option key={type} value={type}>
                    {type.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </Form.Select>

              <Form.Select
                className="mt-2"
                value={step.tipo_entrada ?? ''}
                onChange={(e: any) => onStepChange({ ...step, tipo_entrada: e.target.value as StepType })}
              >
                {step.tipo == 'accion' ?
                  stepTypesActions.map((type: String) => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ').toUpperCase()}
                    </option>))
                  : stepTypesData.map(type => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
              </Form.Select>

              <Form.Control
                type="text"
                className="mt-2"
                value={step.mensaje}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onStepChange({ ...step, mensaje: e.target.value })}
                placeholder="Mensaje"
              />
            </div>
            <div className="col-md-1">
              {onDelete && (
                <Button
                  variant="danger"
                  onClick={onDelete}
                  size="sm"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              )}
            </div>
          </div>
        </div>

        <Collapse in={isExpanded}>
          <div>
            {(step.tipo === 'seleccion_lista' || step.tipo === 'seleccion_botones') && (
              <div className="mt-3">
                <DragDropContext onDragEnd={handleOptionsReorder}>
                  <Droppable droppableId="options">
                    {(provided: any) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {step.opciones?.map((option: any, optionIndex: number) => (
                          <Draggable
                            key={optionIndex.toString()}
                            draggableId={`option-${optionIndex}`}
                            index={optionIndex}
                          >
                            {(provided: any) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                              >
                                <Card className="mb-3" style={{
                                  backgroundColor: getBackgroundColor(depth + 1),
                                }}>
                                  <Card.Header className="d-flex justify-content-between align-items-center py-2">
                                    <div className="d-flex gap-2 align-items-center">
                                      <div
                                        {...provided.dragHandleProps}
                                        className="me-2"
                                        style={{ cursor: 'grab' }}
                                      >
                                        <FontAwesomeIcon icon={faGripVertical} />
                                      </div>
                                      <Button
                                        variant="link"
                                        className="p-0"
                                        onClick={() => toggleOption(optionIndex)}
                                        style={{ color: 'inherit' }}
                                      >
                                        <FontAwesomeIcon icon={expandedOptions[optionIndex] ? faChevronDown : faChevronRight} />
                                      </Button>
                                      <span>Opción {optionIndex + 1}</span>
                                    </div>
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      onClick={() => deleteOption(optionIndex)}
                                      className="ms-2"
                                    >
                                      <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                  </Card.Header>
                                  <Collapse in={expandedOptions[optionIndex]}>
                                    <Card.Body>
                                      <div className="d-flex gap-2 mb-3">
                                        <Form.Control
                                          type="text"
                                          value={option.valor}
                                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateOption(optionIndex, 'valor', e.target.value)}
                                          placeholder="Valor"
                                          style={{ width: '100px' }}
                                        />
                                        <Form.Control
                                          type="text"
                                          value={option.mensaje}
                                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateOption(optionIndex, 'mensaje', e.target.value)}
                                          placeholder="Mensaje"
                                        />
                                      </div>

                                      <DragDropContext onDragEnd={(result: any) => handleNextStepsDragEnd(result, optionIndex)}>
                                        <Droppable droppableId={`option-${optionIndex}`}>
                                          {(provided: any) => (
                                            <div
                                              {...provided.droppableProps}
                                              ref={provided.innerRef}
                                            >
                                              {option.proximo_paso?.map((nextStep: number, stepIndex: number) => (
                                                <Draggable
                                                  key={`${optionIndex}-${stepIndex}`}
                                                  draggableId={`${optionIndex}-${stepIndex}`}
                                                  index={stepIndex}
                                                >
                                                  {(provided) => (
                                                    <div
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                    >
                                                      <div className="d-flex align-items-start">
                                                        <div
                                                          {...provided.dragHandleProps}
                                                          className="me-3"
                                                          style={{ cursor: 'grab' }}
                                                        >
                                                          <FontAwesomeIcon icon={faGripVertical} />
                                                        </div>
                                                        <div className="flex-grow-1">
                                                          <StepBuilder
                                                            key={stepIndex}
                                                            step={nextStep}
                                                            onStepChange={(newStep: any) => updateNextStep(optionIndex, stepIndex, newStep)}
                                                            onDelete={() => deleteNextStep(optionIndex, stepIndex)}
                                                            depth={depth + 1}
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )}
                                                </Draggable>
                                              ))}
                                              {provided.placeholder}
                                            </div>
                                          )}
                                        </Droppable>
                                      </DragDropContext>

                                      <Button
                                        variant="primary"
                                        onClick={() => addNextStep(optionIndex)}
                                        size="sm"
                                        className="mt-2"
                                      >
                                        + Agregar Próximo Paso
                                      </Button>
                                    </Card.Body>
                                  </Collapse>
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
                {!newOpcion && (
                  <Button
                    variant="secondary"
                    onClick={addOption}
                    size="sm"
                  >
                    + Agregar Opción
                  </Button>
                )}
              </div>
            )}
          </div>
        </Collapse>
      </div>
    </div>
  );
};

