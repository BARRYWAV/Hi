'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import {
  Utensils,
  ShoppingCart,
  Plus,
  Trash2,
  Check,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { Meal, MealType, WeeklyMealPlanItem } from '@/types';
import LiquidGlassSheet from '@/components/ui/LiquidGlassSheet';
import LiquidSegmentedControl from '@/components/ui/liquid-glass/LiquidSegmentedControl';

const DAYS_OF_WEEK = [
  { key: 'lunes', label: 'Lunes' },
  { key: 'martes', label: 'Martes' },
  { key: 'miercoles', label: 'Miércoles' },
  { key: 'jueves', label: 'Jueves' },
  { key: 'viernes', label: 'Viernes' },
  { key: 'sabado', label: 'Sábado' },
  { key: 'domingo', label: 'Domingo' },
] as const;

export default function MealsView() {
  const {
    meals,
    weeklyPlan,
    supermarketList,
    assignMealToPlan,
    removeMealFromPlan,
    generateSupermarketList,
    toggleSupermarketItem,
    addSupermarketItem,
    clearCheckedSupermarketItems,
    authUser,
    activeUser,
    triggerHaptic,
  } = useApp();

  const [subTab, setSubTab] = useState<'planning' | 'supermarket'>('planning');
  const [mealTypeFilter, setMealTypeFilter] = useState<'ALL' | MealType>('ALL');

  // Portions Micro-Modal State
  const [pendingAssign, setPendingAssign] = useState<{
    meal: Meal;
    day: WeeklyMealPlanItem['dayOfWeek'];
    mealType: MealType;
  } | null>(null);
  const [portions, setPortions] = useState<number>(2); // Default [ 2 ] preselected

  // Custom Item state
  const [customItemName, setCustomItemName] = useState('');
  const [customItemQty, setCustomItemQty] = useState('1');
  const [customItemUnit, setCustomItemUnit] = useState('pieza');
  const [customItemCat, setCustomItemCat] = useState('Despensa');

  const filteredMeals = useMemo(() => {
    if (mealTypeFilter === 'ALL') return meals;
    return meals.filter((m) => m.type === mealTypeFilter);
  }, [meals, mealTypeFilter]);

  const supermarketByCategory = useMemo(() => {
    const grouped: Record<string, typeof supermarketList> = {};
    supermarketList.forEach((item) => {
      const cat = item.category || 'Otros';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });
    return grouped;
  }, [supermarketList]);

  const totalSuperItems = supermarketList.length;
  const checkedSuperItems = supermarketList.filter((i) => i.checked).length;

  const handleOpenAssign = (meal: Meal, day: WeeklyMealPlanItem['dayOfWeek']) => {
    triggerHaptic(30);
    setPortions(2);
    setPendingAssign({
      meal,
      day,
      mealType: meal.type,
    });
  };

  const handleConfirmAssign = () => {
    if (!pendingAssign) return;
    assignMealToPlan(
      pendingAssign.day,
      pendingAssign.mealType,
      pendingAssign.meal.id,
      portions
    );
    setPendingAssign(null);
  };

  const handleTriggerGenerateSuper = () => {
    generateSupermarketList();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#003049', '#f67f00', '#fcbf48', '#ebe2b7'],
    });
    setSubTab('supermarket');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header & Section Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <Utensils className="w-5 h-5 text-[color:var(--accent-warm)]" />
            Comidas & Súper
          </h1>
          <p className="text-xs text-neutral-400">
            100% Sincronizado {authUser?.isPaired ? `para ${activeUser.displayName} y ${authUser.partnerName}` : 'en tu espacio'}
          </p>
        </div>

        {/* SubTab Toggle Glisse SegmentedControl */}
        <div className="w-fit">
          <LiquidSegmentedControl<'planning' | 'supermarket'>
            size="sm"
            fullWidth={false}
            value={subTab}
            onChange={(next) => {
              triggerHaptic(20);
              setSubTab(next);
            }}
            options={[
              { id: 'planning', label: 'Planeación' },
              {
                id: 'supermarket',
                label: 'Súper',
                icon: <ShoppingCart className="w-3.5 h-3.5" />,
                badge: totalSuperItems - checkedSuperItems,
              },
            ]}
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUBTAB 1: PLANEACIÓN DE COMIDAS (Capa 1: Flat Design)     */}
      {/* ========================================================= */}
      {subTab === 'planning' && (
        <div className="space-y-6">
          {/* Header Action: Botón superior "Generar Súper" */}
          <div className="p-4 rounded-[var(--radius-card)] flat-card flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[color:var(--accent-warm)]" />
                Automatización de Compras
              </h3>
              <p className="text-xs text-neutral-400">
                Consolida ingredientes semanales multiplicados por las porciones
              </p>
            </div>
            <button
              id="btn-generate-super"
              onClick={handleTriggerGenerateSuper}
              className="px-4 py-3 rounded-[var(--radius-card)] bg-[#003049] hover:bg-[#002538] text-[#ebe2b7] font-black text-xs active:scale-95 transition-all flex items-center gap-1.5 shrink-0 touch-target-lg border border-[#003049]"
            >
              <ShoppingCart className="w-4 h-4" /> Generar Súper
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LADO IZQUIERDO: Catálogo de Platillos Pre-Guardados (Col 5) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Catálogo de Platillos
                </span>

                {/* Filtros [Desayuno] [Comida] [Cena] */}
                <div className="flex gap-1">
                  {(['ALL', 'BREAKFAST', 'LUNCH', 'DINNER'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        triggerHaptic(20);
                        setMealTypeFilter(filter);
                      }}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                        mealTypeFilter === filter
                          ? 'bg-[#003049] border-[#003049] text-[#ebe2b7]'
                          : 'bg-[#242424] border-[#333333] text-neutral-400'
                      }`}
                    >
                      {filter === 'ALL'
                        ? 'Todos'
                        : filter === 'BREAKFAST'
                        ? 'Desayuno'
                        : filter === 'LUNCH'
                        ? 'Comida'
                        : 'Cena'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cuadrícula de tarjetas de recetas (Flat Design) */}
              <div className="space-y-3">
                {filteredMeals.map((meal) => (
                  <motion.div
                    key={meal.id}
                    layoutId={`shared-meal-assign-${meal.id}`}
                    transition={{ duration: 0.3 }}
                    className="p-3 rounded-[var(--radius-card)] flat-card hover:border-[color:var(--accent-warm)]/30 transition-all flex gap-3 shadow-none group"
                  >
                    {/* Meal Photo */}
                    <div className="relative w-24 h-24 rounded-[var(--radius-card)] overflow-hidden shrink-0 border border-neutral-700">
                      {meal.imageUrl ? (
                        <Image
                          src={meal.imageUrl}
                          alt={meal.name}
                          fill
                          sizes="96px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#181818] flex items-center justify-center">
                          <Utensils className="w-6 h-6 text-neutral-500" />
                        </div>
                      )}
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/80 text-[9px] font-black text-white">
                        {meal.calories} kcal
                      </span>
                    </div>

                    {/* Meal Info & Ingredients */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[color:var(--accent-warm)]">
                            {meal.type === 'BREAKFAST'
                              ? 'Desayuno'
                              : meal.type === 'LUNCH'
                              ? 'Comida'
                              : 'Cena'}
                          </span>
                          <span className="text-[10px] text-neutral-400 flex items-center gap-1 font-bold">
                            <Clock className="w-3 h-3" /> {meal.prepTimeMin} min
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white tracking-tight truncate mt-0.5">
                          {meal.name}
                        </h4>
                        <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                          {meal.description}
                        </p>
                      </div>

                      {/* Dropdown / Quick add to day */}
                      <div className="flex items-center justify-between pt-1 border-t border-neutral-800">
                        <span className="text-[10px] text-neutral-500">
                          {meal.ingredients.length} ingredientes
                        </span>
                        <div className="flex items-center gap-1">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleOpenAssign(
                                  meal,
                                  e.target.value as WeeklyMealPlanItem['dayOfWeek']
                                );
                                e.target.value = '';
                              }
                            }}
                            defaultValue=""
                            className="text-[11px] font-bold bg-[#003049] text-[#ebe2b7] border border-[#003049] rounded-lg px-2 py-1 outline-none cursor-pointer"
                          >
                            <option value="" disabled>
                              + Asignar a día
                            </option>
                            {DAYS_OF_WEEK.map((d) => (
                              <option key={d.key} value={d.key} className="bg-[#181818] text-white">
                                {d.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* LADO DERECHO: Canvas Semanal de Lunes a Domingo (Col 7 - Flat) */}
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                Canvas Semanal (Lunes a Domingo)
              </span>

              <div className="space-y-3">
                {DAYS_OF_WEEK.map((day) => {
                  const dayMeals = weeklyPlan.filter((p) => p.dayOfWeek === day.key);
                  return (
                    <div
                      key={day.key}
                      className="p-3.5 rounded-[var(--radius-card)] flat-card space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-[color:var(--accent-warm)] tracking-wider">
                          {day.label}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {dayMeals.length} platillos planificados
                        </span>
                      </div>

                      {dayMeals.length === 0 ? (
                        <div className="py-2.5 px-3 rounded-[var(--radius-card)] border border-dashed border-neutral-700 text-center text-[11px] text-neutral-500">
                          Sin platillos asignados para {day.label}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {dayMeals.map((planItem) => {
                            const meal = meals.find((m) => m.id === planItem.mealId);
                            if (!meal) return null;
                            return (
                              <div
                                key={planItem.id}
                                className="p-2.5 rounded-[var(--radius-card)] bg-[#1E1E1E] border border-[#333333] flex flex-col justify-between relative group"
                              >
                                <button
                                  onClick={() => removeMealFromPlan(planItem.id)}
                                  className="absolute top-1.5 right-1.5 p-1 rounded-md text-neutral-400 hover:text-[#d62725] transition-colors"
                                  title="Quitar platillo"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                                <div>
                                  <span className="text-[9px] font-bold uppercase text-[color:var(--accent-warm)] block">
                                    {planItem.mealType === 'BREAKFAST'
                                      ? 'Desayuno'
                                      : planItem.mealType === 'LUNCH'
                                      ? 'Comida'
                                      : 'Cena'}
                                  </span>
                                  <h5 className="text-xs font-bold text-white tracking-tight truncate mt-0.5">
                                    {meal.name}
                                  </h5>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-2 pt-1 border-t border-neutral-800">
                                  <span>{meal.calories} kcal</span>
                                  <span className="font-bold text-[#ebe2b7] bg-[#003049] px-1.5 py-0.5 rounded">
                                    {planItem.portions} porciones
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 2: LISTA DE SÚPER CONSOLIDADA POR PASILLOS (Flat) */}
      {/* ========================================================= */}
      {subTab === 'supermarket' && (
        <div className="space-y-4">
          {/* Header Bar */}
          <div className="flex items-center justify-between p-4 rounded-[var(--radius-card)] flat-card">
            <div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                Progreso de Compras
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-black text-white">
                  {checkedSuperItems} de {totalSuperItems}
                </span>
                <span className="text-xs text-[color:var(--accent-warm)] font-bold">artículos tachados</span>
              </div>
            </div>

            {checkedSuperItems > 0 && (
              <button
                onClick={clearCheckedSupermarketItems}
                className="px-3.5 py-2 rounded-[var(--radius-card)] bg-[#2E2E2E] hover:bg-[#3E3E3E] text-neutral-300 text-xs font-bold transition-colors flex items-center gap-1.5 touch-target-lg"
              >
                <Trash2 className="w-3.5 h-3.5" /> Limpiar marcados
              </button>
            )}
          </div>

          {/* Quick Add Custom Item */}
          <div className="p-3.5 rounded-[var(--radius-card)] flat-card flex flex-wrap gap-2 items-center">
            <input
              type="text"
              value={customItemName}
              onChange={(e) => setCustomItemName(e.target.value)}
              placeholder="Agregar producto extra (ej. Café molido, Avena)"
              className="flex-1 min-w-[200px] px-3.5 py-2.5 rounded-[var(--radius-card)] bg-[#181818] border border-[#333333] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[color:var(--accent-warm)]"
            />
            <input
              type="text"
              value={customItemQty}
              onChange={(e) => setCustomItemQty(e.target.value)}
              placeholder="Cant."
              className="w-16 px-3 py-2.5 rounded-[var(--radius-card)] bg-[#181818] border border-[#333333] text-xs text-white"
            />
            <select
              value={customItemCat}
              onChange={(e) => setCustomItemCat(e.target.value)}
              className="px-3 py-2.5 rounded-[var(--radius-card)] bg-[#181818] border border-[#333333] text-xs text-white"
            >
              <option value="Despensa">Despensa</option>
              <option value="Frutas y Verduras">Frutas y Verduras</option>
              <option value="Lácteos">Lácteos</option>
              <option value="Proteínas">Proteínas</option>
              <option value="Panadería">Panadería</option>
              <option value="Otros">Otros</option>
            </select>
            <button
              onClick={() => {
                if (!customItemName.trim()) return;
                addSupermarketItem(
                  customItemName.trim(),
                  parseFloat(customItemQty) || 1,
                  customItemUnit,
                  customItemCat
                );
                setCustomItemName('');
              }}
              className="p-3 rounded-[var(--radius-card)] bg-[#003049] text-[#ebe2b7] font-bold touch-target-lg flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Checklist agrupado por Pasillos */}
          <div className="space-y-4">
            {Object.keys(supermarketByCategory).length === 0 ? (
              <div className="p-8 rounded-[var(--radius-card)] flat-card text-center">
                <ShoppingCart className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                <p className="text-xs text-neutral-400">La lista de súper está vacía.</p>
                <button
                  onClick={handleTriggerGenerateSuper}
                  className="mt-3 px-4 py-2.5 rounded-[var(--radius-card)] bg-[#003049] text-[#ebe2b7] font-bold text-xs inline-flex items-center gap-1.5 touch-target-lg"
                >
                  <Sparkles className="w-4 h-4 text-[color:var(--accent-warm)]" /> Generar a partir del Menú Semanal
                </button>
              </div>
            ) : (
              Object.entries(supermarketByCategory).map(([category, items]) => (
                <div
                  key={category}
                  className="p-4 rounded-[var(--radius-card)] flat-card space-y-2.5"
                >
                  <div className="flex items-center justify-between pb-1 border-b border-[#333333]">
                    <span className="text-xs font-black uppercase text-[color:var(--accent-warm)] tracking-wider">
                      Pasillo: {category}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {items.filter((i) => i.checked).length}/{items.length} listos
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleSupermarketItem(item.id)}
                        className={`p-3 rounded-[var(--radius-card)] flex items-center justify-between cursor-pointer transition-all border ${
                          item.checked
                            ? 'bg-[#181818] border-[#2A2A2A] opacity-50'
                            : 'bg-[#242424] hover:bg-[#2A2A2A] border-[#333333]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                              item.checked
                                ? 'bg-[#003049] border-[#003049] text-[#ebe2b7]'
                                : 'border-neutral-500'
                            }`}
                          >
                            {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span
                            className={`text-xs font-bold ${
                              item.checked ? 'line-through text-neutral-500' : 'text-neutral-100'
                            }`}
                          >
                            {item.name}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-neutral-400">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MICRO-MODAL AUTOMÁTICO DE PORCIONES (Capa 2: Liquid Glass) */}
      <LiquidGlassSheet
        isOpen={!!pendingAssign}
        onClose={() => setPendingAssign(null)}
        maxWidth="max-w-sm"
        isCenter={true}
        layoutId={pendingAssign ? `shared-meal-assign-${pendingAssign.meal.id}` : undefined}
      >
        {pendingAssign && (
          <div className="p-6 space-y-4 text-center">
            <div className="w-11 h-11 rounded-[var(--radius-card)] bg-[#003049] text-[#ebe2b7] mx-auto flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">
                {pendingAssign.meal.name}
              </h3>
              <p className="text-xs text-neutral-400 capitalize">
                Asignar a {pendingAssign.day} ({pendingAssign.mealType})
              </p>
            </div>

            {/* Selector de Porciones con [ 2 ] preseleccionado */}
            <div>
              <label className="text-xs text-neutral-400 block mb-2 font-bold">
                ¿Para cuántas porciones?
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      triggerHaptic(20);
                      setPortions(num);
                    }}
                    className={`w-12 h-12 rounded-[var(--radius-card)] font-black text-sm border transition-all touch-target-lg ${
                      portions === num
                        ? 'bg-[#003049] border-[#ebe2b7] text-[#ebe2b7] scale-105 shadow-md'
                        : 'bg-[#181818] border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPendingAssign(null)}
                className="flex-1 py-3 rounded-[var(--radius-card)] bg-white/10 text-xs font-bold text-neutral-300 touch-target-lg"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmAssign}
                className="flex-1 py-3 rounded-[var(--radius-card)] bg-[#003049] text-xs font-bold text-[#ebe2b7] touch-target-lg border border-[#003049]"
              >
                Confirmar
              </button>
            </div>
          </div>
        )}
      </LiquidGlassSheet>
    </div>
  );
}
