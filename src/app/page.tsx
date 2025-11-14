import { Desktop } from "@/components/system/Desktop";
import { Taskbar } from "@/components/system/Taskbar";

export default function Home() {
  return (
    <div className="h-full w-full">
      <Desktop />
      <Taskbar />
    </div>
  );
}
