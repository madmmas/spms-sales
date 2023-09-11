"use strict";(self.webpackChunkspms_app=self.webpackChunkspms_app||[]).push([[4757],{7193:function(e,r,t){t.d(r,{Z:function(){return f}});var n=t(9439),a=t(2791),l=t(5103),s=t(1413),i=t(2971),o=t(1063),c=t(375),d=t(3985),u=t(184);function m(e){var r=e.defaultFilters,t=e.fieldValue,m=e.onSelect,f=(e.modelName,e.columns),h=(e.showFields,e.caption,e.dialogHeight,e.dialogWidth,(0,a.useRef)(null)),p=(0,a.useRef)(null),v=(0,a.useState)(!1),x=(0,n.Z)(v,2),j=x[0],g=x[1],N=(0,a.useState)(""),_=(0,n.Z)(N,2),C=_[0],y=_[1],b=(0,a.useState)(0),S=(0,n.Z)(b,2),F=S[0],R=S[1],T=(0,a.useState)(r),D=(0,n.Z)(T,2),P=D[0],E=D[1],A=(0,a.useState)([]),w=(0,n.Z)(A,2),Z=w[0],I=w[1],U=(0,a.useState)({}),K=(0,n.Z)(U,2),B=K[0],Q=(K[1],new d.M);(0,a.useEffect)((function(){k()}),[]),(0,a.useEffect)((function(){g(!0),Q.getAll(P).then((function(e){R(e.total),I(e.rows),g(!1)}))}),[P]);var k=function(){E(r),y("")},L=function(e){return e.id!==t};return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)("span",{className:"p-input-icon-left",children:[(0,u.jsx)("i",{className:"pi pi-search"}),(0,u.jsx)(l.o,{value:C,onChange:function(e){var r=(0,s.Z)({},P),t=e.target.value;y(t),null!==t&&void 0!==t&&(r.filters.global.value=t,r.first=0,E(r))},onClick:function(e){p.current.show(e)},onFocus:function(e){e.target.select()},placeholder:"Search"})]}),(0,u.jsx)(c.T,{ref:p,showCloseIcon:!0,children:(0,u.jsxs)(i.w,{ref:h,value:Z,dataKey:"id",className:"datatable-responsive",responsiveLayout:"scroll",lazy:!0,loading:j,rows:P.rows,onSort:function(e){var r=(0,s.Z)((0,s.Z)({},P),e);E(r)},sortField:P.sortField,sortOrder:P.sortOrder,onFilter:function(e){var r=(0,s.Z)((0,s.Z)({},P),e);r.first=0,E(r)},filterDisplay:"row",filters:P.filters,isDataSelectable:function(e){return!e.data||L(e.data)},rowClassName:function(e){return L(e)?"":"p-disabled"},scrollable:!0,scrollHeight:"flex",tableStyle:{minWidth:"50rem"},paginator:!0,totalRecords:F,onPage:function(e){var r=(0,s.Z)((0,s.Z)({},P),e);E(r)},first:P.first,paginatorTemplate:"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",rowsPerPageOptions:[5,10,15],currentPageReportTemplate:"Showing {first} to {last} of {totalRecords} entries",globalFilterFields:["name"],selectionMode:"single",selection:B,onSelectionChange:function(e){!function(e){p.current.hide(),y(""),m(e)}(e)},emptyMessage:"No data found.",children:[(0,u.jsx)(o.s,{selectionMode:"single",headerStyle:{minWidth:"3rem"}}),f.map((function(e,r){return(0,u.jsx)(o.s,{field:e.field,header:e.header,filter:!0,filterPlaceholder:e.filterPlaceholder,sortable:!0,headerStyle:{width:e.width}},r)}))]})})]})}function f(e){var r=e.field,t=e.displayField,s=e.showFields,i=void 0===s?[]:s,o=e.defaultFilters,c=e.modelName,f=e.className,h=e.columns,p=e.caption,v=void 0===p?"Select":p,x=e.onSelect,j=new d.M,g=(0,a.useState)(""),N=(0,n.Z)(g,2),_=N[0],C=N[1],y=(0,a.useState)(0),b=(0,n.Z)(y,2),S=b[0],F=b[1];(0,a.useEffect)((function(){null!=r.value&&""!=r.value?j.getById(r.value).then((function(e){C(e[t])})):C("")}),[r.value]);return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(l.o,{readonly:"true",value:_,placeholder:v,className:f,onClick:function(){return F((function(e){return e+1}))}}),(0,u.jsx)(l.o,{hidden:!0,inputId:r.name,value:r.value,inputRef:r.ref}),(0,u.jsx)(m,{displayField:t,trigger:S,fieldName:r.name,fieldValue:r.value,fieldRef:r.ref,defaultFilters:o,modelName:c,caption:v,className:f,columns:h,showFields:i,onSelect:function(e){C(e.value[t]),r.onChange(e.value.id),x(e.value)}})]})}},9736:function(e,r,t){t.r(r),t.d(r,{default:function(){return Z}});var n=t(1413),a=t(4165),l=t(3433),s=t(5861),i=t(9439),o=t(2791),c=t(7689),d=t(9195),u=t(5103),m=t(8218),f=t(919),h=t(7580),p=t(3428),v=t(5854),x=t(9856),j=t(1063),g=t(2971),N=t(5533),_=t(3956),C=t(1811),y=t(8998),b=t(2516),S=t(1412),F=t(7890),R=t(7193),T=t(184);function D(e){var r=e.onAdd,t=e.onEdit,l=e.currency,c=e.conversionRate,m=e.supplierId,h=e.selectedProduct,p=e.defaultPurchaseProduct,x=e.defaultWarehouse,j={product_id:"",warehouse_id:"",bar_code:"",last_purchase_price:0,qty:1,unit_cost_f:0,totalCostF:0,conversion_rate:c,unit_cost:0,totalCostBDT:0,transport:0,duty_vat:0,netUnitCostBDT:0,netCostBDT:0,discount_profit:0,profit:0,trade_price:0,min_price:0},g=(0,d.cI)({defaultValues:j}),b=(g.register,g.control),S=g.formState.errors,D=g.reset,P=g.setValue,E=g.handleSubmit,A=(0,o.useRef)(null),w=(0,o.useState)(p),Z=(0,i.Z)(w,2),I=Z[0],U=Z[1],K=(0,o.useState)(!1),B=(0,i.Z)(K,2),Q=(B[0],B[1],(0,o.useState)(!1)),k=(0,i.Z)(Q,2),L=k[0],W=k[1],V=(0,o.useState)(null),M=(0,i.Z)(V,2),O=M[0],q=M[1],z=new y.p;(0,o.useEffect)((function(){console.log("SUPPLIER ID::",m),m&&q(m)}),[m]),(0,o.useEffect)((function(){P("warehouse_id",x)}),[x]),(0,o.useEffect)((function(){P("conversion_rate",c);var e=(0,n.Z)({},I);e.conversion_rate=c,U(e)}),[c]),(0,o.useEffect)((function(){h.product_id&&(D((0,n.Z)({},h)),U(h),console.log("Selected Product :::: ",h),W(!0))}),[h]);var H=function(e){return Math.round(100*(e+Number.EPSILON))/100},X=function(e){console.log("CALCULATING COST:::=>>",I.conversion_rate),e.totalCostF=H(e.unit_cost_f*e.qty),e.unit_cost=H(e.unit_cost_f*e.conversion_rate),e.totalCostBDT=H(e.unit_cost*e.qty),e.netUnitCostBDT=H(e.unit_cost+e.transport/e.qty+e.duty_vat/e.qty),e.netCostBDT=H(e.netUnitCostBDT*e.qty),e.trade_price=H(e.netUnitCostBDT+e.profit),e.min_price=e.min_price,U(e),P("totalCostF",e.totalCostF),P("unit_cost",e.unit_cost),P("totalCostBDT",e.totalCostBDT),P("netUnitCostBDT",e.netUnitCostBDT),P("netCostBDT",e.netCostBDT),P("trade_price",e.trade_price),P("min_price",e.min_price)},G=function(e,r){var t=e.target&&e.target.value||0,a=(0,n.Z)({},I);a["".concat(r)]=t,P(r,t),X(a)},Y=function(){var e=(0,s.Z)((0,a.Z)().mark((function e(r){var t,l;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(console.log("supplierId::",O),t=0,null===O){e.next=6;break}return e.next=5,z.getOrderProductLastPrice("trxPurchase",r.id,O);case 5:t=e.sent;case 6:console.log("LAST TRADE PRICE::",t),A.current.focus(),console.log("PRODUCT SELECTED::",r),console.log("DEFAULT PURCHASE PRODUCT:::=>>",p),(l=(0,n.Z)({},p)).product_id=r.id,l.product_name=r.name,l.bar_code=r.bar_code,l.last_purchase_price=t,U(l),console.log("SELECTED __PRODUCT:::=>>",l),console.log("SELECTED PRODUCT:::=>>",I),console.log("SELECTED PRODUCT ID :::=>>",r.id),P("product_id",r.id),P("product_name",r.name),P("last_purchase_price",t),P("warehouse_id",x);case 23:case"end":return e.stop()}}),e)})));return function(r){return e.apply(this,arguments)}}(),$=function(e){return S[e]&&(0,T.jsx)("small",{className:"p-error",children:S[e].message})},J={fields:["id","name","brand_name","model_no","part_number"],first:0,rows:10,page:1,sortField:null,sortOrder:null,filters:{global:{value:null,matchMode:F.a6.CONTAINS},name:{value:null,matchMode:F.a6.CONTAINS},brandName:{value:null,matchMode:F.a6.CONTAINS},modelNo:{value:null,matchMode:F.a6.CONTAINS},partNumber:{value:null,matchMode:F.a6.CONTAINS}}};return(0,T.jsxs)("div",{className:"p-fluid formgrid grid",children:[(0,T.jsx)("div",{className:"field col-12 md:col-2",children:(0,T.jsx)(d.Qr,{name:"product_id",control:b,rules:{required:"Product is required."},render:function(e){var r=e.field,t=e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{htmlFor:r.name,className:(0,v.AK)({"p-error":S.value}),children:"Product*"}),(0,T.jsx)(R.Z,{field:r,modelName:C.sf,displayField:"name",className:(0,v.AK)({"p-invalid":t.error}),onSelect:Y,defaultFilters:J,columns:[{field:"name",header:"Product Name",filterPlaceholder:"Filter by Product Name",width:"50rem"},{field:"brand_name",header:"Brand Name",filterPlaceholder:"Filter by Barnd Name",width:"15rem"},{field:"model_no",header:"Model No",filterPlaceholder:"Filter by Model No",width:"15rem"},{field:"part_number",header:"Part Number",filterPlaceholder:"Filter by Part Number",width:"15rem"},{field:"category_name",header:"Product Category",filterPlaceholder:"Filter by Product Category",width:"15rem"}]}),$(r.name)]})}})}),(0,T.jsx)("div",{className:"field col-12 md:col-2",children:(0,T.jsx)(d.Qr,{name:"warehouse_id",control:b,rules:{required:"Warehouse is required."},render:function(e){var r=e.field,t=e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{htmlFor:r.name,className:(0,v.AK)({"p-error":S.value}),children:"Warehouse*"}),(0,T.jsx)(_.Z,{field:r,modelName:C.vY,displayField:"name",className:(0,v.AK)({"p-invalid":t.error}),columns:[{field:"name",header:"Warehouse",filterPlaceholder:"Filter by Warehouse"}]}),$(r.name)]})}})}),(0,T.jsx)("div",{className:"field col-12 md:col-2",children:(0,T.jsx)(d.Qr,{name:"bar_code",control:b,render:function(e){var r=e.field;e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{htmlFor:r.name,className:(0,v.AK)({"p-error":S.value}),children:"Barcode"}),(0,T.jsx)(u.o,{inputId:r.name,value:r.value,inputRef:r.ref,disabled:!0}),$(r.name)]})}})}),(0,T.jsx)("div",{className:"field col-12 md:col-2",children:(0,T.jsx)(d.Qr,{name:"last_purchase_price",control:b,render:function(e){var r=e.field,t=e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{htmlFor:r.name,className:(0,v.AK)({"p-error":S.value}),children:"Last Purchase Price"}),(0,T.jsx)(N.R,{inputId:r.name,value:r.value,inputRef:r.ref,className:(0,v.AK)({"p-invalid":t.error}),disabled:!0})]})}})}),(0,T.jsx)("div",{className:"field col-12 md:col-2",children:(0,T.jsx)(d.Qr,{name:"qty",control:b,render:function(e){var r=e.field,t=e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{htmlFor:r.name,className:(0,v.AK)({"p-error":S.value}),children:"Quantity"}),(0,T.jsx)(N.R,{ref:A,onFocus:function(e){return e.target.select()},inputId:r.name,value:r.value,inputRef:r.ref,className:(0,v.AK)({"p-invalid":t.error}),onValueChange:function(e){return G(e,"qty")},min:1,max:1e7})]})}})}),(0,T.jsx)("div",{className:"field col-12 md:col-2",children:(0,T.jsx)(d.Qr,{name:"unit_cost_f",control:b,render:function(e){var r=e.field,t=e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsxs)("label",{htmlFor:r.name,className:(0,v.AK)({"p-error":S.value}),children:["Unit Cost (",l,")"]}),(0,T.jsx)(N.R,{onFocus:function(e){return e.target.select()},inputId:r.name,value:r.value,inputRef:r.ref,className:(0,v.AK)({"p-invalid":t.error}),onValueChange:function(e){return G(e,"unit_cost_f")},maxFractionDigits:2})]})}})}),(0,T.jsx)("div",{className:"field col-12 md:col-2",children:(0,T.jsx)(d.Qr,{name:"totalCostF",control:b,render:function(e){var r=e.field,t=e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsxs)("label",{htmlFor:r.name,className:(0,v.AK)({"p-error":S.value}),children:["Total Cost (",l,")"]}),(0,T.jsx)(N.R,{inputId:r.name,value:r.value,inputRef:r.ref,className:(0,v.AK)({"p-invalid":t.error}),disabled:!0})]})}})}),(0,T.jsx)("div",{className:"field col-12 md:col-2",children:(0,T.jsx)(d.Qr,{name:"conversion_rate",control:b,render:function(e){var r=e.field,t=e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{htmlFor:r.name,className:(0,v.AK)({"p-error":S.value}),children:"Conversion Rate"}),(0,T.jsx)(N.R,{onFocus:function(e){return e.target.select()},inputId:r.name,value:r.value,inputRef:r.ref,className:(0,v.AK)({"p-invalid":t.error}),onValueChange:function(e){return G(e,"conversion_rate")},min:1,maxFractionDigits:2})]})}})}),(0,T.jsx)("div",{className:"field col-12 md:col-2",children:(0,T.jsx)(d.Qr,{name:"unit_cost",control:b,render:function(e){var r=e.field,t=e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{htmlFor:r.name,className:(0,v.AK)({"p-error":S.value}),children:"Unit Cost"}),(0,T.jsx)(N.R,{inputId:r.name,value:r.value,inputRef:r.ref,className:(0,v.AK)({"p-invalid":t.error}),disabled:!0})]})}})}),(0,T.jsx)("div",{className:"field col-12 md:col-2",children:(0,T.jsx)(d.Qr,{name:"totalCostBDT",control:b,render:function(e){var r=e.field,t=e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{htmlFor:r.name,className:(0,v.AK)({"p-error":S.value}),children:"Total Cost"}),(0,T.jsx)(N.R,{inputId:r.name,value:r.value,inputRef:r.ref,className:(0,v.AK)({"p-invalid":t.error}),disabled:!0})]})}})}),(0,T.jsx)("div",{className:"field col-12 md:col-2",children:(0,T.jsx)(d.Qr,{name:"transport",control:b,render:function(e){var r=e.field,t=e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{htmlFor:r.name,className:(0,v.AK)({"p-error":S.value}),children:"Transport"}),(0,T.jsx)(N.R,{onFocus:function(e){return e.target.select()},inputId:r.name,value:r.value,inputRef:r.ref,className:(0,v.AK)({"p-invalid":t.error}),onValueChange:function(e){return G(e,"transport")},min:0,maxFractionDigits:2})]})}})}),(0,T.jsx)("div",{className:"field col-12 md:col-2",children:(0,T.jsx)(d.Qr,{name:"duty_vat",control:b,render:function(e){var r=e.field,t=e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{htmlFor:r.name,className:(0,v.AK)({"p-error":S.value}),children:"Duty"}),(0,T.jsx)(N.R,{onFocus:function(e){return e.target.select()},inputId:r.name,value:r.value,inputRef:r.ref,className:(0,v.AK)({"p-invalid":t.error}),onValueChange:function(e){return G(e,"duty_vat")},maxFractionDigits:2})]})}})}),(0,T.jsx)("div",{className:"field col-12 md:col-2",children:(0,T.jsx)(d.Qr,{name:"netUnitCostBDT",control:b,render:function(e){var r=e.field,t=e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{htmlFor:r.name,className:(0,v.AK)({"p-error":S.value}),children:"Net Unit Cost"}),(0,T.jsx)(N.R,{inputId:r.name,value:r.value,inputRef:r.ref,className:(0,v.AK)({"p-invalid":t.error}),disabled:!0})]})}})}),(0,T.jsx)("div",{className:"field col-12 md:col-2",children:(0,T.jsx)(d.Qr,{name:"netCostBDT",control:b,render:function(e){var r=e.field,t=e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{htmlFor:r.name,className:(0,v.AK)({"p-error":S.value}),children:"Net Cost"}),(0,T.jsx)(N.R,{inputId:r.name,value:r.value,inputRef:r.ref,className:(0,v.AK)({"p-invalid":t.error}),disabled:!0})]})}})}),(0,T.jsx)("div",{className:"field col-12 md:col-2",children:(0,T.jsx)(d.Qr,{name:"discount_profit",control:b,render:function(e){var r=e.field,t=e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{htmlFor:r.name,className:(0,v.AK)({"p-error":S.value}),children:"Profit (%)"}),(0,T.jsx)(N.R,{onFocus:function(e){return e.target.select()},inputId:r.name,value:r.value,inputRef:r.ref,className:(0,v.AK)({"p-invalid":t.error}),onValueChange:function(e){return function(e){var r=(0,n.Z)({},I);r.discount_profit=H(e),r.profit=r.netUnitCostBDT*H(e)/100,r.trade_price=H(r.netUnitCostBDT+r.profit),r.min_price=r.min_price,U(r),P("profit",r.profit),P("discount_profit",r.discount_profit),P("trade_price",r.trade_price),P("min_price",r.min_price)}(e.value)}})]})}})}),(0,T.jsx)("div",{className:"field col-12 md:col-2",children:(0,T.jsx)(d.Qr,{name:"profit",control:b,render:function(e){var r=e.field,t=e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{htmlFor:r.name,className:(0,v.AK)({"p-error":S.value}),children:"Unit Profit"}),(0,T.jsx)(N.R,{onFocus:function(e){return e.target.select()},inputId:r.name,value:r.value,inputRef:r.ref,className:(0,v.AK)({"p-invalid":t.error}),onValueChange:function(e){return function(e){var r=(0,n.Z)({},I);r.profit=H(e),r.discount_profit=H(r.profit/r.netUnitCostBDT*100),r.trade_price=H(r.netUnitCostBDT+r.profit),r.min_price=r.min_price,U(r),P("profit",r.profit),P("discount_profit",r.discount_profit),P("trade_price",r.trade_price),P("min_price",r.min_price)}(e.value)},maxFractionDigits:2})]})}})}),(0,T.jsx)("div",{className:"field col-12 md:col-2",children:(0,T.jsx)(d.Qr,{name:"trade_price",control:b,render:function(e){var r=e.field,t=e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{htmlFor:r.name,className:(0,v.AK)({"p-error":S.value}),children:"Unit Trade Price"}),(0,T.jsx)(N.R,{onFocus:function(e){return e.target.select()},inputId:r.name,value:r.value,inputRef:r.ref,className:(0,v.AK)({"p-invalid":t.error}),onValueChange:function(e){return function(e){var r=(0,n.Z)({},I);r.trade_price=H(e),r.profit=H(r.trade_price-r.netUnitCostBDT),r.discount_profit=H(r.profit/r.netUnitCostBDT*100),r.min_price=r.min_price,U(r),P("trade_price",r.trade_price),P("profit",r.profit),P("discount_profit",r.discount_profit),P("min_price",r.min_price)}(e.value)},maxFractionDigits:2})]})}})}),(0,T.jsx)("div",{className:"field col-12 md:col-2",children:(0,T.jsx)(d.Qr,{name:"min_price",control:b,render:function(e){var r=e.field,t=e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{htmlFor:"min_price",children:"Min Trade Price (U)"}),(0,T.jsx)(N.R,{onFocus:function(e){return e.target.select()},inputId:r.name,value:r.value,inputRef:r.ref,className:(0,v.AK)({"p-invalid":t.error}),onValueChange:function(e){return G(e,"min_price")},maxFractionDigits:2})]})}})}),(0,T.jsxs)("div",{className:"flex field col-12 md:col-4 align-items-center",children:[L&&(0,T.jsx)(f.z,{label:"Update",className:"p-button-primary mr-2",onClick:E((function(e){return r=e,console.log(r),t(r),W(!1),void D((0,n.Z)({},j));var r}))}),L&&(0,T.jsx)(f.z,{label:"Cancel",className:"p-button-warning",onClick:function(){return W(!1),void D((0,n.Z)({},j))}}),!L&&(0,T.jsx)(f.z,{type:"submit",label:"Add Product",className:"mt-2",onClick:E((function(e){return t=e,console.log(t),D((0,n.Z)({},j)),void r(t);var t}))})]})]})}var P=t(4457),E=function(e){var r=e.purchases,t=e.supplierCurrency,n=e.conversion_rate,a=e.onEdit,l=e.onDelete,s=e.onReturnItem,c=e.editMode,d=void 0===c||c,u=e.returnMode,m=void 0!==u&&u,h=(0,o.useState)(0),p=(0,i.Z)(h,2),v=p[0],x=p[1],N=(0,o.useState)(0),_=(0,i.Z)(N,2),C=_[0],y=_[1],b=(0,o.useState)(0),S=(0,i.Z)(b,2),F=S[0],R=S[1],D=(0,o.useState)(0),E=(0,i.Z)(D,2),A=E[0],w=E[1],Z=(0,o.useState)(0),I=(0,i.Z)(Z,2),U=I[0],K=I[1],B=(0,o.useState)(0),Q=(0,i.Z)(B,2),k=Q[0],L=Q[1],W=(0,o.useState)([]),V=(0,i.Z)(W,2),M=V[0],O=V[1];(0,o.useEffect)((function(){!function(e){if(e&&e.length>0)for(var r=0;r<e.length;r++){var t=(0,P.QV)(Number(e[r].unit_cost_f)),n=(0,P.QV)(Number(e[r].qty)),a=(0,P.QV)(Number(e[r].unit_cost)),l=(0,P.QV)(Number(e[r].transport)),s=(0,P.QV)(Number(e[r].duty_vat));e[r].totalCostF=(0,P.QV)(t*n),e[r].totalCostBDT=(0,P.QV)(a*n),e[r].netUnitCostBDT=(0,P.QV)(a+l/n+s/n),e[r].netCostBDT=(0,P.QV)(e[r].netUnitCostBDT*n);var i=Number(e[r].discount_profit),o=e[r].netUnitCostBDT*i/100;e[r].profit=(0,P.QV)(o)}O(e)}(r),function(e){console.log("CALCULATE-PURCHASES::",e);var t=0,n=0,a=0,l=0,s=0;if(e&&e.length>0)for(var i=0;i<e.length;i++)t+=Number(e[i].totalCostF),n+=Number(e[i].totalCostBDT),a+=Number(e[i].transport),l+=Number(e[i].duty_vat),s+=Number(e[i].netCostBDT);R(r.length),y(n),x(t),w(a),K(l),L(s),console.log("ALL-TOTAL::",F,t,n,a,l,s)}(r)}),[r]);var q=(0,T.jsx)("table",{className:"col-12",children:(0,T.jsxs)("tbody",{children:[(0,T.jsxs)("tr",{children:[(0,T.jsx)("td",{children:(0,T.jsxs)("b",{children:["Total Cost (",t,"):"]})}),(0,T.jsx)("td",{children:v}),(0,T.jsx)("td",{children:(0,T.jsxs)("b",{children:["Conversion Rate (",t," to BDT):"]})}),(0,T.jsx)("td",{children:n}),(0,T.jsx)("td",{children:(0,T.jsx)("b",{children:"Total Cost (BDT):"})}),(0,T.jsx)("td",{children:C})]}),(0,T.jsxs)("tr",{children:[(0,T.jsx)("td",{children:(0,T.jsx)("b",{children:"Total Transport Cost:"})}),(0,T.jsx)("td",{children:A}),(0,T.jsx)("td",{children:(0,T.jsx)("b",{children:"Total Duty:"})}),(0,T.jsx)("td",{children:U}),(0,T.jsx)("td",{children:(0,T.jsx)("b",{children:"Total Net Cost:"})}),(0,T.jsx)("td",{children:k})]})]})});return(0,T.jsxs)(g.w,{value:M,stripedRows:!0,showGridlines:!0,scrollable:!0,scrollHeight:"25rem",header:q,children:[(0,T.jsx)(j.s,{body:function(e){return(0,T.jsxs)(T.Fragment,{children:[d&&(0,T.jsx)(f.z,{icon:"pi pi-pencil",className:"p-button-rounded p-button-success mr-2",onClick:function(){return a(e)}}),d&&(0,T.jsx)(f.z,{icon:"pi pi-trash",className:"p-button-rounded p-button-warning",onClick:function(){return l(e)}}),m&&(0,T.jsx)(f.z,{icon:"pi pi-minus",className:"p-button-rounded p-button-warning",onClick:function(){return s(e)}})]})},frozen:!0,headerStyle:{minWidth:"6.4rem"}}),(0,T.jsx)(j.s,{field:"product_name",frozen:!0,header:"Product Name",headerStyle:{minWidth:"10rem"}}),(0,T.jsx)(j.s,{field:"qty",header:"Quantity",headerStyle:{minWidth:"10rem"}}),m&&(0,T.jsx)(j.s,{field:"return_qty",header:"Return Qty",headerStyle:{minWidth:"10rem"}}),(0,T.jsx)(j.s,{field:"unit_cost_f",header:"Unit Cost (".concat(t,")"),headerStyle:{minWidth:"10rem"}}),(0,T.jsx)(j.s,{field:"totalCostF",header:"Total Cost (".concat(t,")"),headerStyle:{minWidth:"10rem"}}),(0,T.jsx)(j.s,{field:"conversion_rate",header:"Conversion Rate",headerStyle:{minWidth:"10rem"}}),(0,T.jsx)(j.s,{field:"unit_cost",header:"UnitCost",headerStyle:{minWidth:"10rem"}}),(0,T.jsx)(j.s,{field:"totalCostBDT",header:"Total Cost",headerStyle:{minWidth:"10rem"}}),(0,T.jsx)(j.s,{field:"transport",header:"Transport",headerStyle:{minWidth:"10rem"}}),(0,T.jsx)(j.s,{field:"duty_vat",header:"Duty ",headerStyle:{minWidth:"10rem"}}),(0,T.jsx)(j.s,{field:"netUnitCostBDT",header:"Net Unit Cost",headerStyle:{minWidth:"10rem"}}),(0,T.jsx)(j.s,{field:"netCostBDT",header:"Net Cost",headerStyle:{minWidth:"10rem"}}),(0,T.jsx)(j.s,{field:"discount_profit",header:"Profit Percentage",headerStyle:{minWidth:"10rem"}}),(0,T.jsx)(j.s,{field:"profit",header:"Profit",headerStyle:{minWidth:"10rem"}}),(0,T.jsx)(j.s,{field:"min_price",header:"Minimum Trade Price",headerStyle:{minWidth:"10rem"}}),(0,T.jsx)(j.s,{field:"trade_price",header:"Trade Price (U)",headerStyle:{minWidth:"10rem"}})]})},A=t(3620),w=t(9351),Z=function(e){var r=e.purchase,t=(0,c.s0)(),F={product_id:"",warehouse_id:"",bar_code:"",last_purchase_price:0,quantity:1,unit_cost_f:0,totalCostF:0,conversion_rate:1,unit_cost:0,totalCostBDT:0,transport:0,duty_vat:0,netUnitCostBDT:0,netCostBDT:0,discount_profit:0,profit:0,trade_price:0,min_price:0},R=(0,o.useRef)(null),P=(0,o.useState)([]),Z=(0,i.Z)(P,2),I=Z[0],U=Z[1],K=(0,o.useState)([]),B=(0,i.Z)(K,2),Q=B[0],k=B[1],L=(0,o.useState)(F),W=(0,i.Z)(L,2),V=W[0],M=W[1],O=(0,o.useState)(!1),q=(0,i.Z)(O,2),z=q[0],H=q[1],X=(0,o.useState)(!1),G=(0,i.Z)(X,2),Y=G[0],$=G[1],J=(0,o.useState)(null),ee=(0,i.Z)(J,2),re=ee[0],te=ee[1],ne=(0,o.useState)("INR"),ae=(0,i.Z)(ne,2),le=ae[0],se=ae[1],ie=(0,o.useState)("XXXXX"),oe=(0,i.Z)(ie,2),ce=oe[0],de=oe[1],ue=(0,o.useState)(""),me=(0,i.Z)(ue,2),fe=me[0],he=me[1],pe=(0,o.useState)("draft"),ve=(0,i.Z)(pe,2),xe=ve[0],je=ve[1],ge=(0,o.useState)(!0),Ne=(0,i.Z)(ge,2),_e=Ne[0],Ce=Ne[1],ye=(0,o.useState)(1),be=(0,i.Z)(ye,2),Se=be[0],Fe=be[1],Re=(0,o.useState)(!1),Te=(0,i.Z)(Re,2),De=Te[0],Pe=Te[1],Ee=(0,o.useState)({}),Ae=(0,i.Z)(Ee,2),we=Ae[0],Ze=Ae[1],Ie=(0,o.useState)([]),Ue=(0,i.Z)(Ie,2),Ke=Ue[0],Be=Ue[1],Qe=(0,o.useState)([]),ke=(0,i.Z)(Qe,2),Le=ke[0],We=ke[1],Ve=(0,o.useState)(!1),Me=(0,i.Z)(Ve,2),Oe=Me[0],qe=Me[1],ze=(0,o.useState)(null),He=(0,i.Z)(ze,2),Xe=He[0],Ge=He[1],Ye=(0,o.useState)(0),$e=(0,i.Z)(Ye,2),Je=$e[0],er=$e[1],rr=new y.p,tr=new b.D,nr=new S.e,ar=(0,d.cI)({defaultValues:{id:null,party_type:"dtSupplier",party_id:null,currency:null,cnf:null,be_no:null,lc_no:null,notes:null}}),lr=ar.reset,sr=ar.control,ir=ar.formState.errors,or=(ar.setValue,ar.handleSubmit);(0,o.useEffect)((function(){if(tr.getDefaultItem("dtWarehouse").then((function(e){e&&(console.log("DEFAULT WAREHOUSE::",e),Ge(e._id))})),null===r||void 0===r)"XXXXX"===ce&&nr.getNextId(C.ev).then((function(e){de(e.nextID),console.log("NEXT ID::",e.nextID)}));else{console.log("FETCHED-PURCHASE::",r);var e=r.conversion_rate||1;lr({id:r.id,party_type:r.party_type,party_id:r.party_id,currency:r.currency,conversion_rate:e,cnf:r.cnf,be_no:r.be_no,lc_no:r.lc_no,notes:r.notes}),se(r.currency),U(r.items),We(r.return_items),Fe(e),de(r.voucher_no),Ce("draft"===r.status),Pe("approved"===r.status),console.log("EDIT MODE:::=>",r.status,"draft"===r.status)}console.log("EDIT MODE::",_e)}),[r]);var cr=function(e,r){if("save"===e)je("draft"),dr(r);else{if(0===I.length)return void R.current.show({severity:"error",summary:"Error",detail:"Please add at least one product to purchase",life:3e3});"approve"===e?(je("approved"),he("Are you sure you want to approve this purchase?")):"cancel"===e&&(je("cancelled"),he("Are you sure you want to cancel this purchase?")),$(!0),k(r)}},dr=function(e){e.status=xe,e.currency=le,e.voucher_no=ce,e.items=I;for(var n=0,a=0,l=0,s=0,i=0;i<I.length;i++)n+=I[i].totalCostBDT,a+=I[i].transport,l+=I[i].duty_vat,s+=I[i].netCostBDT;e.gross=n,e.transport=a,e.duty_vat=l,e.net=s,console.log("FORMDATA::",e);try{r?"approved"===xe?rr.commit(C.ev,r.id,e).then((function(e){R.current.show({severity:"success",summary:"Successful",detail:"Purchase Record Created",life:3e3}),t("/purchases")})):rr.update(C.ev,r.id,e).then((function(e){R.current.show({severity:"success",summary:"Successful",detail:"Purchase Record Created",life:3e3}),t("/purchases")})):rr.create(C.ev,e).then((function(e){R.current.show({severity:"success",summary:"Successful",detail:"Purchase Record Created",life:3e3}),t("/purchases")}))}catch(o){console.log(o),R.current.show({severity:"error",summary:"Error",detail:"Failed to create Purchase Record!",life:3e3})}},ur=function(e){return ir[e]&&(0,T.jsx)("small",{className:"p-error",children:ir[e].message})},mr=function(){var e=(0,s.Z)((0,a.Z)().mark((function e(r){var t,n;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.log("OOO-PURCHASES::",I),t=0;case 2:if(!(t<I.length)){e.next=10;break}if(console.log("PURCHASES::",I[t]),I[t].product_id!==r.product_id){e.next=7;break}return R.current.show({severity:"error",summary:"Error",detail:"Item already added!",life:3e3}),e.abrupt("return");case 7:t++,e.next=2;break;case 10:n=(0,l.Z)(I),r.index=I.length,n.push(r),console.log("NEWPURCHASE::",n),U(n),console.log("PURCHASES::",I);case 16:case"end":return e.stop()}}),e)})));return function(r){return e.apply(this,arguments)}}(),fr=function(){H(!1)},hr=function(){je("draft"),$(!1)},pr=(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(f.z,{label:"No",icon:"pi pi-times",className:"p-button-text",onClick:fr}),(0,T.jsx)(f.z,{label:"Yes",icon:"pi pi-check",className:"p-button-text",onClick:function(){console.log("COFIRM RETURN ITEMS::",Ke),rr.return(C.ev,r.id,Ke).then((function(e){R.current.show({severity:"success",summary:"Successful",detail:"Purchase Record Created",life:3e3}),t("/purchases")}))}})]}),vr=(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(f.z,{label:"No",icon:"pi pi-times",className:"p-button-text",onClick:hr}),(0,T.jsx)(f.z,{label:"Yes",icon:"pi pi-check",className:"p-button-text",onClick:function(){dr(Q)}})]}),xr=function(e){console.log("SELECTED SUPPLIER::",e,e._id),te(e._id),se(e.currency)};return(0,T.jsxs)("div",{className:"grid h-screen",children:[(0,T.jsx)(h.F,{ref:R}),(0,T.jsx)("div",{className:"col-3",children:(0,T.jsxs)("div",{class:"card",children:[!r&&(0,T.jsx)(f.z,{onClick:function(){t("/purchases")},className:"p-button-outlined",label:"Go to Purchase List"}),(0,T.jsxs)("h5",{children:["Purchase Detail :: VoucherNo (",ce,") ",r&&(0,T.jsx)(p.V,{severity:"warning",value:r.status})]}),(0,T.jsx)("div",{className:" col-12 md:col-12",children:(0,T.jsxs)("div",{className:"p-fluid formgrid grid",children:[(0,T.jsxs)("div",{className:"field col-12",children:[!_e&&(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{children:"Supplier Name"}),(0,T.jsx)(u.o,{readonly:"true",value:r.party_id,placeholder:"empty"})]}),_e&&(0,T.jsx)(d.Qr,{name:"party_id",control:sr,rules:{required:"Supplier is required."},render:function(e){var r=e.field,t=e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{htmlFor:r.name,className:(0,v.AK)({"p-error":ir.value}),children:"Supplier*"}),(0,T.jsx)(_.Z,{field:r,modelName:C.kj,displayField:"name",onSelect:xr,className:(0,v.AK)({"p-invalid":t.error}),columns:[{field:"name",header:"Supplier Name",filterPlaceholder:"Filter by Supplier Name"}]}),ur(r.name)]})}})]}),(0,T.jsxs)("div",{className:"field col-12",children:[(0,T.jsx)("label",{htmlFor:"fldSupplierCurrency",children:"Supplier Currency"}),(0,T.jsx)(u.o,{readonly:"true",value:le,placeholder:"Currency"})]}),(0,T.jsx)("div",{className:"field col-12",children:(0,T.jsx)(d.Qr,{name:"conversion_rate",control:sr,rules:{required:"Conversion Rate is required."},render:function(e){var r=e.field,t=e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{htmlFor:r.name,className:(0,v.AK)({"p-error":ir.value}),children:"Conversion Rate"}),(0,T.jsx)(N.R,{inputId:r.name,value:r.value,inputRef:r.ref,className:(0,v.AK)({"p-invalid":t.error}),onChange:function(e){Fe(e.value),r.onChange(e.value)},min:1,maxFractionDigits:2})]})}})}),(0,T.jsxs)("div",{className:"field col-12",children:[!_e&&(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{children:"CnF"}),(0,T.jsx)(u.o,{readonly:"true",value:r.cnf,placeholder:"empty"})]}),_e&&(0,T.jsx)(d.Qr,{name:"cnf",control:sr,render:function(e){var r=e.field,t=e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{htmlFor:r.name,className:(0,v.AK)({"p-error":ir.value}),children:"CnF"}),(0,T.jsx)(u.o,{inputId:r.name,value:r.value,inputRef:r.ref,className:(0,v.AK)({"p-invalid":t.error}),onChange:function(e){return r.onChange(e.target.value)}}),ur(r.name)]})}})]}),(0,T.jsxs)("div",{className:"field col-12",children:[!_e&&(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{children:"B/E No."}),(0,T.jsx)(u.o,{readonly:"true",value:r.be_no,placeholder:"empty"})]}),_e&&(0,T.jsx)(d.Qr,{name:"be_no",control:sr,render:function(e){var r=e.field,t=e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{htmlFor:r.name,className:(0,v.AK)({"p-error":ir.value}),children:"B/E No."}),(0,T.jsx)(u.o,{inputId:r.name,value:r.value,inputRef:r.ref,className:(0,v.AK)({"p-invalid":t.error}),onChange:function(e){return r.onChange(e.target.value)}}),ur(r.name)]})}})]}),(0,T.jsxs)("div",{className:"field col-12",children:[!_e&&(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{children:"LC No."}),(0,T.jsx)(u.o,{readonly:"true",value:r.lc_no,placeholder:"empty"})]}),_e&&(0,T.jsx)(d.Qr,{name:"lc_no",control:sr,render:function(e){var r=e.field,t=e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{htmlFor:r.name,className:(0,v.AK)({"p-error":ir.value}),children:"LC No."}),(0,T.jsx)(u.o,{inputId:r.name,value:r.value,inputRef:r.ref,className:(0,v.AK)({"p-invalid":t.error}),onChange:function(e){return r.onChange(e.target.value)}}),ur(r.name)]})}})]}),(0,T.jsxs)("div",{className:"field col-12",children:[!_e&&(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{children:"Notes"}),(0,T.jsx)(u.o,{readonly:"true",value:r.notes,placeholder:"empty"})]}),_e&&(0,T.jsx)(d.Qr,{name:"notes",control:sr,render:function(e){var r=e.field,t=e.fieldState;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("label",{htmlFor:r.name,className:(0,v.AK)({"p-error":ir.value}),children:"Notes"}),(0,T.jsx)(m.g,{inputId:r.name,value:r.value,inputRef:r.ref,className:(0,v.AK)({"p-invalid":t.error}),onChange:function(e){return r.onChange(e.target.value)},rows:3,cols:20}),ur(r.name)]})}})]})]})}),_e&&(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(f.z,{type:"submit",label:"Save as Draft",className:"mt-2 m-1",onClick:or((function(e){return cr("save",e)}))}),(0,T.jsx)(f.z,{type:"submit",label:"Confirm Purchase",className:"mt-2 m-1 p-button-warning",onClick:or((function(e){return cr("approve",e)}))}),(0,T.jsx)(f.z,{type:"submit",label:"Cancel Purchase",className:"mt-2 m-1 p-button-outlined p-button-warning",onClick:or((function(e){return cr("cancel",e)}))})]}),De&&(0,T.jsx)(f.z,{type:"submit",label:"Return Purchases",className:"mt-2 m-1 p-button-outlined p-button-warning",onClick:or((function(e){0!==Ke.length?H(!0):R.current.show({severity:"error",summary:"Error",detail:"Please select at least one item to return",life:3e3})}))})]})}),(0,T.jsxs)("div",{className:"card col-9",children:[_e&&(0,T.jsx)("div",{className:"col-12",children:(0,T.jsx)(D,{defaultWarehouse:Xe,onAdd:function(e){return mr(e)},onEdit:function(e){return function(e){var r=(0,l.Z)(I);r[V.index]=e,console.log("EDIT::",e),U(r)}(e)},currency:le,conversionRate:Se,supplierId:re,defaultPurchaseProduct:F,selectedProduct:V})}),(0,T.jsx)("div",{className:"col-12",children:I&&(0,T.jsx)(E,{editMode:_e,returnMode:De,onReturnItem:function(e){return r=e,console.log("SELECTED RETURN ITEM::",r),Ze(r),void qe((function(e){return e+1}));var r},purchases:I,supplierCurrency:le,conversion_rate:Se,onEdit:function(e){return r=e,console.log("EDIT::",r),M((0,n.Z)({},r)),void console.log("SET SELECTED PRODUCT::",V);var r},onDelete:function(){"removeItem"==="removeItem"&&er((function(e){return e+1}))}})}),Ke&&Ke.length>0&&(0,T.jsxs)("div",{className:"col-12",children:[(0,T.jsx)("h5",{children:"New Returns:"}),(0,T.jsxs)(g.w,{value:Ke,stripedRows:!0,showGridlines:!0,scrollable:!0,scrollHeight:"25rem",children:[(0,T.jsx)(j.s,{body:function(e){return(0,T.jsx)(T.Fragment,{children:(0,T.jsx)(f.z,{icon:"pi pi-trash",className:"p-button-rounded p-button-warning",onClick:function(){return function(e){console.log("DELETE RETURN ITEM::",e);var r=(0,l.Z)(Ke);r.splice(e.index,1),Be(r)}(e)}})})},frozen:!0,headerStyle:{minWidth:"6.4rem"}}),(0,T.jsx)(j.s,{field:"product_name",header:"Product Name",sortable:!0}),(0,T.jsx)(j.s,{field:"return_qty",header:"Returned Qty",sortable:!0}),(0,T.jsx)(j.s,{field:"reason",header:"Reason",sortable:!0})]})]}),Le&&Le.length>0&&(0,T.jsxs)("div",{className:"col-12",children:[(0,T.jsx)("h5",{children:"Returned Items:"}),(0,T.jsxs)(g.w,{value:Le,stripedRows:!0,showGridlines:!0,scrollable:!0,scrollHeight:"25rem",children:[(0,T.jsx)(j.s,{field:"product_name",header:"Product Name",sortable:!0}),(0,T.jsx)(j.s,{field:"return_qty",header:"Returned Qty",sortable:!0}),(0,T.jsx)(j.s,{field:"reason",header:"Reason",sortable:!0}),(0,T.jsx)(j.s,{field:"created_at",header:"Returned Date",sortable:!0})]})]}),(0,T.jsx)(w.Z,{message:"Are you sure you want to delete?",trigger:Je,onConfirm:function(){var e=(0,l.Z)(I);e.splice(V.index,1),U(e)}}),(0,T.jsx)(x.V,{visible:z,style:{width:"450px"},header:"Confirm",modal:!0,footer:pr,onHide:fr,children:(0,T.jsxs)("div",{className:"flex align-items-center justify-content-center",children:[(0,T.jsx)("i",{className:"pi pi-exclamation-triangle mr-3",style:{fontSize:"2rem"}}),(0,T.jsx)("span",{children:"Are you sure you want to return these products?"})]})}),(0,T.jsx)(x.V,{visible:Y,style:{width:"450px"},header:"Confirm",modal:!0,footer:vr,onHide:hr,children:(0,T.jsxs)("div",{className:"flex align-items-center justify-content-center",children:[(0,T.jsx)("i",{className:"pi pi-exclamation-triangle mr-3",style:{fontSize:"2rem"}}),(0,T.jsxs)("span",{children:["$",fe]})]})}),(0,T.jsx)(A.Z,{trigger:Oe,selectedReturnItem:we,onAddReturnItem:function(e){return function(e){console.log("SELECTED RETURN ITEM::",e),e.index=Ke.length,e.created_at=new Date;for(var r=0;r<Ke.length;r++)if(Ke[r].product_id===e.product_id)return void R.current.show({severity:"error",summary:"Error",detail:"Item already added!",life:3e3});Be([].concat((0,l.Z)(Ke),[e]))}(e)}})]})]})}}}]);
//# sourceMappingURL=purchaseProfile.243126ea.chunk.js.map