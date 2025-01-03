import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NewStepModal from "../components/steps/NewStepModal";
import axiosInstance from "../axiosConfig";

const FlowDetailViews = () => {
    const { id } = useParams();
    const [steps, setSteps] = useState([]);
    const [error, setError] = useState(null);

    const getSteps = async () => {
        try {
            const response = await axiosInstance.get(`/api/flows/steps/${id}`);
            setSteps(response.data);
        } catch (err) {
            console.error("Error al obtener los pasos:", err.message);
            setError(
                "Ocurrió un error al obtener los pasos. Por favor, inténtalo más tarde."
            );
        }
    };

    const handleNewStepAdded = () => {
        getSteps(); // Volver a cargar los pasos cuando se cree uno nuevo
    };

    useEffect(() => {
        getSteps();
    }, [id]);

    return (
        <div className="container mt-5">
            {error ? (
                <div className="text-center">
                    <h1 className="text-danger">{error}</h1>
                </div>
            ) : (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Pasos del flujo</h2>
                        <NewStepModal id={id} onStepAdded={handleNewStepAdded} />
                    </div>
                    {steps.length > 0 ? (
                        <div className="">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className="mb-5"
                                >
                                    <div className="card shadow h-100">
                                        <div className="card-body">
                                            <h5 className="card-title text-primary">
                                                Paso {index + 1}
                                            </h5>
                                            <p className="card-text">
                                                <strong>Mensaje:</strong> {step.mensaje}
                                            </p>
                                            <p className="card-text">
                                                <strong>Tipo:</strong> {step.tipo}
                                            </p>
                                            <p className="card-text">
                                                <strong>Es final:</strong>{" "}
                                                {step.es_final ? "Sí" : "No"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center mt-5">
                            <h3 className="text-muted">
                                No hay pasos disponibles para este flujo
                            </h3>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default FlowDetailViews;


// import { useParams } from "react-router-dom";
// import { useEffect, useState, ReactNode } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import NewStepModal from "../components/steps/NewStepModal";
// import axiosInstance from "../axiosConfig";


// type StrictModeDroppableProps = {
//     children: ReactNode;
//     droppableId: string;
//     // Puedes agregar más props aquí si es necesario
// };

// const StrictModeDroppable = ({ children, droppableId, ...props }: StrictModeDroppableProps) => {
//     const [enabled, setEnabled] = useState(false);

//     useEffect(() => {
//         const animation = requestAnimationFrame(() => setEnabled(true));
//         return () => {
//             cancelAnimationFrame(animation);
//             setEnabled(false);
//         };
//     }, []);

//     if (!enabled) {
//         return null;
//     }

//     // Pasamos los props a `Droppable` incluyendo `droppableId`
//     return <Droppable droppableId={droppableId} {...props}>{children}</Droppable>;
// };


// const FlowDetailViews = () => {
//     const { id } = useParams();
//     const [steps, setSteps] = useState([]);
//     const [error, setError] = useState(null);

//     const getSteps = async () => {
//         try {
//             const response = await axiosInstance.get(`/api/flows/steps/${id}`);
//             setSteps(response.data);
//             console.log('Pasos cargados:', response.data); // Para debugging
//         } catch (err) {
//             console.error("Error al obtener los pasos:", err.message);
//             setError("Ocurrió un error al obtener los pasos. Por favor, inténtalo más tarde.");
//         }
//     };

//     const handleNewStepAdded = () => {
//         getSteps();
//     };

//     const updateStepOrder = async (startIndex, endIndex) => {
//         try {
//             console.log('aqui llego')
//             const sourceStep = steps[startIndex];
//             const destinationStep = steps[endIndex];
//             console.log(sourceStep)
//             console.log(steps)
//             // // Asegurarse de que ambos pasos existen
//             if (!sourceStep || !destinationStep) {
//                 console.error('Pasos no encontrados:', { sourceStep, destinationStep });
//                 return;
//             }
//             console.log(sourceStep)
//             console.log(destinationStep)

//             // await axiosInstance.post(`/api/flows/connect/${id}`, {
//             //     id_paso_origen: sourceStep.id_paso,
//             //     id_paso_destino: destinationStep.id_paso,
//             //     orden: endIndex + 1
//             // });

//             // // Actualizar el estado local después de la actualización exitosa
//             // const newSteps = Array.from(steps);
//             // const [removed] = newSteps.splice(startIndex, 1);
//             // newSteps.splice(endIndex, 0, removed);
//             // setSteps(newSteps);

//         } catch (error) {
//             console.error("Error al actualizar el orden:", error);
//             setError("Error al actualizar el orden de los pasos");
//         }
//     };

//     const onDragEnd = (result) => {
//         console.log('Drag result:', result); // Para debugging

//         if (!result.destination) return;

//         const sourceIndex = result.source.index;
//         const destinationIndex = result.destination.index;

//         if (sourceIndex === destinationIndex) return;

//         updateStepOrder(sourceIndex, destinationIndex);
//     };

//     useEffect(() => {
//         getSteps();
//     }, [id]);

//     return (
//         <div className="container mt-5">
//             {error ? (
//                 <div className="text-center">
//                     <h1 className="text-danger">{error}</h1>
//                 </div>
//             ) : (
//                 <>
//                     <div className="d-flex justify-content-between align-items-center mb-4">
//                         <h2>Pasos del flujo</h2>
//                         <NewStepModal id={id} onStepAdded={handleNewStepAdded} />
//                     </div>
//                     {steps.length > 0 ? (
//                         <DragDropContext onDragEnd={onDragEnd}>
//                             <StrictModeDroppable droppableId="steps">
//                                 {(provided) => (
//                                     <div
//                                         {...provided.droppableProps}
//                                         ref={provided.innerRef}
//                                         className="steps-container"
//                                     >
//                                         {steps.map((step, index) => (
//                                             <Draggable
//                                                 key={`step-${step.id_paso}`}
//                                                 draggableId={`step-${step.id_paso}`}
//                                                 index={index}
//                                             >
//                                                 {(provided, snapshot) => (
//                                                     <div
//                                                         ref={provided.innerRef}
//                                                         {...provided.draggableProps}
//                                                         className="mb-3"
//                                                     >
//                                                         <div className={`card shadow ${
//                                                             snapshot.isDragging ? 'border-primary' : ''
//                                                         }`}>
//                                                             <div className="card-body">
//                                                                 <div className="d-flex justify-content-between align-items-center">
//                                                                     <h5 className="card-title text-primary mb-0">
//                                                                         Paso {index + 1}
//                                                                     </h5>
//                                                                     <div 
//                                                                         {...provided.dragHandleProps}
//                                                                         className="text-muted cursor-move"
//                                                                     >
//                                                                         ⋮⋮
//                                                                     </div>
//                                                                 </div>
//                                                                 <hr />
//                                                                 <p className="card-text">
//                                                                     <strong>Mensaje:</strong> {step.mensaje}
//                                                                 </p>
//                                                                 <p className="card-text">
//                                                                     <strong>Tipo:</strong> {step.tipo}
//                                                                 </p>
//                                                                 <p className="card-text">
//                                                                     <strong>Es final:</strong>{" "}
//                                                                     {step.es_final ? "Sí" : "No"}
//                                                                 </p>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </Draggable>
//                                         ))}
//                                         {provided.placeholder}
//                                     </div>
//                                 )}
//                             </StrictModeDroppable>
//                         </DragDropContext>
//                     ) : (
//                         <div className="text-center mt-5">
//                             <h3 className="text-muted">
//                                 No hay pasos disponibles para este flujo
//                             </h3>
//                         </div>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// };

// export default FlowDetailViews;