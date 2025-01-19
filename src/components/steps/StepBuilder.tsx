import React, { useState } from 'react';
import { Form, Button, Card, Collapse } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faGripVertical, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Step, StepType, StepTypesData, Option } from '../../types/index';
import Swal from 'sweetalert2';

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

  const stepTypes: StepType[] = [
    'mensaje',
    'seleccion_lista',
    'seleccion_botones',
    'entrada_numero',
    'entrada_texto',
    'entrada_imagen'
  ];

  const stepTypesData: StepTypesData[] = [
    'texto',
    'numero',
    'imagen',
    'telefono'
  ];

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
    }).then((result) => {
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
    <div className={`border-start ps-3 mb-3 ${depth > 0 ? 'ms-3' : ''}`}>
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
                onChange={(e) => onStepChange({ ...step, tipo: e.target.value as StepType })}
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
                onChange={(e) => onStepChange({ ...step, tipo_entrada: e.target.value as StepType })}
              >
                {stepTypesData.map(type => (
                  <option key={type} value={type}>
                    {type.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </Form.Select>

              <Form.Control
                type="text"
                className="mt-2"
                value={step.mensaje}
                onChange={(e) => onStepChange({ ...step, mensaje: e.target.value })}
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
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {step.opciones?.map((option, optionIndex) => (
                          <Draggable
                            key={optionIndex.toString()}
                            draggableId={`option-${optionIndex}`}
                            index={optionIndex}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                              >
                                <Card className="mb-3">
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
                                          onChange={(e) => updateOption(optionIndex, 'valor', e.target.value)}
                                          placeholder="Valor"
                                          style={{ width: '100px' }}
                                        />
                                        <Form.Control
                                          type="text"
                                          value={option.mensaje}
                                          onChange={(e) => updateOption(optionIndex, 'mensaje', e.target.value)}
                                          placeholder="Mensaje"
                                        />
                                      </div>

                                      <DragDropContext onDragEnd={(result) => handleNextStepsDragEnd(result, optionIndex)}>
                                        <Droppable droppableId={`option-${optionIndex}`}>
                                          {(provided) => (
                                            <div
                                              {...provided.droppableProps}
                                              ref={provided.innerRef}
                                            >
                                              {option.proximo_paso?.map((nextStep, stepIndex) => (
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
                                                            onStepChange={(newStep) => updateNextStep(optionIndex, stepIndex, newStep)}
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

// import React, { useState } from 'react';
// import { Form, Button, Card, Collapse } from 'react-bootstrap';
// import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChevronDown, faChevronRight, faGripVertical } from '@fortawesome/free-solid-svg-icons';
// import { Step, StepType, StepTypesData, Option } from '../../types/index';

// interface StepBuilderProps {
//   step: Step;
//   onStepChange: (step: Step) => void;
//   onDelete?: () => void;
//   depth?: number;
//   newOpcion?: boolean;
// }

// export const StepBuilder: React.FC<StepBuilderProps> = ({
//   step,
//   onStepChange,
//   onDelete,
//   depth = 0,
//   newOpcion
// }) => {
//   const [isExpanded, setIsExpanded] = useState(true);
//   const [expandedOptions, setExpandedOptions] = useState<{ [key: number]: boolean }>({});

//   const stepTypes: StepType[] = [
//     'mensaje',
//     'seleccion_lista',
//     'seleccion_botones',
//     'entrada_numero',
//     'entrada_texto',
//     'entrada_imagen'
//   ];
//   // aqui everto
//   const stepTypesData: StepTypesData[] = [
//     'texto',
//     'numero',
//     'imagen',
//     'telefono'
//   ];

//   const toggleOption = (optionIndex: number) => {
//     setExpandedOptions(prev => ({
//       ...prev,
//       [optionIndex]: !prev[optionIndex]
//     }));
//   };

//   const addOption = () => {
//     const newOption = {
//       valor: step.opciones?.length ? String(step.opciones.length + 1) : "1",
//       mensaje: '',
//       proximo_paso: []
//     };

//     onStepChange({
//       ...step,
//       opciones: [...(step.opciones || []), newOption]
//     });
//   };

//   const updateOption = (index: number, field: keyof Option, value: any) => {
//     if (!step.opciones) return;

//     const newOptions = [...step.opciones];
//     newOptions[index] = { ...newOptions[index], [field]: value };

//     onStepChange({
//       ...step,
//       opciones: newOptions
//     });
//   };

//   const handleDragEnd = (result: any, optionIndex: number) => {
//     if (!result.destination || !step.opciones) return;

//     const option = step.opciones[optionIndex];
//     if (!option.proximo_paso) return;

//     const items = Array.from(option.proximo_paso);
//     const [reorderedItem] = items.splice(result.source.index, 1);
//     items.splice(result.destination.index, 0, reorderedItem);

//     const newOptions = [...step.opciones];
//     newOptions[optionIndex] = {
//       ...option,
//       proximo_paso: items
//     };

//     onStepChange({
//       ...step,
//       opciones: newOptions
//     });
//   };

//   const addNextStep = (optionIndex: number) => {
//     if (!step.opciones) return;

//     const newOptions = [...step.opciones];
//     const option = newOptions[optionIndex];

//     newOptions[optionIndex] = {
//       ...option,
//       proximo_paso: [
//         ...(option.proximo_paso || []),
//         { mensaje: '', tipo: 'mensaje' }
//       ]
//     };

//     onStepChange({
//       ...step,
//       opciones: newOptions
//     });
//   };

//   const updateNextStep = (optionIndex: number, stepIndex: number, newStep: Step) => {
//     if (!step.opciones) return;

//     const newOptions = [...step.opciones];
//     const option = newOptions[optionIndex];

//     if (!option.proximo_paso) return;

//     const newNextSteps = [...option.proximo_paso];
//     newNextSteps[stepIndex] = newStep;

//     newOptions[optionIndex] = {
//       ...option,
//       proximo_paso: newNextSteps
//     };

//     onStepChange({
//       ...step,
//       opciones: newOptions
//     });
//   };

//   const deleteNextStep = (optionIndex: number, stepIndex: number) => {
//     if (!step.opciones) return;

//     const newOptions = [...step.opciones];
//     const option = newOptions[optionIndex];

//     if (!option.proximo_paso) return;

//     const newNextSteps = option.proximo_paso.filter((_, idx) => idx !== stepIndex);

//     newOptions[optionIndex] = {
//       ...option,
//       proximo_paso: newNextSteps
//     };

//     onStepChange({
//       ...step,
//       opciones: newOptions
//     });
//   };

//   return (
//     <div className={`border-start ps-3 mb-3 ${depth > 0 ? 'ms-3' : ''}`}>
//       <div className="mb-3">
//         <div className="">
//           {depth > 0 && (
//             <Button
//               variant="link"
//               className="p-0 me-2"
//               onClick={() => setIsExpanded(!isExpanded)}
//               style={{ color: 'inherit' }}
//             >
//               <FontAwesomeIcon icon={isExpanded ? faChevronDown : faChevronRight} />
//             </Button>
//           )}
//           <div className="row">
//             <div className="col-md-11">
//               <Form.Select
//                 value={step.tipo}
//                 onChange={(e) => onStepChange({ ...step, tipo: e.target.value as StepType })}
//               // style={{ width: 'auto' }}
//               >
//                 {stepTypes.map(type => (
//                   <option key={type} value={type}>
//                     {type.replace('_', ' ').toUpperCase()}
//                   </option>
//                 ))}
//               </Form.Select>

//               {/* aqui va el tipo everto */}
//               <Form.Select
//                 className="mt-2"
//                 value={step.tipo_entrada}
//                 onChange={(e) => onStepChange({ ...step, tipo_entrada: e.target.value as StepType })}
//               // style={{ width: 'auto' }}
//               >
//                 {stepTypesData.map(type => (
//                   <option key={type} value={type}>
//                     {type.replace('_', ' ').toUpperCase()}
//                   </option>
//                 ))}
//               </Form.Select>

//               <Form.Control
//                 type="text"
//                 className="mt-2"
//                 value={step.mensaje}
//                 onChange={(e) => onStepChange({ ...step, mensaje: e.target.value })}
//                 placeholder="Mensaje"
//               />
//             </div>
//             <div className="col-md-1">

//               {onDelete && (
//                 <Button
//                   variant="danger"
//                   onClick={onDelete}
//                   size="sm"
//                 >
//                   ×
//                 </Button>
//               )}
//             </div>
//           </div>


//         </div>

//         <Collapse in={isExpanded}>
//           <div>
//             {(step.tipo === 'seleccion_lista' || step.tipo === 'seleccion_botones') && (
//               <div className="mt-3">
//                 {step.opciones?.map((option, optionIndex) => (
//                   <Card key={optionIndex} className="mb-3">
//                     <Card.Header className="d-flex justify-content-between align-items-center py-2">
//                       <div className="d-flex gap-2 align-items-center">
//                         <Button
//                           variant="link"
//                           className="p-0"
//                           onClick={() => toggleOption(optionIndex)}
//                           style={{ color: 'inherit' }}
//                         >
//                           <FontAwesomeIcon icon={expandedOptions[optionIndex] ? faChevronDown : faChevronRight} />
//                         </Button>
//                         <span>Opción {optionIndex + 1}</span>
//                       </div>
//                     </Card.Header>
//                     <Collapse in={expandedOptions[optionIndex]}>
//                       <Card.Body>
//                         <div className="d-flex gap-2 mb-3">
//                           <Form.Control
//                             type="text"
//                             value={option.valor}
//                             onChange={(e) => updateOption(optionIndex, 'valor', e.target.value)}
//                             placeholder="Valor"
//                             style={{ width: '100px' }}
//                           />
//                           <Form.Control
//                             type="text"
//                             value={option.mensaje}
//                             onChange={(e) => updateOption(optionIndex, 'mensaje', e.target.value)}
//                             placeholder="Mensaje"
//                           />
//                         </div>

//                         <DragDropContext onDragEnd={(result) => handleDragEnd(result, optionIndex)}>
//                           <Droppable droppableId={`option-${optionIndex}`}>
//                             {(provided) => (
//                               <div
//                                 {...provided.droppableProps}
//                                 ref={provided.innerRef}
//                               >
//                                 {option.proximo_paso?.map((nextStep, stepIndex) => (
//                                   <Draggable
//                                     key={`${optionIndex}-${stepIndex}`}
//                                     draggableId={`${optionIndex}-${stepIndex}`}
//                                     index={stepIndex}
//                                   >
//                                     {(provided) => (
//                                       <div
//                                         ref={provided.innerRef}
//                                         {...provided.draggableProps}
//                                       >
//                                         <div className="d-flex align-items-start">
//                                           <div
//                                             {...provided.dragHandleProps}
//                                             className="me-3"
//                                             style={{ cursor: 'grab' }}
//                                           >
//                                             <FontAwesomeIcon icon={faGripVertical} />
//                                           </div>
//                                           <div className="flex-grow-1">
//                                             <StepBuilder
//                                               key={stepIndex}
//                                               step={nextStep}
//                                               onStepChange={(newStep) => updateNextStep(optionIndex, stepIndex, newStep)}
//                                               onDelete={() => deleteNextStep(optionIndex, stepIndex)}
//                                               depth={depth + 1}
//                                             />
//                                           </div>
//                                         </div>
//                                       </div>
//                                     )}
//                                   </Draggable>
//                                 ))}
//                                 {provided.placeholder}
//                               </div>
//                             )}
//                           </Droppable>
//                         </DragDropContext>

//                         <Button
//                           variant="primary"
//                           onClick={() => addNextStep(optionIndex)}
//                           size="sm"
//                           className="mt-2"
//                         >
//                           + Agregar Próximo Paso
//                         </Button>
//                       </Card.Body>
//                     </Collapse>
//                   </Card>
//                 ))}
//                 {!newOpcion && (
//                   <Button
//                     variant="secondary"
//                     onClick={addOption}
//                     size="sm"
//                   >
//                     + Agregar Opción
//                   </Button>
//                 )}
//               </div>
//             )}
//           </div>
//         </Collapse>
//       </div>
//     </div>
//   );
// };
