import React, { createContext, useEffect, useState, ReactNode, useContext } from "react";
import axiosInstance from '../axiosConfig';

interface Flow {
    id_flujo?: number;
    nombre: string;
    activo: boolean;
}

interface FlowsContextType {
    flows: Flow[];
    setFlow: React.Dispatch<React.SetStateAction<Flow[]>>;
    isLoading: boolean;
    error: Error | null;
    createFlow: (newFlow: Flow) => Promise<void>;
}

const FlowsContext = createContext<FlowsContextType>({
    flows: [],
    setFlow: () => { },
    isLoading: false,
    error: null,
    createFlow: async () => { }
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

    const getData = async () => {
        try {
            setIsLoading(true);

            const response = await axiosInstance.get('api/flows');
            console.log(response)

            if (!response.status) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setFlow(response.data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Error desconocido al obtener los flujos'));
        } finally {
            setIsLoading(false);
        }
    };
    const createFlow = async (newFlow: Flow) => {
        try {
            const response = await axiosInstance.post('api/flows', newFlow);
            if (!response.status) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            await getData();

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
        createFlow
    };

    return (
        <FlowsContext.Provider value={value}>
            {children}
        </FlowsContext.Provider>
    );
};

export default FlowsProvider;