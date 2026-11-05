'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import {
  Heart,
  ChevronLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar,
  Sparkles,
  MoveRight,
  MoveLeft,
  Compass,
  Lightbulb,
  CheckSquare,
  X,
} from 'lucide-react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { DateKanbanCard } from '@/types';

export default function CoupleSpaceView() {
  const {
    setLifestyleSubView,
    bucketList,
    addBucketListItem,
    updateBucketListProgress,
    dateKanban,
    addDateKanbanCard,
    moveDateKanbanCard,
    deleteDateKanbanCard,
    coupleLongTermGoals,
    toggleCoupleLongTermGoal,
    addCoupleLongTermGoal,
    authUser,
    activeUser,
    triggerHaptic,
  } = useApp();

  // Add Bucket Item Modal / inline form
  const [isAddingBucket, setIsAddingBucket] = useState(false);
  const [newBucketTitle, setNewBucketTitle] = useState('');
  const [newBucketProgress, setNewBucketProgress] = useState(25);
  const [newBucketCategory, setNewBucketCategory] = useState('Viajes');
  const [newBucketImage, setNewBucketImage] = useState('/lifestyle/costa_rica.jpg');

  // Kanban inline inputs
  const [newIdeaText, setNewIdeaText] = useState('');
  const [isAddingIdea, setIsAddingIdea] = useState(false);
  const [newPlannedText, setNewPlannedText] = useState('');
  const [isAddingPlanned, setIsAddingPlanned] = useState(false);

  // Long-term goal inline input
  const [newGoalText, setNewGoalText] = useState('');

  // Drag & drop state for Kanban
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedCardId(id);
    e.dataTransfer.setData('text/plain', id);
    triggerHaptic(20);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetColumn: 'ideas' | 'planeadas') => {
    e.preventDefault();
    const cardId = draggedCardId || e.dataTransfer.getData('text/plain');
    if (cardId) {
      moveDateKanbanCard(cardId, targetColumn);
      triggerHaptic(30);
    }
    setDraggedCardId(null);
  };

  const handleAddBucketItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBucketTitle.trim()) return;
    addBucketListItem({
      title: newBucketTitle.trim(),
      imageUrl: newBucketImage,
      progress: newBucketProgress,
      category: newBucketCategory,
      targetYear: '2027',
    });
    setNewBucketTitle('');
    setIsAddingBucket(false);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#d62725', '#f67f00', '#ebe2b7'],
    });
  };

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaText.trim()) return;
    addDateKanbanCard(newIdeaText.trim(), 'ideas');
    setNewIdeaText('');
    setIsAddingIdea(false);
  };

  const handleAddPlanned = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlannedText.trim()) return;
    addDateKanbanCard(newPlannedText.trim(), 'planeadas', 'Cita Planeada', 'Próximamente');
    setNewPlannedText('');
    setIsAddingPlanned(false);
  };

  const handleAddLongTermGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    addCoupleLongTermGoal(newGoalText.trim());
    setNewGoalText('');
  };

  const ideasList = dateKanban.filter((c) => c.column === 'ideas');
  const plannedList = dateKanban.filter((c) => c.column === 'planeadas');

  return (
    <div className="space-y-8 pb-24">
      {/* Top Navigation & Header */}
      <div className="space-y-3">
        <button
          onClick={() => {
            triggerHaptic(20);
            setLifestyleSubView('hub');
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-bold text-neutral-400 hover:text-[var(--text-primary)] transition-all hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" /> Volver a Estilo de Vida
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#d62725] to-[#f67f00] text-white flex items-center justify-center shadow-lg shadow-[#d62725]/20">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#d62725] dark:text-[#fcbf48] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Nuestro Espacio
              </span>
              <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
                {authUser?.isPaired
                  ? `${activeUser.displayName} & ${authUser.partnerName}`
                  : 'Espacio de Pareja'}
              </h1>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs text-neutral-400 font-semibold">Sincronización de Pareja</span>
            <p className="text-sm font-bold text-emerald-500 inline-flex items-center gap-1">
              {authUser?.isPaired ? (
                <>
                  En sintonía <Heart className="w-3.5 h-3.5 fill-current" />
                </>
              ) : (
                <>Sin vincular</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECCIÓN A: BUCKET LIST (Carrusel Horizontal con Fondo)     */}
      {/* ========================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#f67f00]" />
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              Sección A: Bucket List Juntos
            </h2>
          </div>
          {!isAddingBucket && (
            <motion.div
              layoutId="shared-couple-add-bucket"
              transition={{ duration: 0.3 }}
              role="button"
              tabIndex={0}
              onClick={() => {
                triggerHaptic(20);
                setIsAddingBucket(true);
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#d62725] dark:text-[#fcbf48] hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar Sueño
            </motion.div>
          )}
        </div>

        {/* Modal / Inline form to add bucket item */}
        <AnimatePresence>
          {isAddingBucket && (
            <motion.div
              layoutId="shared-couple-add-bucket"
              transition={{ duration: 0.3 }}
              className="p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3"
            >
              <form onSubmit={handleAddBucketItem} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">Nuevo Sueño del Bucket List</h4>
                  <button
                    type="button"
                    onClick={() => setIsAddingBucket(false)}
                    className="text-neutral-400 hover:text-[var(--text-primary)]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Título del sueño (ej. Viaje a Costa Rica, Renovar depa...)"
                    value={newBucketTitle}
                    onChange={(e) => setNewBucketTitle(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                  />
                  <select
                    value={newBucketImage}
                    onChange={(e) => setNewBucketImage(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                  >
                    <option value="/lifestyle/costa_rica.jpg">Imagen: Naturaleza Tropical (Costa Rica)</option>
                    <option value="/lifestyle/renovar_depa.jpg">Imagen: Hogar & Decoración (Renovar depa)</option>
                    <option value="/lifestyle/cabana.jpg">Imagen: Noche de Cabaña & Fogata</option>
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-[11px] text-neutral-400 font-bold">Progreso:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={newBucketProgress}
                      onChange={(e) => setNewBucketProgress(Number(e.target.value))}
                      className="flex-1 accent-[#d62725]"
                    />
                    <span className="text-xs font-bold text-[var(--text-primary)] w-8 text-right">
                      {newBucketProgress}%
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#d62725] text-white font-bold text-xs shadow hover:bg-[#b51f1d] transition-all"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Horizontal Carousel o Empty State */}
        {bucketList.length === 0 ? (
          <div className="p-8 rounded-[var(--radius-card)] bg-[var(--bg-surface-elevated)] border border-dashed border-[var(--border-subtle)] text-center space-y-2.5">
            <div className="w-10 h-10 rounded-full bg-[var(--bg-base)] flex items-center justify-center mx-auto text-[#f67f00]">
              <Compass className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[var(--text-primary)]">
              Tu Bucket List está vacía
            </p>
            <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
              Comiencen a soñar despiertos agregando su primer viaje o meta juntos.
            </p>
            <button
              type="button"
              onClick={() => setIsAddingBucket(true)}
              className="mt-1 px-4 py-1.5 rounded-full bg-[#d62725] text-white font-bold text-xs shadow-sm active:scale-95 transition-transform inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" /> Agregar sueño
            </button>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {bucketList.map((item) => (
              <div
                key={item.id}
                className="snap-center shrink-0 w-72 sm:w-80 h-48 rounded-[var(--radius-card)] relative overflow-hidden group shadow-lg border border-black/10 dark:border-white/10"
              >
                {/* Background Image */}
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 288px, 320px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Gradient Scrim for readable text and modern glassmorphism */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                {/* Tag in top-left */}
                {item.category && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[10px] font-bold text-white tracking-wider uppercase">
                    {item.category}
                  </div>
                )}

                {/* Year badge top-right */}
                {item.targetYear && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-bold text-[#fcbf48]">
                    Meta {item.targetYear}
                  </div>
                )}

                {/* Content Bottom Overlay */}
                <div className="absolute bottom-3 inset-x-3 space-y-2">
                  <h3 className="text-base font-black text-white drop-shadow-md truncate">
                    {item.title}
                  </h3>

                  {/* Overlaid Linear Progress Bar */}
                  <div className="space-y-1.5 p-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
                    <div className="flex items-center justify-between text-[11px] font-bold text-white">
                      <span>Avance</span>
                      <span className="text-[#fcbf48]">{item.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#d62725] via-[#f67f00] to-[#fcbf48] transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick adjustment buttons */}
                  <div className="flex items-center justify-end gap-1.5 pt-0.5">
                    <button
                      onClick={() => updateBucketListProgress(item.id, Math.max(0, item.progress - 10))}
                      className="px-2 py-0.5 rounded bg-black/40 hover:bg-black/70 text-[10px] font-bold text-white backdrop-blur-md transition-colors"
                      title="-10% progreso"
                    >
                      -10%
                    </button>
                    <button
                      onClick={() => {
                        updateBucketListProgress(item.id, Math.min(100, item.progress + 10));
                        if (item.progress + 10 >= 100) {
                          confetti({
                            particleCount: 30,
                            spread: 60,
                            origin: { y: 0.7 },
                          });
                        }
                      }}
                      className="px-2 py-0.5 rounded bg-[#d62725]/80 hover:bg-[#d62725] text-[10px] font-bold text-white backdrop-blur-md transition-colors"
                      title="+10% progreso"
                    >
                      +10%
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* SECCIÓN B: DATE KANBAN (Tablero Simple de 2 Columnas)     */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#fcbf48]" />
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                Sección B: Date Kanban
              </h2>
              <p className="text-xs text-neutral-400">
                Arrastra las tarjetas o usa las flechas para mover de Ideas a Planeadas
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Columna 1: [ Ideas ] */}
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'ideas')}
            className="p-4 rounded-[var(--radius-card)] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3 min-h-[220px] flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <span className="text-xs font-black uppercase tracking-wider text-[#f67f00] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#f67f00]" />
                  [ Ideas ]
                </span>
                <span className="text-[11px] font-bold text-neutral-400 bg-[var(--bg-base)] px-2 py-0.5 rounded-full">
                  {ideasList.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-2.5">
                {ideasList.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card.id)}
                    className="p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] shadow-sm hover:border-[#f67f00]/50 transition-all cursor-grab active:cursor-grabbing group space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-[var(--text-primary)] leading-snug">
                        {card.title}
                      </p>
                      <button
                        onClick={() => deleteDateKanbanCard(card.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-500 rounded transition-opacity"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-semibold text-neutral-400">
                        {card.category || 'Idea Romántica'}
                      </span>
                      <button
                        onClick={() => moveDateKanbanCard(card.id, 'planeadas')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f67f00]/10 text-[#f67f00] font-bold text-[10px] hover:bg-[#f67f00] hover:text-white transition-colors"
                        title="Mover a Planeadas"
                      >
                        Planear <MoveRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {ideasList.length === 0 && (
                  <div className="p-4 text-center text-xs text-neutral-400 border border-dashed border-[var(--border-subtle)] rounded-xl">
                    Arrastra o añade ideas aquí
                  </div>
                )}
              </div>
            </div>

            {/* Input to add idea */}
            {isAddingIdea ? (
              <form onSubmit={handleAddIdea} className="pt-2 flex gap-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="Nueva idea para una cita..."
                  value={newIdeaText}
                  onChange={(e) => setNewIdeaText(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-[#f67f00] text-white font-bold text-xs"
                >
                  Ok
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingIdea(false)}
                  className="px-2 py-2 text-neutral-400 text-xs"
                >
                  X
                </button>
              </form>
            ) : (
              <button
                onClick={() => {
                  triggerHaptic(20);
                  setIsAddingIdea(true);
                }}
                className="w-full py-2.5 rounded-xl border border-dashed border-[var(--border-subtle)] text-neutral-400 hover:text-[var(--text-primary)] hover:border-[#f67f00] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Idea
              </button>
            )}
          </div>

          {/* Columna 2: [ Planeadas ] */}
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'planeadas')}
            className="p-4 rounded-[var(--radius-card)] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3 min-h-[220px] flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  [ Planeadas ]
                </span>
                <span className="text-[11px] font-bold text-neutral-400 bg-[var(--bg-base)] px-2 py-0.5 rounded-full">
                  {plannedList.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-2.5">
                {plannedList.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card.id)}
                    className="p-3.5 rounded-xl bg-[var(--bg-base)] border border-emerald-500/25 shadow-sm hover:border-emerald-500/60 transition-all cursor-grab active:cursor-grabbing group space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-[var(--text-primary)] leading-snug">
                        {card.title}
                      </p>
                      <button
                        onClick={() => deleteDateKanbanCard(card.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-500 rounded transition-opacity"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {card.date || 'Confirmada'}
                      </span>
                      <button
                        onClick={() => moveDateKanbanCard(card.id, 'ideas')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-bold text-[10px] hover:text-[var(--text-primary)] transition-colors"
                        title="Regresar a Ideas"
                      >
                        <MoveLeft className="w-3 h-3" /> A Ideas
                      </button>
                    </div>
                  </div>
                ))}

                {plannedList.length === 0 && (
                  <div className="p-4 text-center text-xs text-neutral-400 border border-dashed border-[var(--border-subtle)] rounded-xl">
                    Arrastra citas planeadas aquí
                  </div>
                )}
              </div>
            </div>

            {/* Input to add planned date */}
            {isAddingPlanned ? (
              <form onSubmit={handleAddPlanned} className="pt-2 flex gap-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="Nueva cita planeada (ej. Sábado 8pm...)"
                  value={newPlannedText}
                  onChange={(e) => setNewPlannedText(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  Ok
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingPlanned(false)}
                  className="px-2 py-2 text-neutral-400 text-xs"
                >
                  X
                </button>
              </form>
            ) : (
              <button
                onClick={() => {
                  triggerHaptic(20);
                  setIsAddingPlanned(true);
                }}
                className="w-full py-2.5 rounded-xl border border-dashed border-[var(--border-subtle)] text-neutral-400 hover:text-[var(--text-primary)] hover:border-emerald-500 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Cita Planeada
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECCIÓN C: METAS A LARGO PLAZO (Lista Vertical Checklists)*/}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#d62725]" />
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                Sección C: Metas a Largo Plazo
              </h2>
              <p className="text-xs text-neutral-400">
                Checklist compartido de grandes proyectos de vida juntos
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-neutral-400">
            {coupleLongTermGoals.filter((g) => g.completed).length} / {coupleLongTermGoals.length} logradas
          </span>
        </div>

        {/* Checklist Container */}
        <div className="p-4 rounded-[var(--radius-card)] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-3">
          <div className="space-y-2">
            {coupleLongTermGoals.length === 0 && (
              <div className="py-6 px-4 text-center space-y-1">
                <p className="text-xs font-bold text-[var(--text-primary)]">
                  Sin metas compartidas aún
                </p>
                <p className="text-[11px] text-neutral-400">
                  Agreguen su primer gran proyecto o sueño conjunto aquí abajo.
                </p>
              </div>
            )}
            {coupleLongTermGoals.map((goal) => (
              <div
                key={goal.id}
                onClick={() => toggleCoupleLongTermGoal(goal.id)}
                className={`p-3.5 rounded-xl border transition-all flex items-center gap-3 cursor-pointer touch-target-lg ${
                  goal.completed
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-neutral-400 dark:text-neutral-500'
                    : 'bg-[var(--bg-base)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[#d62725]/40'
                }`}
              >
                <button
                  type="button"
                  className="shrink-0 text-[#d62725] transition-transform active:scale-90"
                >
                  {goal.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-neutral-400" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-bold truncate ${
                      goal.completed ? 'line-through opacity-70' : ''
                    }`}
                  >
                    {goal.title}
                  </p>
                  {goal.category && (
                    <span className="text-[10px] text-neutral-400 font-medium">
                      {goal.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick add goal form */}
          <form onSubmit={handleAddLongTermGoal} className="pt-2 flex gap-2">
            <input
              type="text"
              placeholder="Nueva meta a largo plazo para ambos..."
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-neutral-500 focus:outline-none focus:border-[#d62725]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#d62725] hover:bg-[#b51f1d] text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" /> Agregar Meta
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
