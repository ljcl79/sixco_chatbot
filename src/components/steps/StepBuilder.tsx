import React from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { Step, StepType, Option } from '../../types/index';

interface StepBuilderProps {
  step: Step;
  onStepChange: (step: Step) => void;
  onDelete?: () => void;
  depth?: number;
}

export const StepBuilder: React.FC<StepBuilderProps> = ({ 
  step, 
  onStepChange, 
  onDelete,
  depth = 0,
  newOpcion
}) => {
  const stepTypes: StepType[] = [
    'mensaje',
    'seleccion_lista',
    'seleccion_botones',
    'entrada_numero',
    'entrada_texto',
    'entrada_imagen'
  ];

  const addOption = () => {
    const newOption = {
      valor: step.opciones?.length ? String(step.opciones.length + 1) : "1",
      mensaje: '',
      proximo_paso: []
    };
    
    onStepChange({
      ...step,
      opciones: [...(step.opciones || []), newOption]
    });
  };

  const updateOption = (index: number, field: keyof Option, value: any) => {
    if (!step.opciones) return;
    
    const newOptions = [...step.opciones];
    newOptions[index] = { ...newOptions[index], [field]: value };
    
    onStepChange({
      ...step,
      opciones: newOptions
    });
  };

  const addNextStep = (optionIndex: number) => {
    if (!step.opciones) return;
    
    const newOptions = [...step.opciones];
    const option = newOptions[optionIndex];
    
    newOptions[optionIndex] = {
      ...option,
      proximo_paso: [
        ...(option.proximo_paso || []),
        { mensaje: '', tipo: 'mensaje' }
      ]
    };
    
    onStepChange({
      ...step,
      opciones: newOptions
    });
  };

  const updateNextStep = (optionIndex: number, stepIndex: number, newStep: Step) => {
    if (!step.opciones) return;
    
    const newOptions = [...step.opciones];
    const option = newOptions[optionIndex];
    
    if (!option.proximo_paso) return;
    
    const newNextSteps = [...option.proximo_paso];
    newNextSteps[stepIndex] = newStep;
    
    newOptions[optionIndex] = {
      ...option,
      proximo_paso: newNextSteps
    };
    
    onStepChange({
      ...step,
      opciones: newOptions
    });
  };

  const deleteNextStep = (optionIndex: number, stepIndex: number) => {
    if (!step.opciones) return;
    
    const newOptions = [...step.opciones];
    const option = newOptions[optionIndex];
    
    if (!option.proximo_paso) return;
    
    const newNextSteps = option.proximo_paso.filter((_, idx) => idx !== stepIndex);
    
    newOptions[optionIndex] = {
      ...option,
      proximo_paso: newNextSteps
    };
    
    onStepChange({
      ...step,
      opciones: newOptions
    });
  };

  return (
    <div className={`border-start ps-3 mb-3 ${depth > 0 ? 'ms-3' : ''}`}>
      <div className="mb-3">
        <div className="d-flex gap-2 align-items-center">
          <Form.Select
            value={step.tipo}
            onChange={(e) => onStepChange({ ...step, tipo: e.target.value as StepType })}
            style={{ width: 'auto' }}
          >
            {stepTypes.map(type => (
              <option key={type} value={type}>
                {type.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </Form.Select>
          
          <Form.Control
            type="text"
            value={step.mensaje}
            onChange={(e) => onStepChange({ ...step, mensaje: e.target.value })}
            placeholder="Mensaje"
          />
          
          {onDelete && (
            <Button
              variant="danger"
              onClick={onDelete}
              size="sm"
            >
              ×
            </Button>
          )}
        </div>

        {(step.tipo === 'seleccion_lista' || step.tipo === 'seleccion_botones') && (
          <div className="mt-3">
            {step.opciones?.map((option, optionIndex) => (
              <Card key={optionIndex} className="mb-3">
                <Card.Body>
                  <div className="d-flex gap-2 mb-3">
                    <Form.Control
                      type="text"
                      value={option.valor}
                      onChange={(e) => updateOption(optionIndex, 'valor', e.target.value)}
                      placeholder="Valor"
                      style={{ width: '100px' }}
                    />
                    <Form.Control
                      type="text"
                      value={option.mensaje}
                      onChange={(e) => updateOption(optionIndex, 'mensaje', e.target.value)}
                      placeholder="Mensaje"
                    />
                  </div>

                  {option.proximo_paso?.map((nextStep, stepIndex) => (
                    <StepBuilder
                      key={stepIndex}
                      step={nextStep}
                      onStepChange={(newStep) => updateNextStep(optionIndex, stepIndex, newStep)}
                      onDelete={() => deleteNextStep(optionIndex, stepIndex)}
                      depth={depth + 1}
                    />
                  ))}

                  <Button
                    variant="primary"
                    onClick={() => addNextStep(optionIndex)}
                    size="sm"
                    className="mt-2"
                  >
                    + Agregar Próximo Paso
                  </Button>
                </Card.Body>
              </Card>
            ))}
            {
              newOpcion != true &&
              <Button
              variant="secondary"
              onClick={addOption}
              size="sm"
            >
              + Agregar Opción
            </Button>
            }
            
          </div>
        )}
      </div>
    </div>
  );
};