/*! For license information please see auth.js.LICENSE.txt */
!function(){var t={623:function(){function t(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}Craft.RecoveryCodesSetup=Garnish.Base.extend({init:function(e){var n=this,r=Craft.Slideout.instances[e],o=r.$container.find("button.submit");o.on("activate",(function(){o.addClass("loading"),Craft.sendActionRequest("post","auth/generate-recovery-codes").then((function(e){var o=e.data;r.showSuccess(),Craft.authMethodSetup.refresh();var i,a=$('<div class="pane fullwidth mt-0"/>').appendTo(r.$container.find(".so-body")),s=$('<ul class="auth-method-recovery-codes-list"/>').appendTo(a),c=function(e,n){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,n){if(e){if("string"==typeof e)return t(e,n);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?t(e,n):void 0}}(e))||n&&e&&"number"==typeof e.length){r&&(e=r);var o=0,i=function(){};return{s:i,n:function(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,s=!0,c=!1;return{s:function(){r=r.call(e)},n:function(){var t=r.next();return s=t.done,t},e:function(t){c=!0,a=t},f:function(){try{s||null==r.return||r.return()}finally{if(c)throw a}}}}(o.codes);try{for(c.s();!(i=c.n()).done;){var u=i.value;$("<li/>").text(u).appendTo(s)}}catch(t){c.e(t)}finally{c.f()}$("<hr/>").appendTo(a);var l=$('<div class="auth-method-recovery-codes-download"/>').appendTo(a),f=Craft.ui.createButton({label:Craft.t("app","Download codes"),spinner:!0}).attr("data-icon","download").appendTo(l);n.addListener(f,"activate",(function(){f.addClass("loading");var t,e,n,r=Craft.filterObject((t={},e=Craft.csrfTokenName,n=Craft.csrfTokenValue,e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t));Craft.downloadFromUrl("post",Craft.getActionUrl("auth/download-recovery-codes"),r).catch((function(t){Craft.cp.displayError(t&&t.response&&t.response.data&&t.response.data.message)})).finally((function(){f.removeClass("loading")}))}))})).finally((function(){o.removeClass("loading")}))}))}})},576:function(){},485:function(t,e,n){var r=n(576);r.__esModule&&(r=r.default),"string"==typeof r&&(r=[[t.id,r,""]]),r.locals&&(t.exports=r.locals),(0,n(673).Z)("9c522f06",r,!0,{})},673:function(t,e,n){"use strict";function r(t,e){for(var n=[],r={},o=0;o<e.length;o++){var i=e[o],a=i[0],s={id:t+":"+o,css:i[1],media:i[2],sourceMap:i[3]};r[a]?r[a].parts.push(s):n.push(r[a]={id:a,parts:[s]})}return n}n.d(e,{Z:function(){return p}});var o="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!o)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var i={},a=o&&(document.head||document.getElementsByTagName("head")[0]),s=null,c=0,u=!1,l=function(){},f=null,d="data-vue-ssr-id",h="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function p(t,e,n,o){u=n,f=o||{};var a=r(t,e);return v(a),function(e){for(var n=[],o=0;o<a.length;o++){var s=a[o];(c=i[s.id]).refs--,n.push(c)}for(e?v(a=r(t,e)):a=[],o=0;o<n.length;o++){var c;if(0===(c=n[o]).refs){for(var u=0;u<c.parts.length;u++)c.parts[u]();delete i[c.id]}}}}function v(t){for(var e=0;e<t.length;e++){var n=t[e],r=i[n.id];if(r){r.refs++;for(var o=0;o<r.parts.length;o++)r.parts[o](n.parts[o]);for(;o<n.parts.length;o++)r.parts.push(m(n.parts[o]));r.parts.length>n.parts.length&&(r.parts.length=n.parts.length)}else{var a=[];for(o=0;o<n.parts.length;o++)a.push(m(n.parts[o]));i[n.id]={id:n.id,refs:1,parts:a}}}}function y(){var t=document.createElement("style");return t.type="text/css",a.appendChild(t),t}function m(t){var e,n,r=document.querySelector("style["+d+'~="'+t.id+'"]');if(r){if(u)return l;r.parentNode.removeChild(r)}if(h){var o=c++;r=s||(s=y()),e=w.bind(null,r,o,!1),n=w.bind(null,r,o,!0)}else r=y(),e=C.bind(null,r),n=function(){r.parentNode.removeChild(r)};return e(t),function(r){if(r){if(r.css===t.css&&r.media===t.media&&r.sourceMap===t.sourceMap)return;e(t=r)}else n()}}var g,b=(g=[],function(t,e){return g[t]=e,g.filter(Boolean).join("\n")});function w(t,e,n,r){var o=n?"":r.css;if(t.styleSheet)t.styleSheet.cssText=b(e,o);else{var i=document.createTextNode(o),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(i,a[e]):t.appendChild(i)}}function C(t,e){var n=e.css,r=e.media,o=e.sourceMap;if(r&&t.setAttribute("media",r),f.ssrId&&t.setAttribute(d,e.id),o&&(n+="\n/*# sourceURL="+o.sources[0]+" */",n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */"),t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}}},e={};function n(r){var o=e[r];if(void 0!==o)return o.exports;var i=e[r]={id:r,exports:{}};return t[r](i,i.exports,n),i.exports}n.d=function(t,e){for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},function(){"use strict";n(485);class t extends Error{constructor(t,e="WebAuthnError"){super(t),this.name=e}}function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},e(t)}function r(){r=function(){return t};var t={},n=Object.prototype,o=n.hasOwnProperty,i=Object.defineProperty||function(t,e,n){t[e]=n.value},a="function"==typeof Symbol?Symbol:{},s=a.iterator||"@@iterator",c=a.asyncIterator||"@@asyncIterator",u=a.toStringTag||"@@toStringTag";function l(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{l({},"")}catch(t){l=function(t,e,n){return t[e]=n}}function f(t,e,n,r){var o=e&&e.prototype instanceof p?e:p,a=Object.create(o.prototype),s=new O(r||[]);return i(a,"_invoke",{value:S(t,n,s)}),a}function d(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}t.wrap=f;var h={};function p(){}function v(){}function y(){}var m={};l(m,s,(function(){return this}));var g=Object.getPrototypeOf,b=g&&g(g(j([])));b&&b!==n&&o.call(b,s)&&(m=b);var w=y.prototype=p.prototype=Object.create(m);function C(t){["next","throw","return"].forEach((function(e){l(t,e,(function(t){return this._invoke(e,t)}))}))}function x(t,n){function r(i,a,s,c){var u=d(t[i],t,a);if("throw"!==u.type){var l=u.arg,f=l.value;return f&&"object"==e(f)&&o.call(f,"__await")?n.resolve(f.__await).then((function(t){r("next",t,s,c)}),(function(t){r("throw",t,s,c)})):n.resolve(f).then((function(t){l.value=t,s(l)}),(function(t){return r("throw",t,s,c)}))}c(u.arg)}var a;i(this,"_invoke",{value:function(t,e){function o(){return new n((function(n,o){r(t,e,n,o)}))}return a=a?a.then(o,o):o()}})}function S(t,e,n){var r="suspendedStart";return function(o,i){if("executing"===r)throw new Error("Generator is already running");if("completed"===r){if("throw"===o)throw i;return{value:void 0,done:!0}}for(n.method=o,n.arg=i;;){var a=n.delegate;if(a){var s=L(a,n);if(s){if(s===h)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if("suspendedStart"===r)throw r="completed",n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r="executing";var c=d(t,e,n);if("normal"===c.type){if(r=n.done?"completed":"suspendedYield",c.arg===h)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(r="completed",n.method="throw",n.arg=c.arg)}}}function L(t,e){var n=t.iterator[e.method];if(void 0===n){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=void 0,L(t,e),"throw"===e.method))return h;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return h}var r=d(n,t.iterator,e.arg);if("throw"===r.type)return e.method="throw",e.arg=r.arg,e.delegate=null,h;var o=r.arg;return o?o.done?(e[t.resultName]=o.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,h):o:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,h)}function E(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function A(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function O(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(E,this),this.reset(!0)}function j(t){if(t){var e=t[s];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,r=function e(){for(;++n<t.length;)if(o.call(t,n))return e.value=t[n],e.done=!1,e;return e.value=void 0,e.done=!0,e};return r.next=r}}return{next:N}}function N(){return{value:void 0,done:!0}}return v.prototype=y,i(w,"constructor",{value:y,configurable:!0}),i(y,"constructor",{value:v,configurable:!0}),v.displayName=l(y,u,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===v||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,y):(t.__proto__=y,l(t,u,"GeneratorFunction")),t.prototype=Object.create(w),t},t.awrap=function(t){return{__await:t}},C(x.prototype),l(x.prototype,c,(function(){return this})),t.AsyncIterator=x,t.async=function(e,n,r,o,i){void 0===i&&(i=Promise);var a=new x(f(e,n,r,o),i);return t.isGeneratorFunction(n)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},C(w),l(w,u,"Generator"),l(w,s,(function(){return this})),l(w,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},t.values=j,O.prototype={constructor:O,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(A),!t)for(var e in this)"t"===e.charAt(0)&&o.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(n,r){return a.type="throw",a.arg=t,e.next=n,r&&(e.method="next",e.arg=void 0),!!r}for(var r=this.tryEntries.length-1;r>=0;--r){var i=this.tryEntries[r],a=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var s=o.call(i,"catchLoc"),c=o.call(i,"finallyLoc");if(s&&c){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(s){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.tryLoc<=this.prev&&o.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var i=r;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,h):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),h},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),A(n),h}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;A(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:j(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=void 0),h}},t}function o(t,e,n,r,o,i,a){try{var s=t[i](a),c=s.value}catch(t){return void n(t)}s.done?e(c):Promise.resolve(c).then(r,o)}new class{createNewAbortSignal(){this.controller&&this.controller.abort("Cancelling existing WebAuthn API call for new one");const t=new AbortController;return this.controller=t,t.signal}},Craft.AuthMethodSetup=Garnish.Base.extend({methodListings:null,init:function(t){this.setSettings(t,Craft.AuthMethodSetup.defaults),this.initUi()},initUi:function(){this.methodListings=Craft.index(document.querySelectorAll("#auth-method-setup .auth-method"),(function(t){return t.getAttribute("data-method")}));for(var t=0,e=Object.values(this.methodListings);t<e.length;t++){var n=e[t];this.initListing(n)}},initListing:function(t){var e=this,n=t.querySelector(".auth-method-setup-btn");this.addListener(n,"activate",(function(n){var r=t.getAttribute("data-method");e.showSetupSlideout(r)}))},showSetupSlideout:function(t){var e=this,n=this.methodListings[t].querySelector(".auth-method-setup-btn");n.classList.contains("loading")||(n.classList.add("loading"),Craft.elevatedSessionManager.requireElevatedSession((function(){Craft.sendActionRequest("POST","auth/method-setup-html",{data:{method:t}}).then(function(){var t,n=(t=r().mark((function t(n){var o,i;return r().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o=n.data,i=new Craft.AuthMethodSetup.Slideout(o),t.next=4,Craft.appendHeadHtml(o.headHtml);case 4:return t.next=6,Craft.appendBodyHtml(o.bodyHtml);case 6:e.addListener(i.$container.find(".auth-method-close-btn"),"activate",(function(){i.close()})),"craft\\auth\\passkeys\\type\\WebAuthn"===o.selectedMethod&&void 0!==(null===window||void 0===window?void 0:window.PublicKeyCredential)&&"function"==typeof window.PublicKeyCredential&&new Craft.WebAuthnSetup(i,e.settings);case 8:case"end":return t.stop()}}),t)})),function(){var e=this,n=arguments;return new Promise((function(r,i){var a=t.apply(e,n);function s(t){o(a,r,i,s,c,"next",t)}function c(t){o(a,r,i,s,c,"throw",t)}s(void 0)}))});return function(t){return n.apply(this,arguments)}}()).catch((function(t){var e=t.response;Craft.cp.displayError(e.data.message)})).finally((function(){n.classList.remove("loading")}))}),(function(){n.classList.remove("loading")}),Math.min(Craft.elevatedSessionDuration,300)))},refresh:function(){var t=this;Craft.sendActionRequest("POST","auth/method-listing-html").then((function(e){var n=e.data,r=$(n.html);$("#auth-method-setup").replaceWith(r),Craft.initUiElements(r),Craft.appendHeadHtml(n.headHtml),Craft.appendBodyHtml(n.bodyHtml),t.removeAllListeners(),t.initUi()}))}}),Craft.AuthMethodSetup.Slideout=Craft.Slideout.extend({methodName:null,init:function(t){this.methodName=t.methodName;var e='\n<div class="so-body">'.concat(t.html,'</div>\n<div class="so-footer">\n  <div class="flex-grow"></div>\n  <div class="flex flex-nowrap">\n    <button type="button" class="btn auth-method-close-btn">').concat(Craft.t("app","Cancel"),"</button>\n  </div>\n</div>\n");this.base(e,{containerAttributes:{id:t.containerId}})},showSuccess:function(){var t=Craft.t("app","{name} added successfully.",{name:this.methodName});this.$container.find(".so-body").addClass("auth-method-setup-success").html('\n<div class="auth-method-setup-success-graphic" data-icon="check"></div>\n<h1 class="auth-method-setup-success-message">'.concat(t,"</h1>\n")),this.$container.find(".auth-method-close-btn").text(Craft.t("app","Close"))}}),n(623)}()}();
//# sourceMappingURL=auth.js.map