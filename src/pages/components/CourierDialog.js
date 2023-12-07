
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import { useForm, Controller, set } from 'react-hook-form';


const CourierDialog = ({isCourierVisible, courierDialogFooter, hideDialog, onInputChange, control, getFormErrorMessage}) => {
    return (
        <Dialog visible={isCourierVisible} style={{ width: '450px' }} header="Courier Information" modal className="p-fluid" footer={courierDialogFooter} onHide={hideDialog}>                    
                            

                   <div className="field col-12 md:col-12">
                        <Controller
                            name="courier_name"
                            control={control}
                            rules={{ required: 'Courier Name is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor="Name">Courier Name*</label>
                                <InputText inputId={field.name} value={field.value} inputRef={field.ref} 
                                    onChange={(e) => onInputChange(e, "courier_name")} 
                                    className={classNames({ 'p-invalid': fieldState.error })} 
                                    />
                                {getFormErrorMessage(field.name)}
                            </>
                    )}/>
                    </div> 
                   <div className="field col-12 md:col-12">
                        <Controller
                            name="courier_memo_number"
                            control={control}
                            rules={{ required: 'Courier Memo Number is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor="Number">Courier Memo Number*</label>
                                <InputText inputId={field.name} value={field.value} inputRef={field.ref} 
                                    onChange={(e) => onInputChange(e, "courier_memo_number")} 
                                    className={classNames({ 'p-invalid': fieldState.error })} 
                                    />
                                {getFormErrorMessage(field.name)}
                            </>
                    )}/>
                    </div> 
                   <div className="field col-12 md:col-12">
                        <Controller
                            name="date"
                            control={control}
                            rules={{ required: 'Date is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor="Date">Date*</label>
                                <Calendar inputId={field.name} value={field.value} onChange={(e) => onInputChange(e, "date")} 
                                dateFormat="dd/mm/yy" className={classNames({ 'p-invalid': fieldState.error })} />
                                {getFormErrorMessage(field.name)}
                            </>
                    )}/>
                    </div> 

        </Dialog>
    )
}

export default CourierDialog;

