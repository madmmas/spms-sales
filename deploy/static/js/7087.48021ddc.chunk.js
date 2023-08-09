/*! For license information please see 7087.48021ddc.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunkspms_app=self.webpackChunkspms_app||[]).push([[7087,6650,1225,5753,5059],{1811:function(t,e,n){n.d(e,{CN:function(){return E},CZ:function(){return i},D:function(){return I},Eh:function(){return R},GB:function(){return Z},H0:function(){return G},Hh:function(){return m},Hn:function(){return j},Id:function(){return g},Ik:function(){return P},K$:function(){return x},LM:function(){return a},MU:function(){return r},Ni:function(){return p},Q4:function(){return S},R$:function(){return d},UR:function(){return b},VB:function(){return h},VC:function(){return u},W9:function(){return _},aF:function(){return v},eQ:function(){return N},ev:function(){return y},fs:function(){return L},if:function(){return O},it:function(){return c},kj:function(){return s},q$:function(){return o},qI:function(){return k},s5:function(){return w},sf:function(){return l},sk:function(){return T},uG:function(){return A},vN:function(){return C},vY:function(){return f}});var r="dtBank",o="dtBankAccount",a="dtCash",i="dtCustomer",u="dtEmployee",c="dtEmploymentHistory",l="dtProduct",s="dtSupplier",f="dtWarehouse",p="dtStock",d="trxDamagedStock",h="trxStockAdjustment",m="trxExpense",v="trxExtraIncome",y="trxPurchase",g="trxSales",b="trxStockIn",w="trxStockOut",x="trxACRecievable",E="trxACPayable",k="trxBankRegister",P="trxCashRegister",j="trxPayment",L="dtCustomerCategory",O="dtDepartment",N="dtDesignation",S="dtExpenseType",C="dtExtraIncomeType",Z="dtGrade",I="dtGroup",_="dtOfficeTime",T="dtPaymentType",A="dtProductCategory",G="dtRoute",R="dtSupplierCategory"},4173:function(t,e,n){n.d(e,{P:function(){return r}});n(2791);var r=function(t){return new Promise((function(e,n){var r=JSON.parse(window.sessionStorage.getItem("retry-lazy-refreshed")||"false");t().then((function(t){window.sessionStorage.setItem("retry-lazy-refreshed","false"),e(t)})).catch((function(t){if(!r)return window.sessionStorage.setItem("retry-lazy-refreshed","true"),window.location.reload();n(t)}))}))}},7087:function(t,e,n){n.r(e);var r=n(9439),o=n(2791),a=n(7689),i=n(919),u=n(4458),c=n(4173),l=n(5512),s=n(1811),f=n(184),p=o.lazy((function(){return(0,c.P)((function(){return Promise.all([n.e(7580),n.e(9195),n.e(7201),n.e(7562),n.e(3374)]).then(n.bind(n,9299))}),"empProfile")})),d=o.lazy((function(){return(0,c.P)((function(){return Promise.all([n.e(7580),n.e(4286),n.e(8968)]).then(n.bind(n,2678))}),"employmentHistory")}));e.default=function(){var t=(0,a.UO)().id,e=(0,a.s0)(),n=s.VC,c=new l.E,h=(0,o.useState)(null),m=(0,r.Z)(h,2),v=m[0],y=m[1],g=[{component:p},{component:d}],b=(0,o.useState)(0),w=(0,r.Z)(b,2),x=w[0],E=w[1];(0,o.useEffect)((function(){console.log(t),"new"==t?y(null):c.getById(n,t).then((function(t){y(t)}))}),[]);return(0,f.jsx)("div",{className:"grid crud-demo",children:(0,f.jsx)("div",{className:"col-12",children:(0,f.jsxs)("div",{className:"card",children:[(0,f.jsx)(i.z,{onClick:function(){e("/employees")},className:"p-button-outlined",label:"Go Back to List"}),"new"!=t&&(0,f.jsx)(u.d,{model:[{label:"Edit",icon:"pi pi-fw pi-home"},{label:"Employment History",icon:"pi pi-fw pi-home"}],activeIndex:x,onTabChange:function(t){return E(t.index)}}),(0,f.jsx)(o.Suspense,{fallback:(0,f.jsx)("div",{children:"Loading..."}),children:"new"==t?(0,f.jsx)(p,{}):v&&function(){var t=g[x].component;return(0,f.jsx)(t,{empProfile:v})}()})]})})})}},5512:function(t,e,n){n.d(e,{E:function(){return c}});var r=n(4165),o=n(5861),a=n(5671),i=n(3144),u=n(8290),c=function(){function t(){(0,a.Z)(this,t)}return(0,i.Z)(t,[{key:"getById",value:function(){var t=(0,o.Z)((0,r.Z)().mark((function t(e,n){var o;return(0,r.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.ZP.get("/data/".concat(e,"/")+n);case 2:return o=t.sent,console.log(o.data),t.abrupt("return",o.data);case 5:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()},{key:"getAll",value:function(){var t=(0,o.Z)((0,r.Z)().mark((function t(e,n){var o;return(0,r.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o=n?Object.keys(n).map((function(t){return encodeURIComponent(t)+"="+encodeURIComponent(n[t])})).join("&"):"",t.abrupt("return",u.ZP.get("/data/".concat(e,"?")+o).then((function(t){return t.data})));case 2:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()},{key:"create",value:function(){var t=(0,o.Z)((0,r.Z)().mark((function t(e,n){var o;return(0,r.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.ZP.post("/data/".concat(e),n);case 2:return o=t.sent,console.log(o.data),t.abrupt("return",o.data);case 5:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()},{key:"update",value:function(){var t=(0,o.Z)((0,r.Z)().mark((function t(e,n,o){var a;return(0,r.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.ZP.put("/data/".concat(e,"/")+n,o);case 2:return a=t.sent,console.log(a.data),t.abrupt("return",a.data);case 5:case"end":return t.stop()}}),t)})));return function(e,n,r){return t.apply(this,arguments)}}()},{key:"delete",value:function(){var t=(0,o.Z)((0,r.Z)().mark((function t(e,n){var o;return(0,r.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.ZP.delete("/data/".concat(e,"/")+n);case 2:return o=t.sent,console.log(o.data),t.abrupt("return",o.data);case 5:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()}]),t}()},4458:function(t,e,n){n.d(e,{d:function(){return s}});var r=n(2791),o=n(9411),a=n(5854);function i(){return i=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},i.apply(this,arguments)}function u(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function c(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,o,a,i,u=[],c=!0,l=!1;try{if(a=(n=n.call(t)).next,0===e){if(Object(n)!==n)return;c=!1}else for(;!(c=(r=a.call(n)).done)&&(u.push(r.value),u.length!==e);c=!0);}catch(s){l=!0,o=s}finally{try{if(!c&&null!=n.return&&(i=n.return(),Object(i)!==i))return}finally{if(l)throw o}}return u}}(t,e)||function(t,e){if(t){if("string"===typeof t)return u(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?u(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var l={defaultProps:{__TYPE:"TabMenu",id:null,model:null,activeIndex:0,style:null,className:null,onTabChange:null,children:void 0},getProps:function(t){return a.gb.getMergedProps(t,l.defaultProps)},getOtherProps:function(t){return a.gb.getDiffProps(t,l.defaultProps)}},s=r.memo(r.forwardRef((function(t,e){var n=l.getProps(t),u=c(r.useState(n.activeIndex),2),s=u[0],f=u[1],p=r.useRef(null),d=r.useRef(null),h=r.useRef(null),m=r.useRef({}),v=n.onTabChange?n.activeIndex:s,y=function(t,e,r){e.disabled?t.preventDefault():(e.url||t.preventDefault(),e.command&&e.command({originalEvent:t,item:e}),n.onTabChange?n.onTabChange({originalEvent:t,value:e,index:r}):f(r))};r.useImperativeHandle(e,(function(){return{props:n,getElement:function(){return p.current}}})),r.useEffect((function(){!function(){if(n.model){var t=m.current["tab_".concat(v)];d.current.style.width=a.p7.getWidth(t)+"px",d.current.style.left=a.p7.getOffset(t).left-a.p7.getOffset(h.current).left+"px"}}()}));var g=function(t,e){if(!1===t.visible)return null;var i=t.className,u=t.style,c=t.disabled,l=t.icon,s=t.label,f=t.template,p=t.url,d=t.target,h=s+"_"+e,g=function(t){return t===(v||0)}(e),b=(0,a.AK)("p-tabmenuitem",{"p-highlight":g,"p-disabled":c},i),w=(0,a.AK)("p-menuitem-icon",l),x=a.Cz.getJSXIcon(l,{className:"p-menuitem-icon"},{props:n}),E=s&&r.createElement("span",{className:"p-menuitem-text"},s),k=r.createElement("a",{href:p||"#",className:"p-menuitem-link",target:d,onClick:function(n){return y(n,t,e)},role:"presentation"},x,E,r.createElement(o.H,null));if(f){var P={onClick:function(n){return y(n,t,e)},className:"p-menuitem-link",labelClassName:"p-menuitem-text",iconClassName:w,element:k,props:n,active:g,index:e,disabled:c};k=a.gb.getJSXElement(f,t,P)}return r.createElement("li",{ref:m.current["tab_".concat(e)],key:h,className:b,style:u,role:"tab","aria-selected":g,"aria-expanded":g,"aria-disabled":c},k)};if(n.model){var b=l.getOtherProps(n),w=(0,a.AK)("p-tabmenu p-component",n.className),x=n.model.map(g);return r.createElement("div",i({id:n.id,ref:p,className:w,style:n.style},b),r.createElement("ul",{ref:h,className:"p-tabmenu-nav p-reset",role:"tablist"},x,r.createElement("li",{ref:d,className:"p-tabmenu-ink-bar"})))}return null})));s.displayName="TabMenu"},5861:function(t,e,n){function r(t,e,n,r,o,a,i){try{var u=t[a](i),c=u.value}catch(l){return void n(l)}u.done?e(c):Promise.resolve(c).then(r,o)}function o(t){return function(){var e=this,n=arguments;return new Promise((function(o,a){var i=t.apply(e,n);function u(t){r(i,o,a,u,c,"next",t)}function c(t){r(i,o,a,u,c,"throw",t)}u(void 0)}))}}n.d(e,{Z:function(){return o}})},4165:function(t,e,n){n.d(e,{Z:function(){return o}});var r=n(1002);function o(){o=function(){return t};var t={},e=Object.prototype,n=e.hasOwnProperty,a=Object.defineProperty||function(t,e,n){t[e]=n.value},i="function"==typeof Symbol?Symbol:{},u=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",l=i.toStringTag||"@@toStringTag";function s(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{s({},"")}catch(C){s=function(t,e,n){return t[e]=n}}function f(t,e,n,r){var o=e&&e.prototype instanceof h?e:h,i=Object.create(o.prototype),u=new O(r||[]);return a(i,"_invoke",{value:k(t,n,u)}),i}function p(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(C){return{type:"throw",arg:C}}}t.wrap=f;var d={};function h(){}function m(){}function v(){}var y={};s(y,u,(function(){return this}));var g=Object.getPrototypeOf,b=g&&g(g(N([])));b&&b!==e&&n.call(b,u)&&(y=b);var w=v.prototype=h.prototype=Object.create(y);function x(t){["next","throw","return"].forEach((function(e){s(t,e,(function(t){return this._invoke(e,t)}))}))}function E(t,e){function o(a,i,u,c){var l=p(t[a],t,i);if("throw"!==l.type){var s=l.arg,f=s.value;return f&&"object"==(0,r.Z)(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){o("next",t,u,c)}),(function(t){o("throw",t,u,c)})):e.resolve(f).then((function(t){s.value=t,u(s)}),(function(t){return o("throw",t,u,c)}))}c(l.arg)}var i;a(this,"_invoke",{value:function(t,n){function r(){return new e((function(e,r){o(t,n,e,r)}))}return i=i?i.then(r,r):r()}})}function k(t,e,n){var r="suspendedStart";return function(o,a){if("executing"===r)throw new Error("Generator is already running");if("completed"===r){if("throw"===o)throw a;return S()}for(n.method=o,n.arg=a;;){var i=n.delegate;if(i){var u=P(i,n);if(u){if(u===d)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if("suspendedStart"===r)throw r="completed",n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r="executing";var c=p(t,e,n);if("normal"===c.type){if(r=n.done?"completed":"suspendedYield",c.arg===d)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(r="completed",n.method="throw",n.arg=c.arg)}}}function P(t,e){var n=e.method,r=t.iterator[n];if(void 0===r)return e.delegate=null,"throw"===n&&t.iterator.return&&(e.method="return",e.arg=void 0,P(t,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),d;var o=p(r,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,d;var a=o.arg;return a?a.done?(e[t.resultName]=a.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,d):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,d)}function j(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function L(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function O(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(j,this),this.reset(!0)}function N(t){if(t){var e=t[u];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,o=function e(){for(;++r<t.length;)if(n.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=void 0,e.done=!0,e};return o.next=o}}return{next:S}}function S(){return{value:void 0,done:!0}}return m.prototype=v,a(w,"constructor",{value:v,configurable:!0}),a(v,"constructor",{value:m,configurable:!0}),m.displayName=s(v,l,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===m||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,v):(t.__proto__=v,s(t,l,"GeneratorFunction")),t.prototype=Object.create(w),t},t.awrap=function(t){return{__await:t}},x(E.prototype),s(E.prototype,c,(function(){return this})),t.AsyncIterator=E,t.async=function(e,n,r,o,a){void 0===a&&(a=Promise);var i=new E(f(e,n,r,o),a);return t.isGeneratorFunction(n)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},x(w),s(w,l,"Generator"),s(w,u,(function(){return this})),s(w,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},t.values=N,O.prototype={constructor:O,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(L),!t)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(n,r){return i.type="throw",i.arg=t,e.next=n,r&&(e.method="next",e.arg=void 0),!!r}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],i=a.completion;if("root"===a.tryLoc)return r("end");if(a.tryLoc<=this.prev){var u=n.call(a,"catchLoc"),c=n.call(a,"finallyLoc");if(u&&c){if(this.prev<a.catchLoc)return r(a.catchLoc,!0);if(this.prev<a.finallyLoc)return r(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return r(a.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return r(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,d):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),d},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),L(n),d}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;L(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:N(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=void 0),d}},t}}}]);
//# sourceMappingURL=7087.48021ddc.chunk.js.map