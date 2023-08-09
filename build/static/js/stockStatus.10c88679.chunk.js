/*! For license information please see stockStatus.10c88679.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunkspms_app=self.webpackChunkspms_app||[]).push([[3782,1964,3985],{1811:function(t,e,r){r.d(e,{CN:function(){return b},CZ:function(){return c},D:function(){return O},Eh:function(){return A},GB:function(){return N},H0:function(){return R},Hh:function(){return v},Hn:function(){return S},Id:function(){return g},Ik:function(){return P},K$:function(){return w},LM:function(){return a},MU:function(){return n},Ni:function(){return d},Q4:function(){return C},R$:function(){return p},UR:function(){return x},VB:function(){return h},VC:function(){return u},W9:function(){return F},aF:function(){return y},eQ:function(){return L},ev:function(){return m},fs:function(){return j},if:function(){return _},it:function(){return i},kj:function(){return l},q$:function(){return o},qI:function(){return Z},s5:function(){return k},sf:function(){return s},sk:function(){return T},uG:function(){return I},vN:function(){return E},vY:function(){return f}});var n="dtBank",o="dtBankAccount",a="dtCash",c="dtCustomer",u="dtEmployee",i="dtEmploymentHistory",s="dtProduct",l="dtSupplier",f="dtWarehouse",d="dtStock",p="trxDamagedStock",h="trxStockAdjustment",v="trxExpense",y="trxExtraIncome",m="trxPurchase",g="trxSales",x="trxStockIn",k="trxStockOut",w="trxACRecievable",b="trxACPayable",Z="trxBankRegister",P="trxCashRegister",S="trxPayment",j="dtCustomerCategory",_="dtDepartment",L="dtDesignation",C="dtExpenseType",E="dtExtraIncomeType",N="dtGrade",O="dtGroup",F="dtOfficeTime",T="dtPaymentType",I="dtProductCategory",R="dtRoute",A="dtSupplierCategory"},9615:function(t,e,r){r.d(e,{Aq:function(){return u},Cg:function(){return l},Hf:function(){return n},IE:function(){return i},PC:function(){return p},PV:function(){return s},Qx:function(){return f},UM:function(){return h},UY:function(){return a},_q:function(){return d},pe:function(){return o},wu:function(){return c}});var n="onStockInPackageProduct",o="onSalesProduct",a="onCancelSalesOrder",c="onConfirmSalesOrder",u="onExpenseFromCash",i="onExpenseFromBank",s="onExtraIncomeToCash",l="onExtraIncomeToBank",f="onCashToBank",d="onBankToCash",p="onDamagedStock",h="onStockAdjustment"},2217:function(t,e,r){r.r(e);var n=r(1413),o=r(9439),a=r(2791),c=r(7890),u=r(919),i=r(1063),s=r(7145),l=r(7580),f=r(3985),d=r(1811),p=r(184);e.default=function(){d.Ni;var t=(0,a.useRef)(null),e=(0,a.useRef)(null),r={fields:["name","code","price","cost","unit","current_stock","prev_stock","total_stock_in","total_stock_out","low_stock_qty"],first:0,rows:10,page:1,sortField:null,sortOrder:null,filters:{name:{operator:c.pg.OR,constraints:[{value:null,matchMode:c.a6.STARTS_WITH}]}}},h=(0,a.useState)(!1),v=(0,o.Z)(h,2),y=v[0],m=v[1],g=(0,a.useState)(0),x=(0,o.Z)(g,2),k=x[0],w=x[1],b=(0,a.useState)(null),Z=(0,o.Z)(b,2),P=Z[0],S=Z[1],j=(0,a.useState)(r),_=(0,o.Z)(j,2),L=_[0],C=_[1],E=new f.M;(0,a.useEffect)((function(){O()}),[]);var N=function(){O()},O=function(){C(r)};(0,a.useEffect)((function(){F()}),[L]);var F=function(){m(!0),E.getAll({params:JSON.stringify(L)}).then((function(t){console.log(t),w(t.total),S(t.rows),m(!1)}))},T=function(){e.current.exportCSV()};return(0,p.jsx)("div",{className:"grid crud-demo",children:(0,p.jsx)("div",{className:"col-12",children:(0,p.jsxs)("div",{className:"card",children:[(0,p.jsx)(l.F,{ref:t}),(0,p.jsxs)(s.w,{ref:e,value:P,dataKey:"_id",className:"datatable-responsive",responsiveLayout:"scroll",lazy:!0,loading:y,rows:L.rows,onSort:function(t){var e=(0,n.Z)((0,n.Z)({},L),t);C(e)},sortField:L.sortField,sortOrder:L.sortOrder,onFilter:function(t){var e=(0,n.Z)((0,n.Z)({},L),t);e.first=0,C(e)},filters:L.filters,filterDisplay:"menu",scrollable:!0,columnResizeMode:"expand",resizableColumns:!0,showGridlines:!0,paginator:!0,totalRecords:k,onPage:function(t){var e=(0,n.Z)((0,n.Z)({},L),t);C(e)},first:L.first,paginatorTemplate:"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",rowsPerPageOptions:[5,10,25,50],currentPageReportTemplate:"Showing {first} to {last} of {totalRecords} entries",emptyMessage:"No data found.",header:function(){return(0,p.jsxs)("div",{className:"flex justify-content-between",children:[(0,p.jsx)("h5",{className:"m-0",children:"Current Stock"}),(0,p.jsxs)("div",{className:"p-toolbar-group-right",children:[(0,p.jsx)(u.z,{type:"button",icon:"pi pi-filter-slash",label:"Refresh",className:"p-button-outlined",onClick:N}),(0,p.jsx)(u.z,{label:"Export",icon:"pi pi-upload",className:"p-button-help m-2",onClick:T})]})]})},children:[(0,p.jsx)(i.s,{field:"name",header:"Product Name",filter:!0,filterPlaceholder:"Search by Product Name",sortable:!0,body:function(t){return(0,p.jsx)(p.Fragment,{children:t.name})},headerStyle:{minWidth:"15rem"}}),(0,p.jsx)(i.s,{field:"current_stock",header:"Current Stock",filter:!0,filterPlaceholder:"Search by Current Stock",sortable:!0,body:function(t){return(0,p.jsx)(p.Fragment,{children:t.current_stock})},headerStyle:{minWidth:"15rem"}}),(0,p.jsx)(i.s,{field:"prev_stock",header:"Previous Stock",filter:!0,filterPlaceholder:"Search by Previous Stock",sortable:!0,body:function(t){return(0,p.jsx)(p.Fragment,{children:t.prev_stock})},headerStyle:{minWidth:"15rem"}}),(0,p.jsx)(i.s,{field:"low_stock_qty",header:"Low Stock Qty",filter:!0,filterPlaceholder:"Search by lowStockQty",sortable:!0,body:function(t){return(0,p.jsx)(p.Fragment,{children:t.low_stock_qty})},headerStyle:{minWidth:"15rem"}}),(0,p.jsx)(i.s,{field:"total_stock_in",header:"totalStockIn",filter:!0,filterPlaceholder:"Search by totalStockIn",sortable:!0,body:function(t){return(0,p.jsx)(p.Fragment,{children:t.total_stock_in})},headerStyle:{minWidth:"15rem"}}),(0,p.jsx)(i.s,{field:"total_stock_out",header:"totalStockOut",filter:!0,filterPlaceholder:"Search by totalStockOut",sortable:!0,body:function(t){return(0,p.jsx)(p.Fragment,{children:t.total_stock_out})},headerStyle:{minWidth:"15rem"}}),(0,p.jsx)(i.s,{field:"cost",header:"Unit Cost",filter:!0,filterPlaceholder:"Search by cost",sortable:!0,body:function(t){return(0,p.jsx)(p.Fragment,{children:t.cost})},headerStyle:{minWidth:"15rem"}}),(0,p.jsx)(i.s,{field:"total_cost",header:"Total Cost",filter:!0,filterPlaceholder:"Search by cost",sortable:!0,body:function(t){return(0,p.jsx)(p.Fragment,{children:t.cost*t.current_stock})},headerStyle:{minWidth:"15rem"}}),(0,p.jsx)(i.s,{field:"price",header:"Trade Price",filter:!0,filterPlaceholder:"Search by totalTradePrice",sortable:!0,body:function(t){return(0,p.jsx)(p.Fragment,{children:t.price})},headerStyle:{minWidth:"15rem"}}),(0,p.jsx)(i.s,{field:"total_price",header:"Total Price",filter:!0,filterPlaceholder:"Search by totalTradePrice",sortable:!0,body:function(t){return(0,p.jsx)(p.Fragment,{children:t.price*t.current_stock})},headerStyle:{minWidth:"15rem"}})]})]})})})}},2516:function(t,e,r){r.d(e,{D:function(){return i}});var n=r(4165),o=r(5861),a=r(5671),c=r(3144),u=r(8290),i=function(){function t(){(0,a.Z)(this,t)}return(0,c.Z)(t,[{key:"getById",value:function(){var t=(0,o.Z)((0,n.Z)().mark((function t(e,r){var o;return(0,n.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.ZP.get("/data/".concat(e,"/")+r);case 2:return o=t.sent,console.log(o.data),t.abrupt("return",o.data);case 5:case"end":return t.stop()}}),t)})));return function(e,r){return t.apply(this,arguments)}}()},{key:"getByFilters",value:function(){var t=(0,o.Z)((0,n.Z)().mark((function t(e,r){var o;return(0,n.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.ZP.get("/dataByParams/".concat(e,"?params=")+JSON.stringify(r));case 2:return o=t.sent,console.log(o.data),t.abrupt("return",o.data);case 5:case"end":return t.stop()}}),t)})));return function(e,r){return t.apply(this,arguments)}}()},{key:"getAll",value:function(){var t=(0,o.Z)((0,n.Z)().mark((function t(e,r){var o;return(0,n.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o=r?Object.keys(r).map((function(t){return encodeURIComponent(t)+"="+encodeURIComponent(r[t])})).join("&"):"",t.abrupt("return",u.ZP.get("/data/".concat(e,"?")+o).then((function(t){return t.data})));case 2:case"end":return t.stop()}}),t)})));return function(e,r){return t.apply(this,arguments)}}()},{key:"create",value:function(){var t=(0,o.Z)((0,n.Z)().mark((function t(e,r){var o;return(0,n.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.ZP.post("/data/".concat(e),r);case 2:return o=t.sent,console.log(o.data),t.abrupt("return",o.data);case 5:case"end":return t.stop()}}),t)})));return function(e,r){return t.apply(this,arguments)}}()},{key:"update",value:function(){var t=(0,o.Z)((0,n.Z)().mark((function t(e,r,o){var a;return(0,n.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.ZP.put("/data/".concat(e,"/")+r,o);case 2:return a=t.sent,console.log(a.data),t.abrupt("return",a.data);case 5:case"end":return t.stop()}}),t)})));return function(e,r,n){return t.apply(this,arguments)}}()},{key:"delete",value:function(){var t=(0,o.Z)((0,n.Z)().mark((function t(e,r){var o;return(0,n.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.ZP.delete("/data/".concat(e,"/")+r);case 2:return o=t.sent,console.log(o.data),t.abrupt("return",o.data);case 5:case"end":return t.stop()}}),t)})));return function(e,r){return t.apply(this,arguments)}}()}]),t}()},3985:function(t,e,r){r.d(e,{M:function(){return d}});var n=r(4165),o=r(5861),a=r(5671),c=r(3144),u=r(8290),i=r(7890),s=r(2516),l=r(9565),f=r(9615),d=function(){function t(){(0,a.Z)(this,t),this.masterDataService=new s.D,this.transactionService=new l.p}return(0,c.Z)(t,[{key:"getById",value:function(){var t=(0,o.Z)((0,n.Z)().mark((function t(e){var r;return(0,n.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.ZP.get("/products/"+e);case 2:return r=t.sent,console.log(r.data),t.abrupt("return",r.data);case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},{key:"getAll",value:function(){var t=(0,o.Z)((0,n.Z)().mark((function t(e){var r;return(0,n.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=e?Object.keys(e).map((function(t){return encodeURIComponent(t)+"="+encodeURIComponent(e[t])})).join("&"):"",t.abrupt("return",u.ZP.get("/products?"+r).then((function(t){return t.data})));case 2:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},{key:"create",value:function(){var t=(0,o.Z)((0,n.Z)().mark((function t(e){var r;return(0,n.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.ZP.post("/products",e);case 2:return r=t.sent,console.log(r.data),t.abrupt("return",r.data);case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},{key:"update",value:function(){var t=(0,o.Z)((0,n.Z)().mark((function t(e,r){var o;return(0,n.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.ZP.put("/products/"+e,r);case 2:return o=t.sent,console.log(o.data),t.abrupt("return",o.data);case 5:case"end":return t.stop()}}),t)})));return function(e,r){return t.apply(this,arguments)}}()},{key:"getProductCurrentStock",value:function(){var t=(0,o.Z)((0,n.Z)().mark((function t(e){var r,o;return(0,n.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r={dtProduct_id:{operator:i.pg.AND,constraints:[{value:e,matchMode:i.a6.EQUALS}]}},t.next=3,this.masterDataService.getByFilters("dtStock",r);case 3:return o=t.sent,console.log(o),t.abrupt("return",o.currentStock);case 6:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"addPackageToStock",value:function(){var t=(0,o.Z)((0,n.Z)().mark((function t(e){var r;return(0,n.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.transactionService.processTransaction(f.Hf,e);case 2:return r=t.sent,console.log(r),t.abrupt("return",r);case 5:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"getProductCustomerLastPrice",value:function(){var t=(0,o.Z)((0,n.Z)().mark((function t(e,r){var o,a;return(0,n.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o={dtProduct_id:{operator:i.pg.AND,constraints:[{value:e,matchMode:i.a6.EQUALS}]},dtCustomer_id:{operator:i.pg.AND,constraints:[{value:r,matchMode:i.a6.EQUALS}]}},t.next=3,this.masterDataService.getByFilters("dtProductSalesCustomer",o);case 3:return a=t.sent,console.log(a),t.abrupt("return",a.lastTradePrice);case 6:case"end":return t.stop()}}),t,this)})));return function(e,r){return t.apply(this,arguments)}}()}]),t}()},9565:function(t,e,r){r.d(e,{p:function(){return i}});var n=r(4165),o=r(5861),a=r(5671),c=r(3144),u=r(8290),i=function(){function t(){(0,a.Z)(this,t)}return(0,c.Z)(t,[{key:"getById",value:function(){var t=(0,o.Z)((0,n.Z)().mark((function t(e,r){var o;return(0,n.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.ZP.get("/trxdata/".concat(e,"/").concat(r));case 2:return o=t.sent,console.log(o.data),t.abrupt("return",o.data);case 5:case"end":return t.stop()}}),t)})));return function(e,r){return t.apply(this,arguments)}}()},{key:"getLedgerByParty",value:function(){var t=(0,o.Z)((0,n.Z)().mark((function t(e){var r;return(0,n.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.ZP.get("/ledger/".concat(e));case 2:return r=t.sent,console.log(r.data),t.abrupt("return",r.data);case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},{key:"getLedgerByPartyId",value:function(){var t=(0,o.Z)((0,n.Z)().mark((function t(e,r){var o;return(0,n.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.ZP.get("/ledger/".concat(e,"/").concat(r));case 2:return o=t.sent,console.log(o.data),t.abrupt("return",o.data);case 5:case"end":return t.stop()}}),t)})));return function(e,r){return t.apply(this,arguments)}}()},{key:"getAll",value:function(){var t=(0,o.Z)((0,n.Z)().mark((function t(e,r){var o;return(0,n.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o=r?Object.keys(r).map((function(t){return encodeURIComponent(t)+"="+encodeURIComponent(r[t])})).join("&"):"",t.abrupt("return",u.ZP.get("/trxdata/".concat(e,"?")+o).then((function(t){return t.data})));case 2:case"end":return t.stop()}}),t)})));return function(e,r){return t.apply(this,arguments)}}()},{key:"processTransaction",value:function(){var t=(0,o.Z)((0,n.Z)().mark((function t(e,r){var o;return(0,n.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.ZP.post("/transaction/".concat(e),r);case 2:return o=t.sent,console.log(o.data),t.abrupt("return",o.data);case 5:case"end":return t.stop()}}),t)})));return function(e,r){return t.apply(this,arguments)}}()}]),t}()},5861:function(t,e,r){function n(t,e,r,n,o,a,c){try{var u=t[a](c),i=u.value}catch(s){return void r(s)}u.done?e(i):Promise.resolve(i).then(n,o)}function o(t){return function(){var e=this,r=arguments;return new Promise((function(o,a){var c=t.apply(e,r);function u(t){n(c,o,a,u,i,"next",t)}function i(t){n(c,o,a,u,i,"throw",t)}u(void 0)}))}}r.d(e,{Z:function(){return o}})},4165:function(t,e,r){r.d(e,{Z:function(){return o}});var n=r(1002);function o(){o=function(){return t};var t={},e=Object.prototype,r=e.hasOwnProperty,a=Object.defineProperty||function(t,e,r){t[e]=r.value},c="function"==typeof Symbol?Symbol:{},u=c.iterator||"@@iterator",i=c.asyncIterator||"@@asyncIterator",s=c.toStringTag||"@@toStringTag";function l(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{l({},"")}catch(E){l=function(t,e,r){return t[e]=r}}function f(t,e,r,n){var o=e&&e.prototype instanceof h?e:h,c=Object.create(o.prototype),u=new _(n||[]);return a(c,"_invoke",{value:Z(t,r,u)}),c}function d(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(E){return{type:"throw",arg:E}}}t.wrap=f;var p={};function h(){}function v(){}function y(){}var m={};l(m,u,(function(){return this}));var g=Object.getPrototypeOf,x=g&&g(g(L([])));x&&x!==e&&r.call(x,u)&&(m=x);var k=y.prototype=h.prototype=Object.create(m);function w(t){["next","throw","return"].forEach((function(e){l(t,e,(function(t){return this._invoke(e,t)}))}))}function b(t,e){function o(a,c,u,i){var s=d(t[a],t,c);if("throw"!==s.type){var l=s.arg,f=l.value;return f&&"object"==(0,n.Z)(f)&&r.call(f,"__await")?e.resolve(f.__await).then((function(t){o("next",t,u,i)}),(function(t){o("throw",t,u,i)})):e.resolve(f).then((function(t){l.value=t,u(l)}),(function(t){return o("throw",t,u,i)}))}i(s.arg)}var c;a(this,"_invoke",{value:function(t,r){function n(){return new e((function(e,n){o(t,r,e,n)}))}return c=c?c.then(n,n):n()}})}function Z(t,e,r){var n="suspendedStart";return function(o,a){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===o)throw a;return C()}for(r.method=o,r.arg=a;;){var c=r.delegate;if(c){var u=P(c,r);if(u){if(u===p)continue;return u}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var i=d(t,e,r);if("normal"===i.type){if(n=r.done?"completed":"suspendedYield",i.arg===p)continue;return{value:i.arg,done:r.done}}"throw"===i.type&&(n="completed",r.method="throw",r.arg=i.arg)}}}function P(t,e){var r=e.method,n=t.iterator[r];if(void 0===n)return e.delegate=null,"throw"===r&&t.iterator.return&&(e.method="return",e.arg=void 0,P(t,e),"throw"===e.method)||"return"!==r&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+r+"' method")),p;var o=d(n,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,p;var a=o.arg;return a?a.done?(e[t.resultName]=a.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,p):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,p)}function S(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function j(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function _(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(S,this),this.reset(!0)}function L(t){if(t){var e=t[u];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,o=function e(){for(;++n<t.length;)if(r.call(t,n))return e.value=t[n],e.done=!1,e;return e.value=void 0,e.done=!0,e};return o.next=o}}return{next:C}}function C(){return{value:void 0,done:!0}}return v.prototype=y,a(k,"constructor",{value:y,configurable:!0}),a(y,"constructor",{value:v,configurable:!0}),v.displayName=l(y,s,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===v||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,y):(t.__proto__=y,l(t,s,"GeneratorFunction")),t.prototype=Object.create(k),t},t.awrap=function(t){return{__await:t}},w(b.prototype),l(b.prototype,i,(function(){return this})),t.AsyncIterator=b,t.async=function(e,r,n,o,a){void 0===a&&(a=Promise);var c=new b(f(e,r,n,o),a);return t.isGeneratorFunction(r)?c:c.next().then((function(t){return t.done?t.value:c.next()}))},w(k),l(k,s,"Generator"),l(k,u,(function(){return this})),l(k,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},t.values=L,_.prototype={constructor:_,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(j),!t)for(var e in this)"t"===e.charAt(0)&&r.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(r,n){return c.type="throw",c.arg=t,e.next=r,n&&(e.method="next",e.arg=void 0),!!n}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],c=a.completion;if("root"===a.tryLoc)return n("end");if(a.tryLoc<=this.prev){var u=r.call(a,"catchLoc"),i=r.call(a,"finallyLoc");if(u&&i){if(this.prev<a.catchLoc)return n(a.catchLoc,!0);if(this.prev<a.finallyLoc)return n(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return n(a.catchLoc,!0)}else{if(!i)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return n(a.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var c=a?a.completion:{};return c.type=t,c.arg=e,a?(this.method="next",this.next=a.finallyLoc,p):this.complete(c)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),p},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),j(r),p}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;j(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:L(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=void 0),p}},t}}}]);
//# sourceMappingURL=stockStatus.10c88679.chunk.js.map