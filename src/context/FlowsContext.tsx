import React, { createContext, useEffect, useState, ReactNode, useContext } from "react";
import axiosInstance from '../axiosConfig';

export interface Flow {
    id: number;  // Cambiamos esto, eliminamos el id como función
    id_flujo?: number;
    nombre: string;
    activo: boolean;
}

// Agregamos interfaces para crear y actualizar
export interface CreateFlowData {
    nombre: string;
    activo: boolean;
}

export interface UpdateFlowData {
    nombre: string;
    activo: boolean;
}

export interface FlowsContextType {
    flows: Flow[];
    setFlow: React.Dispatch<React.SetStateAction<Flow[]>>;
    isLoading: boolean;
    error: Error | null;
    createFlow: (newFlow: CreateFlowData) => Promise<void>;  // Cambiamos el tipo aquí
    updateFlow: (id: number, newFlow: UpdateFlowData) => Promise<void>;  // Y aquí
    deleteFlow: (id: number) => Promise<void>;
}

const FlowsContext = createContext<FlowsContextType>({
    flows: [],
    setFlow: () => { },
    isLoading: false,
    error: null,
    createFlow: async () => { },
    updateFlow: async () => {

    },
    deleteFlow: async () => {

    }
});

export const useFlows = () => {
    const context = useContext(FlowsContext);
    if (!context) {
        throw new Error('useFlow debe ser usado dentro de un FlowsProvider');
    }
    return context;
};

type FlowsProviderProps = {
    children: ReactNode;
};

export const FlowsProvider = ({ children }: FlowsProviderProps) => {
    const [flows, setFlow] = useState<Flow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const getData = async (showLoading = true) => {
        try {
            if (showLoading) setIsLoading(true);

            const response = await axiosInstance.get('/api/flujos');
            console.log(response)

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
    const updateFlow = async (id: number, newFlow: UpdateFlowData) => {
        try {
            console.log(id,newFlow)
            const response = await axiosInstance.put(`/api/flujos/${id}`, newFlow);
            if (!response.status) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await getData(false);
        } catch (err) {
            throw new Error(`Ocurrió un error al actualizar el flujo`);
        }
    };
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

    useEffect(() => {
        getData();
    }, []);

    const value = {
        flows,
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