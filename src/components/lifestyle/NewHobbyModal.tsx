'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { X, Plus, Trash2, Calendar, Target, Sparkles, ListPlus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NewHobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewHobbyModal({ isOpen, onClose }: NewHobbyModalProps) {
  const { addHobbyProject, triggerHaptic } = useApp();

  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('Música');
  const [milestones, setMilestones] = useState<string[]>([
    'Definir objetivo y plan de práctica',
    'Completar primera fase o tema guía',
  ]);
  const [newMilestoneText, setNewMilestoneText] = useState('');

  const handleAddMilestone = () => {
    if (!newMilestoneText.trim()) return;
    triggerHaptic(20);
    setMilestones((prev) => [...prev, newMilestoneText.trim()]);
    setNewMilestoneText('');
  };

  const handleRemoveMilestone = (index: number) => {
    triggerHaptic(20);
    setMilestones((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    triggerHaptic([30, 50, 70]);
    addHobbyProject({
      title: title.trim(),
      deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      milestones: milestones.filter((m) => m.trim().length > 0),
      category,
    });

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#d62725', '#f67f00', '#fcbf48', '#ebe2b7'],
    });

    // Reset and close
    setTitle('');
    setDeadline('');
    setMilestones([
      'Definir objetivo y plan de práctica',
      'Completar primera fase o tema guía',
    ]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-hobby-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
        >
          <motion.div
            layoutId="shared-new-hobby-modal"
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg rounded-[var(--radius-card)] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] shadow-2xl p-6 space-y-6 relative max-h-[90vh] overflow-y-auto"
          >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#d62725] text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 id="new-hobby-modal-title" className="text-base font-black text-[var(--text-primary)]">
                Nuevo Proyecto / Hobby
              </h3>
              <p className="text-xs text-neutral-400">
                Crea, desglosa en hitos y mide el progreso de tus pasiones
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic(20);
              onClose();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-[var(--text-primary)] hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input 1: Título de la meta */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#d62725]" />
              Título de la Meta o Proyecto
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Producción Musical: EP Acústico, Guitarra Fingerstyle..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder-neutral-500 focus:outline-none focus:border-[#d62725] transition-colors"
            />
          </div>

          {/* Categoría & Input 2: Selector de Fecha Límite */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-primary)]">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#d62725]"
              >
                <option value="Música & Audio">Música & Audio</option>
                <option value="Guitarra & Instrumentos">Guitarra & Instrumentos</option>
                <option value="Arte & Fotografía">Arte & Fotografía</option>
                <option value="Escritura & Lectura">Escritura & Lectura</option>
                <option value="Programación & Tech">Programación & Tech</option>
                <option value="Cocina & Barismo">Cocina & Barismo</option>
                <option value="Otro Hobby">Otro Hobby</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#f67f00]" />
                Fecha Límite
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#d62725]"
              />
            </div>
          </div>

          {/* Input 3: Hitos dinámicos */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <ListPlus className="w-4 h-4 text-[#fcbf48]" />
                Hitos y Mini-Pasos del Proyecto
              </label>
              <span className="text-[11px] text-neutral-400 font-medium">
                {milestones.length} paso{milestones.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Lista actual de hitos */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {milestones.map((milestone, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                >
                  <span className="w-5 h-5 rounded-full bg-[#d62725]/15 text-[#d62725] dark:text-[#fcbf48] font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="flex-1 truncate">{milestone}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMilestone(idx)}
                    className="p-1 text-neutral-400 hover:text-red-500 rounded transition-colors"
                    title="Eliminar hito"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Input para agregar hito */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ej. 1. Sacar acordes, 2. Grabar audio, 3. Mezclar..."
                value={newMilestoneText}
                onChange={(e) => setNewMilestoneText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMilestone();
                  }
                }}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-neutral-500 focus:outline-none focus:border-[#d62725]"
              />
              <button
                type="button"
                onClick={handleAddMilestone}
                className="px-4 py-2.5 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-[var(--text-primary)] font-bold text-xs hover:bg-[#d62725] hover:text-white transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-[var(--text-primary)] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-[#d62725] hover:bg-[#b51f1d] text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Crear Proyecto
            </button>
          </div>
        </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
