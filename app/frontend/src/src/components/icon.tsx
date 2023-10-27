import dynamicIconImports from 'lucide-react/dynamicIconImports';
import dynamic from 'next/dynamic';
import { CSSProperties } from 'react';

export default function Icon({ name, color="#000000", size, style, className, onClick }: { name:string, color?:string, size?:string, style?:CSSProperties, className?:string , onClick?:() => void }) {
  const LucideIcon = dynamic(dynamicIconImports[(name || 'help-circle') as keyof typeof dynamicIconImports], { ssr: false });

  return <LucideIcon color={color} size={size} style={style} className={className} onClick={onClick}/>;
};