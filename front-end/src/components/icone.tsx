import * as vectorIcons from '@expo/vector-icons';

interface IconeProps {
    icone: string;
    size: number;
    color: string;
    biblioteca?: string;
}

export default function Icone({ icone, color, size, biblioteca = "" }: IconeProps) {

    if (biblioteca == "") {
        var [library, iconName] = icone.split(';');
    }
    else {
        var library = biblioteca;
        var iconName = icone;
    }

    const IconComponent = vectorIcons[library as keyof typeof vectorIcons];

    if (!IconComponent || typeof IconComponent !== 'function') {
        console.log(`Biblioteca ou ícone inválido: ${library}, ${iconName}`);
        return null;
    }

    return (
        <IconComponent name={iconName as any} size={size} color={color} />
    );
}
