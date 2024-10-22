import React, { createContext, useState, ReactNode } from 'react';

interface UsuarioContextType {
    usuario: any; // Defina o tipo apropriado para "usuario"
    setUsuario: (usuario: any) => void; // Atualize o tipo se necessário
}

export const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

export const UsuarioProvider = ({ children }: { children: ReactNode }) => {
    const [usuario, setUsuario] = useState<any>(null); // O valor inicial pode ser `null` ou outro adequado

    return (
        <UsuarioContext.Provider value={{ usuario, setUsuario }}>
            {children}
        </UsuarioContext.Provider>
    );
};
