export interface ActionItem {
  id: string;
  title: string;
  children?: ActionItem[];
}

export interface ActionItemProps {
  item: ActionItem;
  level: number;
  onAddChild: (parentId: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
}


export interface Option {
  valor: string | number;
  mensaje: string;
  proximo_paso?: Step[];
}

export interface Step {
  mensaje: string;
  tipo: string;
  tipo_entrada?: string;
  opciones?: Option[];
  final_flujo?: boolean;
}

export type StepType =
  | 'mensaje'
  | 'seleccion_lista'
  | 'seleccion_botones'
  | 'entrada_numero'
  | 'entrada_texto'
  | 'entrada_imagen';

export type StepTypesData =
  'texto' |
  'numero' |
  'imagen' |
  'telefono';


// types.ts
export interface Step {
  mensaje: string;
  tipo: string;
  tipo_entrada?: string;
  es_final?: boolean;
  opciones?: Option[];
}

export interface Option {
  valor: string | number;
  mensaje: string;
  proximo_paso?: Step[];
}

export interface NewStepModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (newStep: Step, id?: string) => void; // Modifica para aceptar un `id` opcional.
  id?: string; // Agrega el `id` como prop opcional.
}

export interface StepItemProps {
  step: Step;
  index: number;
  parentId: string;
  onAddOption: (stepIndex: number) => void;
}

export interface OptionItemProps {
  option: Option;
  index: number;
  parentId: string;
  onAddNextStep?: (optionIndex: number) => void;
}