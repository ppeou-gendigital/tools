import{a as e,n as t,t as n}from"./rolldown-runtime-DkW27tQK.js";import{i as r,r as i}from"./_icon-catalog-CXVEZSzC.js";var a=n((e=>{e.__esModule=!0,e.extend=a,e.indexOf=l,e.escapeExpression=u,e.isEmpty=d,e.createFrame=f,e.blockParams=p,e.appendContextPath=m;var t={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#x27;`,"`":`&#x60;`,"=":`&#x3D;`},n=/[&<>"'`=]/g,r=/[&<>"'`=]/;function i(e){return t[e]}function a(e){for(var t=1;t<arguments.length;t++)for(var n in arguments[t])Object.prototype.hasOwnProperty.call(arguments[t],n)&&(e[n]=arguments[t][n]);return e}var o=Object.prototype.toString;e.toString=o;var s=function(e){return typeof e==`function`};s(/x/)&&(e.isFunction=s=function(e){return typeof e==`function`&&o.call(e)===`[object Function]`}),e.isFunction=s;var c=Array.isArray||function(e){return e&&typeof e==`object`?o.call(e)===`[object Array]`:!1};e.isArray=c;function l(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1}function u(e){if(typeof e!=`string`){if(e&&e.toHTML)return e.toHTML();if(e==null)return``;if(!e)return e+``;e=``+e}return r.test(e)?e.replace(n,i):e}function d(e){return!e&&e!==0||!!(c(e)&&e.length===0)}function f(e){var t=a({},e);return t._parent=e,t}function p(e,t){return e.path=t,e}function m(e,t){return(e?e+`.`:``)+t}})),o=n(((e,t)=>{e.__esModule=!0;var n=[`description`,`fileName`,`lineNumber`,`endLineNumber`,`message`,`name`,`number`,`stack`];function r(e,t){var i=t&&t.loc,a=void 0,o=void 0,s=void 0,c=void 0;i&&(a=i.start.line,o=i.end.line,s=i.start.column,c=i.end.column,e+=` - `+a+`:`+s);for(var l=Error.prototype.constructor.call(this,e),u=0;u<n.length;u++)this[n[u]]=l[n[u]];Error.captureStackTrace&&Error.captureStackTrace(this,r);try{i&&(this.lineNumber=a,this.endLineNumber=o,Object.defineProperty?(Object.defineProperty(this,"column",{value:s,enumerable:!0}),Object.defineProperty(this,"endColumn",{value:c,enumerable:!0})):(this.column=s,this.endColumn=c))}catch{}}r.prototype=Error(),e.default=r,t.exports=e.default})),s=n(((e,t)=>{e.__esModule=!0;var n=a();e.default=function(e){e.registerHelper(`blockHelperMissing`,function(t,r){var i=r.inverse,a=r.fn;if(t===!0)return a(this);if(t===!1||t==null)return i(this);if(n.isArray(t))return t.length>0?(r.ids&&(r.ids=[r.name]),e.helpers.each(t,r)):i(this);if(r.data&&r.ids){var o=n.createFrame(r.data);o.contextPath=n.appendContextPath(r.data.contextPath,r.name),r={data:o}}return a(t,r)})},t.exports=e.default})),c=n(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var r=a(),i=n(o());e.default=function(e){e.registerHelper(`each`,function(e,t){if(!t)throw new i.default(`Must pass iterator to #each`);var n=t.fn,a=t.inverse,o=0,s=``,c=void 0,l=void 0;t.data&&t.ids&&(l=r.appendContextPath(t.data.contextPath,t.ids[0])+`.`),r.isFunction(e)&&(e=e.call(this)),t.data&&(c=r.createFrame(t.data));function u(t,i,a){c&&(c.key=t,c.index=i,c.first=i===0,c.last=!!a,l&&(c.contextPath=l+t)),s+=n(e[t],{data:c,blockParams:r.blockParams([e[t],t],[l+t,null])})}if(e&&typeof e==`object`)if(r.isArray(e))for(var d=e.length;o<d;o++)o in e&&u(o,o,o===e.length-1);else if(typeof Symbol==`function`&&e[Symbol.iterator]){for(var f=[],p=e[Symbol.iterator](),m=p.next();!m.done;m=p.next())f.push(m.value);e=f;for(var d=e.length;o<d;o++)u(o,o,o===e.length-1)}else(function(){var t=void 0;Object.keys(e).forEach(function(e){t!==void 0&&u(t,o-1),t=e,o++}),t!==void 0&&u(t,o-1,!0)})();return o===0&&(s=a(this)),s})},t.exports=e.default})),l=n(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var r=n(o());e.default=function(e){e.registerHelper(`helperMissing`,function(){if(arguments.length!==1)throw new r.default(`Missing helper: "`+arguments[arguments.length-1].name+`"`)})},t.exports=e.default})),u=n(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var r=a(),i=n(o());e.default=function(e){e.registerHelper(`if`,function(e,t){if(arguments.length!=2)throw new i.default(`#if requires exactly one argument`);return r.isFunction(e)&&(e=e.call(this)),!t.hash.includeZero&&!e||r.isEmpty(e)?t.inverse(this):t.fn(this)}),e.registerHelper(`unless`,function(t,n){if(arguments.length!=2)throw new i.default(`#unless requires exactly one argument`);return e.helpers.if.call(this,t,{fn:n.inverse,inverse:n.fn,hash:n.hash})})},t.exports=e.default})),d=n(((e,t)=>{e.__esModule=!0,e.default=function(e){e.registerHelper(`log`,function(){for(var t=[void 0],n=arguments[arguments.length-1],r=0;r<arguments.length-1;r++)t.push(arguments[r]);var i=1;n.hash.level==null?n.data&&n.data.level!=null&&(i=n.data.level):i=n.hash.level,t[0]=i,e.log.apply(e,t)})},t.exports=e.default})),f=n(((e,t)=>{e.__esModule=!0,e.default=function(e){e.registerHelper(`lookup`,function(e,t,n){return e&&n.lookupProperty(e,t)})},t.exports=e.default})),p=n(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var r=a(),i=n(o());e.default=function(e){e.registerHelper(`with`,function(e,t){if(arguments.length!=2)throw new i.default(`#with requires exactly one argument`);r.isFunction(e)&&(e=e.call(this));var n=t.fn;if(r.isEmpty(e))return t.inverse(this);var a=t.data;return t.data&&t.ids&&(a=r.createFrame(t.data),a.contextPath=r.appendContextPath(t.data.contextPath,t.ids[0])),n(e,{data:a,blockParams:r.blockParams([e],[a&&a.contextPath])})})},t.exports=e.default})),m=n((e=>{e.__esModule=!0,e.registerDefaultHelpers=g,e.moveHelperToHooks=_;function t(e){return e&&e.__esModule?e:{default:e}}var n=t(s()),r=t(c()),i=t(l()),a=t(u()),o=t(d()),m=t(f()),h=t(p());function g(e){n.default(e),r.default(e),i.default(e),a.default(e),o.default(e),m.default(e),h.default(e)}function _(e,t,n){e.helpers[t]&&(e.hooks[t]=e.helpers[t],n||(e.helpers[t]=void 0))}})),h=n(((e,t)=>{e.__esModule=!0;var n=a();e.default=function(e){e.registerDecorator(`inline`,function(e,t,r,i){var a=e;return t.partials||(t.partials={},a=function(i,a){var o=r.partials;r.partials=n.extend({},o,t.partials);var s=e(i,a);return r.partials=o,s}),t.partials[i.args[0]]=i.fn,a})},t.exports=e.default})),g=n((e=>{e.__esModule=!0,e.registerDefaultDecorators=r;function t(e){return e&&e.__esModule?e:{default:e}}var n=t(h());function r(e){n.default(e)}})),_=n(((e,t)=>{e.__esModule=!0;var n=a(),r={methodMap:[`debug`,`info`,`warn`,`error`],level:`info`,lookupLevel:function(e){if(typeof e==`string`){var t=n.indexOf(r.methodMap,e.toLowerCase());e=t>=0?t:parseInt(e,10)}return e},log:function(e){if(e=r.lookupLevel(e),typeof console<`u`&&r.lookupLevel(r.level)<=e){var t=r.methodMap[e];console[t]||(t=`log`);var n=[...arguments].slice(1);console[t].apply(console,n)}}};e.default=r,t.exports=e.default})),v=n((e=>{e.__esModule=!0,e.createProtoAccessControl=o,e.resultIsAllowed=s,e.resetLoggedProperties=u;function t(e){return e&&e.__esModule?e:{default:e}}var n=a(),r=t(_()),i=Object.create(null);function o(e){var t=Object.create(null);t.__proto__=!1,n.extend(t,e.allowedProtoProperties);var r=Object.create(null);return r.constructor=!1,r.__defineGetter__=!1,r.__defineSetter__=!1,r.__lookupGetter__=!1,r.__lookupSetter__=!1,n.extend(r,e.allowedProtoMethods),{properties:{whitelist:t,defaultValue:e.allowProtoPropertiesByDefault},methods:{whitelist:r,defaultValue:e.allowProtoMethodsByDefault}}}function s(e,t,n){return c(typeof e==`function`?t.methods:t.properties,n)}function c(e,t){return e.whitelist[t]===void 0?e.defaultValue===void 0?(l(t),!1):e.defaultValue:e.whitelist[t]===!0}function l(e){i[e]!==!0&&(i[e]=!0,r.default.log(`error`,`Handlebars: Access has been denied to resolve the property "`+e+`" because it is not an "own property" of its parent.
You can add a runtime option to disable the check or this warning:
See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details`))}function u(){Object.keys(i).forEach(function(e){delete i[e]})}})),y=n((e=>{e.__esModule=!0,e.HandlebarsEnvironment=d;function t(e){return e&&e.__esModule?e:{default:e}}var n=a(),r=t(o()),i=m(),s=g(),c=t(_()),l=v();e.VERSION=`4.7.9`,e.COMPILER_REVISION=8,e.LAST_COMPATIBLE_COMPILER_REVISION=7,e.REVISION_CHANGES={1:`<= 1.0.rc.2`,2:`== 1.0.0-rc.3`,3:`== 1.0.0-rc.4`,4:`== 1.x.x`,5:`== 2.0.0-alpha.x`,6:`>= 2.0.0-beta.1`,7:`>= 4.0.0 <4.3.0`,8:`>= 4.3.0`};var u=`[object Object]`;function d(e,t,n){this.helpers=e||{},this.partials=t||{},this.decorators=n||{},i.registerDefaultHelpers(this),s.registerDefaultDecorators(this)}d.prototype={constructor:d,logger:c.default,log:c.default.log,registerHelper:function(e,t){if(n.toString.call(e)===u){if(t)throw new r.default(`Arg not supported with multiple helpers`);n.extend(this.helpers,e)}else this.helpers[e]=t},unregisterHelper:function(e){delete this.helpers[e]},registerPartial:function(e,t){if(n.toString.call(e)===u)n.extend(this.partials,e);else{if(t===void 0)throw new r.default(`Attempting to register a partial called "`+e+`" as undefined`);this.partials[e]=t}},unregisterPartial:function(e){delete this.partials[e]},registerDecorator:function(e,t){if(n.toString.call(e)===u){if(t)throw new r.default(`Arg not supported with multiple decorators`);n.extend(this.decorators,e)}else this.decorators[e]=t},unregisterDecorator:function(e){delete this.decorators[e]},resetLoggedPropertyAccesses:function(){l.resetLoggedProperties()}},e.log=c.default.log,e.createFrame=n.createFrame,e.logger=c.default})),b=n(((e,t)=>{e.__esModule=!0;function n(e){this.string=e}n.prototype.toString=n.prototype.toHTML=function(){return``+this.string},e.default=n,t.exports=e.default})),x=n((e=>{e.__esModule=!0,e.wrapHelper=t;function t(e,t){return typeof e==`function`?function(){var n=arguments[arguments.length-1];return arguments[arguments.length-1]=t(n),e.apply(this,arguments)}:e}})),S=n((e=>{e.__esModule=!0,e.checkRevision=d,e.template=f,e.wrapProgram=p,e.resolvePartial=h,e.invokePartial=g,e.noop=_;function t(e){return e&&e.__esModule?e:{default:e}}function n(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}var r=n(a()),i=t(o()),s=y(),c=m(),l=x(),u=v();function d(e){var t=e&&e[0]||1,n=s.COMPILER_REVISION;if(!(t>=s.LAST_COMPATIBLE_COMPILER_REVISION&&t<=s.COMPILER_REVISION)){if(t<s.LAST_COMPATIBLE_COMPILER_REVISION){var r=s.REVISION_CHANGES[n],a=s.REVISION_CHANGES[t];throw new i.default(`Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version (`+r+`) or downgrade your runtime to an older version (`+a+`).`)}throw new i.default(`Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version (`+e[1]+`).`)}}function f(e,t){if(!t)throw new i.default(`No environment passed to template`);if(!e||!e.main)throw new i.default(`Unknown template object: `+typeof e);e.main.decorator=e.main_d,t.VM.checkRevision(e.compiler);var n=e.compiler&&e.compiler[0]===7;function a(n,a,o){o.hash&&(a=r.extend({},a,o.hash),o.ids&&(o.ids[0]=!0)),n=t.VM.resolvePartial.call(this,n,a,o),o.hooks=this.hooks,o.protoAccessControl=this.protoAccessControl;var s=t.VM.invokePartial.call(this,n,a,o);if(s==null&&t.compile&&(o.partials[o.name]=t.compile(n,e.compilerOptions,t),s=o.partials[o.name](a,o)),s!=null){if(o.indent){for(var c=s.split(`
`),l=0,u=c.length;l<u&&!(!c[l]&&l+1===u);l++)c[l]=o.indent+c[l];s=c.join(`
`)}return s}throw new i.default(`The partial `+o.name+` could not be compiled when running in runtime-only mode`)}var o={strict:function(e,t,n){if(!e||!(t in e))throw new i.default(`"`+t+`" not defined in `+e,{loc:n});return o.lookupProperty(e,t)},lookupProperty:function(e,t){var n=e[t];if(n==null||Object.prototype.hasOwnProperty.call(e,t)||u.resultIsAllowed(n,o.protoAccessControl,t))return n},lookup:function(e,t){for(var n=e.length,r=0;r<n;r++){var i=e[r]&&o.lookupProperty(e[r],t);if(i!=null)return i}},lambda:function(e,t){return typeof e==`function`?e.call(t):e},escapeExpression:r.escapeExpression,invokePartial:a,fn:function(t){var n=e[t];return n.decorator=e[t+`_d`],n},programs:[],program:function(e,t,n,r,i){var a=this.programs[e],o=this.fn(e);return t||i||r||n?a=p(this,e,o,t,n,r,i):a||=this.programs[e]=p(this,e,o),a},data:function(e,t){for(;e&&t--;)e=e._parent;return e},mergeIfNeeded:function(e,t){var n=e||t;return e&&t&&e!==t&&(n=r.extend({},t,e)),n},nullContext:Object.seal({}),noop:t.VM.noop,compilerInfo:e.compiler};function s(t){var n=arguments.length<=1||arguments[1]===void 0?{}:arguments[1],r=n.data;s._setup(n),!n.partial&&e.useData&&(r=S(t,r));var i=void 0,a=e.useBlockParams?[]:void 0;e.useDepths&&(i=n.depths?t==n.depths[0]?n.depths:[t].concat(n.depths):[t]);function c(t){return``+e.main(o,t,o.helpers,o.partials,r,a,i)}return c=C(e.main,c,o,n.depths||[],r,a),c(t,n)}return s.isTop=!0,s._setup=function(i){if(i.partial)o.protoAccessControl=i.protoAccessControl,o.helpers=i.helpers,o.partials=i.partials,o.decorators=i.decorators,o.hooks=i.hooks;else{var a={};w(a,t.helpers,o),w(a,i.helpers,o),o.helpers=a,e.usePartial&&(o.partials=o.mergeIfNeeded(i.partials,t.partials)),(e.usePartial||e.useDecorators)&&(o.decorators=r.extend({},t.decorators,i.decorators)),o.hooks={},o.protoAccessControl=u.createProtoAccessControl(i);var s=i.allowCallsToHelperMissing||n;c.moveHelperToHooks(o,`helperMissing`,s),c.moveHelperToHooks(o,`blockHelperMissing`,s)}},s._child=function(t,n,r,a){if(e.useBlockParams&&!r)throw new i.default(`must pass block params`);if(e.useDepths&&!a)throw new i.default(`must pass parent depths`);return p(o,t,e[t],n,0,r,a)},s}function p(e,t,n,r,i,a,o){function s(t){var i=arguments.length<=1||arguments[1]===void 0?{}:arguments[1],s=o;return o&&t!=o[0]&&(t!==e.nullContext||o[0]!==null)&&(s=[t].concat(o)),n(e,t,e.helpers,e.partials,i.data||r,a&&[i.blockParams].concat(a),s)}return s=C(n,s,e,o,r,a),s.program=t,s.depth=o?o.length:0,s.blockParams=i||0,s}function h(e,t,n){return e?!e.call&&!n.name&&(n.name=e,e=b(n.partials,e)):e=n.name===`@partial-block`?b(n.data,`partial-block`):b(n.partials,n.name),e}function g(e,t,n){var a=b(n.data,`partial-block`);n.partial=!0,n.ids&&(n.data.contextPath=n.ids[0]||n.data.contextPath);var o=void 0;if(n.fn&&n.fn!==_&&(function(){n.data=s.createFrame(n.data);var e=n.fn;o=n.data[`partial-block`]=function(t){var n=arguments.length<=1||arguments[1]===void 0?{}:arguments[1];return n.data=s.createFrame(n.data),n.data[`partial-block`]=a,e(t,n)},e.partials&&(n.partials=r.extend({},n.partials,e.partials))})(),e===void 0&&o&&(e=o),e===void 0)throw new i.default(`The partial `+n.name+` could not be found`);if(e instanceof Function)return e(t,n)}function _(){return``}function b(e,t){if(e&&Object.prototype.hasOwnProperty.call(e,t))return e[t]}function S(e,t){return(!t||!(`root`in t))&&(t=t?s.createFrame(t):{},t.root=e),t}function C(e,t,n,i,a,o){if(e.decorator){var s={};t=e.decorator(t,s,n,i&&i[0],a,o,i),r.extend(t,s)}return t}function w(e,t,n){t&&Object.keys(t).forEach(function(r){var i=t[r];e[r]=T(i,n)})}function T(e,t){var n=t.lookupProperty;return l.wrapHelper(e,function(e){return e.lookupProperty=n,e})}})),C=n(((e,t)=>{e.__esModule=!0,e.default=function(e){(function(){typeof globalThis!=`object`&&(Object.prototype.__defineGetter__(`__magic__`,function(){return this}),__magic__.globalThis=__magic__,delete Object.prototype.__magic__)})();var t=globalThis.Handlebars;e.noConflict=function(){return globalThis.Handlebars===e&&(globalThis.Handlebars=t),e}},t.exports=e.default})),w=n(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}function r(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}var i=r(y()),s=n(b()),c=n(o()),l=r(a()),u=r(S()),d=n(C());function f(){var e=new i.HandlebarsEnvironment;return l.extend(e,i),e.SafeString=s.default,e.Exception=c.default,e.Utils=l,e.escapeExpression=l.escapeExpression,e.VM=u,e.template=function(t){return u.template(t,e)},e}var p=f();p.create=f,d.default(p),p.default=p,e.default=p,t.exports=e.default})),T=n(((e,t)=>{e.__esModule=!0;var n={helpers:{helperExpression:function(e){return e.type===`SubExpression`||(e.type===`MustacheStatement`||e.type===`BlockStatement`)&&!!(e.params&&e.params.length||e.hash)},scopedId:function(e){return/^\.|this\b/.test(e.original)},simpleId:function(e){return e.parts.length===1&&!n.helpers.scopedId(e)&&!e.depth}}};e.default=n,t.exports=e.default})),ee=n(((e,t)=>{e.__esModule=!0,e.default=(function(){var e={trace:function(){},yy:{},symbols_:{error:2,root:3,program:4,EOF:5,program_repetition0:6,statement:7,mustache:8,block:9,rawBlock:10,partial:11,partialBlock:12,content:13,COMMENT:14,CONTENT:15,openRawBlock:16,rawBlock_repetition0:17,END_RAW_BLOCK:18,OPEN_RAW_BLOCK:19,helperName:20,openRawBlock_repetition0:21,openRawBlock_option0:22,CLOSE_RAW_BLOCK:23,openBlock:24,block_option0:25,closeBlock:26,openInverse:27,block_option1:28,OPEN_BLOCK:29,openBlock_repetition0:30,openBlock_option0:31,openBlock_option1:32,CLOSE:33,OPEN_INVERSE:34,openInverse_repetition0:35,openInverse_option0:36,openInverse_option1:37,openInverseChain:38,OPEN_INVERSE_CHAIN:39,openInverseChain_repetition0:40,openInverseChain_option0:41,openInverseChain_option1:42,inverseAndProgram:43,INVERSE:44,inverseChain:45,inverseChain_option0:46,OPEN_ENDBLOCK:47,OPEN:48,mustache_repetition0:49,mustache_option0:50,OPEN_UNESCAPED:51,mustache_repetition1:52,mustache_option1:53,CLOSE_UNESCAPED:54,OPEN_PARTIAL:55,partialName:56,partial_repetition0:57,partial_option0:58,openPartialBlock:59,OPEN_PARTIAL_BLOCK:60,openPartialBlock_repetition0:61,openPartialBlock_option0:62,param:63,sexpr:64,OPEN_SEXPR:65,sexpr_repetition0:66,sexpr_option0:67,CLOSE_SEXPR:68,hash:69,hash_repetition_plus0:70,hashSegment:71,ID:72,EQUALS:73,blockParams:74,OPEN_BLOCK_PARAMS:75,blockParams_repetition_plus0:76,CLOSE_BLOCK_PARAMS:77,path:78,dataName:79,STRING:80,NUMBER:81,BOOLEAN:82,UNDEFINED:83,NULL:84,DATA:85,pathSegments:86,SEP:87,$accept:0,$end:1},terminals_:{2:`error`,5:`EOF`,14:`COMMENT`,15:`CONTENT`,18:`END_RAW_BLOCK`,19:`OPEN_RAW_BLOCK`,23:`CLOSE_RAW_BLOCK`,29:`OPEN_BLOCK`,33:`CLOSE`,34:`OPEN_INVERSE`,39:`OPEN_INVERSE_CHAIN`,44:`INVERSE`,47:`OPEN_ENDBLOCK`,48:`OPEN`,51:`OPEN_UNESCAPED`,54:`CLOSE_UNESCAPED`,55:`OPEN_PARTIAL`,60:`OPEN_PARTIAL_BLOCK`,65:`OPEN_SEXPR`,68:`CLOSE_SEXPR`,72:`ID`,73:`EQUALS`,75:`OPEN_BLOCK_PARAMS`,77:`CLOSE_BLOCK_PARAMS`,80:`STRING`,81:`NUMBER`,82:`BOOLEAN`,83:`UNDEFINED`,84:`NULL`,85:`DATA`,87:`SEP`},productions_:[0,[3,2],[4,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[13,1],[10,3],[16,5],[9,4],[9,4],[24,6],[27,6],[38,6],[43,2],[45,3],[45,1],[26,3],[8,5],[8,5],[11,5],[12,3],[59,5],[63,1],[63,1],[64,5],[69,1],[71,3],[74,3],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[56,1],[56,1],[79,2],[78,1],[86,3],[86,1],[6,0],[6,2],[17,0],[17,2],[21,0],[21,2],[22,0],[22,1],[25,0],[25,1],[28,0],[28,1],[30,0],[30,2],[31,0],[31,1],[32,0],[32,1],[35,0],[35,2],[36,0],[36,1],[37,0],[37,1],[40,0],[40,2],[41,0],[41,1],[42,0],[42,1],[46,0],[46,1],[49,0],[49,2],[50,0],[50,1],[52,0],[52,2],[53,0],[53,1],[57,0],[57,2],[58,0],[58,1],[61,0],[61,2],[62,0],[62,1],[66,0],[66,2],[67,0],[67,1],[70,1],[70,2],[76,1],[76,2]],performAction:function(e,t,n,r,i,a,o){var s=a.length-1;switch(i){case 1:return a[s-1];case 2:this.$=r.prepareProgram(a[s]);break;case 3:this.$=a[s];break;case 4:this.$=a[s];break;case 5:this.$=a[s];break;case 6:this.$=a[s];break;case 7:this.$=a[s];break;case 8:this.$=a[s];break;case 9:this.$={type:`CommentStatement`,value:r.stripComment(a[s]),strip:r.stripFlags(a[s],a[s]),loc:r.locInfo(this._$)};break;case 10:this.$={type:`ContentStatement`,original:a[s],value:a[s],loc:r.locInfo(this._$)};break;case 11:this.$=r.prepareRawBlock(a[s-2],a[s-1],a[s],this._$);break;case 12:this.$={path:a[s-3],params:a[s-2],hash:a[s-1]};break;case 13:this.$=r.prepareBlock(a[s-3],a[s-2],a[s-1],a[s],!1,this._$);break;case 14:this.$=r.prepareBlock(a[s-3],a[s-2],a[s-1],a[s],!0,this._$);break;case 15:this.$={open:a[s-5],path:a[s-4],params:a[s-3],hash:a[s-2],blockParams:a[s-1],strip:r.stripFlags(a[s-5],a[s])};break;case 16:this.$={path:a[s-4],params:a[s-3],hash:a[s-2],blockParams:a[s-1],strip:r.stripFlags(a[s-5],a[s])};break;case 17:this.$={path:a[s-4],params:a[s-3],hash:a[s-2],blockParams:a[s-1],strip:r.stripFlags(a[s-5],a[s])};break;case 18:this.$={strip:r.stripFlags(a[s-1],a[s-1]),program:a[s]};break;case 19:var c=r.prepareBlock(a[s-2],a[s-1],a[s],a[s],!1,this._$),l=r.prepareProgram([c],a[s-1].loc);l.chained=!0,this.$={strip:a[s-2].strip,program:l,chain:!0};break;case 20:this.$=a[s];break;case 21:this.$={path:a[s-1],strip:r.stripFlags(a[s-2],a[s])};break;case 22:this.$=r.prepareMustache(a[s-3],a[s-2],a[s-1],a[s-4],r.stripFlags(a[s-4],a[s]),this._$);break;case 23:this.$=r.prepareMustache(a[s-3],a[s-2],a[s-1],a[s-4],r.stripFlags(a[s-4],a[s]),this._$);break;case 24:this.$={type:`PartialStatement`,name:a[s-3],params:a[s-2],hash:a[s-1],indent:``,strip:r.stripFlags(a[s-4],a[s]),loc:r.locInfo(this._$)};break;case 25:this.$=r.preparePartialBlock(a[s-2],a[s-1],a[s],this._$);break;case 26:this.$={path:a[s-3],params:a[s-2],hash:a[s-1],strip:r.stripFlags(a[s-4],a[s])};break;case 27:this.$=a[s];break;case 28:this.$=a[s];break;case 29:this.$={type:`SubExpression`,path:a[s-3],params:a[s-2],hash:a[s-1],loc:r.locInfo(this._$)};break;case 30:this.$={type:`Hash`,pairs:a[s],loc:r.locInfo(this._$)};break;case 31:this.$={type:`HashPair`,key:r.id(a[s-2]),value:a[s],loc:r.locInfo(this._$)};break;case 32:this.$=r.id(a[s-1]);break;case 33:this.$=a[s];break;case 34:this.$=a[s];break;case 35:this.$={type:`StringLiteral`,value:a[s],original:a[s],loc:r.locInfo(this._$)};break;case 36:this.$={type:`NumberLiteral`,value:Number(a[s]),original:Number(a[s]),loc:r.locInfo(this._$)};break;case 37:this.$={type:`BooleanLiteral`,value:a[s]===`true`,original:a[s]===`true`,loc:r.locInfo(this._$)};break;case 38:this.$={type:`UndefinedLiteral`,original:void 0,value:void 0,loc:r.locInfo(this._$)};break;case 39:this.$={type:`NullLiteral`,original:null,value:null,loc:r.locInfo(this._$)};break;case 40:this.$=a[s];break;case 41:this.$=a[s];break;case 42:this.$=r.preparePath(!0,a[s],this._$);break;case 43:this.$=r.preparePath(!1,a[s],this._$);break;case 44:a[s-2].push({part:r.id(a[s]),original:a[s],separator:a[s-1]}),this.$=a[s-2];break;case 45:this.$=[{part:r.id(a[s]),original:a[s]}];break;case 46:this.$=[];break;case 47:a[s-1].push(a[s]);break;case 48:this.$=[];break;case 49:a[s-1].push(a[s]);break;case 50:this.$=[];break;case 51:a[s-1].push(a[s]);break;case 58:this.$=[];break;case 59:a[s-1].push(a[s]);break;case 64:this.$=[];break;case 65:a[s-1].push(a[s]);break;case 70:this.$=[];break;case 71:a[s-1].push(a[s]);break;case 78:this.$=[];break;case 79:a[s-1].push(a[s]);break;case 82:this.$=[];break;case 83:a[s-1].push(a[s]);break;case 86:this.$=[];break;case 87:a[s-1].push(a[s]);break;case 90:this.$=[];break;case 91:a[s-1].push(a[s]);break;case 94:this.$=[];break;case 95:a[s-1].push(a[s]);break;case 98:this.$=[a[s]];break;case 99:a[s-1].push(a[s]);break;case 100:this.$=[a[s]];break;case 101:a[s-1].push(a[s])}},table:[{3:1,4:2,5:[2,46],6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{1:[3]},{5:[1,4]},{5:[2,2],7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:[1,12],15:[1,20],16:17,19:[1,23],24:15,27:16,29:[1,21],34:[1,22],39:[2,2],44:[2,2],47:[2,2],48:[1,13],51:[1,14],55:[1,18],59:19,60:[1,24]},{1:[2,1]},{5:[2,47],14:[2,47],15:[2,47],19:[2,47],29:[2,47],34:[2,47],39:[2,47],44:[2,47],47:[2,47],48:[2,47],51:[2,47],55:[2,47],60:[2,47]},{5:[2,3],14:[2,3],15:[2,3],19:[2,3],29:[2,3],34:[2,3],39:[2,3],44:[2,3],47:[2,3],48:[2,3],51:[2,3],55:[2,3],60:[2,3]},{5:[2,4],14:[2,4],15:[2,4],19:[2,4],29:[2,4],34:[2,4],39:[2,4],44:[2,4],47:[2,4],48:[2,4],51:[2,4],55:[2,4],60:[2,4]},{5:[2,5],14:[2,5],15:[2,5],19:[2,5],29:[2,5],34:[2,5],39:[2,5],44:[2,5],47:[2,5],48:[2,5],51:[2,5],55:[2,5],60:[2,5]},{5:[2,6],14:[2,6],15:[2,6],19:[2,6],29:[2,6],34:[2,6],39:[2,6],44:[2,6],47:[2,6],48:[2,6],51:[2,6],55:[2,6],60:[2,6]},{5:[2,7],14:[2,7],15:[2,7],19:[2,7],29:[2,7],34:[2,7],39:[2,7],44:[2,7],47:[2,7],48:[2,7],51:[2,7],55:[2,7],60:[2,7]},{5:[2,8],14:[2,8],15:[2,8],19:[2,8],29:[2,8],34:[2,8],39:[2,8],44:[2,8],47:[2,8],48:[2,8],51:[2,8],55:[2,8],60:[2,8]},{5:[2,9],14:[2,9],15:[2,9],19:[2,9],29:[2,9],34:[2,9],39:[2,9],44:[2,9],47:[2,9],48:[2,9],51:[2,9],55:[2,9],60:[2,9]},{20:25,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:36,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{4:37,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],39:[2,46],44:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{4:38,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],44:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{15:[2,48],17:39,18:[2,48]},{20:41,56:40,64:42,65:[1,43],72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{4:44,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{5:[2,10],14:[2,10],15:[2,10],18:[2,10],19:[2,10],29:[2,10],34:[2,10],39:[2,10],44:[2,10],47:[2,10],48:[2,10],51:[2,10],55:[2,10],60:[2,10]},{20:45,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:46,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:47,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:41,56:48,64:42,65:[1,43],72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{33:[2,78],49:49,65:[2,78],72:[2,78],80:[2,78],81:[2,78],82:[2,78],83:[2,78],84:[2,78],85:[2,78]},{23:[2,33],33:[2,33],54:[2,33],65:[2,33],68:[2,33],72:[2,33],75:[2,33],80:[2,33],81:[2,33],82:[2,33],83:[2,33],84:[2,33],85:[2,33]},{23:[2,34],33:[2,34],54:[2,34],65:[2,34],68:[2,34],72:[2,34],75:[2,34],80:[2,34],81:[2,34],82:[2,34],83:[2,34],84:[2,34],85:[2,34]},{23:[2,35],33:[2,35],54:[2,35],65:[2,35],68:[2,35],72:[2,35],75:[2,35],80:[2,35],81:[2,35],82:[2,35],83:[2,35],84:[2,35],85:[2,35]},{23:[2,36],33:[2,36],54:[2,36],65:[2,36],68:[2,36],72:[2,36],75:[2,36],80:[2,36],81:[2,36],82:[2,36],83:[2,36],84:[2,36],85:[2,36]},{23:[2,37],33:[2,37],54:[2,37],65:[2,37],68:[2,37],72:[2,37],75:[2,37],80:[2,37],81:[2,37],82:[2,37],83:[2,37],84:[2,37],85:[2,37]},{23:[2,38],33:[2,38],54:[2,38],65:[2,38],68:[2,38],72:[2,38],75:[2,38],80:[2,38],81:[2,38],82:[2,38],83:[2,38],84:[2,38],85:[2,38]},{23:[2,39],33:[2,39],54:[2,39],65:[2,39],68:[2,39],72:[2,39],75:[2,39],80:[2,39],81:[2,39],82:[2,39],83:[2,39],84:[2,39],85:[2,39]},{23:[2,43],33:[2,43],54:[2,43],65:[2,43],68:[2,43],72:[2,43],75:[2,43],80:[2,43],81:[2,43],82:[2,43],83:[2,43],84:[2,43],85:[2,43],87:[1,50]},{72:[1,35],86:51},{23:[2,45],33:[2,45],54:[2,45],65:[2,45],68:[2,45],72:[2,45],75:[2,45],80:[2,45],81:[2,45],82:[2,45],83:[2,45],84:[2,45],85:[2,45],87:[2,45]},{52:52,54:[2,82],65:[2,82],72:[2,82],80:[2,82],81:[2,82],82:[2,82],83:[2,82],84:[2,82],85:[2,82]},{25:53,38:55,39:[1,57],43:56,44:[1,58],45:54,47:[2,54]},{28:59,43:60,44:[1,58],47:[2,56]},{13:62,15:[1,20],18:[1,61]},{33:[2,86],57:63,65:[2,86],72:[2,86],80:[2,86],81:[2,86],82:[2,86],83:[2,86],84:[2,86],85:[2,86]},{33:[2,40],65:[2,40],72:[2,40],80:[2,40],81:[2,40],82:[2,40],83:[2,40],84:[2,40],85:[2,40]},{33:[2,41],65:[2,41],72:[2,41],80:[2,41],81:[2,41],82:[2,41],83:[2,41],84:[2,41],85:[2,41]},{20:64,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{26:65,47:[1,66]},{30:67,33:[2,58],65:[2,58],72:[2,58],75:[2,58],80:[2,58],81:[2,58],82:[2,58],83:[2,58],84:[2,58],85:[2,58]},{33:[2,64],35:68,65:[2,64],72:[2,64],75:[2,64],80:[2,64],81:[2,64],82:[2,64],83:[2,64],84:[2,64],85:[2,64]},{21:69,23:[2,50],65:[2,50],72:[2,50],80:[2,50],81:[2,50],82:[2,50],83:[2,50],84:[2,50],85:[2,50]},{33:[2,90],61:70,65:[2,90],72:[2,90],80:[2,90],81:[2,90],82:[2,90],83:[2,90],84:[2,90],85:[2,90]},{20:74,33:[2,80],50:71,63:72,64:75,65:[1,43],69:73,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{72:[1,79]},{23:[2,42],33:[2,42],54:[2,42],65:[2,42],68:[2,42],72:[2,42],75:[2,42],80:[2,42],81:[2,42],82:[2,42],83:[2,42],84:[2,42],85:[2,42],87:[1,50]},{20:74,53:80,54:[2,84],63:81,64:75,65:[1,43],69:82,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{26:83,47:[1,66]},{47:[2,55]},{4:84,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],39:[2,46],44:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{47:[2,20]},{20:85,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{4:86,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{26:87,47:[1,66]},{47:[2,57]},{5:[2,11],14:[2,11],15:[2,11],19:[2,11],29:[2,11],34:[2,11],39:[2,11],44:[2,11],47:[2,11],48:[2,11],51:[2,11],55:[2,11],60:[2,11]},{15:[2,49],18:[2,49]},{20:74,33:[2,88],58:88,63:89,64:75,65:[1,43],69:90,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{65:[2,94],66:91,68:[2,94],72:[2,94],80:[2,94],81:[2,94],82:[2,94],83:[2,94],84:[2,94],85:[2,94]},{5:[2,25],14:[2,25],15:[2,25],19:[2,25],29:[2,25],34:[2,25],39:[2,25],44:[2,25],47:[2,25],48:[2,25],51:[2,25],55:[2,25],60:[2,25]},{20:92,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:74,31:93,33:[2,60],63:94,64:75,65:[1,43],69:95,70:76,71:77,72:[1,78],75:[2,60],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:74,33:[2,66],36:96,63:97,64:75,65:[1,43],69:98,70:76,71:77,72:[1,78],75:[2,66],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:74,22:99,23:[2,52],63:100,64:75,65:[1,43],69:101,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:74,33:[2,92],62:102,63:103,64:75,65:[1,43],69:104,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{33:[1,105]},{33:[2,79],65:[2,79],72:[2,79],80:[2,79],81:[2,79],82:[2,79],83:[2,79],84:[2,79],85:[2,79]},{33:[2,81]},{23:[2,27],33:[2,27],54:[2,27],65:[2,27],68:[2,27],72:[2,27],75:[2,27],80:[2,27],81:[2,27],82:[2,27],83:[2,27],84:[2,27],85:[2,27]},{23:[2,28],33:[2,28],54:[2,28],65:[2,28],68:[2,28],72:[2,28],75:[2,28],80:[2,28],81:[2,28],82:[2,28],83:[2,28],84:[2,28],85:[2,28]},{23:[2,30],33:[2,30],54:[2,30],68:[2,30],71:106,72:[1,107],75:[2,30]},{23:[2,98],33:[2,98],54:[2,98],68:[2,98],72:[2,98],75:[2,98]},{23:[2,45],33:[2,45],54:[2,45],65:[2,45],68:[2,45],72:[2,45],73:[1,108],75:[2,45],80:[2,45],81:[2,45],82:[2,45],83:[2,45],84:[2,45],85:[2,45],87:[2,45]},{23:[2,44],33:[2,44],54:[2,44],65:[2,44],68:[2,44],72:[2,44],75:[2,44],80:[2,44],81:[2,44],82:[2,44],83:[2,44],84:[2,44],85:[2,44],87:[2,44]},{54:[1,109]},{54:[2,83],65:[2,83],72:[2,83],80:[2,83],81:[2,83],82:[2,83],83:[2,83],84:[2,83],85:[2,83]},{54:[2,85]},{5:[2,13],14:[2,13],15:[2,13],19:[2,13],29:[2,13],34:[2,13],39:[2,13],44:[2,13],47:[2,13],48:[2,13],51:[2,13],55:[2,13],60:[2,13]},{38:55,39:[1,57],43:56,44:[1,58],45:111,46:110,47:[2,76]},{33:[2,70],40:112,65:[2,70],72:[2,70],75:[2,70],80:[2,70],81:[2,70],82:[2,70],83:[2,70],84:[2,70],85:[2,70]},{47:[2,18]},{5:[2,14],14:[2,14],15:[2,14],19:[2,14],29:[2,14],34:[2,14],39:[2,14],44:[2,14],47:[2,14],48:[2,14],51:[2,14],55:[2,14],60:[2,14]},{33:[1,113]},{33:[2,87],65:[2,87],72:[2,87],80:[2,87],81:[2,87],82:[2,87],83:[2,87],84:[2,87],85:[2,87]},{33:[2,89]},{20:74,63:115,64:75,65:[1,43],67:114,68:[2,96],69:116,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{33:[1,117]},{32:118,33:[2,62],74:119,75:[1,120]},{33:[2,59],65:[2,59],72:[2,59],75:[2,59],80:[2,59],81:[2,59],82:[2,59],83:[2,59],84:[2,59],85:[2,59]},{33:[2,61],75:[2,61]},{33:[2,68],37:121,74:122,75:[1,120]},{33:[2,65],65:[2,65],72:[2,65],75:[2,65],80:[2,65],81:[2,65],82:[2,65],83:[2,65],84:[2,65],85:[2,65]},{33:[2,67],75:[2,67]},{23:[1,123]},{23:[2,51],65:[2,51],72:[2,51],80:[2,51],81:[2,51],82:[2,51],83:[2,51],84:[2,51],85:[2,51]},{23:[2,53]},{33:[1,124]},{33:[2,91],65:[2,91],72:[2,91],80:[2,91],81:[2,91],82:[2,91],83:[2,91],84:[2,91],85:[2,91]},{33:[2,93]},{5:[2,22],14:[2,22],15:[2,22],19:[2,22],29:[2,22],34:[2,22],39:[2,22],44:[2,22],47:[2,22],48:[2,22],51:[2,22],55:[2,22],60:[2,22]},{23:[2,99],33:[2,99],54:[2,99],68:[2,99],72:[2,99],75:[2,99]},{73:[1,108]},{20:74,63:125,64:75,65:[1,43],72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{5:[2,23],14:[2,23],15:[2,23],19:[2,23],29:[2,23],34:[2,23],39:[2,23],44:[2,23],47:[2,23],48:[2,23],51:[2,23],55:[2,23],60:[2,23]},{47:[2,19]},{47:[2,77]},{20:74,33:[2,72],41:126,63:127,64:75,65:[1,43],69:128,70:76,71:77,72:[1,78],75:[2,72],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{5:[2,24],14:[2,24],15:[2,24],19:[2,24],29:[2,24],34:[2,24],39:[2,24],44:[2,24],47:[2,24],48:[2,24],51:[2,24],55:[2,24],60:[2,24]},{68:[1,129]},{65:[2,95],68:[2,95],72:[2,95],80:[2,95],81:[2,95],82:[2,95],83:[2,95],84:[2,95],85:[2,95]},{68:[2,97]},{5:[2,21],14:[2,21],15:[2,21],19:[2,21],29:[2,21],34:[2,21],39:[2,21],44:[2,21],47:[2,21],48:[2,21],51:[2,21],55:[2,21],60:[2,21]},{33:[1,130]},{33:[2,63]},{72:[1,132],76:131},{33:[1,133]},{33:[2,69]},{15:[2,12],18:[2,12]},{14:[2,26],15:[2,26],19:[2,26],29:[2,26],34:[2,26],47:[2,26],48:[2,26],51:[2,26],55:[2,26],60:[2,26]},{23:[2,31],33:[2,31],54:[2,31],68:[2,31],72:[2,31],75:[2,31]},{33:[2,74],42:134,74:135,75:[1,120]},{33:[2,71],65:[2,71],72:[2,71],75:[2,71],80:[2,71],81:[2,71],82:[2,71],83:[2,71],84:[2,71],85:[2,71]},{33:[2,73],75:[2,73]},{23:[2,29],33:[2,29],54:[2,29],65:[2,29],68:[2,29],72:[2,29],75:[2,29],80:[2,29],81:[2,29],82:[2,29],83:[2,29],84:[2,29],85:[2,29]},{14:[2,15],15:[2,15],19:[2,15],29:[2,15],34:[2,15],39:[2,15],44:[2,15],47:[2,15],48:[2,15],51:[2,15],55:[2,15],60:[2,15]},{72:[1,137],77:[1,136]},{72:[2,100],77:[2,100]},{14:[2,16],15:[2,16],19:[2,16],29:[2,16],34:[2,16],44:[2,16],47:[2,16],48:[2,16],51:[2,16],55:[2,16],60:[2,16]},{33:[1,138]},{33:[2,75]},{33:[2,32]},{72:[2,101],77:[2,101]},{14:[2,17],15:[2,17],19:[2,17],29:[2,17],34:[2,17],39:[2,17],44:[2,17],47:[2,17],48:[2,17],51:[2,17],55:[2,17],60:[2,17]}],defaultActions:{4:[2,1],54:[2,55],56:[2,20],60:[2,57],73:[2,81],82:[2,85],86:[2,18],90:[2,89],101:[2,53],104:[2,93],110:[2,19],111:[2,77],116:[2,97],119:[2,63],122:[2,69],135:[2,75],136:[2,32]},parseError:function(e,t){throw Error(e)},parse:function(e){var t=this,n=[0],r=[null],i=[],a=this.table,o=``,s=0,c=0,l=0;this.lexer.setInput(e),this.lexer.yy=this.yy,this.yy.lexer=this.lexer,this.yy.parser=this,this.lexer.yylloc===void 0&&(this.lexer.yylloc={});var u=this.lexer.yylloc;i.push(u);var d=this.lexer.options&&this.lexer.options.ranges;typeof this.yy.parseError==`function`&&(this.parseError=this.yy.parseError);function f(){var e=t.lexer.lex()||1;return typeof e!=`number`&&(e=t.symbols_[e]||e),e}for(var p,m,h,g,_,v={},y,b,x,S;;){if(h=n[n.length-1],this.defaultActions[h]?g=this.defaultActions[h]:(p??=f(),g=a[h]&&a[h][p]),g===void 0||!g.length||!g[0]){var C=``;if(!l){for(y in S=[],a[h])this.terminals_[y]&&y>2&&S.push(`'`+this.terminals_[y]+`'`);C=this.lexer.showPosition?`Parse error on line `+(s+1)+`:
`+this.lexer.showPosition()+`
Expecting `+S.join(`, `)+`, got '`+(this.terminals_[p]||p)+`'`:`Parse error on line `+(s+1)+`: Unexpected `+(p==1?`end of input`:`'`+(this.terminals_[p]||p)+`'`),this.parseError(C,{text:this.lexer.match,token:this.terminals_[p]||p,line:this.lexer.yylineno,loc:u,expected:S})}}if(g[0]instanceof Array&&g.length>1)throw Error(`Parse Error: multiple actions possible at state: `+h+`, token: `+p);switch(g[0]){case 1:n.push(p),r.push(this.lexer.yytext),i.push(this.lexer.yylloc),n.push(g[1]),p=null,m?(p=m,m=null):(c=this.lexer.yyleng,o=this.lexer.yytext,s=this.lexer.yylineno,u=this.lexer.yylloc,l>0&&l--);break;case 2:if(b=this.productions_[g[1]][1],v.$=r[r.length-b],v._$={first_line:i[i.length-(b||1)].first_line,last_line:i[i.length-1].last_line,first_column:i[i.length-(b||1)].first_column,last_column:i[i.length-1].last_column},d&&(v._$.range=[i[i.length-(b||1)].range[0],i[i.length-1].range[1]]),_=this.performAction.call(v,o,c,s,this.yy,g[1],r,i),_!==void 0)return _;b&&(n=n.slice(0,-1*b*2),r=r.slice(0,-1*b),i=i.slice(0,-1*b)),n.push(this.productions_[g[1]][0]),r.push(v.$),i.push(v._$),x=a[n[n.length-2]][n[n.length-1]],n.push(x);break;case 3:return!0}}return!0}};e.lexer=(function(){var e={EOF:1,parseError:function(e,t){if(this.yy.parser)this.yy.parser.parseError(e,t);else throw Error(e)},setInput:function(e){return this._input=e,this._more=this._less=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match=``,this.conditionStack=[`INITIAL`],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var e=this._input[0];return this.yytext+=e,this.yyleng++,this.offset++,this.match+=e,this.matched+=e,e.match(/(?:\r\n?|\n).*/g)?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),e},unput:function(e){var t=e.length,n=e.split(/(?:\r\n?|\n)/g);this._input=e+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-t-1),this.offset-=t;var r=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),n.length-1&&(this.yylineno-=n.length-1);var i=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:n?(n.length===r.length?this.yylloc.first_column:0)+r[r.length-n.length].length-n[0].length:this.yylloc.first_column-t},this.options.ranges&&(this.yylloc.range=[i[0],i[0]+this.yyleng-t]),this},more:function(){return this._more=!0,this},less:function(e){this.unput(this.match.slice(e))},pastInput:function(){var e=this.matched.substr(0,this.matched.length-this.match.length);return(e.length>20?`...`:``)+e.substr(-20).replace(/\n/g,``)},upcomingInput:function(){var e=this.match;return e.length<20&&(e+=this._input.substr(0,20-e.length)),(e.substr(0,20)+(e.length>20?`...`:``)).replace(/\n/g,``)},showPosition:function(){var e=this.pastInput(),t=Array(e.length+1).join(`-`);return e+this.upcomingInput()+`
`+t+`^`},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var e,t,n,r,i;this._more||(this.yytext=``,this.match=``);for(var a=this._currentRules(),o=0;o<a.length&&(n=this._input.match(this.rules[a[o]]),!(n&&(!t||n[0].length>t[0].length)&&(t=n,r=o,!this.options.flex)));o++);return t?(i=t[0].match(/(?:\r\n?|\n).*/g),i&&(this.yylineno+=i.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:i?i[i.length-1].length-i[i.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+t[0].length},this.yytext+=t[0],this.match+=t[0],this.matches=t,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._input=this._input.slice(t[0].length),this.matched+=t[0],e=this.performAction.call(this,this.yy,this,a[r],this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),e||void 0):this._input===``?this.EOF:this.parseError(`Lexical error on line `+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:``,token:null,line:this.yylineno})},lex:function(){var e=this.next();return e===void 0?this.lex():e},begin:function(e){this.conditionStack.push(e)},popState:function(){return this.conditionStack.pop()},_currentRules:function(){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules},topState:function(){return this.conditionStack[this.conditionStack.length-2]},pushState:function(e){this.begin(e)}};return e.options={},e.performAction=function(e,t,n,r){function i(e,n){return t.yytext=t.yytext.substring(e,t.yyleng-n+e)}switch(n){case 0:if(t.yytext.slice(-2)===`\\\\`?(i(0,1),this.begin(`mu`)):t.yytext.slice(-1)===`\\`?(i(0,1),this.begin(`emu`)):this.begin(`mu`),t.yytext)return 15;break;case 1:return 15;case 2:return this.popState(),15;case 3:return this.begin(`raw`),15;case 4:return this.popState(),this.conditionStack[this.conditionStack.length-1]===`raw`?15:(i(5,9),`END_RAW_BLOCK`);case 5:return 15;case 6:return this.popState(),14;case 7:return 65;case 8:return 68;case 9:return 19;case 10:return this.popState(),this.begin(`raw`),23;case 11:return 55;case 12:return 60;case 13:return 29;case 14:return 47;case 15:return this.popState(),44;case 16:return this.popState(),44;case 17:return 34;case 18:return 39;case 19:return 51;case 20:return 48;case 21:this.unput(t.yytext),this.popState(),this.begin(`com`);break;case 22:return this.popState(),14;case 23:return 48;case 24:return 73;case 25:return 72;case 26:return 72;case 27:return 87;case 28:break;case 29:return this.popState(),54;case 30:return this.popState(),33;case 31:return t.yytext=i(1,2).replace(/\\"/g,`"`),80;case 32:return t.yytext=i(1,2).replace(/\\'/g,`'`),80;case 33:return 85;case 34:return 82;case 35:return 82;case 36:return 83;case 37:return 84;case 38:return 81;case 39:return 75;case 40:return 77;case 41:return 72;case 42:return t.yytext=t.yytext.replace(/\\([\\\]])/g,`$1`),72;case 43:return`INVALID`;case 44:return 5}},e.rules=[/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/,/^(?:\{\{\{\{(?=[^\/]))/,/^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/,/^(?:[^\x00]+?(?=(\{\{\{\{)))/,/^(?:[\s\S]*?--(~)?\}\})/,/^(?:\()/,/^(?:\))/,/^(?:\{\{\{\{)/,/^(?:\}\}\}\})/,/^(?:\{\{(~)?>)/,/^(?:\{\{(~)?#>)/,/^(?:\{\{(~)?#\*?)/,/^(?:\{\{(~)?\/)/,/^(?:\{\{(~)?\^\s*(~)?\}\})/,/^(?:\{\{(~)?\s*else\s*(~)?\}\})/,/^(?:\{\{(~)?\^)/,/^(?:\{\{(~)?\s*else\b)/,/^(?:\{\{(~)?\{)/,/^(?:\{\{(~)?&)/,/^(?:\{\{(~)?!--)/,/^(?:\{\{(~)?![\s\S]*?\}\})/,/^(?:\{\{(~)?\*?)/,/^(?:=)/,/^(?:\.\.)/,/^(?:\.(?=([=~}\s\/.)|])))/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}(~)?\}\})/,/^(?:(~)?\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@)/,/^(?:true(?=([~}\s)])))/,/^(?:false(?=([~}\s)])))/,/^(?:undefined(?=([~}\s)])))/,/^(?:null(?=([~}\s)])))/,/^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/,/^(?:as\s+\|)/,/^(?:\|)/,/^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/,/^(?:\[(\\\]|[^\]])*\])/,/^(?:.)/,/^(?:$)/],e.conditions={mu:{rules:[7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44],inclusive:!1},emu:{rules:[2],inclusive:!1},com:{rules:[6],inclusive:!1},raw:{rules:[3,4,5],inclusive:!1},INITIAL:{rules:[0,1,44],inclusive:!0}},e})();function t(){this.yy={}}return t.prototype=e,e.Parser=t,new t})(),t.exports=e.default})),te=n(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var r=n(o());function i(){this.parents=[]}i.prototype={constructor:i,mutating:!1,acceptKey:function(e,t){var n=this.accept(e[t]);if(this.mutating){if(n&&!i.prototype[n.type])throw new r.default(`Unexpected node type "`+n.type+`" found when accepting `+t+` on `+e.type);e[t]=n}},acceptRequired:function(e,t){if(this.acceptKey(e,t),!e[t])throw new r.default(e.type+` requires `+t)},acceptArray:function(e){for(var t=0,n=e.length;t<n;t++)this.acceptKey(e,t),e[t]||(e.splice(t,1),t--,n--)},accept:function(e){if(e){if(!this[e.type])throw new r.default(`Unknown type: `+e.type,e);this.current&&this.parents.unshift(this.current),this.current=e;var t=this[e.type](e);if(this.current=this.parents.shift(),!this.mutating||t)return t;if(t!==!1)return e}},Program:function(e){this.acceptArray(e.body)},MustacheStatement:a,Decorator:a,BlockStatement:s,DecoratorBlock:s,PartialStatement:c,PartialBlockStatement:function(e){c.call(this,e),this.acceptKey(e,`program`)},ContentStatement:function(){},CommentStatement:function(){},SubExpression:a,PathExpression:function(){},StringLiteral:function(){},NumberLiteral:function(){},BooleanLiteral:function(){},UndefinedLiteral:function(){},NullLiteral:function(){},Hash:function(e){this.acceptArray(e.pairs)},HashPair:function(e){this.acceptRequired(e,`value`)}};function a(e){this.acceptRequired(e,`path`),this.acceptArray(e.params),this.acceptKey(e,`hash`)}function s(e){a.call(this,e),this.acceptKey(e,`program`),this.acceptKey(e,`inverse`)}function c(e){this.acceptRequired(e,`name`),this.acceptArray(e.params),this.acceptKey(e,`hash`)}e.default=i,t.exports=e.default})),ne=n(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var r=n(te());function i(){var e=arguments.length<=0||arguments[0]===void 0?{}:arguments[0];this.options=e}i.prototype=new r.default,i.prototype.Program=function(e){var t=!this.options.ignoreStandalone,n=!this.isRootSeen;this.isRootSeen=!0;for(var r=e.body,i=0,l=r.length;i<l;i++){var u=r[i],d=this.accept(u);if(d){var f=a(r,i,n),p=o(r,i,n),m=d.openStandalone&&f,h=d.closeStandalone&&p,g=d.inlineStandalone&&f&&p;d.close&&s(r,i,!0),d.open&&c(r,i,!0),t&&g&&(s(r,i),c(r,i)&&u.type===`PartialStatement`&&(u.indent=/([ \t]+$)/.exec(r[i-1].original)[1])),t&&m&&(s((u.program||u.inverse).body),c(r,i)),t&&h&&(s(r,i),c((u.inverse||u.program).body))}}return e},i.prototype.BlockStatement=i.prototype.DecoratorBlock=i.prototype.PartialBlockStatement=function(e){this.accept(e.program),this.accept(e.inverse);var t=e.program||e.inverse,n=e.program&&e.inverse,r=n,i=n;if(n&&n.chained)for(r=n.body[0].program;i.chained;)i=i.body[i.body.length-1].program;var l={open:e.openStrip.open,close:e.closeStrip.close,openStandalone:o(t.body),closeStandalone:a((r||t).body)};if(e.openStrip.close&&s(t.body,null,!0),n){var u=e.inverseStrip;u.open&&c(t.body,null,!0),u.close&&s(r.body,null,!0),e.closeStrip.open&&c(i.body,null,!0),!this.options.ignoreStandalone&&a(t.body)&&o(r.body)&&(c(t.body),s(r.body))}else e.closeStrip.open&&c(t.body,null,!0);return l},i.prototype.Decorator=i.prototype.MustacheStatement=function(e){return e.strip},i.prototype.PartialStatement=i.prototype.CommentStatement=function(e){var t=e.strip||{};return{inlineStandalone:!0,open:t.open,close:t.close}};function a(e,t,n){t===void 0&&(t=e.length);var r=e[t-1],i=e[t-2];if(!r)return n;if(r.type===`ContentStatement`)return(i||!n?/\r?\n\s*?$/:/(^|\r?\n)\s*?$/).test(r.original)}function o(e,t,n){t===void 0&&(t=-1);var r=e[t+1],i=e[t+2];if(!r)return n;if(r.type===`ContentStatement`)return(i||!n?/^\s*?\r?\n/:/^\s*?(\r?\n|$)/).test(r.original)}function s(e,t,n){var r=e[t==null?0:t+1];if(!(!r||r.type!==`ContentStatement`||!n&&r.rightStripped)){var i=r.value;r.value=r.value.replace(n?/^\s+/:/^[ \t]*\r?\n?/,``),r.rightStripped=r.value!==i}}function c(e,t,n){var r=e[t==null?e.length-1:t-1];if(!(!r||r.type!==`ContentStatement`||!n&&r.leftStripped)){var i=r.value;return r.value=r.value.replace(n?/\s+$/:/[ \t]+$/,``),r.leftStripped=r.value!==i,r.leftStripped}}e.default=i,t.exports=e.default})),re=n((e=>{e.__esModule=!0,e.SourceLocation=i,e.id=a,e.stripFlags=s,e.stripComment=c,e.preparePath=l,e.prepareMustache=u,e.prepareRawBlock=d,e.prepareBlock=f,e.prepareProgram=p,e.preparePartialBlock=m;function t(e){return e&&e.__esModule?e:{default:e}}var n=t(o());function r(e,t){if(t=t.path?t.path.original:t,e.path.original!==t){var r={loc:e.path.loc};throw new n.default(e.path.original+` doesn't match `+t,r)}}function i(e,t){this.source=e,this.start={line:t.first_line,column:t.first_column},this.end={line:t.last_line,column:t.last_column}}function a(e){return/^\[.*\]$/.test(e)?e.substring(1,e.length-1):e}function s(e,t){return{open:e.charAt(2)===`~`,close:t.charAt(t.length-3)===`~`}}function c(e){return e.replace(/^\{\{~?!-?-?/,``).replace(/-?-?~?\}\}$/,``)}function l(e,t,r){r=this.locInfo(r);for(var i=e?`@`:``,a=[],o=0,s=0,c=t.length;s<c;s++){var l=t[s].part,u=t[s].original!==l;if(i+=(t[s].separator||``)+l,!u&&(l===`..`||l===`.`||l===`this`)){if(a.length>0)throw new n.default(`Invalid path: `+i,{loc:r});l===`..`&&o++}else a.push(l)}return{type:`PathExpression`,data:e,depth:o,parts:a,original:i,loc:r}}function u(e,t,n,r,i,a){var o=r.charAt(3)||r.charAt(2),s=o!==`{`&&o!==`&`;return{type:/\*/.test(r)?`Decorator`:`MustacheStatement`,path:e,params:t,hash:n,escaped:s,strip:i,loc:this.locInfo(a)}}function d(e,t,n,i){r(e,n),i=this.locInfo(i);var a={type:`Program`,body:t,strip:{},loc:i};return{type:`BlockStatement`,path:e.path,params:e.params,hash:e.hash,program:a,openStrip:{},inverseStrip:{},closeStrip:{},loc:i}}function f(e,t,i,a,o,s){a&&a.path&&r(e,a);var c=/\*/.test(e.open);t.blockParams=e.blockParams;var l=void 0,u=void 0;if(i){if(c)throw new n.default(`Unexpected inverse block on decorator`,i);i.chain&&(i.program.body[0].closeStrip=a.strip),u=i.strip,l=i.program}return o&&(o=l,l=t,t=o),{type:c?`DecoratorBlock`:`BlockStatement`,path:e.path,params:e.params,hash:e.hash,program:t,inverse:l,openStrip:e.strip,inverseStrip:u,closeStrip:a&&a.strip,loc:this.locInfo(s)}}function p(e,t){if(!t&&e.length){var n=e[0].loc,r=e[e.length-1].loc;n&&r&&(t={source:n.source,start:{line:n.start.line,column:n.start.column},end:{line:r.end.line,column:r.end.column}})}return{type:`Program`,body:e,strip:{},loc:t}}function m(e,t,n,i){return r(e,n),{type:`PartialBlockStatement`,name:e.path,params:e.params,hash:e.hash,program:t,openStrip:e.strip,closeStrip:n&&n.strip,loc:this.locInfo(i)}}})),ie=n((e=>{e.__esModule=!0,e.parseWithoutProcessing=d,e.parse=f;function t(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function n(e){return e&&e.__esModule?e:{default:e}}var r=n(ee()),i=n(ne()),s=t(re()),c=n(o()),l=a();e.parser=r.default;var u={};l.extend(u,s);function d(e,t){return e.type===`Program`?(p(e),e):(r.default.yy=u,u.locInfo=function(e){return new u.SourceLocation(t&&t.srcName,e)},r.default.parse(e))}function f(e,t){var n=d(e,t);return new i.default(t).accept(n)}function p(e){m(e)}function m(e){if(e!=null){if(Array.isArray(e)){e.forEach(m);return}if(typeof e==`object`){if(e.type===`PathExpression`){if(!h(e.depth))throw new c.default(`Invalid AST: PathExpression.depth must be an integer`);if(!Array.isArray(e.parts))throw new c.default(`Invalid AST: PathExpression.parts must be an array`);for(var t=0;t<e.parts.length;t++)if(typeof e.parts[t]!=`string`)throw new c.default(`Invalid AST: PathExpression.parts must only contain strings`)}else if(e.type===`NumberLiteral`){if(typeof e.value!=`number`||!isFinite(e.value))throw new c.default(`Invalid AST: NumberLiteral.value must be a number`)}else if(e.type===`BooleanLiteral`&&typeof e.value!=`boolean`)throw new c.default(`Invalid AST: BooleanLiteral.value must be a boolean`);Object.keys(e).forEach(function(t){t!==`loc`&&m(e[t])})}}}function h(e){return typeof e==`number`&&isFinite(e)&&Math.floor(e)===e&&e>=0}})),ae=n((e=>{e.__esModule=!0,e.Compiler=c,e.precompile=l,e.compile=u;function t(e){return e&&e.__esModule?e:{default:e}}var n=t(o()),r=a(),i=t(T()),s=[].slice;function c(){}c.prototype={compiler:c,equals:function(e){var t=this.opcodes.length;if(e.opcodes.length!==t)return!1;for(var n=0;n<t;n++){var r=this.opcodes[n],i=e.opcodes[n];if(r.opcode!==i.opcode||!d(r.args,i.args))return!1}t=this.children.length;for(var n=0;n<t;n++)if(!this.children[n].equals(e.children[n]))return!1;return!0},guid:0,compile:function(e,t){return this.sourceNode=[],this.opcodes=[],this.children=[],this.options=t,this.stringParams=t.stringParams,this.trackIds=t.trackIds,t.blockParams=t.blockParams||[],t.knownHelpers=r.extend(Object.create(null),{helperMissing:!0,blockHelperMissing:!0,each:!0,if:!0,unless:!0,with:!0,log:!0,lookup:!0},t.knownHelpers),this.accept(e)},compileProgram:function(e){var t=new this.compiler().compile(e,this.options),n=this.guid++;return this.usePartial=this.usePartial||t.usePartial,this.children[n]=t,this.useDepths=this.useDepths||t.useDepths,n},accept:function(e){if(!this[e.type])throw new n.default(`Unknown type: `+e.type,e);this.sourceNode.unshift(e);var t=this[e.type](e);return this.sourceNode.shift(),t},Program:function(e){this.options.blockParams.unshift(e.blockParams);for(var t=e.body,n=t.length,r=0;r<n;r++)this.accept(t[r]);return this.options.blockParams.shift(),this.isSimple=n===1,this.blockParams=e.blockParams?e.blockParams.length:0,this},BlockStatement:function(e){f(e);var t=e.program,n=e.inverse;t&&=this.compileProgram(t),n&&=this.compileProgram(n);var r=this.classifySexpr(e);r===`helper`?this.helperSexpr(e,t,n):r===`simple`?(this.simpleSexpr(e),this.opcode(`pushProgram`,t),this.opcode(`pushProgram`,n),this.opcode(`emptyHash`),this.opcode(`blockValue`,e.path.original)):(this.ambiguousSexpr(e,t,n),this.opcode(`pushProgram`,t),this.opcode(`pushProgram`,n),this.opcode(`emptyHash`),this.opcode(`ambiguousBlockValue`)),this.opcode(`append`)},DecoratorBlock:function(e){var t=e.program&&this.compileProgram(e.program),n=this.setupFullMustacheParams(e,t,void 0),r=e.path;this.useDecorators=!0,this.opcode(`registerDecorator`,n.length,r.original)},PartialStatement:function(e){this.usePartial=!0;var t=e.program;t&&=this.compileProgram(e.program);var r=e.params;if(r.length>1)throw new n.default(`Unsupported number of partial arguments: `+r.length,e);r.length||(this.options.explicitPartialContext?this.opcode(`pushLiteral`,`undefined`):r.push({type:`PathExpression`,parts:[],depth:0}));var i=e.name.original,a=e.name.type===`SubExpression`;a&&this.accept(e.name),this.setupFullMustacheParams(e,t,void 0,!0);var o=e.indent||``;this.options.preventIndent&&o&&(this.opcode(`appendContent`,o),o=``),this.opcode(`invokePartial`,a,i,o),this.opcode(`append`)},PartialBlockStatement:function(e){this.PartialStatement(e)},MustacheStatement:function(e){this.SubExpression(e),e.escaped&&!this.options.noEscape?this.opcode(`appendEscaped`):this.opcode(`append`)},Decorator:function(e){this.DecoratorBlock(e)},ContentStatement:function(e){e.value&&this.opcode(`appendContent`,e.value)},CommentStatement:function(){},SubExpression:function(e){f(e);var t=this.classifySexpr(e);t===`simple`?this.simpleSexpr(e):t===`helper`?this.helperSexpr(e):this.ambiguousSexpr(e)},ambiguousSexpr:function(e,t,n){var r=e.path,i=r.parts[0],a=t!=null||n!=null;this.opcode(`getContext`,r.depth),this.opcode(`pushProgram`,t),this.opcode(`pushProgram`,n),r.strict=!0,this.accept(r),this.opcode(`invokeAmbiguous`,i,a)},simpleSexpr:function(e){var t=e.path;t.strict=!0,this.accept(t),this.opcode(`resolvePossibleLambda`)},helperSexpr:function(e,t,r){var a=this.setupFullMustacheParams(e,t,r),o=e.path,s=o.parts[0];if(this.options.knownHelpers[s])this.opcode(`invokeKnownHelper`,a.length,s);else if(this.options.knownHelpersOnly)throw new n.default(`You specified knownHelpersOnly, but used the unknown helper `+s,e);else o.strict=!0,o.falsy=!0,this.accept(o),this.opcode(`invokeHelper`,a.length,o.original,i.default.helpers.simpleId(o))},PathExpression:function(e){this.addDepth(e.depth),this.opcode(`getContext`,e.depth);var t=e.parts[0],n=i.default.helpers.scopedId(e),r=!e.depth&&!n&&this.blockParamIndex(t);r?this.opcode(`lookupBlockParam`,r,e.parts):t?e.data?(this.options.data=!0,this.opcode(`lookupData`,e.depth,e.parts,e.strict)):this.opcode(`lookupOnContext`,e.parts,e.falsy,e.strict,n):this.opcode(`pushContext`)},StringLiteral:function(e){this.opcode(`pushString`,e.value)},NumberLiteral:function(e){this.opcode(`pushLiteral`,e.value)},BooleanLiteral:function(e){this.opcode(`pushLiteral`,e.value)},UndefinedLiteral:function(){this.opcode(`pushLiteral`,`undefined`)},NullLiteral:function(){this.opcode(`pushLiteral`,`null`)},Hash:function(e){var t=e.pairs,n=0,r=t.length;for(this.opcode(`pushHash`);n<r;n++)this.pushParam(t[n].value);for(;n--;)this.opcode(`assignToHash`,t[n].key);this.opcode(`popHash`)},opcode:function(e){this.opcodes.push({opcode:e,args:s.call(arguments,1),loc:this.sourceNode[0].loc})},addDepth:function(e){e&&(this.useDepths=!0)},classifySexpr:function(e){var t=i.default.helpers.simpleId(e.path),n=t&&!!this.blockParamIndex(e.path.parts[0]),r=!n&&i.default.helpers.helperExpression(e),a=!n&&(r||t);if(a&&!r){var o=e.path.parts[0],s=this.options;s.knownHelpers[o]?r=!0:s.knownHelpersOnly&&(a=!1)}return r?`helper`:a?`ambiguous`:`simple`},pushParams:function(e){for(var t=0,n=e.length;t<n;t++)this.pushParam(e[t])},pushParam:function(e){var t=e.value==null?e.original||``:e.value;if(this.stringParams)t.replace&&(t=t.replace(/^(\.?\.\/)*/g,``).replace(/\//g,`.`)),e.depth&&this.addDepth(e.depth),this.opcode(`getContext`,e.depth||0),this.opcode(`pushStringParam`,t,e.type),e.type===`SubExpression`&&this.accept(e);else{if(this.trackIds){var n=void 0;if(e.parts&&!i.default.helpers.scopedId(e)&&!e.depth&&(n=this.blockParamIndex(e.parts[0])),n){var r=e.parts.slice(1).join(`.`);this.opcode(`pushId`,`BlockParam`,n,r)}else t=e.original||t,t.replace&&(t=t.replace(/^this(?:\.|$)/,``).replace(/^\.\//,``).replace(/^\.$/,``)),this.opcode(`pushId`,e.type,t)}this.accept(e)}},setupFullMustacheParams:function(e,t,n,r){var i=e.params;return this.pushParams(i),this.opcode(`pushProgram`,t),this.opcode(`pushProgram`,n),e.hash?this.accept(e.hash):this.opcode(`emptyHash`,r),i},blockParamIndex:function(e){for(var t=0,n=this.options.blockParams.length;t<n;t++){var i=this.options.blockParams[t],a=i&&r.indexOf(i,e);if(i&&a>=0)return[t,a]}}};function l(e,t,r){if(e==null||typeof e!=`string`&&e.type!==`Program`)throw new n.default(`You must pass a string or Handlebars AST to Handlebars.precompile. You passed `+e);t||={},`data`in t||(t.data=!0),t.compat&&(t.useDepths=!0);var i=r.parse(e,t),a=new r.Compiler().compile(i,t);return new r.JavaScriptCompiler().compile(a,t)}function u(e,t,i){if(t===void 0&&(t={}),e==null||typeof e!=`string`&&e.type!==`Program`)throw new n.default(`You must pass a string or Handlebars AST to Handlebars.compile. You passed `+e);t=r.extend({},t),`data`in t||(t.data=!0),t.compat&&(t.useDepths=!0);var a=void 0;function o(){var n=i.parse(e,t),r=new i.Compiler().compile(n,t),a=new i.JavaScriptCompiler().compile(r,t,void 0,!0);return i.template(a)}function s(e,t){return a||=o(),a.call(this,e,t)}return s._setup=function(e){return a||=o(),a._setup(e)},s._child=function(e,t,n,r){return a||=o(),a._child(e,t,n,r)},s}function d(e,t){if(e===t)return!0;if(r.isArray(e)&&r.isArray(t)&&e.length===t.length){for(var n=0;n<e.length;n++)if(!d(e[n],t[n]))return!1;return!0}}function f(e){if(!e.path.parts){var t=e.path;e.path={type:`PathExpression`,data:!1,depth:0,parts:[t.original+``],original:t.original+``,loc:t.loc}}}})),oe=n((e=>{var t=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`.split(``);e.encode=function(e){if(0<=e&&e<t.length)return t[e];throw TypeError(`Must be between 0 and 63: `+e)},e.decode=function(e){var t=65,n=90,r=97,i=122,a=48;return t<=e&&e<=n?e-t:r<=e&&e<=i?e-r+26:a<=e&&e<=57?e-a+52:e==43?62:e==47?63:-1}})),se=n((e=>{var t=oe(),n=5,r=1<<n,i=r-1,a=r;function o(e){return e<0?(-e<<1)+1:(e<<1)+0}function s(e){var t=(e&1)==1,n=e>>1;return t?-n:n}e.encode=function(e){var r=``,s,c=o(e);do s=c&i,c>>>=n,c>0&&(s|=a),r+=t.encode(s);while(c>0);return r},e.decode=function(e,r,o){var c=e.length,l=0,u=0,d,f;do{if(r>=c)throw Error(`Expected more digits in base 64 VLQ value.`);if(f=t.decode(e.charCodeAt(r++)),f===-1)throw Error(`Invalid base64 digit: `+e.charAt(r-1));d=!!(f&a),f&=i,l+=f<<u,u+=n}while(d);o.value=s(l),o.rest=r}})),E=n((e=>{function t(e,t,n){if(t in e)return e[t];if(arguments.length===3)return n;throw Error(`"`+t+`" is a required argument.`)}e.getArg=t;var n=/^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/,r=/^data:.+\,.+$/;function i(e){var t=e.match(n);return t?{scheme:t[1],auth:t[2],host:t[3],port:t[4],path:t[5]}:null}e.urlParse=i;function a(e){var t=``;return e.scheme&&(t+=e.scheme+`:`),t+=`//`,e.auth&&(t+=e.auth+`@`),e.host&&(t+=e.host),e.port&&(t+=`:`+e.port),e.path&&(t+=e.path),t}e.urlGenerate=a;function o(t){var n=t,r=i(t);if(r){if(!r.path)return t;n=r.path}for(var o=e.isAbsolute(n),s=n.split(/\/+/),c,l=0,u=s.length-1;u>=0;u--)c=s[u],c===`.`?s.splice(u,1):c===`..`?l++:l>0&&(c===``?(s.splice(u+1,l),l=0):(s.splice(u,2),l--));return n=s.join(`/`),n===``&&(n=o?`/`:`.`),r?(r.path=n,a(r)):n}e.normalize=o;function s(e,t){e===``&&(e=`.`),t===``&&(t=`.`);var n=i(t),s=i(e);if(s&&(e=s.path||`/`),n&&!n.scheme)return s&&(n.scheme=s.scheme),a(n);if(n||t.match(r))return t;if(s&&!s.host&&!s.path)return s.host=t,a(s);var c=t.charAt(0)===`/`?t:o(e.replace(/\/+$/,``)+`/`+t);return s?(s.path=c,a(s)):c}e.join=s,e.isAbsolute=function(e){return e.charAt(0)===`/`||n.test(e)};function c(e,t){e===``&&(e=`.`),e=e.replace(/\/$/,``);for(var n=0;t.indexOf(e+`/`)!==0;){var r=e.lastIndexOf(`/`);if(r<0||(e=e.slice(0,r),e.match(/^([^\/]+:\/)?\/*$/)))return t;++n}return Array(n+1).join(`../`)+t.substr(e.length+1)}e.relative=c;var l=function(){return!(`__proto__`in Object.create(null))}();function u(e){return e}function d(e){return p(e)?`$`+e:e}e.toSetString=l?u:d;function f(e){return p(e)?e.slice(1):e}e.fromSetString=l?u:f;function p(e){if(!e)return!1;var t=e.length;if(t<9||e.charCodeAt(t-1)!==95||e.charCodeAt(t-2)!==95||e.charCodeAt(t-3)!==111||e.charCodeAt(t-4)!==116||e.charCodeAt(t-5)!==111||e.charCodeAt(t-6)!==114||e.charCodeAt(t-7)!==112||e.charCodeAt(t-8)!==95||e.charCodeAt(t-9)!==95)return!1;for(var n=t-10;n>=0;n--)if(e.charCodeAt(n)!==36)return!1;return!0}function m(e,t,n){var r=g(e.source,t.source);return r!==0||(r=e.originalLine-t.originalLine,r!==0)||(r=e.originalColumn-t.originalColumn,r!==0||n)||(r=e.generatedColumn-t.generatedColumn,r!==0)||(r=e.generatedLine-t.generatedLine,r!==0)?r:g(e.name,t.name)}e.compareByOriginalPositions=m;function h(e,t,n){var r=e.generatedLine-t.generatedLine;return r!==0||(r=e.generatedColumn-t.generatedColumn,r!==0||n)||(r=g(e.source,t.source),r!==0)||(r=e.originalLine-t.originalLine,r!==0)||(r=e.originalColumn-t.originalColumn,r!==0)?r:g(e.name,t.name)}e.compareByGeneratedPositionsDeflated=h;function g(e,t){return e===t?0:e===null?1:t===null?-1:e>t?1:-1}function _(e,t){var n=e.generatedLine-t.generatedLine;return n!==0||(n=e.generatedColumn-t.generatedColumn,n!==0)||(n=g(e.source,t.source),n!==0)||(n=e.originalLine-t.originalLine,n!==0)||(n=e.originalColumn-t.originalColumn,n!==0)?n:g(e.name,t.name)}e.compareByGeneratedPositionsInflated=_;function v(e){return JSON.parse(e.replace(/^\)]}'[^\n]*\n/,``))}e.parseSourceMapInput=v;function y(e,t,n){if(t||=``,e&&(e[e.length-1]!==`/`&&t[0]!==`/`&&(e+=`/`),t=e+t),n){var r=i(n);if(!r)throw Error(`sourceMapURL could not be parsed`);if(r.path){var c=r.path.lastIndexOf(`/`);c>=0&&(r.path=r.path.substring(0,c+1))}t=s(a(r),t)}return o(t)}e.computeSourceURL=y})),ce=n((e=>{var t=E(),n=Object.prototype.hasOwnProperty,r=typeof Map<`u`;function i(){this._array=[],this._set=r?new Map:Object.create(null)}i.fromArray=function(e,t){for(var n=new i,r=0,a=e.length;r<a;r++)n.add(e[r],t);return n},i.prototype.size=function(){return r?this._set.size:Object.getOwnPropertyNames(this._set).length},i.prototype.add=function(e,i){var a=r?e:t.toSetString(e),o=r?this.has(e):n.call(this._set,a),s=this._array.length;(!o||i)&&this._array.push(e),o||(r?this._set.set(e,s):this._set[a]=s)},i.prototype.has=function(e){if(r)return this._set.has(e);var i=t.toSetString(e);return n.call(this._set,i)},i.prototype.indexOf=function(e){if(r){var i=this._set.get(e);if(i>=0)return i}else{var a=t.toSetString(e);if(n.call(this._set,a))return this._set[a]}throw Error(`"`+e+`" is not in the set.`)},i.prototype.at=function(e){if(e>=0&&e<this._array.length)return this._array[e];throw Error(`No element indexed by `+e)},i.prototype.toArray=function(){return this._array.slice()},e.ArraySet=i})),le=n((e=>{var t=E();function n(e,n){var r=e.generatedLine,i=n.generatedLine,a=e.generatedColumn,o=n.generatedColumn;return i>r||i==r&&o>=a||t.compareByGeneratedPositionsInflated(e,n)<=0}function r(){this._array=[],this._sorted=!0,this._last={generatedLine:-1,generatedColumn:0}}r.prototype.unsortedForEach=function(e,t){this._array.forEach(e,t)},r.prototype.add=function(e){n(this._last,e)?(this._last=e,this._array.push(e)):(this._sorted=!1,this._array.push(e))},r.prototype.toArray=function(){return this._sorted||=(this._array.sort(t.compareByGeneratedPositionsInflated),!0),this._array},e.MappingList=r})),ue=n((e=>{var t=se(),n=E(),r=ce().ArraySet,i=le().MappingList;function a(e){e||={},this._file=n.getArg(e,`file`,null),this._sourceRoot=n.getArg(e,`sourceRoot`,null),this._skipValidation=n.getArg(e,`skipValidation`,!1),this._sources=new r,this._names=new r,this._mappings=new i,this._sourcesContents=null}a.prototype._version=3,a.fromSourceMap=function(e){var t=e.sourceRoot,r=new a({file:e.file,sourceRoot:t});return e.eachMapping(function(e){var i={generated:{line:e.generatedLine,column:e.generatedColumn}};e.source!=null&&(i.source=e.source,t!=null&&(i.source=n.relative(t,i.source)),i.original={line:e.originalLine,column:e.originalColumn},e.name!=null&&(i.name=e.name)),r.addMapping(i)}),e.sources.forEach(function(i){var a=i;t!==null&&(a=n.relative(t,i)),r._sources.has(a)||r._sources.add(a);var o=e.sourceContentFor(i);o!=null&&r.setSourceContent(i,o)}),r},a.prototype.addMapping=function(e){var t=n.getArg(e,`generated`),r=n.getArg(e,`original`,null),i=n.getArg(e,`source`,null),a=n.getArg(e,`name`,null);this._skipValidation||this._validateMapping(t,r,i,a),i!=null&&(i=String(i),this._sources.has(i)||this._sources.add(i)),a!=null&&(a=String(a),this._names.has(a)||this._names.add(a)),this._mappings.add({generatedLine:t.line,generatedColumn:t.column,originalLine:r!=null&&r.line,originalColumn:r!=null&&r.column,source:i,name:a})},a.prototype.setSourceContent=function(e,t){var r=e;this._sourceRoot!=null&&(r=n.relative(this._sourceRoot,r)),t==null?this._sourcesContents&&(delete this._sourcesContents[n.toSetString(r)],Object.keys(this._sourcesContents).length===0&&(this._sourcesContents=null)):(this._sourcesContents||=Object.create(null),this._sourcesContents[n.toSetString(r)]=t)},a.prototype.applySourceMap=function(e,t,i){var a=t;if(t==null){if(e.file==null)throw Error(`SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`);a=e.file}var o=this._sourceRoot;o!=null&&(a=n.relative(o,a));var s=new r,c=new r;this._mappings.unsortedForEach(function(t){if(t.source===a&&t.originalLine!=null){var r=e.originalPositionFor({line:t.originalLine,column:t.originalColumn});r.source!=null&&(t.source=r.source,i!=null&&(t.source=n.join(i,t.source)),o!=null&&(t.source=n.relative(o,t.source)),t.originalLine=r.line,t.originalColumn=r.column,r.name!=null&&(t.name=r.name))}var l=t.source;l!=null&&!s.has(l)&&s.add(l);var u=t.name;u!=null&&!c.has(u)&&c.add(u)},this),this._sources=s,this._names=c,e.sources.forEach(function(t){var r=e.sourceContentFor(t);r!=null&&(i!=null&&(t=n.join(i,t)),o!=null&&(t=n.relative(o,t)),this.setSourceContent(t,r))},this)},a.prototype._validateMapping=function(e,t,n,r){if(t&&typeof t.line!=`number`&&typeof t.column!=`number`)throw Error(`original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.`);if(!(e&&`line`in e&&`column`in e&&e.line>0&&e.column>=0&&!t&&!n&&!r)&&!(e&&`line`in e&&`column`in e&&t&&`line`in t&&`column`in t&&e.line>0&&e.column>=0&&t.line>0&&t.column>=0&&n))throw Error(`Invalid mapping: `+JSON.stringify({generated:e,source:n,original:t,name:r}))},a.prototype._serializeMappings=function(){for(var e=0,r=1,i=0,a=0,o=0,s=0,c=``,l,u,d,f,p=this._mappings.toArray(),m=0,h=p.length;m<h;m++){if(u=p[m],l=``,u.generatedLine!==r)for(e=0;u.generatedLine!==r;)l+=`;`,r++;else if(m>0){if(!n.compareByGeneratedPositionsInflated(u,p[m-1]))continue;l+=`,`}l+=t.encode(u.generatedColumn-e),e=u.generatedColumn,u.source!=null&&(f=this._sources.indexOf(u.source),l+=t.encode(f-s),s=f,l+=t.encode(u.originalLine-1-a),a=u.originalLine-1,l+=t.encode(u.originalColumn-i),i=u.originalColumn,u.name!=null&&(d=this._names.indexOf(u.name),l+=t.encode(d-o),o=d)),c+=l}return c},a.prototype._generateSourcesContent=function(e,t){return e.map(function(e){if(!this._sourcesContents)return null;t!=null&&(e=n.relative(t,e));var r=n.toSetString(e);return Object.prototype.hasOwnProperty.call(this._sourcesContents,r)?this._sourcesContents[r]:null},this)},a.prototype.toJSON=function(){var e={version:this._version,sources:this._sources.toArray(),names:this._names.toArray(),mappings:this._serializeMappings()};return this._file!=null&&(e.file=this._file),this._sourceRoot!=null&&(e.sourceRoot=this._sourceRoot),this._sourcesContents&&(e.sourcesContent=this._generateSourcesContent(e.sources,e.sourceRoot)),e},a.prototype.toString=function(){return JSON.stringify(this.toJSON())},e.SourceMapGenerator=a})),de=n((e=>{e.GREATEST_LOWER_BOUND=1,e.LEAST_UPPER_BOUND=2;function t(n,r,i,a,o,s){var c=Math.floor((r-n)/2)+n,l=o(i,a[c],!0);return l===0?c:l>0?r-c>1?t(c,r,i,a,o,s):s==e.LEAST_UPPER_BOUND?r<a.length?r:-1:c:c-n>1?t(n,c,i,a,o,s):s==e.LEAST_UPPER_BOUND?c:n<0?-1:n}e.search=function(n,r,i,a){if(r.length===0)return-1;var o=t(-1,r.length,n,r,i,a||e.GREATEST_LOWER_BOUND);if(o<0)return-1;for(;o-1>=0&&i(r[o],r[o-1],!0)===0;)--o;return o}})),fe=n((e=>{function t(e,t,n){var r=e[t];e[t]=e[n],e[n]=r}function n(e,t){return Math.round(e+Math.random()*(t-e))}function r(e,i,a,o){if(a<o){var s=n(a,o),c=a-1;t(e,s,o);for(var l=e[o],u=a;u<o;u++)i(e[u],l)<=0&&(c+=1,t(e,c,u));t(e,c+1,u);var d=c+1;r(e,i,a,d-1),r(e,i,d+1,o)}}e.quickSort=function(e,t){r(e,t,0,e.length-1)}})),pe=n((e=>{var t=E(),n=de(),r=ce().ArraySet,i=se(),a=fe().quickSort;function o(e,n){var r=e;return typeof e==`string`&&(r=t.parseSourceMapInput(e)),r.sections==null?new s(r,n):new l(r,n)}o.fromSourceMap=function(e,t){return s.fromSourceMap(e,t)},o.prototype._version=3,o.prototype.__generatedMappings=null,Object.defineProperty(o.prototype,"_generatedMappings",{configurable:!0,enumerable:!0,get:function(){return this.__generatedMappings||this._parseMappings(this._mappings,this.sourceRoot),this.__generatedMappings}}),o.prototype.__originalMappings=null,Object.defineProperty(o.prototype,"_originalMappings",{configurable:!0,enumerable:!0,get:function(){return this.__originalMappings||this._parseMappings(this._mappings,this.sourceRoot),this.__originalMappings}}),o.prototype._charIsMappingSeparator=function(e,t){var n=e.charAt(t);return n===`;`||n===`,`},o.prototype._parseMappings=function(e,t){throw Error(`Subclasses must implement _parseMappings`)},o.GENERATED_ORDER=1,o.ORIGINAL_ORDER=2,o.GREATEST_LOWER_BOUND=1,o.LEAST_UPPER_BOUND=2,o.prototype.eachMapping=function(e,n,r){var i=n||null,a=r||o.GENERATED_ORDER,s;switch(a){case o.GENERATED_ORDER:s=this._generatedMappings;break;case o.ORIGINAL_ORDER:s=this._originalMappings;break;default:throw Error(`Unknown order of iteration.`)}var c=this.sourceRoot;s.map(function(e){var n=e.source===null?null:this._sources.at(e.source);return n=t.computeSourceURL(c,n,this._sourceMapURL),{source:n,generatedLine:e.generatedLine,generatedColumn:e.generatedColumn,originalLine:e.originalLine,originalColumn:e.originalColumn,name:e.name===null?null:this._names.at(e.name)}},this).forEach(e,i)},o.prototype.allGeneratedPositionsFor=function(e){var r=t.getArg(e,`line`),i={source:t.getArg(e,`source`),originalLine:r,originalColumn:t.getArg(e,`column`,0)};if(i.source=this._findSourceIndex(i.source),i.source<0)return[];var a=[],o=this._findMapping(i,this._originalMappings,`originalLine`,`originalColumn`,t.compareByOriginalPositions,n.LEAST_UPPER_BOUND);if(o>=0){var s=this._originalMappings[o];if(e.column===void 0)for(var c=s.originalLine;s&&s.originalLine===c;)a.push({line:t.getArg(s,`generatedLine`,null),column:t.getArg(s,`generatedColumn`,null),lastColumn:t.getArg(s,`lastGeneratedColumn`,null)}),s=this._originalMappings[++o];else for(var l=s.originalColumn;s&&s.originalLine===r&&s.originalColumn==l;)a.push({line:t.getArg(s,`generatedLine`,null),column:t.getArg(s,`generatedColumn`,null),lastColumn:t.getArg(s,`lastGeneratedColumn`,null)}),s=this._originalMappings[++o]}return a},e.SourceMapConsumer=o;function s(e,n){var i=e;typeof e==`string`&&(i=t.parseSourceMapInput(e));var a=t.getArg(i,`version`),o=t.getArg(i,`sources`),s=t.getArg(i,`names`,[]),c=t.getArg(i,`sourceRoot`,null),l=t.getArg(i,`sourcesContent`,null),u=t.getArg(i,`mappings`),d=t.getArg(i,`file`,null);if(a!=this._version)throw Error(`Unsupported version: `+a);c&&=t.normalize(c),o=o.map(String).map(t.normalize).map(function(e){return c&&t.isAbsolute(c)&&t.isAbsolute(e)?t.relative(c,e):e}),this._names=r.fromArray(s.map(String),!0),this._sources=r.fromArray(o,!0),this._absoluteSources=this._sources.toArray().map(function(e){return t.computeSourceURL(c,e,n)}),this.sourceRoot=c,this.sourcesContent=l,this._mappings=u,this._sourceMapURL=n,this.file=d}s.prototype=Object.create(o.prototype),s.prototype.consumer=o,s.prototype._findSourceIndex=function(e){var n=e;if(this.sourceRoot!=null&&(n=t.relative(this.sourceRoot,n)),this._sources.has(n))return this._sources.indexOf(n);var r;for(r=0;r<this._absoluteSources.length;++r)if(this._absoluteSources[r]==e)return r;return-1},s.fromSourceMap=function(e,n){var i=Object.create(s.prototype),o=i._names=r.fromArray(e._names.toArray(),!0),l=i._sources=r.fromArray(e._sources.toArray(),!0);i.sourceRoot=e._sourceRoot,i.sourcesContent=e._generateSourcesContent(i._sources.toArray(),i.sourceRoot),i.file=e._file,i._sourceMapURL=n,i._absoluteSources=i._sources.toArray().map(function(e){return t.computeSourceURL(i.sourceRoot,e,n)});for(var u=e._mappings.toArray().slice(),d=i.__generatedMappings=[],f=i.__originalMappings=[],p=0,m=u.length;p<m;p++){var h=u[p],g=new c;g.generatedLine=h.generatedLine,g.generatedColumn=h.generatedColumn,h.source&&(g.source=l.indexOf(h.source),g.originalLine=h.originalLine,g.originalColumn=h.originalColumn,h.name&&(g.name=o.indexOf(h.name)),f.push(g)),d.push(g)}return a(i.__originalMappings,t.compareByOriginalPositions),i},s.prototype._version=3,Object.defineProperty(s.prototype,"sources",{get:function(){return this._absoluteSources.slice()}});function c(){this.generatedLine=0,this.generatedColumn=0,this.source=null,this.originalLine=null,this.originalColumn=null,this.name=null}s.prototype._parseMappings=function(e,n){for(var r=1,o=0,s=0,l=0,u=0,d=0,f=e.length,p=0,m={},h={},g=[],_=[],v,y,b,x,S;p<f;)if(e.charAt(p)===`;`)r++,p++,o=0;else if(e.charAt(p)===`,`)p++;else{for(v=new c,v.generatedLine=r,x=p;x<f&&!this._charIsMappingSeparator(e,x);x++);if(y=e.slice(p,x),b=m[y],b)p+=y.length;else{for(b=[];p<x;)i.decode(e,p,h),S=h.value,p=h.rest,b.push(S);if(b.length===2)throw Error(`Found a source, but no line and column`);if(b.length===3)throw Error(`Found a source and line, but no column`);m[y]=b}v.generatedColumn=o+b[0],o=v.generatedColumn,b.length>1&&(v.source=u+b[1],u+=b[1],v.originalLine=s+b[2],s=v.originalLine,v.originalLine+=1,v.originalColumn=l+b[3],l=v.originalColumn,b.length>4&&(v.name=d+b[4],d+=b[4])),_.push(v),typeof v.originalLine==`number`&&g.push(v)}a(_,t.compareByGeneratedPositionsDeflated),this.__generatedMappings=_,a(g,t.compareByOriginalPositions),this.__originalMappings=g},s.prototype._findMapping=function(e,t,r,i,a,o){if(e[r]<=0)throw TypeError(`Line must be greater than or equal to 1, got `+e[r]);if(e[i]<0)throw TypeError(`Column must be greater than or equal to 0, got `+e[i]);return n.search(e,t,a,o)},s.prototype.computeColumnSpans=function(){for(var e=0;e<this._generatedMappings.length;++e){var t=this._generatedMappings[e];if(e+1<this._generatedMappings.length){var n=this._generatedMappings[e+1];if(t.generatedLine===n.generatedLine){t.lastGeneratedColumn=n.generatedColumn-1;continue}}t.lastGeneratedColumn=1/0}},s.prototype.originalPositionFor=function(e){var n={generatedLine:t.getArg(e,`line`),generatedColumn:t.getArg(e,`column`)},r=this._findMapping(n,this._generatedMappings,`generatedLine`,`generatedColumn`,t.compareByGeneratedPositionsDeflated,t.getArg(e,`bias`,o.GREATEST_LOWER_BOUND));if(r>=0){var i=this._generatedMappings[r];if(i.generatedLine===n.generatedLine){var a=t.getArg(i,`source`,null);a!==null&&(a=this._sources.at(a),a=t.computeSourceURL(this.sourceRoot,a,this._sourceMapURL));var s=t.getArg(i,`name`,null);return s!==null&&(s=this._names.at(s)),{source:a,line:t.getArg(i,`originalLine`,null),column:t.getArg(i,`originalColumn`,null),name:s}}}return{source:null,line:null,column:null,name:null}},s.prototype.hasContentsOfAllSources=function(){return this.sourcesContent?this.sourcesContent.length>=this._sources.size()&&!this.sourcesContent.some(function(e){return e==null}):!1},s.prototype.sourceContentFor=function(e,n){if(!this.sourcesContent)return null;var r=this._findSourceIndex(e);if(r>=0)return this.sourcesContent[r];var i=e;this.sourceRoot!=null&&(i=t.relative(this.sourceRoot,i));var a;if(this.sourceRoot!=null&&(a=t.urlParse(this.sourceRoot))){var o=i.replace(/^file:\/\//,``);if(a.scheme==`file`&&this._sources.has(o))return this.sourcesContent[this._sources.indexOf(o)];if((!a.path||a.path==`/`)&&this._sources.has(`/`+i))return this.sourcesContent[this._sources.indexOf(`/`+i)]}if(n)return null;throw Error(`"`+i+`" is not in the SourceMap.`)},s.prototype.generatedPositionFor=function(e){var n=t.getArg(e,`source`);if(n=this._findSourceIndex(n),n<0)return{line:null,column:null,lastColumn:null};var r={source:n,originalLine:t.getArg(e,`line`),originalColumn:t.getArg(e,`column`)},i=this._findMapping(r,this._originalMappings,`originalLine`,`originalColumn`,t.compareByOriginalPositions,t.getArg(e,`bias`,o.GREATEST_LOWER_BOUND));if(i>=0){var a=this._originalMappings[i];if(a.source===r.source)return{line:t.getArg(a,`generatedLine`,null),column:t.getArg(a,`generatedColumn`,null),lastColumn:t.getArg(a,`lastGeneratedColumn`,null)}}return{line:null,column:null,lastColumn:null}},e.BasicSourceMapConsumer=s;function l(e,n){var i=e;typeof e==`string`&&(i=t.parseSourceMapInput(e));var a=t.getArg(i,`version`),s=t.getArg(i,`sections`);if(a!=this._version)throw Error(`Unsupported version: `+a);this._sources=new r,this._names=new r;var c={line:-1,column:0};this._sections=s.map(function(e){if(e.url)throw Error(`Support for url field in sections not implemented.`);var r=t.getArg(e,`offset`),i=t.getArg(r,`line`),a=t.getArg(r,`column`);if(i<c.line||i===c.line&&a<c.column)throw Error(`Section offsets must be ordered and non-overlapping.`);return c=r,{generatedOffset:{generatedLine:i+1,generatedColumn:a+1},consumer:new o(t.getArg(e,`map`),n)}})}l.prototype=Object.create(o.prototype),l.prototype.constructor=o,l.prototype._version=3,Object.defineProperty(l.prototype,"sources",{get:function(){for(var e=[],t=0;t<this._sections.length;t++)for(var n=0;n<this._sections[t].consumer.sources.length;n++)e.push(this._sections[t].consumer.sources[n]);return e}}),l.prototype.originalPositionFor=function(e){var r={generatedLine:t.getArg(e,`line`),generatedColumn:t.getArg(e,`column`)},i=n.search(r,this._sections,function(e,t){return e.generatedLine-t.generatedOffset.generatedLine||e.generatedColumn-t.generatedOffset.generatedColumn}),a=this._sections[i];return a?a.consumer.originalPositionFor({line:r.generatedLine-(a.generatedOffset.generatedLine-1),column:r.generatedColumn-(a.generatedOffset.generatedLine===r.generatedLine?a.generatedOffset.generatedColumn-1:0),bias:e.bias}):{source:null,line:null,column:null,name:null}},l.prototype.hasContentsOfAllSources=function(){return this._sections.every(function(e){return e.consumer.hasContentsOfAllSources()})},l.prototype.sourceContentFor=function(e,t){for(var n=0;n<this._sections.length;n++){var r=this._sections[n].consumer.sourceContentFor(e,!0);if(r)return r}if(t)return null;throw Error(`"`+e+`" is not in the SourceMap.`)},l.prototype.generatedPositionFor=function(e){for(var n=0;n<this._sections.length;n++){var r=this._sections[n];if(r.consumer._findSourceIndex(t.getArg(e,`source`))!==-1){var i=r.consumer.generatedPositionFor(e);if(i)return{line:i.line+(r.generatedOffset.generatedLine-1),column:i.column+(r.generatedOffset.generatedLine===i.line?r.generatedOffset.generatedColumn-1:0)}}}return{line:null,column:null}},l.prototype._parseMappings=function(e,n){this.__generatedMappings=[],this.__originalMappings=[];for(var r=0;r<this._sections.length;r++)for(var i=this._sections[r],o=i.consumer._generatedMappings,s=0;s<o.length;s++){var c=o[s],l=i.consumer._sources.at(c.source);l=t.computeSourceURL(i.consumer.sourceRoot,l,this._sourceMapURL),this._sources.add(l),l=this._sources.indexOf(l);var u=null;c.name&&(u=i.consumer._names.at(c.name),this._names.add(u),u=this._names.indexOf(u));var d={source:l,generatedLine:c.generatedLine+(i.generatedOffset.generatedLine-1),generatedColumn:c.generatedColumn+(i.generatedOffset.generatedLine===c.generatedLine?i.generatedOffset.generatedColumn-1:0),originalLine:c.originalLine,originalColumn:c.originalColumn,name:u};this.__generatedMappings.push(d),typeof d.originalLine==`number`&&this.__originalMappings.push(d)}a(this.__generatedMappings,t.compareByGeneratedPositionsDeflated),a(this.__originalMappings,t.compareByOriginalPositions)},e.IndexedSourceMapConsumer=l})),me=n((e=>{var t=ue().SourceMapGenerator,n=E(),r=/(\r?\n)/,i=10,a=`$$$isSourceNode$$$`;function o(e,t,n,r,i){this.children=[],this.sourceContents={},this.line=e??null,this.column=t??null,this.source=n??null,this.name=i??null,this[a]=!0,r!=null&&this.add(r)}o.fromStringWithSourceMap=function(e,t,i){var a=new o,s=e.split(r),c=0,l=function(){return e()+(e()||``);function e(){return c<s.length?s[c++]:void 0}},u=1,d=0,f=null;return t.eachMapping(function(e){if(f!==null)if(u<e.generatedLine)p(f,l()),u++,d=0;else{var t=s[c]||``,n=t.substr(0,e.generatedColumn-d);s[c]=t.substr(e.generatedColumn-d),d=e.generatedColumn,p(f,n),f=e;return}for(;u<e.generatedLine;)a.add(l()),u++;if(d<e.generatedColumn){var t=s[c]||``;a.add(t.substr(0,e.generatedColumn)),s[c]=t.substr(e.generatedColumn),d=e.generatedColumn}f=e},this),c<s.length&&(f&&p(f,l()),a.add(s.splice(c).join(``))),t.sources.forEach(function(e){var r=t.sourceContentFor(e);r!=null&&(i!=null&&(e=n.join(i,e)),a.setSourceContent(e,r))}),a;function p(e,t){if(e===null||e.source===void 0)a.add(t);else{var r=i?n.join(i,e.source):e.source;a.add(new o(e.originalLine,e.originalColumn,r,t,e.name))}}},o.prototype.add=function(e){if(Array.isArray(e))e.forEach(function(e){this.add(e)},this);else if(e[a]||typeof e==`string`)e&&this.children.push(e);else throw TypeError(`Expected a SourceNode, string, or an array of SourceNodes and strings. Got `+e);return this},o.prototype.prepend=function(e){if(Array.isArray(e))for(var t=e.length-1;t>=0;t--)this.prepend(e[t]);else if(e[a]||typeof e==`string`)this.children.unshift(e);else throw TypeError(`Expected a SourceNode, string, or an array of SourceNodes and strings. Got `+e);return this},o.prototype.walk=function(e){for(var t,n=0,r=this.children.length;n<r;n++)t=this.children[n],t[a]?t.walk(e):t!==``&&e(t,{source:this.source,line:this.line,column:this.column,name:this.name})},o.prototype.join=function(e){var t,n,r=this.children.length;if(r>0){for(t=[],n=0;n<r-1;n++)t.push(this.children[n]),t.push(e);t.push(this.children[n]),this.children=t}return this},o.prototype.replaceRight=function(e,t){var n=this.children[this.children.length-1];return n[a]?n.replaceRight(e,t):typeof n==`string`?this.children[this.children.length-1]=n.replace(e,t):this.children.push(``.replace(e,t)),this},o.prototype.setSourceContent=function(e,t){this.sourceContents[n.toSetString(e)]=t},o.prototype.walkSourceContents=function(e){for(var t=0,r=this.children.length;t<r;t++)this.children[t][a]&&this.children[t].walkSourceContents(e);for(var i=Object.keys(this.sourceContents),t=0,r=i.length;t<r;t++)e(n.fromSetString(i[t]),this.sourceContents[i[t]])},o.prototype.toString=function(){var e=``;return this.walk(function(t){e+=t}),e},o.prototype.toStringWithSourceMap=function(e){var n={code:``,line:1,column:0},r=new t(e),a=!1,o=null,s=null,c=null,l=null;return this.walk(function(e,t){n.code+=e,t.source!==null&&t.line!==null&&t.column!==null?((o!==t.source||s!==t.line||c!==t.column||l!==t.name)&&r.addMapping({source:t.source,original:{line:t.line,column:t.column},generated:{line:n.line,column:n.column},name:t.name}),o=t.source,s=t.line,c=t.column,l=t.name,a=!0):a&&=(r.addMapping({generated:{line:n.line,column:n.column}}),o=null,!1);for(var u=0,d=e.length;u<d;u++)e.charCodeAt(u)===i?(n.line++,n.column=0,u+1===d?(o=null,a=!1):a&&r.addMapping({source:t.source,original:{line:t.line,column:t.column},generated:{line:n.line,column:n.column},name:t.name})):n.column++}),this.walkSourceContents(function(e,t){r.setSourceContent(e,t)}),{code:n.code,map:r}},e.SourceNode=o})),he=n((e=>{e.SourceMapGenerator=ue().SourceMapGenerator,e.SourceMapConsumer=pe().SourceMapConsumer,e.SourceNode=me().SourceNode})),ge=n(((e,t)=>{e.__esModule=!0;var n=a(),r=void 0;try{(typeof define!=`function`||!define.amd)&&(r=he().SourceNode)}catch{}r||(r=function(e,t,n,r){this.src=``,r&&this.add(r)},r.prototype={add:function(e){n.isArray(e)&&(e=e.join(``)),this.src+=e},prepend:function(e){n.isArray(e)&&(e=e.join(``)),this.src=e+this.src},toStringWithSourceMap:function(){return{code:this.toString()}},toString:function(){return this.src}});function i(e,t,r){if(n.isArray(e)){for(var i=[],a=0,o=e.length;a<o;a++)i.push(t.wrap(e[a],r));return i}return typeof e==`boolean`||typeof e==`number`?e+``:e}function o(e){this.srcFile=e,this.source=[]}o.prototype={isEmpty:function(){return!this.source.length},prepend:function(e,t){this.source.unshift(this.wrap(e,t))},push:function(e,t){this.source.push(this.wrap(e,t))},merge:function(){var e=this.empty();return this.each(function(t){e.add([`  `,t,`
`])}),e},each:function(e){for(var t=0,n=this.source.length;t<n;t++)e(this.source[t])},empty:function(){var e=this.currentLocation||{start:{}};return new r(e.start.line,e.start.column,this.srcFile)},wrap:function(e){var t=arguments.length<=1||arguments[1]===void 0?this.currentLocation||{start:{}}:arguments[1];return e instanceof r?e:(e=i(e,this,t),new r(t.start.line,t.start.column,this.srcFile,e))},functionCall:function(e,t,n){return n=this.generateList(n),this.wrap([e,t?`.`+t+`(`:`(`,n,`)`])},quotedString:function(e){return`"`+(e+``).replace(/\\/g,`\\\\`).replace(/"/g,`\\"`).replace(/\n/g,`\\n`).replace(/\r/g,`\\r`).replace(/\u2028/g,`\\u2028`).replace(/\u2029/g,`\\u2029`)+`"`},objectLiteral:function(e){var t=this,n=[];Object.keys(e).forEach(function(r){var a=i(e[r],t);a!==`undefined`&&n.push([t.quotedString(r),`:`,a])});var r=this.generateList(n);return r.prepend(`{`),r.add(`}`),r},generateList:function(e){for(var t=this.empty(),n=0,r=e.length;n<r;n++)n&&t.add(`,`),t.add(i(e[n],this));return t},generateArray:function(e){var t=this.generateList(e);return t.prepend(`[`),t.add(`]`),t}},e.default=o,t.exports=e.default})),_e=n(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var r=y(),i=n(o()),s=a(),c=n(ge());function l(e){this.value=e}function u(){}u.prototype={nameLookup:function(e,t){return this.internalNameLookup(e,t)},depthedLookup:function(e){return[this.aliasable(`container.lookup`),`(depths, `,JSON.stringify(e),`)`]},compilerInfo:function(){var e=r.COMPILER_REVISION;return[e,r.REVISION_CHANGES[e]]},appendToBuffer:function(e,t,n){return s.isArray(e)||(e=[e]),e=this.source.wrap(e,t),this.environment.isSimple?[`return `,e,`;`]:n?[`buffer += `,e,`;`]:(e.appendToBuffer=!0,e)},initializeBuffer:function(){return this.quotedString(``)},internalNameLookup:function(e,t){return this.lookupPropertyFunctionIsUsed=!0,[`lookupProperty(`,e,`,`,JSON.stringify(t),`)`]},lookupPropertyFunctionIsUsed:!1,compile:function(e,t,n,r){this.environment=e,this.options=t,this.stringParams=this.options.stringParams,this.trackIds=this.options.trackIds,this.precompile=!r,this.name=this.environment.name,this.isChild=!!n,this.context=n||{decorators:[],programs:[],environments:[]},this.preamble(),this.stackSlot=0,this.stackVars=[],this.aliases={},this.registers={list:[]},this.hashes=[],this.compileStack=[],this.inlineStack=[],this.blockParams=[],this.compileChildren(e,t),this.useDepths=this.useDepths||e.useDepths||e.useDecorators||this.options.compat,this.useBlockParams=this.useBlockParams||e.useBlockParams;var a=e.opcodes,o=void 0,s=void 0,c=void 0,l=void 0;for(c=0,l=a.length;c<l;c++)o=a[c],this.source.currentLocation=o.loc,s||=o.loc,this[o.opcode].apply(this,o.args);if(this.source.currentLocation=s,this.pushSource(``),this.stackSlot||this.inlineStack.length||this.compileStack.length)throw new i.default(`Compile completed with content left on stack`);this.decorators.isEmpty()?this.decorators=void 0:(this.useDecorators=!0,this.decorators.prepend([`var decorators = container.decorators, `,this.lookupPropertyFunctionVarDeclaration(),`;
`]),this.decorators.push(`return fn;`),r?this.decorators=Function.apply(this,[`fn`,`props`,`container`,`depth0`,`data`,`blockParams`,`depths`,this.decorators.merge()]):(this.decorators.prepend(`function(fn, props, container, depth0, data, blockParams, depths) {
`),this.decorators.push(`}
`),this.decorators=this.decorators.merge()));var u=this.createFunctionContext(r);if(this.isChild)return u;var d={compiler:this.compilerInfo(),main:u};this.decorators&&(d.main_d=this.decorators,d.useDecorators=!0);var f=this.context,p=f.programs,m=f.decorators;for(c=0,l=p.length;c<l;c++)d[c]=p[c],m[c]&&(d[c+`_d`]=m[c],d.useDecorators=!0);return this.environment.usePartial&&(d.usePartial=!0),this.options.data&&(d.useData=!0),this.useDepths&&(d.useDepths=!0),this.useBlockParams&&(d.useBlockParams=!0),this.options.compat&&(d.compat=!0),r?d.compilerOptions=this.options:(d.compiler=JSON.stringify(d.compiler),this.source.currentLocation={start:{line:1,column:0}},d=this.objectLiteral(d),t.srcName?(d=d.toStringWithSourceMap({file:t.destName}),d.map=d.map&&d.map.toString()):d=d.toString()),d},preamble:function(){this.lastContext=0,this.source=new c.default(this.options.srcName),this.decorators=new c.default(this.options.srcName)},createFunctionContext:function(e){var t=this,n=``,r=this.stackVars.concat(this.registers.list);r.length>0&&(n+=`, `+r.join(`, `));var i=0;Object.keys(this.aliases).forEach(function(e){var r=t.aliases[e];r.children&&r.referenceCount>1&&(n+=`, alias`+ ++i+`=`+e,r.children[0]=`alias`+i)}),this.lookupPropertyFunctionIsUsed&&(n+=`, `+this.lookupPropertyFunctionVarDeclaration());var a=[`container`,`depth0`,`helpers`,`partials`,`data`];(this.useBlockParams||this.useDepths)&&a.push(`blockParams`),this.useDepths&&a.push(`depths`);var o=this.mergeSource(n);return e?(a.push(o),Function.apply(this,a)):this.source.wrap([`function(`,a.join(`,`),`) {
  `,o,`}`])},mergeSource:function(e){var t=this.environment.isSimple,n=!this.forceBuffer,r=void 0,i=void 0,a=void 0,o=void 0;return this.source.each(function(e){e.appendToBuffer?(a?e.prepend(`  + `):a=e,o=e):(a&&=(i?a.prepend(`buffer += `):r=!0,o.add(`;`),o=void 0),i=!0,t||(n=!1))}),n?a?(a.prepend(`return `),o.add(`;`)):i||this.source.push(`return "";`):(e+=`, buffer = `+(r?``:this.initializeBuffer()),a?(a.prepend(`return buffer + `),o.add(`;`)):this.source.push(`return buffer;`)),e&&this.source.prepend(`var `+e.substring(2)+(r?``:`;
`)),this.source.merge()},lookupPropertyFunctionVarDeclaration:function(){return`lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }`},blockValue:function(e){var t=this.aliasable(`container.hooks.blockHelperMissing`),n=[this.contextName(0)];this.setupHelperArgs(e,0,n);var r=this.popStack();n.splice(1,0,r),this.push(this.source.functionCall(t,`call`,n))},ambiguousBlockValue:function(){var e=this.aliasable(`container.hooks.blockHelperMissing`),t=[this.contextName(0)];this.setupHelperArgs(``,0,t,!0),this.flushInline();var n=this.topStack();t.splice(1,0,n),this.pushSource([`if (!`,this.lastHelper,`) { `,n,` = `,this.source.functionCall(e,`call`,t),`}`])},appendContent:function(e){this.pendingContent?e=this.pendingContent+e:this.pendingLocation=this.source.currentLocation,this.pendingContent=e},append:function(){if(this.isInline())this.replaceStack(function(e){return[` != null ? `,e,` : ""`]}),this.pushSource(this.appendToBuffer(this.popStack()));else{var e=this.popStack();this.pushSource([`if (`,e,` != null) { `,this.appendToBuffer(e,void 0,!0),` }`]),this.environment.isSimple&&this.pushSource([`else { `,this.appendToBuffer(`''`,void 0,!0),` }`])}},appendEscaped:function(){this.pushSource(this.appendToBuffer([this.aliasable(`container.escapeExpression`),`(`,this.popStack(),`)`]))},getContext:function(e){this.lastContext=e},pushContext:function(){this.pushStackLiteral(this.contextName(this.lastContext))},lookupOnContext:function(e,t,n,r){var i=0;!r&&this.options.compat&&!this.lastContext?this.push(this.depthedLookup(e[i++])):this.pushContext(),this.resolvePath(`context`,e,i,t,n)},lookupBlockParam:function(e,t){this.useBlockParams=!0,this.push([`blockParams[`,e[0],`][`,e[1],`]`]),this.resolvePath(`context`,t,1)},lookupData:function(e,t,n){e?this.pushStackLiteral(`container.data(data, `+e+`)`):this.pushStackLiteral(`data`),this.resolvePath(`data`,t,0,!0,n)},resolvePath:function(e,t,n,r,i){var a=this;if(this.options.strict||this.options.assumeObjects){this.push(d(this.options.strict&&i,this,t,n,e));return}for(var o=t.length,s=function(n){a.replaceStack(function(i){var o=a.nameLookup(i,t[n],e);return r?[` && `,o]:[` != null ? `,o,` : `,i]})},c=n;c<o;c++)s(c)},resolvePossibleLambda:function(){this.push([this.aliasable(`container.lambda`),`(`,this.popStack(),`, `,this.contextName(0),`)`])},pushStringParam:function(e,t){this.pushContext(),this.pushString(t),t!==`SubExpression`&&(typeof e==`string`?this.pushString(e):this.pushStackLiteral(e))},emptyHash:function(e){this.trackIds&&this.push(`{}`),this.stringParams&&(this.push(`{}`),this.push(`{}`)),this.pushStackLiteral(e?`undefined`:`{}`)},pushHash:function(){this.hash&&this.hashes.push(this.hash),this.hash={values:{},types:[],contexts:[],ids:[]}},popHash:function(){var e=this.hash;this.hash=this.hashes.pop(),this.trackIds&&this.push(this.objectLiteral(e.ids)),this.stringParams&&(this.push(this.objectLiteral(e.contexts)),this.push(this.objectLiteral(e.types))),this.push(this.objectLiteral(e.values))},pushString:function(e){this.pushStackLiteral(this.quotedString(e))},pushLiteral:function(e){this.pushStackLiteral(e)},pushProgram:function(e){e==null?this.pushStackLiteral(null):this.pushStackLiteral(this.programExpression(e))},registerDecorator:function(e,t){var n=this.nameLookup(`decorators`,t,`decorator`),r=this.setupHelperArgs(t,e);this.decorators.push([`var decorator = `,n,`;`]),this.decorators.push([`if (typeof decorator !== "function") { throw new Error(`,this.quotedString(`Missing decorator: "`+t+`"`),`); }`]),this.decorators.push([`fn = `,this.decorators.functionCall(`decorator`,``,[`fn`,`props`,`container`,r]),` || fn;`])},invokeHelper:function(e,t,n){var r=this.popStack(),i=this.setupHelper(e,t),a=[];n&&a.push(i.name),a.push(r),this.options.strict||a.push(this.aliasable(`container.hooks.helperMissing`));var o=[`(`,this.itemsSeparatedBy(a,`||`),`)`],s=this.source.functionCall(o,`call`,i.callParams);this.push(s)},itemsSeparatedBy:function(e,t){var n=[];n.push(e[0]);for(var r=1;r<e.length;r++)n.push(t,e[r]);return n},invokeKnownHelper:function(e,t){var n=this.setupHelper(e,t);this.push(this.source.functionCall(n.name,`call`,n.callParams))},invokeAmbiguous:function(e,t){this.useRegister(`helper`);var n=this.popStack();this.emptyHash();var r=this.setupHelper(0,e,t),i=[`(`,`(helper = `,this.lastHelper=this.nameLookup(`helpers`,e,`helper`),` || `,n,`)`];this.options.strict||(i[0]=`(helper = `,i.push(` != null ? helper : `,this.aliasable(`container.hooks.helperMissing`))),this.push([`(`,i,r.paramsInit?[`),(`,r.paramsInit]:[],`),`,`(typeof helper === `,this.aliasable(`"function"`),` ? `,this.source.functionCall(`helper`,`call`,r.callParams),` : helper))`])},invokePartial:function(e,t,n){var r=[],i=this.setupParams(t,1,r);e&&(t=this.popStack(),delete i.name),n&&(i.indent=JSON.stringify(n)),i.helpers=`helpers`,i.partials=`partials`,i.decorators=`container.decorators`,e?r.unshift(t):r.unshift(this.nameLookup(`partials`,t,`partial`)),this.options.compat&&(i.depths=`depths`),i=this.objectLiteral(i),r.push(i),this.push(this.source.functionCall(`container.invokePartial`,``,r))},assignToHash:function(e){var t=this.popStack(),n=void 0,r=void 0,i=void 0;this.trackIds&&(i=this.popStack()),this.stringParams&&(r=this.popStack(),n=this.popStack());var a=this.hash;n&&(a.contexts[e]=n),r&&(a.types[e]=r),i&&(a.ids[e]=i),a.values[e]=t},pushId:function(e,t,n){e===`BlockParam`?this.pushStackLiteral(`blockParams[`+t[0]+`].path[`+t[1]+`]`+(n?` + `+JSON.stringify(`.`+n):``)):e===`PathExpression`?this.pushString(t):e===`SubExpression`?this.pushStackLiteral(`true`):this.pushStackLiteral(`null`)},compiler:u,compileChildren:function(e,t){for(var n=e.children,r=void 0,i=void 0,a=0,o=n.length;a<o;a++){r=n[a],i=new this.compiler;var s=this.matchExistingProgram(r);if(s==null){var c=this.context.programs.push(``)-1;r.index=c,r.name=`program`+c,this.context.programs[c]=i.compile(r,t,this.context,!this.precompile),this.context.decorators[c]=i.decorators,this.context.environments[c]=r,this.useDepths=this.useDepths||i.useDepths,this.useBlockParams=this.useBlockParams||i.useBlockParams,r.useDepths=this.useDepths,r.useBlockParams=this.useBlockParams}else r.index=s.index,r.name=`program`+s.index,this.useDepths=this.useDepths||s.useDepths,this.useBlockParams=this.useBlockParams||s.useBlockParams}},matchExistingProgram:function(e){for(var t=0,n=this.context.environments.length;t<n;t++){var r=this.context.environments[t];if(r&&r.equals(e))return r}},programExpression:function(e){var t=this.environment.children[e],n=[t.index,`data`,t.blockParams];return(this.useBlockParams||this.useDepths)&&n.push(`blockParams`),this.useDepths&&n.push(`depths`),`container.program(`+n.join(`, `)+`)`},useRegister:function(e){this.registers[e]||(this.registers[e]=!0,this.registers.list.push(e))},push:function(e){return e instanceof l||(e=this.source.wrap(e)),this.inlineStack.push(e),e},pushStackLiteral:function(e){this.push(new l(e))},pushSource:function(e){this.pendingContent&&=(this.source.push(this.appendToBuffer(this.source.quotedString(this.pendingContent),this.pendingLocation)),void 0),e&&this.source.push(e)},replaceStack:function(e){var t=[`(`],n=void 0,r=void 0,a=void 0;if(!this.isInline())throw new i.default(`replaceStack on non-inline`);var o=this.popStack(!0);if(o instanceof l)n=[o.value],t=[`(`,n],a=!0;else{r=!0;var s=this.incrStack();t=[`((`,this.push(s),` = `,o,`)`],n=this.topStack()}var c=e.call(this,n);a||this.popStack(),r&&this.stackSlot--,this.push(t.concat(c,`)`))},incrStack:function(){return this.stackSlot++,this.stackSlot>this.stackVars.length&&this.stackVars.push(`stack`+this.stackSlot),this.topStackName()},topStackName:function(){return`stack`+this.stackSlot},flushInline:function(){var e=this.inlineStack;this.inlineStack=[];for(var t=0,n=e.length;t<n;t++){var r=e[t];if(r instanceof l)this.compileStack.push(r);else{var i=this.incrStack();this.pushSource([i,` = `,r,`;`]),this.compileStack.push(i)}}},isInline:function(){return this.inlineStack.length},popStack:function(e){var t=this.isInline(),n=(t?this.inlineStack:this.compileStack).pop();if(!e&&n instanceof l)return n.value;if(!t){if(!this.stackSlot)throw new i.default(`Invalid stack pop`);this.stackSlot--}return n},topStack:function(){var e=this.isInline()?this.inlineStack:this.compileStack,t=e[e.length-1];return t instanceof l?t.value:t},contextName:function(e){return this.useDepths&&e?`depths[`+e+`]`:`depth`+e},quotedString:function(e){return this.source.quotedString(e)},objectLiteral:function(e){return this.source.objectLiteral(e)},aliasable:function(e){var t=this.aliases[e];return t?(t.referenceCount++,t):(t=this.aliases[e]=this.source.wrap(e),t.aliasable=!0,t.referenceCount=1,t)},setupHelper:function(e,t,n){var r=[];return{params:r,paramsInit:this.setupHelperArgs(t,e,r,n),name:this.nameLookup(`helpers`,t,`helper`),callParams:[this.aliasable(this.contextName(0)+` != null ? `+this.contextName(0)+` : (container.nullContext || {})`)].concat(r)}},setupParams:function(e,t,n){var r={},i=[],a=[],o=[],s=!n,c=void 0;s&&(n=[]),r.name=this.quotedString(e),r.hash=this.popStack(),this.trackIds&&(r.hashIds=this.popStack()),this.stringParams&&(r.hashTypes=this.popStack(),r.hashContexts=this.popStack());var l=this.popStack(),u=this.popStack();(u||l)&&(r.fn=u||`container.noop`,r.inverse=l||`container.noop`);for(var d=t;d--;)c=this.popStack(),n[d]=c,this.trackIds&&(o[d]=this.popStack()),this.stringParams&&(a[d]=this.popStack(),i[d]=this.popStack());return s&&(r.args=this.source.generateArray(n)),this.trackIds&&(r.ids=this.source.generateArray(o)),this.stringParams&&(r.types=this.source.generateArray(a),r.contexts=this.source.generateArray(i)),this.options.data&&(r.data=`data`),this.useBlockParams&&(r.blockParams=`blockParams`),r},setupHelperArgs:function(e,t,n,r){var i=this.setupParams(e,t,n);return i.loc=JSON.stringify(this.source.currentLocation),i=this.objectLiteral(i),r?(this.useRegister(`options`),n.push(`options`),[`options=`,i]):n?(n.push(i),``):i}},(function(){for(var e=`break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield await null true false`.split(` `),t=u.RESERVED_WORDS={},n=0,r=e.length;n<r;n++)t[e[n]]=!0})(),u.isValidJavaScriptVariableName=function(e){return!u.RESERVED_WORDS[e]&&/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(e)};function d(e,t,n,r,i){var a=t.popStack(),o=n.length;e&&o--;for(var s=r;s<o;s++)a=t.nameLookup(a,n[s],i);return e?[t.aliasable(`container.strict`),`(`,a,`, `,t.quotedString(n[o]),`, `,JSON.stringify(t.source.currentLocation),` )`]:a}e.default=u,t.exports=e.default})),ve=n(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var r=n(w()),i=n(T()),a=ie(),o=ae(),s=n(_e()),c=n(te()),l=n(C()),u=r.default.create;function d(){var e=u();return e.compile=function(t,n){return o.compile(t,n,e)},e.precompile=function(t,n){return o.precompile(t,n,e)},e.AST=i.default,e.Compiler=o.Compiler,e.JavaScriptCompiler=s.default,e.Parser=a.parser,e.parse=a.parse,e.parseWithoutProcessing=a.parseWithoutProcessing,e}var f=d();f.create=d,l.default(f),f.Visitor=c.default,f.default=f,e.default=f,t.exports=e.default})),D;function O(){return(O=t((()=>{D=`<div
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
            {{> icon name="arrows-navigation/simple-expand-more" size="24" color="current" decorative=true}}
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
`})))()}function ye(e){return String(e).trim().toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-+|-+$/g,``)}function be(e){e.registerHelper(`accordionGroupKey`,e=>{let t=e?ye(e):``;return t?A=t:(k+=1,A=`auto-${k}`),A}),e.registerHelper(`accordionItemId`,e=>`c-accordion-${A||`auto-${++k}`}__item-${e}`)}var k,A;function xe(){return(xe=t((()=>{k=0,A=null})))()}var j;function M(){return(M=t((()=>{j=`{{!--
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
`})))()}function Se(e){e.registerHelper(`buttonIconSize`,e=>String(e??``).toLowerCase()===`s`?`16`:`20`)}var F;function I(){return(I=t((()=>{F=`<span
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
            {{> icon name="status/simple-checkmark-small" size="24" color="current" decorative=true}}
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
`})))()}var G;function Ce(){return(Ce=t((()=>{G=e(ve(),1),O(),xe(),M(),P(),I(),R(),B(),H(),W(),r(),G.default.registerHelper(`eq`,(e,t)=>e===t),G.default.registerHelper(`unless-eq`,(e,t,n)=>e===t?n.inverse(void 0):n.fn(void 0)),G.default.registerHelper(`lower`,e=>String(e??``).toLowerCase()),G.default.registerHelper(`iconUrl`,e=>i(e)),be(G.default),Se(G.default),G.default.registerPartial(`accordion`,D),G.default.registerPartial(`badge`,j),G.default.registerPartial(`button`,N),G.default.registerPartial(`icon`,F),G.default.registerPartial(`radio`,L),G.default.registerPartial(`checkbox`,z),G.default.registerPartial(`switch`,V),G.default.registerPartial(`pagination-dots`,U)})))()}var K;function q(){return(q=t((()=>{K=`/**
 * Patterns/Accordion — vertical progressive-disclosure pattern.
 *
 * Figma: Web-ODS Shared Library board \`2499:2626\` (page \`539:28425\`).
 * Masters: \`accordion / group\` \`2499:2627\`, \`accordion / item\`,
 * \`accordion / card\` \`2499:3764\`.
 */

.c-accordion {
  display: flex;
  flex-direction: column;
  inline-size: 100%;
  box-sizing: border-box;
  font-family: var(--font-family-primary);
}

.c-accordion__group-title {
  margin: 0 0 var(--space-5) 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-body-lg);
  line-height: var(--lineheight-body-lg);
  font-weight: var(--font-weight-semibold);
}

.c-accordion--top-divider {
  border-block-start: var(--border-width-xs) solid var(--color-border-strong);
  padding-block-start: var(--space-3);
}

.c-accordion__item {
  --c-accordion-item-pad-block: var(--space-5);
  --c-accordion-item-pad-inline-start: var(--space-2);
  --c-accordion-item-pad-inline-end: var(--space-0, 0);
  --c-accordion-content-pad-block-end: var(--space-6);

  display: block;
  inline-size: 100%;
  box-sizing: border-box;
  color: var(--color-text-primary);
}

.c-accordion__item--with-divider {
  border-block-end: var(--border-width-xs) solid var(--color-border-subtle);
}

.c-accordion__item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-5);
  padding-block: var(--c-accordion-item-pad-block);
  padding-inline-start: var(--c-accordion-item-pad-inline-start);
  padding-inline-end: var(--c-accordion-item-pad-inline-end);
  list-style: none;
  cursor: pointer;
  user-select: none;
  outline: none;
  transition: background-color 150ms ease;
}

.c-accordion__item-header::-webkit-details-marker {
  display: none;
}

.c-accordion__item-header::marker {
  display: none;
  content: '';
}

.c-accordion__item-header:hover,
.c-accordion__item[data-state='hover'] > .c-accordion__item-header {
  background-color: var(--color-canvas-subtle);
}

.c-accordion__item-header:active,
.c-accordion__item[data-state='pressed'] > .c-accordion__item-header {
  background-color: var(--color-canvas-contrast);
}

.c-accordion__item-header:focus-visible,
.c-accordion__item[data-state='focus'] > .c-accordion__item-header {
  outline: var(--border-width-s, 2px) solid var(--color-border-focus);
  outline-offset: 2px;
}

.c-accordion__item-leading {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary);
}

.c-accordion__item-title {
  flex: 1 1 auto;
  margin: 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-body-lg);
  line-height: var(--lineheight-body-lg);
  font-weight: var(--font-weight-semibold);
  text-align: start;
}

.c-accordion__item-chevron {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-1);
  border-radius: var(--border-radius-s);
  color: var(--color-text-primary);
  transition: transform 200ms ease;
}

.c-accordion__item[open] > .c-accordion__item-header .c-accordion__item-chevron {
  transform: rotate(180deg);
}

.c-accordion__item-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding-block: 0 var(--c-accordion-content-pad-block-end);
  padding-inline-start: var(--c-accordion-item-pad-inline-start);
  padding-inline-end: var(--c-accordion-item-pad-inline-end);
  overflow: visible;
}

.c-accordion__item[data-animating] > .c-accordion__item-content {
  overflow: clip;
}

.c-accordion__item-body,
.c-accordion__item-list {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  font-weight: var(--font-weight-regular);
}

.c-accordion__item-list {
  padding-inline-start: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.c-accordion__item-list > li {
  margin: 0;
}

.c-accordion__item-link {
  display: inline-block;
  color: var(--color-text-accent);
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  font-weight: var(--font-weight-regular);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.c-accordion__item-link:hover,
.c-accordion__item-link:focus-visible {
  text-decoration-thickness: var(--border-width-s, 2px);
}

.c-accordion__item-link:focus-visible {
  outline: var(--border-width-s, 2px) solid var(--color-border-focus);
  outline-offset: 2px;
  border-radius: 2px;
}

.c-accordion__item-image,
.c-accordion__item-video {
  display: block;
  max-inline-size: 100%;
  border-radius: var(--border-radius-l);
  overflow: hidden;
}

.c-accordion__item-image > img,
.c-accordion__item-video > video {
  display: block;
  inline-size: 100%;
  block-size: auto;
}

/* Card appearance — Figma \`accordion / card\` */
.c-accordion--card {
  gap: var(--space-3);
}

.c-accordion--card .c-accordion__item {
  --c-accordion-item-pad-block: var(--space-5);
  --c-accordion-item-pad-inline-start: var(--space-5);
  --c-accordion-item-pad-inline-end: var(--space-5);
  border: 0;
}

.c-accordion--card .c-accordion__item--with-divider {
  border-block-end: 0;
}

.c-accordion--card .c-accordion__item-header {
  gap: var(--space-4);
  background-color: var(--color-bg-subtle);
  border-radius: var(--border-radius-l);
}

.c-accordion--card .c-accordion__item[open] > .c-accordion__item-header {
  border-end-start-radius: 0;
  border-end-end-radius: 0;
}

.c-accordion--card .c-accordion__item-content {
  background-color: var(--color-bg-subtle);
  border-end-start-radius: var(--border-radius-l);
  border-end-end-radius: var(--border-radius-l);
  padding-block-start: 0;
}

.c-accordion--card .c-accordion__item-title {
  font-size: var(--font-size-h7);
  line-height: var(--lineheight-h7, var(--lineheight-body-lg));
  font-weight: var(--font-weight-medium);
}

.c-accordion--card .c-accordion__item-header:hover,
.c-accordion--card .c-accordion__item[data-state='hover'] > .c-accordion__item-header {
  background-color: var(--color-canvas-subtle);
}

.c-accordion__item[data-disabled='true'] {
  color: var(--color-disabled-text);
}

.c-accordion__item[data-disabled='true'] > .c-accordion__item-header {
  cursor: not-allowed;
  pointer-events: none;
  background-color: transparent;
}

.c-accordion--card .c-accordion__item[data-disabled='true'] > .c-accordion__item-header {
  background-color: var(--color-disabled-bg, var(--color-bg-subtle));
}

.c-accordion__item[data-disabled='true'] .c-accordion__item-title,
.c-accordion__item[data-disabled='true'] .c-accordion__item-chevron,
.c-accordion__item[data-disabled='true'] .c-accordion__item-leading {
  color: var(--color-disabled-text);
}

@media (prefers-reduced-motion: reduce) {
  .c-accordion__item-header,
  .c-accordion__item-chevron,
  .c-accordion__item-content {
    transition: none;
  }
}
`})))()}var we;function J(){return(J=t((()=>{we=`/**
 * Award Wrapper — core molecule (.c-award-wrapper).
 * Figma Web-ODS Shared Library node 3762:246.
 * Image ratio locks a fixed box; surface is transparent; overflow clipped.
 */

.c-award-wrapper {
  position: relative;
  display: block;
  box-sizing: border-box;
  overflow: clip;
  background-color: transparent;
  border-radius: var(--border-radius-0, 0);
  inline-size: fit-content;
  max-inline-size: 100%;
}

.c-award-wrapper--ratio-1-1 {
  inline-size: 88px;
  block-size: 88px;
}

.c-award-wrapper--ratio-16-9 {
  inline-size: 246px;
  block-size: 138px;
}

.c-award-wrapper--ratio-9-16 {
  inline-size: 90px;
  block-size: 160px;
}

.c-award-wrapper__image {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: contain;
  object-position: center;
}

.c-award-wrapper__placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--color-disabled-bg, #b3b3b3);
  padding: var(--space-0, 0);
}

.c-award-wrapper__placeholder-label {
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-regular, 400);
  font-size: var(--font-size-label, 12px);
  line-height: var(--lineheight-label, 16px);
  letter-spacing: var(--letterspacing-label, 0.24px);
  color: var(--color-text-inverse, #fff);
  text-align: center;
  word-break: break-word;
}
`})))()}var Te;function Ee(){return(Ee=t((()=>{Te=`/**
 * Molecules/Badge — core (.c-badge).
 * Figma: Web-ODS Shared Library 1284:14251 / page 539:28416.
 *
 * Axes → BEM:
 *   variant  → .c-badge--dot | --count | --text
 *   color    → .c-badge--info | --success | --warning
 *              | --error | --brand | --inverse
 *   emphasis → .c-badge--low | --high
 */

.c-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: fit-content;
  box-sizing: border-box;
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-body-xs);
  line-height: var(--lineheight-body-xs);
  background-color: transparent;
  color: var(--color-text-primary);
}

.c-badge__value {
  display: inline-block;
}

.c-badge__label {
  display: inline-block;
  text-transform: uppercase;
}

.c-badge--dot {
  inline-size: 8px;
  block-size: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  padding: 0;
}

.c-badge--count,
.c-badge--text {
  border-radius: var(--border-radius-pill);
  padding-block: var(--space-1);
  padding-inline: var(--space-3);
  min-inline-size: 0;
}

// --- info -------------------------------------------------------------------

.c-badge--info.c-badge--low {
  &.c-badge--dot {
    background-color: var(--color-signal-info-muted);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-signal-info-subtle);
    color: var(--color-signal-info);
  }
}

.c-badge--info.c-badge--high {
  &.c-badge--dot {
    background-color: var(--color-signal-info);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-signal-info);
    color: var(--color-text-inverse);
  }
}

// --- success ----------------------------------------------------------------

.c-badge--success.c-badge--low {
  &.c-badge--dot {
    background-color: var(--color-signal-success-muted);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-signal-success-subtle);
    color: var(--color-signal-success);
  }
}

.c-badge--success.c-badge--high {
  &.c-badge--dot {
    background-color: var(--color-signal-success);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-signal-success);
    color: var(--color-text-inverse);
  }
}

// --- warning ----------------------------------------------------------------

// High content stays --color-text-primary (not inverse) for WCAG on yellow.
.c-badge--warning.c-badge--low {
  &.c-badge--dot {
    background-color: var(--color-signal-warning-muted);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-signal-warning-subtle);
    color: var(--color-text-primary);
  }
}

.c-badge--warning.c-badge--high {
  &.c-badge--dot {
    background-color: var(--color-signal-warning);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-signal-warning);
    color: var(--color-text-primary);
  }
}

// --- error (Signal/Critical) ------------------------------------------------

.c-badge--error.c-badge--low {
  &.c-badge--dot {
    background-color: var(--color-signal-critical-muted);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-signal-critical-subtle);
    color: var(--color-signal-critical);
  }
}

.c-badge--error.c-badge--high {
  &.c-badge--dot {
    background-color: var(--color-signal-critical);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-signal-critical);
    color: var(--color-text-inverse);
  }
}

// --- brand ------------------------------------------------------------------

.c-badge--brand.c-badge--low {
  &.c-badge--dot {
    background-color: var(--color-border-brand);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-bg-brand-soft);
    color: var(--color-text-brand);
  }
}

.c-badge--brand.c-badge--high {
  &.c-badge--dot {
    background-color: var(--color-bg-brand);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-bg-brand);
    color: var(--color-text-inverse);
  }
}

// --- inverse (Figma Color=Inverse; was LifeLock gray) -----------------------

.c-badge--inverse.c-badge--low {
  &.c-badge--dot {
    background-color: var(--color-text-secondary);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-bg-subtle);
    color: var(--color-text-secondary);
  }
}

.c-badge--inverse.c-badge--high {
  &.c-badge--dot {
    background-color: var(--color-bg-inverse-strong);
  }

  &.c-badge--count,
  &.c-badge--text {
    background-color: var(--color-bg-inverse-strong);
    color: var(--color-text-inverse);
  }
}
`})))()}var Y;function X(){return(X=t((()=>{Y=`/**
 * Molecules/Button — \`.btn\` BEM root. Figma master \`2434:14483\`.
 *
 * Paints / geometry consume \`--button-*\` from \`themes/default/_button.scss\`
 * (or LifeLock \`src/tokens/button/\` when that brand theme is active).
 */

// ============================================================================
// BLOCK — .btn (canonical short root permitted per code-conventions.mdc § 1)
// ============================================================================

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--button-gap);
  inline-size: fit-content;
  min-inline-size: var(--button-min-inline-size);
  box-sizing: border-box;
  border-radius: var(--button-radius);
  border: var(--button-border-width-primary) solid transparent;
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-semibold);
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  appearance: none;
  transition:
    background-color 150ms ease,
    color 150ms ease,
    border-color 150ms ease;

  // font-size / line-height / block-size / padding all live on the
  // per-size modifiers below — every \`.btn\` consumer ships exactly one
  // \`.btn--*\` modifier (default \`l\` if unset by the template).
}

// ============================================================================
// ELEMENTS — label + icon slots + spinner
// ============================================================================

.btn__label {
  // Wrap rather than overflow so long labels stay readable inside
  // their host surface. Hosts that want single-line behaviour can
  // clip the overflow themselves via \`max-inline-size\` on a parent.
  white-space: normal;
  word-break: normal;
  overflow-wrap: anywhere;
}

.btn__icon {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

// Spinner — CSS-only rotating ring shown in place of the leading icon
// when \`.is-loading\` is set on the block. Sized to the same per-size
// \`--button-icon-size-*\` ladder the icon slots use, so the geometry
// stays identical between Default and Loading.
.btn__spinner {
  flex: 0 0 auto;
  display: inline-block;
  inline-size: var(--button-icon-size-l);
  block-size: var(--button-icon-size-l);
  border-radius: 50%;
  border: 2px solid var(--button-spinner-track);
  border-block-start-color: var(--button-spinner-fill);
  animation: btn-spinner-rotate 700ms linear infinite;
}

@keyframes btn-spinner-rotate {
  to {
    transform: rotate(360deg);
  }
}

// ============================================================================
// SIZE MODIFIERS — geometry only (label font + icon slot size scale here)
// ============================================================================

.btn--s {
  block-size: var(--button-block-size-s);
  padding-block: var(--button-padding-block-s);
  padding-inline: var(--button-padding-inline-s);
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);

  .btn__spinner {
    inline-size: var(--button-icon-size-s);
    block-size: var(--button-icon-size-s);
  }
}

.btn--m {
  block-size: var(--button-block-size-m);
  padding-block: var(--button-padding-block-m);
  padding-inline: var(--button-padding-inline-m);
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);

  .btn__spinner {
    inline-size: var(--button-icon-size-m);
    block-size: var(--button-icon-size-m);
  }
}

.btn--l {
  block-size: var(--button-block-size-l);
  padding-block: var(--button-padding-block-l);
  padding-inline: var(--button-padding-inline-l);
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);

  .btn__spinner {
    inline-size: var(--button-icon-size-l);
    block-size: var(--button-icon-size-l);
  }
}

.btn--xl {
  block-size: var(--button-block-size-xl);
  padding-block: var(--button-padding-block-xl);
  padding-inline: var(--button-padding-inline-xl);
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);

  .btn__spinner {
    inline-size: var(--button-icon-size-xl);
    block-size: var(--button-icon-size-xl);
  }
}

// ============================================================================
// ICON-ONLY MODIFIER — square geometry, label suppressed at template layer
// ============================================================================

.btn--icon-button {
  // Force a true square hit-area at every size by pinning
  // \`inline-size\` to the matching \`--button-block-size-<size>\` token
  // and suppressing the label-bearing min-inline-size + padding-inline.
  // The label slot is suppressed at the template layer (no
  // \`.btn__label\` rendered).
  min-inline-size: 0;
  padding-inline: 0;

  &.btn--s {
    inline-size: var(--button-block-size-s);
  }

  &.btn--m {
    inline-size: var(--button-block-size-m);
  }

  &.btn--l {
    inline-size: var(--button-block-size-l);
  }

  &.btn--xl {
    inline-size: var(--button-block-size-xl);
  }
}

// ============================================================================
// STYLE MODIFIERS — per-type surface paints + per-type keyline weight
// ============================================================================

// -- Primary ----------------------------------------------------------------

.btn--primary {
  background-color: var(--button-primary-bg-default);
  color: var(--button-primary-content-default);
  border-color: var(--button-primary-border);
  border-width: var(--button-border-width-primary);

  &:hover:not(:disabled, .is-loading),
  &[data-state="hover"]:not(:disabled, .is-loading) {
    background-color: var(--button-primary-bg-hover);
    color: var(--button-primary-content-hover);
  }

  &:active:not(:disabled, .is-loading),
  &[data-state="pressed"]:not(:disabled, .is-loading) {
    background-color: var(--button-primary-bg-pressed);
    color: var(--button-primary-content-pressed);
  }
}

// -- Secondary --------------------------------------------------------------

.btn--secondary {
  background-color: var(--button-secondary-bg-default);
  color: var(--button-secondary-content-default);
  border-color: var(--button-secondary-border);
  border-width: var(--button-border-width-secondary);

  &:hover:not(:disabled, .is-loading),
  &[data-state="hover"]:not(:disabled, .is-loading) {
    background-color: var(--button-secondary-bg-hover);
    color: var(--button-secondary-content-hover);
  }

  &:active:not(:disabled, .is-loading),
  &[data-state="pressed"]:not(:disabled, .is-loading) {
    background-color: var(--button-secondary-bg-pressed);
    color: var(--button-secondary-content-pressed);
  }
}

// -- Tertiary ---------------------------------------------------------------

.btn--tertiary {
  background-color: var(--button-tertiary-bg-default);
  color: var(--button-tertiary-content-default);
  border-color: var(--button-tertiary-border);
  border-width: var(--button-border-width-primary);

  &:hover:not(:disabled, .is-loading),
  &[data-state="hover"]:not(:disabled, .is-loading) {
    background-color: var(--button-tertiary-bg-hover);
    color: var(--button-tertiary-content-hover);
  }

  &:active:not(:disabled, .is-loading),
  &[data-state="pressed"]:not(:disabled, .is-loading) {
    background-color: var(--button-tertiary-bg-pressed);
    color: var(--button-tertiary-content-pressed);
  }
}

// -- Inverse ----------------------------------------------------------------

.btn--inverse {
  background-color: var(--button-inverse-bg-default);
  color: var(--button-inverse-content-default);
  border-color: var(--button-inverse-border);
  border-width: var(--button-border-width-primary);

  &:hover:not(:disabled, .is-loading),
  &[data-state="hover"]:not(:disabled, .is-loading) {
    background-color: var(--button-inverse-bg-hover);
    color: var(--button-inverse-content-hover);
  }

  &:active:not(:disabled, .is-loading),
  &[data-state="pressed"]:not(:disabled, .is-loading) {
    background-color: var(--button-inverse-bg-pressed);
    color: var(--button-inverse-content-pressed);
  }
}

// -- Text (transparent surface; identity-coloured label only) ---------------

.btn--text {
  background-color: var(--button-text-bg-default);
  color: var(--button-text-content-default);
  border-color: transparent;
  border-width: var(--button-border-width-primary);

  &:hover:not(:disabled, .is-loading),
  &[data-state="hover"]:not(:disabled, .is-loading) {
    background-color: var(--button-text-bg-hover);
    color: var(--button-text-content-hover);
  }

  &:active:not(:disabled, .is-loading),
  &[data-state="pressed"]:not(:disabled, .is-loading) {
    background-color: var(--button-text-bg-pressed);
    color: var(--button-text-content-pressed);
  }
}

// -- Primary ghost (transparent surface + identity-coloured 2px keyline) ----

.btn--primary-ghost {
  background-color: var(--button-primary-ghost-bg-default);
  color: var(--button-primary-ghost-content-default);
  border-color: var(--button-primary-ghost-border);
  border-width: var(--button-border-width-ghost);

  &:hover:not(:disabled, .is-loading),
  &[data-state="hover"]:not(:disabled, .is-loading) {
    background-color: var(--button-primary-ghost-bg-hover);
    color: var(--button-primary-ghost-content-hover);
  }

  &:active:not(:disabled, .is-loading),
  &[data-state="pressed"]:not(:disabled, .is-loading) {
    background-color: var(--button-primary-ghost-bg-pressed);
    color: var(--button-primary-ghost-content-pressed);
  }
}

// -- Secondary ghost --------------------------------------------------------

.btn--secondary-ghost {
  background-color: var(--button-secondary-ghost-bg-default);
  color: var(--button-secondary-ghost-content-default);
  border-color: var(--button-secondary-ghost-border);
  border-width: var(--button-border-width-ghost);

  &:hover:not(:disabled, .is-loading),
  &[data-state="hover"]:not(:disabled, .is-loading) {
    background-color: var(--button-secondary-ghost-bg-hover);
    color: var(--button-secondary-ghost-content-hover);
  }

  &:active:not(:disabled, .is-loading),
  &[data-state="pressed"]:not(:disabled, .is-loading) {
    background-color: var(--button-secondary-ghost-bg-pressed);
    color: var(--button-secondary-ghost-content-pressed);
  }
}

// -- Gradient (premium-emphasis CTA; gradient surface, white label) ---------
// The surface is a \`background-image\` linear gradient rather than a flat
// \`background-color\`, so the per-state paints swap \`background-image\`. The
// universal \`.btn:disabled\` rule only sets \`background-color\`, so gradient
// clears its own \`background-image\` on \`:disabled\` to let the flat
// disabled surface show through (Figma: no gradient affordance when
// disabled). Keyline weight + focus overlay match Type=Primary.

.btn--gradient {
  background-image: var(--button-gradient-bg-default);
  color: var(--button-gradient-content-default);
  border-color: var(--button-gradient-border);
  border-width: var(--button-border-width-primary);

  &:hover:not(:disabled, .is-loading),
  &[data-state="hover"]:not(:disabled, .is-loading) {
    background-image: var(--button-gradient-bg-hover);
    color: var(--button-gradient-content-hover);
  }

  &:active:not(:disabled, .is-loading),
  &[data-state="pressed"]:not(:disabled, .is-loading) {
    background-image: var(--button-gradient-bg-pressed);
    color: var(--button-gradient-content-pressed);
  }

  &:disabled {
    background-image: none;
  }
}

// ============================================================================
// UNIVERSAL STATES — focus / disabled / loading
// ============================================================================

// -- Focus (keyboard-only via :focus-visible per WCAG 2.4.7) -----------------
// All seven types collapse to the same focus treatment: a 2 px outline
// painted with \`--button-focus-ring\` at \`outline-offset: 2px\`, sharing
// the pill \`--button-radius-focus\` corner shape. \`:focus-visible\` (not
// \`:focus\`) so mouse clicks don't surface the ring — keyboard
// navigation still does.

.btn:focus-visible,
.btn[data-state="focus"] {
  outline: var(--button-border-width-focus) solid var(--button-focus-ring);
  outline-offset: 2px;
  border-radius: var(--button-radius-focus);
}

// -- Disabled (universal paint, regardless of style) -------------------------
// Native \`disabled\` attribute is the source of truth — the template
// also mirrors \`aria-disabled="true"\` defensively for custom-element
// compositions that may swallow the native attribute. Paints the
// universal \`--button-disabled-*\` trio regardless of the active
// style. \`:not(.is-loading)\` excludes the loading state — loading +
// disabled is a defensible combo (consumers passing both) where
// disabled paints win.

.btn:disabled {
  background-color: var(--button-disabled-bg);
  color: var(--button-disabled-content);
  border-color: var(--button-disabled-border);
  cursor: not-allowed;
}

// -- Loading (paint stays unchanged; geometry stable; clicks blocked) --------
// \`.is-loading\` is a runtime-only class. The leading icon slot is
// swapped for \`.btn__spinner\` at the template layer; the rest of the
// surface paint stays exactly as the active \`(style, state)\` would
// otherwise render. \`pointer-events: none\` suppresses the click
// target without removing the button from the tab order (consumers
// wanting full keyboard lockout should pair \`loading={{true}}\` with
// \`disabled={{true}}\`).

.btn.is-loading {
  cursor: progress;
  pointer-events: none;
}

// ============================================================================
// REDUCED MOTION — strip the spinner rotation but keep the busy semantics
// ============================================================================

@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
  }

  .btn__spinner {
    animation: none;
  }
}
`})))()}var De;function Oe(){return(Oe=t((()=>{De=`/**
 * Components/Checkbox — 24 × 24 px box with optional checkmark or
 * indeterminate-dash glyph, progressive-enhanced over a native
 * \`<input type="checkbox">\`.
 *
 * Mirrors Web-ODS Shared Library master \`665:36315\` + the per-tone
 * hover/pressed state-circle composition at \`665:36267\` under the
 * LifeLock mode pick. The state circle is a 32 × 32 px wash painted
 * 4 px outside the box on every side via \`--color-inverse-secondary\`
 * at 20% (\`color-mix()\`); it paints on hover / focus / pressed and
 * gives the focusable area a generous hit target without changing
 * the box's visual footprint.
 *
 * All inline-axis sizing uses logical properties.
 *
 * Tokens consumed are listed in \`./spec.md\` § "Tokens consumed".
 *
 * Composes Icon — the check / dash glyphs are \`{{> icon}}\` instances;
 * pull in \`.c-icon\` mask styles so brand Storybooks that only import
 * this partial still paint the glyphs.
 */

@use '../icon/icon';

.c-checkbox {
  /* Per-instance dials. */
  --c-checkbox-box-size:        24px;
  --c-checkbox-state-circle:    32px;
  --c-checkbox-state-outset:    4px;
  --c-checkbox-radius:          var(--border-radius-control);
  --c-checkbox-outline-width:   var(--border-width-default);

  --c-checkbox-box-fill:        var(--color-bg-default);
  --c-checkbox-box-outline:     var(--color-border-strong);
  --c-checkbox-fill-color:      var(--color-signal-info);
  --c-checkbox-glyph-color:     var(--color-text-inverse);
  --c-checkbox-focus-color:     var(--color-border-focus);
  --c-checkbox-label-color:     var(--color-text-primary);

  /* The state-circle wash. Figma source on the multi-brand master is
     \`rgba(80, 81, 101, 0.2)\` — the white-label \`inverse-secondary\`
     token at 20% opacity. LifeLock has no \`inverse-secondary\` alias
     today, so the wash mixes \`--color-text-secondary\`
     (= \`--color-off-black\` under LifeLock mode) at 20% / 30% — a
     near-black wash that paints the same visual role on the LifeLock
     surface palette. Designer follow-up: publish a dedicated
     \`--color-state-wash\` semantic alias so this consumer doesn't bind
     to a text-role token. */
  --c-checkbox-state-color:        color-mix(in srgb, var(--color-text-secondary) 20%, transparent);
  --c-checkbox-state-color-strong: color-mix(in srgb, var(--color-text-secondary) 30%, transparent);

  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
  user-select: none;
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  font-weight: var(--font-weight-regular);
  color: var(--c-checkbox-label-color);
}

/* --- Tone variants -------------------------------------------- */

.c-checkbox--accent {
  --c-checkbox-fill-color: var(--color-signal-success);
}

.c-checkbox--critical {
  --c-checkbox-fill-color: var(--color-signal-critical);
}

/* --- Control wrapper (positions the input + state-circle + box) - */

.c-checkbox__control {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: var(--c-checkbox-state-circle);
  block-size:  var(--c-checkbox-state-circle);
  flex-shrink: 0;
}

/* --- Native input -------------------------------------------- */

/* Absolutely positioned to cover the 32×32 state-circle region so
   the entire ring is clickable + focus-ringable. Invisible. */
.c-checkbox__input {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  margin: 0;
  padding: 0;
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: var(--c-checkbox-radius);
  opacity: 0;
  cursor: inherit;
  z-index: 2;
}

/* --- State circle (hover / focus / pressed wash) -------------- */

.c-checkbox__state-circle {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  border-radius: var(--c-checkbox-radius);
  background-color: transparent;
  pointer-events: none;
  transition: background-color 120ms ease;
}

/* --- Visible box --------------------------------------------- */

.c-checkbox__box {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: var(--c-checkbox-box-size);
  block-size:  var(--c-checkbox-box-size);
  background-color: var(--c-checkbox-box-fill);
  border: var(--c-checkbox-outline-width) solid var(--c-checkbox-box-outline);
  border-radius: var(--c-checkbox-radius);
  color: var(--c-checkbox-glyph-color);
  z-index: 1;
}

/* --- Glyph wrappers (always rendered; CSS toggles opacity) ----- */

/* Both check + dash glyphs ship in the markup so a JS click-driven
   transition between unchecked → checked / indeterminate doesn't have
   to insert nodes. Visibility is purely CSS-driven via the \`is-checked\`
   / \`is-indeterminate\` modifier classes that \`checkbox.js\` (and the
   \`Selection\` Storybook control) toggle on the root. The wrappers are
   absolutely positioned so they stack inside the box without affecting
   layout when both are hidden. */
.c-checkbox__glyph {
  position: absolute;
  inset: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 120ms ease;
  pointer-events: none;
}

.c-checkbox.is-checked .c-checkbox__glyph--check {
  opacity: 1;
}

.c-checkbox.is-indeterminate .c-checkbox__glyph--dash {
  opacity: 1;
}

/* Glyph element fills the 24 px box so the \`-small\` SVG (whose visible
   path occupies ~50 % of its 24 px viewBox) reproduces Figma's ~12 px
   visible checkmark. mask-image keeps the glyph crisp at any size. */
.c-checkbox__box .c-icon {
  display: inline-flex;
  inline-size: var(--c-checkbox-box-size);
  block-size:  var(--c-checkbox-box-size);
}

/* --- Checked + indeterminate (filled paint) ------------------- */

.c-checkbox.is-checked .c-checkbox__box,
.c-checkbox.is-indeterminate .c-checkbox__box {
  background-color: var(--c-checkbox-fill-color);
  border-color: var(--c-checkbox-fill-color);
}

/* --- Visible label ------------------------------------------- */

.c-checkbox__label {
  display: inline-block;
  color: var(--c-checkbox-label-color);
}

/* --- Hover / pressed (interaction states) --------------------- */

.c-checkbox__input:hover ~ .c-checkbox__state-circle {
  background-color: var(--c-checkbox-state-color);
}

.c-checkbox__input:active ~ .c-checkbox__state-circle {
  background-color: var(--c-checkbox-state-color-strong);
}

/* --- Focus ring (drawn on the state-circle area) ------------- */

.c-checkbox__input:focus-visible ~ .c-checkbox__state-circle {
  background-color: var(--c-checkbox-state-color);
  outline: var(--border-width-default) solid var(--c-checkbox-focus-color);
  outline-offset: 0;
}

/* --- [data-state] gallery freezes ----------------------------- */

.c-checkbox[data-state="hover"] .c-checkbox__state-circle {
  background-color: var(--c-checkbox-state-color);
}

.c-checkbox[data-state="pressed"] .c-checkbox__state-circle {
  background-color: var(--c-checkbox-state-color-strong);
}

.c-checkbox[data-state="focused"] .c-checkbox__state-circle {
  background-color: var(--c-checkbox-state-color);
  outline: var(--border-width-default) solid var(--c-checkbox-focus-color);
  outline-offset: 0;
}

/* --- Disabled state ------------------------------------------- */

.c-checkbox.is-disabled,
.c-checkbox[aria-disabled="true"] {
  --c-checkbox-box-fill:      var(--color-disabled-bg);
  --c-checkbox-box-outline:   var(--color-disabled-border);
  --c-checkbox-fill-color:    var(--color-disabled-bg);
  --c-checkbox-glyph-color:   var(--color-disabled-text);
  --c-checkbox-label-color:   var(--color-disabled-text);

  cursor: not-allowed;
}

.c-checkbox.is-disabled .c-checkbox__input,
.c-checkbox[aria-disabled="true"] .c-checkbox__input {
  cursor: not-allowed;
  pointer-events: none;
}

.c-checkbox.is-disabled .c-checkbox__state-circle,
.c-checkbox[aria-disabled="true"] .c-checkbox__state-circle {
  background-color: transparent;
}

/* Disabled + checked / indeterminate still paints the disabled fill,
   not the tone fill — explicit override since the modifier rules
   above set border-color to the tone color. */
.c-checkbox.is-disabled.is-checked .c-checkbox__box,
.c-checkbox.is-disabled.is-indeterminate .c-checkbox__box,
.c-checkbox[aria-disabled="true"].is-checked .c-checkbox__box,
.c-checkbox[aria-disabled="true"].is-indeterminate .c-checkbox__box {
  background-color: var(--color-disabled-border);
  border-color: var(--color-disabled-border);
}

/* --- Reduced motion ------------------------------------------- */

@media (prefers-reduced-motion: reduce) {
  .c-checkbox__state-circle {
    transition: none;
  }
}
`})))()}var ke;function Ae(){return(Ae=t((()=>{ke=`/**
 * Icon — mask-image + currentColor primitive.
 *
 * Mirrors the canonical \`.Sticker Sheet / Icon mask wrapper\` on
 * Web-ODS Shared Library (\`990:1808\`) — see the Source files table in
 * \`storybook-lifelock/src/figma-import-index.md\`. The SVG is used as
 * an alpha mask; the background paints the silhouette in
 * \`currentColor\`, which is then overridden per \`c-icon--<color>\`
 * modifier. Consumers can also wrap the icon in any text-color
 * context and use \`c-icon--current\` to inherit.
 */

.c-icon {
  display: inline-block;
  box-sizing: border-box;
  flex-shrink: 0;
  width: var(--icon-size, 24px);
  height: var(--icon-size, 24px);
  padding-block: var(--icon-frame-padding-block, 0);
  padding-inline: var(--icon-frame-padding-inline, 0);
  background-color: currentcolor;
  background-clip: content-box;
  mask-image: var(--icon-source);
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  mask-clip: content-box;
  mask-origin: content-box;
  vertical-align: middle;
}

.c-icon--16  { --icon-size: 16px; }
.c-icon--20  { --icon-size: 20px; }
.c-icon--24  { --icon-size: 24px; }
.c-icon--32  { --icon-size: 32px; }
.c-icon--40  { --icon-size: 40px; }
.c-icon--48  { --icon-size: 48px; }
.c-icon--64  { --icon-size: 64px; }
.c-icon--72  { --icon-size: 72px; }
.c-icon--80  { --icon-size: 80px; }
.c-icon--96  { --icon-size: 96px; }
.c-icon--144 { --icon-size: 144px; }

.c-icon--current  { color: currentcolor; }
.c-icon--default  { color: var(--color-text-primary); }
.c-icon--brand    { color: var(--color-text-brand); }
.c-icon--accent   { color: var(--color-text-accent); }
.c-icon--inverse  { color: var(--color-text-inverse); }
.c-icon--success  { color: var(--color-signal-success); }
.c-icon--critical { color: var(--color-signal-critical); }

/* Frame envelopes — transparent positioning shells (no border, no fill).
 * Each shrinks the painted glyph to a smaller inner shape via
 * \`mask-clip: content-box\` + computed padding. Ratios mirror Figma
 * \`Web-ODS-Icons / 2:1318\` Section 2 "Shapes and Layouts" exactly. */
.c-icon--square {
  --icon-frame-padding-block:  calc(var(--icon-size) * 0.125);
  --icon-frame-padding-inline: calc(var(--icon-size) * 0.125);
}

.c-icon--circle {
  --icon-frame-padding-block:  calc(var(--icon-size) * 0.0833);
  --icon-frame-padding-inline: calc(var(--icon-size) * 0.0833);
}

.c-icon--vertical-rectangle {
  --icon-frame-padding-block:  calc(var(--icon-size) * 0.0833);
  --icon-frame-padding-inline: calc(var(--icon-size) * 0.1667);
}

.c-icon--horizontal-rectangle {
  --icon-frame-padding-block:  calc(var(--icon-size) * 0.1667);
  --icon-frame-padding-inline: calc(var(--icon-size) * 0.0833);
}
`})))()}var je;function Me(){return(Me=t((()=>{je=`/**
 * Components/PaginationDots — horizontal row of small dots with one
 * expanding active pill. Presentational only.
 *
 * Mirrors Web-ODS Shared Library master \`1278:1668\` + the light/dark
 * preview composition \`1278:1877\` under the LifeLock mode pick.
 *
 * Inline-axis sizing uses logical properties so the row reads natively
 * under \`dir="rtl"\`.
 *
 * Tokens consumed are listed in \`./spec.md\` § "Tokens consumed".
 */

.c-pagination-dots {
  --c-pagination-dots-size:        8px;
  --c-pagination-dots-active-w:    24px;
  --c-pagination-dots-gap:         var(--space-3);

  --c-pagination-dots-inactive:    var(--color-border-subtle);
  --c-pagination-dots-active:      var(--color-text-primary);

  display: inline-flex;
  align-items: center;
}

.c-pagination-dots__list {
  display: inline-flex;
  align-items: center;
  gap: var(--c-pagination-dots-gap);
  list-style: none;
  margin: 0;
  padding: 0;
}

.c-pagination-dots__dot {
  display: inline-block;
  inline-size: var(--c-pagination-dots-size);
  block-size:  var(--c-pagination-dots-size);
  background-color: var(--c-pagination-dots-inactive);
  border-radius: var(--border-radius-pill);
  transition: inline-size 180ms ease, background-color 180ms ease;
}

.c-pagination-dots__dot--active {
  inline-size: var(--c-pagination-dots-active-w);
  background-color: var(--c-pagination-dots-active);
}

/* --- Dark appearance ----------------------------------------- */

/* Inactive dots paint \`--color-text-inverse\` at 40 % opacity; the
   active pill paints the surface (\`--color-bg-default\`) so it reads
   on a dark backdrop. See spec.md § "Notes & open questions" for the
   token-substitution rationale. */
.c-pagination-dots--dark {
  --c-pagination-dots-inactive:    color-mix(in srgb, var(--color-text-inverse) 40%, transparent);
  --c-pagination-dots-active:      var(--color-bg-default);
}

/* --- Reduced motion ------------------------------------------- */

@media (prefers-reduced-motion: reduce) {
  .c-pagination-dots__dot {
    transition: none;
  }
}
`})))()}var Ne;function Pe(){return(Pe=t((()=>{Ne=`/**
 * Components/Radio — 24 × 24 px circle for single-select grouping,
 * progressive-enhanced over a native \`<input type="radio">\`.
 *
 * Mirrors Web-ODS Shared Library master \`666:36462\` under the
 * LifeLock mode pick. Visual architecture and state-wash mechanics
 * mirror the sibling Checkbox component verbatim — see
 * \`src/components/checkbox/checkbox.scss\` for the rationale. The
 * only differences are the circular geometry (no corners) and the
 * centred white dot in the checked state.
 *
 * Tokens consumed are listed in \`./spec.md\` § "Tokens consumed".
 */

.c-radio {
  --c-radio-box-size:        24px;
  --c-radio-dot-size:        8px;
  --c-radio-state-circle:    32px;
  --c-radio-outline-width:   var(--border-width-default);

  --c-radio-box-fill:        var(--color-bg-default);
  --c-radio-box-outline:     var(--color-border-strong);
  --c-radio-fill-color:      var(--color-signal-info);
  --c-radio-dot-color:       var(--color-text-inverse);
  --c-radio-focus-color:     var(--color-border-focus);
  --c-radio-label-color:     var(--color-text-primary);

  /* State-wash colour — see checkbox.scss for the substitution
     rationale (LifeLock has no \`inverse-secondary\` alias). */
  --c-radio-state-color:        color-mix(in srgb, var(--color-text-secondary) 20%, transparent);
  --c-radio-state-color-strong: color-mix(in srgb, var(--color-text-secondary) 30%, transparent);

  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
  user-select: none;
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  font-weight: var(--font-weight-regular);
  color: var(--c-radio-label-color);
}

/* --- Tone variants -------------------------------------------- */

.c-radio--accent {
  --c-radio-fill-color: var(--color-signal-success);
}

.c-radio--critical {
  --c-radio-fill-color: var(--color-signal-critical);
}

/* --- Control wrapper ------------------------------------------ */

.c-radio__control {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: var(--c-radio-state-circle);
  block-size:  var(--c-radio-state-circle);
  flex-shrink: 0;
}

/* --- Native input -------------------------------------------- */

.c-radio__input {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  margin: 0;
  padding: 0;
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: var(--border-radius-pill);
  opacity: 0;
  cursor: inherit;
  z-index: 2;
}

/* --- State circle (hover / focus / pressed wash) -------------- */

.c-radio__state-circle {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  border-radius: var(--border-radius-pill);
  background-color: transparent;
  pointer-events: none;
  transition: background-color 120ms ease;
}

/* --- Visible box (circle) ------------------------------------- */

.c-radio__box {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: var(--c-radio-box-size);
  block-size:  var(--c-radio-box-size);
  background-color: var(--c-radio-box-fill);
  border: var(--c-radio-outline-width) solid var(--c-radio-box-outline);
  border-radius: var(--border-radius-pill);
  z-index: 1;
}

/* --- Centred dot ---------------------------------------------- */

.c-radio__dot {
  display: block;
  inline-size: var(--c-radio-dot-size);
  block-size:  var(--c-radio-dot-size);
  background-color: var(--c-radio-dot-color);
  border-radius: var(--border-radius-pill);
  opacity: 0;
  transition: opacity 120ms ease;
}

/* --- Checked state ------------------------------------------- */

.c-radio.is-checked .c-radio__box {
  background-color: var(--c-radio-fill-color);
  border-color: var(--c-radio-fill-color);
}

.c-radio.is-checked .c-radio__dot {
  opacity: 1;
}

/* --- Visible label ------------------------------------------- */

.c-radio__label {
  display: inline-block;
  color: var(--c-radio-label-color);
}

/* --- Hover / pressed (interaction states) --------------------- */

.c-radio__input:hover ~ .c-radio__state-circle {
  background-color: var(--c-radio-state-color);
}

.c-radio__input:active ~ .c-radio__state-circle {
  background-color: var(--c-radio-state-color-strong);
}

/* --- Focus ring (drawn on the state-circle area) ------------- */

.c-radio__input:focus-visible ~ .c-radio__state-circle {
  background-color: var(--c-radio-state-color);
  outline: var(--border-width-default) solid var(--c-radio-focus-color);
  outline-offset: 0;
}

/* --- [data-state] gallery freezes ----------------------------- */

.c-radio[data-state="hover"] .c-radio__state-circle {
  background-color: var(--c-radio-state-color);
}

.c-radio[data-state="pressed"] .c-radio__state-circle {
  background-color: var(--c-radio-state-color-strong);
}

.c-radio[data-state="focused"] .c-radio__state-circle {
  background-color: var(--c-radio-state-color);
  outline: var(--border-width-default) solid var(--c-radio-focus-color);
  outline-offset: 0;
}

/* --- Disabled state ------------------------------------------- */

.c-radio.is-disabled,
.c-radio[aria-disabled="true"] {
  --c-radio-box-fill:      var(--color-disabled-bg);
  --c-radio-box-outline:   var(--color-disabled-border);
  --c-radio-fill-color:    var(--color-disabled-border);
  --c-radio-dot-color:     var(--color-disabled-text);
  --c-radio-label-color:   var(--color-disabled-text);

  cursor: not-allowed;
}

.c-radio.is-disabled .c-radio__input,
.c-radio[aria-disabled="true"] .c-radio__input {
  cursor: not-allowed;
  pointer-events: none;
}

.c-radio.is-disabled .c-radio__state-circle,
.c-radio[aria-disabled="true"] .c-radio__state-circle {
  background-color: transparent;
}

/* --- Reduced motion ------------------------------------------- */

@media (prefers-reduced-motion: reduce) {
  .c-radio__state-circle,
  .c-radio__dot {
    transition: none;
  }
}
`})))()}var Fe;function Ie(){return(Ie=t((()=>{Fe=`/**
 * Components/Switch — binary on/off toggle painted as a 42 × 26 px
 * pill, progressive-enhanced over a native
 * \`<input type="checkbox" role="switch">\`.
 *
 * Mirrors the canonical Web-ODS Shared Library master at \`717:48394\`.
 * Three persistent tone variants (\`default\` / \`success\` / \`critical\`)
 * repaint the ON-state track; the knob stays white. Interaction
 * states (\`hover\` / \`focus\` / \`pressed\`) paint via CSS pseudo-classes
 * on the underlying input. \`disabled\` and \`loading\` are persistent
 * (boolean props).
 *
 * All inline-axis sizing uses logical properties so the knob slides
 * to the inline-end edge under \`dir="rtl"\`.
 *
 * Tokens consumed are listed in \`./spec.md\` § "Tokens consumed".
 *
 * Composes Icon — the ON-state knob glyph is a \`{{> icon}}\` instance;
 * pull in \`.c-icon\` mask styles so brand Storybooks that only import
 * this partial still paint the glyph.
 */

@use '../icon/icon';

.c-switch {
  /* Per-instance dials so the body block below only rebinds parts
     that change per variant or state. Knob is 18 × 18 px with a 4 px
     inset on every side — mirrors the Figma master \`717:48394\`
     where the knob nestles 4 px from the track edge in both axes
     (track 42 × 26 px, knob 18 × 18 px, slide travel = 42 - 18 - 8
     = 16 px). */
  --c-switch-track-inline: 42px;
  --c-switch-track-block:  26px;
  --c-switch-knob-size:    18px;
  --c-switch-knob-inset:   4px;
  --c-switch-radius:       var(--border-radius-pill);

  /* Hoisted distance the knob travels in the ON state — single-line
     so stylelint's \`scss/operator-no-newline-before\` rule doesn't
     misinterpret the unary minus inside calc() as a SCSS operator. */
  --c-switch-knob-slide:   calc(var(--c-switch-track-inline) - var(--c-switch-knob-size) - (var(--c-switch-knob-inset) * 2));

  /* 32 × 32 px hover / pressed state-circle wash painted BEHIND the
     knob — Figma source is \`rgba(68, 68, 68, 0.2)\` on hover and
     \`rgba(68, 68, 68, 0.1)\` on pressed (the white-label
     \`inverse-secondary\` token at 20 % / 10 % opacity). LifeLock has
     no dedicated state-wash alias, so the implementation reuses the
     same \`--color-text-secondary\` substitution Checkbox / Radio use
     (Designer Follow-Up logged for a \`--color-state-wash\` alias). */
  --c-switch-state-circle:        32px;
  --c-switch-state-color:         color-mix(in srgb, var(--color-text-secondary) 20%, transparent);
  --c-switch-state-color-strong:  color-mix(in srgb, var(--color-text-secondary) 10%, transparent);

  --c-switch-track-off-color: var(--color-border-subtle);
  --c-switch-track-on-color:  var(--color-signal-info);
  --c-switch-knob-color:      var(--color-bg-default);
  --c-switch-knob-icon-color: var(--color-signal-info);
  --c-switch-focus-color:     var(--color-border-focus);
  --c-switch-label-color:     var(--color-text-primary);

  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
  user-select: none;
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  font-weight: var(--font-weight-regular);
  color: var(--c-switch-label-color);
}

/* --- Tone variants -------------------------------------------- */

.c-switch--success {
  --c-switch-track-on-color: var(--color-signal-success);
  --c-switch-knob-icon-color: var(--color-signal-success);
}

.c-switch--critical {
  --c-switch-track-on-color: var(--color-signal-critical);
  --c-switch-knob-icon-color: var(--color-signal-critical);
}

/* --- Native input (the source of truth) ----------------------- */

/* Layered visually over the entire track so pointer + keyboard
   activation both resolve against the native control. Opacity 0
   keeps the input invisible while still focus-ringable + clickable.
   \`z-index: 2\` lifts the input above every visible element (track,
   state-circle, knob) so :hover / :active fire whether the cursor
   sits over the bar or the knob. Mirrors the Checkbox pattern. */
.c-switch__input {
  position: absolute;
  inline-size: var(--c-switch-track-inline);
  block-size:  var(--c-switch-track-block);
  margin: 0;
  padding: 0;
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: var(--c-switch-radius);
  opacity: 0;
  cursor: inherit;
  z-index: 2;
}

/* --- Track + knob (visible paint) ----------------------------- */

.c-switch__track {
  position: relative;
  display: inline-flex;
  align-items: center;
  inline-size: var(--c-switch-track-inline);
  block-size:  var(--c-switch-track-block);
  flex-shrink: 0;
  background-color: var(--c-switch-track-off-color);
  border-radius: var(--c-switch-radius);
  transition: background-color 160ms ease;
}

/* Pure visual element — the input above handles all pointer +
   keyboard interaction. Without \`pointer-events: none\` the knob
   would intercept the cursor and swallow :hover / :active before
   they reach the input, so the halo never paints when the cursor
   is over the knob. */
.c-switch__knob {
  position: absolute;
  inset-inline-start: var(--c-switch-knob-inset);
  inset-block-start: var(--c-switch-knob-inset);
  inline-size: var(--c-switch-knob-size);
  block-size:  var(--c-switch-knob-size);
  background-color: var(--c-switch-knob-color);
  border-radius: var(--border-radius-pill);
  color: var(--c-switch-knob-icon-color);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 160ms ease, color 160ms ease;
  pointer-events: none;
  z-index: 1;
}

/* Glyph wrapper inside the knob — always rendered (gated only by the
   \`showIcon\` prop and \`loading\` state in the template). Visibility is
   CSS-driven via \`is-checked\` so click-driven toggles don't have to
   insert nodes. The icon element fills the 18 px knob; the \`-small\`
   SVG renders its visible mark at ~9 px which matches Figma. */
.c-switch__glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 120ms ease;
  pointer-events: none;
}

.c-switch.is-checked .c-switch__glyph {
  opacity: 1;
}

.c-switch__knob .c-icon {
  display: inline-flex;
  inline-size: var(--c-switch-knob-size);
  block-size: var(--c-switch-knob-size);
}

/* --- State circle (hover / pressed wash) --------------------- */

/* 32 × 32 px wash painted BEHIND the knob, centered on it. Travels
   with the knob via the same \`translateX(--c-switch-knob-slide)\` that
   moves the knob under \`.is-checked\`, so the halo always sits behind
   the knob regardless of position. Same RTL polarity flip as the
   knob. Pointer-events disabled so it never intercepts the underlying
   input. */
.c-switch__state-circle {
  position: absolute;
  inset-inline-start: calc(var(--c-switch-knob-inset) + (var(--c-switch-knob-size) - var(--c-switch-state-circle)) / 2);
  inset-block-start:  calc((var(--c-switch-track-block) - var(--c-switch-state-circle)) / 2);
  inline-size: var(--c-switch-state-circle);
  block-size:  var(--c-switch-state-circle);
  border-radius: var(--border-radius-pill);
  background-color: transparent;
  pointer-events: none;
  transition: background-color 120ms ease, transform 160ms ease;
  z-index: 0;
}

.c-switch.is-checked .c-switch__state-circle {
  transform: translateX(var(--c-switch-knob-slide));
}

[dir="rtl"] .c-switch.is-checked .c-switch__state-circle {
  transform: translateX(calc(var(--c-switch-knob-slide) * -1));
}

/* --- Visible label -------------------------------------------- */

.c-switch__label {
  display: inline-block;
  min-inline-size: 0;
  color: var(--c-switch-label-color);
}

/* --- Checked state -------------------------------------------- */

.c-switch.is-checked .c-switch__track {
  background-color: var(--c-switch-track-on-color);
}

.c-switch.is-checked .c-switch__knob {
  transform: translateX(var(--c-switch-knob-slide));
}

/* RTL — slide the knob to the inline-end (left in LTR-mirrored,
   right in RTL) using the same \`translateX\` polarity flip the
   browser already applies to logical properties. The math above is
   inline-axis-positive, so a global \`[dir="rtl"]\` flip is enough. */
[dir="rtl"] .c-switch.is-checked .c-switch__knob {
  transform: translateX(calc(var(--c-switch-knob-slide) * -1));
}

/* --- Hover / pressed (interaction states) --------------------- */

/* Track tints + state-circle halo paint TOGETHER on hover; pressed
   keeps the same track tint but lowers the halo opacity to 10 %
   (Figma \`717:48394\` painting). */
.c-switch__input:hover ~ .c-switch__track {
  background-color: color-mix(in srgb, var(--c-switch-track-off-color) 80%, var(--color-text-primary) 20%);
}

.c-switch.is-checked .c-switch__input:hover ~ .c-switch__track {
  background-color: color-mix(in srgb, var(--c-switch-track-on-color) 85%, black 15%);
}

.c-switch__input:hover ~ .c-switch__track .c-switch__state-circle {
  background-color: var(--c-switch-state-color);
}

.c-switch__input:active ~ .c-switch__track .c-switch__state-circle {
  background-color: var(--c-switch-state-color-strong);
}

/* --- Focus ring ----------------------------------------------- */

.c-switch__input:focus-visible ~ .c-switch__track {
  outline: var(--border-width-default) solid var(--c-switch-focus-color);
  outline-offset: var(--space-1);
}

/* --- [data-state] gallery freezes ----------------------------- */

.c-switch[data-state="hover"] .c-switch__track {
  background-color: color-mix(in srgb, var(--c-switch-track-off-color) 80%, var(--color-text-primary) 20%);
}

.c-switch[data-state="hover"].is-checked .c-switch__track {
  background-color: color-mix(in srgb, var(--c-switch-track-on-color) 85%, black 15%);
}

.c-switch[data-state="hover"] .c-switch__state-circle {
  background-color: var(--c-switch-state-color);
}

.c-switch[data-state="focused"] .c-switch__track {
  outline: var(--border-width-default) solid var(--c-switch-focus-color);
  outline-offset: var(--space-1);
}

.c-switch[data-state="pressed"] .c-switch__state-circle {
  background-color: var(--c-switch-state-color-strong);
}

/* --- Disabled state ------------------------------------------- */

.c-switch.is-disabled,
.c-switch[aria-disabled="true"] {
  --c-switch-track-off-color: var(--color-disabled-bg);
  --c-switch-track-on-color:  var(--color-disabled-bg);
  --c-switch-knob-color:      var(--color-disabled-text);
  --c-switch-knob-icon-color: var(--color-disabled-text);
  --c-switch-label-color:     var(--color-disabled-text);

  cursor: not-allowed;
}

.c-switch.is-disabled .c-switch__track,
.c-switch[aria-disabled="true"] .c-switch__track {
  outline: var(--border-width-hairline) solid var(--color-disabled-border);
  outline-offset: 0;
}

.c-switch.is-disabled .c-switch__input,
.c-switch[aria-disabled="true"] .c-switch__input {
  cursor: not-allowed;
  pointer-events: none;
}

/* --- Loading state -------------------------------------------- */

.c-switch.is-loading {
  cursor: progress;
}

.c-switch.is-loading .c-switch__input {
  pointer-events: none;
}

.c-switch__spinner {
  display: inline-block;
  inline-size: 14px;
  block-size: 14px;
  border: 2px solid currentcolor;
  border-block-end-color: transparent;
  border-radius: var(--border-radius-pill);
  animation: c-switch-spin 800ms linear infinite;
}

@keyframes c-switch-spin {
  to { transform: rotate(360deg); }
}

/* --- Reduced motion ------------------------------------------- */

@media (prefers-reduced-motion: reduce) {
  .c-switch__track,
  .c-switch__knob,
  .c-switch__state-circle,
  .c-switch__glyph {
    transition: none;
  }

  .c-switch__spinner {
    animation: none;
  }
}
`})))()}var Le;function Re(){return(Re=t((()=>{Le=`/**
 * Accordion group / item id helpers.
 *
 * Shared so both core stories and brand packages that compile with
 * their own Handlebars instance can register the same helpers.
 */

let _accordionGroupAutoCounter = 0;
let _lastAccordionGroupKey = null;

function slugifyAccordionName(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * @param {import('handlebars').HelperDelegate | typeof import('handlebars')} Handlebars
 */
export function registerAccordionHelpers(Handlebars) {
  Handlebars.registerHelper('accordionGroupKey', (rawName) => {
    const slug = rawName ? slugifyAccordionName(rawName) : '';
    if (slug) {
      _lastAccordionGroupKey = slug;
    } else {
      _accordionGroupAutoCounter += 1;
      _lastAccordionGroupKey = \`auto-\${_accordionGroupAutoCounter}\`;
    }
    return _lastAccordionGroupKey;
  });

  Handlebars.registerHelper('accordionItemId', (itemIndex) => {
    const key = _lastAccordionGroupKey || \`auto-\${++_accordionGroupAutoCounter}\`;
    return \`c-accordion-\${key}__item-\${itemIndex}\`;
  });
}
`})))()}var Z;function Q(){return(Q=t((()=>{Z=`/**
 * Patterns/Accordion — progressive-enhancement behavior layer.
 *
 * Native \`<details>\` works without JS. This module adds height
 * animation, optional single-open enforcement, disabled short-circuit,
 * and \`lifelock:accordion:*\` CustomEvents (namespace matches core
 * Checkbox / Radio / Switch).
 */

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  try {
    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
  } catch {
    return false;
  }
}

function getContentEl(details) {
  return details.querySelector(':scope > .c-accordion__item-content');
}

function isDisabled(details) {
  return details.getAttribute('data-disabled') === 'true';
}

function dispatch(details, type, detail) {
  details.dispatchEvent(
    new CustomEvent(\`lifelock:accordion:\${type}\`, {
      bubbles: true,
      composed: true,
      detail,
    }),
  );
}

function getItemId(details) {
  return details.id || details.getAttribute('data-accordion-item-id') || '';
}

/**
 * @param {HTMLElement} root
 * @param {{ singleOpen?: boolean, animate?: boolean, duration?: number }} [options]
 */
export function initAccordion(root, options = {}) {
  if (!root || root.dataset.accordionInitialized === 'true') {
    return null;
  }
  root.dataset.accordionInitialized = 'true';

  const animate = options.animate !== false;
  const duration = typeof options.duration === 'number' ? options.duration : 200;
  const singleOpen =
    typeof options.singleOpen === 'boolean'
      ? options.singleOpen
      : root.getAttribute('data-single-open') === 'true';

  const items = Array.from(root.querySelectorAll(':scope > .c-accordion__item'));

  function findDetails(target) {
    if (typeof target === 'number') return items[target] || null;
    return items.find((d) => getItemId(d) === target) || null;
  }

  function animatePanel(details, opening, source) {
    const content = getContentEl(details);
    if (!content) return;

    if (!animate || prefersReducedMotion()) {
      details.open = opening;
      dispatch(details, 'toggle', { id: getItemId(details), open: opening, source });
      dispatch(details, opening ? 'opened' : 'closed', {
        id: getItemId(details),
        source,
      });
      return;
    }

    if (opening) {
      details.open = true;
      details.dataset.animating = 'opening';
      const target = content.scrollHeight;
      content.style.maxBlockSize = '0px';
      requestAnimationFrame(() => {
        content.style.transition = \`max-block-size \${duration}ms ease\`;
        content.style.maxBlockSize = \`\${target}px\`;
      });
      const onEnd = () => {
        content.style.transition = '';
        content.style.maxBlockSize = '';
        delete details.dataset.animating;
        content.removeEventListener('transitionend', onEnd);
        dispatch(details, 'opened', { id: getItemId(details), source });
      };
      content.addEventListener('transitionend', onEnd);
      dispatch(details, 'toggle', { id: getItemId(details), open: true, source });
    } else {
      const startHeight = content.scrollHeight;
      details.dataset.animating = 'closing';
      content.style.maxBlockSize = \`\${startHeight}px\`;
      requestAnimationFrame(() => {
        content.style.transition = \`max-block-size \${duration}ms ease\`;
        content.style.maxBlockSize = '0px';
      });
      const onEnd = () => {
        content.style.transition = '';
        content.style.maxBlockSize = '';
        delete details.dataset.animating;
        details.open = false;
        content.removeEventListener('transitionend', onEnd);
        dispatch(details, 'closed', { id: getItemId(details), source });
      };
      content.addEventListener('transitionend', onEnd);
      dispatch(details, 'toggle', { id: getItemId(details), open: false, source });
    }
  }

  function open(target, source = 'api') {
    const details = findDetails(target);
    if (!details || isDisabled(details) || details.open) return;
    if (singleOpen) {
      items
        .filter((d) => d !== details && d.open && !isDisabled(d))
        .forEach((sibling) => animatePanel(sibling, false, 'api'));
    }
    animatePanel(details, true, source);
  }

  function close(target, source = 'api') {
    const details = findDetails(target);
    if (!details || !details.open) return;
    animatePanel(details, false, source);
  }

  function toggle(target, source = 'api') {
    const details = findDetails(target);
    if (!details) return;
    if (details.open) close(target, source);
    else open(target, source);
  }

  function getOpen() {
    return items.filter((d) => d.open).map(getItemId);
  }

  function onSummaryClick(event) {
    const summary = event.target.closest('.c-accordion__item-header');
    if (!summary) return;
    const details = summary.parentElement;
    if (!details || !details.classList.contains('c-accordion__item')) return;
    if (isDisabled(details)) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    const source = event.detail === 0 ? 'keyboard' : 'click';
    if (details.open) {
      close(details.id || items.indexOf(details), source);
    } else {
      open(details.id || items.indexOf(details), source);
    }
  }

  items.forEach((details) => {
    const summary = details.querySelector(':scope > .c-accordion__item-header');
    if (summary) summary.addEventListener('click', onSummaryClick);
  });

  function destroy() {
    items.forEach((details) => {
      const summary = details.querySelector(':scope > .c-accordion__item-header');
      if (summary) summary.removeEventListener('click', onSummaryClick);
      const content = getContentEl(details);
      if (content) {
        content.style.transition = '';
        content.style.maxBlockSize = '';
      }
      delete details.dataset.animating;
    });
    delete root.dataset.accordionInitialized;
  }

  return { open, close, toggle, getOpen, destroy };
}

/**
 * @param {ParentNode} [scope]
 * @param {object} [options]
 */
export function initAccordions(scope, options) {
  const root = scope || (typeof document !== 'undefined' ? document : null);
  if (!root) return [];
  return Array.from(root.querySelectorAll('.c-accordion'))
    .map((node) => initAccordion(node, options))
    .filter(Boolean);
}

export default initAccordion;
`})))()}var ze;function Be(){return(Be=t((()=>{ze=`/**
 * Button Handlebars helpers — shared by core and brand packages.
 */

/**
 * @param {import('handlebars').HelperDelegate | typeof import('handlebars')} Handlebars
 */
export function registerButtonHelpers(Handlebars) {
  Handlebars.registerHelper('buttonIconSize', (size) => {
    const normalized = String(size ?? '').toLowerCase();
    return normalized === 's' ? '16' : '20';
  });
}
`})))()}var Ve;function He(){return(He=t((()=>{Ve=`/**
 * Components/Checkbox behaviour layer.
 *
 * Progressive enhancement on top of the native
 * \`<input type="checkbox">\` the template emits. The SCSS paints
 * every persistent + transient state from class modifiers + CSS
 * pseudo-classes; this layer's only jobs are:
 *
 *   1. Keep the native \`indeterminate\` JS property in sync with the
 *      \`is-indeterminate\` modifier class. (\`indeterminate\` is a
 *      JS-only DOM property; HTML attributes alone cannot set it.)
 *   2. Toggle \`is-checked\` / \`is-indeterminate\` based on the input's
 *      \`checked\` state on change.
 *   3. Dispatch namespaced \`lifelock:checkbox:change\` and
 *      \`lifelock:checkbox:commit\` CustomEvents.
 *
 * Public API documented in \`./spec.md\` § "JavaScript API".
 */

/**
 * @typedef {"unchecked" | "checked" | "indeterminate"} CheckboxSelection
 */

/**
 * @typedef {Object} CheckboxInitOptions
 * @property {"input"|"change"} [commitOn="change"]
 */

/**
 * @typedef {Object} CheckboxInstance
 * @property {() => CheckboxSelection} getSelection
 * @property {(next: CheckboxSelection) => void} setSelection
 * @property {(disabled: boolean) => void} setDisabled
 * @property {() => void} destroy
 */

function dispatch(root, name, detail) {
  root.dispatchEvent(
    new CustomEvent(name, { detail, bubbles: true, composed: true }),
  );
}

/**
 * Initialise one checkbox root.
 *
 * @param {HTMLElement} root
 * @param {CheckboxInitOptions} [options]
 * @returns {CheckboxInstance}
 */
export function initCheckbox(root, options = {}) {
  if (!root || root.dataset.checkboxInitialised === "true") {
    return /** @type {CheckboxInstance} */ ({
      getSelection: () => "unchecked",
      setSelection: () => {},
      setDisabled: () => {},
      destroy: () => {},
    });
  }
  root.dataset.checkboxInitialised = "true";

  const commitOn = options.commitOn === "input" ? "input" : "change";

  /** @type {HTMLInputElement | null} */
  const input = root.querySelector(".c-checkbox__input");
  if (!input) {
    return /** @type {CheckboxInstance} */ ({
      getSelection: () => "unchecked",
      setSelection: () => {},
      setDisabled: () => {},
      destroy: () => {},
    });
  }

  // Honor the initial indeterminate visual by setting the native JS
  // property so screen readers announce "Mixed".
  if (root.classList.contains("is-indeterminate")) {
    input.indeterminate = true;
  }

  function paint(source) {
    const checked = input.checked;
    root.classList.toggle("is-checked", checked);
    root.classList.remove("is-indeterminate");
    input.indeterminate = false;
    dispatch(root, "lifelock:checkbox:change", {
      selection: checked ? "checked" : "unchecked",
      source,
    });
  }

  /** @param {Event} _e */
  function onChange(_e) {
    paint("pointer");
    if (commitOn === "change" || commitOn === "input") {
      dispatch(root, "lifelock:checkbox:commit", {
        selection: input.checked ? "checked" : "unchecked",
        source: "pointer",
      });
    }
  }

  /** @param {KeyboardEvent} e */
  function onKeyUp(e) {
    if (e.key !== " " && e.key !== "Enter") return;
    dispatch(root, "lifelock:checkbox:commit", {
      selection: input.checked ? "checked" : "unchecked",
      source: "keyboard",
    });
  }

  input.addEventListener("change", onChange);
  input.addEventListener("keyup", onKeyUp);

  return {
    getSelection() {
      if (input.indeterminate) return "indeterminate";
      return input.checked ? "checked" : "unchecked";
    },
    setSelection(next) {
      if (next === "indeterminate") {
        input.checked = false;
        input.indeterminate = true;
        root.classList.remove("is-checked");
        root.classList.add("is-indeterminate");
      } else if (next === "checked") {
        input.checked = true;
        input.indeterminate = false;
        root.classList.add("is-checked");
        root.classList.remove("is-indeterminate");
      } else {
        input.checked = false;
        input.indeterminate = false;
        root.classList.remove("is-checked");
        root.classList.remove("is-indeterminate");
      }
      dispatch(root, "lifelock:checkbox:commit", {
        selection: next === "indeterminate" ? "unchecked" : next,
        source: "api",
      });
    },
    setDisabled(disabled) {
      if (disabled) {
        root.setAttribute("aria-disabled", "true");
        root.classList.add("is-disabled");
        input.disabled = true;
      } else {
        root.removeAttribute("aria-disabled");
        root.classList.remove("is-disabled");
        input.disabled = false;
      }
    },
    destroy() {
      input.removeEventListener("change", onChange);
      input.removeEventListener("keyup", onKeyUp);
      delete root.dataset.checkboxInitialised;
    },
  };
}

/**
 * Initialise every checkbox inside a scope.
 *
 * @param {ParentNode} [scope]
 * @param {CheckboxInitOptions} [options]
 * @returns {CheckboxInstance[]}
 */
export function initCheckboxes(scope, options) {
  const root =
    scope && typeof scope.querySelectorAll === "function"
      ? scope
      : typeof document !== "undefined"
      ? document
      : null;
  if (!root) return [];
  return Array.from(root.querySelectorAll(".c-checkbox")).map((el) =>
    initCheckbox(/** @type {HTMLElement} */ (el), options),
  );
}
`})))()}var Ue;function We(){return(We=t((()=>{Ue=`/**
 * Components/Radio behaviour layer.
 *
 * Progressive enhancement on top of the native
 * \`<input type="radio">\` the template emits. The browser owns
 * single-select group enforcement (any radio with the same \`name\`)
 * and the arrow-key navigation between members of the group; this
 * layer's only jobs are:
 *
 *   1. Mirror the input's \`checked\` state onto the root's
 *      \`is-checked\` modifier so the visible dot + fill can paint
 *      via the modifier class.
 *   2. Dispatch namespaced \`lifelock:radio:change\` and
 *      \`lifelock:radio:commit\` CustomEvents.
 *   3. Listen for change events on *sibling* radios in the same
 *      group so the unchecked radios in the group repaint when one
 *      of them becomes selected.
 *
 * Public API documented in \`./spec.md\` § "JavaScript API".
 */

/**
 * @typedef {Object} RadioInitOptions
 * @property {"input"|"change"} [commitOn="change"]
 */

/**
 * @typedef {Object} RadioInstance
 * @property {() => boolean} getChecked
 * @property {(next: boolean) => void} setChecked
 * @property {(disabled: boolean) => void} setDisabled
 * @property {() => void} destroy
 */

function dispatch(root, name, detail) {
  root.dispatchEvent(
    new CustomEvent(name, { detail, bubbles: true, composed: true }),
  );
}

function syncFromInput(root, input) {
  root.classList.toggle("is-checked", input.checked);
}

/**
 * Initialise one radio root.
 *
 * @param {HTMLElement} root
 * @param {RadioInitOptions} [options]
 * @returns {RadioInstance}
 */
export function initRadio(root, options = {}) {
  if (!root || root.dataset.radioInitialised === "true") {
    return /** @type {RadioInstance} */ ({
      getChecked: () => false,
      setChecked: () => {},
      setDisabled: () => {},
      destroy: () => {},
    });
  }
  root.dataset.radioInitialised = "true";

  const commitOn = options.commitOn === "input" ? "input" : "change";

  /** @type {HTMLInputElement | null} */
  const input = root.querySelector(".c-radio__input");
  if (!input) {
    return /** @type {RadioInstance} */ ({
      getChecked: () => false,
      setChecked: () => {},
      setDisabled: () => {},
      destroy: () => {},
    });
  }

  syncFromInput(root, input);

  /** @param {Event} _e */
  function onChange(_e) {
    syncFromInput(root, input);
    dispatch(root, "lifelock:radio:change", {
      checked: input.checked,
      name: input.name,
      value: input.value,
    });
    if (commitOn === "change" || commitOn === "input") {
      dispatch(root, "lifelock:radio:commit", {
        checked: input.checked,
        name: input.name,
        value: input.value,
        source: "pointer",
      });
    }
  }

  /** @param {KeyboardEvent} e */
  function onKeyUp(e) {
    if (e.key !== " " && e.key !== "Enter" &&
      e.key !== "ArrowUp" && e.key !== "ArrowDown" &&
      e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
      return;
    }
    dispatch(root, "lifelock:radio:commit", {
      checked: input.checked,
      name: input.name,
      value: input.value,
      source: "keyboard",
    });
  }

  // When a sibling radio in the same group changes, this radio
  // becomes unchecked — repaint to clear the dot. Native radios
  // don't fire \`change\` on the radios being unchecked, so we
  // listen on the document.
  function onDocChange(e) {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target === input) return;
    if (target.type !== "radio") return;
    if (target.name !== input.name) return;
    syncFromInput(root, input);
  }

  input.addEventListener("change", onChange);
  input.addEventListener("keyup", onKeyUp);
  if (typeof document !== "undefined") {
    document.addEventListener("change", onDocChange, true);
  }

  return {
    getChecked() {
      return input.checked;
    },
    setChecked(next) {
      input.checked = Boolean(next);
      syncFromInput(root, input);
      dispatch(root, "lifelock:radio:commit", {
        checked: input.checked,
        name: input.name,
        value: input.value,
        source: "api",
      });
    },
    setDisabled(disabled) {
      if (disabled) {
        root.setAttribute("aria-disabled", "true");
        root.classList.add("is-disabled");
        input.disabled = true;
      } else {
        root.removeAttribute("aria-disabled");
        root.classList.remove("is-disabled");
        input.disabled = false;
      }
    },
    destroy() {
      input.removeEventListener("change", onChange);
      input.removeEventListener("keyup", onKeyUp);
      if (typeof document !== "undefined") {
        document.removeEventListener("change", onDocChange, true);
      }
      delete root.dataset.radioInitialised;
    },
  };
}

/**
 * Initialise every radio inside a scope.
 *
 * @param {ParentNode} [scope]
 * @param {RadioInitOptions} [options]
 * @returns {RadioInstance[]}
 */
export function initRadios(scope, options) {
  const root =
    scope && typeof scope.querySelectorAll === "function"
      ? scope
      : typeof document !== "undefined"
      ? document
      : null;
  if (!root) return [];
  return Array.from(root.querySelectorAll(".c-radio")).map((el) =>
    initRadio(/** @type {HTMLElement} */ (el), options),
  );
}
`})))()}var Ge;function Ke(){return(Ke=t((()=>{Ge=`/**
 * Components/Switch behaviour layer.
 *
 * Progressive enhancement on top of the native
 * \`<input type="checkbox" role="switch">\` the template emits. The
 * SCSS already paints every visual state from the input's
 * \`:checked\` / \`:hover\` / \`:focus-visible\` / \`:active\` /
 * \`:disabled\` selectors; this layer's only jobs are:
 *
 *   1. Mirror the input's \`checked\` state onto the root's
 *      \`is-checked\` modifier + \`aria-checked\` attribute so the
 *      visible track + knob can paint via the modifier class.
 *   2. Dispatch namespaced \`lifelock:switch:change\` and
 *      \`lifelock:switch:commit\` CustomEvents.
 *   3. Refuse commits while \`aria-busy="true"\` (loading).
 *
 * Public API documented in \`./spec.md\` § "JavaScript API".
 */

/**
 * @typedef {Object} SwitchInitOptions
 * @property {"input"|"change"} [commitOn="change"]
 */

/**
 * @typedef {Object} SwitchInstance
 * @property {() => boolean} getChecked
 * @property {(next: boolean) => void} setChecked
 * @property {(disabled: boolean) => void} setDisabled
 * @property {() => void} destroy
 */

function dispatch(root, name, detail) {
  root.dispatchEvent(
    new CustomEvent(name, { detail, bubbles: true, composed: true }),
  );
}

/**
 * Initialise one switch root.
 *
 * @param {HTMLElement} root
 * @param {SwitchInitOptions} [options]
 * @returns {SwitchInstance}
 */
export function initSwitch(root, options = {}) {
  if (!root || root.dataset.switchInitialised === "true") {
    return /** @type {SwitchInstance} */ ({
      getChecked: () => false,
      setChecked: () => {},
      setDisabled: () => {},
      destroy: () => {},
    });
  }
  root.dataset.switchInitialised = "true";

  const commitOn = options.commitOn === "input" ? "input" : "change";

  /** @type {HTMLInputElement | null} */
  const input = root.querySelector(".c-switch__input");
  if (!input) {
    return /** @type {SwitchInstance} */ ({
      getChecked: () => false,
      setChecked: () => {},
      setDisabled: () => {},
      destroy: () => {},
    });
  }

  function paint(source) {
    const checked = input.checked;
    root.classList.toggle("is-checked", checked);
    input.setAttribute("aria-checked", checked ? "true" : "false");
    dispatch(root, "lifelock:switch:change", { checked, source });
  }

  /** @param {Event} _e */
  function onChange(_e) {
    if (root.getAttribute("aria-busy") === "true") {
      input.checked = !input.checked;
      return;
    }
    paint("pointer");
    if (commitOn === "change" || commitOn === "input") {
      dispatch(root, "lifelock:switch:commit", {
        checked: input.checked,
        source: "pointer",
      });
    }
  }

  /** @param {KeyboardEvent} e */
  function onKeyUp(e) {
    if (e.key !== " " && e.key !== "Enter") return;
    if (root.getAttribute("aria-busy") === "true") return;
    dispatch(root, "lifelock:switch:commit", {
      checked: input.checked,
      source: "keyboard",
    });
  }

  input.addEventListener("change", onChange);
  input.addEventListener("keyup", onKeyUp);

  root.classList.toggle("is-checked", input.checked);
  input.setAttribute("aria-checked", input.checked ? "true" : "false");

  return {
    getChecked() {
      return input.checked;
    },
    setChecked(next) {
      input.checked = Boolean(next);
      paint("api");
      dispatch(root, "lifelock:switch:commit", {
        checked: input.checked,
        source: "api",
      });
    },
    setDisabled(disabled) {
      if (disabled) {
        root.setAttribute("aria-disabled", "true");
        root.classList.add("is-disabled");
        input.disabled = true;
      } else {
        root.removeAttribute("aria-disabled");
        root.classList.remove("is-disabled");
        input.disabled = false;
      }
    },
    destroy() {
      input.removeEventListener("change", onChange);
      input.removeEventListener("keyup", onKeyUp);
      delete root.dataset.switchInitialised;
    },
  };
}

/**
 * Initialise every switch inside a scope.
 *
 * @param {ParentNode} [scope]
 * @param {SwitchInitOptions} [options]
 * @returns {SwitchInstance[]}
 */
export function initSwitches(scope, options) {
  const root =
    scope && typeof scope.querySelectorAll === "function"
      ? scope
      : typeof document !== "undefined"
      ? document
      : null;
  if (!root) return [];
  return Array.from(root.querySelectorAll(".c-switch")).map((el) =>
    initSwitch(/** @type {HTMLElement} */ (el), options),
  );
}
`})))()}function qe(e){if(!e)return{scss:null,js:null};let t=(t,n)=>[`/src/components/${e}/${e}.${n}`,`/src/layouts/${e}/${e}.${n}`,`/src/pages/${e}/${e}.${n}`].reduce((e,n)=>e??t[n]??null,null);return{scss:t(Ze,`scss`)??t($e,`scss`)??t(tt,`scss`),js:t(Qe,`js`)??t(et,`js`)??t(nt,`js`)}}function Je(e,t={}){let{unit:n,scss:r,js:i,extra:a={}}=t,o=qe(n),s=r??o.scss,c=i??o.js,l=s&&String(s).trim()||c&&String(c).trim()?Xe(e,{js:c,scss:s}):String(e).trim(),{docs:u,...d}=a;return{...d,docs:{...u&&typeof u==`object`?u:{},source:{code:l,language:`html`,type:`code`}}}}function Ye(e,t){let n=RegExp(`</${t}`,`gi`);return String(e).replace(n,`<\\/${t}`)}function Xe(e,{js:t,scss:n}={}){let r=[String(e).trim()];if(t&&String(t).trim()){let e=Ye(String(t).trim(),`script`);r.push(``,`<!-- ── JavaScript ── -->`,`<script>`,e,`<\/script>`)}if(n&&String(n).trim()){let e=Ye(String(n).trim(),`style`);r.push(``,`<!-- ── SCSS ── -->`,`<style>`,e,`</style>`)}return r.join(`
`)}var Ze,Qe,$e,et,tt,nt;function $(){return($=t((()=>{q(),J(),Ee(),X(),Oe(),Ae(),Me(),Pe(),Ie(),Re(),Q(),Be(),He(),We(),Ke(),Ze=Object.assign({"/src/components/accordion/accordion.scss":K,"/src/components/award-wrapper/award-wrapper.scss":we,"/src/components/badge/badge.scss":Te,"/src/components/button/button.scss":Y,"/src/components/checkbox/checkbox.scss":De,"/src/components/icon/icon.scss":ke,"/src/components/pagination-dots/pagination-dots.scss":je,"/src/components/radio/radio.scss":Ne,"/src/components/switch/switch.scss":Fe}),Qe=Object.assign({"/src/components/accordion/accordion-helpers.js":Le,"/src/components/accordion/accordion.js":Z,"/src/components/button/button-helpers.js":ze,"/src/components/checkbox/checkbox.js":Ve,"/src/components/radio/radio.js":Ue,"/src/components/switch/switch.js":Ge}),$e=Object.assign({}),et=Object.assign({}),tt=Object.assign({}),nt=Object.assign({})})))()}export{j as C,O as E,P as S,D as T,R as _,Y as a,I as b,q as c,W as d,U as f,B as g,z as h,Q as i,G as l,V as m,$ as n,X as o,H as p,Z as r,K as s,Je as t,Ce as u,L as v,M as w,N as x,F as y};