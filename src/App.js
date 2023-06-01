import React from "react";
import { Route, Routes } from 'react-router-dom';

import 'primeflex/primeflex.css';
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css"; //core css
import './styles/demo/Demos.scss';
import './styles/layout/layout.scss';

import RequireAuth from "./auth/RequireAuth";
import Layout from './layout/layout';
import About from "./pages/About";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RouteAuth from "./auth/RouteAuth";
import POS from "./pages/POS";

function App() {
  const Crud = React.lazy(() => import("./pages/Crud"));
  const DemoData = React.lazy(() => import("./pages/Demo"));
  const Form1 = React.lazy(() => import("./pages/Form1"));

  const BankAccountList = React.lazy(() => import("./pages/master_data/bank_accounts/List"));
  const BankAccountDetail = React.lazy(() => import("./pages/master_data/bank_accounts/Detail"));
  const BankAccountForm = React.lazy(() => import("./pages/master_data/bank_accounts/Form"));
  const EmpList = React.lazy(() => import("./pages/master_data/employees/List"));
  const EmpDetail = React.lazy(() => import("./pages/master_data/employees/Detail"));
  const EmpForm = React.lazy(() => import("./pages/master_data/employees/Form"));
  const LeaveBalList = React.lazy(() => import("./pages/master_data/leave_balances/List"));
  const LeaveBalDetail = React.lazy(() => import("./pages/master_data/leave_balances/Detail"));
  const LeaveBalForm = React.lazy(() => import("./pages/master_data/leave_balances/Form"));
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
  // const PurchasePackageList = React.lazy(() => import("./pages/transactional_data/purchasePackages/List"));
  // const PurchasePackageDetail = React.lazy(() => import("./pages/transactional_data/purchasePackages/Detail"));
  // const PurchasePackageForm = React.lazy(() => import("./pages/transactional_data/purchasePackages/Form"));
  const StockStatus = React.lazy(() => import("./pages/transactional_data/stock/Detail"));
  const Accounts = React.lazy(() => import("./pages/transactional_data/accounts/Detail"));
  const Expenses = React.lazy(() => import("./pages/transactional_data/Expenses"));
  const ExtraIncome = React.lazy(() => import("./pages/transactional_data/ExtraIncome"));
  const CashBank = React.lazy(() => import("./pages/transactional_data/cash_bank/Detail"));

  const CustomerCategory = React.lazy(() => import("./pages/configurations/CustomerCategory"));
  const SupplierCategory = React.lazy(() => import("./pages/configurations/SupplierCategory"));
  const ProductCategory = React.lazy(() => import("./pages/configurations/ProductCategory"));
  const Banks = React.lazy(() => import("./pages/configurations/Banks"));
  const ExtraIncomeType = React.lazy(() => import("./pages/configurations/ExtraIncomeType"));
  const ExpenseType = React.lazy(() => import("./pages/configurations/ExpenseType"));
  const PaymentType = React.lazy(() => import("./pages/configurations/PaymentType"));
  const Department = React.lazy(() => import("./pages/configurations/Department"));
  const Designation = React.lazy(() => import("./pages/configurations/Designation"));
  const Grade = React.lazy(() => import("./pages/configurations/Grade"));
  const Group = React.lazy(() => import("./pages/configurations/Group"));
  const OfficeTime = React.lazy(() => import("./pages/configurations/OfficeTime"));
  const BusinessRoute = React.lazy(() => import("./pages/configurations/BusinessRoute"));

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/pos" element={<POS />} />

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

        <Route path="/crud" element={<RouteAuth pageComponent={<Crud />} />} />
        <Route path="/demodata" element={<RouteAuth pageComponent={<DemoData />} />} />
        <Route path="/form" element={<RouteAuth pageComponent={<Form1 />} />} />

        <Route path="/bank_accounts">
          <Route index element={<RouteAuth pageComponent={<BankAccountList />} />} />
          <Route path="new" element={<RouteAuth pageComponent={<BankAccountForm />} />} />
          <Route path=":id" element={<RouteAuth pageComponent={<BankAccountDetail />} />} />
        </Route>

        <Route path="/employees">
          <Route index element={<RouteAuth pageComponent={<EmpList />} />} />
          <Route path="new" element={<RouteAuth pageComponent={<EmpForm />} />} />
          <Route path=":id" element={<RouteAuth pageComponent={<EmpDetail />} />} />
        </Route>
        <Route path="/leave_balances">
          <Route index element={<RouteAuth pageComponent={<LeaveBalList />} />} />
          <Route path="new" element={<RouteAuth pageComponent={<LeaveBalForm />} />} />
          <Route path=":id" element={<RouteAuth pageComponent={<LeaveBalDetail />} />} />
        </Route>
        <Route path="/suppliers">
          <Route index element={<RouteAuth pageComponent={<SupplierList />} />} />
          <Route path="new" element={<RouteAuth pageComponent={<SupplierForm />} />} />
          <Route path=":id" element={<RouteAuth pageComponent={<SupplierDetail />} />} />
        </Route>
        <Route path="/customers">
          <Route index element={<RouteAuth pageComponent={<CustomerList />} />} />
          <Route path="new" element={<RouteAuth pageComponent={<CustomerForm />} />} />
          <Route path=":id" element={<RouteAuth pageComponent={<CustomerDetail />} />} />
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
          {/* <Route path="new" element={<RouteAuth pageComponent={<SaleForm />} />} />
          <Route path=":id" element={<RouteAuth pageComponent={<SaleDetail />} />} /> */}
        </Route>
        <Route path="/purchases">
          <Route index element={<RouteAuth pageComponent={<PurchaseList />} />} />
          {/* <Route path="new" element={<RouteAuth pageComponent={<PurchaseForm />} />} />
          <Route path=":id" element={<RouteAuth pageComponent={<PurchaseDetail />} />} /> */}
        </Route>
        {/* <Route path="/purchase_packages">
          <Route index element={<RouteAuth pageComponent={<PurchasePackageList />} />} />
          <Route path="new" element={<RouteAuth pageComponent={<PurchasePackageForm />} />} />
          <Route path=":id" element={<RouteAuth pageComponent={<PurchasePackageDetail />} />} />
        </Route> */}
        <Route path="/accounts" element={<RouteAuth pageComponent={<Accounts />} />} />
        <Route path="/stocks" element={<RouteAuth pageComponent={<StockStatus />} />} />
        <Route path="/expenses" element={<RouteAuth pageComponent={<Expenses />} />} />
        <Route path="/extra_income" element={<RouteAuth pageComponent={<ExtraIncome />} />} />
        <Route path="/cash_bank" element={<RouteAuth pageComponent={<CashBank />} />} />

        <Route path="/customer_category" element={<RouteAuth pageComponent={<CustomerCategory />} />} />
        <Route path="/designation" element={<RouteAuth pageComponent={<Designation />} />} />
        <Route path="/department" element={<RouteAuth pageComponent={<Department />} />} />
        <Route path="/banks" element={<RouteAuth pageComponent={<Banks />} />} />
        <Route path="/expense_type" element={<RouteAuth pageComponent={<ExpenseType />} />} />
        <Route path="/extra_income_type" element={<RouteAuth pageComponent={<ExtraIncomeType />} />} />
        <Route path="/grade" element={<RouteAuth pageComponent={<Grade />} />} />
        <Route path="/group" element={<RouteAuth pageComponent={<Group />} />} />
        <Route path="/office_time" element={<RouteAuth pageComponent={<OfficeTime />} />} />
        <Route path="/payment_type" element={<RouteAuth pageComponent={<PaymentType />} />} />
        <Route path="/product_category" element={<RouteAuth pageComponent={<ProductCategory />} />} />
        <Route path="/route" element={<RouteAuth pageComponent={<BusinessRoute />} />} />
        <Route path="/supplier_category" element={<RouteAuth pageComponent={<SupplierCategory />} />} />

      </Route>
    </Routes>
  );
}

export default App;
