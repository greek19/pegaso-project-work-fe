type ModalField =
    | { label: string; type: "text"; state: string; setState: React.Dispatch<React.SetStateAction<string>> }
    | { label: string; type: "number"; state: number; setState: React.Dispatch<React.SetStateAction<number>> };

export interface Operazione {
    title: string;
    description: string;
    modalFields?: ModalField[];
    action?: () => void;
    show?: boolean;
    setShow?: React.Dispatch<React.SetStateAction<boolean>>;
    confirmText?: string;
    isRedirect?: boolean;
    redirectTo?: string;
}