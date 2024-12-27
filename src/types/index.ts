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