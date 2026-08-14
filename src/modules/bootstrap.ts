"use client";

import { useEffect } from "react";
import { useModuleRegistry } from "./registry";
import { nextPayModule, zarinpalModule } from "./payment";
import { messagesModule } from "./features/messages";
import { supportModule } from "./features/support";
import { imageGenModule } from "./features/image-gen";
import { visionModule } from "./features/vision";
import { voiceModule } from "./features/voice";
import type { ModuleManifest } from "./registry";

export const BUILTIN_MODULES: ModuleManifest[] = [
  // Payment gateways
  nextPayModule,
  zarinpalModule,
  // Feature modules
  messagesModule,
  supportModule,
  imageGenModule,
  visionModule,
  voiceModule,
];

let initialized = false;

export function useModuleBootstrap() {
  const registerModule = useModuleRegistry((s) => s.registerModule);

  useEffect(() => {
    if (initialized) return;
    initialized = true;
    for (const mod of BUILTIN_MODULES) {
      registerModule(mod);
    }
  }, [registerModule]);
}
