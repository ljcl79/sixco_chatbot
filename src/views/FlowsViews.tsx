// ===================================
// Vista Principal de Flujos de Trabajo
// ===================================

/**
* @fileoverview Página principal que muestra la lista de flujos de trabajo
* y permite su gestión (crear, editar, eliminar)
*/

import { useFlows } from '../context/FlowsContext';
import { useState } from 'react';
import FlowModal from '../components/flows/FlowModal';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
   faArrowUpRightFromSquare,
   faTrash,
   faPenToSquare,
   faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { Card } from 'react-bootstrap';
import Swal from "sweetalert2";
import LoadingComponent from '../components/layout/LoadingComponent';


/**
* @component ErrorState
* @description Componente que muestra un estado de error con opción de reintentar
* @param {Object} props - Propiedades del componente
* @param {Error} props.error - Objeto de error a mostrar
*/
const ErrorState = ({ error }: { error: Error }) => (
   <div className="container">
       <div className="row justify-content-center">
           <div className="col-md-6">
               <Card className="border-danger shadow-sm mt-5">
                   <Card.Body className="text-center p-5">
                       <FontAwesomeIcon
                           icon={faExclamationTriangle}
                           className="text-danger mb-4"
                           style={{ fontSize: '3rem' }}
                       />
                       <h3 className="text-danger mb-3">¡Ups! Algo salió mal</h3>
                       <p className="text-muted mb-4">
                           {error.message || 'Ha ocurrido un error al cargar los flujos de trabajo'}
                       </p>
                       <button
                           className="btn btn-outline-danger"
                           onClick={() => window.location.reload()}
                       >
                           Intentar nuevamente
                       </button>
                   </Card.Body>
               </Card>
           </div>
       </div>
   </div>
);

/**
* @component FlowsViews
* @description Componente principal que gestiona la visualización y manipulación de flujos
*/
const FlowsViews = () => {
   // ===================================
   // Hooks y Estado
   // ===================================
   const { flows, isLoading, error, deleteFlow } = useFlows();
   const navigate = useNavigate();
   const [selectedFlow, setSelectedFlow] = useState(null);

   // ===================================
   // Manejadores de Eventos
   // ===================================

   /**
    * Maneja la eliminación de un flujo
    * @param {number} id - ID del flujo a eliminar
    */
   const handleDelete = async (id: number) => {
       try {
           // Diálogo de confirmación antes de eliminar
           const result = await Swal.fire({
               title: "¿Estás seguro?",
               text: "No podrás revertir esta acción",
               icon: "warning",
               showCancelButton: true,
               confirmButtonColor: "#3085d6",
               cancelButtonColor: "#d33",
               confirmButtonText: "Sí, eliminar",
               cancelButtonText: "Cancelar"
           });

           if (result.isConfirmed) {
               await deleteFlow(id);
               Swal.fire({
                   icon: "success",
                   title: "¡Eliminado!",
                   text: "El flujo se eliminó exitosamente.",
               });
           }
       } catch (err) {
           Swal.fire({
               icon: "error",
               title: "Error",
               text: err instanceof Error ? err.message : "Ocurrió un error inesperado.",
           });
       }
   };

   // ===================================
   // Renderizado Condicional
   // ===================================
   if (isLoading) return <LoadingComponent title={"Flujos de trabajos"} />;
   if (error) return <ErrorState error={error} />;

   // ===================================
   // Renderizado Principal
   // ===================================
   return (
       <div className="container">
           <h1 className="text-center mt-4 mb-5">FLUJOS DE TRABAJO</h1>
           
           {/* Botón para crear nuevo flujo */}
           <div className="d-flex justify-content-end mb-4 container">
               <FlowModal mode="create" />
           </div>
           
           {/* Grid de tarjetas de flujos */}
           <div className="row layout">
               {flows.map(flow => (
                   <div className="col-md-4 mb-5" key={flow.id}>
                       <div className="card p-5 shadow p-3 mb-2 bg-body-tertiary rounded"
                           style={{ minHeight: '20rem' }}>
                           {/* Botón de navegación a detalle */}
                           <div className="d-flex justify-content-end">
                               <FontAwesomeIcon
                                   className="text-primary click-style"
                                   onClick={() => navigate(`/flujo/${flow.id}`)}
                                   icon={faArrowUpRightFromSquare}
                               />
                           </div>
                           
                           <div className="card-body">
                               <h4 className="card-title text-center mb-5">
                                   {flow.nombre.toUpperCase()}
                               </h4>
                               
                               {/* Acciones y estado del flujo */}
                               <div className="d-flex justify-content-between align-items-center">
                                   <div className="mt-4">
                                       <span className="click-style me-4 mt-5" 
                                             onClick={() => setSelectedFlow(flow)}>
                                           <FontAwesomeIcon className="text-warning" icon={faPenToSquare} />
                                           Editar
                                       </span>
                                       <span className="click-style me-3 mt-5" 
                                             onClick={() => handleDelete(flow.id)}>
                                           <FontAwesomeIcon className="text-danger" icon={faTrash} />
                                           Eliminar
                                       </span>
                                   </div>
                                   
                                   {/* Indicador de estado activo/inactivo */}
                                   <div>
                                       <h4 className={`card-subtitle badge mt-4 
                                           ${flow.activo ? "text-bg-success" : "text-bg-danger"}`}>
                                           {flow.activo ? "Activo" : "Inactivo"}
                                       </h4>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
               ))}
           </div>
           {/* Modal de edición */}
           {selectedFlow && (
                <FlowModal 
                    mode="edit" 
                    initialData={{
                        id: selectedFlow.id,
                        nombre: selectedFlow.nombre,
                        activo: selectedFlow.activo
                    }}
                    onClose={() => setSelectedFlow(null)}
                />
            )}
       </div>
   );
}

export default FlowsViews;