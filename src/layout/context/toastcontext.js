import React, { useRef } from 'react';
import { Toast } from 'primereact/toast';

export const ToastContext = React.createContext();

export const ToastProvider = (props) => {

    const toast = useRef(null);

    const showToastMessage = (data) => {
        // toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Role Updated', life: 3000 });
        toast.current.show(data);
    };

    const value = {
        toast,
        showToastMessage
    };

    return (
        <ToastContext.Provider value={value}>
            <Toast ref={toast} />
            {props.children}
        </ToastContext.Provider>
    );
};
