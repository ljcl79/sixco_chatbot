// ===================================
// Interfaces para Acciones y Elementos
// ===================================

/**
* Representa un elemento de acción en una estructura jerárquica
* @interface ActionItem
*/
export interface ActionItem {
  /** Identificador único del elemento */
  id: string;
  /** Título o nombre del elemento */
  title: string;
  /** Sub-elementos opcionales */
  children?: ActionItem[];
}

/**
* Props para el componente de elemento de acción
* @interface ActionItemProps
*/
export interface ActionItemProps {
  /** Elemento a mostrar */
  item: ActionItem;
  /** Nivel de profundidad en la jerarquía */
  level: number;
  /** Callback para agregar un hijo */
  onAddChild: (parentId: string) => void;
  /** Callback para eliminar el elemento */
  onDelete: (id: string) => void;
  /** Callback para editar el título */
  onEdit: (id: string, newTitle: string) => void;
}

// ===================================
// Interfaces para Flujos y Pasos
// ===================================

/**
* Representa una opción en un paso del flujo
* @interface Option
*/
export interface Option {
  /** Valor de la opción (puede ser string o número) */
  valor: string | number;
  /** Mensaje a mostrar */
  mensaje: string;
  /** Pasos siguientes opcionales */
  proximo_paso?: Step[];
}

/**
* Representa un paso en el flujo
* @interface Step
*/
export interface Step {
  /** Mensaje principal del paso */
  mensaje: string;
  /** Tipo de paso */
  tipo: string;
  /** Tipo de entrada (opcional) */
  tipo_entrada?: string;
  /** Opciones disponibles (opcional) */
  opciones?: Option[];
  /** Indica si es el paso final */
  final_flujo?: boolean;
}

// ===================================
// Tipos de Pasos y Entradas
// ===================================

/**
* Tipos de pasos disponibles en el flujo
* @type StepType
*/
export type StepType =
  | 'mensaje'
  | 'seleccion_lista'
  | 'seleccion_botones'
  | 'entrada_numero'
  | 'entrada_texto'
  | 'entrada_imagen';

/**
* Tipos de datos para entradas
* @type StepTypesData
*/
export type StepTypesData =
  'texto' |
  'numero' |
  'imagen' |
  'telefono';

// ===================================
// Props para Componentes de Modal y Pasos
// ===================================

/**
* Props para el modal de nuevo paso
* @interface NewStepModalProps
*/
export interface NewStepModalProps {
  /** Controla la visibilidad del modal */
  show: boolean;
  /** Callback para cerrar el modal */
  onHide: () => void;
  /** Callback para guardar el paso */
  onSave: (newStep: Step, id?: string) => void;
  /** ID opcional para edición */
  id?: string;
}

/**
* Props para el componente de paso
* @interface StepItemProps
*/
export interface StepItemProps {
  /** Paso a mostrar */
  step: Step;
  /** Índice en la lista */
  index: number;
  /** ID del paso padre */
  parentId: string;
  /** Callback para agregar opción */
  onAddOption: (stepIndex: number) => void;
}

/**
* Props para el componente de opción
* @interface OptionItemProps
*/
export interface OptionItemProps {
  /** Opción a mostrar */
  option: Option;
  /** Índice en la lista */
  index: number;
  /** ID de la opción padre */
  parentId: string;
  /** Callback opcional para agregar siguiente paso */
  onAddNextStep?: (optionIndex: number) => void;
}

// ===================================
// Interfaces para Gestión de Flujos
// ===================================

/**
* Representa un flujo de trabajo
* @interface Flow
* @description Define la estructura básica de un flujo con su identificador,
* nombre y estado de activación
*/
export interface Flow {
  /** Identificador único del flujo (opcional para nuevos flujos) */
  id?: number;
  /** Nombre descriptivo del flujo */
  nombre: string;
  /** Estado de activación del flujo */
  activo: boolean;
}

/**
* Props para el modal de gestión de flujos
* @interface FlowModalProps
* @description Define las propiedades necesarias para el componente modal
* que maneja la creación y edición de flujos
*/
export interface FlowModalProps {
  /** 
   * Modo de operación del modal
   * - 'create': Para crear un nuevo flujo
   * - 'edit': Para editar un flujo existente
   */
  mode: 'create' | 'edit';
  /** 
   * Datos iniciales del flujo (requerido para edición)
   * @optional
   */
  initialData?: Flow;
  /** 
   * Callback ejecutado al cerrar el modal
   * @optional
   */
  onClose?: () => void;
}


// ===================================
// Interfaces para Operaciones de Flujos
// ===================================

/**
* Datos necesarios para crear un nuevo flujo
* @interface CreateFlowData
* @description Define la estructura de datos requerida para crear un flujo,
* omitiendo el id que será generado por el servidor
*/
export interface CreateFlowData {
  /** Nombre del nuevo flujo */
  nombre: string;
  /** Estado inicial de activación */
  activo: boolean;
}

/**
* Datos necesarios para actualizar un flujo existente
* @interface UpdateFlowData
* @description Define la estructura de datos permitida para actualizar un flujo,
* excluyendo el id que se proporciona por separado
*/
export interface UpdateFlowData {
  /** Nuevo nombre del flujo */
  nombre: string;
  /** Nuevo estado de activación */
  activo: boolean;
}

/**
* Tipo del contexto para la gestión de flujos
* @interface FlowsContextType
* @description Define la estructura del contexto que proporciona
* funcionalidades de gestión de flujos a toda la aplicación
*/
export interface FlowsContextType {
  /** Lista de todos los flujos disponibles */
  flows: Flow[];
  
  /** Función para actualizar la lista de flujos */
  setFlow: React.Dispatch<React.SetStateAction<Flow[]>>;
  
  /** Indica si hay una operación en curso */
  isLoading: boolean;
  
  /** Almacena errores si ocurren durante las operaciones */
  error: Error | null;
  
  /** 
   * Crea un nuevo flujo
   * @param newFlow Datos del nuevo flujo
   * @returns Promesa void que se resuelve cuando se completa la creación
   */
  createFlow: (newFlow: CreateFlowData) => Promise<void>;
  
  /** 
   * Actualiza un flujo existente
   * @param id ID del flujo a actualizar
   * @param newFlow Nuevos datos del flujo
   * @returns Promesa void que se resuelve cuando se completa la actualización
   */
  updateFlow: (id: number, newFlow: UpdateFlowData) => Promise<void>;
  
  /** 
   * Elimina un flujo
   * @param id ID del flujo a eliminar
   * @returns Promesa void que se resuelve cuando se completa la eliminación
   */
  deleteFlow: (id: number) => Promise<void>;
}