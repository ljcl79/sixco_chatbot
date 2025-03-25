/**
* Contexto para la gestión de flujos de trabajo
* Proporciona funcionalidades CRUD y estado global para los flujos
*/

import { createContext, useEffect, useState, ReactNode, useContext } from "react";
import axiosInstance from '../axiosConfig';
import { FlowsContextType, CreateFlowData, UpdateFlowData, Flow, Action } from "../types/index";

/**
* Contexto inicial para flujos con valores por defecto
*/
const FlowsContext = createContext<FlowsContextType>({
    flows: [],
    actions: [],
    setFlow: () => { },
    isLoading: false,
    error: null,
    createFlow: async () => { },
    updateFlow: async () => { },
    deleteFlow: async () => { }
});

/**
* Hook personalizado para acceder al contexto de flujos
* @throws Error si se usa fuera del FlowsProvider
* @returns Contexto con funcionalidades para gestionar flujos
*/
export const useFlows = () => {
    const context = useContext(FlowsContext);
    if (!context) {
        throw new Error('useFlow debe ser usado dentro de un FlowsProvider');
    }
    return context;
};

/**
* Props para el proveedor de contexto
*/
type FlowsProviderProps = {
    children: ReactNode;
};

/**
* Proveedor de contexto para la gestión de flujos
* @param {FlowsProviderProps} props - Props del componente
*/
export const FlowsProvider = ({ children }: FlowsProviderProps) => {
    // Estado para almacenar los flujos y su estado
    const [flows, setFlow] = useState<Flow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [actions, setActions] = useState<Action[]>([]);

    /**
     * Obtiene los flujos desde el servidor
     * @param {boolean} showLoading - Indica si se debe mostrar el estado de carga
     */
    const getData = async (showLoading = true) => {
        try {
            if (showLoading) setIsLoading(true);
            const response = await axiosInstance.get('/api/flujos');
            if (!response.status) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setFlow(response.data.flujos);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Error desconocido al obtener los flujos'));
        } finally {
            if (showLoading) setIsLoading(false);
        }
    };

    /**
  * Obtiene las acciones desde el servido
  * @param {boolean} showLoading - Indica si se debe mostrar el estado de carga
  */
    const getActions = async (showLoading = true) => {
        try {
            if (showLoading) setIsLoading(true);
            // const response = await axiosInstance.get('/api/actions');
            // if (!response.status) {
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // }
            // setActions(response.data.flujos);
            setActions([{ id: 1, texto: "enviar_datos" }, { id: 2, texto: "insertar_ticket" }, { id: 3, texto: "crear_oportunidad" }])
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Error desconocido al obtener los flujos'));
        } finally {
            if (showLoading) setIsLoading(false);
        }
    };

    /**
     * Crea un nuevo flujo
     * @param {CreateFlowData} newFlow - Datos del nuevo flujo
     */
    const createFlow = async (newFlow: CreateFlowData) => {
        try {
            const response = await axiosInstance.post('/api/flujos', newFlow);
            if (!response.status) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await getData(false);
        } catch (err) {
            throw new Error(`Ocurrió un error al crear el flujo`);
        }
    };

    /**
     * Actualiza un flujo existente
     * @param {number} id - ID del flujo a actualizar
     * @param {UpdateFlowData} newFlow - Nuevos datos del flujo
     */
    const updateFlow = async (id: number, newFlow: UpdateFlowData) => {
        try {
            const response = await axiosInstance.put(`/api/flujos/${id}`, newFlow);
            if (!response.status) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await getData(false);
        } catch (err) {
            throw new Error(`Ocurrió un error al actualizar el flujo`);
        }
    };

    /**
     * Elimina un flujo
     * @param {number} id - ID del flujo a eliminar
     */
    const deleteFlow = async (id: number) => {
        try {
            const response = await axiosInstance.delete(`/api/flujos/${id}`);
            if (!response.status) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await getData(false);
        } catch (err) {
            throw new Error(`Ocurrio un error al crear el flujo`);
        }
    };

    // Cargar flujos al montar el componente
    useEffect(() => {
        getData();
        getActions();
    }, []);

    // Objeto de valor para el contexto
    const value = {
        flows,
        actions,
        setFlow,
        isLoading,
        error,
        createFlow,
        updateFlow,
        deleteFlow
    };

    return (
        <FlowsContext.Provider value={value}>
            {children}
        </FlowsContext.Provider>
    );
};

export default FlowsProvider;