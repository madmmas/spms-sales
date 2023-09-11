"use strict";(self.webpackChunkspms_app=self.webpackChunkspms_app||[]).push([[8656],{1811:function(e,t,r){r.d(t,{A5:function(){return W},CN:function(){return j},CZ:function(){return a},D:function(){return T},Eh:function(){return L},GB:function(){return F},H0:function(){return D},Hh:function(){return p},Hn:function(){return C},Id:function(){return g},Ik:function(){return k},LM:function(){return i},MU:function(){return n},Ni:function(){return f},Q4:function(){return Z},R$:function(){return h},UR:function(){return b},VB:function(){return m},VC:function(){return u},W9:function(){return I},aA:function(){return E},aF:function(){return y},eQ:function(){return N},ev:function(){return x},fs:function(){return _},if:function(){return R},it:function(){return c},kj:function(){return l},q$:function(){return o},qI:function(){return v},rV:function(){return S},s5:function(){return P},sf:function(){return s},sk:function(){return O},uG:function(){return A},vN:function(){return w},vY:function(){return d}});var n="dtBank",o="dtBankAccount",i="dtCash",a="dtCustomer",u="dtEmployee",c="dtEmploymentHistory",s="dtProduct",l="dtSupplier",d="dtWarehouse",f="dtStock",h="trxDamagedStock",m="trxStockAdjustment",p="trxExpense",y="trxExtraIncome",x="trxPurchase",g="trxSales",b="trxStockIn",P="trxStockOut",S="trxACReceivable",j="trxACPayable",v="trxBankRegister",k="trxCashRegister",C="trxPayment",_="dtCustomerCategory",R="dtDepartment",N="dtDesignation",Z="dtExpenseType",w="dtExtraIncomeType",F="dtGrade",T="dtGroup",W="dtProductBrand",E="dtProductModel",I="dtOfficeTime",O="dtPaymentType",A="dtProductCategory",D="dtRoute",L="dtSupplierCategory"},4881:function(e,t,r){r.r(t);var n=r(1413),o=r(9439),i=r(2426),a=r(2791),u=r(7890),c=r(919),s=r(1063),l=r(2971),d=r(7580),f=r(9461),h=r(1811),m=r(184);t.default=function(){var e=h.UR,t=(0,a.useRef)(null),r=(0,a.useRef)(null),p={fields:["id","register_date","register_details"],first:0,rows:10,page:1,sortField:null,sortOrder:null,filters:{name:{operator:u.pg.OR,constraints:[{value:null,matchMode:u.a6.STARTS_WITH}]}}},y=(0,a.useState)(!1),x=(0,o.Z)(y,2),g=x[0],b=x[1],P=(0,a.useState)(0),S=(0,o.Z)(P,2),j=S[0],v=S[1],k=(0,a.useState)(null),C=(0,o.Z)(k,2),_=C[0],R=C[1],N=(0,a.useState)(p),Z=(0,o.Z)(N,2),w=Z[0],F=Z[1],T=new f.a;(0,a.useEffect)((function(){E()}),[]);var W=function(){E()},E=function(){F(p)};(0,a.useEffect)((function(){I()}),[w]);var I=function(){b(!0),T.getAll(e,{params:JSON.stringify(w)}).then((function(e){console.log(e),v(e.total),R(e.rows),b(!1)}))},O=function(){r.current.exportCSV()};return(0,m.jsx)("div",{className:"grid crud-demo",children:(0,m.jsx)("div",{className:"col-12",children:(0,m.jsxs)("div",{className:"card",children:[(0,m.jsx)(d.F,{ref:t}),(0,m.jsxs)(l.w,{ref:r,value:_,dataKey:"_id",className:"datatable-responsive",responsiveLayout:"scroll",lazy:!0,loading:g,rows:w.rows,onSort:function(e){var t=(0,n.Z)((0,n.Z)({},w),e);F(t)},sortField:w.sortField,sortOrder:w.sortOrder,onFilter:function(e){var t=(0,n.Z)((0,n.Z)({},w),e);t.first=0,F(t)},filters:w.filters,filterDisplay:"menu",scrollable:!0,columnResizeMode:"expand",resizableColumns:!0,showGridlines:!0,paginator:!0,totalRecords:j,onPage:function(e){var t=(0,n.Z)((0,n.Z)({},w),e);F(t)},first:w.first,paginatorTemplate:"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",rowsPerPageOptions:[5,10,25,50],currentPageReportTemplate:"Showing {first} to {last} of {totalRecords} entries",emptyMessage:"No data found.",header:function(){return(0,m.jsxs)("div",{className:"flex justify-content-between",children:[(0,m.jsx)("h5",{className:"m-0",children:"Stock In"}),(0,m.jsxs)("div",{className:"p-toolbar-group-right",children:[(0,m.jsx)(c.z,{type:"button",icon:"pi pi-filter-slash",label:"Refresh",className:"p-button-outlined",onClick:W}),(0,m.jsx)(c.z,{label:"Export",icon:"pi pi-upload",className:"p-button-help m-2",onClick:O})]})]})},children:[(0,m.jsx)(s.s,{field:"date",header:"Transaction Date",filter:!0,filterPlaceholder:"Search by name",sortable:!0,body:function(e){return(0,m.jsx)(m.Fragment,{children:(t=e.register_date,i(t).format("DD/MM/YYYY"))});var t},headerStyle:{minWidth:"15rem"}}),(0,m.jsx)(s.s,{field:"voucher_no",header:"Voucher No",filter:!0,filterPlaceholder:"Search by name",sortable:!0,body:function(e){return(0,m.jsx)(m.Fragment,{children:e.voucher_no})},headerStyle:{minWidth:"15rem"}}),(0,m.jsx)(s.s,{field:"operation_type",header:"Opt",filter:!0,filterPlaceholder:"Search by name",sortable:!0,body:function(e){return(0,m.jsx)(m.Fragment,{children:e.operation_type})},headerStyle:{minWidth:"15rem"}}),(0,m.jsx)(s.s,{field:"product_name",header:"Product Name",filter:!0,filterPlaceholder:"Search by name",sortable:!0,body:function(e){return(0,m.jsx)(m.Fragment,{children:e.product_name})},headerStyle:{minWidth:"15rem"}}),(0,m.jsx)(s.s,{field:"quantity",header:"Quantity",filter:!0,filterPlaceholder:"Search by name",sortable:!0,body:function(e){return(0,m.jsx)(m.Fragment,{children:e.qty})},headerStyle:{minWidth:"15rem"}}),(0,m.jsx)(s.s,{field:"unit_cost",header:"Unit Cost",filter:!0,filterPlaceholder:"Search by totalPurchaseCost",sortable:!0,body:function(e){return(0,m.jsx)(m.Fragment,{children:e.unit_cost})},headerStyle:{minWidth:"15rem"}}),(0,m.jsx)(s.s,{field:"total_unit_cost",header:"Total Cost Value",filter:!0,filterPlaceholder:"Search by totalPurchaseCost",sortable:!0,body:function(e){return(0,m.jsx)(m.Fragment,{children:e.unit_cost*e.qty})},headerStyle:{minWidth:"15rem"}}),(0,m.jsx)(s.s,{field:"trade_price",header:"Trade Price",filter:!0,filterPlaceholder:"Search by totalTradePrice",sortable:!0,body:function(e){return(0,m.jsx)(m.Fragment,{children:e.trade_price})},headerStyle:{minWidth:"15rem"}}),(0,m.jsx)(s.s,{field:"total_trade_price",header:"Total Trade Value",filter:!0,filterPlaceholder:"Search by totalTradePrice",sortable:!0,body:function(e){return(0,m.jsx)(m.Fragment,{children:e.trade_price*e.qty})},headerStyle:{minWidth:"15rem"}})]})]})})})}},9461:function(e,t,r){r.d(t,{a:function(){return c}});var n=r(4165),o=r(5861),i=r(5671),a=r(3144),u=r(8293),c=function(){function e(){(0,i.Z)(this,e)}return(0,a.Z)(e,[{key:"getAll",value:function(){var e=(0,o.Z)((0,n.Z)().mark((function e(t,r){var o,i;return(0,n.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return o=r?Object.keys(r).map((function(e){return encodeURIComponent(e)+"="+encodeURIComponent(r[e])})).join("&"):"",i="/register/".concat(t,"?")+o,e.abrupt("return",u.ZP.get(i,{timeout:15e3,id:i,cache:{ttl:2e4}}).then((function(e){return e.data})));case 3:case"end":return e.stop()}}),e)})));return function(t,r){return e.apply(this,arguments)}}()}]),e}()}}]);
//# sourceMappingURL=stockIn.ea3c52ef.chunk.js.map