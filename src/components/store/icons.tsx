import {
  BookOpen, Bot, Brain, Camera, Clapperboard, Disc3, Drama, FileText, Film, Gamepad2, Headphones, Heart,
  Languages, Music2, NotebookPen, Palette, PenLine, Phone, Popcorn, Scissors, Sparkles, Star, Swords, Tv, WandSparkles,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/data/types";

export const iconMap: Record<IconName, LucideIcon> = {
  clapperboard: Clapperboard, tv: Tv, film: Film, popcorn: Popcorn, drama: Drama, music: Music2, headphones: Headphones,
  disc: Disc3, scissors: Scissors, palette: Palette, sparkles: Sparkles, camera: Camera, wand: WandSparkles, bot: Bot,
  brain: Brain, languages: Languages, pen: PenLine, file: FileText, notebook: NotebookPen, book: BookOpen, phone: Phone,
  gamepad: Gamepad2, sword: Swords, star: Star, heart: Heart,
};

export function StoreIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = iconMap[name];
  return <Icon className={className} />;
}
