import React from 'react';
import { InputNumber } from 'primereact/inputnumber';
import { Badge } from 'primereact/badge';

const SalesProductTotal = ({sales, totalPrice, netAmount, totalDiscount, vat, onVATChange, onDeliveryCostChange, onEdit, onDelete}) => {

    const roundNumber = (num) => {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    };

    return (
        <table  className="col-12"><tbody>
            <tr>
                <td><b>Total Quantity:</b></td><td>{sales ? sales.length : 0}</td>
                <td><b>Gross Amount:</b></td><td>{roundNumber(totalPrice)}</td>
                <td><b>Total Discount :</b></td><td>{roundNumber(totalDiscount)}</td>                
                <td><b>Net Amount:</b></td><td><Badge value={roundNumber(netAmount)} size="large" severity="success"></Badge></td>
            </tr><tr>
                <td class="vatInput"><b>Vat %</b>
                    <InputNumber value="0" 
                        placeholder="VAT %"
                        max={100} min={0}
                        className="mx-2"
                        style={{"width": "fit-content(20em)"}}
                        // onBlur={(e) => onVATChange(e.value)}
                        onValueChange={(e) => onVATChange(e.value)} 
                        />
                    <b>:</b>
                </td>
                <td>
                    {roundNumber(vat)}
                </td>
                <td><b>Delivery Cost:</b>
                </td>
                <td class="vatInput">
                    <InputNumber value="0" 
                        placeholder="Delivery Cost %"
                        max={100} min={0}
                        className="mx-2"
                        style={{"width": "fit-content(20em)"}}
                        // onBlur={(e) => onDeliveryCostChange(e.value)}
                        onValueChange={(e) => onDeliveryCostChange(e.value)} 
                        />
                </td>
                {/* <td>
                    <Button icon="pi pi-plus" 
                    label="Delivery" className="p-button-outlined p-button-warning mt-2"
                    // onClick={() => onEdit(rowData)} 
                    />
                </td>
                <td>None</td> */}
            </tr>
        </tbody></table>
    );
}

export default SalesProductTotal;