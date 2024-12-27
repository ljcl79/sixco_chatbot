import React, { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { ActionItemProps } from '../types';

 const ActionItem =({ item, level, onAddChild, onDelete, onEdit }: ActionItemProps) =>{
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(item.id, editTitle);
    setIsEditing(false);
  };

  return (
    <div className="ms-4">
      <div className="d-flex align-items-center gap-2 my-2">
        {item.children && item.children.length > 0 && (
          <Button
            variant="link"
            className="p-1 text-decoration-none"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (">"
            ) : (
            ">")}
          </Button>
        )}
        
        {isEditing ? (
          <Form onSubmit={handleSubmit} className="d-flex align-items-center gap-2">
            <InputGroup size="sm">
              <Form.Control
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                autoFocus
              />
              <Button variant="success" type="submit">
                Save
              </Button>
            </InputGroup>
          </Form>
        ) : (
          <div className="d-flex align-items-center gap-2 flex-grow-1">
            <span className="fw-medium">{item.title}</span>
            <div className="">
              <Button
                variant="link"
                className="p-1 text-success"
                onClick={() => setIsEditing(true)}
              >
               editar
              </Button>
              <Button
                variant="link"
                className="p-1 text-primary"
                onClick={() => onAddChild(item.id)}
              >
                agregar
              </Button>
              <Button
                variant="link"
                className="p-1 text-danger"
                onClick={() => onDelete(item.id)}
              >
               borrar
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {isExpanded && item.children && (
        <div className="ms-4 border-start border-2">
          {item.children.map((child) => (
            <ActionItem
              key={child.id}
              item={child}
              level={level + 1}
              onAddChild={onAddChild}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ActionItem