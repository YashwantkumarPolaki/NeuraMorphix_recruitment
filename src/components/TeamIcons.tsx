import React from 'react';
import type { LucideProps } from 'lucide-react';
import {
  Cpu,
  Code2,
  Palette,
  Megaphone,
  Layers,
  Radio,
  CalendarCheck,
  Users,
  FileText,
  Lightbulb,
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
    case 'Palette':
      return <Palette className={className} {...props} />;
    case 'Megaphone':
      return <Megaphone className={className} {...props} />;
    case 'Layers':
      return <Layers className={className} {...props} />;
    case 'Radio':
      return <Radio className={className} {...props} />;
    case 'CalendarCheck':
      return <CalendarCheck className={className} {...props} />;
    case 'Users':
      return <Users className={className} {...props} />;
    case 'FileText':
      return <FileText className={className} {...props} />;
    case 'Lightbulb':
      return <Lightbulb className={className} {...props} />;
    default:
      return <Cpu className={className} {...props} />;
  }
};
