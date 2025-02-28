/**
* Modal para crear nuevos pasos en el flujo de trabajo
* Permite configurar los diferentes tipos de pasos y sus propiedades
*/

import { Modal, Button, Form } from 'react-bootstrap';
import { Step, NewStepModalProps } from '../../types/index';
import { StepBuilder } from './StepBuilder';

/**
* Modal para crear y configurar nuevos pasos
* @component NewStepModal
* @description Proporciona una interfaz para crear nuevos pasos
* usando el componente StepBuilder para la configuración detallada
* 
* @param {NewStepModalProps} props - Props del componente
* @param {boolean} props.show - Controla la visibilidad del modal
* @param {() => void} props.onHide - Función para cerrar el modal
* @param {(step: Step) => void} props.onSave - Callback para guardar el paso
* @param {Step} props.currentStep - Paso actual siendo editado
* @param {(step: Step) => void} props.setCurrentStep - Función para actualizar el paso actual
* @param {() => void} props.addStep - Función para agregar el paso al flujo
* @param {boolean} props.newOpcion - Indica si es una nueva opción
*/
const NewStepModal = ({ 
   show, 
   onHide, 
   onSave, 
   currentStep, 
   setCurrentStep, 
   addStep,
   newOpcion 
}: NewStepModalProps) => {
   return (
       <Modal 
           show={show} 
           onHide={onHide} 
           centered
       >
           {/* Encabezado del modal */}
           <Modal.Header 
               closeButton 
               style={{ 
                   backgroundColor: '#f8f9fa', 
                   borderBottom: '2px solid #dee2e6' 
               }}
           >
               <Modal.Title style={{ fontWeight: '600' }}>
                   Crear Nuevo Paso
               </Modal.Title>
           </Modal.Header>

           {/* Cuerpo del modal con el constructor de pasos */}
           <Modal.Body style={{ 
               padding: '2rem', 
               backgroundColor: '#fefefe' 
           }}>
               <StepBuilder
                   step={currentStep}
                   onStepChange={setCurrentStep}
                   newOpcion={newOpcion}
               />
           </Modal.Body>

           {/* Pie del modal con acciones */}
           <Modal.Footer style={{ 
               borderTop: '2px solid #dee2e6', 
               backgroundColor: '#f8f9fa' 
           }}>
               <Button 
                   variant="secondary" 
                   onClick={onHide} 
                   style={{ borderRadius: '0.5rem' }}
               >
                   Cerrar
               </Button>
               <Button
                   variant="primary"
                   onClick={addStep}
               >
                   Agregar Paso Principal
               </Button>
           </Modal.Footer>
       </Modal>
   );
};

export default NewStepModal;