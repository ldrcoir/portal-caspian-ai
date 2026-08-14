"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ComponentType } from "react";

// ============ Types ============

export type ModuleType = "core" | "payment" | "feature" | "landing" | "integration" | "ai";

export interface SettingField {
  key: string;
  label: string;
  type: "text" | "password" | "number" | "boolean" | "select" | "color" | "textarea";
  placeholder?: string;
  options?: { label: string; value: string }[];
  defaultValue: string | number | boolean;
  description?: string;
  required?: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  labelKey?: string; // i18n key
  icon: string;
  view: string;
  order: number;
  adminOnly?: boolean;
  badge?: string;
}

export interface AdminTab {
  id: string;
  label: string;
  labelKey?: string;
  icon: string;
  component: ComponentType<any>;
  order: number;
}

export interface LandingSection {
  id: string;
  component: ComponentType<any>;
  order: number;
  fullWidth?: boolean;
}

export interface PaymentGatewayManifest {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isEnabled: boolean;
  config: Record<string, string | number | boolean>;
  configSchema: SettingField[];
  requestPayment?: (amount: number, callbackUrl: string, config: Record<string, any>) => Promise<{ redirectUrl: string; transId: string }>;
  verifyPayment?: (transId: string, amount: number, config: Record<string, any>) => Promise<boolean>;
}

export interface ModuleManifest {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  icon: string;
  type: ModuleType;
  isEnabled: boolean;
  isCore: boolean;
  config: Record<string, string | number | boolean>;
  configSchema: SettingField[];
  navItems?: NavItem[];
  adminTabs?: AdminTab[];
  landingSections?: LandingSection[];
  paymentGateways?: PaymentGatewayManifest[];
  onEnable?: () => void;
  onDisable?: () => void;
  handlers?: {
    onUserLogin?: (user: any) => void;
    onUserLogout?: () => void;
    onMessageSent?: (msg: any) => void;
    onPaymentComplete?: (tx: any) => void;
    onApiKeyCreated?: (key: any) => void;
  };
}

// ============ Registry Store ============

interface ModuleRegistryState {
  modules: Record<string, ModuleManifest>;
  moduleOrder: string[];
  registerModule: (manifest: ModuleManifest) => void;
  unregisterModule: (id: string) => void;
  enableModule: (id: string) => void;
  disableModule: (id: string) => void;
  toggleModule: (id: string) => void;
  updateModuleConfig: (id: string, config: Record<string, string | number | boolean>) => void;
  resetModuleConfig: (id: string) => void;
  enableGateway: (gatewayId: string) => void;
  disableGateway: (gatewayId: string) => void;
  updateGatewayConfig: (gatewayId: string, config: Record<string, string | number | boolean>) => void;
}

