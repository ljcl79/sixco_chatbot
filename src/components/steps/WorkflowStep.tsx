import React, { useState } from 'react';
import type { Step, Option } from '../types/index';

interface WorkflowStepProps {
  step: Step;
  onNext: (option?: Option) => void;
}

export const WorkflowStep: React.FC<WorkflowStepProps> = ({ step, onNext }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const renderStepContent = () => {
    switch (step.tipo) {
      case 'mensaje':
        return (
          <div className="mb-4">
            <p className="text-lg">{step.mensaje}</p>
            <button
              onClick={() => onNext()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Continuar
            </button>
          </div>
        );

      case 'seleccion_lista':
        return (
          <div className="space-y-4">
            <p className="text-lg font-medium">{step.mensaje}</p>
            <div className="space-y-2">
              {step.opciones?.map((option) => (
                <button
                  key={option.valor}
                  onClick={() => onNext(option)}
                  className="w-full text-left px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
                >
                  {option.mensaje}
                </button>
              ))}
            </div>
          </div>
        );

      case 'seleccion_botones':
        return (
          <div className="space-y-4">
            <p className="text-lg font-medium">{step.mensaje}</p>
            <div className="flex space-x-4">
              {step.opciones?.map((option) => (
                <button
                  key={option.valor}
                  onClick={() => onNext(option)}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {option.mensaje}
                </button>
              ))}
            </div>
          </div>
        );

      case 'entrada_numero':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-lg font-medium">{step.mensaje}</p>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Continuar
            </button>
          </form>
        );

      case 'entrada_texto':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-lg font-medium">{step.mensaje}</p>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              rows={4}
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Continuar
            </button>
          </form>
        );

      case 'entrada_imagen':
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-lg font-medium">{step.mensaje}</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.files?.[0] || null)}
              className="w-full"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Continuar
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {renderStepContent()}
    </div>
  );
};