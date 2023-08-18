import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';


const ConfirmDialog = ({ message, trigger, onConfirm}) => {

    const [show, setShow] = useState(false);

    useEffect(() => {
        if (trigger) {
            setShow(true);
        }
    }, [trigger]);

    const hide = () => {
        setShow(false);
    }

    const onYes = () => {
        setShow(false);
        onConfirm();
    }

    const buttonHolder = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hide} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={onYes} />
        </>
    );

    return (
        <Dialog visible={show} style={{ width: '450px' }} header="Confirm" modal footer={buttonHolder} onHide={hide}>
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                <span>
                    {message}
                </span>
            </div>
        </Dialog>
    )
}

export default ConfirmDialog