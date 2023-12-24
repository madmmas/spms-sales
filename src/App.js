import React, { useEffect, useState } from "react";
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import 'primeflex/primeflex.css';
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css"; //core css
import './styles/demo/Demos.scss';
import './styles/layout/layout.scss';

import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
        
import RequireAuth from "./auth/RequireAuth";
import Layout from './layout/layout';
import About from "./pages/About";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RouteAuth from "./auth/RouteAuth";
import POS from "./pages/POS";

import { PrintInvoice } from "./pages/transactional_data/sales/components/PrintInvoice";
import { PrintInvoiceSalesReturn } from "./pages/transactional_data/sales/components/PrintInvoiceSalesReturn";
import { PrintReport } from "./pages/html_reports/PrintReport";
import { HtmlLedger } from "./pages/html_reports/Ledger";
import { CashFlow } from "./pages/html_reports/CashFlow";

import { MasterDataDBService } from './services/MasterDataDBService';

function App() {

  const Crud = React.lazy(() => import("./pages/Crud"));
  const DemoData = React.lazy(() => import("./pages/Demo"));
  const Form1 = React.lazy(() => import("./pages/Form1"));

  const BankAccountList = React.lazy(() => import("./pages/master_data/bank_accounts/List"));
  const BankAccountDetail = React.lazy(() => import("./pages/master_data/bank_accounts/Detail"));
  const BankAccountForm = React.lazy(() => import("./pages/master_data/bank_accounts/Form"));
  const MFSAccountList = React.lazy(() => import("./pages/master_data/mfs_accounts/List"));
  const MFSAccountDetail = React.lazy(() => import("./pages/master_data/mfs_accounts/Detail"));
  const MFSAccountForm = React.lazy(() => import("./pages/master_data/mfs_accounts/Form"));
  const EmpList = React.lazy(() => import("./pages/master_data/employees/List"));
  const EmpDetail = React.lazy(() => import("./pages/master_data/employees/Detail"));
  const EmpForm = React.lazy(() => import("./pages/master_data/employees/Form"));
  const SupplierList = React.lazy(() => import("./pages/master_data/suppliers/List"));
  const SupplierDetail = React.lazy(() => import("./pages/master_data/suppliers/Detail"));
  const SupplierForm = React.lazy(() => import("./pages/master_data/suppliers/Form"));
  const CustomerList = React.lazy(() => import("./pages/master_data/customers/List"));
  const CustomerDetail = React.lazy(() => import("./pages/master_data/customers/Detail"));
  const CustomerForm = React.lazy(() => import("./pages/master_data/customers/Form"));
  const ProductList = React.lazy(() => import("./pages/master_data/products/List"));
  const ProductDetail = React.lazy(() => import("./pages/master_data/products/Detail"));
  const ProductForm = React.lazy(() => import("./pages/master_data/products/Form"));
  const PackageList = React.lazy(() => import("./pages/master_data/packages/List"));
  const PackageDetail = React.lazy(() => import("./pages/master_data/packages/Detail"));
  const PackageForm = React.lazy(() => import("./pages/master_data/packages/Form"));  
  const WarehouseList = React.lazy(() => import("./pages/master_data/warehouses/List"));
  const WarehouseDetail = React.lazy(() => import("./pages/master_data/warehouses/Detail"));
  const WarehouseForm = React.lazy(() => import("./pages/master_data/warehouses/Form"));
  
  const SaleList = React.lazy(() => import("./pages/transactional_data/sales/List"));
  const SaleDetail = React.lazy(() => import("./pages/transactional_data/sales/Detail"));
  const SaleForm = React.lazy(() => import("./pages/transactional_data/sales/Form"));
  const PurchaseList = React.lazy(() => import("./pages/transactional_data/purchases/List"));
  const PurchaseDetail = React.lazy(() => import("./pages/transactional_data/purchases/Detail"));
  const PurchaseForm = React.lazy(() => import("./pages/transactional_data/purchases/Form"));
  const StockStatus = React.lazy(() => import("./pages/transactional_data/stock/Detail"));
  const Accounts = React.lazy(() => import("./pages/transactional_data/accounts/Detail"));
  const Adjustments = React.lazy(() => import("./pages/transactional_data/Adjustments"));
  const Expenses = React.lazy(() => import("./pages/transactional_data/Expenses"));
  const ExtraIncome = React.lazy(() => import("./pages/transactional_data/ExtraIncome"));
  const CashBank = React.lazy(() => import("./pages/transactional_data/transfer_money/Detail"));

  const CRUD = React.lazy(() => import("./pages/components/config_data/CRUD"));

  const Invoice = React.lazy(() => import("./pages/transactional_data/sales/Invoice"));

  const PaymentDetail = React.lazy(() => import("./pages/transactional_data/payments/Detail"));

  const { user: currentUser } = useSelector((state) => state.auth);
  const [visible, setVisible] = useState(false);

  const loadAllData = async () => {  
    const masterDataDBService = new MasterDataDBService();
    
    setVisible(true);
    let response = await masterDataDBService.sessionPing();
    console.log("Appjs-sessionPing::", response);
    if (response===true) {
      await masterDataDBService.loadAllInitData();
    }
    setVisible(false);
  }

  useEffect(() => {
    if (currentUser) {
      console.log("currentUser::", currentUser);   
      loadAllData();
    }
  }, [currentUser]);

  return (
    <>
    <Dialog header="Loading..." visible={visible} style={{ width: '50vw' }} onHide={()=>console.log("wait...")} >
        <p className="m-0">
          Please wait while we are loading the application...
        </p>
        <ProgressSpinner />
    </Dialog>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/pos" element={<POS />} />

      <Route path="/invoice/:id" element={<PrintInvoice />} />
      <Route path="/invoice/">
        <Route path=":id/R" element={<PrintInvoiceSalesReturn />} />
      </Route>

      <Route path="/sales">
        <Route path="new" element={<RouteAuth pageComponent={<SaleForm />} />} />
        <Route path=":id" element={<RouteAuth pageComponent={<SaleDetail />} />} />
      </Route>
      <Route path="/purchases">
        <Route path="new" element={<RouteAuth pageComponent={<PurchaseForm />} />} />
        <Route path=":id" element={<RouteAuth pageComponent={<PurchaseDetail />} />} />
      </Route>

      <Route element={<Layout />}>
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/about" element={<RequireAuth><About /></RequireAuth>} />
        <Route path="/report/:id" element={<PrintReport />} />

        <Route path="/crud" element={<RouteAuth pageComponent={<Crud />} />} />
        <Route path="/demodata" element={<RouteAuth pageComponent={<DemoData />} />} />
        <Route path="/form" element={<RouteAuth pageComponent={<Form1 />} />} />

        <Route path="/bank_accounts">
          <Route index element={<RouteAuth pageComponent={<BankAccountList />} />} />
          <Route path="new" element={<RouteAuth pageComponent={<BankAccountForm />} />} />
          <Route path=":id" element={<RouteAuth pageComponent={<BankAccountDetail />} />} />
          <Route path="ledger/:id" element={<RouteAuth pageComponent={<HtmlLedger type="bank" header="Bank Ledger"/>} />} />
        </Route>

        <Route path="/mfs_accounts">
          <Route index element={<RouteAuth pageComponent={<MFSAccountList />} />} />
          <Route path="new" element={<RouteAuth pageComponent={<MFSAccountForm />} />} />
          <Route path=":id" element={<RouteAuth pageComponent={<MFSAccountDetail />} />} />
          <Route path="ledger/:id" element={<RouteAuth pageComponent={<HtmlLedger type="mfs" header="MFS Ledger"/>} />} />
        </Route>

        <Route path="/report">
          <Route path="cashflow" element={<RouteAuth pageComponent={<CashFlow />} />} />
        </Route>
        <Route path="/ledger">
          {/* <Route path="purchase" element={<RouteAuth pageComponent={<Ledger type="purchase" header="Purchase Ledger" />} />} /> */}
          <Route path="purchase" element={<RouteAuth pageComponent={<HtmlLedger type="purchase" header="Purchase Ledger" />} />} />
          {/* <Route path="sales" element={<RouteAuth pageComponent={<Ledger type="sales" header="Sales Ledger" />} />} /> */}
          <Route path="sales" element={<RouteAuth pageComponent={<HtmlLedger type="sales" header="SALES LEDGER" />} />} />
          {/* <Route path="accpayable" element={<RouteAuth pageComponent={<Ledger type="accpayable" header="A/C Payable"/>} />} /> */}
          <Route path="accpayable" element={<RouteAuth pageComponent={<HtmlLedger type="accpayable" header="A/C Payable"/>} />} />
          {/* <Route path="accreceivable" element={<RouteAuth pageComponent={<Ledger type="accreceivable" header="A/C Receivable"/>} />} /> */}
          <Route path="accreceivable" element={<RouteAuth pageComponent={<HtmlLedger type="accreceivable" header="A/C Receivable"/>} />} />
          {/* <Route path="bank" element={<RouteAuth pageComponent={<Ledger type="bank" header="Bank Ledger"/>} />} /> */}
          {/* <Route path="bank" element={<RouteAuth pageComponent={<HtmlLedger type="bank" header="Bank Ledger"/>} />} /> */}
          {/* <Route path="cash" element={<RouteAuth pageComponent={<Ledger type="cash" header="Cash Ledger"/>} />} /> */}
          <Route path="cash" element={<RouteAuth pageComponent={<HtmlLedger type="cash" header="Cash Ledger"/>} />} />
          <Route path="bank" element={<RouteAuth pageComponent={<BankAccountList ledger={true} />} />} />
          <Route path="mfs" element={<RouteAuth pageComponent={<MFSAccountList ledger={true} />} />} />
          <Route path="customer" element={<RouteAuth pageComponent={<CustomerList ledger={true} />} />} />
          <Route path="supplier" element={<RouteAuth pageComponent={<SupplierList ledger={true} />} />} />
        </Route>
        <Route path="/employees">
          <Route index element={<RouteAuth pageComponent={<EmpList />} />} />
          <Route path="new" element={<RouteAuth pageComponent={<EmpForm />} />} />
          <Route path=":id" element={<RouteAuth pageComponent={<EmpDetail />} />} />
        </Route>
        <Route path="/suppliers">
          <Route index element={<RouteAuth pageComponent={<SupplierList />} />} />
          <Route path="new" element={<RouteAuth pageComponent={<SupplierForm />} />} />
          <Route path=":id" element={<RouteAuth pageComponent={<SupplierDetail />} />} />
          <Route path="ledger/:id" element={<RouteAuth pageComponent={<HtmlLedger type="suppliers" header="Supplier Ledger"/>} />} />
        </Route>
        <Route path="/customers">
          <Route index element={<RouteAuth pageComponent={<CustomerList />} />} />
          <Route path="new" element={<RouteAuth pageComponent={<CustomerForm />} />} />
          <Route path=":id" element={<RouteAuth pageComponent={<CustomerDetail />} />} />
          <Route path="ledger/:id" element={<RouteAuth pageComponent={<HtmlLedger type="customers" header="Customer Ledger"/>} />} />
        </Route>
        <Route path="/products">
          <Route index element={<RouteAuth pageComponent={<ProductList />} />} />
          <Route path="new" element={<RouteAuth pageComponent={<ProductForm />} />} />
          <Route path=":id" element={<RouteAuth pageComponent={<ProductDetail />} />} />
        </Route>
        <Route path="/packages">
          <Route index element={<RouteAuth pageComponent={<PackageList />} />} />
          <Route path="new" element={<RouteAuth pageComponent={<PackageForm />} />} />
          <Route path=":id" element={<RouteAuth pageComponent={<PackageDetail />} />} />
        </Route>        
        <Route path="/warehouses">
          <Route index element={<RouteAuth pageComponent={<WarehouseList />} />} />
          <Route path="new" element={<RouteAuth pageComponent={<WarehouseForm />} />} />
          <Route path=":id" element={<RouteAuth pageComponent={<WarehouseDetail />} />} />
        </Route>
        <Route path="/sales">
          <Route index element={<RouteAuth pageComponent={<SaleList />} />} />
          <Route path="invoice/:id" element={<RouteAuth pageComponent={<Invoice />} />} />
        </Route>
        <Route path="/purchases">
          <Route index element={<RouteAuth pageComponent={<PurchaseList />} />} />
        </Route>
        <Route path="/accounts" element={<RouteAuth pageComponent={<Accounts />} />} />
        <Route path="/stocks" element={<RouteAuth pageComponent={<StockStatus />} />} />
        <Route path="/payments" element={<RouteAuth pageComponent={<PaymentDetail />} />} />
        <Route path="/adjustments" element={<RouteAuth pageComponent={<Adjustments />} />} />
        <Route path="/expenses" element={<RouteAuth pageComponent={<Expenses />} />} />
        <Route path="/extra_income" element={<RouteAuth pageComponent={<ExtraIncome />} />} />
        <Route path="/transfer" element={<RouteAuth pageComponent={<CashBank />} />} />

        <Route path="/banks" element={<RouteAuth pageComponent={<CRUD modelName="dtBank" />} />} />
        <Route path="/customer_category" element={<RouteAuth pageComponent={<CRUD modelName="dtCustomerCategory" />} />} />
        <Route path="/expense_type" element={<RouteAuth pageComponent={<CRUD modelName="dtExpenseType" />} />} />    

        <Route path="/designation" element={<RouteAuth pageComponent={<CRUD modelName="dtDesignation" />} />} />
        <Route path="/department" element={<RouteAuth pageComponent={<CRUD modelName="dtDepartment" />} />} />
        
        <Route path="/mfs_types" element={<RouteAuth pageComponent={<CRUD modelName="dtMFS" />} />} />
        <Route path="/extra_income_type" element={<RouteAuth pageComponent={<CRUD modelName="dtIncomeType" />} />} />
        <Route path="/grade" element={<RouteAuth pageComponent={<CRUD modelName="dtGrade" />} />} />
        <Route path="/group" element={<RouteAuth pageComponent={<CRUD modelName="dtGroup" />} />} />
        <Route path="/office_time" element={<RouteAuth pageComponent={<CRUD modelName="dtOfficeTime" />} />} />
        <Route path="/payment_type" element={<RouteAuth pageComponent={<CRUD modelName="dtPaymentType" />} />} />
        <Route path="/product_category" element={<RouteAuth pageComponent={<CRUD modelName="dtProductCategory" />} />} />
        <Route path="/product_brand" element={<RouteAuth pageComponent={<CRUD modelName="dtProductBrand" />} />} />
        <Route path="/product_model" element={<RouteAuth pageComponent={<CRUD modelName="dtProductModel" />} />} />
        <Route path="/route" element={<RouteAuth pageComponent={<CRUD modelName="dtRoute" />} />} />
        <Route path="/supplier_category" element={<RouteAuth pageComponent={<CRUD modelName="dtSupplierCategory" />} />} />

      </Route>
    </Routes>
    </>
  );
}

export default App;
