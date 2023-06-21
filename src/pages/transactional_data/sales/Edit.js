import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SALES_MODEL } from '../../../constants/models';

import { TransactionService } from '../../../services/TransactionService';

const Edit = ({ salesId }) => {

    const modelName = SALES_MODEL;

    // fetch data
    const [sales, setSales] = useState(null);

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const transactionService = new TransactionService();

    useEffect(() => {
        transactionService.getById(modelName, salesId).then(data => {
            setSales(data);
        });  
    }, []);

    return (
        <div className="col-12">
            <h3>Sales Detail</h3>
            <div class="grid">
                <div class="col-6">
                    <div class="grid">
                        <div class="card col-12">
                            Sales Detail
                        </div>
                        <div class="card col-12">
                            Payment Detail
                        </div>
                    </div>
                </div>
                <div class="card col-6">
                    Item Detail
                </div>
            </div>
        </div>
    );
}

export default Edit;