export const useModuleRegistry = create<ModuleRegistryState>()(
  persist(
    (set) => ({
      modules: {},
      moduleOrder: [],

      registerModule: (manifest) =>
        set((s) => {
          const existing = s.modules[manifest.id];
          const merged: ModuleManifest = existing
            ? {
                ...manifest,
                isEnabled: existing.isEnabled,
                config: { ...manifest.config, ...existing.config },
                paymentGateways: manifest.paymentGateways?.map((g) => {
                  const existingG = existing.paymentGateways?.find((eg) => eg.id === g.id);
                  return existingG
                    ? { ...g, isEnabled: existingG.isEnabled, config: { ...g.config, ...existingG.config } }
                    : g;
                }),
              }
            : manifest;
          return {
            modules: { ...s.modules, [manifest.id]: merged },
            moduleOrder: s.moduleOrder.includes(manifest.id) ? s.moduleOrder : [...s.moduleOrder, manifest.id],
          };
        }),

      unregisterModule: (id) =>
        set((s) => {
          const { [id]: _, ...rest } = s.modules;
          return { modules: rest, moduleOrder: s.moduleOrder.filter((m) => m !== id) };
        }),

      enableModule: (id) =>
        set((s) => {
          const mod = s.modules[id];
          if (!mod) return s;
          mod.onEnable?.();
          return { modules: { ...s.modules, [id]: { ...mod, isEnabled: true } } };
        }),

      disableModule: (id) =>
        set((s) => {
          const mod = s.modules[id];
          if (!mod || mod.isCore) return s;
          mod.onDisable?.();
          return { modules: { ...s.modules, [id]: { ...mod, isEnabled: false } } };
        }),

      toggleModule: (id) =>
        set((s) => {
          const mod = s.modules[id];
          if (!mod || mod.isCore) return s;
          const newEnabled = !mod.isEnabled;
          if (newEnabled) mod.onEnable?.();
          else mod.onDisable?.();
          return { modules: { ...s.modules, [id]: { ...mod, isEnabled: newEnabled } } };
        }),

      updateModuleConfig: (id, config) =>
        set((s) => {
          const mod = s.modules[id];
          if (!mod) return s;
          return { modules: { ...s.modules, [id]: { ...mod, config: { ...mod.config, ...config } } } };
        }),

      resetModuleConfig: (id) =>
        set((s) => {
          const mod = s.modules[id];
          if (!mod) return s;
          const defaultConfig: Record<string, string | number | boolean> = {};
          mod.configSchema.forEach((f) => { defaultConfig[f.key] = f.defaultValue; });
          return { modules: { ...s.modules, [id]: { ...mod, config: defaultConfig } } };
        }),

      enableGateway: (gatewayId) =>
        set((s) => {
          const newModules = { ...s.modules };
          for (const mod of Object.values(newModules)) {
            if (mod.paymentGateways) {
              mod.paymentGateways = mod.paymentGateways.map((g) => g.id === gatewayId ? { ...g, isEnabled: true } : g);
            }
          }
          return { modules: newModules };
        }),

      disableGateway: (gatewayId) =>
        set((s) => {
          const newModules = { ...s.modules };
          for (const mod of Object.values(newModules)) {
            if (mod.paymentGateways) {
              mod.paymentGateways = mod.paymentGateways.map((g) => g.id === gatewayId ? { ...g, isEnabled: false } : g);
            }
          }
          return { modules: newModules };
        }),

      updateGatewayConfig: (gatewayId, config) =>
        set((s) => {
          const newModules = { ...s.modules };
          for (const mod of Object.values(newModules)) {
            if (mod.paymentGateways) {
              mod.paymentGateways = mod.paymentGateways.map((g) => g.id === gatewayId ? { ...g, config: { ...g.config, ...config } } : g);
            }
          }
          return { modules: newModules };
        }),
    }),
    {
      name: "caspian-module-registry",
      partialize: (s) => {
        const persisted: Record<string, any> = {};
        for (const [id, mod] of Object.entries(s.modules)) {
          persisted[id] = {
            isEnabled: mod.isEnabled,
            config: mod.config,
            paymentGateways: mod.paymentGateways?.map((g) => ({ id: g.id, isEnabled: g.isEnabled, config: g.config })),
          };
        }
        return { modules: persisted, moduleOrder: s.moduleOrder };
      },
    }
  )
);

// ============ Event Bus ============

type EventName =
  | "user:login" | "user:logout" | "user:register"
  | "chat:messageSent" | "chat:conversationCreated"
  | "billing:paymentComplete" | "billing:deposit"
  | "apikey:created" | "apikey:deleted"
  | "module:enabled" | "module:disabled"
  | "model:updated" | "agent:created" | "agent:deleted"
  | "image:generated" | "vision:analyzed" | "voice:transcribed" | "voice:synthesized"
  | "support:ticketCreated" | "message:sent";

const eventListeners: Record<string, Array<(payload: any) => void>> = {};

export function emitEvent(name: EventName, payload?: any) {
  const listeners = eventListeners[name];
  if (listeners) {
    listeners.forEach((fn) => { try { fn(payload); } catch (e) { console.error(`[event:${name}]`, e); } });
  }
  const registry = useModuleRegistry.getState();
  for (const mod of Object.values(registry.modules)) {
    if (!mod.isEnabled || !mod.handlers) continue;
    switch (name) {
      case "user:login": mod.handlers.onUserLogin?.(payload); break;
      case "user:logout": mod.handlers.onUserLogout?.(); break;
      case "chat:messageSent": mod.handlers.onMessageSent?.(payload); break;
      case "billing:paymentComplete": mod.handlers.onPaymentComplete?.(payload); break;
      case "apikey:created": mod.handlers.onApiKeyCreated?.(payload); break;
    }
  }
}

export function onEvent(name: EventName, handler: (payload: any) => void) {
  if (!eventListeners[name]) eventListeners[name] = [];
  eventListeners[name].push(handler);
  return () => { eventListeners[name] = eventListeners[name].filter((h) => h !== handler); };
}
