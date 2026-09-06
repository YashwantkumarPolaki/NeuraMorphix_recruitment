import React from 'react';
import type { LucideProps } from 'lucide-react';
import {
  Cpu,
  Code2,
  Smartphone,
  BookOpen,
  Radio,
  ShieldCheck,
  Rocket,
  Palette,
  Megaphone,
  Handshake,
  CalendarCheck,
  Video,
  Users,
  FileText,
  Lightbulb,
  Mic,
  Music,
  Film,
  Clapperboard,
} from 'lucide-react';

interface TeamIconProps extends LucideProps {
  name: string;
}

export const TeamIcon: React.FC<TeamIconProps> = ({ name, className = 'w-6 h-6', ...props }) => {
  switch (name) {
    case 'Cpu':
      return <Cpu className={className} {...props} />;
    case 'Code2':
      return <Code2 className={className} {...props} />;
    case 'Smartphone':
      return <Smartphone className={className} {...props} />;
    case 'BookOpen':
      return <BookOpen className={className} {...props} />;
    case 'Radio':
      return <Radio className={className} {...props} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} {...props} />;
    case 'Rocket':
      return <Rocket className={className} {...props} />;
    case 'Palette':
      return <Palette className={className} {...props} />;
    case 'Megaphone':
      return <Megaphone className={className} {...props} />;
    case 'Handshake':
      return <Handshake className={className} {...props} />;
    case 'CalendarCheck':
      return <CalendarCheck className={className} {...props} />;
    case 'Video':
      return <Video className={className} {...props} />;
    case 'Users':
      return <Users className={className} {...props} />;
    case 'FileText':
      return <FileText className={className} {...props} />;
    case 'Lightbulb':
      return <Lightbulb className={className} {...props} />;
    case 'Mic':
      return <Mic className={className} {...props} />;
    case 'Music':
      return <Music className={className} {...props} />;
    case 'Film':
      return <Film className={className} {...props} />;
    case 'Clapperboard':
      return <Clapperboard className={className} {...props} />;
    default:
      return <Cpu className={className} {...props} />;
  }
};
