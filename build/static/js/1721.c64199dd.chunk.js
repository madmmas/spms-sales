"use strict";(self.webpackChunkspms_app=self.webpackChunkspms_app||[]).push([[1721],{4173:function(e,t,n){n.d(t,{P:function(){return r}});n(2791);var r=function(e){return new Promise((function(t,n){var r=JSON.parse(window.sessionStorage.getItem("retry-lazy-refreshed")||"false");e().then((function(e){window.sessionStorage.setItem("retry-lazy-refreshed","false"),t(e)})).catch((function(e){if(!r)return window.sessionStorage.setItem("retry-lazy-refreshed","true"),window.location.reload();n(e)}))}))}},1721:function(e,t,n){n.r(t);var r=n(9439),a=n(2791),i=n(4458),l=n(4173),o=n(184),u=a.lazy((function(){return(0,l.P)((function(){return Promise.all([n.e(7580),n.e(9856),n.e(9195),n.e(2426),n.e(2625),n.e(6891)]).then(n.bind(n,5237))}),"allCashRegister")})),c=a.lazy((function(){return(0,l.P)((function(){return Promise.all([n.e(7580),n.e(9856),n.e(9195),n.e(2426),n.e(2625),n.e(9600)]).then(n.bind(n,7402))}),"allBankRegister")}));t.default=function(){var e=[{component:u},{component:c}],t=(0,a.useState)(0),n=(0,r.Z)(t,2),l=n[0],s=n[1];return(0,o.jsx)("div",{className:"grid crud-demo",children:(0,o.jsx)("div",{className:"col-12",children:(0,o.jsxs)("div",{className:"card",children:[(0,o.jsx)(i.d,{model:[{label:"Cash Register",icon:"pi pi-fw pi-home"},{label:"Bank Register",icon:"pi pi-fw pi-home"}],activeIndex:l,onTabChange:function(e){return s(e.index)}}),(0,o.jsx)(a.Suspense,{fallback:(0,o.jsx)("div",{children:"Loading..."}),children:function(){var t=e[l].component;return(0,o.jsx)(t,{})}()})]})})})}},4458:function(e,t,n){n.d(t,{d:function(){return b}});var r=n(2791),a=n(9411),i=n(5854),l=n(5388),o=n(7890);function u(e){return u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},u(e)}function c(e){var t=function(e,t){if("object"!==u(e)||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var r=n.call(e,t||"default");if("object"!==u(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"===u(t)?t:String(t)}function s(e,t,n){return(t=c(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function f(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function m(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,a,i,l,o=[],u=!0,c=!1;try{if(i=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;u=!1}else for(;!(u=(r=i.call(n)).done)&&(o.push(r.value),o.length!==t);u=!0);}catch(s){c=!0,a=s}finally{try{if(!u&&null!=n.return&&(l=n.return(),Object(l)!==l))return}finally{if(c)throw a}}return o}}(e,t)||function(e,t){if(e){if("string"===typeof e)return f(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?f(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var p=l.V.extend({defaultProps:{__TYPE:"TabMenu",id:null,model:null,activeIndex:0,style:null,className:null,onTabChange:null,children:void 0}});function d(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}var b=r.memo(r.forwardRef((function(e,t){var n=r.useContext(o.Ou),l=p.getProps(e,n),u=m(r.useState(l.activeIndex),2),c=u[0],f=u[1],b=r.useRef(null),y=r.useRef(null),v=r.useRef(null),g=r.useRef({}),h=l.onTabChange?l.activeIndex:c,w=p.setMetaData({props:l,state:{activeIndex:c}}).ptm,O=function(e,t,n){t.disabled?e.preventDefault():(t.url||e.preventDefault(),t.command&&t.command({originalEvent:e,item:t}),l.onTabChange?l.onTabChange({originalEvent:e,value:t,index:n}):f(n))};r.useImperativeHandle(t,(function(){return{props:l,getElement:function(){return b.current}}})),r.useEffect((function(){!function(){if(l.model){var e=g.current["tab_".concat(h)];y.current.style.width=i.p7.getWidth(e)+"px",y.current.style.left=i.p7.getOffset(e).left-i.p7.getOffset(v.current).left+"px"}}()}));var j=function(e,t){if(!1===e.visible)return null;var n=e.className,o=e.style,u=e.disabled,c=e.icon,f=e.label,m=e.template,p=e.url,b=e.target,y=f+"_"+t,v=function(e){return e===(h||0)}(t),j=(0,i.AK)("p-tabmenuitem",{"p-highlight":v,"p-disabled":u},n),S=(0,i.AK)("p-menuitem-icon",c),x=(0,i.dG)({className:S},w("icon")),P=i.Cz.getJSXIcon(c,function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?d(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},x),{props:l}),N=(0,i.dG)({className:"p-menuitem-text"},w("label")),E=f&&r.createElement("span",N,f),C=(0,i.dG)({href:p||"#",className:"p-menuitem-link",target:b,onClick:function(n){return O(n,e,t)},role:"presentation"},w("action")),k=r.createElement("a",C,P,E,r.createElement(a.H,null));if(m){var I={onClick:function(n){return O(n,e,t)},className:"p-menuitem-link",labelClassName:"p-menuitem-text",iconClassName:S,element:k,props:l,active:v,index:t,disabled:u};k=i.gb.getJSXElement(m,e,I)}var T=(0,i.dG)({ref:g.current["tab_".concat(t)],key:y,className:j,style:o,role:"tab","aria-selected":v,"aria-expanded":v,"aria-disabled":u},w("menuitem"));return r.createElement("li",T,k)};if(l.model){var S=(0,i.AK)("p-tabmenu p-component",l.className),x=l.model.map(j),P=(0,i.dG)({ref:y,className:"p-tabmenu-ink-bar"},w("inkbar")),N=(0,i.dG)({ref:v,className:"p-tabmenu-nav p-reset",role:"tablist"},w("menu")),E=(0,i.dG)({id:l.id,ref:b,className:S,style:l.style},p.getOtherProps(l),w("root"));return r.createElement("div",E,r.createElement("ul",N,x,r.createElement("li",P)))}return null})));b.displayName="TabMenu"}}]);
//# sourceMappingURL=1721.c64199dd.chunk.js.map