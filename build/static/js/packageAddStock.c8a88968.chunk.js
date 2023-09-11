"use strict";(self.webpackChunkspms_app=self.webpackChunkspms_app||[]).push([[2070],{7418:function(e,r,t){t.r(r);var n=t(4165),a=t(5861),i=t(9439),l=t(2791),o=t(7689),c=t(7580),s=t(7387),u=t(919),d=t(2777),m=t(3985),f=t(184);r.default=function(e){var r=e.packageData,t=(0,o.s0)(),p=(0,l.useRef)(null),h=(0,l.useState)(null),v=(0,i.Z)(h,2),y=v[0],b=v[1],g=(0,l.useState)(0),j=(0,i.Z)(g,2),x=j[0],N=j[1],w=new m.M,S=function(){var e=(0,a.Z)((0,n.Z)().mark((function e(r){var t;return(0,n.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,Promise.all(r.map(function(){var e=(0,a.Z)((0,n.Z)().mark((function e(r){var t;return(0,n.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,w.getById(r.dtProduct_id);case 2:return t=e.sent,r.current_stock=t.current_stock,e.abrupt("return",r);case 5:case"end":return e.stop()}}),e)})));return function(r){return e.apply(this,arguments)}}()));case 3:t=e.sent,console.log("PRODUCTS:::",t),b(t),e.next=11;break;case 8:return e.prev=8,e.t0=e.catch(0),e.abrupt("return",r);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(r){return e.apply(this,arguments)}}();(0,l.useEffect)((function(){console.log("PACKAGE-DATA:::",r),r&&S(r.items)}),[r]);return(0,f.jsxs)("div",{className:"grid h-screen",children:[(0,f.jsx)(c.F,{ref:p}),(0,f.jsxs)("div",{className:"card col-12",children:[(0,f.jsx)("div",{className:"card col-12 md:col-12",children:(0,f.jsxs)("div",{className:"p-fluid formgrid grid",children:[(0,f.jsxs)("div",{className:"field col-12 md:col-4",children:[(0,f.jsx)("div",{className:"field",children:"Name:"}),(0,f.jsx)(s.A,{label:r.name})]}),(0,f.jsxs)("div",{className:"field col-12 md:col-4",children:[(0,f.jsx)("div",{className:"field",children:"Code:"}),(0,f.jsx)(s.A,{label:r.code})]}),(0,f.jsxs)("div",{className:"field col-12 md:col-4",children:[(0,f.jsx)("div",{className:"field",children:"Trade Price:"}),(0,f.jsx)(s.A,{label:r.price})]}),(0,f.jsxs)("div",{className:"field col-12 md:col-4",children:[(0,f.jsx)("div",{className:"field",children:"Warehouse:"}),(0,f.jsx)(s.A,{label:r.warehouse_id})]}),(0,f.jsxs)("div",{className:"field col-12 md:col-4",children:[(0,f.jsx)("div",{className:"field",children:"remarks:"}),(0,f.jsx)(s.A,{label:r.remarks})]}),(0,f.jsxs)("div",{className:"field col-12 md:col-4",children:[(0,f.jsx)("div",{className:"field",children:"Status:"}),(0,f.jsx)(s.A,{label:r.active?"Active":"Deactive"})]})]})}),(0,f.jsx)("div",{className:"p-fluid formgrid grid",children:(0,f.jsxs)("div",{className:"field col-12 md:col-4",children:[(0,f.jsx)("div",{className:"field",children:"Package Quantity:"}),(0,f.jsx)("input",{type:"number",className:"w-full",value:x,onChange:function(e){return N(e.target.value)}})]})}),(0,f.jsx)("div",{className:"p-fluid formgrid grid",children:(0,f.jsx)("div",{className:"field col-12 md:col-2",children:(0,f.jsx)(u.z,{type:"submit",label:"Save",className:"p-button p-button-success",onClick:function(){return function(){var e=Number(x),n={quantity:e,items:[]};y.map((function(r){n.items.push({product_id:r.dtProduct_id,quantity:r.quantity*e})}));var a=r.id;if(e>0){console.log("DATA:::",y);for(var i=0;i<y.length;i++)if(console.log("ITEM::",y[i].quantity*e>y[i].current_stock),y[i].quantity*e>y[i].current_stock)return void p.current.show({severity:"error",summary:"Error",detail:"Product quantity must be greater than 0",life:3e3});w.addPackageToStock(a,n).then((function(e){p.current.show({severity:"success",summary:"Success",detail:"Stock Added",life:3e3}),t("/packages")})).catch((function(e){p.current.show({severity:"error",summary:"Error",detail:"Something went wrong",life:3e3})}))}else p.current.show({severity:"error",summary:"Error",detail:"Package quantity must be greater than 0",life:3e3})}()}})})}),null!==y&&(0,f.jsx)(d.Z,{products:y,packageQuantity:x,showCurrentStock:!0})]})]})}},2777:function(e,r,t){t(2791);var n=t(1063),a=t(2971),i=t(184);r.Z=function(e){var r=e.products,t=e.packageQuantity,l=e.showCurrentStock,o=void 0!==l&&l;return(0,i.jsxs)(a.w,{value:r,rowClassName:function(e){return{"bg-red-100 text-red-900":e.quantity*Number(t)>e.current_stock}},stripedRows:!0,showGridlines:!0,scrollable:!0,scrollHeight:"25rem",children:[(0,i.jsx)(n.s,{field:"product_name",frozen:!0,header:"Product Name",headerStyle:{minWidth:"10rem"}}),(0,i.jsx)(n.s,{field:"brand_name",header:"Brand Name",headerStyle:{minWidth:"10rem"}}),(0,i.jsx)(n.s,{field:"model_no",header:"Model No",headerStyle:{minWidth:"10rem"}}),(0,i.jsx)(n.s,{field:"part_number",header:"Part Number",headerStyle:{minWidth:"10rem"}}),(0,i.jsx)(n.s,{field:"quantity",header:"Quantity",headerStyle:{minWidth:"10rem"}}),o&&(0,i.jsx)(n.s,{field:"current_stock",header:"Current Stock",headerStyle:{minWidth:"10rem"}})]})}},7387:function(e,r,t){t.d(r,{A:function(){return y}});var n=t(2791),a=t(5854),i=t(5388),l=t(8158),o=t(7890);function c(e){return c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},c(e)}function s(e){var r=function(e,r){if("object"!==c(e)||null===e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var n=t.call(e,r||"default");if("object"!==c(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(e)}(e,"string");return"symbol"===c(r)?r:String(r)}function u(e,r,t){return(r=s(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function d(){return d=Object.assign?Object.assign.bind():function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e},d.apply(this,arguments)}function m(e,r){(null==r||r>e.length)&&(r=e.length);for(var t=0,n=new Array(r);t<r;t++)n[t]=e[t];return n}function f(e,r){return function(e){if(Array.isArray(e))return e}(e)||function(e,r){var t=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var n,a,i,l,o=[],c=!0,s=!1;try{if(i=(t=t.call(e)).next,0===r){if(Object(t)!==t)return;c=!1}else for(;!(c=(n=i.call(t)).done)&&(o.push(n.value),o.length!==r);c=!0);}catch(u){s=!0,a=u}finally{try{if(!c&&null!=t.return&&(l=t.return(),Object(l)!==l))return}finally{if(s)throw a}}return o}}(e,r)||function(e,r){if(e){if("string"===typeof e)return m(e,r);var t=Object.prototype.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?m(e,r):void 0}}(e,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var p=i.V.extend({defaultProps:{__TYPE:"Chip",label:null,icon:null,image:null,removable:!1,removeIcon:null,className:null,style:null,template:null,imageAlt:"chip",onImageError:null,onRemove:null,children:void 0}});function h(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function v(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?h(Object(t),!0).forEach((function(r){u(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):h(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}var y=n.memo(n.forwardRef((function(e,r){var t=n.useContext(o.Ou),i=p.getProps(e,t),c=n.useRef(null),s=f(n.useState(!0),2),u=s[0],m=s[1],h=p.setMetaData({props:i}).ptm,y=function(e){13===e.keyCode&&b(e)},b=function(e){m(!1),i.onRemove&&i.onRemove(e)};return n.useImperativeHandle(r,(function(){return{props:i,getElement:function(){return c.current}}})),u&&function(){var e=(0,a.AK)("p-chip p-component",{"p-chip-image":null!=i.image},i.className),r=i.template?a.gb.getJSXElement(i.template,i):function(){var e=[],r=(0,a.dG)({key:"removeIcon",tabIndex:0,className:"p-chip-remove-icon",onClick:b,onKeyDown:y},h("removeIcon")),t=i.removeIcon||n.createElement(l.x,r);if(i.image){var o=(0,a.dG)({key:"image",src:i.image,onError:i.onImageError},h("image"));e.push(n.createElement("img",d({alt:i.imageAlt},o)))}else if(i.icon){var c=(0,a.dG)({key:"icon",className:"p-chip-icon"},h("icon"));e.push(a.Cz.getJSXIcon(i.icon,v({},c),{props:i}))}if(i.label){var s=(0,a.dG)({key:"label",className:"p-chip-text"},h("label"));e.push(n.createElement("span",s,i.label))}return i.removable&&e.push(a.Cz.getJSXIcon(t,v({},r),{props:i})),e}(),t=(0,a.dG)({ref:c,style:i.style,className:e},p.getOtherProps(i),h("root"));return n.createElement("div",t,r)}()})));y.displayName="Chip"}}]);
//# sourceMappingURL=packageAddStock.c8a88968.chunk.js.map