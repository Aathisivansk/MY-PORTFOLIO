"use client";

import { useDesktop } from "@/contexts/DesktopContext";
import { CATEGORIES } from "@/lib/data";
import { DesktopIcon } from "./DesktopIcon";
import { Window } from "./Window";

export function Desktop() {
  const { windows } = useDesktop();

  return (
    <div id="desktop" className="h-full w-full relative p-4 overflow-hidden">
      <div className="flex flex-col flex-wrap items-start content-start h-full gap-4">
        {CATEGORIES.map(category => (
          <DesktopIcon key={category.id} category={category} />
        ))}
      </div>

      {windows.map(window => (
        !window.isMinimized && <Window key={window.id} {...window} />
      ))}
    </div>
  );
}
