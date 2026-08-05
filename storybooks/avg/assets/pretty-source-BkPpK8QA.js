import{a as e,n as t,t as n}from"./rolldown-runtime-DkW27tQK.js";var r=n((e=>{e.__esModule=!0,e.extend=a,e.indexOf=l,e.escapeExpression=u,e.isEmpty=d,e.createFrame=f,e.blockParams=p,e.appendContextPath=m;var t={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#x27;`,"`":`&#x60;`,"=":`&#x3D;`},n=/[&<>"'`=]/g,r=/[&<>"'`=]/;function i(e){return t[e]}function a(e){for(var t=1;t<arguments.length;t++)for(var n in arguments[t])Object.prototype.hasOwnProperty.call(arguments[t],n)&&(e[n]=arguments[t][n]);return e}var o=Object.prototype.toString;e.toString=o;var s=function(e){return typeof e==`function`};s(/x/)&&(e.isFunction=s=function(e){return typeof e==`function`&&o.call(e)===`[object Function]`}),e.isFunction=s;var c=Array.isArray||function(e){return e&&typeof e==`object`?o.call(e)===`[object Array]`:!1};e.isArray=c;function l(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1}function u(e){if(typeof e!=`string`){if(e&&e.toHTML)return e.toHTML();if(e==null)return``;if(!e)return e+``;e=``+e}return r.test(e)?e.replace(n,i):e}function d(e){return!e&&e!==0||!!(c(e)&&e.length===0)}function f(e){var t=a({},e);return t._parent=e,t}function p(e,t){return e.path=t,e}function m(e,t){return(e?e+`.`:``)+t}})),i=n(((e,t)=>{e.__esModule=!0;var n=[`description`,`fileName`,`lineNumber`,`endLineNumber`,`message`,`name`,`number`,`stack`];function r(e,t){var i=t&&t.loc,a=void 0,o=void 0,s=void 0,c=void 0;i&&(a=i.start.line,o=i.end.line,s=i.start.column,c=i.end.column,e+=` - `+a+`:`+s);for(var l=Error.prototype.constructor.call(this,e),u=0;u<n.length;u++)this[n[u]]=l[n[u]];Error.captureStackTrace&&Error.captureStackTrace(this,r);try{i&&(this.lineNumber=a,this.endLineNumber=o,Object.defineProperty?(Object.defineProperty(this,"column",{value:s,enumerable:!0}),Object.defineProperty(this,"endColumn",{value:c,enumerable:!0})):(this.column=s,this.endColumn=c))}catch{}}r.prototype=Error(),e.default=r,t.exports=e.default})),a=n(((e,t)=>{e.__esModule=!0;var n=r();e.default=function(e){e.registerHelper(`blockHelperMissing`,function(t,r){var i=r.inverse,a=r.fn;if(t===!0)return a(this);if(t===!1||t==null)return i(this);if(n.isArray(t))return t.length>0?(r.ids&&(r.ids=[r.name]),e.helpers.each(t,r)):i(this);if(r.data&&r.ids){var o=n.createFrame(r.data);o.contextPath=n.appendContextPath(r.data.contextPath,r.name),r={data:o}}return a(t,r)})},t.exports=e.default})),o=n(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var a=r(),o=n(i());e.default=function(e){e.registerHelper(`each`,function(e,t){if(!t)throw new o.default(`Must pass iterator to #each`);var n=t.fn,r=t.inverse,i=0,s=``,c=void 0,l=void 0;t.data&&t.ids&&(l=a.appendContextPath(t.data.contextPath,t.ids[0])+`.`),a.isFunction(e)&&(e=e.call(this)),t.data&&(c=a.createFrame(t.data));function u(t,r,i){c&&(c.key=t,c.index=r,c.first=r===0,c.last=!!i,l&&(c.contextPath=l+t)),s+=n(e[t],{data:c,blockParams:a.blockParams([e[t],t],[l+t,null])})}if(e&&typeof e==`object`)if(a.isArray(e))for(var d=e.length;i<d;i++)i in e&&u(i,i,i===e.length-1);else if(typeof Symbol==`function`&&e[Symbol.iterator]){for(var f=[],p=e[Symbol.iterator](),m=p.next();!m.done;m=p.next())f.push(m.value);e=f;for(var d=e.length;i<d;i++)u(i,i,i===e.length-1)}else(function(){var t=void 0;Object.keys(e).forEach(function(e){t!==void 0&&u(t,i-1),t=e,i++}),t!==void 0&&u(t,i-1,!0)})();return i===0&&(s=r(this)),s})},t.exports=e.default})),s=n(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var r=n(i());e.default=function(e){e.registerHelper(`helperMissing`,function(){if(arguments.length!==1)throw new r.default(`Missing helper: "`+arguments[arguments.length-1].name+`"`)})},t.exports=e.default})),c=n(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var a=r(),o=n(i());e.default=function(e){e.registerHelper(`if`,function(e,t){if(arguments.length!=2)throw new o.default(`#if requires exactly one argument`);return a.isFunction(e)&&(e=e.call(this)),!t.hash.includeZero&&!e||a.isEmpty(e)?t.inverse(this):t.fn(this)}),e.registerHelper(`unless`,function(t,n){if(arguments.length!=2)throw new o.default(`#unless requires exactly one argument`);return e.helpers.if.call(this,t,{fn:n.inverse,inverse:n.fn,hash:n.hash})})},t.exports=e.default})),l=n(((e,t)=>{e.__esModule=!0,e.default=function(e){e.registerHelper(`log`,function(){for(var t=[void 0],n=arguments[arguments.length-1],r=0;r<arguments.length-1;r++)t.push(arguments[r]);var i=1;n.hash.level==null?n.data&&n.data.level!=null&&(i=n.data.level):i=n.hash.level,t[0]=i,e.log.apply(e,t)})},t.exports=e.default})),u=n(((e,t)=>{e.__esModule=!0,e.default=function(e){e.registerHelper(`lookup`,function(e,t,n){return e&&n.lookupProperty(e,t)})},t.exports=e.default})),d=n(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var a=r(),o=n(i());e.default=function(e){e.registerHelper(`with`,function(e,t){if(arguments.length!=2)throw new o.default(`#with requires exactly one argument`);a.isFunction(e)&&(e=e.call(this));var n=t.fn;if(a.isEmpty(e))return t.inverse(this);var r=t.data;return t.data&&t.ids&&(r=a.createFrame(t.data),r.contextPath=a.appendContextPath(t.data.contextPath,t.ids[0])),n(e,{data:r,blockParams:a.blockParams([e],[r&&r.contextPath])})})},t.exports=e.default})),f=n((e=>{e.__esModule=!0,e.registerDefaultHelpers=g,e.moveHelperToHooks=_;function t(e){return e&&e.__esModule?e:{default:e}}var n=t(a()),r=t(o()),i=t(s()),f=t(c()),p=t(l()),m=t(u()),h=t(d());function g(e){n.default(e),r.default(e),i.default(e),f.default(e),p.default(e),m.default(e),h.default(e)}function _(e,t,n){e.helpers[t]&&(e.hooks[t]=e.helpers[t],n||(e.helpers[t]=void 0))}})),p=n(((e,t)=>{e.__esModule=!0;var n=r();e.default=function(e){e.registerDecorator(`inline`,function(e,t,r,i){var a=e;return t.partials||(t.partials={},a=function(i,a){var o=r.partials;r.partials=n.extend({},o,t.partials);var s=e(i,a);return r.partials=o,s}),t.partials[i.args[0]]=i.fn,a})},t.exports=e.default})),m=n((e=>{e.__esModule=!0,e.registerDefaultDecorators=r;function t(e){return e&&e.__esModule?e:{default:e}}var n=t(p());function r(e){n.default(e)}})),h=n(((e,t)=>{e.__esModule=!0;var n=r(),i={methodMap:[`debug`,`info`,`warn`,`error`],level:`info`,lookupLevel:function(e){if(typeof e==`string`){var t=n.indexOf(i.methodMap,e.toLowerCase());e=t>=0?t:parseInt(e,10)}return e},log:function(e){if(e=i.lookupLevel(e),typeof console<`u`&&i.lookupLevel(i.level)<=e){var t=i.methodMap[e];console[t]||(t=`log`);var n=[...arguments].slice(1);console[t].apply(console,n)}}};e.default=i,t.exports=e.default})),g=n((e=>{e.__esModule=!0,e.createProtoAccessControl=o,e.resultIsAllowed=s,e.resetLoggedProperties=u;function t(e){return e&&e.__esModule?e:{default:e}}var n=r(),i=t(h()),a=Object.create(null);function o(e){var t=Object.create(null);t.__proto__=!1,n.extend(t,e.allowedProtoProperties);var r=Object.create(null);return r.constructor=!1,r.__defineGetter__=!1,r.__defineSetter__=!1,r.__lookupGetter__=!1,r.__lookupSetter__=!1,n.extend(r,e.allowedProtoMethods),{properties:{whitelist:t,defaultValue:e.allowProtoPropertiesByDefault},methods:{whitelist:r,defaultValue:e.allowProtoMethodsByDefault}}}function s(e,t,n){return c(typeof e==`function`?t.methods:t.properties,n)}function c(e,t){return e.whitelist[t]===void 0?e.defaultValue===void 0?(l(t),!1):e.defaultValue:e.whitelist[t]===!0}function l(e){a[e]!==!0&&(a[e]=!0,i.default.log(`error`,`Handlebars: Access has been denied to resolve the property "`+e+`" because it is not an "own property" of its parent.
You can add a runtime option to disable the check or this warning:
See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details`))}function u(){Object.keys(a).forEach(function(e){delete a[e]})}})),_=n((e=>{e.__esModule=!0,e.HandlebarsEnvironment=d;function t(e){return e&&e.__esModule?e:{default:e}}var n=r(),a=t(i()),o=f(),s=m(),c=t(h()),l=g();e.VERSION=`4.7.9`,e.COMPILER_REVISION=8,e.LAST_COMPATIBLE_COMPILER_REVISION=7,e.REVISION_CHANGES={1:`<= 1.0.rc.2`,2:`== 1.0.0-rc.3`,3:`== 1.0.0-rc.4`,4:`== 1.x.x`,5:`== 2.0.0-alpha.x`,6:`>= 2.0.0-beta.1`,7:`>= 4.0.0 <4.3.0`,8:`>= 4.3.0`};var u=`[object Object]`;function d(e,t,n){this.helpers=e||{},this.partials=t||{},this.decorators=n||{},o.registerDefaultHelpers(this),s.registerDefaultDecorators(this)}d.prototype={constructor:d,logger:c.default,log:c.default.log,registerHelper:function(e,t){if(n.toString.call(e)===u){if(t)throw new a.default(`Arg not supported with multiple helpers`);n.extend(this.helpers,e)}else this.helpers[e]=t},unregisterHelper:function(e){delete this.helpers[e]},registerPartial:function(e,t){if(n.toString.call(e)===u)n.extend(this.partials,e);else{if(t===void 0)throw new a.default(`Attempting to register a partial called "`+e+`" as undefined`);this.partials[e]=t}},unregisterPartial:function(e){delete this.partials[e]},registerDecorator:function(e,t){if(n.toString.call(e)===u){if(t)throw new a.default(`Arg not supported with multiple decorators`);n.extend(this.decorators,e)}else this.decorators[e]=t},unregisterDecorator:function(e){delete this.decorators[e]},resetLoggedPropertyAccesses:function(){l.resetLoggedProperties()}},e.log=c.default.log,e.createFrame=n.createFrame,e.logger=c.default})),v=n(((e,t)=>{e.__esModule=!0;function n(e){this.string=e}n.prototype.toString=n.prototype.toHTML=function(){return``+this.string},e.default=n,t.exports=e.default})),y=n((e=>{e.__esModule=!0,e.wrapHelper=t;function t(e,t){return typeof e==`function`?function(){var n=arguments[arguments.length-1];return arguments[arguments.length-1]=t(n),e.apply(this,arguments)}:e}})),b=n((e=>{e.__esModule=!0,e.checkRevision=d,e.template=p,e.wrapProgram=m,e.resolvePartial=h,e.invokePartial=v,e.noop=b;function t(e){return e&&e.__esModule?e:{default:e}}function n(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}var a=n(r()),o=t(i()),s=_(),c=f(),l=y(),u=g();function d(e){var t=e&&e[0]||1,n=s.COMPILER_REVISION;if(!(t>=s.LAST_COMPATIBLE_COMPILER_REVISION&&t<=s.COMPILER_REVISION)){if(t<s.LAST_COMPATIBLE_COMPILER_REVISION){var r=s.REVISION_CHANGES[n],i=s.REVISION_CHANGES[t];throw new o.default(`Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version (`+r+`) or downgrade your runtime to an older version (`+i+`).`)}throw new o.default(`Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version (`+e[1]+`).`)}}function p(e,t){if(!t)throw new o.default(`No environment passed to template`);if(!e||!e.main)throw new o.default(`Unknown template object: `+typeof e);e.main.decorator=e.main_d,t.VM.checkRevision(e.compiler);var n=e.compiler&&e.compiler[0]===7;function r(n,r,i){i.hash&&(r=a.extend({},r,i.hash),i.ids&&(i.ids[0]=!0)),n=t.VM.resolvePartial.call(this,n,r,i),i.hooks=this.hooks,i.protoAccessControl=this.protoAccessControl;var s=t.VM.invokePartial.call(this,n,r,i);if(s==null&&t.compile&&(i.partials[i.name]=t.compile(n,e.compilerOptions,t),s=i.partials[i.name](r,i)),s!=null){if(i.indent){for(var c=s.split(`
`),l=0,u=c.length;l<u&&!(!c[l]&&l+1===u);l++)c[l]=i.indent+c[l];s=c.join(`
`)}return s}throw new o.default(`The partial `+i.name+` could not be compiled when running in runtime-only mode`)}var i={strict:function(e,t,n){if(!e||!(t in e))throw new o.default(`"`+t+`" not defined in `+e,{loc:n});return i.lookupProperty(e,t)},lookupProperty:function(e,t){var n=e[t];if(n==null||Object.prototype.hasOwnProperty.call(e,t)||u.resultIsAllowed(n,i.protoAccessControl,t))return n},lookup:function(e,t){for(var n=e.length,r=0;r<n;r++){var a=e[r]&&i.lookupProperty(e[r],t);if(a!=null)return a}},lambda:function(e,t){return typeof e==`function`?e.call(t):e},escapeExpression:a.escapeExpression,invokePartial:r,fn:function(t){var n=e[t];return n.decorator=e[t+`_d`],n},programs:[],program:function(e,t,n,r,i){var a=this.programs[e],o=this.fn(e);return t||i||r||n?a=m(this,e,o,t,n,r,i):a||=this.programs[e]=m(this,e,o),a},data:function(e,t){for(;e&&t--;)e=e._parent;return e},mergeIfNeeded:function(e,t){var n=e||t;return e&&t&&e!==t&&(n=a.extend({},t,e)),n},nullContext:Object.seal({}),noop:t.VM.noop,compilerInfo:e.compiler};function s(t){var n=arguments.length<=1||arguments[1]===void 0?{}:arguments[1],r=n.data;s._setup(n),!n.partial&&e.useData&&(r=S(t,r));var a=void 0,o=e.useBlockParams?[]:void 0;e.useDepths&&(a=n.depths?t==n.depths[0]?n.depths:[t].concat(n.depths):[t]);function c(t){return``+e.main(i,t,i.helpers,i.partials,r,o,a)}return c=C(e.main,c,i,n.depths||[],r,o),c(t,n)}return s.isTop=!0,s._setup=function(r){if(r.partial)i.protoAccessControl=r.protoAccessControl,i.helpers=r.helpers,i.partials=r.partials,i.decorators=r.decorators,i.hooks=r.hooks;else{var o={};w(o,t.helpers,i),w(o,r.helpers,i),i.helpers=o,e.usePartial&&(i.partials=i.mergeIfNeeded(r.partials,t.partials)),(e.usePartial||e.useDecorators)&&(i.decorators=a.extend({},t.decorators,r.decorators)),i.hooks={},i.protoAccessControl=u.createProtoAccessControl(r);var s=r.allowCallsToHelperMissing||n;c.moveHelperToHooks(i,`helperMissing`,s),c.moveHelperToHooks(i,`blockHelperMissing`,s)}},s._child=function(t,n,r,a){if(e.useBlockParams&&!r)throw new o.default(`must pass block params`);if(e.useDepths&&!a)throw new o.default(`must pass parent depths`);return m(i,t,e[t],n,0,r,a)},s}function m(e,t,n,r,i,a,o){function s(t){var i=arguments.length<=1||arguments[1]===void 0?{}:arguments[1],s=o;return o&&t!=o[0]&&(t!==e.nullContext||o[0]!==null)&&(s=[t].concat(o)),n(e,t,e.helpers,e.partials,i.data||r,a&&[i.blockParams].concat(a),s)}return s=C(n,s,e,o,r,a),s.program=t,s.depth=o?o.length:0,s.blockParams=i||0,s}function h(e,t,n){return e?!e.call&&!n.name&&(n.name=e,e=x(n.partials,e)):e=n.name===`@partial-block`?x(n.data,`partial-block`):x(n.partials,n.name),e}function v(e,t,n){var r=x(n.data,`partial-block`);n.partial=!0,n.ids&&(n.data.contextPath=n.ids[0]||n.data.contextPath);var i=void 0;if(n.fn&&n.fn!==b&&(function(){n.data=s.createFrame(n.data);var e=n.fn;i=n.data[`partial-block`]=function(t){var n=arguments.length<=1||arguments[1]===void 0?{}:arguments[1];return n.data=s.createFrame(n.data),n.data[`partial-block`]=r,e(t,n)},e.partials&&(n.partials=a.extend({},n.partials,e.partials))})(),e===void 0&&i&&(e=i),e===void 0)throw new o.default(`The partial `+n.name+` could not be found`);if(e instanceof Function)return e(t,n)}function b(){return``}function x(e,t){if(e&&Object.prototype.hasOwnProperty.call(e,t))return e[t]}function S(e,t){return(!t||!(`root`in t))&&(t=t?s.createFrame(t):{},t.root=e),t}function C(e,t,n,r,i,o){if(e.decorator){var s={};t=e.decorator(t,s,n,r&&r[0],i,o,r),a.extend(t,s)}return t}function w(e,t,n){t&&Object.keys(t).forEach(function(r){var i=t[r];e[r]=T(i,n)})}function T(e,t){var n=t.lookupProperty;return l.wrapHelper(e,function(e){return e.lookupProperty=n,e})}})),x=n(((e,t)=>{e.__esModule=!0,e.default=function(e){(function(){typeof globalThis!=`object`&&(Object.prototype.__defineGetter__(`__magic__`,function(){return this}),__magic__.globalThis=__magic__,delete Object.prototype.__magic__)})();var t=globalThis.Handlebars;e.noConflict=function(){return globalThis.Handlebars===e&&(globalThis.Handlebars=t),e}},t.exports=e.default})),S=n(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}function a(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}var o=a(_()),s=n(v()),c=n(i()),l=a(r()),u=a(b()),d=n(x());function f(){var e=new o.HandlebarsEnvironment;return l.extend(e,o),e.SafeString=s.default,e.Exception=c.default,e.Utils=l,e.escapeExpression=l.escapeExpression,e.VM=u,e.template=function(t){return u.template(t,e)},e}var p=f();p.create=f,d.default(p),p.default=p,e.default=p,t.exports=e.default})),C=n(((e,t)=>{e.__esModule=!0;var n={helpers:{helperExpression:function(e){return e.type===`SubExpression`||(e.type===`MustacheStatement`||e.type===`BlockStatement`)&&!!(e.params&&e.params.length||e.hash)},scopedId:function(e){return/^\.|this\b/.test(e.original)},simpleId:function(e){return e.parts.length===1&&!n.helpers.scopedId(e)&&!e.depth}}};e.default=n,t.exports=e.default})),w=n(((e,t)=>{e.__esModule=!0,e.default=(function(){var e={trace:function(){},yy:{},symbols_:{error:2,root:3,program:4,EOF:5,program_repetition0:6,statement:7,mustache:8,block:9,rawBlock:10,partial:11,partialBlock:12,content:13,COMMENT:14,CONTENT:15,openRawBlock:16,rawBlock_repetition0:17,END_RAW_BLOCK:18,OPEN_RAW_BLOCK:19,helperName:20,openRawBlock_repetition0:21,openRawBlock_option0:22,CLOSE_RAW_BLOCK:23,openBlock:24,block_option0:25,closeBlock:26,openInverse:27,block_option1:28,OPEN_BLOCK:29,openBlock_repetition0:30,openBlock_option0:31,openBlock_option1:32,CLOSE:33,OPEN_INVERSE:34,openInverse_repetition0:35,openInverse_option0:36,openInverse_option1:37,openInverseChain:38,OPEN_INVERSE_CHAIN:39,openInverseChain_repetition0:40,openInverseChain_option0:41,openInverseChain_option1:42,inverseAndProgram:43,INVERSE:44,inverseChain:45,inverseChain_option0:46,OPEN_ENDBLOCK:47,OPEN:48,mustache_repetition0:49,mustache_option0:50,OPEN_UNESCAPED:51,mustache_repetition1:52,mustache_option1:53,CLOSE_UNESCAPED:54,OPEN_PARTIAL:55,partialName:56,partial_repetition0:57,partial_option0:58,openPartialBlock:59,OPEN_PARTIAL_BLOCK:60,openPartialBlock_repetition0:61,openPartialBlock_option0:62,param:63,sexpr:64,OPEN_SEXPR:65,sexpr_repetition0:66,sexpr_option0:67,CLOSE_SEXPR:68,hash:69,hash_repetition_plus0:70,hashSegment:71,ID:72,EQUALS:73,blockParams:74,OPEN_BLOCK_PARAMS:75,blockParams_repetition_plus0:76,CLOSE_BLOCK_PARAMS:77,path:78,dataName:79,STRING:80,NUMBER:81,BOOLEAN:82,UNDEFINED:83,NULL:84,DATA:85,pathSegments:86,SEP:87,$accept:0,$end:1},terminals_:{2:`error`,5:`EOF`,14:`COMMENT`,15:`CONTENT`,18:`END_RAW_BLOCK`,19:`OPEN_RAW_BLOCK`,23:`CLOSE_RAW_BLOCK`,29:`OPEN_BLOCK`,33:`CLOSE`,34:`OPEN_INVERSE`,39:`OPEN_INVERSE_CHAIN`,44:`INVERSE`,47:`OPEN_ENDBLOCK`,48:`OPEN`,51:`OPEN_UNESCAPED`,54:`CLOSE_UNESCAPED`,55:`OPEN_PARTIAL`,60:`OPEN_PARTIAL_BLOCK`,65:`OPEN_SEXPR`,68:`CLOSE_SEXPR`,72:`ID`,73:`EQUALS`,75:`OPEN_BLOCK_PARAMS`,77:`CLOSE_BLOCK_PARAMS`,80:`STRING`,81:`NUMBER`,82:`BOOLEAN`,83:`UNDEFINED`,84:`NULL`,85:`DATA`,87:`SEP`},productions_:[0,[3,2],[4,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[13,1],[10,3],[16,5],[9,4],[9,4],[24,6],[27,6],[38,6],[43,2],[45,3],[45,1],[26,3],[8,5],[8,5],[11,5],[12,3],[59,5],[63,1],[63,1],[64,5],[69,1],[71,3],[74,3],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[56,1],[56,1],[79,2],[78,1],[86,3],[86,1],[6,0],[6,2],[17,0],[17,2],[21,0],[21,2],[22,0],[22,1],[25,0],[25,1],[28,0],[28,1],[30,0],[30,2],[31,0],[31,1],[32,0],[32,1],[35,0],[35,2],[36,0],[36,1],[37,0],[37,1],[40,0],[40,2],[41,0],[41,1],[42,0],[42,1],[46,0],[46,1],[49,0],[49,2],[50,0],[50,1],[52,0],[52,2],[53,0],[53,1],[57,0],[57,2],[58,0],[58,1],[61,0],[61,2],[62,0],[62,1],[66,0],[66,2],[67,0],[67,1],[70,1],[70,2],[76,1],[76,2]],performAction:function(e,t,n,r,i,a,o){var s=a.length-1;switch(i){case 1:return a[s-1];case 2:this.$=r.prepareProgram(a[s]);break;case 3:this.$=a[s];break;case 4:this.$=a[s];break;case 5:this.$=a[s];break;case 6:this.$=a[s];break;case 7:this.$=a[s];break;case 8:this.$=a[s];break;case 9:this.$={type:`CommentStatement`,value:r.stripComment(a[s]),strip:r.stripFlags(a[s],a[s]),loc:r.locInfo(this._$)};break;case 10:this.$={type:`ContentStatement`,original:a[s],value:a[s],loc:r.locInfo(this._$)};break;case 11:this.$=r.prepareRawBlock(a[s-2],a[s-1],a[s],this._$);break;case 12:this.$={path:a[s-3],params:a[s-2],hash:a[s-1]};break;case 13:this.$=r.prepareBlock(a[s-3],a[s-2],a[s-1],a[s],!1,this._$);break;case 14:this.$=r.prepareBlock(a[s-3],a[s-2],a[s-1],a[s],!0,this._$);break;case 15:this.$={open:a[s-5],path:a[s-4],params:a[s-3],hash:a[s-2],blockParams:a[s-1],strip:r.stripFlags(a[s-5],a[s])};break;case 16:this.$={path:a[s-4],params:a[s-3],hash:a[s-2],blockParams:a[s-1],strip:r.stripFlags(a[s-5],a[s])};break;case 17:this.$={path:a[s-4],params:a[s-3],hash:a[s-2],blockParams:a[s-1],strip:r.stripFlags(a[s-5],a[s])};break;case 18:this.$={strip:r.stripFlags(a[s-1],a[s-1]),program:a[s]};break;case 19:var c=r.prepareBlock(a[s-2],a[s-1],a[s],a[s],!1,this._$),l=r.prepareProgram([c],a[s-1].loc);l.chained=!0,this.$={strip:a[s-2].strip,program:l,chain:!0};break;case 20:this.$=a[s];break;case 21:this.$={path:a[s-1],strip:r.stripFlags(a[s-2],a[s])};break;case 22:this.$=r.prepareMustache(a[s-3],a[s-2],a[s-1],a[s-4],r.stripFlags(a[s-4],a[s]),this._$);break;case 23:this.$=r.prepareMustache(a[s-3],a[s-2],a[s-1],a[s-4],r.stripFlags(a[s-4],a[s]),this._$);break;case 24:this.$={type:`PartialStatement`,name:a[s-3],params:a[s-2],hash:a[s-1],indent:``,strip:r.stripFlags(a[s-4],a[s]),loc:r.locInfo(this._$)};break;case 25:this.$=r.preparePartialBlock(a[s-2],a[s-1],a[s],this._$);break;case 26:this.$={path:a[s-3],params:a[s-2],hash:a[s-1],strip:r.stripFlags(a[s-4],a[s])};break;case 27:this.$=a[s];break;case 28:this.$=a[s];break;case 29:this.$={type:`SubExpression`,path:a[s-3],params:a[s-2],hash:a[s-1],loc:r.locInfo(this._$)};break;case 30:this.$={type:`Hash`,pairs:a[s],loc:r.locInfo(this._$)};break;case 31:this.$={type:`HashPair`,key:r.id(a[s-2]),value:a[s],loc:r.locInfo(this._$)};break;case 32:this.$=r.id(a[s-1]);break;case 33:this.$=a[s];break;case 34:this.$=a[s];break;case 35:this.$={type:`StringLiteral`,value:a[s],original:a[s],loc:r.locInfo(this._$)};break;case 36:this.$={type:`NumberLiteral`,value:Number(a[s]),original:Number(a[s]),loc:r.locInfo(this._$)};break;case 37:this.$={type:`BooleanLiteral`,value:a[s]===`true`,original:a[s]===`true`,loc:r.locInfo(this._$)};break;case 38:this.$={type:`UndefinedLiteral`,original:void 0,value:void 0,loc:r.locInfo(this._$)};break;case 39:this.$={type:`NullLiteral`,original:null,value:null,loc:r.locInfo(this._$)};break;case 40:this.$=a[s];break;case 41:this.$=a[s];break;case 42:this.$=r.preparePath(!0,a[s],this._$);break;case 43:this.$=r.preparePath(!1,a[s],this._$);break;case 44:a[s-2].push({part:r.id(a[s]),original:a[s],separator:a[s-1]}),this.$=a[s-2];break;case 45:this.$=[{part:r.id(a[s]),original:a[s]}];break;case 46:this.$=[];break;case 47:a[s-1].push(a[s]);break;case 48:this.$=[];break;case 49:a[s-1].push(a[s]);break;case 50:this.$=[];break;case 51:a[s-1].push(a[s]);break;case 58:this.$=[];break;case 59:a[s-1].push(a[s]);break;case 64:this.$=[];break;case 65:a[s-1].push(a[s]);break;case 70:this.$=[];break;case 71:a[s-1].push(a[s]);break;case 78:this.$=[];break;case 79:a[s-1].push(a[s]);break;case 82:this.$=[];break;case 83:a[s-1].push(a[s]);break;case 86:this.$=[];break;case 87:a[s-1].push(a[s]);break;case 90:this.$=[];break;case 91:a[s-1].push(a[s]);break;case 94:this.$=[];break;case 95:a[s-1].push(a[s]);break;case 98:this.$=[a[s]];break;case 99:a[s-1].push(a[s]);break;case 100:this.$=[a[s]];break;case 101:a[s-1].push(a[s])}},table:[{3:1,4:2,5:[2,46],6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{1:[3]},{5:[1,4]},{5:[2,2],7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:[1,12],15:[1,20],16:17,19:[1,23],24:15,27:16,29:[1,21],34:[1,22],39:[2,2],44:[2,2],47:[2,2],48:[1,13],51:[1,14],55:[1,18],59:19,60:[1,24]},{1:[2,1]},{5:[2,47],14:[2,47],15:[2,47],19:[2,47],29:[2,47],34:[2,47],39:[2,47],44:[2,47],47:[2,47],48:[2,47],51:[2,47],55:[2,47],60:[2,47]},{5:[2,3],14:[2,3],15:[2,3],19:[2,3],29:[2,3],34:[2,3],39:[2,3],44:[2,3],47:[2,3],48:[2,3],51:[2,3],55:[2,3],60:[2,3]},{5:[2,4],14:[2,4],15:[2,4],19:[2,4],29:[2,4],34:[2,4],39:[2,4],44:[2,4],47:[2,4],48:[2,4],51:[2,4],55:[2,4],60:[2,4]},{5:[2,5],14:[2,5],15:[2,5],19:[2,5],29:[2,5],34:[2,5],39:[2,5],44:[2,5],47:[2,5],48:[2,5],51:[2,5],55:[2,5],60:[2,5]},{5:[2,6],14:[2,6],15:[2,6],19:[2,6],29:[2,6],34:[2,6],39:[2,6],44:[2,6],47:[2,6],48:[2,6],51:[2,6],55:[2,6],60:[2,6]},{5:[2,7],14:[2,7],15:[2,7],19:[2,7],29:[2,7],34:[2,7],39:[2,7],44:[2,7],47:[2,7],48:[2,7],51:[2,7],55:[2,7],60:[2,7]},{5:[2,8],14:[2,8],15:[2,8],19:[2,8],29:[2,8],34:[2,8],39:[2,8],44:[2,8],47:[2,8],48:[2,8],51:[2,8],55:[2,8],60:[2,8]},{5:[2,9],14:[2,9],15:[2,9],19:[2,9],29:[2,9],34:[2,9],39:[2,9],44:[2,9],47:[2,9],48:[2,9],51:[2,9],55:[2,9],60:[2,9]},{20:25,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:36,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{4:37,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],39:[2,46],44:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{4:38,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],44:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{15:[2,48],17:39,18:[2,48]},{20:41,56:40,64:42,65:[1,43],72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{4:44,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{5:[2,10],14:[2,10],15:[2,10],18:[2,10],19:[2,10],29:[2,10],34:[2,10],39:[2,10],44:[2,10],47:[2,10],48:[2,10],51:[2,10],55:[2,10],60:[2,10]},{20:45,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:46,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:47,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:41,56:48,64:42,65:[1,43],72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{33:[2,78],49:49,65:[2,78],72:[2,78],80:[2,78],81:[2,78],82:[2,78],83:[2,78],84:[2,78],85:[2,78]},{23:[2,33],33:[2,33],54:[2,33],65:[2,33],68:[2,33],72:[2,33],75:[2,33],80:[2,33],81:[2,33],82:[2,33],83:[2,33],84:[2,33],85:[2,33]},{23:[2,34],33:[2,34],54:[2,34],65:[2,34],68:[2,34],72:[2,34],75:[2,34],80:[2,34],81:[2,34],82:[2,34],83:[2,34],84:[2,34],85:[2,34]},{23:[2,35],33:[2,35],54:[2,35],65:[2,35],68:[2,35],72:[2,35],75:[2,35],80:[2,35],81:[2,35],82:[2,35],83:[2,35],84:[2,35],85:[2,35]},{23:[2,36],33:[2,36],54:[2,36],65:[2,36],68:[2,36],72:[2,36],75:[2,36],80:[2,36],81:[2,36],82:[2,36],83:[2,36],84:[2,36],85:[2,36]},{23:[2,37],33:[2,37],54:[2,37],65:[2,37],68:[2,37],72:[2,37],75:[2,37],80:[2,37],81:[2,37],82:[2,37],83:[2,37],84:[2,37],85:[2,37]},{23:[2,38],33:[2,38],54:[2,38],65:[2,38],68:[2,38],72:[2,38],75:[2,38],80:[2,38],81:[2,38],82:[2,38],83:[2,38],84:[2,38],85:[2,38]},{23:[2,39],33:[2,39],54:[2,39],65:[2,39],68:[2,39],72:[2,39],75:[2,39],80:[2,39],81:[2,39],82:[2,39],83:[2,39],84:[2,39],85:[2,39]},{23:[2,43],33:[2,43],54:[2,43],65:[2,43],68:[2,43],72:[2,43],75:[2,43],80:[2,43],81:[2,43],82:[2,43],83:[2,43],84:[2,43],85:[2,43],87:[1,50]},{72:[1,35],86:51},{23:[2,45],33:[2,45],54:[2,45],65:[2,45],68:[2,45],72:[2,45],75:[2,45],80:[2,45],81:[2,45],82:[2,45],83:[2,45],84:[2,45],85:[2,45],87:[2,45]},{52:52,54:[2,82],65:[2,82],72:[2,82],80:[2,82],81:[2,82],82:[2,82],83:[2,82],84:[2,82],85:[2,82]},{25:53,38:55,39:[1,57],43:56,44:[1,58],45:54,47:[2,54]},{28:59,43:60,44:[1,58],47:[2,56]},{13:62,15:[1,20],18:[1,61]},{33:[2,86],57:63,65:[2,86],72:[2,86],80:[2,86],81:[2,86],82:[2,86],83:[2,86],84:[2,86],85:[2,86]},{33:[2,40],65:[2,40],72:[2,40],80:[2,40],81:[2,40],82:[2,40],83:[2,40],84:[2,40],85:[2,40]},{33:[2,41],65:[2,41],72:[2,41],80:[2,41],81:[2,41],82:[2,41],83:[2,41],84:[2,41],85:[2,41]},{20:64,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{26:65,47:[1,66]},{30:67,33:[2,58],65:[2,58],72:[2,58],75:[2,58],80:[2,58],81:[2,58],82:[2,58],83:[2,58],84:[2,58],85:[2,58]},{33:[2,64],35:68,65:[2,64],72:[2,64],75:[2,64],80:[2,64],81:[2,64],82:[2,64],83:[2,64],84:[2,64],85:[2,64]},{21:69,23:[2,50],65:[2,50],72:[2,50],80:[2,50],81:[2,50],82:[2,50],83:[2,50],84:[2,50],85:[2,50]},{33:[2,90],61:70,65:[2,90],72:[2,90],80:[2,90],81:[2,90],82:[2,90],83:[2,90],84:[2,90],85:[2,90]},{20:74,33:[2,80],50:71,63:72,64:75,65:[1,43],69:73,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{72:[1,79]},{23:[2,42],33:[2,42],54:[2,42],65:[2,42],68:[2,42],72:[2,42],75:[2,42],80:[2,42],81:[2,42],82:[2,42],83:[2,42],84:[2,42],85:[2,42],87:[1,50]},{20:74,53:80,54:[2,84],63:81,64:75,65:[1,43],69:82,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{26:83,47:[1,66]},{47:[2,55]},{4:84,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],39:[2,46],44:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{47:[2,20]},{20:85,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{4:86,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{26:87,47:[1,66]},{47:[2,57]},{5:[2,11],14:[2,11],15:[2,11],19:[2,11],29:[2,11],34:[2,11],39:[2,11],44:[2,11],47:[2,11],48:[2,11],51:[2,11],55:[2,11],60:[2,11]},{15:[2,49],18:[2,49]},{20:74,33:[2,88],58:88,63:89,64:75,65:[1,43],69:90,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{65:[2,94],66:91,68:[2,94],72:[2,94],80:[2,94],81:[2,94],82:[2,94],83:[2,94],84:[2,94],85:[2,94]},{5:[2,25],14:[2,25],15:[2,25],19:[2,25],29:[2,25],34:[2,25],39:[2,25],44:[2,25],47:[2,25],48:[2,25],51:[2,25],55:[2,25],60:[2,25]},{20:92,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:74,31:93,33:[2,60],63:94,64:75,65:[1,43],69:95,70:76,71:77,72:[1,78],75:[2,60],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:74,33:[2,66],36:96,63:97,64:75,65:[1,43],69:98,70:76,71:77,72:[1,78],75:[2,66],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:74,22:99,23:[2,52],63:100,64:75,65:[1,43],69:101,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:74,33:[2,92],62:102,63:103,64:75,65:[1,43],69:104,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{33:[1,105]},{33:[2,79],65:[2,79],72:[2,79],80:[2,79],81:[2,79],82:[2,79],83:[2,79],84:[2,79],85:[2,79]},{33:[2,81]},{23:[2,27],33:[2,27],54:[2,27],65:[2,27],68:[2,27],72:[2,27],75:[2,27],80:[2,27],81:[2,27],82:[2,27],83:[2,27],84:[2,27],85:[2,27]},{23:[2,28],33:[2,28],54:[2,28],65:[2,28],68:[2,28],72:[2,28],75:[2,28],80:[2,28],81:[2,28],82:[2,28],83:[2,28],84:[2,28],85:[2,28]},{23:[2,30],33:[2,30],54:[2,30],68:[2,30],71:106,72:[1,107],75:[2,30]},{23:[2,98],33:[2,98],54:[2,98],68:[2,98],72:[2,98],75:[2,98]},{23:[2,45],33:[2,45],54:[2,45],65:[2,45],68:[2,45],72:[2,45],73:[1,108],75:[2,45],80:[2,45],81:[2,45],82:[2,45],83:[2,45],84:[2,45],85:[2,45],87:[2,45]},{23:[2,44],33:[2,44],54:[2,44],65:[2,44],68:[2,44],72:[2,44],75:[2,44],80:[2,44],81:[2,44],82:[2,44],83:[2,44],84:[2,44],85:[2,44],87:[2,44]},{54:[1,109]},{54:[2,83],65:[2,83],72:[2,83],80:[2,83],81:[2,83],82:[2,83],83:[2,83],84:[2,83],85:[2,83]},{54:[2,85]},{5:[2,13],14:[2,13],15:[2,13],19:[2,13],29:[2,13],34:[2,13],39:[2,13],44:[2,13],47:[2,13],48:[2,13],51:[2,13],55:[2,13],60:[2,13]},{38:55,39:[1,57],43:56,44:[1,58],45:111,46:110,47:[2,76]},{33:[2,70],40:112,65:[2,70],72:[2,70],75:[2,70],80:[2,70],81:[2,70],82:[2,70],83:[2,70],84:[2,70],85:[2,70]},{47:[2,18]},{5:[2,14],14:[2,14],15:[2,14],19:[2,14],29:[2,14],34:[2,14],39:[2,14],44:[2,14],47:[2,14],48:[2,14],51:[2,14],55:[2,14],60:[2,14]},{33:[1,113]},{33:[2,87],65:[2,87],72:[2,87],80:[2,87],81:[2,87],82:[2,87],83:[2,87],84:[2,87],85:[2,87]},{33:[2,89]},{20:74,63:115,64:75,65:[1,43],67:114,68:[2,96],69:116,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{33:[1,117]},{32:118,33:[2,62],74:119,75:[1,120]},{33:[2,59],65:[2,59],72:[2,59],75:[2,59],80:[2,59],81:[2,59],82:[2,59],83:[2,59],84:[2,59],85:[2,59]},{33:[2,61],75:[2,61]},{33:[2,68],37:121,74:122,75:[1,120]},{33:[2,65],65:[2,65],72:[2,65],75:[2,65],80:[2,65],81:[2,65],82:[2,65],83:[2,65],84:[2,65],85:[2,65]},{33:[2,67],75:[2,67]},{23:[1,123]},{23:[2,51],65:[2,51],72:[2,51],80:[2,51],81:[2,51],82:[2,51],83:[2,51],84:[2,51],85:[2,51]},{23:[2,53]},{33:[1,124]},{33:[2,91],65:[2,91],72:[2,91],80:[2,91],81:[2,91],82:[2,91],83:[2,91],84:[2,91],85:[2,91]},{33:[2,93]},{5:[2,22],14:[2,22],15:[2,22],19:[2,22],29:[2,22],34:[2,22],39:[2,22],44:[2,22],47:[2,22],48:[2,22],51:[2,22],55:[2,22],60:[2,22]},{23:[2,99],33:[2,99],54:[2,99],68:[2,99],72:[2,99],75:[2,99]},{73:[1,108]},{20:74,63:125,64:75,65:[1,43],72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{5:[2,23],14:[2,23],15:[2,23],19:[2,23],29:[2,23],34:[2,23],39:[2,23],44:[2,23],47:[2,23],48:[2,23],51:[2,23],55:[2,23],60:[2,23]},{47:[2,19]},{47:[2,77]},{20:74,33:[2,72],41:126,63:127,64:75,65:[1,43],69:128,70:76,71:77,72:[1,78],75:[2,72],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{5:[2,24],14:[2,24],15:[2,24],19:[2,24],29:[2,24],34:[2,24],39:[2,24],44:[2,24],47:[2,24],48:[2,24],51:[2,24],55:[2,24],60:[2,24]},{68:[1,129]},{65:[2,95],68:[2,95],72:[2,95],80:[2,95],81:[2,95],82:[2,95],83:[2,95],84:[2,95],85:[2,95]},{68:[2,97]},{5:[2,21],14:[2,21],15:[2,21],19:[2,21],29:[2,21],34:[2,21],39:[2,21],44:[2,21],47:[2,21],48:[2,21],51:[2,21],55:[2,21],60:[2,21]},{33:[1,130]},{33:[2,63]},{72:[1,132],76:131},{33:[1,133]},{33:[2,69]},{15:[2,12],18:[2,12]},{14:[2,26],15:[2,26],19:[2,26],29:[2,26],34:[2,26],47:[2,26],48:[2,26],51:[2,26],55:[2,26],60:[2,26]},{23:[2,31],33:[2,31],54:[2,31],68:[2,31],72:[2,31],75:[2,31]},{33:[2,74],42:134,74:135,75:[1,120]},{33:[2,71],65:[2,71],72:[2,71],75:[2,71],80:[2,71],81:[2,71],82:[2,71],83:[2,71],84:[2,71],85:[2,71]},{33:[2,73],75:[2,73]},{23:[2,29],33:[2,29],54:[2,29],65:[2,29],68:[2,29],72:[2,29],75:[2,29],80:[2,29],81:[2,29],82:[2,29],83:[2,29],84:[2,29],85:[2,29]},{14:[2,15],15:[2,15],19:[2,15],29:[2,15],34:[2,15],39:[2,15],44:[2,15],47:[2,15],48:[2,15],51:[2,15],55:[2,15],60:[2,15]},{72:[1,137],77:[1,136]},{72:[2,100],77:[2,100]},{14:[2,16],15:[2,16],19:[2,16],29:[2,16],34:[2,16],44:[2,16],47:[2,16],48:[2,16],51:[2,16],55:[2,16],60:[2,16]},{33:[1,138]},{33:[2,75]},{33:[2,32]},{72:[2,101],77:[2,101]},{14:[2,17],15:[2,17],19:[2,17],29:[2,17],34:[2,17],39:[2,17],44:[2,17],47:[2,17],48:[2,17],51:[2,17],55:[2,17],60:[2,17]}],defaultActions:{4:[2,1],54:[2,55],56:[2,20],60:[2,57],73:[2,81],82:[2,85],86:[2,18],90:[2,89],101:[2,53],104:[2,93],110:[2,19],111:[2,77],116:[2,97],119:[2,63],122:[2,69],135:[2,75],136:[2,32]},parseError:function(e,t){throw Error(e)},parse:function(e){var t=this,n=[0],r=[null],i=[],a=this.table,o=``,s=0,c=0,l=0;this.lexer.setInput(e),this.lexer.yy=this.yy,this.yy.lexer=this.lexer,this.yy.parser=this,this.lexer.yylloc===void 0&&(this.lexer.yylloc={});var u=this.lexer.yylloc;i.push(u);var d=this.lexer.options&&this.lexer.options.ranges;typeof this.yy.parseError==`function`&&(this.parseError=this.yy.parseError);function f(){var e=t.lexer.lex()||1;return typeof e!=`number`&&(e=t.symbols_[e]||e),e}for(var p,m,h,g,_,v={},y,b,x,S;;){if(h=n[n.length-1],this.defaultActions[h]?g=this.defaultActions[h]:(p??=f(),g=a[h]&&a[h][p]),g===void 0||!g.length||!g[0]){var C=``;if(!l){for(y in S=[],a[h])this.terminals_[y]&&y>2&&S.push(`'`+this.terminals_[y]+`'`);C=this.lexer.showPosition?`Parse error on line `+(s+1)+`:
`+this.lexer.showPosition()+`
Expecting `+S.join(`, `)+`, got '`+(this.terminals_[p]||p)+`'`:`Parse error on line `+(s+1)+`: Unexpected `+(p==1?`end of input`:`'`+(this.terminals_[p]||p)+`'`),this.parseError(C,{text:this.lexer.match,token:this.terminals_[p]||p,line:this.lexer.yylineno,loc:u,expected:S})}}if(g[0]instanceof Array&&g.length>1)throw Error(`Parse Error: multiple actions possible at state: `+h+`, token: `+p);switch(g[0]){case 1:n.push(p),r.push(this.lexer.yytext),i.push(this.lexer.yylloc),n.push(g[1]),p=null,m?(p=m,m=null):(c=this.lexer.yyleng,o=this.lexer.yytext,s=this.lexer.yylineno,u=this.lexer.yylloc,l>0&&l--);break;case 2:if(b=this.productions_[g[1]][1],v.$=r[r.length-b],v._$={first_line:i[i.length-(b||1)].first_line,last_line:i[i.length-1].last_line,first_column:i[i.length-(b||1)].first_column,last_column:i[i.length-1].last_column},d&&(v._$.range=[i[i.length-(b||1)].range[0],i[i.length-1].range[1]]),_=this.performAction.call(v,o,c,s,this.yy,g[1],r,i),_!==void 0)return _;b&&(n=n.slice(0,-1*b*2),r=r.slice(0,-1*b),i=i.slice(0,-1*b)),n.push(this.productions_[g[1]][0]),r.push(v.$),i.push(v._$),x=a[n[n.length-2]][n[n.length-1]],n.push(x);break;case 3:return!0}}return!0}};e.lexer=(function(){var e={EOF:1,parseError:function(e,t){if(this.yy.parser)this.yy.parser.parseError(e,t);else throw Error(e)},setInput:function(e){return this._input=e,this._more=this._less=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match=``,this.conditionStack=[`INITIAL`],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var e=this._input[0];return this.yytext+=e,this.yyleng++,this.offset++,this.match+=e,this.matched+=e,e.match(/(?:\r\n?|\n).*/g)?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),e},unput:function(e){var t=e.length,n=e.split(/(?:\r\n?|\n)/g);this._input=e+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-t-1),this.offset-=t;var r=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),n.length-1&&(this.yylineno-=n.length-1);var i=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:n?(n.length===r.length?this.yylloc.first_column:0)+r[r.length-n.length].length-n[0].length:this.yylloc.first_column-t},this.options.ranges&&(this.yylloc.range=[i[0],i[0]+this.yyleng-t]),this},more:function(){return this._more=!0,this},less:function(e){this.unput(this.match.slice(e))},pastInput:function(){var e=this.matched.substr(0,this.matched.length-this.match.length);return(e.length>20?`...`:``)+e.substr(-20).replace(/\n/g,``)},upcomingInput:function(){var e=this.match;return e.length<20&&(e+=this._input.substr(0,20-e.length)),(e.substr(0,20)+(e.length>20?`...`:``)).replace(/\n/g,``)},showPosition:function(){var e=this.pastInput(),t=Array(e.length+1).join(`-`);return e+this.upcomingInput()+`
`+t+`^`},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var e,t,n,r,i;this._more||(this.yytext=``,this.match=``);for(var a=this._currentRules(),o=0;o<a.length&&(n=this._input.match(this.rules[a[o]]),!(n&&(!t||n[0].length>t[0].length)&&(t=n,r=o,!this.options.flex)));o++);return t?(i=t[0].match(/(?:\r\n?|\n).*/g),i&&(this.yylineno+=i.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:i?i[i.length-1].length-i[i.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+t[0].length},this.yytext+=t[0],this.match+=t[0],this.matches=t,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._input=this._input.slice(t[0].length),this.matched+=t[0],e=this.performAction.call(this,this.yy,this,a[r],this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),e||void 0):this._input===``?this.EOF:this.parseError(`Lexical error on line `+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:``,token:null,line:this.yylineno})},lex:function(){var e=this.next();return e===void 0?this.lex():e},begin:function(e){this.conditionStack.push(e)},popState:function(){return this.conditionStack.pop()},_currentRules:function(){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules},topState:function(){return this.conditionStack[this.conditionStack.length-2]},pushState:function(e){this.begin(e)}};return e.options={},e.performAction=function(e,t,n,r){function i(e,n){return t.yytext=t.yytext.substring(e,t.yyleng-n+e)}switch(n){case 0:if(t.yytext.slice(-2)===`\\\\`?(i(0,1),this.begin(`mu`)):t.yytext.slice(-1)===`\\`?(i(0,1),this.begin(`emu`)):this.begin(`mu`),t.yytext)return 15;break;case 1:return 15;case 2:return this.popState(),15;case 3:return this.begin(`raw`),15;case 4:return this.popState(),this.conditionStack[this.conditionStack.length-1]===`raw`?15:(i(5,9),`END_RAW_BLOCK`);case 5:return 15;case 6:return this.popState(),14;case 7:return 65;case 8:return 68;case 9:return 19;case 10:return this.popState(),this.begin(`raw`),23;case 11:return 55;case 12:return 60;case 13:return 29;case 14:return 47;case 15:return this.popState(),44;case 16:return this.popState(),44;case 17:return 34;case 18:return 39;case 19:return 51;case 20:return 48;case 21:this.unput(t.yytext),this.popState(),this.begin(`com`);break;case 22:return this.popState(),14;case 23:return 48;case 24:return 73;case 25:return 72;case 26:return 72;case 27:return 87;case 28:break;case 29:return this.popState(),54;case 30:return this.popState(),33;case 31:return t.yytext=i(1,2).replace(/\\"/g,`"`),80;case 32:return t.yytext=i(1,2).replace(/\\'/g,`'`),80;case 33:return 85;case 34:return 82;case 35:return 82;case 36:return 83;case 37:return 84;case 38:return 81;case 39:return 75;case 40:return 77;case 41:return 72;case 42:return t.yytext=t.yytext.replace(/\\([\\\]])/g,`$1`),72;case 43:return`INVALID`;case 44:return 5}},e.rules=[/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/,/^(?:\{\{\{\{(?=[^\/]))/,/^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/,/^(?:[^\x00]+?(?=(\{\{\{\{)))/,/^(?:[\s\S]*?--(~)?\}\})/,/^(?:\()/,/^(?:\))/,/^(?:\{\{\{\{)/,/^(?:\}\}\}\})/,/^(?:\{\{(~)?>)/,/^(?:\{\{(~)?#>)/,/^(?:\{\{(~)?#\*?)/,/^(?:\{\{(~)?\/)/,/^(?:\{\{(~)?\^\s*(~)?\}\})/,/^(?:\{\{(~)?\s*else\s*(~)?\}\})/,/^(?:\{\{(~)?\^)/,/^(?:\{\{(~)?\s*else\b)/,/^(?:\{\{(~)?\{)/,/^(?:\{\{(~)?&)/,/^(?:\{\{(~)?!--)/,/^(?:\{\{(~)?![\s\S]*?\}\})/,/^(?:\{\{(~)?\*?)/,/^(?:=)/,/^(?:\.\.)/,/^(?:\.(?=([=~}\s\/.)|])))/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}(~)?\}\})/,/^(?:(~)?\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@)/,/^(?:true(?=([~}\s)])))/,/^(?:false(?=([~}\s)])))/,/^(?:undefined(?=([~}\s)])))/,/^(?:null(?=([~}\s)])))/,/^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/,/^(?:as\s+\|)/,/^(?:\|)/,/^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/,/^(?:\[(\\\]|[^\]])*\])/,/^(?:.)/,/^(?:$)/],e.conditions={mu:{rules:[7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44],inclusive:!1},emu:{rules:[2],inclusive:!1},com:{rules:[6],inclusive:!1},raw:{rules:[3,4,5],inclusive:!1},INITIAL:{rules:[0,1,44],inclusive:!0}},e})();function t(){this.yy={}}return t.prototype=e,e.Parser=t,new t})(),t.exports=e.default})),T=n(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var r=n(i());function a(){this.parents=[]}a.prototype={constructor:a,mutating:!1,acceptKey:function(e,t){var n=this.accept(e[t]);if(this.mutating){if(n&&!a.prototype[n.type])throw new r.default(`Unexpected node type "`+n.type+`" found when accepting `+t+` on `+e.type);e[t]=n}},acceptRequired:function(e,t){if(this.acceptKey(e,t),!e[t])throw new r.default(e.type+` requires `+t)},acceptArray:function(e){for(var t=0,n=e.length;t<n;t++)this.acceptKey(e,t),e[t]||(e.splice(t,1),t--,n--)},accept:function(e){if(e){if(!this[e.type])throw new r.default(`Unknown type: `+e.type,e);this.current&&this.parents.unshift(this.current),this.current=e;var t=this[e.type](e);if(this.current=this.parents.shift(),!this.mutating||t)return t;if(t!==!1)return e}},Program:function(e){this.acceptArray(e.body)},MustacheStatement:o,Decorator:o,BlockStatement:s,DecoratorBlock:s,PartialStatement:c,PartialBlockStatement:function(e){c.call(this,e),this.acceptKey(e,`program`)},ContentStatement:function(){},CommentStatement:function(){},SubExpression:o,PathExpression:function(){},StringLiteral:function(){},NumberLiteral:function(){},BooleanLiteral:function(){},UndefinedLiteral:function(){},NullLiteral:function(){},Hash:function(e){this.acceptArray(e.pairs)},HashPair:function(e){this.acceptRequired(e,`value`)}};function o(e){this.acceptRequired(e,`path`),this.acceptArray(e.params),this.acceptKey(e,`hash`)}function s(e){o.call(this,e),this.acceptKey(e,`program`),this.acceptKey(e,`inverse`)}function c(e){this.acceptRequired(e,`name`),this.acceptArray(e.params),this.acceptKey(e,`hash`)}e.default=a,t.exports=e.default})),ee=n(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var r=n(T());function i(){var e=arguments.length<=0||arguments[0]===void 0?{}:arguments[0];this.options=e}i.prototype=new r.default,i.prototype.Program=function(e){var t=!this.options.ignoreStandalone,n=!this.isRootSeen;this.isRootSeen=!0;for(var r=e.body,i=0,l=r.length;i<l;i++){var u=r[i],d=this.accept(u);if(d){var f=a(r,i,n),p=o(r,i,n),m=d.openStandalone&&f,h=d.closeStandalone&&p,g=d.inlineStandalone&&f&&p;d.close&&s(r,i,!0),d.open&&c(r,i,!0),t&&g&&(s(r,i),c(r,i)&&u.type===`PartialStatement`&&(u.indent=/([ \t]+$)/.exec(r[i-1].original)[1])),t&&m&&(s((u.program||u.inverse).body),c(r,i)),t&&h&&(s(r,i),c((u.inverse||u.program).body))}}return e},i.prototype.BlockStatement=i.prototype.DecoratorBlock=i.prototype.PartialBlockStatement=function(e){this.accept(e.program),this.accept(e.inverse);var t=e.program||e.inverse,n=e.program&&e.inverse,r=n,i=n;if(n&&n.chained)for(r=n.body[0].program;i.chained;)i=i.body[i.body.length-1].program;var l={open:e.openStrip.open,close:e.closeStrip.close,openStandalone:o(t.body),closeStandalone:a((r||t).body)};if(e.openStrip.close&&s(t.body,null,!0),n){var u=e.inverseStrip;u.open&&c(t.body,null,!0),u.close&&s(r.body,null,!0),e.closeStrip.open&&c(i.body,null,!0),!this.options.ignoreStandalone&&a(t.body)&&o(r.body)&&(c(t.body),s(r.body))}else e.closeStrip.open&&c(t.body,null,!0);return l},i.prototype.Decorator=i.prototype.MustacheStatement=function(e){return e.strip},i.prototype.PartialStatement=i.prototype.CommentStatement=function(e){var t=e.strip||{};return{inlineStandalone:!0,open:t.open,close:t.close}};function a(e,t,n){t===void 0&&(t=e.length);var r=e[t-1],i=e[t-2];if(!r)return n;if(r.type===`ContentStatement`)return(i||!n?/\r?\n\s*?$/:/(^|\r?\n)\s*?$/).test(r.original)}function o(e,t,n){t===void 0&&(t=-1);var r=e[t+1],i=e[t+2];if(!r)return n;if(r.type===`ContentStatement`)return(i||!n?/^\s*?\r?\n/:/^\s*?(\r?\n|$)/).test(r.original)}function s(e,t,n){var r=e[t==null?0:t+1];if(!(!r||r.type!==`ContentStatement`||!n&&r.rightStripped)){var i=r.value;r.value=r.value.replace(n?/^\s+/:/^[ \t]*\r?\n?/,``),r.rightStripped=r.value!==i}}function c(e,t,n){var r=e[t==null?e.length-1:t-1];if(!(!r||r.type!==`ContentStatement`||!n&&r.leftStripped)){var i=r.value;return r.value=r.value.replace(n?/\s+$/:/[ \t]+$/,``),r.leftStripped=r.value!==i,r.leftStripped}}e.default=i,t.exports=e.default})),te=n((e=>{e.__esModule=!0,e.SourceLocation=a,e.id=o,e.stripFlags=s,e.stripComment=c,e.preparePath=l,e.prepareMustache=u,e.prepareRawBlock=d,e.prepareBlock=f,e.prepareProgram=p,e.preparePartialBlock=m;function t(e){return e&&e.__esModule?e:{default:e}}var n=t(i());function r(e,t){if(t=t.path?t.path.original:t,e.path.original!==t){var r={loc:e.path.loc};throw new n.default(e.path.original+` doesn't match `+t,r)}}function a(e,t){this.source=e,this.start={line:t.first_line,column:t.first_column},this.end={line:t.last_line,column:t.last_column}}function o(e){return/^\[.*\]$/.test(e)?e.substring(1,e.length-1):e}function s(e,t){return{open:e.charAt(2)===`~`,close:t.charAt(t.length-3)===`~`}}function c(e){return e.replace(/^\{\{~?!-?-?/,``).replace(/-?-?~?\}\}$/,``)}function l(e,t,r){r=this.locInfo(r);for(var i=e?`@`:``,a=[],o=0,s=0,c=t.length;s<c;s++){var l=t[s].part,u=t[s].original!==l;if(i+=(t[s].separator||``)+l,!u&&(l===`..`||l===`.`||l===`this`)){if(a.length>0)throw new n.default(`Invalid path: `+i,{loc:r});l===`..`&&o++}else a.push(l)}return{type:`PathExpression`,data:e,depth:o,parts:a,original:i,loc:r}}function u(e,t,n,r,i,a){var o=r.charAt(3)||r.charAt(2),s=o!==`{`&&o!==`&`;return{type:/\*/.test(r)?`Decorator`:`MustacheStatement`,path:e,params:t,hash:n,escaped:s,strip:i,loc:this.locInfo(a)}}function d(e,t,n,i){r(e,n),i=this.locInfo(i);var a={type:`Program`,body:t,strip:{},loc:i};return{type:`BlockStatement`,path:e.path,params:e.params,hash:e.hash,program:a,openStrip:{},inverseStrip:{},closeStrip:{},loc:i}}function f(e,t,i,a,o,s){a&&a.path&&r(e,a);var c=/\*/.test(e.open);t.blockParams=e.blockParams;var l=void 0,u=void 0;if(i){if(c)throw new n.default(`Unexpected inverse block on decorator`,i);i.chain&&(i.program.body[0].closeStrip=a.strip),u=i.strip,l=i.program}return o&&(o=l,l=t,t=o),{type:c?`DecoratorBlock`:`BlockStatement`,path:e.path,params:e.params,hash:e.hash,program:t,inverse:l,openStrip:e.strip,inverseStrip:u,closeStrip:a&&a.strip,loc:this.locInfo(s)}}function p(e,t){if(!t&&e.length){var n=e[0].loc,r=e[e.length-1].loc;n&&r&&(t={source:n.source,start:{line:n.start.line,column:n.start.column},end:{line:r.end.line,column:r.end.column}})}return{type:`Program`,body:e,strip:{},loc:t}}function m(e,t,n,i){return r(e,n),{type:`PartialBlockStatement`,name:e.path,params:e.params,hash:e.hash,program:t,openStrip:e.strip,closeStrip:n&&n.strip,loc:this.locInfo(i)}}})),ne=n((e=>{e.__esModule=!0,e.parseWithoutProcessing=d,e.parse=f;function t(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function n(e){return e&&e.__esModule?e:{default:e}}var a=n(w()),o=n(ee()),s=t(te()),c=n(i()),l=r();e.parser=a.default;var u={};l.extend(u,s);function d(e,t){return e.type===`Program`?(p(e),e):(a.default.yy=u,u.locInfo=function(e){return new u.SourceLocation(t&&t.srcName,e)},a.default.parse(e))}function f(e,t){var n=d(e,t);return new o.default(t).accept(n)}function p(e){m(e)}function m(e){if(e!=null){if(Array.isArray(e)){e.forEach(m);return}if(typeof e==`object`){if(e.type===`PathExpression`){if(!h(e.depth))throw new c.default(`Invalid AST: PathExpression.depth must be an integer`);if(!Array.isArray(e.parts))throw new c.default(`Invalid AST: PathExpression.parts must be an array`);for(var t=0;t<e.parts.length;t++)if(typeof e.parts[t]!=`string`)throw new c.default(`Invalid AST: PathExpression.parts must only contain strings`)}else if(e.type===`NumberLiteral`){if(typeof e.value!=`number`||!isFinite(e.value))throw new c.default(`Invalid AST: NumberLiteral.value must be a number`)}else if(e.type===`BooleanLiteral`&&typeof e.value!=`boolean`)throw new c.default(`Invalid AST: BooleanLiteral.value must be a boolean`);Object.keys(e).forEach(function(t){t!==`loc`&&m(e[t])})}}}function h(e){return typeof e==`number`&&isFinite(e)&&Math.floor(e)===e&&e>=0}})),re=n((e=>{e.__esModule=!0,e.Compiler=c,e.precompile=l,e.compile=u;function t(e){return e&&e.__esModule?e:{default:e}}var n=t(i()),a=r(),o=t(C()),s=[].slice;function c(){}c.prototype={compiler:c,equals:function(e){var t=this.opcodes.length;if(e.opcodes.length!==t)return!1;for(var n=0;n<t;n++){var r=this.opcodes[n],i=e.opcodes[n];if(r.opcode!==i.opcode||!d(r.args,i.args))return!1}t=this.children.length;for(var n=0;n<t;n++)if(!this.children[n].equals(e.children[n]))return!1;return!0},guid:0,compile:function(e,t){return this.sourceNode=[],this.opcodes=[],this.children=[],this.options=t,this.stringParams=t.stringParams,this.trackIds=t.trackIds,t.blockParams=t.blockParams||[],t.knownHelpers=a.extend(Object.create(null),{helperMissing:!0,blockHelperMissing:!0,each:!0,if:!0,unless:!0,with:!0,log:!0,lookup:!0},t.knownHelpers),this.accept(e)},compileProgram:function(e){var t=new this.compiler().compile(e,this.options),n=this.guid++;return this.usePartial=this.usePartial||t.usePartial,this.children[n]=t,this.useDepths=this.useDepths||t.useDepths,n},accept:function(e){if(!this[e.type])throw new n.default(`Unknown type: `+e.type,e);this.sourceNode.unshift(e);var t=this[e.type](e);return this.sourceNode.shift(),t},Program:function(e){this.options.blockParams.unshift(e.blockParams);for(var t=e.body,n=t.length,r=0;r<n;r++)this.accept(t[r]);return this.options.blockParams.shift(),this.isSimple=n===1,this.blockParams=e.blockParams?e.blockParams.length:0,this},BlockStatement:function(e){f(e);var t=e.program,n=e.inverse;t&&=this.compileProgram(t),n&&=this.compileProgram(n);var r=this.classifySexpr(e);r===`helper`?this.helperSexpr(e,t,n):r===`simple`?(this.simpleSexpr(e),this.opcode(`pushProgram`,t),this.opcode(`pushProgram`,n),this.opcode(`emptyHash`),this.opcode(`blockValue`,e.path.original)):(this.ambiguousSexpr(e,t,n),this.opcode(`pushProgram`,t),this.opcode(`pushProgram`,n),this.opcode(`emptyHash`),this.opcode(`ambiguousBlockValue`)),this.opcode(`append`)},DecoratorBlock:function(e){var t=e.program&&this.compileProgram(e.program),n=this.setupFullMustacheParams(e,t,void 0),r=e.path;this.useDecorators=!0,this.opcode(`registerDecorator`,n.length,r.original)},PartialStatement:function(e){this.usePartial=!0;var t=e.program;t&&=this.compileProgram(e.program);var r=e.params;if(r.length>1)throw new n.default(`Unsupported number of partial arguments: `+r.length,e);r.length||(this.options.explicitPartialContext?this.opcode(`pushLiteral`,`undefined`):r.push({type:`PathExpression`,parts:[],depth:0}));var i=e.name.original,a=e.name.type===`SubExpression`;a&&this.accept(e.name),this.setupFullMustacheParams(e,t,void 0,!0);var o=e.indent||``;this.options.preventIndent&&o&&(this.opcode(`appendContent`,o),o=``),this.opcode(`invokePartial`,a,i,o),this.opcode(`append`)},PartialBlockStatement:function(e){this.PartialStatement(e)},MustacheStatement:function(e){this.SubExpression(e),e.escaped&&!this.options.noEscape?this.opcode(`appendEscaped`):this.opcode(`append`)},Decorator:function(e){this.DecoratorBlock(e)},ContentStatement:function(e){e.value&&this.opcode(`appendContent`,e.value)},CommentStatement:function(){},SubExpression:function(e){f(e);var t=this.classifySexpr(e);t===`simple`?this.simpleSexpr(e):t===`helper`?this.helperSexpr(e):this.ambiguousSexpr(e)},ambiguousSexpr:function(e,t,n){var r=e.path,i=r.parts[0],a=t!=null||n!=null;this.opcode(`getContext`,r.depth),this.opcode(`pushProgram`,t),this.opcode(`pushProgram`,n),r.strict=!0,this.accept(r),this.opcode(`invokeAmbiguous`,i,a)},simpleSexpr:function(e){var t=e.path;t.strict=!0,this.accept(t),this.opcode(`resolvePossibleLambda`)},helperSexpr:function(e,t,r){var i=this.setupFullMustacheParams(e,t,r),a=e.path,s=a.parts[0];if(this.options.knownHelpers[s])this.opcode(`invokeKnownHelper`,i.length,s);else if(this.options.knownHelpersOnly)throw new n.default(`You specified knownHelpersOnly, but used the unknown helper `+s,e);else a.strict=!0,a.falsy=!0,this.accept(a),this.opcode(`invokeHelper`,i.length,a.original,o.default.helpers.simpleId(a))},PathExpression:function(e){this.addDepth(e.depth),this.opcode(`getContext`,e.depth);var t=e.parts[0],n=o.default.helpers.scopedId(e),r=!e.depth&&!n&&this.blockParamIndex(t);r?this.opcode(`lookupBlockParam`,r,e.parts):t?e.data?(this.options.data=!0,this.opcode(`lookupData`,e.depth,e.parts,e.strict)):this.opcode(`lookupOnContext`,e.parts,e.falsy,e.strict,n):this.opcode(`pushContext`)},StringLiteral:function(e){this.opcode(`pushString`,e.value)},NumberLiteral:function(e){this.opcode(`pushLiteral`,e.value)},BooleanLiteral:function(e){this.opcode(`pushLiteral`,e.value)},UndefinedLiteral:function(){this.opcode(`pushLiteral`,`undefined`)},NullLiteral:function(){this.opcode(`pushLiteral`,`null`)},Hash:function(e){var t=e.pairs,n=0,r=t.length;for(this.opcode(`pushHash`);n<r;n++)this.pushParam(t[n].value);for(;n--;)this.opcode(`assignToHash`,t[n].key);this.opcode(`popHash`)},opcode:function(e){this.opcodes.push({opcode:e,args:s.call(arguments,1),loc:this.sourceNode[0].loc})},addDepth:function(e){e&&(this.useDepths=!0)},classifySexpr:function(e){var t=o.default.helpers.simpleId(e.path),n=t&&!!this.blockParamIndex(e.path.parts[0]),r=!n&&o.default.helpers.helperExpression(e),i=!n&&(r||t);if(i&&!r){var a=e.path.parts[0],s=this.options;s.knownHelpers[a]?r=!0:s.knownHelpersOnly&&(i=!1)}return r?`helper`:i?`ambiguous`:`simple`},pushParams:function(e){for(var t=0,n=e.length;t<n;t++)this.pushParam(e[t])},pushParam:function(e){var t=e.value==null?e.original||``:e.value;if(this.stringParams)t.replace&&(t=t.replace(/^(\.?\.\/)*/g,``).replace(/\//g,`.`)),e.depth&&this.addDepth(e.depth),this.opcode(`getContext`,e.depth||0),this.opcode(`pushStringParam`,t,e.type),e.type===`SubExpression`&&this.accept(e);else{if(this.trackIds){var n=void 0;if(e.parts&&!o.default.helpers.scopedId(e)&&!e.depth&&(n=this.blockParamIndex(e.parts[0])),n){var r=e.parts.slice(1).join(`.`);this.opcode(`pushId`,`BlockParam`,n,r)}else t=e.original||t,t.replace&&(t=t.replace(/^this(?:\.|$)/,``).replace(/^\.\//,``).replace(/^\.$/,``)),this.opcode(`pushId`,e.type,t)}this.accept(e)}},setupFullMustacheParams:function(e,t,n,r){var i=e.params;return this.pushParams(i),this.opcode(`pushProgram`,t),this.opcode(`pushProgram`,n),e.hash?this.accept(e.hash):this.opcode(`emptyHash`,r),i},blockParamIndex:function(e){for(var t=0,n=this.options.blockParams.length;t<n;t++){var r=this.options.blockParams[t],i=r&&a.indexOf(r,e);if(r&&i>=0)return[t,i]}}};function l(e,t,r){if(e==null||typeof e!=`string`&&e.type!==`Program`)throw new n.default(`You must pass a string or Handlebars AST to Handlebars.precompile. You passed `+e);t||={},`data`in t||(t.data=!0),t.compat&&(t.useDepths=!0);var i=r.parse(e,t),a=new r.Compiler().compile(i,t);return new r.JavaScriptCompiler().compile(a,t)}function u(e,t,r){if(t===void 0&&(t={}),e==null||typeof e!=`string`&&e.type!==`Program`)throw new n.default(`You must pass a string or Handlebars AST to Handlebars.compile. You passed `+e);t=a.extend({},t),`data`in t||(t.data=!0),t.compat&&(t.useDepths=!0);var i=void 0;function o(){var n=r.parse(e,t),i=new r.Compiler().compile(n,t),a=new r.JavaScriptCompiler().compile(i,t,void 0,!0);return r.template(a)}function s(e,t){return i||=o(),i.call(this,e,t)}return s._setup=function(e){return i||=o(),i._setup(e)},s._child=function(e,t,n,r){return i||=o(),i._child(e,t,n,r)},s}function d(e,t){if(e===t)return!0;if(a.isArray(e)&&a.isArray(t)&&e.length===t.length){for(var n=0;n<e.length;n++)if(!d(e[n],t[n]))return!1;return!0}}function f(e){if(!e.path.parts){var t=e.path;e.path={type:`PathExpression`,data:!1,depth:0,parts:[t.original+``],original:t.original+``,loc:t.loc}}}})),ie=n((e=>{var t=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`.split(``);e.encode=function(e){if(0<=e&&e<t.length)return t[e];throw TypeError(`Must be between 0 and 63: `+e)},e.decode=function(e){var t=65,n=90,r=97,i=122,a=48;return t<=e&&e<=n?e-t:r<=e&&e<=i?e-r+26:a<=e&&e<=57?e-a+52:e==43?62:e==47?63:-1}})),ae=n((e=>{var t=ie(),n=5,r=1<<n,i=r-1,a=r;function o(e){return e<0?(-e<<1)+1:(e<<1)+0}function s(e){var t=(e&1)==1,n=e>>1;return t?-n:n}e.encode=function(e){var r=``,s,c=o(e);do s=c&i,c>>>=n,c>0&&(s|=a),r+=t.encode(s);while(c>0);return r},e.decode=function(e,r,o){var c=e.length,l=0,u=0,d,f;do{if(r>=c)throw Error(`Expected more digits in base 64 VLQ value.`);if(f=t.decode(e.charCodeAt(r++)),f===-1)throw Error(`Invalid base64 digit: `+e.charAt(r-1));d=!!(f&a),f&=i,l+=f<<u,u+=n}while(d);o.value=s(l),o.rest=r}})),E=n((e=>{function t(e,t,n){if(t in e)return e[t];if(arguments.length===3)return n;throw Error(`"`+t+`" is a required argument.`)}e.getArg=t;var n=/^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/,r=/^data:.+\,.+$/;function i(e){var t=e.match(n);return t?{scheme:t[1],auth:t[2],host:t[3],port:t[4],path:t[5]}:null}e.urlParse=i;function a(e){var t=``;return e.scheme&&(t+=e.scheme+`:`),t+=`//`,e.auth&&(t+=e.auth+`@`),e.host&&(t+=e.host),e.port&&(t+=`:`+e.port),e.path&&(t+=e.path),t}e.urlGenerate=a;function o(t){var n=t,r=i(t);if(r){if(!r.path)return t;n=r.path}for(var o=e.isAbsolute(n),s=n.split(/\/+/),c,l=0,u=s.length-1;u>=0;u--)c=s[u],c===`.`?s.splice(u,1):c===`..`?l++:l>0&&(c===``?(s.splice(u+1,l),l=0):(s.splice(u,2),l--));return n=s.join(`/`),n===``&&(n=o?`/`:`.`),r?(r.path=n,a(r)):n}e.normalize=o;function s(e,t){e===``&&(e=`.`),t===``&&(t=`.`);var n=i(t),s=i(e);if(s&&(e=s.path||`/`),n&&!n.scheme)return s&&(n.scheme=s.scheme),a(n);if(n||t.match(r))return t;if(s&&!s.host&&!s.path)return s.host=t,a(s);var c=t.charAt(0)===`/`?t:o(e.replace(/\/+$/,``)+`/`+t);return s?(s.path=c,a(s)):c}e.join=s,e.isAbsolute=function(e){return e.charAt(0)===`/`||n.test(e)};function c(e,t){e===``&&(e=`.`),e=e.replace(/\/$/,``);for(var n=0;t.indexOf(e+`/`)!==0;){var r=e.lastIndexOf(`/`);if(r<0||(e=e.slice(0,r),e.match(/^([^\/]+:\/)?\/*$/)))return t;++n}return Array(n+1).join(`../`)+t.substr(e.length+1)}e.relative=c;var l=function(){return!(`__proto__`in Object.create(null))}();function u(e){return e}function d(e){return p(e)?`$`+e:e}e.toSetString=l?u:d;function f(e){return p(e)?e.slice(1):e}e.fromSetString=l?u:f;function p(e){if(!e)return!1;var t=e.length;if(t<9||e.charCodeAt(t-1)!==95||e.charCodeAt(t-2)!==95||e.charCodeAt(t-3)!==111||e.charCodeAt(t-4)!==116||e.charCodeAt(t-5)!==111||e.charCodeAt(t-6)!==114||e.charCodeAt(t-7)!==112||e.charCodeAt(t-8)!==95||e.charCodeAt(t-9)!==95)return!1;for(var n=t-10;n>=0;n--)if(e.charCodeAt(n)!==36)return!1;return!0}function m(e,t,n){var r=g(e.source,t.source);return r!==0||(r=e.originalLine-t.originalLine,r!==0)||(r=e.originalColumn-t.originalColumn,r!==0||n)||(r=e.generatedColumn-t.generatedColumn,r!==0)||(r=e.generatedLine-t.generatedLine,r!==0)?r:g(e.name,t.name)}e.compareByOriginalPositions=m;function h(e,t,n){var r=e.generatedLine-t.generatedLine;return r!==0||(r=e.generatedColumn-t.generatedColumn,r!==0||n)||(r=g(e.source,t.source),r!==0)||(r=e.originalLine-t.originalLine,r!==0)||(r=e.originalColumn-t.originalColumn,r!==0)?r:g(e.name,t.name)}e.compareByGeneratedPositionsDeflated=h;function g(e,t){return e===t?0:e===null?1:t===null?-1:e>t?1:-1}function _(e,t){var n=e.generatedLine-t.generatedLine;return n!==0||(n=e.generatedColumn-t.generatedColumn,n!==0)||(n=g(e.source,t.source),n!==0)||(n=e.originalLine-t.originalLine,n!==0)||(n=e.originalColumn-t.originalColumn,n!==0)?n:g(e.name,t.name)}e.compareByGeneratedPositionsInflated=_;function v(e){return JSON.parse(e.replace(/^\)]}'[^\n]*\n/,``))}e.parseSourceMapInput=v;function y(e,t,n){if(t||=``,e&&(e[e.length-1]!==`/`&&t[0]!==`/`&&(e+=`/`),t=e+t),n){var r=i(n);if(!r)throw Error(`sourceMapURL could not be parsed`);if(r.path){var c=r.path.lastIndexOf(`/`);c>=0&&(r.path=r.path.substring(0,c+1))}t=s(a(r),t)}return o(t)}e.computeSourceURL=y})),oe=n((e=>{var t=E(),n=Object.prototype.hasOwnProperty,r=typeof Map<`u`;function i(){this._array=[],this._set=r?new Map:Object.create(null)}i.fromArray=function(e,t){for(var n=new i,r=0,a=e.length;r<a;r++)n.add(e[r],t);return n},i.prototype.size=function(){return r?this._set.size:Object.getOwnPropertyNames(this._set).length},i.prototype.add=function(e,i){var a=r?e:t.toSetString(e),o=r?this.has(e):n.call(this._set,a),s=this._array.length;(!o||i)&&this._array.push(e),o||(r?this._set.set(e,s):this._set[a]=s)},i.prototype.has=function(e){if(r)return this._set.has(e);var i=t.toSetString(e);return n.call(this._set,i)},i.prototype.indexOf=function(e){if(r){var i=this._set.get(e);if(i>=0)return i}else{var a=t.toSetString(e);if(n.call(this._set,a))return this._set[a]}throw Error(`"`+e+`" is not in the set.`)},i.prototype.at=function(e){if(e>=0&&e<this._array.length)return this._array[e];throw Error(`No element indexed by `+e)},i.prototype.toArray=function(){return this._array.slice()},e.ArraySet=i})),se=n((e=>{var t=E();function n(e,n){var r=e.generatedLine,i=n.generatedLine,a=e.generatedColumn,o=n.generatedColumn;return i>r||i==r&&o>=a||t.compareByGeneratedPositionsInflated(e,n)<=0}function r(){this._array=[],this._sorted=!0,this._last={generatedLine:-1,generatedColumn:0}}r.prototype.unsortedForEach=function(e,t){this._array.forEach(e,t)},r.prototype.add=function(e){n(this._last,e)?(this._last=e,this._array.push(e)):(this._sorted=!1,this._array.push(e))},r.prototype.toArray=function(){return this._sorted||=(this._array.sort(t.compareByGeneratedPositionsInflated),!0),this._array},e.MappingList=r})),ce=n((e=>{var t=ae(),n=E(),r=oe().ArraySet,i=se().MappingList;function a(e){e||={},this._file=n.getArg(e,`file`,null),this._sourceRoot=n.getArg(e,`sourceRoot`,null),this._skipValidation=n.getArg(e,`skipValidation`,!1),this._sources=new r,this._names=new r,this._mappings=new i,this._sourcesContents=null}a.prototype._version=3,a.fromSourceMap=function(e){var t=e.sourceRoot,r=new a({file:e.file,sourceRoot:t});return e.eachMapping(function(e){var i={generated:{line:e.generatedLine,column:e.generatedColumn}};e.source!=null&&(i.source=e.source,t!=null&&(i.source=n.relative(t,i.source)),i.original={line:e.originalLine,column:e.originalColumn},e.name!=null&&(i.name=e.name)),r.addMapping(i)}),e.sources.forEach(function(i){var a=i;t!==null&&(a=n.relative(t,i)),r._sources.has(a)||r._sources.add(a);var o=e.sourceContentFor(i);o!=null&&r.setSourceContent(i,o)}),r},a.prototype.addMapping=function(e){var t=n.getArg(e,`generated`),r=n.getArg(e,`original`,null),i=n.getArg(e,`source`,null),a=n.getArg(e,`name`,null);this._skipValidation||this._validateMapping(t,r,i,a),i!=null&&(i=String(i),this._sources.has(i)||this._sources.add(i)),a!=null&&(a=String(a),this._names.has(a)||this._names.add(a)),this._mappings.add({generatedLine:t.line,generatedColumn:t.column,originalLine:r!=null&&r.line,originalColumn:r!=null&&r.column,source:i,name:a})},a.prototype.setSourceContent=function(e,t){var r=e;this._sourceRoot!=null&&(r=n.relative(this._sourceRoot,r)),t==null?this._sourcesContents&&(delete this._sourcesContents[n.toSetString(r)],Object.keys(this._sourcesContents).length===0&&(this._sourcesContents=null)):(this._sourcesContents||=Object.create(null),this._sourcesContents[n.toSetString(r)]=t)},a.prototype.applySourceMap=function(e,t,i){var a=t;if(t==null){if(e.file==null)throw Error(`SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`);a=e.file}var o=this._sourceRoot;o!=null&&(a=n.relative(o,a));var s=new r,c=new r;this._mappings.unsortedForEach(function(t){if(t.source===a&&t.originalLine!=null){var r=e.originalPositionFor({line:t.originalLine,column:t.originalColumn});r.source!=null&&(t.source=r.source,i!=null&&(t.source=n.join(i,t.source)),o!=null&&(t.source=n.relative(o,t.source)),t.originalLine=r.line,t.originalColumn=r.column,r.name!=null&&(t.name=r.name))}var l=t.source;l!=null&&!s.has(l)&&s.add(l);var u=t.name;u!=null&&!c.has(u)&&c.add(u)},this),this._sources=s,this._names=c,e.sources.forEach(function(t){var r=e.sourceContentFor(t);r!=null&&(i!=null&&(t=n.join(i,t)),o!=null&&(t=n.relative(o,t)),this.setSourceContent(t,r))},this)},a.prototype._validateMapping=function(e,t,n,r){if(t&&typeof t.line!=`number`&&typeof t.column!=`number`)throw Error(`original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.`);if(!(e&&`line`in e&&`column`in e&&e.line>0&&e.column>=0&&!t&&!n&&!r)&&!(e&&`line`in e&&`column`in e&&t&&`line`in t&&`column`in t&&e.line>0&&e.column>=0&&t.line>0&&t.column>=0&&n))throw Error(`Invalid mapping: `+JSON.stringify({generated:e,source:n,original:t,name:r}))},a.prototype._serializeMappings=function(){for(var e=0,r=1,i=0,a=0,o=0,s=0,c=``,l,u,d,f,p=this._mappings.toArray(),m=0,h=p.length;m<h;m++){if(u=p[m],l=``,u.generatedLine!==r)for(e=0;u.generatedLine!==r;)l+=`;`,r++;else if(m>0){if(!n.compareByGeneratedPositionsInflated(u,p[m-1]))continue;l+=`,`}l+=t.encode(u.generatedColumn-e),e=u.generatedColumn,u.source!=null&&(f=this._sources.indexOf(u.source),l+=t.encode(f-s),s=f,l+=t.encode(u.originalLine-1-a),a=u.originalLine-1,l+=t.encode(u.originalColumn-i),i=u.originalColumn,u.name!=null&&(d=this._names.indexOf(u.name),l+=t.encode(d-o),o=d)),c+=l}return c},a.prototype._generateSourcesContent=function(e,t){return e.map(function(e){if(!this._sourcesContents)return null;t!=null&&(e=n.relative(t,e));var r=n.toSetString(e);return Object.prototype.hasOwnProperty.call(this._sourcesContents,r)?this._sourcesContents[r]:null},this)},a.prototype.toJSON=function(){var e={version:this._version,sources:this._sources.toArray(),names:this._names.toArray(),mappings:this._serializeMappings()};return this._file!=null&&(e.file=this._file),this._sourceRoot!=null&&(e.sourceRoot=this._sourceRoot),this._sourcesContents&&(e.sourcesContent=this._generateSourcesContent(e.sources,e.sourceRoot)),e},a.prototype.toString=function(){return JSON.stringify(this.toJSON())},e.SourceMapGenerator=a})),le=n((e=>{e.GREATEST_LOWER_BOUND=1,e.LEAST_UPPER_BOUND=2;function t(n,r,i,a,o,s){var c=Math.floor((r-n)/2)+n,l=o(i,a[c],!0);return l===0?c:l>0?r-c>1?t(c,r,i,a,o,s):s==e.LEAST_UPPER_BOUND?r<a.length?r:-1:c:c-n>1?t(n,c,i,a,o,s):s==e.LEAST_UPPER_BOUND?c:n<0?-1:n}e.search=function(n,r,i,a){if(r.length===0)return-1;var o=t(-1,r.length,n,r,i,a||e.GREATEST_LOWER_BOUND);if(o<0)return-1;for(;o-1>=0&&i(r[o],r[o-1],!0)===0;)--o;return o}})),ue=n((e=>{function t(e,t,n){var r=e[t];e[t]=e[n],e[n]=r}function n(e,t){return Math.round(e+Math.random()*(t-e))}function r(e,i,a,o){if(a<o){var s=n(a,o),c=a-1;t(e,s,o);for(var l=e[o],u=a;u<o;u++)i(e[u],l)<=0&&(c+=1,t(e,c,u));t(e,c+1,u);var d=c+1;r(e,i,a,d-1),r(e,i,d+1,o)}}e.quickSort=function(e,t){r(e,t,0,e.length-1)}})),de=n((e=>{var t=E(),n=le(),r=oe().ArraySet,i=ae(),a=ue().quickSort;function o(e,n){var r=e;return typeof e==`string`&&(r=t.parseSourceMapInput(e)),r.sections==null?new s(r,n):new l(r,n)}o.fromSourceMap=function(e,t){return s.fromSourceMap(e,t)},o.prototype._version=3,o.prototype.__generatedMappings=null,Object.defineProperty(o.prototype,"_generatedMappings",{configurable:!0,enumerable:!0,get:function(){return this.__generatedMappings||this._parseMappings(this._mappings,this.sourceRoot),this.__generatedMappings}}),o.prototype.__originalMappings=null,Object.defineProperty(o.prototype,"_originalMappings",{configurable:!0,enumerable:!0,get:function(){return this.__originalMappings||this._parseMappings(this._mappings,this.sourceRoot),this.__originalMappings}}),o.prototype._charIsMappingSeparator=function(e,t){var n=e.charAt(t);return n===`;`||n===`,`},o.prototype._parseMappings=function(e,t){throw Error(`Subclasses must implement _parseMappings`)},o.GENERATED_ORDER=1,o.ORIGINAL_ORDER=2,o.GREATEST_LOWER_BOUND=1,o.LEAST_UPPER_BOUND=2,o.prototype.eachMapping=function(e,n,r){var i=n||null,a=r||o.GENERATED_ORDER,s;switch(a){case o.GENERATED_ORDER:s=this._generatedMappings;break;case o.ORIGINAL_ORDER:s=this._originalMappings;break;default:throw Error(`Unknown order of iteration.`)}var c=this.sourceRoot;s.map(function(e){var n=e.source===null?null:this._sources.at(e.source);return n=t.computeSourceURL(c,n,this._sourceMapURL),{source:n,generatedLine:e.generatedLine,generatedColumn:e.generatedColumn,originalLine:e.originalLine,originalColumn:e.originalColumn,name:e.name===null?null:this._names.at(e.name)}},this).forEach(e,i)},o.prototype.allGeneratedPositionsFor=function(e){var r=t.getArg(e,`line`),i={source:t.getArg(e,`source`),originalLine:r,originalColumn:t.getArg(e,`column`,0)};if(i.source=this._findSourceIndex(i.source),i.source<0)return[];var a=[],o=this._findMapping(i,this._originalMappings,`originalLine`,`originalColumn`,t.compareByOriginalPositions,n.LEAST_UPPER_BOUND);if(o>=0){var s=this._originalMappings[o];if(e.column===void 0)for(var c=s.originalLine;s&&s.originalLine===c;)a.push({line:t.getArg(s,`generatedLine`,null),column:t.getArg(s,`generatedColumn`,null),lastColumn:t.getArg(s,`lastGeneratedColumn`,null)}),s=this._originalMappings[++o];else for(var l=s.originalColumn;s&&s.originalLine===r&&s.originalColumn==l;)a.push({line:t.getArg(s,`generatedLine`,null),column:t.getArg(s,`generatedColumn`,null),lastColumn:t.getArg(s,`lastGeneratedColumn`,null)}),s=this._originalMappings[++o]}return a},e.SourceMapConsumer=o;function s(e,n){var i=e;typeof e==`string`&&(i=t.parseSourceMapInput(e));var a=t.getArg(i,`version`),o=t.getArg(i,`sources`),s=t.getArg(i,`names`,[]),c=t.getArg(i,`sourceRoot`,null),l=t.getArg(i,`sourcesContent`,null),u=t.getArg(i,`mappings`),d=t.getArg(i,`file`,null);if(a!=this._version)throw Error(`Unsupported version: `+a);c&&=t.normalize(c),o=o.map(String).map(t.normalize).map(function(e){return c&&t.isAbsolute(c)&&t.isAbsolute(e)?t.relative(c,e):e}),this._names=r.fromArray(s.map(String),!0),this._sources=r.fromArray(o,!0),this._absoluteSources=this._sources.toArray().map(function(e){return t.computeSourceURL(c,e,n)}),this.sourceRoot=c,this.sourcesContent=l,this._mappings=u,this._sourceMapURL=n,this.file=d}s.prototype=Object.create(o.prototype),s.prototype.consumer=o,s.prototype._findSourceIndex=function(e){var n=e;if(this.sourceRoot!=null&&(n=t.relative(this.sourceRoot,n)),this._sources.has(n))return this._sources.indexOf(n);var r;for(r=0;r<this._absoluteSources.length;++r)if(this._absoluteSources[r]==e)return r;return-1},s.fromSourceMap=function(e,n){var i=Object.create(s.prototype),o=i._names=r.fromArray(e._names.toArray(),!0),l=i._sources=r.fromArray(e._sources.toArray(),!0);i.sourceRoot=e._sourceRoot,i.sourcesContent=e._generateSourcesContent(i._sources.toArray(),i.sourceRoot),i.file=e._file,i._sourceMapURL=n,i._absoluteSources=i._sources.toArray().map(function(e){return t.computeSourceURL(i.sourceRoot,e,n)});for(var u=e._mappings.toArray().slice(),d=i.__generatedMappings=[],f=i.__originalMappings=[],p=0,m=u.length;p<m;p++){var h=u[p],g=new c;g.generatedLine=h.generatedLine,g.generatedColumn=h.generatedColumn,h.source&&(g.source=l.indexOf(h.source),g.originalLine=h.originalLine,g.originalColumn=h.originalColumn,h.name&&(g.name=o.indexOf(h.name)),f.push(g)),d.push(g)}return a(i.__originalMappings,t.compareByOriginalPositions),i},s.prototype._version=3,Object.defineProperty(s.prototype,"sources",{get:function(){return this._absoluteSources.slice()}});function c(){this.generatedLine=0,this.generatedColumn=0,this.source=null,this.originalLine=null,this.originalColumn=null,this.name=null}s.prototype._parseMappings=function(e,n){for(var r=1,o=0,s=0,l=0,u=0,d=0,f=e.length,p=0,m={},h={},g=[],_=[],v,y,b,x,S;p<f;)if(e.charAt(p)===`;`)r++,p++,o=0;else if(e.charAt(p)===`,`)p++;else{for(v=new c,v.generatedLine=r,x=p;x<f&&!this._charIsMappingSeparator(e,x);x++);if(y=e.slice(p,x),b=m[y],b)p+=y.length;else{for(b=[];p<x;)i.decode(e,p,h),S=h.value,p=h.rest,b.push(S);if(b.length===2)throw Error(`Found a source, but no line and column`);if(b.length===3)throw Error(`Found a source and line, but no column`);m[y]=b}v.generatedColumn=o+b[0],o=v.generatedColumn,b.length>1&&(v.source=u+b[1],u+=b[1],v.originalLine=s+b[2],s=v.originalLine,v.originalLine+=1,v.originalColumn=l+b[3],l=v.originalColumn,b.length>4&&(v.name=d+b[4],d+=b[4])),_.push(v),typeof v.originalLine==`number`&&g.push(v)}a(_,t.compareByGeneratedPositionsDeflated),this.__generatedMappings=_,a(g,t.compareByOriginalPositions),this.__originalMappings=g},s.prototype._findMapping=function(e,t,r,i,a,o){if(e[r]<=0)throw TypeError(`Line must be greater than or equal to 1, got `+e[r]);if(e[i]<0)throw TypeError(`Column must be greater than or equal to 0, got `+e[i]);return n.search(e,t,a,o)},s.prototype.computeColumnSpans=function(){for(var e=0;e<this._generatedMappings.length;++e){var t=this._generatedMappings[e];if(e+1<this._generatedMappings.length){var n=this._generatedMappings[e+1];if(t.generatedLine===n.generatedLine){t.lastGeneratedColumn=n.generatedColumn-1;continue}}t.lastGeneratedColumn=1/0}},s.prototype.originalPositionFor=function(e){var n={generatedLine:t.getArg(e,`line`),generatedColumn:t.getArg(e,`column`)},r=this._findMapping(n,this._generatedMappings,`generatedLine`,`generatedColumn`,t.compareByGeneratedPositionsDeflated,t.getArg(e,`bias`,o.GREATEST_LOWER_BOUND));if(r>=0){var i=this._generatedMappings[r];if(i.generatedLine===n.generatedLine){var a=t.getArg(i,`source`,null);a!==null&&(a=this._sources.at(a),a=t.computeSourceURL(this.sourceRoot,a,this._sourceMapURL));var s=t.getArg(i,`name`,null);return s!==null&&(s=this._names.at(s)),{source:a,line:t.getArg(i,`originalLine`,null),column:t.getArg(i,`originalColumn`,null),name:s}}}return{source:null,line:null,column:null,name:null}},s.prototype.hasContentsOfAllSources=function(){return this.sourcesContent?this.sourcesContent.length>=this._sources.size()&&!this.sourcesContent.some(function(e){return e==null}):!1},s.prototype.sourceContentFor=function(e,n){if(!this.sourcesContent)return null;var r=this._findSourceIndex(e);if(r>=0)return this.sourcesContent[r];var i=e;this.sourceRoot!=null&&(i=t.relative(this.sourceRoot,i));var a;if(this.sourceRoot!=null&&(a=t.urlParse(this.sourceRoot))){var o=i.replace(/^file:\/\//,``);if(a.scheme==`file`&&this._sources.has(o))return this.sourcesContent[this._sources.indexOf(o)];if((!a.path||a.path==`/`)&&this._sources.has(`/`+i))return this.sourcesContent[this._sources.indexOf(`/`+i)]}if(n)return null;throw Error(`"`+i+`" is not in the SourceMap.`)},s.prototype.generatedPositionFor=function(e){var n=t.getArg(e,`source`);if(n=this._findSourceIndex(n),n<0)return{line:null,column:null,lastColumn:null};var r={source:n,originalLine:t.getArg(e,`line`),originalColumn:t.getArg(e,`column`)},i=this._findMapping(r,this._originalMappings,`originalLine`,`originalColumn`,t.compareByOriginalPositions,t.getArg(e,`bias`,o.GREATEST_LOWER_BOUND));if(i>=0){var a=this._originalMappings[i];if(a.source===r.source)return{line:t.getArg(a,`generatedLine`,null),column:t.getArg(a,`generatedColumn`,null),lastColumn:t.getArg(a,`lastGeneratedColumn`,null)}}return{line:null,column:null,lastColumn:null}},e.BasicSourceMapConsumer=s;function l(e,n){var i=e;typeof e==`string`&&(i=t.parseSourceMapInput(e));var a=t.getArg(i,`version`),s=t.getArg(i,`sections`);if(a!=this._version)throw Error(`Unsupported version: `+a);this._sources=new r,this._names=new r;var c={line:-1,column:0};this._sections=s.map(function(e){if(e.url)throw Error(`Support for url field in sections not implemented.`);var r=t.getArg(e,`offset`),i=t.getArg(r,`line`),a=t.getArg(r,`column`);if(i<c.line||i===c.line&&a<c.column)throw Error(`Section offsets must be ordered and non-overlapping.`);return c=r,{generatedOffset:{generatedLine:i+1,generatedColumn:a+1},consumer:new o(t.getArg(e,`map`),n)}})}l.prototype=Object.create(o.prototype),l.prototype.constructor=o,l.prototype._version=3,Object.defineProperty(l.prototype,"sources",{get:function(){for(var e=[],t=0;t<this._sections.length;t++)for(var n=0;n<this._sections[t].consumer.sources.length;n++)e.push(this._sections[t].consumer.sources[n]);return e}}),l.prototype.originalPositionFor=function(e){var r={generatedLine:t.getArg(e,`line`),generatedColumn:t.getArg(e,`column`)},i=n.search(r,this._sections,function(e,t){return e.generatedLine-t.generatedOffset.generatedLine||e.generatedColumn-t.generatedOffset.generatedColumn}),a=this._sections[i];return a?a.consumer.originalPositionFor({line:r.generatedLine-(a.generatedOffset.generatedLine-1),column:r.generatedColumn-(a.generatedOffset.generatedLine===r.generatedLine?a.generatedOffset.generatedColumn-1:0),bias:e.bias}):{source:null,line:null,column:null,name:null}},l.prototype.hasContentsOfAllSources=function(){return this._sections.every(function(e){return e.consumer.hasContentsOfAllSources()})},l.prototype.sourceContentFor=function(e,t){for(var n=0;n<this._sections.length;n++){var r=this._sections[n].consumer.sourceContentFor(e,!0);if(r)return r}if(t)return null;throw Error(`"`+e+`" is not in the SourceMap.`)},l.prototype.generatedPositionFor=function(e){for(var n=0;n<this._sections.length;n++){var r=this._sections[n];if(r.consumer._findSourceIndex(t.getArg(e,`source`))!==-1){var i=r.consumer.generatedPositionFor(e);if(i)return{line:i.line+(r.generatedOffset.generatedLine-1),column:i.column+(r.generatedOffset.generatedLine===i.line?r.generatedOffset.generatedColumn-1:0)}}}return{line:null,column:null}},l.prototype._parseMappings=function(e,n){this.__generatedMappings=[],this.__originalMappings=[];for(var r=0;r<this._sections.length;r++)for(var i=this._sections[r],o=i.consumer._generatedMappings,s=0;s<o.length;s++){var c=o[s],l=i.consumer._sources.at(c.source);l=t.computeSourceURL(i.consumer.sourceRoot,l,this._sourceMapURL),this._sources.add(l),l=this._sources.indexOf(l);var u=null;c.name&&(u=i.consumer._names.at(c.name),this._names.add(u),u=this._names.indexOf(u));var d={source:l,generatedLine:c.generatedLine+(i.generatedOffset.generatedLine-1),generatedColumn:c.generatedColumn+(i.generatedOffset.generatedLine===c.generatedLine?i.generatedOffset.generatedColumn-1:0),originalLine:c.originalLine,originalColumn:c.originalColumn,name:u};this.__generatedMappings.push(d),typeof d.originalLine==`number`&&this.__originalMappings.push(d)}a(this.__generatedMappings,t.compareByGeneratedPositionsDeflated),a(this.__originalMappings,t.compareByOriginalPositions)},e.IndexedSourceMapConsumer=l})),fe=n((e=>{var t=ce().SourceMapGenerator,n=E(),r=/(\r?\n)/,i=10,a=`$$$isSourceNode$$$`;function o(e,t,n,r,i){this.children=[],this.sourceContents={},this.line=e??null,this.column=t??null,this.source=n??null,this.name=i??null,this[a]=!0,r!=null&&this.add(r)}o.fromStringWithSourceMap=function(e,t,i){var a=new o,s=e.split(r),c=0,l=function(){return e()+(e()||``);function e(){return c<s.length?s[c++]:void 0}},u=1,d=0,f=null;return t.eachMapping(function(e){if(f!==null)if(u<e.generatedLine)p(f,l()),u++,d=0;else{var t=s[c]||``,n=t.substr(0,e.generatedColumn-d);s[c]=t.substr(e.generatedColumn-d),d=e.generatedColumn,p(f,n),f=e;return}for(;u<e.generatedLine;)a.add(l()),u++;if(d<e.generatedColumn){var t=s[c]||``;a.add(t.substr(0,e.generatedColumn)),s[c]=t.substr(e.generatedColumn),d=e.generatedColumn}f=e},this),c<s.length&&(f&&p(f,l()),a.add(s.splice(c).join(``))),t.sources.forEach(function(e){var r=t.sourceContentFor(e);r!=null&&(i!=null&&(e=n.join(i,e)),a.setSourceContent(e,r))}),a;function p(e,t){if(e===null||e.source===void 0)a.add(t);else{var r=i?n.join(i,e.source):e.source;a.add(new o(e.originalLine,e.originalColumn,r,t,e.name))}}},o.prototype.add=function(e){if(Array.isArray(e))e.forEach(function(e){this.add(e)},this);else if(e[a]||typeof e==`string`)e&&this.children.push(e);else throw TypeError(`Expected a SourceNode, string, or an array of SourceNodes and strings. Got `+e);return this},o.prototype.prepend=function(e){if(Array.isArray(e))for(var t=e.length-1;t>=0;t--)this.prepend(e[t]);else if(e[a]||typeof e==`string`)this.children.unshift(e);else throw TypeError(`Expected a SourceNode, string, or an array of SourceNodes and strings. Got `+e);return this},o.prototype.walk=function(e){for(var t,n=0,r=this.children.length;n<r;n++)t=this.children[n],t[a]?t.walk(e):t!==``&&e(t,{source:this.source,line:this.line,column:this.column,name:this.name})},o.prototype.join=function(e){var t,n,r=this.children.length;if(r>0){for(t=[],n=0;n<r-1;n++)t.push(this.children[n]),t.push(e);t.push(this.children[n]),this.children=t}return this},o.prototype.replaceRight=function(e,t){var n=this.children[this.children.length-1];return n[a]?n.replaceRight(e,t):typeof n==`string`?this.children[this.children.length-1]=n.replace(e,t):this.children.push(``.replace(e,t)),this},o.prototype.setSourceContent=function(e,t){this.sourceContents[n.toSetString(e)]=t},o.prototype.walkSourceContents=function(e){for(var t=0,r=this.children.length;t<r;t++)this.children[t][a]&&this.children[t].walkSourceContents(e);for(var i=Object.keys(this.sourceContents),t=0,r=i.length;t<r;t++)e(n.fromSetString(i[t]),this.sourceContents[i[t]])},o.prototype.toString=function(){var e=``;return this.walk(function(t){e+=t}),e},o.prototype.toStringWithSourceMap=function(e){var n={code:``,line:1,column:0},r=new t(e),a=!1,o=null,s=null,c=null,l=null;return this.walk(function(e,t){n.code+=e,t.source!==null&&t.line!==null&&t.column!==null?((o!==t.source||s!==t.line||c!==t.column||l!==t.name)&&r.addMapping({source:t.source,original:{line:t.line,column:t.column},generated:{line:n.line,column:n.column},name:t.name}),o=t.source,s=t.line,c=t.column,l=t.name,a=!0):a&&=(r.addMapping({generated:{line:n.line,column:n.column}}),o=null,!1);for(var u=0,d=e.length;u<d;u++)e.charCodeAt(u)===i?(n.line++,n.column=0,u+1===d?(o=null,a=!1):a&&r.addMapping({source:t.source,original:{line:t.line,column:t.column},generated:{line:n.line,column:n.column},name:t.name})):n.column++}),this.walkSourceContents(function(e,t){r.setSourceContent(e,t)}),{code:n.code,map:r}},e.SourceNode=o})),pe=n((e=>{e.SourceMapGenerator=ce().SourceMapGenerator,e.SourceMapConsumer=de().SourceMapConsumer,e.SourceNode=fe().SourceNode})),me=n(((e,t)=>{e.__esModule=!0;var n=r(),i=void 0;try{(typeof define!=`function`||!define.amd)&&(i=pe().SourceNode)}catch{}i||(i=function(e,t,n,r){this.src=``,r&&this.add(r)},i.prototype={add:function(e){n.isArray(e)&&(e=e.join(``)),this.src+=e},prepend:function(e){n.isArray(e)&&(e=e.join(``)),this.src=e+this.src},toStringWithSourceMap:function(){return{code:this.toString()}},toString:function(){return this.src}});function a(e,t,r){if(n.isArray(e)){for(var i=[],a=0,o=e.length;a<o;a++)i.push(t.wrap(e[a],r));return i}return typeof e==`boolean`||typeof e==`number`?e+``:e}function o(e){this.srcFile=e,this.source=[]}o.prototype={isEmpty:function(){return!this.source.length},prepend:function(e,t){this.source.unshift(this.wrap(e,t))},push:function(e,t){this.source.push(this.wrap(e,t))},merge:function(){var e=this.empty();return this.each(function(t){e.add([`  `,t,`
`])}),e},each:function(e){for(var t=0,n=this.source.length;t<n;t++)e(this.source[t])},empty:function(){var e=this.currentLocation||{start:{}};return new i(e.start.line,e.start.column,this.srcFile)},wrap:function(e){var t=arguments.length<=1||arguments[1]===void 0?this.currentLocation||{start:{}}:arguments[1];return e instanceof i?e:(e=a(e,this,t),new i(t.start.line,t.start.column,this.srcFile,e))},functionCall:function(e,t,n){return n=this.generateList(n),this.wrap([e,t?`.`+t+`(`:`(`,n,`)`])},quotedString:function(e){return`"`+(e+``).replace(/\\/g,`\\\\`).replace(/"/g,`\\"`).replace(/\n/g,`\\n`).replace(/\r/g,`\\r`).replace(/\u2028/g,`\\u2028`).replace(/\u2029/g,`\\u2029`)+`"`},objectLiteral:function(e){var t=this,n=[];Object.keys(e).forEach(function(r){var i=a(e[r],t);i!==`undefined`&&n.push([t.quotedString(r),`:`,i])});var r=this.generateList(n);return r.prepend(`{`),r.add(`}`),r},generateList:function(e){for(var t=this.empty(),n=0,r=e.length;n<r;n++)n&&t.add(`,`),t.add(a(e[n],this));return t},generateArray:function(e){var t=this.generateList(e);return t.prepend(`[`),t.add(`]`),t}},e.default=o,t.exports=e.default})),he=n(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var a=_(),o=n(i()),s=r(),c=n(me());function l(e){this.value=e}function u(){}u.prototype={nameLookup:function(e,t){return this.internalNameLookup(e,t)},depthedLookup:function(e){return[this.aliasable(`container.lookup`),`(depths, `,JSON.stringify(e),`)`]},compilerInfo:function(){var e=a.COMPILER_REVISION;return[e,a.REVISION_CHANGES[e]]},appendToBuffer:function(e,t,n){return s.isArray(e)||(e=[e]),e=this.source.wrap(e,t),this.environment.isSimple?[`return `,e,`;`]:n?[`buffer += `,e,`;`]:(e.appendToBuffer=!0,e)},initializeBuffer:function(){return this.quotedString(``)},internalNameLookup:function(e,t){return this.lookupPropertyFunctionIsUsed=!0,[`lookupProperty(`,e,`,`,JSON.stringify(t),`)`]},lookupPropertyFunctionIsUsed:!1,compile:function(e,t,n,r){this.environment=e,this.options=t,this.stringParams=this.options.stringParams,this.trackIds=this.options.trackIds,this.precompile=!r,this.name=this.environment.name,this.isChild=!!n,this.context=n||{decorators:[],programs:[],environments:[]},this.preamble(),this.stackSlot=0,this.stackVars=[],this.aliases={},this.registers={list:[]},this.hashes=[],this.compileStack=[],this.inlineStack=[],this.blockParams=[],this.compileChildren(e,t),this.useDepths=this.useDepths||e.useDepths||e.useDecorators||this.options.compat,this.useBlockParams=this.useBlockParams||e.useBlockParams;var i=e.opcodes,a=void 0,s=void 0,c=void 0,l=void 0;for(c=0,l=i.length;c<l;c++)a=i[c],this.source.currentLocation=a.loc,s||=a.loc,this[a.opcode].apply(this,a.args);if(this.source.currentLocation=s,this.pushSource(``),this.stackSlot||this.inlineStack.length||this.compileStack.length)throw new o.default(`Compile completed with content left on stack`);this.decorators.isEmpty()?this.decorators=void 0:(this.useDecorators=!0,this.decorators.prepend([`var decorators = container.decorators, `,this.lookupPropertyFunctionVarDeclaration(),`;
`]),this.decorators.push(`return fn;`),r?this.decorators=Function.apply(this,[`fn`,`props`,`container`,`depth0`,`data`,`blockParams`,`depths`,this.decorators.merge()]):(this.decorators.prepend(`function(fn, props, container, depth0, data, blockParams, depths) {
`),this.decorators.push(`}
`),this.decorators=this.decorators.merge()));var u=this.createFunctionContext(r);if(this.isChild)return u;var d={compiler:this.compilerInfo(),main:u};this.decorators&&(d.main_d=this.decorators,d.useDecorators=!0);var f=this.context,p=f.programs,m=f.decorators;for(c=0,l=p.length;c<l;c++)d[c]=p[c],m[c]&&(d[c+`_d`]=m[c],d.useDecorators=!0);return this.environment.usePartial&&(d.usePartial=!0),this.options.data&&(d.useData=!0),this.useDepths&&(d.useDepths=!0),this.useBlockParams&&(d.useBlockParams=!0),this.options.compat&&(d.compat=!0),r?d.compilerOptions=this.options:(d.compiler=JSON.stringify(d.compiler),this.source.currentLocation={start:{line:1,column:0}},d=this.objectLiteral(d),t.srcName?(d=d.toStringWithSourceMap({file:t.destName}),d.map=d.map&&d.map.toString()):d=d.toString()),d},preamble:function(){this.lastContext=0,this.source=new c.default(this.options.srcName),this.decorators=new c.default(this.options.srcName)},createFunctionContext:function(e){var t=this,n=``,r=this.stackVars.concat(this.registers.list);r.length>0&&(n+=`, `+r.join(`, `));var i=0;Object.keys(this.aliases).forEach(function(e){var r=t.aliases[e];r.children&&r.referenceCount>1&&(n+=`, alias`+ ++i+`=`+e,r.children[0]=`alias`+i)}),this.lookupPropertyFunctionIsUsed&&(n+=`, `+this.lookupPropertyFunctionVarDeclaration());var a=[`container`,`depth0`,`helpers`,`partials`,`data`];(this.useBlockParams||this.useDepths)&&a.push(`blockParams`),this.useDepths&&a.push(`depths`);var o=this.mergeSource(n);return e?(a.push(o),Function.apply(this,a)):this.source.wrap([`function(`,a.join(`,`),`) {
  `,o,`}`])},mergeSource:function(e){var t=this.environment.isSimple,n=!this.forceBuffer,r=void 0,i=void 0,a=void 0,o=void 0;return this.source.each(function(e){e.appendToBuffer?(a?e.prepend(`  + `):a=e,o=e):(a&&=(i?a.prepend(`buffer += `):r=!0,o.add(`;`),o=void 0),i=!0,t||(n=!1))}),n?a?(a.prepend(`return `),o.add(`;`)):i||this.source.push(`return "";`):(e+=`, buffer = `+(r?``:this.initializeBuffer()),a?(a.prepend(`return buffer + `),o.add(`;`)):this.source.push(`return buffer;`)),e&&this.source.prepend(`var `+e.substring(2)+(r?``:`;
`)),this.source.merge()},lookupPropertyFunctionVarDeclaration:function(){return`lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }`},blockValue:function(e){var t=this.aliasable(`container.hooks.blockHelperMissing`),n=[this.contextName(0)];this.setupHelperArgs(e,0,n);var r=this.popStack();n.splice(1,0,r),this.push(this.source.functionCall(t,`call`,n))},ambiguousBlockValue:function(){var e=this.aliasable(`container.hooks.blockHelperMissing`),t=[this.contextName(0)];this.setupHelperArgs(``,0,t,!0),this.flushInline();var n=this.topStack();t.splice(1,0,n),this.pushSource([`if (!`,this.lastHelper,`) { `,n,` = `,this.source.functionCall(e,`call`,t),`}`])},appendContent:function(e){this.pendingContent?e=this.pendingContent+e:this.pendingLocation=this.source.currentLocation,this.pendingContent=e},append:function(){if(this.isInline())this.replaceStack(function(e){return[` != null ? `,e,` : ""`]}),this.pushSource(this.appendToBuffer(this.popStack()));else{var e=this.popStack();this.pushSource([`if (`,e,` != null) { `,this.appendToBuffer(e,void 0,!0),` }`]),this.environment.isSimple&&this.pushSource([`else { `,this.appendToBuffer(`''`,void 0,!0),` }`])}},appendEscaped:function(){this.pushSource(this.appendToBuffer([this.aliasable(`container.escapeExpression`),`(`,this.popStack(),`)`]))},getContext:function(e){this.lastContext=e},pushContext:function(){this.pushStackLiteral(this.contextName(this.lastContext))},lookupOnContext:function(e,t,n,r){var i=0;!r&&this.options.compat&&!this.lastContext?this.push(this.depthedLookup(e[i++])):this.pushContext(),this.resolvePath(`context`,e,i,t,n)},lookupBlockParam:function(e,t){this.useBlockParams=!0,this.push([`blockParams[`,e[0],`][`,e[1],`]`]),this.resolvePath(`context`,t,1)},lookupData:function(e,t,n){e?this.pushStackLiteral(`container.data(data, `+e+`)`):this.pushStackLiteral(`data`),this.resolvePath(`data`,t,0,!0,n)},resolvePath:function(e,t,n,r,i){var a=this;if(this.options.strict||this.options.assumeObjects){this.push(d(this.options.strict&&i,this,t,n,e));return}for(var o=t.length,s=function(n){a.replaceStack(function(i){var o=a.nameLookup(i,t[n],e);return r?[` && `,o]:[` != null ? `,o,` : `,i]})},c=n;c<o;c++)s(c)},resolvePossibleLambda:function(){this.push([this.aliasable(`container.lambda`),`(`,this.popStack(),`, `,this.contextName(0),`)`])},pushStringParam:function(e,t){this.pushContext(),this.pushString(t),t!==`SubExpression`&&(typeof e==`string`?this.pushString(e):this.pushStackLiteral(e))},emptyHash:function(e){this.trackIds&&this.push(`{}`),this.stringParams&&(this.push(`{}`),this.push(`{}`)),this.pushStackLiteral(e?`undefined`:`{}`)},pushHash:function(){this.hash&&this.hashes.push(this.hash),this.hash={values:{},types:[],contexts:[],ids:[]}},popHash:function(){var e=this.hash;this.hash=this.hashes.pop(),this.trackIds&&this.push(this.objectLiteral(e.ids)),this.stringParams&&(this.push(this.objectLiteral(e.contexts)),this.push(this.objectLiteral(e.types))),this.push(this.objectLiteral(e.values))},pushString:function(e){this.pushStackLiteral(this.quotedString(e))},pushLiteral:function(e){this.pushStackLiteral(e)},pushProgram:function(e){e==null?this.pushStackLiteral(null):this.pushStackLiteral(this.programExpression(e))},registerDecorator:function(e,t){var n=this.nameLookup(`decorators`,t,`decorator`),r=this.setupHelperArgs(t,e);this.decorators.push([`var decorator = `,n,`;`]),this.decorators.push([`if (typeof decorator !== "function") { throw new Error(`,this.quotedString(`Missing decorator: "`+t+`"`),`); }`]),this.decorators.push([`fn = `,this.decorators.functionCall(`decorator`,``,[`fn`,`props`,`container`,r]),` || fn;`])},invokeHelper:function(e,t,n){var r=this.popStack(),i=this.setupHelper(e,t),a=[];n&&a.push(i.name),a.push(r),this.options.strict||a.push(this.aliasable(`container.hooks.helperMissing`));var o=[`(`,this.itemsSeparatedBy(a,`||`),`)`],s=this.source.functionCall(o,`call`,i.callParams);this.push(s)},itemsSeparatedBy:function(e,t){var n=[];n.push(e[0]);for(var r=1;r<e.length;r++)n.push(t,e[r]);return n},invokeKnownHelper:function(e,t){var n=this.setupHelper(e,t);this.push(this.source.functionCall(n.name,`call`,n.callParams))},invokeAmbiguous:function(e,t){this.useRegister(`helper`);var n=this.popStack();this.emptyHash();var r=this.setupHelper(0,e,t),i=[`(`,`(helper = `,this.lastHelper=this.nameLookup(`helpers`,e,`helper`),` || `,n,`)`];this.options.strict||(i[0]=`(helper = `,i.push(` != null ? helper : `,this.aliasable(`container.hooks.helperMissing`))),this.push([`(`,i,r.paramsInit?[`),(`,r.paramsInit]:[],`),`,`(typeof helper === `,this.aliasable(`"function"`),` ? `,this.source.functionCall(`helper`,`call`,r.callParams),` : helper))`])},invokePartial:function(e,t,n){var r=[],i=this.setupParams(t,1,r);e&&(t=this.popStack(),delete i.name),n&&(i.indent=JSON.stringify(n)),i.helpers=`helpers`,i.partials=`partials`,i.decorators=`container.decorators`,e?r.unshift(t):r.unshift(this.nameLookup(`partials`,t,`partial`)),this.options.compat&&(i.depths=`depths`),i=this.objectLiteral(i),r.push(i),this.push(this.source.functionCall(`container.invokePartial`,``,r))},assignToHash:function(e){var t=this.popStack(),n=void 0,r=void 0,i=void 0;this.trackIds&&(i=this.popStack()),this.stringParams&&(r=this.popStack(),n=this.popStack());var a=this.hash;n&&(a.contexts[e]=n),r&&(a.types[e]=r),i&&(a.ids[e]=i),a.values[e]=t},pushId:function(e,t,n){e===`BlockParam`?this.pushStackLiteral(`blockParams[`+t[0]+`].path[`+t[1]+`]`+(n?` + `+JSON.stringify(`.`+n):``)):e===`PathExpression`?this.pushString(t):e===`SubExpression`?this.pushStackLiteral(`true`):this.pushStackLiteral(`null`)},compiler:u,compileChildren:function(e,t){for(var n=e.children,r=void 0,i=void 0,a=0,o=n.length;a<o;a++){r=n[a],i=new this.compiler;var s=this.matchExistingProgram(r);if(s==null){var c=this.context.programs.push(``)-1;r.index=c,r.name=`program`+c,this.context.programs[c]=i.compile(r,t,this.context,!this.precompile),this.context.decorators[c]=i.decorators,this.context.environments[c]=r,this.useDepths=this.useDepths||i.useDepths,this.useBlockParams=this.useBlockParams||i.useBlockParams,r.useDepths=this.useDepths,r.useBlockParams=this.useBlockParams}else r.index=s.index,r.name=`program`+s.index,this.useDepths=this.useDepths||s.useDepths,this.useBlockParams=this.useBlockParams||s.useBlockParams}},matchExistingProgram:function(e){for(var t=0,n=this.context.environments.length;t<n;t++){var r=this.context.environments[t];if(r&&r.equals(e))return r}},programExpression:function(e){var t=this.environment.children[e],n=[t.index,`data`,t.blockParams];return(this.useBlockParams||this.useDepths)&&n.push(`blockParams`),this.useDepths&&n.push(`depths`),`container.program(`+n.join(`, `)+`)`},useRegister:function(e){this.registers[e]||(this.registers[e]=!0,this.registers.list.push(e))},push:function(e){return e instanceof l||(e=this.source.wrap(e)),this.inlineStack.push(e),e},pushStackLiteral:function(e){this.push(new l(e))},pushSource:function(e){this.pendingContent&&=(this.source.push(this.appendToBuffer(this.source.quotedString(this.pendingContent),this.pendingLocation)),void 0),e&&this.source.push(e)},replaceStack:function(e){var t=[`(`],n=void 0,r=void 0,i=void 0;if(!this.isInline())throw new o.default(`replaceStack on non-inline`);var a=this.popStack(!0);if(a instanceof l)n=[a.value],t=[`(`,n],i=!0;else{r=!0;var s=this.incrStack();t=[`((`,this.push(s),` = `,a,`)`],n=this.topStack()}var c=e.call(this,n);i||this.popStack(),r&&this.stackSlot--,this.push(t.concat(c,`)`))},incrStack:function(){return this.stackSlot++,this.stackSlot>this.stackVars.length&&this.stackVars.push(`stack`+this.stackSlot),this.topStackName()},topStackName:function(){return`stack`+this.stackSlot},flushInline:function(){var e=this.inlineStack;this.inlineStack=[];for(var t=0,n=e.length;t<n;t++){var r=e[t];if(r instanceof l)this.compileStack.push(r);else{var i=this.incrStack();this.pushSource([i,` = `,r,`;`]),this.compileStack.push(i)}}},isInline:function(){return this.inlineStack.length},popStack:function(e){var t=this.isInline(),n=(t?this.inlineStack:this.compileStack).pop();if(!e&&n instanceof l)return n.value;if(!t){if(!this.stackSlot)throw new o.default(`Invalid stack pop`);this.stackSlot--}return n},topStack:function(){var e=this.isInline()?this.inlineStack:this.compileStack,t=e[e.length-1];return t instanceof l?t.value:t},contextName:function(e){return this.useDepths&&e?`depths[`+e+`]`:`depth`+e},quotedString:function(e){return this.source.quotedString(e)},objectLiteral:function(e){return this.source.objectLiteral(e)},aliasable:function(e){var t=this.aliases[e];return t?(t.referenceCount++,t):(t=this.aliases[e]=this.source.wrap(e),t.aliasable=!0,t.referenceCount=1,t)},setupHelper:function(e,t,n){var r=[];return{params:r,paramsInit:this.setupHelperArgs(t,e,r,n),name:this.nameLookup(`helpers`,t,`helper`),callParams:[this.aliasable(this.contextName(0)+` != null ? `+this.contextName(0)+` : (container.nullContext || {})`)].concat(r)}},setupParams:function(e,t,n){var r={},i=[],a=[],o=[],s=!n,c=void 0;s&&(n=[]),r.name=this.quotedString(e),r.hash=this.popStack(),this.trackIds&&(r.hashIds=this.popStack()),this.stringParams&&(r.hashTypes=this.popStack(),r.hashContexts=this.popStack());var l=this.popStack(),u=this.popStack();(u||l)&&(r.fn=u||`container.noop`,r.inverse=l||`container.noop`);for(var d=t;d--;)c=this.popStack(),n[d]=c,this.trackIds&&(o[d]=this.popStack()),this.stringParams&&(a[d]=this.popStack(),i[d]=this.popStack());return s&&(r.args=this.source.generateArray(n)),this.trackIds&&(r.ids=this.source.generateArray(o)),this.stringParams&&(r.types=this.source.generateArray(a),r.contexts=this.source.generateArray(i)),this.options.data&&(r.data=`data`),this.useBlockParams&&(r.blockParams=`blockParams`),r},setupHelperArgs:function(e,t,n,r){var i=this.setupParams(e,t,n);return i.loc=JSON.stringify(this.source.currentLocation),i=this.objectLiteral(i),r?(this.useRegister(`options`),n.push(`options`),[`options=`,i]):n?(n.push(i),``):i}},(function(){for(var e=`break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield await null true false`.split(` `),t=u.RESERVED_WORDS={},n=0,r=e.length;n<r;n++)t[e[n]]=!0})(),u.isValidJavaScriptVariableName=function(e){return!u.RESERVED_WORDS[e]&&/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(e)};function d(e,t,n,r,i){var a=t.popStack(),o=n.length;e&&o--;for(var s=r;s<o;s++)a=t.nameLookup(a,n[s],i);return e?[t.aliasable(`container.strict`),`(`,a,`, `,t.quotedString(n[o]),`, `,JSON.stringify(t.source.currentLocation),` )`]:a}e.default=u,t.exports=e.default})),ge=n(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var r=n(S()),i=n(C()),a=ne(),o=re(),s=n(he()),c=n(T()),l=n(x()),u=r.default.create;function d(){var e=u();return e.compile=function(t,n){return o.compile(t,n,e)},e.precompile=function(t,n){return o.precompile(t,n,e)},e.AST=i.default,e.Compiler=o.Compiler,e.JavaScriptCompiler=s.default,e.Parser=a.parser,e.parse=a.parse,e.parseWithoutProcessing=a.parseWithoutProcessing,e}var f=d();f.create=d,l.default(f),f.Visitor=c.default,f.default=f,e.default=f,t.exports=e.default})),D;function O(){return(O=t((()=>{D=`<div
  class="c-accordion{{#if topDivider}} c-accordion--top-divider{{/if}}{{#if singleOpen}} c-accordion--single-open{{/if}}{{#if (eq appearance "card")}} c-accordion--card{{/if}}"
  data-component="accordion"
  data-accordion-group="{{accordionGroupKey name}}"
  {{#if singleOpen}}data-single-open="true"{{/if}}
>
  {{#if groupTitle}}
    <h2 class="c-accordion__group-title">{{groupTitle}}</h2>
  {{/if}}

  {{#each items}}
    <details
      class="c-accordion__item{{#unless (eq showDivider false)}} c-accordion__item--with-divider{{/unless}}"
      id="{{#if id}}{{id}}{{else}}{{accordionItemId @index}}{{/if}}"
      {{#if expanded}}open{{/if}}
      {{#if disabled}}data-disabled="true"{{/if}}
      {{#if state}}{{#unless (eq state "default")}}data-state="{{state}}"{{/unless}}{{/if}}
    >
      <summary class="c-accordion__item-header"{{#if disabled}} aria-disabled="true" tabindex="-1"{{/if}}>
        {{#if showLeadingIcon}}
          <span class="c-accordion__item-leading" aria-hidden="true">
            {{#if leadingIconName}}
              {{> icon name=leadingIconName size="24" color="current" decorative=true}}
            {{else}}
              {{> icon name="status/simple-status-info" size="24" color="current" decorative=true}}
            {{/if}}
          </span>
        {{/if}}
        <span class="c-accordion__item-title">{{title}}</span>
        {{#unless (eq showIcon false)}}
          <span class="c-accordion__item-chevron" aria-hidden="true">
            {{> icon name="arrows-navigation/simple-expand-more" size="20" color="current" decorative=true}}
          </span>
        {{/unless}}
      </summary>

      <div class="c-accordion__item-content">
        {{#unless (eq showBody false)}}
          {{#if body}}
            <p class="c-accordion__item-body">{{body}}</p>
          {{/if}}
        {{/unless}}

        {{#if showList}}
          {{#if listItems.length}}
            <ul class="c-accordion__item-list">
              {{#each listItems}}
                <li>{{this}}</li>
              {{/each}}
            </ul>
          {{/if}}
        {{/if}}

        {{#if showImage}}
          {{#if imageSrc}}
            <figure class="c-accordion__item-image">
              <img src="{{imageSrc}}" alt="{{imageAlt}}" />
            </figure>
          {{/if}}
        {{/if}}

        {{#if showVideo}}
          {{#if videoSrc}}
            <div class="c-accordion__item-video">
              <video src="{{videoSrc}}" controls></video>
            </div>
          {{/if}}
        {{/if}}

        {{#if showLink}}
          <a class="c-accordion__item-link" href="{{#if linkHref}}{{linkHref}}{{else}}#{{/if}}">
            {{#if linkLabel}}{{linkLabel}}{{else}}Learn more{{/if}}
          </a>
        {{/if}}
      </div>
    </details>
  {{/each}}
</div>
`})))()}function _e(e){return String(e).trim().toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-+|-+$/g,``)}function ve(e){e.registerHelper(`accordionGroupKey`,e=>{let t=e?_e(e):``;return t?A=t:(k+=1,A=`auto-${k}`),A}),e.registerHelper(`accordionItemId`,e=>`c-accordion-${A||`auto-${++k}`}__item-${e}`)}var k,A;function ye(){return(ye=t((()=>{k=0,A=null})))()}var j;function M(){return(M=t((()=>{j=`{{!--
  Molecules/Badge — BEM root .c-badge
  Figma: Web-ODS Shared Library component set 1284:14251 (page 539:28416).

  Axes:
    variant   dot | count | text                 → .c-badge--$variant
    color     info | success | warning | error |
              brand | inverse                    → .c-badge--$color
    emphasis  low | high                         → .c-badge--$emphasis

  Content:
    count → countValue in .c-badge__value
    text  → label in .c-badge__label
    dot   → accessibleLabel (optional) for aria
--}}
<span
  class="c-badge c-badge--{{#if variant}}{{lower variant}}{{else}}dot{{/if}} c-badge--{{#if color}}{{lower color}}{{else}}info{{/if}} c-badge--{{#if emphasis}}{{lower emphasis}}{{else}}low{{/if}}"
  {{#unless variant}}
    {{#if accessibleLabel}}role="img" aria-label="{{accessibleLabel}}"{{else}}aria-hidden="true"{{/if}}
  {{/unless}}
  {{#if (eq (lower variant) "dot")}}
    {{#if accessibleLabel}}role="img" aria-label="{{accessibleLabel}}"{{else}}aria-hidden="true"{{/if}}
  {{/if}}
>
  {{#if (eq (lower variant) "count")}}
    <span class="c-badge__value">{{#if countValue}}{{countValue}}{{else}}3{{/if}}</span>
  {{/if}}
  {{#if (eq (lower variant) "text")}}
    <span class="c-badge__label">{{#if label}}{{label}}{{else}}NEW{{/if}}</span>
  {{/if}}
</span>
`})))()}var N;function P(){return(P=t((()=>{N=`{{!--
  Molecules/Button — single BEM root (.btn). Figma master \`2434:14483\`.

  Axes: style | size | iconButton. Interaction via CSS pseudo-classes.
  loading → .is-loading + spinner. Icons via {{> icon}} + buttonIconSize.
--}}
<button
  type="{{#if type}}{{type}}{{else}}button{{/if}}"
  class="btn btn--{{#if style}}{{lower style}}{{else}}primary{{/if}} btn--{{#if size}}{{lower size}}{{else}}l{{/if}}{{#if iconButton}} btn--icon-button{{/if}}{{#if loading}} is-loading{{/if}}"
  {{#if disabled}}disabled aria-disabled="true"{{/if}}
  {{#if loading}}aria-busy="true"{{/if}}
  {{#if accessibleLabel}}aria-label="{{accessibleLabel}}"{{/if}}
>
  {{#if loading}}
    <span class="btn__spinner" aria-hidden="true"></span>
  {{else}}
    {{#if iconButton}}
      <span class="btn__icon btn__icon--leading">
        {{> icon
          name=leadingIcon
          size=(buttonIconSize size)
          color="current"
          decorative=true
        }}
      </span>
    {{else}}
      {{#if showLeadingIcon}}
        <span class="btn__icon btn__icon--leading">
          {{> icon
            name=leadingIcon
            size=(buttonIconSize size)
            color="current"
            decorative=true
          }}
        </span>
      {{/if}}
    {{/if}}
  {{/if}}

  {{#unless iconButton}}
    <span class="btn__label">{{#if label}}{{label}}{{else}}Button{{/if}}</span>
  {{/unless}}

  {{#unless iconButton}}
    {{#if showTrailingIcon}}
      <span class="btn__icon btn__icon--trailing">
        {{> icon
          name=trailingIcon
          size=(buttonIconSize size)
          color="current"
          decorative=true
        }}
      </span>
    {{/if}}
  {{/unless}}
</button>
`})))()}function be(e){e.registerHelper(`buttonIconSize`,e=>String(e??``).toLowerCase()===`s`?`16`:`20`)}var F;function I(){return(I=t((()=>{F=`<span
  class="c-icon c-icon--{{size}} c-icon--{{color}}{{#if frame}}{{#unless (eq frame "none")}} c-icon--{{frame}}{{/unless}}{{/if}}"
  style="--icon-source: url('{{iconUrl name}}');"
  {{#if decorative}}
    aria-hidden="true"
  {{else}}
    role="img"
    aria-label="{{accessibleLabel}}"
  {{/if}}
></span>
`})))()}var L;function R(){return(R=t((()=>{L=`{{!--
  Components/Radio template — single BEM root (.c-radio) covering
  the Figma master variant set on Web-ODS Shared Library \`666:36462\`
  (LifeLock theme mode).

  Variant axes (mirror Figma master + spec.md \`## Variant axes\`):
    tone     default | accent | critical    [.c-radio--$tone]

  Persistent state:
    is-checked        [.is-checked]
    is-disabled       [.is-disabled]

  Interaction state (hover / focus / pressed) paints via CSS
  pseudo-classes on the underlying <input type="radio">. A
  data-state hook on the root lets the AllStyles gallery freeze
  each transient paint for visual regression.
--}}
{{#with this as |s|}}
<label
  class="c-radio c-radio--{{#if s.tone}}{{s.tone}}{{else}}default{{/if}}{{#if s.checked}} is-checked{{/if}}{{#if s.disabled}} is-disabled{{/if}}"
  data-component="radio"
  data-tone="{{#if s.tone}}{{s.tone}}{{else}}default{{/if}}"
  {{#if s.state}}data-state="{{s.state}}"{{/if}}
  {{#if s.disabled}}aria-disabled="true"{{/if}}
>
  <span class="c-radio__control" aria-hidden="true">
    <input
      type="radio"
      class="c-radio__input"
      {{#if s.checked}}checked{{/if}}
      {{#if s.disabled}}disabled{{/if}}
      name="{{s.name}}"
      value="{{s.value}}"
      {{#if s.accessibleLabel}}aria-label="{{s.accessibleLabel}}"{{else}}{{#unless s.label}}aria-label="Radio button"{{/unless}}{{/if}}
    >
    <span class="c-radio__state-circle" aria-hidden="true"></span>
    <span class="c-radio__box">
      <span class="c-radio__dot" aria-hidden="true"></span>
    </span>
  </span>
  {{#if s.label}}<span class="c-radio__label">{{s.label}}</span>{{/if}}
</label>
{{/with}}
`})))()}var z;function B(){return(B=t((()=>{z=`{{!--
  Components/Checkbox template — single BEM root (.c-checkbox)
  covering the Figma master variant set on Web-ODS Shared Library
  \`665:36315\` (LifeLock theme mode).

  Variant axes (mirror Figma master + spec.md \`## Variant axes\`):
    tone     default | accent | critical    [.c-checkbox--$tone]

  Persistent state (one of):
    is-checked        [.is-checked]
    is-indeterminate  [.is-indeterminate]
    (neither — unchecked is the default paint)

  Plus:
    is-disabled       [.is-disabled]

  Interaction state (hover / focus / pressed) paints via CSS
  pseudo-classes on the underlying <input type="checkbox">. A
  data-state hook on the root lets the AllStyles gallery freeze
  each transient paint for visual regression.
--}}
{{#with this as |s|}}
<label
  class="c-checkbox c-checkbox--{{#if s.tone}}{{s.tone}}{{else}}default{{/if}}{{#if (eq s.selection "checked")}} is-checked{{/if}}{{#if (eq s.selection "indeterminate")}} is-indeterminate{{/if}}{{#if s.disabled}} is-disabled{{/if}}"
  data-component="checkbox"
  data-tone="{{#if s.tone}}{{s.tone}}{{else}}default{{/if}}"
  {{#if s.state}}data-state="{{s.state}}"{{/if}}
  {{#if s.disabled}}aria-disabled="true"{{/if}}
>
  <span class="c-checkbox__control" aria-hidden="true">
    <input
      type="checkbox"
      class="c-checkbox__input"
      {{#if (eq s.selection "checked")}}checked{{/if}}
      {{#if s.disabled}}disabled{{/if}}
      {{#if s.name}}name="{{s.name}}"{{/if}}
      value="{{#if s.value}}{{s.value}}{{else}}on{{/if}}"
      {{#if s.accessibleLabel}}aria-label="{{s.accessibleLabel}}"{{else}}{{#unless s.label}}aria-label="Checkbox"{{/unless}}{{/if}}
    >
    <span class="c-checkbox__state-circle" aria-hidden="true"></span>
    <span class="c-checkbox__box">
      <span class="c-checkbox__glyph c-checkbox__glyph--check">
        {{> icon name="status/simple-checkmark-small" size="24" color="current" decorative=true}}
      </span>
      <span class="c-checkbox__glyph c-checkbox__glyph--dash">
        {{> icon name="actions/simple-minus" size="24" color="current" decorative=true}}
      </span>
    </span>
  </span>
  {{#if s.label}}<span class="c-checkbox__label">{{s.label}}</span>{{/if}}
</label>
{{/with}}
`})))()}var V;function H(){return(H=t((()=>{V=`{{!--
  Components/Switch template — single BEM root (.c-switch) covering
  the Figma master variant set on Web-ODS Shared Library \`717:48394\`
  (LifeLock theme mode).

  Variant axes (mirror Figma master + spec.md \`## Variant axes\`):
    tone     default | success | critical   [.c-switch--$tone]

  Persistent state:
    is-checked    [.is-checked]
    is-disabled   [.is-disabled]
    is-loading    [.is-loading]

  Interaction state (hover / focus / pressed) paints via CSS
  pseudo-classes on the underlying <input type="checkbox">. A
  data-state hook on the root lets the AllStyles gallery freeze
  each transient paint for visual regression.
--}}
{{#with this as |s|}}
<label
  class="c-switch c-switch--{{#if s.tone}}{{s.tone}}{{else}}default{{/if}}{{#if s.checked}} is-checked{{/if}}{{#if s.disabled}} is-disabled{{/if}}{{#if s.loading}} is-loading{{/if}}"
  data-component="switch"
  data-tone="{{#if s.tone}}{{s.tone}}{{else}}default{{/if}}"
  {{#if s.state}}data-state="{{s.state}}"{{/if}}
  {{#if s.disabled}}aria-disabled="true"{{/if}}
  {{#if s.loading}}aria-busy="true"{{/if}}
>
  <input
    type="checkbox"
    class="c-switch__input"
    role="switch"
    aria-checked="{{#if s.checked}}true{{else}}false{{/if}}"
    {{#if s.checked}}checked{{/if}}
    {{#if s.disabled}}disabled{{/if}}
    {{#if s.name}}name="{{s.name}}"{{/if}}
    value="{{#if s.value}}{{s.value}}{{else}}on{{/if}}"
    {{#if s.accessibleLabel}}aria-label="{{s.accessibleLabel}}"{{else}}{{#unless s.label}}aria-label="Toggle"{{/unless}}{{/if}}
  >
  <span class="c-switch__track" aria-hidden="true">
    <span class="c-switch__state-circle" aria-hidden="true"></span>
    <span class="c-switch__knob">
      {{#if s.loading}}
        <span class="c-switch__spinner" aria-hidden="true"></span>
      {{else}}
        {{#unless (eq s.showIcon false)}}
          <span class="c-switch__glyph">
            {{> icon name="status/simple-checkmark-small" size="16" color="current" decorative=true}}
          </span>
        {{/unless}}
      {{/if}}
    </span>
  </span>
  {{#if s.label}}<span class="c-switch__label">{{s.label}}</span>{{/if}}
</label>
{{/with}}
`})))()}var U;function W(){return(W=t((()=>{U=`{{!--
  Components/PaginationDots template — single BEM root
  (.c-pagination-dots) covering the Figma master variant set on
  Web-ODS Shared Library \`1278:1668\` (LifeLock theme mode).

  Variant axes (mirror Figma master + spec.md \`## Variant axes\`):
    appearance   light | dark   [.c-pagination-dots--$appearance]

  Numeric props:
    count        2..8  (dot count)
    current      1..count (1-indexed active position)

  Consumers may pass the prebuilt \`dots\` array (a list of \`{ active }\`
  objects of length \`count\`). When omitted, the Storybook story
  helper computes it from \`{ count, current }\` before render so the
  template only walks the array.
--}}
{{#with this as |s|}}
<nav
  class="c-pagination-dots c-pagination-dots--{{#if s.appearance}}{{s.appearance}}{{else}}light{{/if}}"
  data-component="pagination-dots"
  data-appearance="{{#if s.appearance}}{{s.appearance}}{{else}}light{{/if}}"
  aria-label="{{#if s.accessibleLabel}}{{s.accessibleLabel}}{{else}}Page {{s.current}} of {{s.count}}{{/if}}"
>
  <ol class="c-pagination-dots__list" role="list">
    {{#each s.dots}}
      {{#if this.active}}
        <li class="c-pagination-dots__dot c-pagination-dots__dot--active" aria-current="step"></li>
      {{else}}
        <li class="c-pagination-dots__dot"></li>
      {{/if}}
    {{/each}}
  </ol>
</nav>
{{/with}}
`})))()}var G;function K(){return(K=t((()=>{G=`{{!--
  Molecules/Logo Wrapper — BEM root .c-logo-wrapper
  Figma: Web-ODS Shared Library 3768:2718 (LockUp axis).

  Axes:
    lockUp  horizontal | stacked | checkmark  →  .c-logo-wrapper--{lockUp}

  Slots:
    src + alt  → native <img> filling the aspect-locked box
    (no src)   → documentation placeholder (not shipped to users)
--}}
<div
  class="c-logo-wrapper c-logo-wrapper--{{#if lockUp}}{{lockUp}}{{else}}horizontal{{/if}}{{#if className}} {{className}}{{/if}}"
>
  {{#if src}}
    <img
      class="c-logo-wrapper__image"
      src="{{src}}"
      alt="{{#if alt}}{{alt}}{{/if}}"
    />
  {{else}}
    <div class="c-logo-wrapper__placeholder" aria-hidden="true">
      <span class="c-logo-wrapper__placeholder-label">
        Placeholder<br />logo {{#if lockUp}}{{lockUp}}{{else}}horizontal{{/if}}
      </span>
    </div>
  {{/if}}
</div>
`})))()}var q;function J(){return(J=t((()=>{q=`{{!--
  Molecules/Image Wrapper — BEM root .c-image-wrapper
  Figma: Web-ODS Shared Library 5428:53699 (Ratio × Fit).

  Axes:
    ratio  2-1 | 16-9 | 4-3 | 1-1 | 3-4 | landscape | portrait | 1-2 | 9-16
           →  .c-image-wrapper--ratio-{ratio}
    fit    contain | cover  →  .c-image-wrapper--fit-{fit}

  Slots:
    src + alt  → native <img> filling the aspect-locked viewport
    (no src)   → documentation placeholder (not shipped to users)
--}}
<div
  class="c-image-wrapper c-image-wrapper--ratio-{{#if ratio}}{{ratio}}{{else}}16-9{{/if}} c-image-wrapper--fit-{{#if fit}}{{fit}}{{else}}cover{{/if}}{{#if className}} {{className}}{{/if}}"
>
  {{#if src}}
    <img
      class="c-image-wrapper__image"
      src="{{src}}"
      alt="{{#if alt}}{{alt}}{{/if}}"
    />
  {{else}}
    <div class="c-image-wrapper__placeholder" aria-hidden="true">
      <span class="c-image-wrapper__placeholder-label">
        Placeholder image<br />{{#if ratio}}{{ratio}}{{else}}16-9{{/if}} · {{#if fit}}{{fit}}{{else}}cover{{/if}}
      </span>
    </div>
  {{/if}}
</div>
`})))()}var Y;function X(){return(X=t((()=>{Y=`{{!--
  Molecules/Media — BEM root .c-media
  Figma: Web-ODS Shared Library 3412:17329 / Spec 3443:11387.

  Axes:
    type   image | video | youtube
    width  full | half  → .c-media--width-{full|half}
    objectFit cover|contain|fill|none|scale-down → .c-media--fit-{…}
--}}
<div
  class="c-media c-media--type-{{#if type}}{{lower type}}{{else}}image{{/if}} c-media--width-{{#if width}}{{lower width}}{{else}}full{{/if}} c-media--fit-{{#if objectFit}}{{lower objectFit}}{{else}}cover{{/if}}{{#if className}} {{className}}{{/if}}"
  {{#if aspectRatio}}style="aspect-ratio: {{aspectRatio}};"{{/if}}
>
  {{#if (eq (lower type) "video")}}
    {{#if src}}
      <video
        class="c-media__media"
        src="{{src}}"
        {{#if poster}}poster="{{poster}}"{{/if}}
        {{#unless (eq controls false)}}controls{{/unless}}
        {{#if autoPlay}}autoplay{{/if}}
        {{#if muted}}muted{{/if}}
        {{#if loop}}loop{{/if}}
        playsinline
      ></video>
    {{else}}
      <div class="c-media__placeholder" aria-hidden="true">
        <img class="c-media__placeholder-glyph" src="/assets/media/play-overlay.svg" alt="" />
      </div>
    {{/if}}
  {{else if (eq (lower type) "youtube")}}
    {{#if url}}
      <iframe
        class="c-media__media"
        src="{{youtubeEmbedUrl url}}"
        title="{{#if title}}{{title}}{{else}}YouTube video{{/if}}"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        {{#unless (eq allowFullScreen false)}}allowfullscreen{{/unless}}
        referrerpolicy="strict-origin-when-cross-origin"
      ></iframe>
    {{else if videoId}}
      <iframe
        class="c-media__media"
        src="{{youtubeEmbedUrl videoId}}"
        title="{{#if title}}{{title}}{{else}}YouTube video{{/if}}"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        {{#unless (eq allowFullScreen false)}}allowfullscreen{{/unless}}
        referrerpolicy="strict-origin-when-cross-origin"
      ></iframe>
    {{else}}
      <div class="c-media__placeholder" aria-hidden="true">
        <img class="c-media__placeholder-glyph" src="/assets/media/play-overlay.svg" alt="" />
      </div>
    {{/if}}
  {{else}}
    {{#if src}}
      <img
        class="c-media__media"
        src="{{src}}"
        alt="{{#if alt}}{{alt}}{{/if}}"
        loading="lazy"
        decoding="async"
      />
    {{else}}
      <div class="c-media__placeholder" aria-hidden="true">
        <img class="c-media__placeholder-glyph" src="/assets/media/placeholder.svg" alt="" />
      </div>
    {{/if}}
  {{/if}}
</div>
`})))()}function xe(e){let t=String(e??``).trim();if(!t)return``;if(/^[A-Za-z0-9_-]{11}$/.test(t))return`https://www.youtube.com/embed/${t}`;try{let e=new URL(t),n=e.hostname.replace(/^www\./,``);if(n===`youtu.be`){let t=e.pathname.split(`/`).filter(Boolean)[0];if(t&&/^[A-Za-z0-9_-]{11}$/.test(t))return`https://www.youtube.com/embed/${t}`}if(n===`youtube.com`||n===`m.youtube.com`||n===`youtube-nocookie.com`){let t=e.searchParams.get(`v`);if(t&&/^[A-Za-z0-9_-]{11}$/.test(t))return`https://www.youtube.com/embed/${t}`;let n=e.pathname.split(`/`).filter(Boolean),r=[`embed`,`shorts`,`live`,`v`];for(let e=0;e<n.length-1;e+=1)if(r.includes(n[e])&&/^[A-Za-z0-9_-]{11}$/.test(n[e+1]))return`https://www.youtube.com/embed/${n[e+1]}`}}catch{}return``}function Se(e){e.registerHelper(`youtubeEmbedUrl`,xe)}var Z;function Ce(){return(Ce=t((()=>{Z=`{{!--
  Molecules/Pricing — BEM root .c-pricing
  Figma: Web-ODS Shared Library 4070:2426 / Spec 4313:48.

  Axes:
    size              l | m | s | xs     → .c-pricing--size-{…}
    theme             default | inverse  → .c-pricing--theme-{…}
    currencyPosition  first | last       → .c-pricing--currency-{…}
    stackPeriod       true | false       → .c-pricing--stack-period
--}}
<span
  class="c-pricing c-pricing--size-{{#if size}}{{lower size}}{{else}}l{{/if}} c-pricing--theme-{{#if theme}}{{lower theme}}{{else}}default{{/if}} c-pricing--currency-{{#if currencyPosition}}{{lower currencyPosition}}{{else}}first{{/if}}{{#if stackPeriod}} c-pricing--stack-period{{/if}}{{#if className}} {{className}}{{/if}}"
  role="text"
  {{#if ariaLabel}}aria-label="{{ariaLabel}}"{{/if}}
>
  <span class="c-pricing__value">
    {{#unless (eq (lower currencyPosition) "last")}}
      <span class="c-pricing__currency">{{#if currency}}{{currency}}{{else}}\${{/if}}</span>
    {{/unless}}
    <span class="c-pricing__amount">{{#if amount}}{{amount}}{{else}}0{{/if}}</span>
    {{#if (eq (lower currencyPosition) "last")}}
      <span class="c-pricing__currency">{{#if currency}}{{currency}}{{else}}\${{/if}}</span>
    {{/if}}
  </span>
  {{#unless (eq showPeriod false)}}
    <span class="c-pricing__period">{{#if period}}{{period}}{{else}}/mo{{/if}}</span>
  {{/unless}}
</span>
`})))()}var we;function Te(){return(Te=t((()=>{we=`{{!--
  Patterns/Alert — unified master (.c-alert).
  Figma: Web-ODS Shared Library 537:28056 / Spec Frame 5399:1816 / board 5358:1619.

  Axes:
    tone       info | critical | attention | success | dark | brand
    hierarchy  low | high
    width      in-grid | full-bleed

  Booleans: showIcon, showBody, showButton, dismissible, elevation
  Presets in stories: Default / Toast / Passive (arg bundles — not a layout enum).

  Composes: {{> icon}} + {{> button}} (Size S).
--}}
<div
  class="c-alert c-alert--{{#if tone}}{{tone}}{{else}}info{{/if}} c-alert--{{#if hierarchy}}{{hierarchy}}{{else}}low{{/if}} c-alert--{{#if width}}{{width}}{{else}}in-grid{{/if}}{{#if elevation}} c-alert--elevated{{/if}}{{#if className}} {{className}}{{/if}}"
  role="{{#if (eq hierarchy "high")}}{{#if (eq tone "critical")}}alert{{else}}status{{/if}}{{else}}status{{/if}}"
  aria-live="{{#if (eq hierarchy "high")}}{{#if (eq tone "critical")}}assertive{{else}}polite{{/if}}{{else}}polite{{/if}}"
>
  {{#if showIcon}}
    <span class="c-alert__status-icon" aria-hidden="true">
      {{> icon
        name=(alertStatusIcon tone icon)
        size="20"
        color="current"
        decorative=true
      }}
    </span>
  {{/if}}

  <div class="c-alert__content">
    {{#if title}}
      <p class="c-alert__title">{{title}}</p>
    {{/if}}
    {{#if showBody}}
      {{#if description}}
        <p class="c-alert__description">{{description}}</p>
      {{/if}}
    {{/if}}
  </div>

  {{#if showButton}}
    {{#if ctaHref}}
      <a class="btn btn--{{alertCtaStyle hierarchy}} btn--s" href="{{ctaHref}}">
        <span class="btn__label">{{#if ctaLabel}}{{ctaLabel}}{{else}}Action{{/if}}</span>
      </a>
    {{else}}
      {{> button
        label=ctaLabel
        style=(alertCtaStyle hierarchy)
        size="s"
      }}
    {{/if}}
  {{/if}}

  {{#if dismissible}}
    <button
      type="button"
      class="c-alert__dismiss"
      data-alert-dismiss
      aria-label="{{#if dismissLabel}}{{dismissLabel}}{{else}}Dismiss{{/if}}"
    >
      {{> icon
        name="actions/simple-close"
        size="20"
        color="current"
        decorative=true
      }}
    </button>
  {{/if}}
</div>
`})))()}function Ee(e){e.registerHelper(`alertStatusIcon`,(e,t)=>{if(t)return t;let n={info:`status/simple-status-info`,critical:`status/simple-status-critical`,attention:`status/simple-status-attention`,success:`status/simple-status-ok`,dark:`status/simple-info`,brand:`status/simple-status-info`};return n[e]||n.info}),e.registerHelper(`alertCtaStyle`,e=>e===`high`?`secondary`:`primary`)}var De;function Oe(){return(Oe=t((()=>{De=`{{!--
  Molecules/Award Wrapper — BEM root .c-award-wrapper
  Figma: Web-ODS Shared Library 3762:246 (Image ratio axis).

  Axes:
    imageRatio  1:1 | 16:9 | 9:16  →  .c-award-wrapper--ratio-{1-1|16-9|9-16}

  Slots:
    src + alt  → native <img> filling the box
    (no src)   → documentation placeholder (not shipped to users)
--}}
<div
  class="c-award-wrapper c-award-wrapper--ratio-{{#if (eq imageRatio "16:9")}}16-9{{else}}{{#if (eq imageRatio "9:16")}}9-16{{else}}1-1{{/if}}{{/if}}{{#if className}} {{className}}{{/if}}"
>
  {{#if src}}
    <img
      class="c-award-wrapper__image"
      src="{{src}}"
      alt="{{#if alt}}{{alt}}{{/if}}"
    />
  {{else}}
    <div class="c-award-wrapper__placeholder" aria-hidden="true">
      <span class="c-award-wrapper__placeholder-label">
        Placeholder award<br />logo {{#if imageRatio}}{{imageRatio}}{{else}}1:1{{/if}}
      </span>
    </div>
  {{/if}}
</div>
`})))()}var ke;function Ae(){return(Ae=t((()=>{ke=`{{!--
  Patterns/Award item — BEM root .c-award-item
  Figma: Web-ODS Shared Library 2355:19639 / Spec Frame 3882:473.

  Axes:
    imageRatio  1:1 | 9:16 | 16:9  → passed to {{> award-wrapper}}
    layout      quote | title-rating | compact | compact-stacked |
                rating-stacked | title-description

  Stars: inline {{> icon}} until RatingTeaser / RatingInline onboard.
--}}
<div
  class="c-award-item c-award-item--layout-{{#if layout}}{{layout}}{{else}}quote{{/if}} c-award-item--ratio-{{#if (eq imageRatio "16:9")}}16-9{{else}}{{#if (eq imageRatio "9:16")}}9-16{{else}}1-1{{/if}}{{/if}}{{#if className}} {{className}}{{/if}}"
>
  <div class="c-award-item__media">
    {{> award-wrapper
      imageRatio=imageRatio
      src=src
      alt=alt
    }}
  </div>

  {{#unless (eq layout "rating-stacked")}}
    <div class="c-award-item__content">
      {{#if (eq layout "quote")}}
        {{#if quoteText}}
          <p class="c-award-item__quote">{{quoteText}}</p>
        {{/if}}
        {{#if source}}
          <p class="c-award-item__source">{{source}}</p>
        {{/if}}
        {{#if showRating}}
          <div class="c-award-item__rating" role="img" aria-label="{{#if ratingValue}}{{ratingValue}}{{else}}5{{/if}} out of 5 stars">
            {{> icon name="generic/simple-star-filled" size="24" color="current" decorative=true}}
            {{> icon name="generic/simple-star-filled" size="24" color="current" decorative=true}}
            {{> icon name="generic/simple-star-filled" size="24" color="current" decorative=true}}
            {{> icon name="generic/simple-star-filled" size="24" color="current" decorative=true}}
            {{> icon name="generic/simple-star-filled" size="24" color="current" decorative=true}}
          </div>
        {{/if}}
      {{/if}}

      {{#if (eq layout "title-rating")}}
        {{#if year}}
          <p class="c-award-item__year">{{year}}</p>
        {{/if}}
        {{#if title}}
          <p class="c-award-item__title">{{title}}</p>
        {{/if}}
        {{#if showRating}}
          <div class="c-award-item__rating" role="img" aria-label="{{#if ratingValue}}{{ratingValue}}{{else}}5{{/if}} out of 5 stars">
            {{> icon name="generic/simple-star-filled" size="24" color="current" decorative=true}}
            {{> icon name="generic/simple-star-filled" size="24" color="current" decorative=true}}
            {{> icon name="generic/simple-star-filled" size="24" color="current" decorative=true}}
            {{> icon name="generic/simple-star-filled" size="24" color="current" decorative=true}}
            {{> icon name="generic/simple-star-filled" size="24" color="current" decorative=true}}
          </div>
        {{/if}}
      {{/if}}

      {{#if (eq layout "compact")}}
        {{#if title}}
          <p class="c-award-item__title">{{title}}</p>
        {{/if}}
      {{/if}}

      {{#if (eq layout "compact-stacked")}}
        {{#if title}}
          <p class="c-award-item__title">{{title}}</p>
        {{/if}}
      {{/if}}

      {{#if (eq layout "title-description")}}
        {{#if title}}
          <p class="c-award-item__title">{{title}}</p>
        {{/if}}
        {{#if description}}
          <p class="c-award-item__description">{{description}}</p>
        {{/if}}
      {{/if}}
    </div>
  {{/unless}}

  {{#if (eq layout "rating-stacked")}}
    <div class="c-award-item__rating c-award-item__rating--inline" role="img" aria-label="{{#if ratingValue}}{{ratingValue}}{{else}}5.0{{/if}} out of 5 stars">
      <span class="c-award-item__score" aria-hidden="true">{{#if ratingValue}}{{ratingValue}}{{else}}5.0{{/if}}</span>
      {{> icon name="generic/simple-star-filled" size="24" color="current" decorative=true}}
    </div>
  {{/if}}
</div>
`})))()}var je;function Me(){return(Me=t((()=>{je=`{{!--
  Components/Text link template — single BEM root (.c-text-link)
  covering the Figma master variant set on Web-ODS Shared Library
  \`1332:54878\` (LifeLock theme mode).

  Variant axes (mirror Figma's master + spec.md § "Variant axes"):
    background  light | dark                       [.c-text-link--$bg]
    size        xs | sm | base | lg | xl |
                2xl | 3xl                          [.c-text-link--$size]
    weight      regular | medium | semibold |
                bold                               [.c-text-link--$weight]
    state       default | hover | focus | pressed |
                disabled | visited                  pseudo-classes only

  Persistent runtime states the markup carries:
    disabled    → aria-disabled="true" + tabindex="-1" + drops \`href\`
    visited     → :visited pseudo-class (browser-managed); the
                   \`forceVisited\` arg paints \`is-visited\` for the
                   AllStyles gallery only.

  Composes (per spec.md § "Composes"):
    icon partial — when \`iconTreatment="external"\` the canonical
    \`arrows-navigation/simple-link-external\` glyph trails the label;
    when \`iconTreatment="inline"\` a consumer-supplied \`iconName\`
    catalog key resolves through the partial. Icon paints in
    \`currentColor\` so it tracks every state without per-state
    overrides.

  Defaults (mirror spec.md § "Properties"):
    background    → "light"
    size          → "base"
    weight        → "regular"
    iconTreatment → "none"
    iconPosition  → "trailing"
    disabled      → false
--}}
<a
  class="c-text-link c-text-link--{{#if background}}{{lower background}}{{else}}light{{/if}} c-text-link--{{#if size}}{{lower size}}{{else}}base{{/if}} c-text-link--{{#if weight}}{{lower weight}}{{else}}regular{{/if}}{{#if (eq (lower iconTreatment) "external")}} c-text-link--has-icon c-text-link--has-icon-{{#if iconPosition}}{{lower iconPosition}}{{else}}trailing{{/if}}{{/if}}{{#if (eq (lower iconTreatment) "inline")}} c-text-link--has-icon c-text-link--has-icon-{{#if iconPosition}}{{lower iconPosition}}{{else}}trailing{{/if}}{{/if}}{{#if forceVisited}} is-visited{{/if}}"
  {{#if disabled}}
    role="link"
    aria-disabled="true"
    tabindex="-1"
  {{else}}
    href="{{href}}"
    {{#if target}}target="{{target}}"{{/if}}
    {{#if (eq target "_blank")}}rel="noopener noreferrer{{#if rel}} {{rel}}{{/if}}"{{else}}{{#if rel}}rel="{{rel}}"{{/if}}{{/if}}
  {{/if}}
  {{#if id}}id="{{id}}"{{/if}}
  {{#if ariaLabel}}aria-label="{{ariaLabel}}"{{/if}}
>
  {{#if (eq (lower iconPosition) "leading")}}
    {{#if (eq (lower iconTreatment) "external")}}
      {{> icon name="arrows-navigation/simple-link-external" size="20" color="current" decorative=true}}
    {{/if}}
    {{#if (eq (lower iconTreatment) "inline")}}
      {{#if iconName}}{{> icon name=iconName size="20" color="current" decorative=true}}{{/if}}
    {{/if}}
  {{/if}}
  <span class="c-text-link__label">{{label}}</span>
  {{#unless (eq (lower iconPosition) "leading")}}
    {{#if (eq (lower iconTreatment) "external")}}
      {{> icon name="arrows-navigation/simple-link-external" size="20" color="current" decorative=true}}
    {{/if}}
    {{#if (eq (lower iconTreatment) "inline")}}
      {{#if iconName}}{{> icon name=iconName size="20" color="current" decorative=true}}{{/if}}
    {{/if}}
  {{/unless}}
</a>
`})))()}var Ne;function Pe(){return(Pe=t((()=>{Ne=`{{!--
  Patterns/Breadcrumb — .c-breadcrumb
  Spec Frame \`.Breadcrumb · spec\` 4560:48; visual set 1260:8373.

  When \`dualList\` is true (expanded + trail ≥ 3), a second compact
  \`<ol>\` is rendered and SM CSS shows it (force-collapsed). When
  \`collapsed\` is true, only the compact trail is in the DOM.
--}}
<nav
  class="c-breadcrumb c-breadcrumb--first-as-icon-{{#if firstAsIcon}}yes{{else}}no{{/if}} c-breadcrumb--collapsed-{{#if collapsed}}yes{{else}}no{{/if}}{{#if dualList}} c-breadcrumb--dual{{/if}}"
  aria-label="{{#if ariaLabel}}{{ariaLabel}}{{else}}Breadcrumb{{/if}}"
>
  <ol class="c-breadcrumb__list{{#if dualList}} c-breadcrumb__list--expanded{{/if}}">
    {{#each items}}
      {{#if (eq kind "link")}}
        <li class="c-breadcrumb__item c-breadcrumb__item--link{{#if truncate}} c-breadcrumb__item--truncate{{/if}}">
          {{#if homeIconOnly}}
            <a
              class="c-breadcrumb__home"
              href="{{href}}"
              aria-label="{{#if ariaLabel}}{{ariaLabel}}{{else}}{{label}}{{/if}}"
            >
              {{#if ../iconType}}
                {{> icon name=../iconType size="16" color="current" decorative=true}}
              {{else}}
                {{> icon name="objects/simple-home" size="16" color="current" decorative=true}}
              {{/if}}
            </a>
          {{else}}
            {{> text-link
                href=href
                size="sm"
                weight="regular"
                label=label}}
          {{/if}}
        </li>
      {{else}}
        {{#if (eq kind "current")}}
          <li class="c-breadcrumb__item c-breadcrumb__item--current{{#if truncate}} c-breadcrumb__item--truncate{{/if}}">
            <span class="c-breadcrumb__current" aria-current="page">{{label}}</span>
          </li>
        {{else}}
          {{#if (eq kind "separator")}}
            <li class="c-breadcrumb__item c-breadcrumb__item--separator" aria-hidden="true">
              <span class="c-breadcrumb__chevron">
                {{> icon name="arrows-navigation/simple-chevron-right" size="16" color="current" decorative=true}}
              </span>
            </li>
          {{else}}
            {{#if (eq kind "ellipsis")}}
              <li class="c-breadcrumb__item c-breadcrumb__item--ellipsis">
                <span
                  class="c-breadcrumb__ellipsis"
                  role="text"
                  title="{{hiddenLabels}}"
                  aria-label="{{#if hiddenPagesLabel}}{{hiddenPagesLabel}}: {{/if}}{{hiddenLabels}}"
                >
                  {{> icon name="arrows-navigation/simple-more-horiz" size="16" color="current" decorative=true}}
                </span>
              </li>
            {{/if}}
          {{/if}}
        {{/if}}
      {{/if}}
    {{/each}}
  </ol>
  {{#if dualList}}
  {{!-- Compact trail: display:none on MD+ (out of a11y tree); SM shows this list. --}}
  <ol class="c-breadcrumb__list c-breadcrumb__list--collapsed">
    {{#each itemsCollapsed}}
      {{#if (eq kind "link")}}
        <li class="c-breadcrumb__item c-breadcrumb__item--link{{#if truncate}} c-breadcrumb__item--truncate{{/if}}">
          {{#if homeIconOnly}}
            <a
              class="c-breadcrumb__home"
              href="{{href}}"
              aria-label="{{#if ariaLabel}}{{ariaLabel}}{{else}}{{label}}{{/if}}"
            >
              {{#if ../iconType}}
                {{> icon name=../iconType size="16" color="current" decorative=true}}
              {{else}}
                {{> icon name="objects/simple-home" size="16" color="current" decorative=true}}
              {{/if}}
            </a>
          {{else}}
            {{> text-link
                href=href
                size="sm"
                weight="regular"
                label=label}}
          {{/if}}
        </li>
      {{else}}
        {{#if (eq kind "current")}}
          <li class="c-breadcrumb__item c-breadcrumb__item--current{{#if truncate}} c-breadcrumb__item--truncate{{/if}}">
            <span class="c-breadcrumb__current">{{label}}</span>
          </li>
        {{else}}
          {{#if (eq kind "separator")}}
            <li class="c-breadcrumb__item c-breadcrumb__item--separator" aria-hidden="true">
              <span class="c-breadcrumb__chevron">
                {{> icon name="arrows-navigation/simple-chevron-right" size="16" color="current" decorative=true}}
              </span>
            </li>
          {{else}}
            {{#if (eq kind "ellipsis")}}
              <li class="c-breadcrumb__item c-breadcrumb__item--ellipsis">
                <span class="c-breadcrumb__ellipsis" role="text" title="{{hiddenLabels}}">
                  {{> icon name="arrows-navigation/simple-more-horiz" size="16" color="current" decorative=true}}
                </span>
              </li>
            {{/if}}
          {{/if}}
        {{/if}}
      {{/if}}
    {{/each}}
  </ol>
  {{/if}}
</nav>
`})))()}var Fe;function Ie(){return(Ie=t((()=>{Fe=`{{!--
  Patterns/Content list — BEM root .c-content-list
  Figma: Web-ODS Shared Library Pattern / ContentList 3483:3503
  (item set 3483:3631).

  Axes:
    listType  unordered | ordered | nested  → tag + .c-content-list--$listType
    marker    bullet | icon                 → .c-content-list--marker-$marker
    surfaced  boolean                       → .c-content-list--surfaced

  items[]:
    text, type?, iconName?, checked?, name?, children?, childrenListType?
--}}
{{#with this as |list|}}
{{#if (eq list.listType "ordered")}}
<ol
  class="c-content-list c-content-list--ordered{{#if list.surfaced}} c-content-list--surfaced{{/if}}{{#if list.className}} {{list.className}}{{/if}}"
  data-component="content-list"
>
{{else}}
<ul
  class="c-content-list c-content-list--{{#if list.listType}}{{list.listType}}{{else}}unordered{{/if}} c-content-list--marker-{{#if list.marker}}{{list.marker}}{{else}}bullet{{/if}}{{#if list.surfaced}} c-content-list--surfaced{{/if}}{{#if list.className}} {{list.className}}{{/if}}"
  data-component="content-list"
>
{{/if}}
  {{#each list.items}}
    <li
      class="c-content-list__item{{#if type}} c-content-list__item--{{type}}{{else}} c-content-list__item--{{#if ../listType}}{{../listType}}{{else}}unordered{{/if}}{{/if}}"
    >
      {{#if (eq type "switch")}}
        {{> switch label=text checked=checked accessibleLabel=text showIcon=true}}
      {{else if (eq type "checkbox")}}
        {{#if checked}}
          {{> checkbox label=text selection="checked" accessibleLabel=text}}
        {{else}}
          {{> checkbox label=text selection="unchecked" accessibleLabel=text}}
        {{/if}}
      {{else if (eq type "radio")}}
        {{> radio label=text checked=checked accessibleLabel=text name=name}}
      {{else}}
        {{#if (eq ../listType "ordered")}}
          <span class="c-content-list__marker c-content-list__marker--text" aria-hidden="true">{{contentListOrderedMarker @index}}</span>
        {{else if (eq ../marker "icon")}}
          <span class="c-content-list__marker c-content-list__marker--icon" aria-hidden="true">
            {{> icon
              name=(contentListIconName iconName ../iconName)
              size="20"
              color="current"
              decorative=true
            }}
          </span>
        {{else}}
          <span class="c-content-list__marker c-content-list__marker--text" aria-hidden="true">•</span>
        {{/if}}
        <span class="c-content-list__body">{{#if text}}{{text}}{{else}}List item body text{{/if}}</span>
      {{/if}}

      {{#if children.length}}
        {{> content-list
          listType=childrenListType
          marker=../marker
          iconName=../iconName
          surfaced=false
          items=children
          className="c-content-list__child"
        }}
      {{/if}}
    </li>
  {{/each}}
{{#if (eq list.listType "ordered")}}
</ol>
{{else}}
</ul>
{{/if}}
{{/with}}
`})))()}function Le(e){e.registerHelper(`contentListOrderedMarker`,e=>{let t=Number(e);return`${Number.isFinite(t)?t+1:1}.`}),e.registerHelper(`contentListIconName`,(e,t)=>e||t||`status/simple-checkmark-small`)}var Re;function ze(){return(ze=t((()=>{Re=`{{!--
  Molecules/Content body — BEM root .c-content-body
  Figma: Web-ODS Shared Library component set 3483:3453 (canvas 3598:7414).

  Axes:
    style   body-3xl | body-2xl | body-xl | body-lg |
            body-base | body-sm | body-xs           → .c-content-body--$style
    weight  subtle | base | prominent | emphasis |
            strong                                   → .c-content-body--weight-$weight

  Content:
    text → paragraph body
--}}
<p
  class="c-content-body c-content-body--{{#if style}}{{style}}{{else}}body-3xl{{/if}} c-content-body--weight-{{#if weight}}{{weight}}{{else}}base{{/if}}{{#if className}} {{className}}{{/if}}"
>{{#if text}}{{text}}{{else}}Body text{{/if}}</p>
`})))()}var Be;function Ve(){return(Ve=t((()=>{Be=`{{!--
  Molecules/Content title — BEM root .c-content-title
  Figma: Web-ODS Shared Library set 3483:3436 (canvas 3598:7174, Spec 3637:48).

  Axes:
    style   h0 | h1 | h2 | h3 | h4 | h5 | h6 | h7  → .c-content-title--$style
    weight  subtle | base | prominent | emphasis |
            strong                                   → .c-content-title--weight-$weight
              (default emphasis = SemiBold)

  Content:
    text → heading string
    tag  → semantic element (h1–h6 | p); independent of Style
--}}
<{{#if tag}}{{tag}}{{else}}h2{{/if}}
  class="c-content-title c-content-title--{{#if style}}{{style}}{{else}}h0{{/if}} c-content-title--weight-{{#if weight}}{{weight}}{{else}}emphasis{{/if}}{{#if className}} {{className}}{{/if}}"
>{{#if text}}{{text}}{{else}}Heading{{/if}}</{{#if tag}}{{tag}}{{else}}h2{{/if}}>
`})))()}var He;function Ue(){return(Ue=t((()=>{He=`{{!--
  Patterns/Content block — BEM root .c-content-block
  Figma: Web-ODS Shared Library Pattern / ContentBlock 3483:3418
  (Content Slot 3483:3468, Spec Frame 3869:73).

  Props (defaults applied by story render / callers):
    title, titleStyle (h3|h0), titleTag, bodyText, showBody,
    showLink, linkLabel, linkHref,
    showButton, buttonIcon, buttonAccessibleLabel,
    slotHtml, className
--}}
<section
  class="c-content-block{{#if className}} {{className}}{{/if}}"
  data-component="content-block"
>
  <div class="c-content-block__title-row">
    <div class="c-content-block__title">
      {{> content-title
        text=title
        style=titleStyle
        weight="emphasis"
        tag=titleTag
      }}
    </div>
    {{#if showLink}}
      <div class="c-content-block__action">
        {{> text-link
          label=linkLabel
          href=linkHref
          background="light"
          size="base"
          weight="regular"
          iconTreatment="none"
        }}
      </div>
    {{else if showButton}}
      <div class="c-content-block__action">
        {{> button
          style="tertiary"
          size="s"
          iconButton=true
          leadingIcon=buttonIcon
          accessibleLabel=buttonAccessibleLabel
        }}
      </div>
    {{/if}}
  </div>

  {{#unless (eq showBody false)}}
    {{#if bodyText}}
      <div class="c-content-block__body">
        {{> content-body text=bodyText style="body-3xl" weight="base"}}
      </div>
    {{/if}}
  {{/unless}}

  {{#if slotHtml}}
    <div class="c-content-block__slot">
      {{{slotHtml}}}
    </div>
  {{/if}}
</section>
`})))()}var We;function Ge(){return(Ge=t((()=>{We=`{{!--
  Molecules/Discount label — BEM root .c-discount-label
  Figma: Web-ODS Shared Library set 1408:443 (page 539:28415, Spec 3024:48).

  Axes:
    background  primary | secondary | brand | brand-soft | accent |
                alpha | beta | gamma | delta | inverse-primary |
                inverse-secondary | success
    fill        solid | transparent | tint
    strength    base | 30 | 50 | 80   (base only with fill=solid)
    size        small

  Optional leading icon via {{> icon}} at 16×16, color=current.
--}}
<span
  class="c-discount-label c-discount-label--{{#if background}}{{lower background}}{{else}}primary{{/if}} c-discount-label--fill-{{#if fill}}{{lower fill}}{{else}}solid{{/if}} c-discount-label--strength-{{#if strength}}{{lower strength}}{{else}}base{{/if}} c-discount-label--size-{{#if size}}{{lower size}}{{else}}small{{/if}}"
  data-component="discount-label"
>
  {{#if showIcon}}
    <span class="c-discount-label__icon" aria-hidden="true">
      {{#if icon}}
        {{> icon name=icon size="16" color="current" decorative=true}}
      {{else}}
        {{> icon name="actions/simple-add" size="16" color="current" decorative=true}}
      {{/if}}
    </span>
  {{/if}}
  <span class="c-discount-label__text">{{#if text}}{{text}}{{else}}label{{/if}}</span>
</span>
`})))()}var Ke;function qe(){return(qe=t((()=>{Ke=`{{!--
  Patterns/Inputs/Text field template — one BEM root, five \`type\`
  structures branched with \`{{#if (eq type …)}}\`:

    text | password → native <input>
    select          → native <select> (UA arrow in fallback; the
                      ::picker(select) menu is styled only under
                      \`appearance: base-select\` in Chromium 135+)
    combined        → <select> + <input> inside one focus-within border
    split           → separate <select> box + <input> box

  The field title is a real <label for> and the helper message is wired
  via aria-describedby. \`error\` adds \`is-error\` + \`aria-invalid\` and
  recolours the helper. Password reveal renders BOTH eye glyphs (icon
  partial) and toggles them with the \`is-revealed\` class so the JS layer
  never injects icon markup.

  \`id\` defaults to "text-field" so a bare partial render still wires the
  label; consumers SHOULD pass a unique id when more than one field is on
  a page.
--}}
<div
  class="c-text-field c-text-field--type-{{#if type}}{{lower type}}{{else}}text{{/if}}{{#if error}} is-error{{/if}}{{#if disabled}} is-disabled{{/if}}"
  data-component="text-field"
  data-type="{{#if type}}{{lower type}}{{else}}text{{/if}}"
>
  {{#if label}}
    <label class="c-text-field__title" for="{{#if id}}{{id}}{{else}}text-field{{/if}}">
      <span class="c-text-field__title-text">{{label}}</span>
      {{#if required}}<span class="c-text-field__required" aria-hidden="true">*</span>{{/if}}
    </label>
  {{/if}}

  {{#if (eq type "select")}}
    <div class="c-text-field__control">
      <select
        class="c-text-field__field c-text-field__select"
        id="{{#if id}}{{id}}{{else}}text-field{{/if}}"
        {{#if name}}name="{{name}}"{{/if}}
        {{#if disabled}}disabled{{/if}}
        {{#if error}}aria-invalid="true"{{/if}}
        {{#if helperText}}aria-describedby="{{#if id}}{{id}}{{else}}text-field{{/if}}-helper"{{/if}}
      >
        {{#each selectOptions}}
          <option value="{{this.value}}"{{#if this.selected}} selected{{/if}}>{{this.label}}</option>
        {{/each}}
      </select>
    </div>
  {{else if (eq type "combined")}}
    <div class="c-text-field__control c-text-field__control--combined">
      <select
        class="c-text-field__select c-text-field__prefix"
        aria-label="{{#if prefixLabel}}{{prefixLabel}}{{else}}Prefix{{/if}}"
        {{#if disabled}}disabled{{/if}}
      >
        {{#each prefixOptions}}<option value="{{this.value}}"{{#if this.selected}} selected{{/if}}>{{this.label}}</option>{{/each}}
      </select>
      <span class="c-text-field__seam" aria-hidden="true"></span>
      <input
        class="c-text-field__field"
        id="{{#if id}}{{id}}{{else}}text-field{{/if}}"
        type="text"
        {{#if name}}name="{{name}}"{{/if}}
        {{#if value}}value="{{value}}"{{/if}}
        placeholder="{{placeholder}}"
        {{#if disabled}}disabled{{/if}}
        {{#if error}}aria-invalid="true"{{/if}}
        {{#if helperText}}aria-describedby="{{#if id}}{{id}}{{else}}text-field{{/if}}-helper"{{/if}}
      >
    </div>
  {{else if (eq type "split")}}
    <div class="c-text-field__control c-text-field__control--split">
      <div class="c-text-field__box c-text-field__box--prefix">
        <select
          class="c-text-field__select"
          aria-label="{{#if prefixLabel}}{{prefixLabel}}{{else}}Prefix{{/if}}"
          {{#if disabled}}disabled{{/if}}
        >
          {{#each prefixOptions}}<option value="{{this.value}}"{{#if this.selected}} selected{{/if}}>{{this.label}}</option>{{/each}}
        </select>
      </div>
      <div class="c-text-field__box">
        <input
          class="c-text-field__field"
          id="{{#if id}}{{id}}{{else}}text-field{{/if}}"
          type="text"
          {{#if name}}name="{{name}}"{{/if}}
          {{#if value}}value="{{value}}"{{/if}}
          placeholder="{{placeholder}}"
          {{#if disabled}}disabled{{/if}}
          {{#if error}}aria-invalid="true"{{/if}}
          {{#if helperText}}aria-describedby="{{#if id}}{{id}}{{else}}text-field{{/if}}-helper"{{/if}}
        >
      </div>
    </div>
  {{else}}
    <div class="c-text-field__control{{#if (eq type "password")}} c-text-field__control--password{{/if}}">
      <input
        class="c-text-field__field"
        id="{{#if id}}{{id}}{{else}}text-field{{/if}}"
        type="{{#if (eq type "password")}}password{{else}}text{{/if}}"
        {{#if name}}name="{{name}}"{{/if}}
        {{#if value}}value="{{value}}"{{/if}}
        placeholder="{{placeholder}}"
        {{#if (eq type "password")}}autocomplete="current-password"{{/if}}
        {{#if disabled}}disabled{{/if}}
        {{#if error}}aria-invalid="true"{{/if}}
        {{#if helperText}}aria-describedby="{{#if id}}{{id}}{{else}}text-field{{/if}}-helper"{{/if}}
      >
      {{#if (eq type "password")}}
        <button
          type="button"
          class="c-text-field__reveal"
          aria-label="Show password"
          aria-pressed="false"
          {{#if disabled}}disabled{{/if}}
        >
          <span class="c-text-field__reveal-icon c-text-field__reveal-icon--show">{{> icon name="generic/simple-visibility-on" size="20" color="current" decorative=true}}</span>
          <span class="c-text-field__reveal-icon c-text-field__reveal-icon--hide">{{> icon name="generic/simple-visibility-off" size="20" color="current" decorative=true}}</span>
        </button>
      {{/if}}
    </div>
  {{/if}}

  {{#if helperText}}
    <p class="c-text-field__helper" id="{{#if id}}{{id}}{{else}}text-field{{/if}}-helper">{{helperText}}</p>
  {{/if}}
</div>
`})))()}var Je;function Ye(){return(Ye=t((()=>{Je=`{{!--
  Patterns/Inputs/Search box template — one bordered :focus-within
  control around a native <input type="search">. A search glyph + a
  vertical separator lead the input (or trail it when iconFirst=false),
  and a clear (×) button shows at the inline-end once the field is
  filled. The native UA search-cancel button is suppressed in SCSS; the
  clear button is a real <button> so it is reachable + styleable
  cross-browser.

  Defaults: size → m, iconFirst → true, accessibleLabel → "Search".
--}}
<div
  class="c-search-box c-search-box--{{#if size}}{{lower size}}{{else}}m{{/if}}{{#unless iconFirst}} c-search-box--icon-last{{/unless}}{{#if value}} is-filled{{/if}}{{#if disabled}} is-disabled{{/if}}"
  data-component="search-box"
  data-size="{{#if size}}{{lower size}}{{else}}m{{/if}}"
>
  {{#if iconFirst}}
    <span class="c-search-box__icon" aria-hidden="true">{{> icon name="actions/simple-search" size="24" color="current" decorative=true}}</span>
    <span class="c-search-box__separator" aria-hidden="true"></span>
  {{/if}}

  <input
    class="c-search-box__input"
    type="search"
    {{#if name}}name="{{name}}"{{/if}}
    {{#if value}}value="{{value}}"{{/if}}
    placeholder="{{#if placeholder}}{{placeholder}}{{else}}Search{{/if}}"
    aria-label="{{#if accessibleLabel}}{{accessibleLabel}}{{else}}Search{{/if}}"
    autocomplete="off"
    {{#if disabled}}disabled{{/if}}
  >

  <button
    type="button"
    class="c-search-box__clear"
    aria-label="{{#if clearLabel}}{{clearLabel}}{{else}}Clear search{{/if}}"
    {{#if disabled}}disabled{{/if}}
  >
    {{> icon name="actions/simple-close" size="24" color="current" decorative=true}}
  </button>

  {{#unless iconFirst}}
    <span class="c-search-box__separator" aria-hidden="true"></span>
    <span class="c-search-box__icon" aria-hidden="true">{{> icon name="actions/simple-search" size="24" color="current" decorative=true}}</span>
  {{/unless}}
</div>
`})))()}var Xe;function Ze(){return(Ze=t((()=>{Xe=`{{!--
  Patterns/Inputs/Code entry template — a segmented one-time-code (OTP)
  field: \`length\` single-character native <input> boxes wrapped in a
  labelled role="group", with an optional helper message. The per-box
  descriptors come from the \`codeBoxes\` helper (index / position / total
  / char); \`value\` is distributed one character per box. The JS layer
  adds auto-advance, backspace-to-previous, and paste-spread.

  Defaults: length → 6, group label → "Verification code".
--}}
<div
  class="c-code-entry{{#if error}} is-error{{/if}}{{#if disabled}} is-disabled{{/if}}"
  data-component="code-entry"
  data-length="{{#if length}}{{length}}{{else}}6{{/if}}"
  role="group"
  aria-label="{{#if label}}{{label}}{{else}}Verification code{{/if}}"
  {{#if helperText}}aria-describedby="{{#if groupId}}{{groupId}}{{else}}code-entry{{/if}}-helper"{{/if}}
>
  {{#if label}}
    <span class="c-code-entry__label">{{label}}</span>
  {{/if}}

  <div class="c-code-entry__boxes">
    {{#each (codeBoxes length value)}}
      <input
        class="c-code-entry__box{{#if this.char}} is-filled{{/if}}"
        type="text"
        inputmode="numeric"
        autocomplete="{{#if this.index}}off{{else}}one-time-code{{/if}}"
        maxlength="1"
        pattern="[0-9]*"
        aria-label="Digit {{this.position}} of {{this.total}}"
        data-index="{{this.index}}"
        {{#if this.char}}value="{{this.char}}"{{/if}}
        {{#if ../error}}aria-invalid="true"{{/if}}
        {{#if ../disabled}}disabled{{/if}}
      >
    {{/each}}
  </div>

  {{#if helperText}}
    <p class="c-code-entry__helper" id="{{#if groupId}}{{groupId}}{{else}}code-entry{{/if}}-helper">{{helperText}}</p>
  {{/if}}
</div>
`})))()}var Qe;function $e(){return($e=t((()=>{Qe=`{{!--
  Molecules/Menu list — BEM root .c-menu-list
  Figma: Web-ODS Shared Library MenuList 1396:5517 (page 4298:1925,
  Spec Frame .Menu list · spec 4646:265).

  Axes / props:
    type              row | divider | caption
    size              large | small
    selected          boolean (row only)
    leftIcon          boolean
    rightIcon         boolean
    loadingIcon       boolean (overrides right icon visually)
    showRightBorder   boolean
    showDividerAbove  boolean
    edgePadding       boolean (default true)
    text              string
    href              optional — renders as <a> when set (row)
    leftIconName / rightIconName / loadingIconName  catalog keys
    disabled          boolean
    selectionMode     page | choice  → aria-current vs aria-selected
    role              menuitem | listitem (default menuitem for row)
    className

  Callers should resolve icon sizes / default catalog keys before render
  when convenient; defaults below match Spec (Large 24 / Small 16).
--}}
{{#if (eq (lower type) "divider")}}
<li
  class="c-menu-list c-menu-list--divider c-menu-list--size-{{#if size}}{{lower size}}{{else}}large{{/if}}{{#if className}} {{className}}{{/if}}"
  data-component="menu-list"
  role="separator"
  aria-hidden="true"
>
  <hr class="c-menu-list__rule" />
</li>
{{else if (eq (lower type) "caption")}}
<li
  class="c-menu-list c-menu-list--caption c-menu-list--size-{{#if size}}{{lower size}}{{else}}large{{/if}}{{#unless (eq edgePadding false)}} c-menu-list--edge-pad{{/unless}}{{#if showDividerAbove}} c-menu-list--divider-above{{/if}}{{#if showRightBorder}} c-menu-list--right-border{{/if}}{{#if className}} {{className}}{{/if}}"
  data-component="menu-list"
  role="presentation"
>
  <span class="c-menu-list__caption">{{#if text}}{{text}}{{else}}Caption{{/if}}</span>
</li>
{{else}}
<li
  class="c-menu-list c-menu-list--row c-menu-list--size-{{#if size}}{{lower size}}{{else}}large{{/if}}{{#if selected}} is-selected{{/if}}{{#if disabled}} is-disabled{{/if}}{{#if loadingIcon}} is-loading{{/if}}{{#unless (eq edgePadding false)}} c-menu-list--edge-pad{{/unless}}{{#if showDividerAbove}} c-menu-list--divider-above{{/if}}{{#if showRightBorder}} c-menu-list--right-border{{/if}}{{#if className}} {{className}}{{/if}}"
  data-component="menu-list"
  role="{{#if role}}{{role}}{{else}}menuitem{{/if}}"
  {{#if selected}}
    {{#if (eq selectionMode "page")}}aria-current="page"{{else}}aria-selected="true"{{/if}}
  {{/if}}
  {{#if loadingIcon}}aria-busy="true"{{/if}}
  {{#if disabled}}aria-disabled="true"{{/if}}
>
  {{#if href}}
  <a
    class="c-menu-list__control"
    href="{{href}}"
    {{#if disabled}}tabindex="-1" aria-disabled="true"{{/if}}
    {{#if target}}target="{{target}}"{{/if}}
  >
  {{else}}
  <button
    class="c-menu-list__control"
    type="button"
    {{#if disabled}}disabled{{/if}}
  >
  {{/if}}
    {{#if leftIcon}}
      <span class="c-menu-list__icon c-menu-list__icon--leading" aria-hidden="true">
        {{#if (eq (lower size) "small")}}
          {{#if leftIconName}}
            {{> icon name=leftIconName size="16" color="current" decorative=true}}
          {{else}}
            {{> icon name="status/simple-checkmark" size="16" color="current" decorative=true}}
          {{/if}}
        {{else}}
          {{#if leftIconName}}
            {{> icon name=leftIconName size="24" color="current" decorative=true}}
          {{else}}
            {{> icon name="status/simple-checkmark" size="24" color="current" decorative=true}}
          {{/if}}
        {{/if}}
      </span>
    {{/if}}
    <span class="c-menu-list__label">{{#if text}}{{text}}{{else}}Menu item{{/if}}</span>
    {{#if loadingIcon}}
      <span class="c-menu-list__icon c-menu-list__icon--trailing c-menu-list__icon--loading" aria-hidden="true">
        {{#if (eq (lower size) "small")}}
          {{#if loadingIconName}}
            {{> icon name=loadingIconName size="16" color="current" decorative=true}}
          {{else}}
            {{> icon name="actions/simple-reload" size="16" color="current" decorative=true}}
          {{/if}}
        {{else}}
          {{#if loadingIconName}}
            {{> icon name=loadingIconName size="24" color="current" decorative=true}}
          {{else}}
            {{> icon name="actions/simple-reload" size="24" color="current" decorative=true}}
          {{/if}}
        {{/if}}
      </span>
    {{else if rightIcon}}
      <span class="c-menu-list__icon c-menu-list__icon--trailing" aria-hidden="true">
        {{#if (eq (lower size) "small")}}
          {{#if rightIconName}}
            {{> icon name=rightIconName size="16" color="current" decorative=true}}
          {{else}}
            {{> icon name="arrows-navigation/simple-chevron-right" size="16" color="current" decorative=true}}
          {{/if}}
        {{else}}
          {{#if rightIconName}}
            {{> icon name=rightIconName size="24" color="current" decorative=true}}
          {{else}}
            {{> icon name="arrows-navigation/simple-chevron-right" size="24" color="current" decorative=true}}
          {{/if}}
        {{/if}}
      </span>
    {{/if}}
  {{#if href}}
  </a>
  {{else}}
  </button>
  {{/if}}
</li>
{{/if}}
`})))()}var et;function tt(){return(tt=t((()=>{et=`{{!--
  Patterns/Menu block — BEM root .c-menu-block
  Figma: Web-ODS Shared Library MenuBlock 1396:4886 (page 539:28419,
  Spec Frame .Menu block · spec 4647:135).

  Props:
    type             simple | with-caption
    size             large | small
    showDropShadow   boolean (default true)
    showKeyline      boolean (default true)
    mode             static | popup (default static)
    listRole         menu | list
    items            array of menu-list args
    slotHtml         raw HTML for the items slot (escape hatch)
    id               optional root id
    hidden           boolean — initial hidden for popup
    className
--}}
<div
  class="c-menu-block c-menu-block--{{#if type}}{{lower type}}{{else}}simple{{/if}} c-menu-block--size-{{#if size}}{{lower size}}{{else}}large{{/if}}{{#unless (eq showDropShadow false)}} c-menu-block--shadow{{/unless}}{{#unless (eq showKeyline false)}} c-menu-block--keyline{{/unless}}{{#if (eq mode "popup")}} c-menu-block--popup{{/if}}{{#if className}} {{className}}{{/if}}"
  data-component="menu-block"
  data-mode="{{#if mode}}{{mode}}{{else}}static{{/if}}"
  {{#if id}}id="{{id}}"{{/if}}
  {{#if hidden}}hidden{{/if}}
>
  <ul
    class="c-menu-block__items"
    role="{{#if listRole}}{{listRole}}{{else}}{{#if (eq mode "popup")}}menu{{else}}list{{/if}}{{/if}}"
  >
    {{#if slotHtml}}
      {{{slotHtml}}}
    {{else}}
      {{#each items}}
        {{> menu-list
          type=type
          size=../size
          text=text
          selected=selected
          leftIcon=leftIcon
          rightIcon=rightIcon
          loadingIcon=loadingIcon
          showRightBorder=showRightBorder
          showDividerAbove=showDividerAbove
          edgePadding=edgePadding
          disabled=disabled
          href=href
          leftIconName=leftIconName
          rightIconName=rightIconName
          loadingIconName=loadingIconName
          selectionMode=selectionMode
          role=role
        }}
      {{else}}
        {{> menu-list type="row" size=size text="Menu item"}}
      {{/each}}
    {{/if}}
  </ul>
</div>
`})))()}var nt;function rt(){return(rt=t((()=>{nt=`{{!--
  Components/Progress indicator template — single BEM root
  (.c-progress-indicator) covering the Figma Linear master variant set
  on Web-ODS Shared Library \`1380:1255\` and the \`Progress indicator —
  Overview\` Spec Frame at \`1380:1478\`, plus the LifeLock-mode Circular
  sticker sheet at \`615:80630\`.

  Variant axes (mirror Figma's master + spec.md § "Variant axes"):
    layout      inline | stacked | circular  [.c-progress-indicator--$layout]
    theme       light | dark                 [.c-progress-indicator--$theme]
    value       0..100 (continuous)          [--progress-indicator-value inline custom-prop]
    label       <string>                     [text content of .c-progress-indicator__label, linear only]
    showLabel   true | false                 [linear: label slot present | omitted;
                                              circular: inner value text present | omitted]
    size        xs | sm | md | lg | xxl      [.c-progress-indicator--$size; circular only]

  Stateless — no \`:hover\` / \`:focus-visible\` / \`:active\` paints and no
  JavaScript. The component reflects the application's progress value
  to the user but does not accept input. Root carries
  \`role="progressbar"\` + \`aria-valuenow/min/max\` so assistive tech
  announces live updates.

  Accessibility:
    - Linear — when \`showLabel=true\` and \`label\` non-empty, the label
      node carries an \`id\` and the root carries \`aria-labelledby\`.
      When \`showLabel=false\`, the consumer supplies \`accessibleLabel\`
      and the root carries \`aria-label\`.
    - Circular — the inner value text is decorative (wrapped in
      \`aria-hidden="true"\` to avoid double-announcement against
      \`aria-valuenow\`). The consumer always supplies
      \`accessibleLabel\` so the root carries \`aria-label\` (e.g.
      "Setup progress, 50 percent complete").

  Defaults:
    layout    → "stacked"
    theme     → "light"
    value     → "50"
    label     → "Label"
    showLabel → true
    size      → "md"  (circular layout only)
--}}
{{!--
  Resolve the variant once so the rendered BEM modifier always
  matches a real published Figma variant value.
--}}
<div
  class="c-progress-indicator c-progress-indicator--{{#if layout}}{{lower layout}}{{else}}stacked{{/if}} c-progress-indicator--{{#if theme}}{{lower theme}}{{else}}light{{/if}}{{#if (eq layout "circular")}} c-progress-indicator--{{#if size}}{{lower size}}{{else}}md{{/if}}{{/if}}"
  role="progressbar"
  aria-valuenow="{{#if value}}{{value}}{{else}}50{{/if}}"
  aria-valuemin="{{#if valueMin}}{{valueMin}}{{else}}0{{/if}}"
  aria-valuemax="{{#if valueMax}}{{valueMax}}{{else}}100{{/if}}"
  {{#if (eq layout "circular")}}
    {{#if accessibleLabel}}aria-label="{{accessibleLabel}}"{{/if}}
  {{else}}
    {{#if (eq showLabel false)}}
      {{#if accessibleLabel}}aria-label="{{accessibleLabel}}"{{/if}}
    {{else}}
      {{#if label}}aria-labelledby="progress-indicator-label-{{#if id}}{{id}}{{else}}default{{/if}}"{{else}}{{#if accessibleLabel}}aria-label="{{accessibleLabel}}"{{/if}}{{/if}}
    {{/if}}
  {{/if}}
  style="--progress-indicator-value: {{#if value}}{{value}}{{else}}50{{/if}};"
>
  {{#if (eq layout "circular")}}
    {{!--
      Circular layout — two SVG circles (track + fill) overlaid on a
      square container. \`pathLength="100"\` lets \`stroke-dasharray:
      var(--progress-indicator-value) 100\` read as a percent of the
      circumference regardless of radius, so no JS circumference math
      is needed. \`vector-effect="non-scaling-stroke"\` keeps the stroke
      width literally in CSS px (driven by \`--progress-indicator-circular-stroke\`)
      no matter how the SVG is sized. The SVG is rotated -90° via SCSS
      so the dash array starts at 12 o'clock.
    --}}
    <svg
      class="c-progress-indicator__ring"
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        class="c-progress-indicator__ring-track"
        cx="50"
        cy="50"
        r="45"
        pathLength="100"
      />
      <circle
        class="c-progress-indicator__ring-fill"
        cx="50"
        cy="50"
        r="45"
        pathLength="100"
      />
    </svg>
    {{#unless (eq showLabel false)}}
      <span class="c-progress-indicator__value" aria-hidden="true">
        <span class="c-progress-indicator__value-num">{{#if value}}{{value}}{{else}}50{{/if}}</span><span class="c-progress-indicator__value-unit">%</span>
      </span>
    {{/unless}}
  {{else}}
    {{#unless (eq showLabel false)}}
      {{#if label}}
        <span
          class="c-progress-indicator__label"
          id="progress-indicator-label-{{#if id}}{{id}}{{else}}default{{/if}}"
        >{{label}}</span>
      {{/if}}
    {{/unless}}
    <span class="c-progress-indicator__track" aria-hidden="true">
      <span class="c-progress-indicator__fill"></span>
      <span class="c-progress-indicator__spacer"></span>
    </span>
  {{/if}}
</div>
`})))()}var it;function at(){return(at=t((()=>{it=`{{!--
  Patterns/Modal — BEM root .c-modal
  Figma: Modal set 1344:18518 / Overview 1359:21341 / page 539:28427.

  Props:
    variant          standard | scrollable | media
    size             sm | md | lg
    title            string
    body             string
    mediaHtml        optional HTML for media variant
    primaryLabel     string (default Continue)
    secondaryLabel   string (default Cancel)
    showSecondary    boolean (default true)
    showClose        boolean (default true)
    open             boolean — omit hidden when true
    id               string — required for trigger aria-controls
    labelledById     optional override for aria-labelledby
    describedById    optional override for aria-describedby
    className
--}}
<div
  class="c-modal c-modal--{{#if variant}}{{lower variant}}{{else}}standard{{/if}} c-modal--{{#if size}}{{lower size}}{{else}}md{{/if}}{{#if className}} {{className}}{{/if}}"
  data-component="modal"
  role="dialog"
  aria-modal="true"
  {{#if id}}id="{{id}}"{{/if}}
  aria-labelledby="{{#if labelledById}}{{labelledById}}{{else}}{{#if id}}{{id}}-title{{else}}modal-title{{/if}}{{/if}}"
  {{#if body}}aria-describedby="{{#if describedById}}{{describedById}}{{else}}{{#if id}}{{id}}-body{{else}}modal-body{{/if}}{{/if}}"{{/if}}
  {{#unless open}}hidden{{/unless}}
>
  <div class="c-modal__backdrop" data-modal-backdrop tabindex="-1"></div>
  <div class="c-modal__card" role="document" data-modal-card>
    <div class="c-modal__header">
      <h2 class="c-modal__title" id="{{#if id}}{{id}}-title{{else}}modal-title{{/if}}">
        {{#if title}}{{title}}{{else}}Modal title{{/if}}
      </h2>
      {{#unless (eq showClose false)}}
        <button
          type="button"
          class="c-modal__close"
          data-modal-close
          aria-label="{{#if closeLabel}}{{closeLabel}}{{else}}Close{{/if}}"
        >
          {{> icon name="actions/simple-close" size="20" color="current" decorative=true}}
        </button>
      {{/unless}}
    </div>

    {{#if (eq (lower variant) "media")}}
      <div class="c-modal__media">
        {{#if mediaHtml}}
          {{{mediaHtml}}}
        {{else}}
          <div class="c-modal__media-placeholder" aria-hidden="true"></div>
        {{/if}}
      </div>
    {{/if}}

    {{#if body}}
      <div
        class="c-modal__body{{#if (eq (lower variant) "scrollable")}} c-modal__body--scroll{{/if}}"
        id="{{#if id}}{{id}}-body{{else}}modal-body{{/if}}"
      >
        <p class="c-modal__description">{{body}}</p>
      </div>
    {{/if}}

    <div class="c-modal__footer">
      {{#unless (eq showSecondary false)}}
        {{#if secondaryLabel}}
          {{> button style="text" size="m" label=secondaryLabel className="c-modal__action c-modal__action--secondary"}}
        {{else}}
          {{> button style="text" size="m" label="Cancel" className="c-modal__action c-modal__action--secondary"}}
        {{/if}}
      {{/unless}}
      {{#if primaryLabel}}
        {{> button style="primary" size="m" label=primaryLabel className="c-modal__action c-modal__action--primary"}}
      {{else}}
        {{> button style="primary" size="m" label="Continue" className="c-modal__action c-modal__action--primary"}}
      {{/if}}
    </div>
  </div>
</div>
`})))()}var ot;function st(){return(st=t((()=>{ot=`{{!--
  Patterns/Pagination — BEM root .c-pagination
  Figma: page 539:28422 / Overview 1332:53851
    Nav 1332:52356 · Select 1332:52459 · Jump 1332:52580

  Props:
    type            nav | select | jump
    currentPage     number
    totalPages      number
    pages           prebuilt nav items (kind page|ellipsis)
    selectItems     menu-list args for select open list
    showFirstLast   boolean (nav)
    disabled        boolean
    error           boolean
    errorMessage    string
    size            large | small (jump)
    jumpType        labelled | icon-only (jump)
    jumpLabel       string
    jumpValue       string/number for input
    selectLabel     string
    open            boolean (select list open)
    id
    className
--}}
{{#if (eq (lower type) "select")}}
<div
  class="c-pagination c-pagination--select{{#if disabled}} is-disabled{{/if}}{{#if error}} is-error{{/if}}{{#if open}} is-open{{/if}}{{#if className}} {{className}}{{/if}}"
  data-component="pagination"
  data-pagination-type="select"
  {{#if id}}id="{{id}}"{{/if}}
>
  <button
    type="button"
    class="c-pagination__select-trigger"
    data-pagination-select-trigger
    aria-haspopup="listbox"
    aria-expanded="{{#if open}}true{{else}}false{{/if}}"
    {{#if disabled}}disabled{{/if}}
  >
    <span class="c-pagination__select-label">
      {{#if selectLabel}}{{selectLabel}}{{else}}Page {{#if currentPage}}{{currentPage}}{{else}}1{{/if}}{{/if}}
    </span>
    {{> icon name="arrows-navigation/simple-down" size="16" color="current" decorative=true}}
  </button>
  {{#if open}}
    {{> menu-block
      type="simple"
      size="large"
      mode="static"
      listRole="listbox"
      showDropShadow=true
      showKeyline=true
      items=selectItems
      className="c-pagination__select-menu"
    }}
  {{/if}}
  {{#if error}}
    {{#if errorMessage}}
      <p class="c-pagination__error" role="alert">{{errorMessage}}</p>
    {{/if}}
  {{/if}}
</div>
{{else if (eq (lower type) "jump")}}
<div
  class="c-pagination c-pagination--jump c-pagination--size-{{#if size}}{{lower size}}{{else}}large{{/if}} c-pagination--jump-{{#if jumpType}}{{lower jumpType}}{{else}}labelled{{/if}}{{#if disabled}} is-disabled{{/if}}{{#if error}} is-error{{/if}}{{#if className}} {{className}}{{/if}}"
  data-component="pagination"
  data-pagination-type="jump"
  {{#if id}}id="{{id}}"{{/if}}
>
  <label class="c-pagination__jump-label" for="{{#if id}}{{id}}-input{{else}}pagination-jump{{/if}}">
    {{#if jumpFieldLabel}}{{jumpFieldLabel}}{{else}}Go to page{{/if}}
  </label>
  <div class="c-pagination__jump-row">
    <input
      class="c-pagination__jump-input"
      id="{{#if id}}{{id}}-input{{else}}pagination-jump{{/if}}"
      type="number"
      inputmode="numeric"
      min="1"
      max="{{#if totalPages}}{{totalPages}}{{else}}1{{/if}}"
      value="{{jumpValue}}"
      data-pagination-jump-input
      {{#if disabled}}disabled{{/if}}
      aria-invalid="{{#if error}}true{{else}}false{{/if}}"
    />
    {{#if (eq (lower jumpType) "icon-only")}}
      <button
        type="button"
        class="btn btn--primary btn--m btn--icon-button c-pagination__jump-submit"
        data-pagination-jump-submit
        aria-label="{{#if jumpLabel}}{{jumpLabel}}{{else}}Go to page{{/if}}"
        {{#if disabled}}disabled{{/if}}
      >
        {{> icon name="arrows-navigation/simple-chevron-right" size="16" color="current" decorative=true}}
      </button>
    {{else}}
      <button
        type="button"
        class="btn btn--primary btn--m c-pagination__jump-submit"
        data-pagination-jump-submit
        {{#if disabled}}disabled{{/if}}
      >
        <span class="btn__label">{{#if jumpLabel}}{{jumpLabel}}{{else}}Go{{/if}}</span>
      </button>
    {{/if}}
  </div>
  {{#if error}}
    {{#if errorMessage}}
      <p class="c-pagination__error" role="alert">{{errorMessage}}</p>
    {{/if}}
  {{/if}}
</div>
{{else}}
<nav
  class="c-pagination c-pagination--nav{{#if disabled}} is-disabled{{/if}}{{#if error}} is-error{{/if}}{{#if className}} {{className}}{{/if}}"
  data-component="pagination"
  data-pagination-type="nav"
  aria-label="{{#if accessibleLabel}}{{accessibleLabel}}{{else}}Pagination{{/if}}"
  {{#if id}}id="{{id}}"{{/if}}
>
  <ul class="c-pagination__list" role="list">
    {{#if showFirstLast}}
      <li class="c-pagination__item">
        <button
          type="button"
          class="c-pagination__control c-pagination__control--first"
          data-pagination-page="1"
          aria-label="First page"
          {{#if disabled}}disabled{{/if}}
          {{#if (eq currentPage 1)}}disabled{{/if}}
        >
          <span class="c-pagination__double-chevron" aria-hidden="true">
            {{> icon name="arrows-navigation/simple-chevron-left" size="20" color="current" decorative=true}}
            {{> icon name="arrows-navigation/simple-chevron-left" size="20" color="current" decorative=true}}
          </span>
        </button>
      </li>
    {{/if}}
    <li class="c-pagination__item">
      <button
        type="button"
        class="c-pagination__control c-pagination__control--prev"
        data-pagination-step="-1"
        aria-label="Previous page"
        {{#if disabled}}disabled{{/if}}
        {{#if (eq currentPage 1)}}disabled{{/if}}
      >
        {{> icon name="arrows-navigation/simple-chevron-left" size="24" color="current" decorative=true}}
      </button>
    </li>
    {{#each pages}}
      {{#if (eq kind "ellipsis")}}
        <li class="c-pagination__item c-pagination__item--ellipsis" aria-hidden="true">
          <span class="c-pagination__ellipsis">…</span>
        </li>
      {{else}}
        <li class="c-pagination__item">
          <button
            type="button"
            class="c-pagination__control c-pagination__control--page{{#if current}} is-current{{/if}}"
            data-pagination-page="{{page}}"
            aria-label="Page {{page}}"
            {{#if current}}aria-current="page"{{/if}}
            {{#if ../disabled}}disabled{{/if}}
          >{{page}}</button>
        </li>
      {{/if}}
    {{/each}}
    <li class="c-pagination__item">
      <button
        type="button"
        class="c-pagination__control c-pagination__control--next"
        data-pagination-step="1"
        aria-label="Next page"
        {{#if disabled}}disabled{{/if}}
        {{#if (eq currentPage totalPages)}}disabled{{/if}}
      >
        {{> icon name="arrows-navigation/simple-chevron-right" size="24" color="current" decorative=true}}
      </button>
    </li>
    {{#if showFirstLast}}
      <li class="c-pagination__item">
        <button
          type="button"
          class="c-pagination__control c-pagination__control--last"
          data-pagination-page="{{totalPages}}"
          aria-label="Last page"
          {{#if disabled}}disabled{{/if}}
          {{#if (eq currentPage totalPages)}}disabled{{/if}}
        >
          <span class="c-pagination__double-chevron" aria-hidden="true">
            {{> icon name="arrows-navigation/simple-chevron-right" size="20" color="current" decorative=true}}
            {{> icon name="arrows-navigation/simple-chevron-right" size="20" color="current" decorative=true}}
          </span>
        </button>
      </li>
    {{/if}}
  </ul>
  {{#if error}}
    {{#if errorMessage}}
      <p class="c-pagination__error" role="alert">{{errorMessage}}</p>
    {{/if}}
  {{/if}}
</nav>
{{/if}}
`})))()}function ct({currentPage:e=1,totalPages:t=5,siblingCount:n=1,truncate:r=!0}={}){let i=Math.max(1,Number(t)||1),a=Math.min(i,Math.max(1,Number(e)||1)),o=Math.max(0,Number(n)||0);if(!r||i<=o*2+5)return Array.from({length:i},(e,t)=>({kind:`page`,page:t+1,current:t+1===a}));let s=new Set([1,i,a]);for(let e=a-o;e<=a+o;e+=1)e>=1&&e<=i&&s.add(e);let c=Array.from(s).sort((e,t)=>e-t),l=[],u=0;for(let e of c)u&&e-u>1&&l.push({kind:`ellipsis`}),l.push({kind:`page`,page:e,current:e===a}),u=e;return l}function lt(e){e.registerHelper(`paginationPages`,(e,t,n,r)=>ct({currentPage:e,totalPages:t,siblingCount:n,truncate:r!==!1}))}function ut(){return(ut=t((()=>{})))()}var dt;function ft(){return(ft=t((()=>{dt=`{{!--
  Components/Slider template — single BEM root (.c-slider) covering
  the Figma master variant set on Web-ODS Shared Library \`1336:2939\`
  (LifeLock theme mode), as published on the Sliders 🟢 canvas at
  \`539:28421\`.

  Variant axes (mirror Figma's master + spec.md \`## Variant axes\`):
    variant   continuous | discrete                 [.c-slider--$variant]
    selection single-value | range                  [.c-slider--$selection]

  Interaction state (default / hover / focused / active) paints via
  CSS pseudo-classes on the underlying \`<input type="range">\` and the
  visible thumb — NEVER as a BEM modifier. \`disabled\` is the only
  persistent state — sets \`aria-disabled="true"\` on the root and the
  native \`disabled\` attribute on each input. A \`data-state\` hook on
  the root lets the AllStyles gallery freeze each transient state for
  visual regression.

  Defaults:
    variant         → "continuous"
    selection       → "single-value"
    min             → 0
    max             → 100
    step            → 1
    value           → min            (single-value)
    valueMin        → min            (range)
    valueMax        → max            (range)
    showValueLabel  → true

  Required:
    selection="range" → both valueMin and valueMax.
    selection="single-value" → value.
--}}
{{#with this as |s|}}
  {{!-- Defaults --}}
  {{#unless s.variant}}{{!-- continuous default --}}{{/unless}}
  {{!-- Compute thumb offsets as percentages of (max - min). --}}
  {{!-- Pre-computed by the .stories.js render layer to keep the
       Handlebars surface free of math helpers. --}}
<div
  class="c-slider c-slider--{{#if s.variant}}{{s.variant}}{{else}}continuous{{/if}} c-slider--{{#if s.selection}}{{s.selection}}{{else}}single-value{{/if}}{{#if s.disabled}} is-disabled{{/if}}"
  data-component="slider"
  data-variant="{{#if s.variant}}{{s.variant}}{{else}}continuous{{/if}}"
  data-selection="{{#if s.selection}}{{s.selection}}{{else}}single-value{{/if}}"
  {{#if s.state}}data-state="{{s.state}}"{{/if}}
  role="group"
  {{#if s.label}}aria-label="{{s.label}}"{{/if}}
  {{#if s.disabled}}aria-disabled="true"{{/if}}
  data-min="{{#if s.min}}{{s.min}}{{else}}0{{/if}}"
  data-max="{{#if s.max}}{{s.max}}{{else}}100{{/if}}"
  data-step="{{#if s.step}}{{s.step}}{{else}}1{{/if}}"
>
  {{#unless (eq s.showValueLabel false)}}
    <div class="c-slider__value-label-area">
      {{#if (eq s.selection "range")}}
        <span class="c-slider__value-label c-slider__value-label--start" data-role="value-min" aria-live="polite">{{s.valueMin}}</span>
        <span class="c-slider__value-label-separator" aria-hidden="true">–</span>
        <span class="c-slider__value-label c-slider__value-label--end" data-role="value-max" aria-live="polite">{{s.valueMax}}</span>
      {{else}}
        <span class="c-slider__value-label" data-role="value" aria-live="polite">{{s.value}}</span>
      {{/if}}
    </div>
  {{/unless}}

  <div class="c-slider__track-area">
    <div class="c-slider__track" aria-hidden="true"></div>

    <div
      class="c-slider__active-fill"
      aria-hidden="true"
      style="--slider-fill-start: {{#if s.fillStartPct}}{{s.fillStartPct}}{{else}}0{{/if}}%; --slider-fill-end: {{#if s.fillEndPct}}{{s.fillEndPct}}{{else}}{{s.valuePct}}{{/if}}%;"
    ></div>

    {{#if (eq s.variant "discrete")}}
      {{#each s.tickOffsets as |offset|}}
        <span class="c-slider__tick" aria-hidden="true" style="--slider-tick-offset: {{offset}}%;"></span>
      {{/each}}
    {{/if}}

    {{#if (eq s.selection "range")}}
      <input
        type="range"
        class="c-slider__input c-slider__input--start"
        min="{{#if s.min}}{{s.min}}{{else}}0{{/if}}"
        max="{{#if s.max}}{{s.max}}{{else}}100{{/if}}"
        step="{{#if s.step}}{{s.step}}{{else}}1{{/if}}"
        value="{{s.valueMin}}"
        {{#if s.name}}name="{{s.name}}-min"{{/if}}
        {{#if s.disabled}}disabled{{/if}}
        aria-label="{{#if s.label}}{{s.label}} (minimum){{else}}Minimum{{/if}}"
      >
      <input
        type="range"
        class="c-slider__input c-slider__input--end"
        min="{{#if s.min}}{{s.min}}{{else}}0{{/if}}"
        max="{{#if s.max}}{{s.max}}{{else}}100{{/if}}"
        step="{{#if s.step}}{{s.step}}{{else}}1{{/if}}"
        value="{{s.valueMax}}"
        {{#if s.name}}name="{{s.name}}-max"{{/if}}
        {{#if s.disabled}}disabled{{/if}}
        aria-label="{{#if s.label}}{{s.label}} (maximum){{else}}Maximum{{/if}}"
      >
      <span
        class="c-slider__thumb c-slider__thumb--start"
        aria-hidden="true"
        style="--slider-thumb-offset: {{s.startPct}}%;"
      ></span>
      <span
        class="c-slider__thumb c-slider__thumb--end"
        aria-hidden="true"
        style="--slider-thumb-offset: {{s.endPct}}%;"
      ></span>
    {{else}}
      <input
        type="range"
        class="c-slider__input"
        min="{{#if s.min}}{{s.min}}{{else}}0{{/if}}"
        max="{{#if s.max}}{{s.max}}{{else}}100{{/if}}"
        step="{{#if s.step}}{{s.step}}{{else}}1{{/if}}"
        value="{{s.value}}"
        {{#if s.name}}name="{{s.name}}"{{/if}}
        {{#if s.disabled}}disabled{{/if}}
        aria-label="{{#if s.label}}{{s.label}}{{else}}Value{{/if}}"
      >
      <span
        class="c-slider__thumb"
        aria-hidden="true"
        style="--slider-thumb-offset: {{s.valuePct}}%;"
      ></span>
    {{/if}}
  </div>
</div>
{{/with}}
`})))()}var pt;function mt(){return(mt=t((()=>{pt=`{{!--
  Molecules/Rating — BEM root .c-rating
  Figma: Pattern / Ratings 2355:19638 · Spec 4630:2285

  Types: teaser | inline | text-led | trustpilot | trustpilot-teaser

  Stories precompute: stars[], scoreLabel, iconSize, countSize,
  trustpilotColor, isTeaserFamily, isTrustpilotFamily.
--}}
<div
  class="c-rating c-rating--{{#if type}}{{lower type}}{{else}}teaser{{/if}} c-rating--{{#if device}}{{lower device}}{{else}}desktop{{/if}}{{#if (eq (lower type) "trustpilot-teaser")}} c-rating--bg-{{#if background}}{{lower background}}{{else}}light{{/if}}{{/if}}{{#if className}} {{className}}{{/if}}"
  data-component="rating"
  data-type="{{#if type}}{{lower type}}{{else}}teaser{{/if}}"
  data-value="{{#if scoreLabel}}{{scoreLabel}}{{else}}{{value}}{{/if}}"
  role="img"
  aria-label="{{#if accessibleLabel}}{{accessibleLabel}}{{else}}{{#if scoreLabel}}{{scoreLabel}}{{else}}{{value}}{{/if}} out of 5 stars{{/if}}"
  {{#if isTrustpilotFamily}}style="--c-rating-trustpilot: {{#if trustpilotColor}}{{trustpilotColor}}{{else}}#00b67a{{/if}};"{{/if}}
>
  {{#if (eq (lower type) "inline")}}
    <span class="c-rating__score" aria-hidden="true">{{#if scoreLabel}}{{scoreLabel}}{{else}}{{value}}{{/if}}</span>
    {{> icon name="generic/simple-star-filled" size=iconSize color="current" decorative=true}}

  {{else if (eq (lower type) "text-led")}}
    {{#if leadingText}}<span class="c-rating__leading" aria-hidden="true">{{leadingText}}</span>{{/if}}
    {{> icon name="generic/simple-star-filled" size=iconSize color="current" decorative=true}}
    {{#if trailing}}
      {{#if trailingText}}<span class="c-rating__trailing" aria-hidden="true">{{trailingText}}</span>{{/if}}
    {{/if}}

  {{else}}
    <div class="c-rating__stars" aria-hidden="true">
      {{#each stars}}
        <span class="c-rating__star c-rating__star--{{fill}}">
          {{#if (eq fill "full")}}
            {{> icon name="generic/simple-star-filled" size=../iconSize color="current" decorative=true}}
          {{else if (eq fill "half")}}
            {{> icon name="generic/simple-star-half" size=../iconSize color="current" decorative=true}}
          {{else}}
            {{> icon name="generic/simple-star" size=../iconSize color="current" decorative=true}}
          {{/if}}
        </span>
      {{/each}}
    </div>

    {{#if isTeaserFamily}}
      {{#unless (eq showScore false)}}
        <span class="c-rating__score" aria-hidden="true">{{#if scoreLabel}}{{scoreLabel}}{{else}}{{value}}{{/if}}</span>
      {{/unless}}
      {{#unless (eq showCount false)}}
        {{#if countLabel}}
          {{#if countHref}}
            {{> text-link
              label=countLabel
              href=countHref
              size=countSize
              weight="regular"
              background=countBackground
              iconTreatment="none"
              className="c-rating__count"
            }}
          {{else}}
            <span class="c-rating__count c-rating__count--static" aria-hidden="true">{{countLabel}}</span>
          {{/if}}
        {{/if}}
      {{/unless}}
    {{/if}}
  {{/if}}
</div>
`})))()}var ht;function gt(){return(gt=t((()=>{ht=`{{!--
  Patterns/Sheet — BEM root .c-sheet (includes bottom Drawer)
  Figma: page 539:28430 · Spec 4522:67 · Left/Right/Bottom boards

  Props:
    layout         left | right | bottom
    mode           modal | non-modal
    size           compact | medium | large
    cta            two | one | none
    buttonLayout   inline | stacked   (bottom only; ignored elsewhere)
    title, body, supportingText
    primaryLabel, secondaryLabel
    showClose, open, id
    showDragHandle boolean (bottom; default false)
    className
--}}
<div
  class="c-sheet c-sheet--{{#if layout}}{{lower layout}}{{else}}left{{/if}} c-sheet--{{#if mode}}{{lower mode}}{{else}}modal{{/if}} c-sheet--{{#if size}}{{lower size}}{{else}}compact{{/if}}{{#if (eq (lower layout) "bottom")}} c-sheet--buttons-{{#if buttonLayout}}{{lower buttonLayout}}{{else}}inline{{/if}}{{/if}}{{#if className}} {{className}}{{/if}}"
  data-component="sheet"
  data-layout="{{#if layout}}{{lower layout}}{{else}}left{{/if}}"
  data-mode="{{#if mode}}{{lower mode}}{{else}}modal{{/if}}"
  role="dialog"
  {{#if (eq (lower mode) "modal")}}aria-modal="true"{{/if}}
  {{#if id}}id="{{id}}"{{/if}}
  aria-labelledby="{{#if labelledById}}{{labelledById}}{{else}}{{#if id}}{{id}}-title{{else}}sheet-title{{/if}}{{/if}}"
  {{#if body}}aria-describedby="{{#if describedById}}{{describedById}}{{else}}{{#if id}}{{id}}-body{{else}}sheet-body{{/if}}{{/if}}"{{/if}}
  {{#unless open}}hidden{{/unless}}
>
  {{#unless (eq (lower mode) "non-modal")}}
    <div class="c-sheet__backdrop" data-sheet-backdrop tabindex="-1"></div>
  {{/unless}}

  <div class="c-sheet__card" role="document" data-sheet-card>
    {{#if showDragHandle}}
      <div class="c-sheet__drag-handle-wrap" aria-hidden="true">
        <span class="c-sheet__drag-handle"></span>
      </div>
    {{/if}}

    <div class="c-sheet__header">
      <h2 class="c-sheet__title" id="{{#if id}}{{id}}-title{{else}}sheet-title{{/if}}">
        {{#if title}}{{title}}{{else}}Sheet title{{/if}}
      </h2>
      {{#unless (eq showClose false)}}
        <button
          type="button"
          class="c-sheet__close"
          data-sheet-close
          aria-label="{{#if closeLabel}}{{closeLabel}}{{else}}Close{{/if}}"
        >
          {{> icon name="actions/simple-close" size="20" color="current" decorative=true}}
        </button>
      {{/unless}}
    </div>

    <div
      class="c-sheet__body"
      id="{{#if id}}{{id}}-body{{else}}sheet-body{{/if}}"
    >
      {{#if bodyHtml}}
        {{{bodyHtml}}}
      {{else}}
        <p class="c-sheet__description">{{#if body}}{{body}}{{else}}Sheet body content.{{/if}}</p>
      {{/if}}
    </div>

    {{#unless (eq (lower cta) "none")}}
      <div class="c-sheet__footer">
        {{#if (eq (lower cta) "two")}}
          {{#if secondaryLabel}}
            {{> button style="text" size="m" label=secondaryLabel className="c-sheet__action c-sheet__action--secondary"}}
          {{else}}
            {{> button style="text" size="m" label="Cancel" className="c-sheet__action c-sheet__action--secondary"}}
          {{/if}}
        {{/if}}
        {{#if primaryLabel}}
          {{> button style="primary" size="m" label=primaryLabel className="c-sheet__action c-sheet__action--primary"}}
        {{else}}
          {{> button style="primary" size="m" label="Apply" className="c-sheet__action c-sheet__action--primary"}}
        {{/if}}
      </div>
    {{/unless}}

    {{#if supportingText}}
      <p class="c-sheet__supporting">{{supportingText}}</p>
    {{/if}}
  </div>
</div>
`})))()}var _t;function vt(){return(vt=t((()=>{_t=`{{!--
  Molecules/Stepper — BEM root (.c-stepper). Figma master \`1386:867\`
  + Step set \`1386:803\` (page \`1366:22777\`, Spec \`3067:548\`).

  Variant axes (mirror Figma's master + spec.md § "Variant axes"):
    direction   horizontal | vertical          [.c-stepper--direction-$direction]

  Each list item carries a persistent state modifier:
    state       default | active | complete     [.c-stepper__step--state-$state]

  The stories layer passes a pre-built \`steps\` array. Each step object:
    number, state, showLabel, label, showConnector, isActive

  Composes (per spec.md § "Composes"):
    icon partial — Complete state renders \`status/simple-checkmark\` at 24 px
    via the registered icon partial (\`currentColor\` → inverse on the dark fill).

  Semantic structure:
    <ol> / <li> with aria-current="step" on the active item; connector lines
    are aria-hidden decorative spans.
--}}
<ol
  class="c-stepper c-stepper--direction-{{#if direction}}{{lower direction}}{{else}}horizontal{{/if}}"
  {{#if ariaLabel}}aria-label="{{ariaLabel}}"{{/if}}
>
  {{#each steps}}
  <li
    class="c-stepper__step c-stepper__step--state-{{#if state}}{{lower state}}{{else}}default{{/if}}{{#if isActive}} c-stepper__step--current{{/if}}"
    {{#if isActive}}aria-current="step"{{/if}}
  >
    {{#if (eq (lower ../direction) "vertical")}}
    <div class="c-stepper__indicator-row">
      <div class="c-stepper__indicator">
        {{#if (eq (lower state) "complete")}}
          {{> icon name="status/simple-checkmark" size="24" color="inverse" decorative=true}}
        {{else}}
          <span class="c-stepper__number">{{number}}</span>
        {{/if}}
      </div>
      {{#if showLabel}}
        <span class="c-stepper__label">{{#if label}}{{label}}{{else}}Label{{/if}}</span>
      {{/if}}
    </div>
    {{else}}
    <div class="c-stepper__indicator-column">
      <div class="c-stepper__indicator">
        {{#if (eq (lower state) "complete")}}
          {{> icon name="status/simple-checkmark" size="24" color="inverse" decorative=true}}
        {{else}}
          <span class="c-stepper__number">{{number}}</span>
        {{/if}}
      </div>
      {{#if showLabel}}
        <span class="c-stepper__label">{{#if label}}{{label}}{{else}}Label{{/if}}</span>
      {{/if}}
    </div>
    {{/if}}
    {{#if showConnector}}
    <div class="c-stepper__connector" aria-hidden="true">
      <span class="c-stepper__connector-line"></span>
    </div>
    {{/if}}
  </li>
  {{/each}}
</ol>
`})))()}var yt;function bt(){return(bt=t((()=>{yt=`{{!--
  Molecules/Table cell — BEM root .c-table-cell
  Figma: Table cell · content slot \`5957:257\` (page \`4339:13401\`,
  Spec \`.Table cell · content slot · spec\` \`5960:299\`).

  Axes / props:
    type            header | body
    align           left | center | right
    background      boolean (default true)
    borders         boolean (default true) — master gate for per-side borders
    topBorder / rightBorder / bottomBorder / leftBorder  booleans (default true)
    leadingIcon / trailingIcon  booleans
    leadingIconName / trailingIconName  catalog keys (stories supply defaults)
    label           plain text
    contentHtml     escape hatch for custom slot HTML (skips default text)
    className
    width           optional inline-size (e.g. "220px") for demos

  Deprecated boards (.Table cell [DEPRECATED]) are out of scope.
--}}
<div
  class="c-table-cell c-table-cell--type-{{#if type}}{{lower type}}{{else}}body{{/if}} c-table-cell--align-{{#if align}}{{lower align}}{{else}}left{{/if}}{{#unless (eq background false)}} c-table-cell--background{{/unless}}{{#unless (eq borders false)}} c-table-cell--borders{{/unless}}{{#if className}} {{className}}{{/if}}"
  data-component="table-cell"
  {{#if width}}style="inline-size: {{width}};"{{/if}}
>
  {{#if leadingIcon}}
    <span class="c-table-cell__icon c-table-cell__icon--leading" aria-hidden="true">
      {{> icon name=leadingIconName size="24" color="current" decorative=true}}
    </span>
  {{/if}}
  <div class="c-table-cell__content">
    {{#if contentHtml}}
      {{{contentHtml}}}
    {{else if (eq (lower type) "header")}}
      {{> content-title style="h7" weight="emphasis" tag="p" text=label}}
    {{else}}
      {{> content-body style="body-base" weight="base" text=label}}
    {{/if}}
  </div>
  {{#if trailingIcon}}
    <span class="c-table-cell__icon c-table-cell__icon--trailing" aria-hidden="true">
      {{> icon name=trailingIconName size="24" color="current" decorative=true}}
    </span>
  {{/if}}
  {{#unless (eq borders false)}}
  <span class="c-table-cell__borders" aria-hidden="true">
    {{#unless (eq topBorder false)}}<span class="c-table-cell__border c-table-cell__border--top"></span>{{/unless}}
    {{#unless (eq rightBorder false)}}<span class="c-table-cell__border c-table-cell__border--right"></span>{{/unless}}
    {{#unless (eq bottomBorder false)}}<span class="c-table-cell__border c-table-cell__border--bottom"></span>{{/unless}}
    {{#unless (eq leftBorder false)}}<span class="c-table-cell__border c-table-cell__border--left"></span>{{/unless}}
  </span>
  {{/unless}}
</div>
`})))()}var xt;function St(){return(St=t((()=>{xt=`{{!--
  Patterns/Table block — BEM root .c-table-block
  Figma: Table block · content slot \`5914:53\` (page \`4339:13402\`,
  Spec \`.Table block · content slot · spec\` \`6032:729\`).

  Props:
    rows       array of { cells: [table-cell args…] }
    slotHtml   raw HTML escape hatch for the table content slot
    className

  Adjacent cells / rows overlap by -1px (SCSS) so shared borders collapse.
  Deprecated boards are out of scope.
--}}
<div
  class="c-table-block{{#if className}} {{className}}{{/if}}"
  data-component="table-block"
>
  <div class="c-table-block__content">
    {{#if slotHtml}}
      {{{slotHtml}}}
    {{else}}
      {{#each rows}}
        <div class="c-table-block__row">
          {{#each cells}}
            {{> table-cell
              type=type
              align=align
              background=background
              borders=borders
              topBorder=topBorder
              rightBorder=rightBorder
              bottomBorder=bottomBorder
              leftBorder=leftBorder
              leadingIcon=leadingIcon
              trailingIcon=trailingIcon
              leadingIconName=leadingIconName
              trailingIconName=trailingIconName
              label=label
              contentHtml=contentHtml
              width=width
              className=className
            }}
          {{/each}}
        </div>
      {{/each}}
    {{/if}}
  </div>
</div>
`})))()}var Ct;function wt(){return(wt=t((()=>{Ct=`{{!--
  Molecules/Tag — BEM root .c-tag
  Figma: Web-ODS Shared Library set 6114:53 (page 6109:6522, Spec 6328:54273).

  Axes:
    background  primary | secondary | brand | brand-soft | accent |
                alpha | beta | gamma | delta | inverse-primary |
                inverse-secondary
    fill        solid | transparent | tint
    strength    base | 30 | 50 | 80   (base only with fill=solid)

  Optional leading icon via {{> icon}} at 16×16, color=current (default on).
--}}
<span
  class="c-tag c-tag--{{#if background}}{{lower background}}{{else}}primary{{/if}} c-tag--fill-{{#if fill}}{{lower fill}}{{else}}solid{{/if}} c-tag--strength-{{#if strength}}{{lower strength}}{{else}}base{{/if}}"
  data-component="tag"
>
  {{#unless (eq showIcon false)}}
    <span class="c-tag__icon" aria-hidden="true">
      {{> icon name=iconName size="16" color="current" decorative=true}}
    </span>
  {{/unless}}
  <span class="c-tag__text">{{#if text}}{{text}}{{else}}Tag{{/if}}</span>
</span>
`})))()}var Tt;function Et(){return(Et=t((()=>{Tt=`{{!--
  Patterns/Tabs — BEM root .c-tabs
  Figma: Pattern / Tabs 539:28424 — .Tab 1396:6950, wrapper 1396:6994,
  mobile dropdown 1396:7051, Spec .Tabs · spec 4362:266.

  Props:
    style           solid | subtle
    tabs            array of { label, showIcon, iconName, disabled, panelId, id, isActive, index, state }
    activeIndex     number (0-based)
    showMobileFallback  boolean — when true, include mobile dropdown markup
    forceMobile     boolean — force mobile dropdown UI (stories)
    label           field title above mobile trigger (default "Section")
    ariaLabel       tablist accessible name
    id              optional root id
    className
--}}
<div
  class="c-tabs c-tabs--style-{{#if style}}{{lower style}}{{else}}solid{{/if}}{{#if forceMobile}} c-tabs--force-mobile{{/if}}{{#if className}} {{className}}{{/if}}"
  data-component="tabs"
  data-style="{{#if style}}{{lower style}}{{else}}solid{{/if}}"
  data-active-index="{{activeIndex}}"
  {{#if id}}id="{{id}}"{{/if}}
>
  <div class="c-tabs__list-wrap" data-tabs-list-wrap>
    <div
      class="c-tabs__list"
      role="tablist"
      aria-label="{{#if ariaLabel}}{{ariaLabel}}{{else}}Tabs{{/if}}"
    >
      {{#each tabs}}
        <button
          type="button"
          class="c-tabs__tab{{#if disabled}} is-disabled{{/if}}{{#if isActive}} is-active{{/if}}"
          role="tab"
          id="{{#if id}}{{id}}{{else}}tab-{{index}}{{/if}}"
          data-tabs-index="{{index}}"
          aria-selected="{{#if isActive}}true{{else}}false{{/if}}"
          tabindex="{{#if isActive}}0{{else}}-1{{/if}}"
          {{#if disabled}}disabled aria-disabled="true"{{/if}}
          {{#if panelId}}aria-controls="{{panelId}}"{{/if}}
          {{#if state}}data-state="{{lower state}}"{{/if}}
        >
          {{#if showIcon}}
            <span class="c-tabs__icon" aria-hidden="true">
              {{> icon name=iconName size="24" color="current" decorative=true}}
            </span>
          {{/if}}
          <span class="c-tabs__label">{{#if label}}{{label}}{{else}}Tab label{{/if}}</span>
        </button>
      {{/each}}
    </div>
  </div>

  {{#if showMobileFallback}}
  <div class="c-tabs__mobile" data-tabs-mobile>
    <div class="c-tabs__mobile-field">
      <span class="c-tabs__mobile-title" id="{{#if id}}{{id}}{{else}}tabs{{/if}}-mobile-label">{{#if label}}{{label}}{{else}}Section{{/if}}</span>
      <button
        type="button"
        class="c-tabs__mobile-trigger"
        data-tabs-mobile-trigger
        aria-haspopup="listbox"
        aria-expanded="false"
        aria-labelledby="{{#if id}}{{id}}{{else}}tabs{{/if}}-mobile-label"
      >
        <span class="c-tabs__mobile-value" data-tabs-mobile-value></span>
        <span class="c-tabs__mobile-chevron" aria-hidden="true">
          {{> icon name="arrows-navigation/simple-expand-more" size="20" color="current" decorative=true}}
        </span>
      </button>
      <ul class="c-tabs__mobile-menu" role="listbox" data-tabs-mobile-menu hidden>
        {{#each tabs}}
          <li role="presentation">
            <button
              type="button"
              class="c-tabs__mobile-option{{#if isActive}} is-active{{/if}}{{#if disabled}} is-disabled{{/if}}"
              role="option"
              data-tabs-index="{{index}}"
              {{#if disabled}}disabled{{/if}}
              aria-selected="{{#if isActive}}true{{else}}false{{/if}}"
            >{{#if label}}{{label}}{{else}}Tab label{{/if}}</button>
          </li>
        {{/each}}
      </ul>
    </div>
  </div>
  {{/if}}
</div>
`})))()}var Dt;function Ot(){return(Ot=t((()=>{Dt=`{{!--
  Molecules/Tooltip — BEM root .c-tooltip
  Figma: Pattern / Tooltip 539:28418 — Spec 4601:164

  Axes: type (small|medium|rich) × tint × pointer
--}}
<div
  class="c-tooltip c-tooltip--type-{{#if type}}{{lower type}}{{else}}small{{/if}} c-tooltip--tint-{{#if tint}}{{lower tint}}{{else}}default{{/if}} c-tooltip--pointer-{{#if pointer}}{{lower pointer}}{{else}}top-center{{/if}}{{#if open}} is-open{{/if}}{{#if className}} {{className}}{{/if}}"
  data-component="tooltip"
  data-type="{{#if type}}{{lower type}}{{else}}small{{/if}}"
  data-tint="{{#if tint}}{{lower tint}}{{else}}default{{/if}}"
  {{#if id}}id="{{id}}"{{/if}}
  role="tooltip"
  {{#unless open}}hidden{{/unless}}
>
  <div class="c-tooltip__bubble">
    {{#if (eq (lower type) "rich")}}
      {{#if title}}<p class="c-tooltip__title">{{title}}</p>{{/if}}
      <p class="c-tooltip__body">{{#if body}}{{body}}{{else}}Tooltip text{{/if}}</p>
    {{else if (eq (lower type) "medium")}}
      {{#if title}}<p class="c-tooltip__title">{{title}}</p>{{/if}}
      <p class="c-tooltip__body">{{#if body}}{{body}}{{else}}Tooltip text{{/if}}</p>
    {{else}}
      <p class="c-tooltip__body">{{#if body}}{{body}}{{else}}{{#if title}}{{title}}{{else}}Tooltip text{{/if}}{{/if}}</p>
    {{/if}}
  </div>
  <span class="c-tooltip__pointer" aria-hidden="true"></span>
</div>
`})))()}var kt;function At(){return(At=t((()=>{kt=`{{!--
  Patterns/Toggle — BEM root .c-toggle
  Figma: Pattern / Toggle 539:28414 — Spec 4588:132

  type: link | segmented | pill
  selected: off|on (link) · a|b (segmented|pill)
--}}
<div
  class="c-toggle c-toggle--type-{{#if type}}{{lower type}}{{else}}link{{/if}}{{#if disabled}} is-disabled{{/if}}{{#if state}}{{#unless (eq (lower state) "default")}} c-toggle--state-{{lower state}}{{/unless}}{{/if}}{{#if className}} {{className}}{{/if}}"
  data-component="toggle"
  data-type="{{#if type}}{{lower type}}{{else}}link{{/if}}"
  data-selected="{{#if selected}}{{lower selected}}{{else}}{{#if (eq (lower type) "link")}}off{{else}}a{{/if}}{{/if}}"
  {{#if state}}data-state="{{lower state}}"{{/if}}
  {{#if id}}id="{{id}}"{{/if}}
>
  {{#if (eq (lower type) "link")}}
    <button
      type="button"
      class="c-toggle__link"
      data-toggle-control
      aria-pressed="{{#if (eq (lower selected) "on")}}true{{else}}false{{/if}}"
      {{#if disabled}}disabled{{/if}}
    >
      <span class="c-toggle__label c-toggle__label--start{{#unless (eq (lower selected) "on")}} is-active{{/unless}}">{{#if labelA}}{{labelA}}{{else}}Off{{/if}}</span>
      <span class="c-toggle__track" aria-hidden="true">
        <span class="c-toggle__knob"></span>
      </span>
      <span class="c-toggle__label c-toggle__label--end{{#if (eq (lower selected) "on")}} is-active{{/if}}">{{#if labelB}}{{labelB}}{{else}}On{{/if}}</span>
    </button>

  {{else if (eq (lower type) "segmented")}}
    <div class="c-toggle__segmented" role="radiogroup" aria-label="{{#if ariaLabel}}{{ariaLabel}}{{else}}Toggle{{/if}}">
      <button
        type="button"
        class="c-toggle__seg{{#unless (eq (lower selected) "b")}} is-selected{{/unless}}"
        role="radio"
        data-toggle-value="a"
        aria-checked="{{#unless (eq (lower selected) "b")}}true{{else}}false{{/unless}}"
        {{#if disabled}}disabled{{/if}}
      >{{#if labelA}}{{labelA}}{{else}}Free{{/if}}</button>
      <button
        type="button"
        class="c-toggle__seg{{#if (eq (lower selected) "b")}} is-selected{{/if}}"
        role="radio"
        data-toggle-value="b"
        aria-checked="{{#if (eq (lower selected) "b")}}true{{else}}false{{/if}}"
        {{#if disabled}}disabled{{/if}}
      >{{#if labelB}}{{labelB}}{{else}}Premium{{/if}}</button>
    </div>

  {{else}}
    {{!-- pill --}}
    <div class="c-toggle__pill" role="radiogroup" aria-label="{{#if ariaLabel}}{{ariaLabel}}{{else}}Toggle{{/if}}">
      <button
        type="button"
        class="c-toggle__pill-opt{{#unless (eq (lower selected) "b")}} is-selected{{/unless}}"
        role="radio"
        data-toggle-value="a"
        aria-checked="{{#unless (eq (lower selected) "b")}}true{{else}}false{{/unless}}"
        {{#if disabled}}disabled{{/if}}
      >
        <span class="c-toggle__pill-label">{{#if labelA}}{{labelA}}{{else}}Annual{{/if}}</span>
        {{#unless (eq showDiscountLabel false)}}
          {{#unless (eq (lower selected) "b")}}
            <span class="c-toggle__pill-chip">
              {{> discount-label
                text=discountText
                background="gamma"
                fill="tint"
                strength="30"
                size="small"
                showIcon=false
              }}
            </span>
          {{/unless}}
        {{/unless}}
      </button>
      <button
        type="button"
        class="c-toggle__pill-opt{{#if (eq (lower selected) "b")}} is-selected{{/if}}"
        role="radio"
        data-toggle-value="b"
        aria-checked="{{#if (eq (lower selected) "b")}}true{{else}}false{{/if}}"
        {{#if disabled}}disabled{{/if}}
      >
        <span class="c-toggle__pill-label">{{#if labelB}}{{labelB}}{{else}}Monthly{{/if}}</span>
      </button>
    </div>
  {{/if}}
</div>
`})))()}var jt;function Mt(){return(Mt=t((()=>{jt=`{{!--
  Patterns/Trustpilot — review cell .c-trustpilot
  Figma: Pattern / Trustpilot 2356:19641 — cell 2500:4244 — Spec 3969:12883

  Composes rating (type=trustpilot, score/count hidden).
  Pass \`ratingArgs\` object from story helper for the nested partial.
--}}
<article
  class="c-trustpilot{{#if className}} {{className}}{{/if}}"
  data-component="trustpilot"
>
  <h3 class="c-trustpilot__title">{{#if title}}{{title}}{{else}}Quote title{{/if}}</h3>
  {{#unless (eq showProductLabel false)}}
    <p class="c-trustpilot__product">{{#if productLabel}}{{productLabel}}{{else}}Product{{/if}}</p>
  {{/unless}}
  <div class="c-trustpilot__rating">
    {{#if ratingArgs}}
      {{> rating ratingArgs}}
    {{/if}}
  </div>
  <p class="c-trustpilot__meta">
    <span class="c-trustpilot__reviewer">{{#if reviewerLine}}{{reviewerLine}}{{else}}Reviewer · Date{{/if}}</span>
    {{#unless (eq showVerified false)}}
      <span class="c-trustpilot__sep" aria-hidden="true"> · </span>
      <span class="c-trustpilot__verified">{{#if verifiedLabel}}{{verifiedLabel}}{{else}}Verified purchaser{{/if}}</span>
    {{/unless}}
  </p>
  {{#unless (eq showQuote false)}}
    <p class="c-trustpilot__quote">{{#if quoteBody}}{{quoteBody}}{{else}}Customer quote body text goes here.{{/if}}</p>
  {{/unless}}
</article>
`})))()}var Nt;function Q(){return(Q=t((()=>{Nt=`{{!--
  Patterns/Card — BEM root .c-card
  Figma: Pattern / Card 4695:31653 — master 4695:33460 — Spec 5664:296

  Axes: ratio × alignment
  Composes: discount-label, content-title, content-body, text-link, icon
--}}
<article
  class="c-card c-card--ratio-{{#if ratio}}{{lower ratio}}{{else}}16-9{{/if}} c-card--align-{{#if alignment}}{{lower alignment}}{{else}}bottom-left{{/if}}{{#if className}} {{className}}{{/if}}"
  data-component="card"
  data-ratio="{{#if ratio}}{{lower ratio}}{{else}}16-9{{/if}}"
>
  <div class="c-card__media" aria-hidden="true">
    {{#if imageSrc}}
      <img class="c-card__image" src="{{imageSrc}}" alt="" />
    {{/if}}
    <div class="c-card__scrim"></div>
  </div>
  <div class="c-card__content">
    <div class="c-card__top">
      {{#unless (eq showLabel false)}}
        {{> discount-label
          text=label
          background="inverse-primary"
          fill="solid"
          strength="base"
          size="small"
          showIcon=false
        }}
      {{/unless}}
    </div>
    <div class="c-card__bottom">
      {{> content-title style="h7" weight="emphasis" tag="h3" text=title className="c-card__title"}}
      {{> content-body style="body-sm" weight="base" text=body className="c-card__body"}}
      {{#unless (eq showCategory false)}}
        <p class="c-card__category">{{#if category}}{{category}}{{else}}Category{{/if}}</p>
      {{/unless}}
      {{#unless (eq showFooter false)}}
        <div class="c-card__footer">
          {{> text-link
            label=footerLabel
            href=footerHref
            size="sm"
            weight="regular"
            background="dark"
            iconTreatment="inline"
            iconName="arrows-navigation/simple-arrow-forward"
            iconPosition="trailing"
            className="c-card__footer-link"
          }}
        </div>
      {{/unless}}
    </div>
  </div>
</article>
`})))()}var Pt;function Ft(){return(Ft=t((()=>{Pt=`{{!--
  Molecules/Divider — BEM root .c-divider
  Figma: Web-ODS Shared Library canvas 539:28432
    Divider / Horizontal 1344:2031 · Vertical 1344:2052 · Label 1344:2073
    Spec Frame 3165:121

  Axes:
    layout     horizontal | vertical | label     → .c-divider--$layout
    size       xs | s | m | l                    → .c-divider--$size
    inverse    true | false                      → .c-divider--inverse
    typography body-sm-regular | body-sm-bold |
               body-base-regular | body-base-semibold |
               body-lg-regular | body-lg-bold |
               h6-medium | h5-bold               → .c-divider--$typography
                 (label layout only)

  Defaults: layout=horizontal, size=s, inverse=false,
            typography=body-sm-regular, label=Or
--}}
<div
  class="c-divider c-divider--{{#if layout}}{{lower layout}}{{else}}horizontal{{/if}} c-divider--{{#if size}}{{lower size}}{{else}}s{{/if}}{{#if inverse}} c-divider--inverse{{/if}} c-divider--{{#if typography}}{{lower typography}}{{else}}body-sm-regular{{/if}}{{#if className}} {{className}}{{/if}}"
  role="separator"
  aria-orientation="{{#if (eq (lower layout) "vertical")}}vertical{{else}}horizontal{{/if}}"
  {{#if accessibleLabel}}aria-label="{{accessibleLabel}}"{{/if}}
>
  {{#if (eq (lower layout) "label")}}
    <span class="c-divider__rule c-divider__rule--start" aria-hidden="true"></span>
    <span class="c-divider__label">{{#if label}}{{label}}{{else}}Or{{/if}}</span>
    <span class="c-divider__rule c-divider__rule--end" aria-hidden="true"></span>
  {{/if}}
</div>
`})))()}var It;function Lt(){return(Lt=t((()=>{It=`{{!--
  Blocks/Lower footer — BEM root .c-lower-footer
  Figma: Block / Lower Footer page 3598:2174 — set 2498:2022 — Spec 4278:466

  Axes: theme (light | dark)
  Props: showLowerLinks, logoSrc, logoAlt, brandName, statement, copyrightText, links[]
  Composes: divider, logo-wrapper, content-body, menu-list
--}}
<footer
  class="c-lower-footer c-lower-footer--theme-{{#if theme}}{{lower theme}}{{else}}light{{/if}}{{#if className}} {{className}}{{/if}}"
  data-component="lower-footer"
  data-theme="{{#if theme}}{{lower theme}}{{else}}light{{/if}}"
>
  <div class="c-lower-footer__inner">
    <div class="c-lower-footer__divider" aria-hidden="true">
      {{> divider
        layout="horizontal"
        size="xs"
        inverse=dividerInverse
      }}
    </div>

    <div class="c-lower-footer__lockup">
      {{> logo-wrapper
        lockUp="horizontal"
        src=logoSrc
        alt=logoAlt
        className="c-lower-footer__logo"
      }}
      {{> content-body
        style="body-sm"
        weight="base"
        text=statement
        className="c-lower-footer__statement"
      }}
    </div>

    {{> content-body
      style="body-xs"
      weight="base"
      text=copyrightText
      className="c-lower-footer__copyright"
    }}

    {{#unless (eq showLowerLinks false)}}
      <nav class="c-lower-footer__nav" aria-label="{{#if navLabel}}{{navLabel}}{{else}}Legal and company links{{/if}}">
        <ul class="c-lower-footer__links" role="list">
          {{#each links}}
            {{> menu-list
              type="row"
              size="large"
              text=text
              href=href
              role="listitem"
              showRightBorder=showRightBorder
              edgePadding=true
              rightIcon=rightIcon
              rightIconName=rightIconName
              className="c-lower-footer__link"
            }}
          {{/each}}
        </ul>
      </nav>
    {{/unless}}
  </div>
</footer>
`})))()}function Rt(e){let t=typeof e==`string`?e.replace(/~/g,`/`):e;return Vt[t]||``}var zt,Bt,Vt,Ht;function Ut(){return(Ut=t((()=>{zt=`/tools/aics/avg/`.replace(/\/?$/,`/`),Bt=Object.keys({"../../../assets/icons/actions/detailed-delete.svg":0,"../../../assets/icons/actions/detailed-reload.svg":0,"../../../assets/icons/actions/simple-add.svg":0,"../../../assets/icons/actions/simple-clear.svg":0,"../../../assets/icons/actions/simple-close.svg":0,"../../../assets/icons/actions/simple-copy.svg":0,"../../../assets/icons/actions/simple-delete.svg":0,"../../../assets/icons/actions/simple-edit.svg":0,"../../../assets/icons/actions/simple-minus.svg":0,"../../../assets/icons/actions/simple-plus.svg":0,"../../../assets/icons/actions/simple-power.svg":0,"../../../assets/icons/actions/simple-reload.svg":0,"../../../assets/icons/actions/simple-right-panel-close.svg":0,"../../../assets/icons/actions/simple-right-panel-open.svg":0,"../../../assets/icons/actions/simple-search.svg":0,"../../../assets/icons/actions/simple-sign-in.svg":0,"../../../assets/icons/arrows-navigation/detailed-cloud-transfers.svg":0,"../../../assets/icons/arrows-navigation/detailed-download-filled.svg":0,"../../../assets/icons/arrows-navigation/detailed-download.svg":0,"../../../assets/icons/arrows-navigation/simple-arrow-back.svg":0,"../../../assets/icons/arrows-navigation/simple-arrow-forward.svg":0,"../../../assets/icons/arrows-navigation/simple-chevron-left.svg":0,"../../../assets/icons/arrows-navigation/simple-chevron-right.svg":0,"../../../assets/icons/arrows-navigation/simple-cloud-transfers.svg":0,"../../../assets/icons/arrows-navigation/simple-collapse.svg":0,"../../../assets/icons/arrows-navigation/simple-down.svg":0,"../../../assets/icons/arrows-navigation/simple-download-filled.svg":0,"../../../assets/icons/arrows-navigation/simple-download.svg":0,"../../../assets/icons/arrows-navigation/simple-exchange.svg":0,"../../../assets/icons/arrows-navigation/simple-expand-less.svg":0,"../../../assets/icons/arrows-navigation/simple-expand-more.svg":0,"../../../assets/icons/arrows-navigation/simple-expand.svg":0,"../../../assets/icons/arrows-navigation/simple-export.svg":0,"../../../assets/icons/arrows-navigation/simple-link-external.svg":0,"../../../assets/icons/arrows-navigation/simple-menu.svg":0,"../../../assets/icons/arrows-navigation/simple-more-horiz.svg":0,"../../../assets/icons/arrows-navigation/simple-more.svg":0,"../../../assets/icons/arrows-navigation/simple-next.svg":0,"../../../assets/icons/arrows-navigation/simple-previous.svg":0,"../../../assets/icons/arrows-navigation/simple-share.svg":0,"../../../assets/icons/arrows-navigation/simple-sign-out.svg":0,"../../../assets/icons/arrows-navigation/simple-sort-ascend.svg":0,"../../../assets/icons/arrows-navigation/simple-sort-descend.svg":0,"../../../assets/icons/arrows-navigation/simple-split.svg":0,"../../../assets/icons/arrows-navigation/simple-up.svg":0,"../../../assets/icons/arrows-navigation/simple-upload.svg":0,"../../../assets/icons/brand/detailed-brand-icon.svg":0,"../../../assets/icons/brand/simple-brand-icon.svg":0,"../../../assets/icons/communication/detailed-fake-calls.svg":0,"../../../assets/icons/communication/simple-call-incoming.svg":0,"../../../assets/icons/communication/simple-call-missed.svg":0,"../../../assets/icons/communication/simple-call.svg":0,"../../../assets/icons/communication/simple-emoji-annoyed.svg":0,"../../../assets/icons/communication/simple-emoji-happy.svg":0,"../../../assets/icons/communication/simple-emoji-neutral.svg":0,"../../../assets/icons/communication/simple-emoji-pleased.svg":0,"../../../assets/icons/communication/simple-emoji-sad.svg":0,"../../../assets/icons/communication/simple-fake-calls.svg":0,"../../../assets/icons/communication/simple-mail.svg":0,"../../../assets/icons/communication/simple-message.svg":0,"../../../assets/icons/communication/simple-messaging.svg":0,"../../../assets/icons/communication/simple-microphone.svg":0,"../../../assets/icons/communication/simple-send-instructions.svg":0,"../../../assets/icons/communication/simple-send.svg":0,"../../../assets/icons/communication/simple-thumb-down-filled.svg":0,"../../../assets/icons/communication/simple-thumb-down.svg":0,"../../../assets/icons/communication/simple-thumb-up-filled.svg":0,"../../../assets/icons/communication/simple-thumb-up.svg":0,"../../../assets/icons/devices-hardware/detailed-device-desktop.svg":0,"../../../assets/icons/devices-hardware/detailed-device-drive.svg":0,"../../../assets/icons/devices-hardware/detailed-device-laptop.svg":0,"../../../assets/icons/devices-hardware/detailed-device-phone.svg":0,"../../../assets/icons/devices-hardware/detailed-mobile-scams.svg":0,"../../../assets/icons/devices-hardware/detailed-permission-mobile.svg":0,"../../../assets/icons/devices-hardware/simple-add-device.svg":0,"../../../assets/icons/devices-hardware/simple-browser.svg":0,"../../../assets/icons/devices-hardware/simple-device-computer.svg":0,"../../../assets/icons/devices-hardware/simple-device-desktop.svg":0,"../../../assets/icons/devices-hardware/simple-device-drive.svg":0,"../../../assets/icons/devices-hardware/simple-device-health.svg":0,"../../../assets/icons/devices-hardware/simple-device-love.svg":0,"../../../assets/icons/devices-hardware/simple-device-multiple.svg":0,"../../../assets/icons/devices-hardware/simple-device-phone.svg":0,"../../../assets/icons/devices-hardware/simple-device-power.svg":0,"../../../assets/icons/devices-hardware/simple-device-processor.svg":0,"../../../assets/icons/devices-hardware/simple-device-remote-control.svg":0,"../../../assets/icons/devices-hardware/simple-device-security.svg":0,"../../../assets/icons/devices-hardware/simple-device-storage.svg":0,"../../../assets/icons/devices-hardware/simple-device-system-device.svg":0,"../../../assets/icons/devices-hardware/simple-device-usb.svg":0,"../../../assets/icons/devices-hardware/simple-disc.svg":0,"../../../assets/icons/devices-hardware/simple-disk-analyzer.svg":0,"../../../assets/icons/devices-hardware/simple-mobile-scams.svg":0,"../../../assets/icons/devices-hardware/simple-permission-mobile.svg":0,"../../../assets/icons/devices-hardware/simple-wifi-alert.svg":0,"../../../assets/icons/devices-hardware/simple-wifi-home.svg":0,"../../../assets/icons/devices-hardware/simple-wifi-off.svg":0,"../../../assets/icons/devices-hardware/simple-wifi-scan.svg":0,"../../../assets/icons/devices-hardware/simple-wifi-secured.svg":0,"../../../assets/icons/devices-hardware/simple-wifi-speed.svg":0,"../../../assets/icons/devices-hardware/simple-wifi.svg":0,"../../../assets/icons/documents-media/detailed-certificate.svg":0,"../../../assets/icons/documents-media/detailed-download-folder.svg":0,"../../../assets/icons/documents-media/detailed-filetype-picture.svg":0,"../../../assets/icons/documents-media/detailed-inquiry.svg":0,"../../../assets/icons/documents-media/simple-certificate.svg":0,"../../../assets/icons/documents-media/simple-document-cleanup.svg":0,"../../../assets/icons/documents-media/simple-download-folder.svg":0,"../../../assets/icons/documents-media/simple-duplicates.svg":0,"../../../assets/icons/documents-media/simple-filetype-archive.svg":0,"../../../assets/icons/documents-media/simple-filetype-document.svg":0,"../../../assets/icons/documents-media/simple-filetype-music.svg":0,"../../../assets/icons/documents-media/simple-filetype-picture.svg":0,"../../../assets/icons/documents-media/simple-folder.svg":0,"../../../assets/icons/documents-media/simple-inquiry.svg":0,"../../../assets/icons/documents-media/simple-media-overview.svg":0,"../../../assets/icons/documents-media/simple-no-ads.svg":0,"../../../assets/icons/documents-media/simple-picture-locked.svg":0,"../../../assets/icons/documents-media/simple-play.svg":0,"../../../assets/icons/documents-media/simple-stop.svg":0,"../../../assets/icons/documents-media/simple-video.svg":0,"../../../assets/icons/external-brands/detailed-dropbox.svg":0,"../../../assets/icons/external-brands/detailed-facebook.svg":0,"../../../assets/icons/external-brands/detailed-gmail.svg":0,"../../../assets/icons/external-brands/detailed-google-chrome.svg":0,"../../../assets/icons/external-brands/detailed-google-drive.svg":0,"../../../assets/icons/external-brands/detailed-instagram.svg":0,"../../../assets/icons/external-brands/detailed-linkedin.svg":0,"../../../assets/icons/external-brands/detailed-neo.svg":0,"../../../assets/icons/external-brands/detailed-one-drive.svg":0,"../../../assets/icons/external-brands/detailed-platform-android.svg":0,"../../../assets/icons/external-brands/detailed-platform-apple.svg":0,"../../../assets/icons/external-brands/detailed-platform-ios.svg":0,"../../../assets/icons/external-brands/detailed-platform-linux.svg":0,"../../../assets/icons/external-brands/detailed-platform-windows.svg":0,"../../../assets/icons/external-brands/detailed-x-twitter.svg":0,"../../../assets/icons/external-brands/detailed-youtube.svg":0,"../../../assets/icons/external-brands/simple-dropbox.svg":0,"../../../assets/icons/external-brands/simple-facebook.svg":0,"../../../assets/icons/external-brands/simple-gmail.svg":0,"../../../assets/icons/external-brands/simple-google-chrome.svg":0,"../../../assets/icons/external-brands/simple-google-drive.svg":0,"../../../assets/icons/external-brands/simple-instagram.svg":0,"../../../assets/icons/external-brands/simple-linkedin.svg":0,"../../../assets/icons/external-brands/simple-neo.svg":0,"../../../assets/icons/external-brands/simple-one-drive.svg":0,"../../../assets/icons/external-brands/simple-platform-android.svg":0,"../../../assets/icons/external-brands/simple-platform-apple.svg":0,"../../../assets/icons/external-brands/simple-platform-ios.svg":0,"../../../assets/icons/external-brands/simple-platform-linux.svg":0,"../../../assets/icons/external-brands/simple-platform-windows.svg":0,"../../../assets/icons/external-brands/simple-x-twitter.svg":0,"../../../assets/icons/external-brands/simple-youtube.svg":0,"../../../assets/icons/finance/detailed-atm-card.svg":0,"../../../assets/icons/finance/detailed-cash-protection.svg":0,"../../../assets/icons/finance/detailed-cashback.svg":0,"../../../assets/icons/finance/detailed-cost-effective.svg":0,"../../../assets/icons/finance/detailed-credit-card.svg":0,"../../../assets/icons/finance/detailed-debt.svg":0,"../../../assets/icons/finance/detailed-insurance.svg":0,"../../../assets/icons/finance/detailed-late-fees.svg":0,"../../../assets/icons/finance/detailed-loan.svg":0,"../../../assets/icons/finance/detailed-money-opportunity.svg":0,"../../../assets/icons/finance/detailed-stolen-funds.svg":0,"../../../assets/icons/finance/detailed-store.svg":0,"../../../assets/icons/finance/simple-atm-card.svg":0,"../../../assets/icons/finance/simple-bank-transfer.svg":0,"../../../assets/icons/finance/simple-cash-protection.svg":0,"../../../assets/icons/finance/simple-cashback.svg":0,"../../../assets/icons/finance/simple-cost-effective.svg":0,"../../../assets/icons/finance/simple-credit-card-front.svg":0,"../../../assets/icons/finance/simple-credit-card.svg":0,"../../../assets/icons/finance/simple-debt.svg":0,"../../../assets/icons/finance/simple-graph.svg":0,"../../../assets/icons/finance/simple-insurance.svg":0,"../../../assets/icons/finance/simple-late-fees.svg":0,"../../../assets/icons/finance/simple-loan.svg":0,"../../../assets/icons/finance/simple-money-opportunity.svg":0,"../../../assets/icons/finance/simple-stolen-funds.svg":0,"../../../assets/icons/finance/simple-store.svg":0,"../../../assets/icons/generic/detailed-apps-overview.svg":0,"../../../assets/icons/generic/detailed-apps.svg":0,"../../../assets/icons/generic/detailed-auto-renew.svg":0,"../../../assets/icons/generic/detailed-language.svg":0,"../../../assets/icons/generic/detailed-web.svg":0,"../../../assets/icons/generic/simple-adjustments.svg":0,"../../../assets/icons/generic/simple-app-windows.svg":0,"../../../assets/icons/generic/simple-apps-overview.svg":0,"../../../assets/icons/generic/simple-apps.svg":0,"../../../assets/icons/generic/simple-auto-renew.svg":0,"../../../assets/icons/generic/simple-block-tracking.svg":0,"../../../assets/icons/generic/simple-calendar.svg":0,"../../../assets/icons/generic/simple-data-limit.svg":0,"../../../assets/icons/generic/simple-data-recovery.svg":0,"../../../assets/icons/generic/simple-deep-clean.svg":0,"../../../assets/icons/generic/simple-explore.svg":0,"../../../assets/icons/generic/simple-fast.svg":0,"../../../assets/icons/generic/simple-filter.svg":0,"../../../assets/icons/generic/simple-fix-and-update.svg":0,"../../../assets/icons/generic/simple-heart-check.svg":0,"../../../assets/icons/generic/simple-history.svg":0,"../../../assets/icons/generic/simple-invert-colors.svg":0,"../../../assets/icons/generic/simple-kill-switch.svg":0,"../../../assets/icons/generic/simple-language.svg":0,"../../../assets/icons/generic/simple-link.svg":0,"../../../assets/icons/generic/simple-notification-off.svg":0,"../../../assets/icons/generic/simple-notification.svg":0,"../../../assets/icons/generic/simple-pin-location.svg":0,"../../../assets/icons/generic/simple-privacy-sensitive.svg":0,"../../../assets/icons/generic/simple-settings.svg":0,"../../../assets/icons/generic/simple-star-filled.svg":0,"../../../assets/icons/generic/simple-star-half.svg":0,"../../../assets/icons/generic/simple-star-upgrade.svg":0,"../../../assets/icons/generic/simple-star.svg":0,"../../../assets/icons/generic/simple-time.svg":0,"../../../assets/icons/generic/simple-view-grid.svg":0,"../../../assets/icons/generic/simple-view-list.svg":0,"../../../assets/icons/generic/simple-visibility-off.svg":0,"../../../assets/icons/generic/simple-visibility-on.svg":0,"../../../assets/icons/generic/simple-web.svg":0,"../../../assets/icons/help-support/detailed-help.svg":0,"../../../assets/icons/help-support/detailed-support.svg":0,"../../../assets/icons/help-support/simple-help.svg":0,"../../../assets/icons/help-support/simple-question-mark.svg":0,"../../../assets/icons/help-support/simple-rescue.svg":0,"../../../assets/icons/help-support/simple-support.svg":0,"../../../assets/icons/objects/detailed-airplane.svg":0,"../../../assets/icons/objects/detailed-earth.svg":0,"../../../assets/icons/objects/detailed-home.svg":0,"../../../assets/icons/objects/simple-airplane.svg":0,"../../../assets/icons/objects/simple-briefcase.svg":0,"../../../assets/icons/objects/simple-cookies.svg":0,"../../../assets/icons/objects/simple-device-vehicle.svg":0,"../../../assets/icons/objects/simple-diamond.svg":0,"../../../assets/icons/objects/simple-earth.svg":0,"../../../assets/icons/objects/simple-home.svg":0,"../../../assets/icons/objects/simple-night.svg":0,"../../../assets/icons/objects/simple-public.svg":0,"../../../assets/icons/objects/simple-rocket.svg":0,"../../../assets/icons/objects/simple-school.svg":0,"../../../assets/icons/objects/simple-tips.svg":0,"../../../assets/icons/objects/simple-troubleshooting.svg":0,"../../../assets/icons/other-apps/android-settings.svg":0,"../../../assets/icons/other-apps/brave.svg":0,"../../../assets/icons/other-apps/chrome.svg":0,"../../../assets/icons/other-apps/chromium.svg":0,"../../../assets/icons/other-apps/dropbox.svg":0,"../../../assets/icons/other-apps/edge.svg":0,"../../../assets/icons/other-apps/firefox.svg":0,"../../../assets/icons/other-apps/google-drive.svg":0,"../../../assets/icons/other-apps/google-mail.svg":0,"../../../assets/icons/other-apps/google-play.svg":0,"../../../assets/icons/other-apps/internet-explorer.svg":0,"../../../assets/icons/other-apps/messenger.svg":0,"../../../assets/icons/other-apps/neo.svg":0,"../../../assets/icons/other-apps/onedrive.svg":0,"../../../assets/icons/other-apps/opera.svg":0,"../../../assets/icons/other-apps/outlook.svg":0,"../../../assets/icons/other-apps/safari.svg":0,"../../../assets/icons/other-apps/spotify.svg":0,"../../../assets/icons/other-apps/vivaldi.svg":0,"../../../assets/icons/other-apps/whatsapp.svg":0,"../../../assets/icons/other-apps/yandex.svg":0,"../../../assets/icons/other-brands/google.svg":0,"../../../assets/icons/other-brands/microsoft.svg":0,"../../../assets/icons/payment/amazon-pay-large.svg":0,"../../../assets/icons/payment/amazon-pay-small.svg":0,"../../../assets/icons/payment/amex-large-1.svg":0,"../../../assets/icons/payment/amex-large-2.svg":0,"../../../assets/icons/payment/amex-small-1.svg":0,"../../../assets/icons/payment/amex-small-2.svg":0,"../../../assets/icons/payment/apple-pay-large.svg":0,"../../../assets/icons/payment/apple-pay-small.svg":0,"../../../assets/icons/payment/bitcoin-large.svg":0,"../../../assets/icons/payment/bitcoin-small.svg":0,"../../../assets/icons/payment/discover-large.svg":0,"../../../assets/icons/payment/discover-small.svg":0,"../../../assets/icons/payment/google-pay-large.svg":0,"../../../assets/icons/payment/google-pay-small.svg":0,"../../../assets/icons/payment/ideal-wero-large.svg":0,"../../../assets/icons/payment/ideal-wero-small.svg":0,"../../../assets/icons/payment/jcb-large.svg":0,"../../../assets/icons/payment/jcb-small.svg":0,"../../../assets/icons/payment/klarna-large.svg":0,"../../../assets/icons/payment/klarna-small.svg":0,"../../../assets/icons/payment/mastercard-large.svg":0,"../../../assets/icons/payment/mastercard-small.svg":0,"../../../assets/icons/payment/paypal-large.svg":0,"../../../assets/icons/payment/paypal-small.svg":0,"../../../assets/icons/payment/visa-large.svg":0,"../../../assets/icons/payment/visa-small.svg":0,"../../../assets/icons/product-features/detailed-browser-protection.svg":0,"../../../assets/icons/product-features/detailed-computer-tune-up.svg":0,"../../../assets/icons/product-features/detailed-core-shields.svg":0,"../../../assets/icons/product-features/detailed-cyber-insurance.svg":0,"../../../assets/icons/product-features/detailed-device-security.svg":0,"../../../assets/icons/product-features/detailed-email-guardian.svg":0,"../../../assets/icons/product-features/detailed-genie-ai.svg":0,"../../../assets/icons/product-features/detailed-get-prime.svg":0,"../../../assets/icons/product-features/detailed-identity-insurance.svg":0,"../../../assets/icons/product-features/detailed-identity-vault.svg":0,"../../../assets/icons/product-features/detailed-lifelock-ai-assistant.svg":0,"../../../assets/icons/product-features/detailed-mobile-security.svg":0,"../../../assets/icons/product-features/detailed-monitoring.svg":0,"../../../assets/icons/product-features/detailed-plan-details.svg":0,"../../../assets/icons/product-features/detailed-privacy-monitor-assistant.svg":0,"../../../assets/icons/product-features/detailed-privacy-monitor.svg":0,"../../../assets/icons/product-features/detailed-product-antitrack.svg":0,"../../../assets/icons/product-features/detailed-product-browser-safety.svg":0,"../../../assets/icons/product-features/detailed-product-cleanup-desktop.svg":0,"../../../assets/icons/product-features/detailed-product-cleanup-mobile.svg":0,"../../../assets/icons/product-features/detailed-product-device-care.svg":0,"../../../assets/icons/product-features/detailed-product-driver-updater.svg":0,"../../../assets/icons/product-features/detailed-product-family-space.svg":0,"../../../assets/icons/product-features/detailed-product-mobile-security.svg":0,"../../../assets/icons/product-features/detailed-product-passwords.svg":0,"../../../assets/icons/product-features/detailed-product-safe-shopping.svg":0,"../../../assets/icons/product-features/detailed-product-secure-browser.svg":0,"../../../assets/icons/product-features/detailed-product-secure-identity.svg":0,"../../../assets/icons/product-features/detailed-product-system-speedup.svg":0,"../../../assets/icons/product-features/detailed-product-vpn.svg":0,"../../../assets/icons/product-features/detailed-protection-score.svg":0,"../../../assets/icons/product-features/detailed-scam-protection.svg":0,"../../../assets/icons/product-features/detailed-scam-verification-specialist.svg":0,"../../../assets/icons/product-features/detailed-school.svg":0,"../../../assets/icons/product-features/detailed-sms-security.svg":0,"../../../assets/icons/product-features/detailed-social-media.svg":0,"../../../assets/icons/product-features/detailed-software-update.svg":0,"../../../assets/icons/product-features/detailed-speedometer-single.svg":0,"../../../assets/icons/product-features/detailed-speedometer-triple.svg":0,"../../../assets/icons/product-features/detailed-transaction-monitoring.svg":0,"../../../assets/icons/product-features/detailed-virus-protection.svg":0,"../../../assets/icons/product-features/simple-active-programs.svg":0,"../../../assets/icons/product-features/simple-android-security.svg":0,"../../../assets/icons/product-features/simple-anti-phishing.svg":0,"../../../assets/icons/product-features/simple-automatic-care.svg":0,"../../../assets/icons/product-features/simple-automatic-cleaning.svg":0,"../../../assets/icons/product-features/simple-behavior.svg":0,"../../../assets/icons/product-features/simple-boost.svg":0,"../../../assets/icons/product-features/simple-browser-cleanup.svg":0,"../../../assets/icons/product-features/simple-browser-extensions.svg":0,"../../../assets/icons/product-features/simple-browser-protection.svg":0,"../../../assets/icons/product-features/simple-calendar-shield.svg":0,"../../../assets/icons/product-features/simple-cloud-cleaner.svg":0,"../../../assets/icons/product-features/simple-core-shields.svg":0,"../../../assets/icons/product-features/simple-customers.svg":0,"../../../assets/icons/product-features/simple-device-home-automation.svg":0,"../../../assets/icons/product-features/simple-email-guardian.svg":0,"../../../assets/icons/product-features/simple-file-shield.svg":0,"../../../assets/icons/product-features/simple-firewall.svg":0,"../../../assets/icons/product-features/simple-genie-ai.svg":0,"../../../assets/icons/product-features/simple-get-prime.svg":0,"../../../assets/icons/product-features/simple-insurance.svg":0,"../../../assets/icons/product-features/simple-lifelock-ai-assistant.svg":0,"../../../assets/icons/product-features/simple-malware.svg":0,"../../../assets/icons/product-features/simple-mobile-security.svg":0,"../../../assets/icons/product-features/simple-monitor-wifi.svg":0,"../../../assets/icons/product-features/simple-monitoring.svg":0,"../../../assets/icons/product-features/simple-performance-optimizer.svg":0,"../../../assets/icons/product-features/simple-phone-call-protection.svg":0,"../../../assets/icons/product-features/simple-photo-optimizer.svg":0,"../../../assets/icons/product-features/simple-pin-ip-address.svg":0,"../../../assets/icons/product-features/simple-plan-details.svg":0,"../../../assets/icons/product-features/simple-privacy-audit.svg":0,"../../../assets/icons/product-features/simple-privacy-monitor-assistant.svg":0,"../../../assets/icons/product-features/simple-privacy-monitor.svg":0,"../../../assets/icons/product-features/simple-private-mode.svg":0,"../../../assets/icons/product-features/simple-product-antitrack.svg":0,"../../../assets/icons/product-features/simple-product-av-free.svg":0,"../../../assets/icons/product-features/simple-product-breach-guard.svg":0,"../../../assets/icons/product-features/simple-product-browser-safety.svg":0,"../../../assets/icons/product-features/simple-product-cleanup-mobile.svg":0,"../../../assets/icons/product-features/simple-product-driver-updater.svg":0,"../../../assets/icons/product-features/simple-product-family-space.svg":0,"../../../assets/icons/product-features/simple-product-mobile-security.svg":0,"../../../assets/icons/product-features/simple-product-passwords.svg":0,"../../../assets/icons/product-features/simple-product-safe-search.svg":0,"../../../assets/icons/product-features/simple-product-safe-shopping.svg":0,"../../../assets/icons/product-features/simple-product-secure-browser.svg":0,"../../../assets/icons/product-features/simple-product-secure-identity.svg":0,"../../../assets/icons/product-features/simple-product-system-speedup.svg":0,"../../../assets/icons/product-features/simple-product-vpn.svg":0,"../../../assets/icons/product-features/simple-protection-score.svg":0,"../../../assets/icons/product-features/simple-quarantine.svg":0,"../../../assets/icons/product-features/simple-quick-clean.svg":0,"../../../assets/icons/product-features/simple-ransomware.svg":0,"../../../assets/icons/product-features/simple-real-site.svg":0,"../../../assets/icons/product-features/simple-remote-desktop-control.svg":0,"../../../assets/icons/product-features/simple-safe-web.svg":0,"../../../assets/icons/product-features/simple-sandbox.svg":0,"../../../assets/icons/product-features/simple-scam-protection.svg":0,"../../../assets/icons/product-features/simple-scan-deep.svg":0,"../../../assets/icons/product-features/simple-scan-device.svg":0,"../../../assets/icons/product-features/simple-scan-quick.svg":0,"../../../assets/icons/product-features/simple-scan-smart.svg":0,"../../../assets/icons/product-features/simple-scan-usb.svg":0,"../../../assets/icons/product-features/simple-scan.svg":0,"../../../assets/icons/product-features/simple-smart-care.svg":0,"../../../assets/icons/product-features/simple-sms-security.svg":0,"../../../assets/icons/product-features/simple-software-uninstaller.svg":0,"../../../assets/icons/product-features/simple-software-update.svg":0,"../../../assets/icons/product-features/simple-subscription.svg":0,"../../../assets/icons/product-features/simple-support24.svg":0,"../../../assets/icons/product-features/simple-suspicious.svg":0,"../../../assets/icons/product-features/simple-tracer.svg":0,"../../../assets/icons/product-features/simple-vpn-protection.svg":0,"../../../assets/icons/product-features/simple-web-shield.svg":0,"../../../assets/icons/product-features/simple-webcam-shield.svg":0,"../../../assets/icons/security/detailed-fingerprint-lock.svg":0,"../../../assets/icons/security/detailed-fingerprint.svg":0,"../../../assets/icons/security/detailed-identity-assistant.svg":0,"../../../assets/icons/security/detailed-password.svg":0,"../../../assets/icons/security/detailed-shield-check.svg":0,"../../../assets/icons/security/detailed-shield-lock.svg":0,"../../../assets/icons/security/detailed-shield.svg":0,"../../../assets/icons/security/simple-fingerprint.svg":0,"../../../assets/icons/security/simple-flag-empty.svg":0,"../../../assets/icons/security/simple-flag.svg":0,"../../../assets/icons/security/simple-lock-filled.svg":0,"../../../assets/icons/security/simple-lock.svg":0,"../../../assets/icons/security/simple-network-detection.svg":0,"../../../assets/icons/security/simple-password.svg":0,"../../../assets/icons/security/simple-shield-alert.svg":0,"../../../assets/icons/security/simple-shield.svg":0,"../../../assets/icons/security/simple-unlock.svg":0,"../../../assets/icons/social/facebook.svg":0,"../../../assets/icons/social/instagram-black.svg":0,"../../../assets/icons/social/instagram-gradient.svg":0,"../../../assets/icons/social/instagram-white.svg":0,"../../../assets/icons/social/linkedin-round.svg":0,"../../../assets/icons/social/linkedin.svg":0,"../../../assets/icons/social/x-reverse-round.svg":0,"../../../assets/icons/social/x-reverse.svg":0,"../../../assets/icons/social/x-round.svg":0,"../../../assets/icons/social/x.svg":0,"../../../assets/icons/status/detailed-access-allowed.svg":0,"../../../assets/icons/status/simple-access-allowed.svg":0,"../../../assets/icons/status/simple-block.svg":0,"../../../assets/icons/status/simple-checkmark-small.svg":0,"../../../assets/icons/status/simple-checkmark.svg":0,"../../../assets/icons/status/simple-exclamation.svg":0,"../../../assets/icons/status/simple-info.svg":0,"../../../assets/icons/status/simple-status-attention-filled.svg":0,"../../../assets/icons/status/simple-status-attention.svg":0,"../../../assets/icons/status/simple-status-critical-filled.svg":0,"../../../assets/icons/status/simple-status-critical.svg":0,"../../../assets/icons/status/simple-status-failed-filled.svg":0,"../../../assets/icons/status/simple-status-failed.svg":0,"../../../assets/icons/status/simple-status-info-filled.svg":0,"../../../assets/icons/status/simple-status-info.svg":0,"../../../assets/icons/status/simple-status-missing-filled.svg":0,"../../../assets/icons/status/simple-status-missing.svg":0,"../../../assets/icons/status/simple-status-ok-filled.svg":0,"../../../assets/icons/status/simple-status-ok.svg":0,"../../../assets/icons/status/simple-status-shield-attention.svg":0,"../../../assets/icons/status/simple-status-shield-critical.svg":0,"../../../assets/icons/status/simple-status-shield-ok.svg":0,"../../../assets/icons/users/detailed-account.svg":0,"../../../assets/icons/users/detailed-profile-delete.svg":0,"../../../assets/icons/users/simple-account.svg":0,"../../../assets/icons/users/simple-profile-delete.svg":0,"../../../assets/icons/users/simple-profile-details.svg":0,"../../../assets/icons/users/simple-profile-people.svg":0,"../../../assets/icons/users/simple-profile-settings.svg":0,"../../../assets/icons/users/simple-profile-unknown.svg":0,"../../../assets/icons/users/simple-profile.svg":0}).map(e=>e.match(/assets\/icons\/([^/]+)\/([^/]+)\.svg$/)).filter(Boolean).map(e=>{let[,t,n]=e;return[`${t}/${n}`,`${zt}assets/icons/${t}/${n}.svg`]}).sort(([e],[t])=>e.localeCompare(t)),Vt=Object.fromEntries(Bt),Ht=Object.keys(Vt),[...new Set(Ht.map(e=>e.split(`/`)[0]))].sort()})))()}var $;function Wt(){return(Wt=t((()=>{$=e(ge(),1),O(),ye(),M(),P(),I(),R(),B(),H(),W(),K(),J(),X(),Ce(),Te(),Oe(),Ae(),Me(),Pe(),Ie(),ze(),Ve(),Ue(),Ge(),qe(),Ye(),Ze(),$e(),tt(),rt(),at(),st(),ft(),mt(),gt(),vt(),bt(),St(),wt(),Et(),Ot(),At(),Mt(),Q(),Ft(),Lt(),Ut(),$.default.registerHelper(`eq`,(e,t)=>e===t),$.default.registerHelper(`unless-eq`,(e,t,n)=>e===t?n.inverse(void 0):n.fn(void 0)),$.default.registerHelper(`lower`,e=>String(e??``).toLowerCase()),$.default.registerHelper(`iconUrl`,e=>Rt(e)),$.default.registerHelper(`codeBoxes`,(e,t)=>{let n=Math.max(1,Number.parseInt(e,10)||6),r=String(t??``);return Array.from({length:n},(e,t)=>({index:t,position:t+1,total:n,char:r[t]??``}))}),ve($.default),be($.default),Se($.default),Ee($.default),Le($.default),lt($.default),$.default.registerPartial(`accordion`,D),$.default.registerPartial(`badge`,j),$.default.registerPartial(`button`,N),$.default.registerPartial(`icon`,F),$.default.registerPartial(`radio`,L),$.default.registerPartial(`checkbox`,z),$.default.registerPartial(`switch`,V),$.default.registerPartial(`pagination-dots`,U),$.default.registerPartial(`logo-wrapper`,G),$.default.registerPartial(`image-wrapper`,q),$.default.registerPartial(`media`,Y),$.default.registerPartial(`pricing`,Z),$.default.registerPartial(`alert`,we),$.default.registerPartial(`award-wrapper`,De),$.default.registerPartial(`award-item`,ke),$.default.registerPartial(`text-link`,je),$.default.registerPartial(`breadcrumb`,Ne),$.default.registerPartial(`content-body`,Re),$.default.registerPartial(`content-title`,Be),$.default.registerPartial(`content-list`,Fe),$.default.registerPartial(`content-block`,He),$.default.registerPartial(`discount-label`,We),$.default.registerPartial(`text-field`,Ke),$.default.registerPartial(`search-box`,Je),$.default.registerPartial(`code-entry`,Xe),$.default.registerPartial(`menu-list`,Qe),$.default.registerPartial(`menu-block`,et),$.default.registerPartial(`progress-indicator`,nt),$.default.registerPartial(`modal`,it),$.default.registerPartial(`pagination`,ot),$.default.registerPartial(`slider`,dt),$.default.registerPartial(`rating`,pt),$.default.registerPartial(`sheet`,ht),$.default.registerPartial(`stepper`,_t),$.default.registerPartial(`table-cell`,yt),$.default.registerPartial(`table-block`,xt),$.default.registerPartial(`tag`,Ct),$.default.registerPartial(`tabs`,Tt),$.default.registerPartial(`tooltip`,Dt),$.default.registerPartial(`toggle`,kt),$.default.registerPartial(`trustpilot`,jt),$.default.registerPartial(`card`,Nt),$.default.registerPartial(`divider`,Pt),$.default.registerPartial(`lower-footer`,It)})))()}function Gt(e){if(!e)return{scss:null,js:null};let t=(t,n)=>[`/src/components/${e}/${e}.${n}`,`/src/layouts/${e}/${e}.${n}`,`/src/pages/${e}/${e}.${n}`].reduce((e,n)=>e??t[n]??null,null);return{scss:t(Yt,`scss`)??t(Zt,`scss`)??t($t,`scss`),js:t(Xt,`js`)??t(Qt,`js`)??t(en,`js`)}}function Kt(e,t={}){let{unit:n,scss:r,js:i,extra:a={}}=t,o=Gt(n),s=r??o.scss,c=i??o.js,l=s&&String(s).trim()||c&&String(c).trim()?Jt(e,{js:c,scss:s}):String(e).trim(),{docs:u,...d}=a;return{...d,docs:{...u&&typeof u==`object`?u:{},source:{code:l,language:`html`,type:`code`}}}}function qt(e,t){let n=RegExp(`</${t}`,`gi`);return String(e).replace(n,`<\\/${t}`)}function Jt(e,{js:t,scss:n}={}){let r=[String(e).trim()];if(t&&String(t).trim()){let e=qt(String(t).trim(),`script`);r.push(``,`<!-- ── JavaScript ── -->`,`<script>`,e,`<\/script>`)}if(n&&String(n).trim()){let e=qt(String(n).trim(),`style`);r.push(``,`<!-- ── SCSS ── -->`,`<style>`,e,`</style>`)}return r.join(`
`)}var Yt,Xt,Zt,Qt,$t,en;function tn(){return(tn=t((()=>{Yt=Object.assign({}),Xt=Object.assign({}),Zt=Object.assign({}),Qt=Object.assign({}),$t=Object.assign({}),en=Object.assign({})})))()}export{He as $,pt as A,B as At,nt as B,O as Bt,bt as C,K as Ct,gt as D,H as Dt,_t as E,U as Et,st as F,N as Ft,Xe as G,et as H,ot as I,P as It,Je as J,Ze as K,at as L,j as Lt,dt as M,L as Mt,ct as N,F as Nt,ht as O,V as Ot,ut as P,I as Pt,Ge as Q,it as R,M as Rt,xt as S,J as St,vt as T,W as Tt,$e as U,tt as V,Qe as W,Ke as X,qe as Y,We as Z,Et as _,Ce as _t,Lt as a,Fe as at,Ct as b,Y as bt,Ft as c,Pe as ct,Mt as d,ke as dt,Ue as et,jt as f,Ae as ft,Dt as g,Te as gt,Ot as h,we as ht,Wt as i,ze as it,ft as j,R as jt,mt as k,z as kt,Nt as l,Me as lt,kt as m,Oe as mt,tn as n,Ve as nt,It as o,Ie as ot,At as p,De as pt,Ye as q,$ as r,Re as rt,Pt as s,Ne as st,Kt as t,Be as tt,Q as u,je as ut,Tt as v,Z as vt,yt as w,G as wt,St as x,q as xt,wt as y,X as yt,rt as z,D as zt};