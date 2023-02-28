import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CustomerService } from '../services/CustomerService';

export default function POS() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
      // CustomerService.getCustomersMedium().then((data) => setCustomers(data));
  }, []);

  return (
    <div className="grid h-screen">        
      
      <div className="col h-screen"  style={{ backgroundColor: "blue" }}>
      <div class="card">
          <div class="formgrid grid">
              <div class="field col">
                  <label for="firstname2">Firstname</label>
                  {/* <input id="firstname2" type="text" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"> */}
              </div>
              <div class="field col">
                  <label for="lastname2">Lastname</label>
                  {/* <input id="lastname2" type="text" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"> */}
              </div>
          </div>
      </div>
        <DataTable value={customers} resizableColumns stripedRows showGridlines scrollable scrollHeight="400px" 
        style={{ minHeight: "60%" }}>
          <Column field="name" header="Name"></Column>
          <Column field="country.name" header="Country"></Column>
          <Column field="representative.name" header="Representative"></Column>
          <Column field="company" header="Company"></Column>
        </DataTable>
        <DataTable value={customers} resizableColumns stripedRows showGridlines scrollable scrollHeight="400px" 
        >
          <Column field="name" header="Name"></Column>
          <Column field="country.name" header="Country"></Column>
          <Column field="representative.name" header="Representative"></Column>
          <Column field="company" header="Company"></Column>
        </DataTable>
        <div class="flex align-content-end justify-content-around flex-wrap card-container indigo-container"
        >
            <div class="flex align-items-center justify-content-center w-4rem h-4rem bg-indigo-500 font-bold text-white border-round m-2">1</div>
            <div class="flex align-items-center justify-content-center w-4rem h-4rem bg-indigo-500 font-bold text-white border-round m-2">2</div>
            <div class="flex align-items-center justify-content-center w-4rem h-4rem bg-indigo-500 font-bold text-white border-round m-2">3</div>
            <div class="flex align-items-center justify-content-center w-4rem h-4rem bg-indigo-500 font-bold text-white border-round m-2">4</div>
            <div class="flex align-items-center justify-content-center w-4rem h-4rem bg-indigo-500 font-bold text-white border-round m-2">5</div>
        </div>
      </div>

      <div className="col-3"  style={{ backgroundColor: "red" }}>
        <div class="card">
            <h5>Vertical-1</h5>
            <div class="field">
                <label for="firstname1">Firstname</label>
                {/* <input id="firstname1" type="text" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"> */}
            </div>
            <div class="field">
                <label for="lastname1">Lastname</label>
                {/* <input id="lastname1" type="text" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"> */}
            </div>
        </div>
        <div class="card">
            <h5>Vertical-2</h5>
            <div class="field">
                <label for="firstname1">Firstname</label>
                {/* <input id="firstname1" type="text" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"> */}
            </div>
            <div class="field">
                <label for="lastname1">Lastname</label>
                {/* <input id="lastname1" type="text" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"> */}
            </div>
        </div>
        <div class="card">
            <h5>Vertical-3</h5>
            <div class="field">
                <label for="firstname1">Firstname</label>
                {/* <input id="firstname1" type="text" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"> */}
            </div>
            <div class="field">
                <label for="lastname1">Lastname</label>
                {/* <input id="lastname1" type="text" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"> */}
            </div>
        </div>
      </div>
    </div>
  );
}