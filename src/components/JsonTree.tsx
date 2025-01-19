/**
* Componente de visualización en árbol para la estructura de flujos de trabajo
* Permite visualizar jerárquicamente los pasos y opciones de un flujo
*/

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronDown,
    faChevronRight,
    faCircle,
    faComments,
    faImage,
    faList,
    faArrowDown19,
} from '@fortawesome/free-solid-svg-icons';

/**
* Props para el nodo del árbol
* @interface TreeNodeProps
*/
interface TreeNodeProps {
    /** Datos del nodo a renderizar */
    data: any;
    /** Nivel de profundidad en el árbol */
    level?: number;
}

/**
* Componente que renderiza un nodo individual del árbol
* @component TreeNode
* @description Maneja la visualización recursiva de nodos y sus hijos
*/
const TreeNode = ({ data, level = 0 }: TreeNodeProps) => {
    // Control del estado de expansión del nodo
    const [isOpen, setIsOpen] = useState(false);

    /**
     * Verifica si un nodo tiene hijos
     * @param node - Nodo a verificar
     * @returns {boolean} True si el nodo tiene hijos
     */
    const hasChildren = (node: any) => {
        return (node.proximo_paso && node.proximo_paso.length > 0) ||
            (node.opciones && node.opciones.length > 0);
    };

    /**
     * Obtiene el ícono correspondiente al tipo de nodo
     * @param type - Tipo de nodo
     * @returns Ícono de FontAwesome correspondiente
     */
    const getNodeIcon = (type: string) => {
        switch (type) {
            case 'mensaje': return faComments;
            case 'entrada_texto': return faComments;
            case 'entrada_imagen': return faImage;
            case 'seleccion_lista': return faList;
            case 'seleccion_botones': return faList;
            case 'entrada_numero': return faArrowDown19;
            default: return faCircle;
        }
    };

    /**
     * Genera el texto a mostrar para un nodo
     * @param node - Nodo a procesar
     * @returns {string} Texto formateado del nodo
     */
    const renderNodeContent = (node: any) => {
        let displayText = node.mensaje || '';
        if (node.valor) {
            displayText = `${displayText} (Opción ${node.valor})`;
        }
        return displayText;
    };

    const renderNode = (node, key) => {
        const paddingLeft = `${level * 20}px`;
        const hasNodeChildren = hasChildren(node);

        return (
            <div key={key} className="relative">
                <div className="relative">
                    {level > 0 && (
                        <div
                            className="absolute left-[10px] top-0 bottom-1/2 w-px bg-gray-300"
                            style={{ left: `${(level * 20) - 10}px` }}
                        />
                    )}

                    <div
                        className="shadow-sm p-3 mb-2 bg-body-tertiary rounded"
                        style={{ marginLeft: paddingLeft }}
                    >
                        <div
                            className="cursor-pointer d-flex"
                            onClick={() => hasNodeChildren && setIsOpen(!isOpen)}
                        >

                            {hasNodeChildren ? (
                                <span className="mr-3 w-4 h-4 flex items-center justify-center pe-2">
                                    <FontAwesomeIcon
                                        icon={isOpen ? faChevronDown : faChevronRight}
                                        className="text-gray-600"
                                    />
                                </span>
                            ) : (
                                <span className="mr-3 w-4 h-4 flex items-center justify-center pe-2">
                                    <FontAwesomeIcon
                                        icon={getNodeIcon(node.tipo)}
                                        className="text-gray-500 text-xs"
                                    />
                                </span>
                            )}

                            <div className="flex-1">
                                <span className="font-medium text-gray-800">
                                    {renderNodeContent(node)}
                                </span>

                                {node.tipo && (
                                    <span className="ml-2 text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                                        {node.tipo}
                                    </span>
                                )}
                            </div>
                        </div>


                    </div>
                </div>

                {hasNodeChildren && isOpen && (
                    <div className="relative">
                        {node.proximo_paso?.map((child, index) => (
                            <TreeNode
                                key={`${key}-child-${index}`}
                                data={child}
                                level={level + 1}
                            />
                        ))}
                        {node.opciones?.map((option, index) => (
                            <TreeNode
                                key={`${key}-option-${index}`}
                                data={option}
                                level={level + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return renderNode(data, 'root');
};

/**
* Props para el componente principal
* @interface JsonTreeViewProps
*/
interface JsonTreeViewProps {
    /** Datos a mostrar en el árbol */
    data: any[];
}

/**
* Componente principal que muestra la estructura de árbol
* @component JsonTreeView
* @description Renderiza una vista jerárquica de los pasos del flujo
*/
const JsonTreeView = ({ data }: JsonTreeViewProps) => {
    return (
        <div className="shadow p-3 mb-5 bg-body-tertiary rounded p-5">
            <div className="p-6">
                <h4 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                    <FontAwesomeIcon icon={faComments} className="mr-3 text-blue-500" />
                    Flujo de Navegación
                </h4>
                <div className="overflow-auto max-h-[700px] pr-4">
                    {data.map((item, index) => (
                        <TreeNode key={index} data={item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JsonTreeView;