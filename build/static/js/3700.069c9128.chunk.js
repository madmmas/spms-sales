"use strict";(self.webpackChunkspms_app=self.webpackChunkspms_app||[]).push([[3700],{1811:function(e,t,n){n.d(t,{A5:function(){return O},CN:function(){return N},CZ:function(){return i},D:function(){return I},Eh:function(){return T},GB:function(){return F},H0:function(){return H},Hh:function(){return h},Hn:function(){return w},Id:function(){return y},Ik:function(){return C},LM:function(){return a},MU:function(){return r},Ni:function(){return p},Q4:function(){return R},R$:function(){return f},UR:function(){return v},VB:function(){return m},VC:function(){return s},W9:function(){return D},aA:function(){return z},aF:function(){return g},eQ:function(){return S},ev:function(){return x},fs:function(){return Z},if:function(){return P},it:function(){return u},kj:function(){return l},q$:function(){return o},qI:function(){return k},rV:function(){return j},s5:function(){return b},sf:function(){return c},sk:function(){return B},uG:function(){return A},vN:function(){return E},vY:function(){return d}});var r="dtBank",o="dtBankAccount",a="dtCash",i="dtCustomer",s="dtEmployee",u="dtEmploymentHistory",c="dtProduct",l="dtSupplier",d="dtWarehouse",p="dtStock",f="trxDamagedStock",m="trxStockAdjustment",h="trxExpense",g="trxExtraIncome",x="trxPurchase",y="trxSales",v="trxStockIn",b="trxStockOut",j="trxACReceivable",N="trxACPayable",k="trxBankRegister",C="trxCashRegister",w="trxPayment",Z="dtCustomerCategory",P="dtDepartment",S="dtDesignation",R="dtExpenseType",E="dtExtraIncomeType",F="dtGrade",I="dtGroup",O="dtProductBrand",z="dtProductModel",D="dtOfficeTime",B="dtPaymentType",A="dtProductCategory",H="dtRoute",T="dtSupplierCategory"},3700:function(e,t,n){n.r(t);var r=n(1413),o=n(9439),a=n(7890),i=n(919),s=n(1063),u=n(2971),c=n(9856),l=n(5103),d=n(8218),p=n(7580),f=n(8291),m=n(5854),h=n(2791),g=n(1412),x=n(1811),y=n(184);t.default=function(){var e=x.fs,t=(0,h.useRef)(null),n=(0,h.useRef)(null),v={_id:null,description:"",name:""},b={fields:["name","description"],first:0,rows:10,page:1,sortField:null,sortOrder:null,filters:{name:{operator:a.pg.OR,constraints:[{value:null,matchMode:a.a6.STARTS_WITH}]}}},j=(0,h.useState)(!1),N=(0,o.Z)(j,2),k=N[0],C=N[1],w=(0,h.useState)(0),Z=(0,o.Z)(w,2),P=Z[0],S=Z[1],R=(0,h.useState)(null),E=(0,o.Z)(R,2),F=E[0],I=E[1],O=(0,h.useState)(!1),z=(0,o.Z)(O,2),D=z[0],B=z[1],A=(0,h.useState)(!1),H=(0,o.Z)(A,2),T=H[0],K=H[1],V=(0,h.useState)(!1),_=(0,o.Z)(V,2),U=_[0],G=_[1],M=(0,h.useState)(v),L=(0,o.Z)(M,2),W=L[0],Y=L[1],q=(0,h.useState)(null),J=(0,o.Z)(q,2),X=J[0],Q=J[1],$=(0,h.useState)(!1),ee=(0,o.Z)($,2),te=ee[0],ne=ee[1],re=(0,h.useState)(!0),oe=(0,o.Z)(re,2),ae=oe[0],ie=oe[1],se=(0,h.useState)(b),ue=(0,o.Z)(se,2),ce=ue[0],le=ue[1],de=new g.e;(0,h.useEffect)((function(){fe()}),[]);var pe=function(){fe()},fe=function(){le(b)};(0,h.useEffect)((function(){me()}),[ce]);var me=function(){C(!0),de.getAll(e,{params:JSON.stringify(ce)}).then((function(e){console.log(e),S(e.total),I(e.rows),C(!1)}))},he=function(){ie(!0),Y(v),ne(!1),B(!0)},ge=function(){ne(!1),B(!1)},xe=function(){K(!1)},ye=function(){G(!1)},ve=function(){n.current.exportCSV()},be=function(e,t){var n=e.target&&e.target.value||"",o=(0,r.Z)({},W);o["".concat(t)]=n,Y(o)},je=(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(i.z,{label:"Cancel",icon:"pi pi-times",className:"p-button-text",onClick:ge}),(0,y.jsx)(i.z,{label:"Save",icon:"pi pi-check",className:"p-button-text",onClick:function(){ne(!0),W.name.trim()&&(W._id?de.update(e,W._id,W).then((function(e){console.log(e),me(),t.current.show({severity:"success",summary:"Successful",detail:"Customer Category Updated",life:3e3})})):de.create(e,W).then((function(e){console.log(e),me(),t.current.show({severity:"success",summary:"Successful",detail:"Customer Category Created",life:3e3})})),B(!1),Y(v))}})]}),Ne=(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(i.z,{label:"No",icon:"pi pi-times",className:"p-button-text",onClick:xe}),(0,y.jsx)(i.z,{label:"Yes",icon:"pi pi-check",className:"p-button-text",onClick:function(){de.delete(e,W._id).then((function(e){console.log(e),me(),t.current.show({severity:"success",summary:"Successful",detail:"Customer Category Deleted",life:3e3})})),K(!1),Y(v)}})]}),ke=(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(i.z,{label:"No",icon:"pi pi-times",className:"p-button-text",onClick:ye}),(0,y.jsx)(i.z,{label:"Yes",icon:"pi pi-check",className:"p-button-text",onClick:function(){var e=F.filter((function(e){return!X.includes(e)}));I(e),G(!1),Q(null),t.current.show({severity:"success",summary:"Successful",detail:"Customer Categories Deleted",life:3e3})}})]});return(0,y.jsx)("div",{className:"grid crud-demo",children:(0,y.jsx)("div",{className:"col-12",children:(0,y.jsxs)("div",{className:"card",children:[(0,y.jsx)(p.F,{ref:t}),(0,y.jsx)(f.o,{className:"mb-4",left:function(){return(0,y.jsx)(h.Fragment,{children:(0,y.jsx)("div",{className:"flex justify-content-between",children:(0,y.jsx)(i.z,{label:"New",icon:"pi pi-plus",className:"p-button-success mr-2",onClick:he})})})},right:function(){return(0,y.jsx)(h.Fragment,{children:(0,y.jsx)(i.z,{label:"Export",icon:"pi pi-upload",className:"p-button-help",onClick:ve})})}}),(0,y.jsxs)(u.w,{ref:n,value:F,dataKey:"_id",className:"datatable-responsive",responsiveLayout:"scroll",lazy:!0,loading:k,rows:ce.rows,onSort:function(e){var t=(0,r.Z)((0,r.Z)({},ce),e);le(t)},sortField:ce.sortField,sortOrder:ce.sortOrder,onFilter:function(e){var t=(0,r.Z)((0,r.Z)({},ce),e);t.first=0,le(t)},filters:ce.filters,filterDisplay:"menu",paginator:!0,totalRecords:P,onPage:function(e){var t=(0,r.Z)((0,r.Z)({},ce),e);le(t)},first:ce.first,paginatorTemplate:"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",rowsPerPageOptions:[5,10,25,50],currentPageReportTemplate:"Showing {first} to {last} of {totalRecords} entries",emptyMessage:"No data found.",header:function(){return(0,y.jsxs)("div",{className:"flex justify-content-between",children:[(0,y.jsx)("h5",{className:"m-0",children:"Manage Customer Category"}),(0,y.jsx)(i.z,{type:"button",icon:"pi pi-filter-slash",label:"Clear",className:"p-button-outlined",onClick:pe})]})},children:[(0,y.jsx)(s.s,{body:function(e){return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(i.z,{icon:"pi pi-pencil",className:"p-button-rounded p-button-success mr-2",onClick:function(){return function(e){ie(!1),Y((0,r.Z)({},e)),B(!0)}(e)}}),(0,y.jsx)(i.z,{icon:"pi pi-trash",className:"p-button-rounded p-button-warning",onClick:function(){return function(e){Y(e),K(!0)}(e)}})]})},headerStyle:{minWidth:"10rem"}}),(0,y.jsx)(s.s,{field:"name",header:"Name",filter:!0,filterPlaceholder:"Search by name",sortable:!0,body:function(e){return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)("span",{className:"p-column-title",children:"Name"}),e.name]})},headerStyle:{minWidth:"15rem"}}),(0,y.jsx)(s.s,{field:"description",header:"Description",body:function(e){return(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)("span",{className:"p-column-title",children:"Description"}),e.description]})},headerStyle:{minWidth:"15rem"}})]}),(0,y.jsxs)(c.V,{visible:D,style:{width:"450px"},header:"".concat(ae?"Create":"Edit"," Customer Category"),modal:!0,className:"p-fluid",footer:je,onHide:ge,children:[W.image&&(0,y.jsx)("img",{src:"".concat("~","/demo/images/CustomerCategory/").concat(W.image),alt:W.image,width:"150",className:"mt-0 mx-auto mb-5 block shadow-2"}),(0,y.jsxs)("div",{className:"field",children:[(0,y.jsx)("label",{htmlFor:"name",children:"Name"}),(0,y.jsx)(l.o,{id:"name",value:W.name,onChange:function(e){return be(e,"name")},required:!0,autoFocus:!0,className:(0,m.AK)({"p-invalid":te&&!W.name})}),te&&!W.name&&(0,y.jsx)("small",{className:"p-invalid",children:"Name is required."})]}),(0,y.jsxs)("div",{className:"field",children:[(0,y.jsx)("label",{htmlFor:"description",children:"Description"}),(0,y.jsx)(d.g,{id:"description",value:W.description,onChange:function(e){return be(e,"description")},required:!0,rows:3,cols:20})]})]}),(0,y.jsx)(c.V,{visible:T,style:{width:"450px"},header:"Confirm",modal:!0,footer:Ne,onHide:xe,children:(0,y.jsxs)("div",{className:"flex align-items-center justify-content-center",children:[(0,y.jsx)("i",{className:"pi pi-exclamation-triangle mr-3",style:{fontSize:"2rem"}}),W&&(0,y.jsxs)("span",{children:["Are you sure you want to delete ",(0,y.jsx)("b",{children:W.empID}),"?"]})]})}),(0,y.jsx)(c.V,{visible:U,style:{width:"450px"},header:"Confirm",modal:!0,footer:ke,onHide:ye,children:(0,y.jsxs)("div",{className:"flex align-items-center justify-content-center",children:[(0,y.jsx)("i",{className:"pi pi-exclamation-triangle mr-3",style:{fontSize:"2rem"}}),W&&(0,y.jsx)("span",{children:"Are you sure you want to delete the selected items?"})]})})]})})})}},1412:function(e,t,n){n.d(t,{e:function(){return u}});var r=n(4165),o=n(5861),a=n(5671),i=n(3144),s=n(8293),u=function(){function e(){(0,a.Z)(this,e)}return(0,i.Z)(e,[{key:"getNextId",value:function(){var e=(0,o.Z)((0,r.Z)().mark((function e(t){var n;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.ZP.get("/nextid/".concat(t),{cache:!1});case 2:return n=e.sent,e.abrupt("return",n.data);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"getById",value:function(){var e=(0,o.Z)((0,r.Z)().mark((function e(t,n){var o,a;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return o="/data/".concat(t,"/")+n,e.next=3,s.ZP.get(o,{timeout:15e3,id:o,cache:{ttl:2e4}});case 3:return a=e.sent,console.log(a.data),e.abrupt("return",a.data);case 6:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()},{key:"getAll",value:function(){var e=(0,o.Z)((0,r.Z)().mark((function e(t,n){var o,a;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return o=n?Object.keys(n).map((function(e){return encodeURIComponent(e)+"="+encodeURIComponent(n[e])})).join("&"):"",a="/data/".concat(t,"?")+o,e.abrupt("return",s.ZP.get(a,{timeout:15e3,id:a,cache:{ttl:2e4}}).then((function(e){return e.data})));case 3:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()},{key:"getAllWithoutParams",value:function(){var e=(0,o.Z)((0,r.Z)().mark((function e(t){var n,o,a;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n={params:JSON.stringify({rows:1e3})},o=n?Object.keys(n).map((function(e){return encodeURIComponent(e)+"="+encodeURIComponent(n[e])})).join("&"):"",a="/data/".concat(t,"?")+o,e.abrupt("return",s.ZP.get(a,{timeout:15e3,id:a,cache:{ttl:2e4}}).then((function(e){return e.data.rows})));case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"create",value:function(){var e=(0,o.Z)((0,r.Z)().mark((function e(t,n){var o;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.ZP.post("/data/".concat(t),n);case 2:return o=e.sent,console.log(o.data),e.abrupt("return",o.data);case 5:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()},{key:"update",value:function(){var e=(0,o.Z)((0,r.Z)().mark((function e(t,n,o){var a;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.ZP.put("/data/".concat(t,"/")+n,o);case 2:return a=e.sent,console.log(a.data),e.abrupt("return",a.data);case 5:case"end":return e.stop()}}),e)})));return function(t,n,r){return e.apply(this,arguments)}}()},{key:"delete",value:function(){var e=(0,o.Z)((0,r.Z)().mark((function e(t,n){var o;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.ZP.delete("/data/".concat(t,"/")+n);case 2:return o=e.sent,console.log(o.data),e.abrupt("return",o.data);case 5:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()}]),e}()},8218:function(e,t,n){n.d(t,{g:function(){return d}});var r=n(2791),o=n(8820),a=n(3574),i=n(5854),s=n(5388),u=n(7890);function c(){return c=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c.apply(this,arguments)}var l=s.V.extend({defaultProps:{__TYPE:"InputTextarea",autoResize:!1,keyfilter:null,onBlur:null,onFocus:null,onBeforeInput:null,onInput:null,onKeyDown:null,onKeyUp:null,onPaste:null,tooltip:null,tooltipOptions:null,validateOnly:!1,children:void 0}}),d=r.memo(r.forwardRef((function(e,t){var n=r.useContext(u.Ou),s=l.getProps(e,n),d=r.useRef(t),p=r.useRef(0),f=l.setMetaData({props:s}).ptm,m=function(e){var t=d.current;t&&i.p7.isVisible(t)&&(p.current||(p.current=t.scrollHeight,t.style.overflow="hidden"),(p.current!==t.scrollHeight||e)&&(t.style.height="",t.style.height=t.scrollHeight+"px",parseFloat(t.style.height)>=parseFloat(t.style.maxHeight)?(t.style.overflowY="scroll",t.style.height=t.style.maxHeight):t.style.overflow="hidden",p.current=t.scrollHeight))};r.useEffect((function(){i.gb.combinedRefs(d,t)}),[d,t]),r.useEffect((function(){s.autoResize&&m(!0)}),[s.autoResize]);var h=r.useMemo((function(){return i.gb.isNotEmpty(s.value)||i.gb.isNotEmpty(s.defaultValue)}),[s.value,s.defaultValue]),g=i.gb.isNotEmpty(s.tooltip),x=(0,i.AK)("p-inputtextarea p-inputtext p-component",{"p-disabled":s.disabled,"p-filled":h,"p-inputtextarea-resizable":s.autoResize},s.className),y=(0,i.dG)({ref:d,className:x,onFocus:function(e){s.autoResize&&m(),s.onFocus&&s.onFocus(e)},onBlur:function(e){s.autoResize&&m(),s.onBlur&&s.onBlur(e)},onKeyUp:function(e){s.autoResize&&m(),s.onKeyUp&&s.onKeyUp(e)},onKeyDown:function(e){s.onKeyDown&&s.onKeyDown(e),s.keyfilter&&o.F.onKeyPress(e,s.keyfilter,s.validateOnly)},onBeforeInput:function(e){s.onBeforeInput&&s.onBeforeInput(e),s.keyfilter&&o.F.onBeforeInput(e,s.keyfilter,s.validateOnly)},onInput:function(e){var t=e.target;s.autoResize&&m(i.gb.isEmpty(t.value)),s.onInput&&s.onInput(e),i.gb.isNotEmpty(t.value)?i.p7.addClass(t,"p-filled"):i.p7.removeClass(t,"p-filled")},onPaste:function(e){s.onPaste&&s.onPaste(e),s.keyfilter&&o.F.onPaste(e,s.keyfilter,s.validateOnly)}},l.getOtherProps(s),f("root"));return r.createElement(r.Fragment,null,r.createElement("textarea",y),g&&r.createElement(a.u,c({target:d,content:s.tooltip},s.tooltipOptions,{pt:f("tooltip")})))})));d.displayName="InputTextarea"},8291:function(e,t,n){n.d(t,{o:function(){return u}});var r=n(2791),o=n(5854),a=n(5388),i=n(7890),s=a.V.extend({defaultProps:{__TYPE:"Toolbar",id:null,style:null,className:null,left:null,right:null,start:null,center:null,end:null,children:void 0}}),u=r.memo(r.forwardRef((function(e,t){var n=r.useContext(i.Ou),a=s.getProps(e,n),u=r.useRef(null),c=o.gb.getJSXElement(a.left||a.start,a),l=o.gb.getJSXElement(a.center,a),d=o.gb.getJSXElement(a.right||a.end,a),p=s.setMetaData({props:a}).ptm;r.useImperativeHandle(t,(function(){return{props:a,getElement:function(){return u.current}}}));var f=(0,o.dG)({className:"p-toolbar-group-start p-toolbar-group-left"},p("start")),m=(0,o.dG)({className:"p-toolbar-group-center"},p("center")),h=(0,o.dG)({className:"p-toolbar-group-end p-toolbar-group-right"},p("end")),g=(0,o.dG)({id:a.id,ref:u,style:a.style,className:(0,o.AK)("p-toolbar p-component",a.className),role:"toolbar"},s.getOtherProps(a),p("root"));return r.createElement("div",g,r.createElement("div",f,c),r.createElement("div",m,l),r.createElement("div",h,d))})));u.displayName="Toolbar"}}]);
//# sourceMappingURL=3700.069c9128.chunk.js.map