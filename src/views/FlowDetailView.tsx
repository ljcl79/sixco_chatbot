import React, { useState } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Step } from './types';
import NewStepModal from '../components/steps/NewStepModal';
import { StepBuilder } from '../components/steps/StepBuilder';

const FlowView = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [currentStep, setCurrentStep] = useState<Step>({
    mensaje: '',
    tipo: 'mensaje'
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAllSteps = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Enviando pasos a la API:', JSON.stringify(steps, null, 2));
      console.log('Pasos guardados exitosamente');
    } catch (error) {
      console.error('Error al guardar los pasos:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addStep = () => {
    setSteps([...steps, currentStep]);
    setCurrentStep({ mensaje: '', tipo: 'mensaje' });
    setShowModal(false)
  };

  const updateStep = (index: number, newStep: Step) => {
    const newSteps = [...steps];
    newSteps[index] = newStep;
    setSteps(newSteps);
  };

  const deleteStep = (index: number) => {
    setSteps(steps.filter((_, idx) => idx !== index));
  };

  const exportJSON = () => {
    const jsonStr = JSON.stringify(steps, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Pasos del Flujo</h2>
        <div className="d-flex gap-2">
          <Button
            variant="success"
            onClick={() => setShowModal(true)}
            className="d-flex align-items-center shadow"
          >
            Agregar Paso
          </Button>
          <Button
            variant="success"
            onClick={exportJSON}
          >
            Exportar JSON
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveAllSteps}
            className="d-flex align-items-center shadow"
            disabled={steps.length === 0 || isSaving}
          >
            {isSaving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              'Guardar Todos los Pasos'
            )}
          </Button>
        </div>
      </div>

      <NewStepModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={() => console.log('Guardar nuevo paso')}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        addStep={addStep}
        newOpcion={true}
      />

      {steps.map((step, index) => (
        <Card key={index} className="mb-3">
          <Card.Body>
            <StepBuilder
              step={step}
              onStepChange={(newStep) => updateStep(index, newStep)}
              onDelete={() => deleteStep(index)}
            />
          </Card.Body>
        </Card>
      ))}

      <Card>
        <Card.Body>
          <Card.Title>Vista Previa JSON</Card.Title>
          <pre className="bg-light p-3 rounded" style={{ maxHeight: '400px', overflow: 'auto' }}>
            {JSON.stringify(steps, null, 2)}
          </pre>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default FlowView;