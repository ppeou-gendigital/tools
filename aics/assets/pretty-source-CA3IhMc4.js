import{a as e,n as t,t as n}from"./rolldown-runtime-DkW27tQK.js";import{i as r,r as i}from"./_icon-catalog-hmO93ib8.js";var a=n((e=>{e.__esModule=!0,e.extend=a,e.indexOf=l,e.escapeExpression=u,e.isEmpty=d,e.createFrame=f,e.blockParams=p,e.appendContextPath=m;var t={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#x27;`,"`":`&#x60;`,"=":`&#x3D;`},n=/[&<>"'`=]/g,r=/[&<>"'`=]/;function i(e){return t[e]}function a(e){for(var t=1;t<arguments.length;t++)for(var n in arguments[t])Object.prototype.hasOwnProperty.call(arguments[t],n)&&(e[n]=arguments[t][n]);return e}var o=Object.prototype.toString;e.toString=o;var s=function(e){return typeof e==`function`};s(/x/)&&(e.isFunction=s=function(e){return typeof e==`function`&&o.call(e)===`[object Function]`}),e.isFunction=s;var c=Array.isArray||function(e){return e&&typeof e==`object`?o.call(e)===`[object Array]`:!1};e.isArray=c;function l(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1}function u(e){if(typeof e!=`string`){if(e&&e.toHTML)return e.toHTML();if(e==null)return``;if(!e)return e+``;e=``+e}return r.test(e)?e.replace(n,i):e}function d(e){return!e&&e!==0||!!(c(e)&&e.length===0)}function f(e){var t=a({},e);return t._parent=e,t}function p(e,t){return e.path=t,e}function m(e,t){return(e?e+`.`:``)+t}})),o=n(((e,t)=>{e.__esModule=!0;var n=[`description`,`fileName`,`lineNumber`,`endLineNumber`,`message`,`name`,`number`,`stack`];function r(e,t){var i=t&&t.loc,a=void 0,o=void 0,s=void 0,c=void 0;i&&(a=i.start.line,o=i.end.line,s=i.start.column,c=i.end.column,e+=` - `+a+`:`+s);for(var l=Error.prototype.constructor.call(this,e),u=0;u<n.length;u++)this[n[u]]=l[n[u]];Error.captureStackTrace&&Error.captureStackTrace(this,r);try{i&&(this.lineNumber=a,this.endLineNumber=o,Object.defineProperty?(Object.defineProperty(this,"column",{value:s,enumerable:!0}),Object.defineProperty(this,"endColumn",{value:c,enumerable:!0})):(this.column=s,this.endColumn=c))}catch{}}r.prototype=Error(),e.default=r,t.exports=e.default})),s=n(((e,t)=>{e.__esModule=!0;var n=a();e.default=function(e){e.registerHelper(`blockHelperMissing`,function(t,r){var i=r.inverse,a=r.fn;if(t===!0)return a(this);if(t===!1||t==null)return i(this);if(n.isArray(t))return t.length>0?(r.ids&&(r.ids=[r.name]),e.helpers.each(t,r)):i(this);if(r.data&&r.ids){var o=n.createFrame(r.data);o.contextPath=n.appendContextPath(r.data.contextPath,r.name),r={data:o}}return a(t,r)})},t.exports=e.default})),c=n(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var r=a(),i=n(o());e.default=function(e){e.registerHelper(`each`,function(e,t){if(!t)throw new i.default(`Must pass iterator to #each`);var n=t.fn,a=t.inverse,o=0,s=``,c=void 0,l=void 0;t.data&&t.ids&&(l=r.appendContextPath(t.data.contextPath,t.ids[0])+`.`),r.isFunction(e)&&(e=e.call(this)),t.data&&(c=r.createFrame(t.data));function u(t,i,a){c&&(c.key=t,c.index=i,c.first=i===0,c.last=!!a,l&&(c.contextPath=l+t)),s+=n(e[t],{data:c,blockParams:r.blockParams([e[t],t],[l+t,null])})}if(e&&typeof e==`object`)if(r.isArray(e))for(var d=e.length;o<d;o++)o in e&&u(o,o,o===e.length-1);else if(typeof Symbol==`function`&&e[Symbol.iterator]){for(var f=[],p=e[Symbol.iterator](),m=p.next();!m.done;m=p.next())f.push(m.value);e=f;for(var d=e.length;o<d;o++)u(o,o,o===e.length-1)}else(function(){var t=void 0;Object.keys(e).forEach(function(e){t!==void 0&&u(t,o-1),t=e,o++}),t!==void 0&&u(t,o-1,!0)})();return o===0&&(s=a(this)),s})},t.exports=e.default})),l=n(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var r=n(o());e.default=function(e){e.registerHelper(`helperMissing`,function(){if(arguments.length!==1)throw new r.default(`Missing helper: "`+arguments[arguments.length-1].name+`"`)})},t.exports=e.default})),u=n(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var r=a(),i=n(o());e.default=function(e){e.registerHelper(`if`,function(e,t){if(arguments.length!=2)throw new i.default(`#if requires exactly one argument`);return r.isFunction(e)&&(e=e.call(this)),!t.hash.includeZero&&!e||r.isEmpty(e)?t.inverse(this):t.fn(this)}),e.registerHelper(`unless`,function(t,n){if(arguments.length!=2)throw new i.default(`#unless requires exactly one argument`);return e.helpers.if.call(this,t,{fn:n.inverse,inverse:n.fn,hash:n.hash})})},t.exports=e.default})),d=n(((e,t)=>{e.__esModule=!0,e.default=function(e){e.registerHelper(`log`,function(){for(var t=[void 0],n=arguments[arguments.length-1],r=0;r<arguments.length-1;r++)t.push(arguments[r]);var i=1;n.hash.level==null?n.data&&n.data.level!=null&&(i=n.data.level):i=n.hash.level,t[0]=i,e.log.apply(e,t)})},t.exports=e.default})),f=n(((e,t)=>{e.__esModule=!0,e.default=function(e){e.registerHelper(`lookup`,function(e,t,n){return e&&n.lookupProperty(e,t)})},t.exports=e.default})),p=n(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var r=a(),i=n(o());e.default=function(e){e.registerHelper(`with`,function(e,t){if(arguments.length!=2)throw new i.default(`#with requires exactly one argument`);r.isFunction(e)&&(e=e.call(this));var n=t.fn;if(r.isEmpty(e))return t.inverse(this);var a=t.data;return t.data&&t.ids&&(a=r.createFrame(t.data),a.contextPath=r.appendContextPath(t.data.contextPath,t.ids[0])),n(e,{data:a,blockParams:r.blockParams([e],[a&&a.contextPath])})})},t.exports=e.default})),m=n((e=>{e.__esModule=!0,e.registerDefaultHelpers=g,e.moveHelperToHooks=_;function t(e){return e&&e.__esModule?e:{default:e}}var n=t(s()),r=t(c()),i=t(l()),a=t(u()),o=t(d()),m=t(f()),h=t(p());function g(e){n.default(e),r.default(e),i.default(e),a.default(e),o.default(e),m.default(e),h.default(e)}function _(e,t,n){e.helpers[t]&&(e.hooks[t]=e.helpers[t],n||(e.helpers[t]=void 0))}})),h=n(((e,t)=>{e.__esModule=!0;var n=a();e.default=function(e){e.registerDecorator(`inline`,function(e,t,r,i){var a=e;return t.partials||(t.partials={},a=function(i,a){var o=r.partials;r.partials=n.extend({},o,t.partials);var s=e(i,a);return r.partials=o,s}),t.partials[i.args[0]]=i.fn,a})},t.exports=e.default})),g=n((e=>{e.__esModule=!0,e.registerDefaultDecorators=r;function t(e){return e&&e.__esModule?e:{default:e}}var n=t(h());function r(e){n.default(e)}})),_=n(((e,t)=>{e.__esModule=!0;var n=a(),r={methodMap:[`debug`,`info`,`warn`,`error`],level:`info`,lookupLevel:function(e){if(typeof e==`string`){var t=n.indexOf(r.methodMap,e.toLowerCase());e=t>=0?t:parseInt(e,10)}return e},log:function(e){if(e=r.lookupLevel(e),typeof console<`u`&&r.lookupLevel(r.level)<=e){var t=r.methodMap[e];console[t]||(t=`log`);var n=[...arguments].slice(1);console[t].apply(console,n)}}};e.default=r,t.exports=e.default})),v=n((e=>{e.__esModule=!0,e.createProtoAccessControl=o,e.resultIsAllowed=s,e.resetLoggedProperties=u;function t(e){return e&&e.__esModule?e:{default:e}}var n=a(),r=t(_()),i=Object.create(null);function o(e){var t=Object.create(null);t.__proto__=!1,n.extend(t,e.allowedProtoProperties);var r=Object.create(null);return r.constructor=!1,r.__defineGetter__=!1,r.__defineSetter__=!1,r.__lookupGetter__=!1,r.__lookupSetter__=!1,n.extend(r,e.allowedProtoMethods),{properties:{whitelist:t,defaultValue:e.allowProtoPropertiesByDefault},methods:{whitelist:r,defaultValue:e.allowProtoMethodsByDefault}}}function s(e,t,n){return c(typeof e==`function`?t.methods:t.properties,n)}function c(e,t){return e.whitelist[t]===void 0?e.defaultValue===void 0?(l(t),!1):e.defaultValue:e.whitelist[t]===!0}function l(e){i[e]!==!0&&(i[e]=!0,r.default.log(`error`,`Handlebars: Access has been denied to resolve the property "`+e+`" because it is not an "own property" of its parent.
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
        <img class="c-media__placeholder-glyph" src="{{assetUrl 'assets/media/play-overlay.svg'}}" alt="" />
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
        <img class="c-media__placeholder-glyph" src="{{assetUrl 'assets/media/play-overlay.svg'}}" alt="" />
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
        <img class="c-media__placeholder-glyph" src="{{assetUrl 'assets/media/placeholder.svg'}}" alt="" />
      </div>
    {{/if}}
  {{/if}}
</div>
`})))()}function Ce(e){let t=String(e??``).trim();if(!t)return``;if(/^[A-Za-z0-9_-]{11}$/.test(t))return`https://www.youtube.com/embed/${t}`;try{let e=new URL(t),n=e.hostname.replace(/^www\./,``);if(n===`youtu.be`){let t=e.pathname.split(`/`).filter(Boolean)[0];if(t&&/^[A-Za-z0-9_-]{11}$/.test(t))return`https://www.youtube.com/embed/${t}`}if(n===`youtube.com`||n===`m.youtube.com`||n===`youtube-nocookie.com`){let t=e.searchParams.get(`v`);if(t&&/^[A-Za-z0-9_-]{11}$/.test(t))return`https://www.youtube.com/embed/${t}`;let n=e.pathname.split(`/`).filter(Boolean),r=[`embed`,`shorts`,`live`,`v`];for(let e=0;e<n.length-1;e+=1)if(r.includes(n[e])&&/^[A-Za-z0-9_-]{11}$/.test(n[e+1]))return`https://www.youtube.com/embed/${n[e+1]}`}}catch{}return``}function we(e){e.registerHelper(`youtubeEmbedUrl`,Ce)}var Z;function Te(){return(Te=t((()=>{Z=`{{!--
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
`})))()}var Ee;function De(){return(De=t((()=>{Ee=`{{!--
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
`})))()}function Oe(e){e.registerHelper(`alertStatusIcon`,(e,t)=>{if(t)return t;let n={info:`status/simple-status-info`,critical:`status/simple-status-critical`,attention:`status/simple-status-attention`,success:`status/simple-status-ok`,dark:`status/simple-info`,brand:`status/simple-status-info`};return n[e]||n.info}),e.registerHelper(`alertCtaStyle`,e=>e===`high`?`secondary`:`primary`)}var ke;function Ae(){return(Ae=t((()=>{ke=`{{!--
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
`})))()}var je;function Me(){return(Me=t((()=>{je=`{{!--
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
`})))()}var Ne;function Pe(){return(Pe=t((()=>{Ne=`{{!--
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
`})))()}var Fe;function Ie(){return(Ie=t((()=>{Fe=`{{!--
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
`})))()}var Le;function Re(){return(Re=t((()=>{Le=`{{!--
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
`})))()}function ze(e){e.registerHelper(`contentListOrderedMarker`,e=>{let t=Number(e);return`${Number.isFinite(t)?t+1:1}.`}),e.registerHelper(`contentListIconName`,(e,t)=>e||t||`status/simple-checkmark-small`)}var Be;function Ve(){return(Ve=t((()=>{Be=`{{!--
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
`})))()}var He;function Ue(){return(Ue=t((()=>{He=`{{!--
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
`})))()}var We;function Ge(){return(Ge=t((()=>{We=`{{!--
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
`})))()}var Ke;function qe(){return(qe=t((()=>{Ke=`{{!--
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
`})))()}var Je;function Ye(){return(Ye=t((()=>{Je=`{{!--
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
`})))()}var Xe;function Ze(){return(Ze=t((()=>{Xe=`{{!--
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
`})))()}var Qe;function $e(){return($e=t((()=>{Qe=`{{!--
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
`})))()}var et;function tt(){return(tt=t((()=>{et=`{{!--
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
`})))()}var nt;function rt(){return(rt=t((()=>{nt=`{{!--
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
`})))()}var it;function at(){return(at=t((()=>{it=`{{!--
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
`})))()}var ot;function st(){return(st=t((()=>{ot=`{{!--
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
`})))()}var ct;function lt(){return(lt=t((()=>{ct=`{{!--
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
`})))()}function ut({currentPage:e=1,totalPages:t=5,siblingCount:n=1,truncate:r=!0}={}){let i=Math.max(1,Number(t)||1),a=Math.min(i,Math.max(1,Number(e)||1)),o=Math.max(0,Number(n)||0);if(!r||i<=o*2+5)return Array.from({length:i},(e,t)=>({kind:`page`,page:t+1,current:t+1===a}));let s=new Set([1,i,a]);for(let e=a-o;e<=a+o;e+=1)e>=1&&e<=i&&s.add(e);let c=Array.from(s).sort((e,t)=>e-t),l=[],u=0;for(let e of c)u&&e-u>1&&l.push({kind:`ellipsis`}),l.push({kind:`page`,page:e,current:e===a}),u=e;return l}function dt(e){e.registerHelper(`paginationPages`,(e,t,n,r)=>ut({currentPage:e,totalPages:t,siblingCount:n,truncate:r!==!1}))}function ft(){return(ft=t((()=>{})))()}var pt;function mt(){return(mt=t((()=>{pt=`{{!--
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
`})))()}var ht;function gt(){return(gt=t((()=>{ht=`{{!--
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
`})))()}var _t;function vt(){return(vt=t((()=>{_t=`{{!--
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
`})))()}var yt;function bt(){return(bt=t((()=>{yt=`{{!--
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
`})))()}var xt;function St(){return(St=t((()=>{xt=`{{!--
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
`})))()}var Ct;function wt(){return(wt=t((()=>{Ct=`{{!--
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
`})))()}var Tt;function Et(){return(Et=t((()=>{Tt=`{{!--
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
`})))()}var Dt;function Ot(){return(Ot=t((()=>{Dt=`{{!--
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
`})))()}var kt;function At(){return(At=t((()=>{kt=`{{!--
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
`})))()}var jt;function Mt(){return(Mt=t((()=>{jt=`{{!--
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
`})))()}var Nt;function Pt(){return(Pt=t((()=>{Nt=`{{!--
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
`})))()}var Ft;function It(){return(It=t((()=>{Ft=`{{!--
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
`})))()}var Lt;function Rt(){return(Rt=t((()=>{Lt=`{{!--
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
`})))()}var zt;function Bt(){return(Bt=t((()=>{zt=`{{!--
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
`})))()}function Vt(e){let t=String(e||``).replace(/^\//,``);return`${Ht}${t}`}var Ht;function Ut(){return(Ut=t((()=>{Ht=`/tools/aics/`.replace(/\/?$/,`/`)})))()}var Q;function Wt(){return(Wt=t((()=>{Q=e(ve(),1),O(),xe(),M(),P(),I(),R(),B(),H(),W(),K(),J(),X(),Te(),De(),Ae(),Me(),Pe(),Ie(),Re(),Ve(),Ue(),Ge(),qe(),Ye(),Ze(),$e(),tt(),rt(),at(),st(),lt(),mt(),gt(),vt(),bt(),St(),wt(),Et(),Ot(),At(),Mt(),Pt(),It(),Rt(),Bt(),r(),Ut(),Q.default.registerHelper(`eq`,(e,t)=>e===t),Q.default.registerHelper(`unless-eq`,(e,t,n)=>e===t?n.inverse(void 0):n.fn(void 0)),Q.default.registerHelper(`lower`,e=>String(e??``).toLowerCase()),Q.default.registerHelper(`iconUrl`,e=>i(e)),Q.default.registerHelper(`assetUrl`,e=>Vt(e)),Q.default.registerHelper(`codeBoxes`,(e,t)=>{let n=Math.max(1,Number.parseInt(e,10)||6),r=String(t??``);return Array.from({length:n},(e,t)=>({index:t,position:t+1,total:n,char:r[t]??``}))}),be(Q.default),Se(Q.default),we(Q.default),Oe(Q.default),ze(Q.default),dt(Q.default),Q.default.registerPartial(`accordion`,D),Q.default.registerPartial(`badge`,j),Q.default.registerPartial(`button`,N),Q.default.registerPartial(`icon`,F),Q.default.registerPartial(`radio`,L),Q.default.registerPartial(`checkbox`,z),Q.default.registerPartial(`switch`,V),Q.default.registerPartial(`pagination-dots`,U),Q.default.registerPartial(`logo-wrapper`,G),Q.default.registerPartial(`image-wrapper`,q),Q.default.registerPartial(`media`,Y),Q.default.registerPartial(`pricing`,Z),Q.default.registerPartial(`alert`,Ee),Q.default.registerPartial(`award-wrapper`,ke),Q.default.registerPartial(`award-item`,je),Q.default.registerPartial(`text-link`,Ne),Q.default.registerPartial(`breadcrumb`,Fe),Q.default.registerPartial(`content-body`,Be),Q.default.registerPartial(`content-title`,He),Q.default.registerPartial(`content-list`,Le),Q.default.registerPartial(`content-block`,We),Q.default.registerPartial(`discount-label`,Ke),Q.default.registerPartial(`text-field`,Je),Q.default.registerPartial(`search-box`,Xe),Q.default.registerPartial(`code-entry`,Qe),Q.default.registerPartial(`menu-list`,et),Q.default.registerPartial(`menu-block`,nt),Q.default.registerPartial(`progress-indicator`,it),Q.default.registerPartial(`modal`,ot),Q.default.registerPartial(`pagination`,ct),Q.default.registerPartial(`slider`,pt),Q.default.registerPartial(`rating`,ht),Q.default.registerPartial(`sheet`,_t),Q.default.registerPartial(`stepper`,yt),Q.default.registerPartial(`table-cell`,xt),Q.default.registerPartial(`table-block`,Ct),Q.default.registerPartial(`tag`,Tt),Q.default.registerPartial(`tabs`,Dt),Q.default.registerPartial(`tooltip`,kt),Q.default.registerPartial(`toggle`,jt),Q.default.registerPartial(`trustpilot`,Nt),Q.default.registerPartial(`card`,Ft),Q.default.registerPartial(`divider`,Lt),Q.default.registerPartial(`lower-footer`,zt)})))()}var Gt;function Kt(){return(Kt=t((()=>{Gt=`/**
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
`})))()}var qt;function Jt(){return(Jt=t((()=>{qt=`/**
 * Patterns/Alert — unified master (.c-alert).
 * Figma Web-ODS Shared Library 537:28056 / Spec 5399:1816.
 *
 * Axes → BEM:
 *   tone       → .c-alert--{info|critical|attention|success|dark|brand}
 *   hierarchy  → .c-alert--{low|high}
 *   width      → .c-alert--{in-grid|full-bleed}
 *   elevation  → .c-alert--elevated
 *
 * Composes Button (Size S) + Icon. CTA paint lives in button.scss.
 */

.c-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  inline-size: 100%;
  box-sizing: border-box;
  padding-block: var(--space-5);
  padding-inline: var(--space-5);
  border-radius: var(--border-radius-l);
  font-family: var(--font-family-primary);
  text-decoration: none;
  flex-wrap: wrap;
}

.c-alert--full-bleed {
  border-radius: var(--border-radius-0);
  padding-inline: var(--space-5);

  @media (min-width: 768px) {
    padding-inline: var(--space-8);
  }

  @media (min-width: 1024px) {
    padding-inline: var(--space-10);
  }

  @media (min-width: 1440px) {
    padding-inline: var(--space-13);
  }
}

.c-alert--elevated {
  box-shadow: var(--shadow-default);
}

.c-alert__status-icon {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 20px;
  block-size: 20px;
  margin-block-start: 2px;
}

.c-alert__content {
  flex: 1 1 0;
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.c-alert__title {
  margin: 0;
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letterspacing-body-base);
}

.c-alert__description {
  margin: 0;
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  font-weight: var(--font-weight-regular);
  letter-spacing: var(--letterspacing-body-sm);
}

.c-alert > .btn {
  align-self: center;
}

.c-alert__dismiss {
  align-self: center;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: var(--space-7);
  block-size: var(--space-7);
  padding: 0;
  border: 0;
  border-radius: var(--border-radius-control);
  background-color: transparent;
  color: inherit;
  cursor: pointer;
  transition: background-color 150ms ease;
  margin-inline-start: auto;
}

.c-alert__dismiss:hover,
.c-alert[data-state='hover'] .c-alert__dismiss {
  background-color: rgb(0 0 0 / 8%);
}

.c-alert__dismiss:focus-visible,
.c-alert[data-state='focus'] .c-alert__dismiss {
  outline: var(--border-width-default) solid var(--color-border-focus);
  outline-offset: 2px;
}

/* Low — subtle tint + primary text -------------------------------------- */

.c-alert--low.c-alert--info {
  background-color: var(--color-signal-info-subtle);
  color: var(--color-text-primary);
}

.c-alert--low.c-alert--info .c-alert__status-icon {
  color: var(--color-signal-info);
}

.c-alert--low.c-alert--critical {
  background-color: var(--color-signal-critical-subtle);
  color: var(--color-text-primary);
}

.c-alert--low.c-alert--critical .c-alert__status-icon {
  color: var(--color-signal-critical);
}

.c-alert--low.c-alert--attention {
  background-color: var(--color-signal-warning-subtle);
  color: var(--color-text-primary);
}

.c-alert--low.c-alert--attention .c-alert__status-icon {
  color: var(--color-signal-warning);
}

.c-alert--low.c-alert--success {
  background-color: var(--color-signal-success-subtle);
  color: var(--color-text-primary);
}

.c-alert--low.c-alert--success .c-alert__status-icon {
  color: var(--color-signal-success);
}

.c-alert--low.c-alert--dark {
  background-color: var(--color-bg-muted);
  color: var(--color-text-primary);
}

.c-alert--low.c-alert--dark .c-alert__status-icon {
  color: var(--color-text-primary);
}

.c-alert--low.c-alert--brand {
  background-color: var(--color-bg-brand-soft);
  color: var(--color-text-primary);
}

.c-alert--low.c-alert--brand .c-alert__status-icon {
  color: var(--color-bg-brand);
}

/* High — solid signal + inverse (Attention keeps primary text) ---------- */

.c-alert--high.c-alert--info {
  background-color: var(--color-signal-info);
  color: var(--color-text-inverse);
}

.c-alert--high.c-alert--info .c-alert__status-icon {
  color: var(--color-text-inverse);
}

.c-alert--high.c-alert--critical {
  background-color: var(--color-signal-critical);
  color: var(--color-text-inverse);
}

.c-alert--high.c-alert--critical .c-alert__status-icon {
  color: var(--color-text-inverse);
}

.c-alert--high.c-alert--attention {
  background-color: var(--color-signal-warning);
  color: var(--color-text-primary);
}

.c-alert--high.c-alert--attention .c-alert__status-icon {
  color: var(--color-text-primary);
}

.c-alert--high.c-alert--success {
  background-color: var(--color-signal-success);
  color: var(--color-text-inverse);
}

.c-alert--high.c-alert--success .c-alert__status-icon {
  color: var(--color-text-inverse);
}

.c-alert--high.c-alert--dark {
  background-color: var(--color-bg-inverse-strong);
  color: var(--color-text-inverse);
}

.c-alert--high.c-alert--dark .c-alert__status-icon {
  color: var(--color-text-inverse);
}

.c-alert--high.c-alert--brand {
  background-color: var(--color-bg-brand);
  color: var(--color-text-inverse);
}

.c-alert--high.c-alert--brand .c-alert__status-icon {
  color: var(--color-text-inverse);
}

@media (prefers-reduced-motion: reduce) {
  .c-alert,
  .c-alert__dismiss {
    transition: none;
  }
}
`})))()}var Yt;function Xt(){return(Xt=t((()=>{Yt=`/**
 * Patterns/Award item — .c-award-item
 * Figma Web-ODS Shared Library 2355:19639 / Spec 3882:473.
 *
 * Card: --color-bg-primary, --border-radius-s, --space-3 pad/gap.
 * Image slot sizes are hard-coded per Spec (override Award Wrapper box).
 */

.c-award-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  box-sizing: border-box;
  padding: var(--space-3);
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-s);
  color: var(--color-text-primary);
  font-family: var(--font-family-primary);
}

.c-award-item__media {
  flex: 0 0 auto;
}

/* Default slot sizes (non title-description) */
.c-award-item--ratio-1-1 .c-award-item__media .c-award-wrapper {
  inline-size: 56px;
  block-size: 56px;
}

.c-award-item--ratio-9-16 .c-award-item__media .c-award-wrapper {
  inline-size: 37px;
  block-size: 66px;
}

.c-award-item--ratio-16-9 .c-award-item__media .c-award-wrapper {
  inline-size: 88px;
  block-size: 50px;
}

/* Title-description featured slot */
.c-award-item--layout-title-description.c-award-item--ratio-1-1 .c-award-item__media .c-award-wrapper {
  inline-size: 136px;
  block-size: 136px;
}

.c-award-item--layout-title-description.c-award-item--ratio-9-16 .c-award-item__media .c-award-wrapper {
  inline-size: 77px;
  block-size: 136px;
}

.c-award-item--layout-title-description.c-award-item--ratio-16-9 .c-award-item__media .c-award-wrapper {
  inline-size: 136px;
  block-size: 77px;
}

.c-award-item--ratio-9-16 .c-award-wrapper__placeholder-label {
  font-size: 10px;
  line-height: 11px;
}

.c-award-item__content {
  flex: 1 1 0;
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.c-award-item--layout-title-description .c-award-item__content {
  inline-size: 220px;
  flex: 0 0 220px;
}

.c-award-item__quote,
.c-award-item__source,
.c-award-item__year,
.c-award-item__title,
.c-award-item__description,
.c-award-item__score {
  margin: 0;
}

.c-award-item__quote,
.c-award-item__title {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letterspacing-body-sm);
  color: var(--color-text-primary);
}

.c-award-item--layout-title-description .c-award-item__title {
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  letter-spacing: var(--letterspacing-body-base);
}

.c-award-item__source,
.c-award-item__year,
.c-award-item__description {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  font-weight: var(--font-weight-regular);
  letter-spacing: var(--letterspacing-body-sm);
  color: var(--color-text-secondary);
}

.c-award-item__rating {
  display: inline-flex;
  align-items: center;
  gap: var(--space-0);
  color: var(--color-text-primary);
}

.c-award-item__rating--inline {
  gap: var(--space-1);
}

.c-award-item__score {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  font-weight: var(--font-weight-semibold);
}

/* Layout direction */
.c-award-item--layout-compact-stacked,
.c-award-item--layout-rating-stacked {
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.c-award-item--layout-compact-stacked .c-award-item__content,
.c-award-item--layout-rating-stacked .c-award-item__rating {
  align-items: center;
}

.c-award-item--layout-quote,
.c-award-item--layout-title-rating,
.c-award-item--layout-compact,
.c-award-item--layout-title-description {
  flex-direction: row;
  align-items: flex-start;
}
`})))()}var Zt;function Qt(){return(Qt=t((()=>{Zt=`/**
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
  /* Figma Color/Disabled/secondary — theme alias is --color-disabled-border */
  background-color: var(--color-disabled-border, #b3b3b3);
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
`})))()}var $t;function en(){return(en=t((()=>{$t=`/**
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
`})))()}var tn;function nn(){return(nn=t((()=>{tn=`/**
 * Patterns/Breadcrumb — .c-breadcrumb
 * Spec Frame 4560:48 / visual set 1260:8373.
 *
 * Gap: --space-3 (8px). Truncate max: --bc-truncate-max (16ch).
 * SM (< 768): dual-list hosts swap to compact trail (force collapsed).
 */

.c-breadcrumb {
  --bc-truncate-max: 16ch;

  display: inline-flex;
  padding-block: var(--space-1);
  padding-inline: var(--space-2);
  color: var(--color-disabled-text);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
}

.c-breadcrumb__list {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Dual list: compact hidden on MD+; SM swaps (Spec force-collapsed). */
.c-breadcrumb--dual .c-breadcrumb__list--collapsed {
  display: none;
}

@media (max-width: 767px) {
  .c-breadcrumb--dual .c-breadcrumb__list--expanded {
    display: none;
  }

  .c-breadcrumb--dual .c-breadcrumb__list--collapsed {
    display: inline-flex;
  }
}

.c-breadcrumb__item {
  display: inline-flex;
  align-items: center;
  min-block-size: 24px;
}

.c-breadcrumb__item--separator {
  color: var(--color-disabled-text);
}

[dir='rtl'] .c-breadcrumb__chevron {
  display: inline-flex;
  transform: scaleX(-1);
}

.c-breadcrumb__current {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
}

.c-breadcrumb__home {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-inline-size: 24px;
  min-block-size: 24px;
  padding: 0;
  color: var(--color-text-brand);
  text-decoration: none;
  border-radius: var(--border-radius-control);

  &:hover {
    color: var(--color-text-primary);
  }

  &:active {
    opacity: 0.85;
  }

  &:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: var(--space-1);
  }
}

.c-breadcrumb__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  inline-size: 20px;
  block-size: 20px;
  padding: var(--space-1);
  color: var(--color-text-primary);
  border-radius: var(--border-radius-control);
  cursor: help;
}

.c-breadcrumb__item--truncate .c-text-link__label,
.c-breadcrumb__item--truncate .c-breadcrumb__current {
  display: inline-block;
  max-inline-size: var(--bc-truncate-max);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}
`})))()}var rn;function an(){return(an=t((()=>{rn=`/**
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
`})))()}var on;function sn(){return(sn=t((()=>{on=`/**
 * Patterns/Card — BEM root (.c-card).
 * Figma: master 4695:33460 / Spec 5664:296.
 *
 * Ratio → aspect-ratio on media plane
 * Alignment → content justification (Simple board)
 */

@use '../discount-label/discount-label';
@use '../content-title/content-title';
@use '../content-body/content-body';
@use '../text-link/text-link';
@use '../icon/icon';

.c-card {
  --c-card-ratio: 16 / 9;

  aspect-ratio: var(--c-card-ratio);
  border-radius: var(--border-radius-l);
  box-sizing: border-box;
  color: var(--color-text-inverse);
  display: flex;
  flex-direction: column;
  inline-size: 100%;
  max-inline-size: 400px;
  overflow: hidden;
  position: relative;
}

.c-card--ratio-16-9 { --c-card-ratio: 16 / 9; }
.c-card--ratio-4-3 { --c-card-ratio: 4 / 3; }
.c-card--ratio-1-1 { --c-card-ratio: 1 / 1; }
.c-card--ratio-3-4 { --c-card-ratio: 3 / 4; }
.c-card--ratio-2-1 { --c-card-ratio: 2 / 1; }

.c-card__media {
  inset: 0;
  pointer-events: none;
  position: absolute;
}

.c-card__image {
  block-size: 100%;
  inline-size: 100%;
  object-fit: cover;
}

.c-card__scrim {
  background: linear-gradient(
    to top,
    rgb(0 0 0 / 85%) 0%,
    rgb(0 0 0 / 35%) 45%,
    rgb(0 0 0 / 55%) 100%
  );
  inset: 0;
  position: absolute;
}

.c-card__content {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  inset: 0;
  justify-content: space-between;
  padding: var(--space-5);
  position: absolute;
  z-index: 1;
}

.c-card--align-top-left .c-card__content,
.c-card--align-top-right .c-card__content {
  justify-content: flex-start;
  gap: var(--space-5);
}

.c-card--align-bottom-left .c-card__content,
.c-card--align-bottom-right .c-card__content {
  justify-content: space-between;
}

.c-card--align-top-right .c-card__top,
.c-card--align-bottom-right .c-card__bottom {
  align-items: flex-end;
  text-align: end;
}

.c-card__top,
.c-card__bottom {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  inline-size: 100%;
}

.c-card__bottom {
  gap: var(--space-4);
}

.c-card .c-content-title,
.c-card .c-content-body {
  color: var(--color-text-inverse);
}

.c-card__footer .c-text-link {
  display: inline-flex;
  inline-size: 100%;
  justify-content: space-between;
}

.c-card__category {
  color: var(--color-text-inverse);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-label, 12px);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letterspacing-label, 0.24px);
  line-height: var(--lineheight-label, 16px);
  margin: 0;
}

.c-card__footer {
  display: flex;
  inline-size: 100%;
}

.c-card__footer-link {
  inline-size: 100%;
  justify-content: space-between;
}
`})))()}var cn;function ln(){return(ln=t((()=>{cn=`/**
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
`})))()}var un;function dn(){return(dn=t((()=>{un=`// Patterns/Inputs/Code entry
// A segmented one-time-code field: a row of fixed-size single-character
// native <input> boxes under a label, with an optional helper message.
// Geometry + paint mirror the Web-ODS Shared Library "Code entry" Figma
// node (698:47604): each box is 40×56 with an 8px radius, the digit is
// the H4/SemiBold heading style, and the active box takes a subtle grey
// fill + info-blue border + info-blue caret. The \`is-filled\` modifier
// (set in the template for SSR and kept in sync by the JS layer) marks a
// box that holds a digit; filled boxes keep the resting border per Figma.

@use '../../tokens/breakpoints/breakpoints' as bp;

.c-code-entry {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-family: var(--font-family-primary);
}

.c-code-entry__label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-regular);
  line-height: var(--lineheight-label);
  letter-spacing: var(--letterspacing-label);
}

// Active group → the label takes the info accent (Figma Focus / Typing).
.c-code-entry:not(.is-error, .is-disabled):focus-within .c-code-entry__label {
  color: var(--color-signal-info);
}

.c-code-entry__boxes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-5);

  // Tighten the inter-box gap on small devices per the Figma guidance
  // ("On small devices make gap between fields just 8px").
  @include bp.sm {
    gap: var(--space-3);
  }
}

.c-code-entry__box {
  inline-size: 2.5rem; // 40px
  block-size: 3.5rem; // 56px
  padding: 0;
  border: var(--border-width-hairline) solid var(--color-border-subtle);
  border-radius: var(--border-radius-card);
  background-color: var(--color-bg-default);
  color: var(--color-text-primary);
  caret-color: var(--color-signal-info);
  font-family: inherit;
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-semibold);
  line-height: var(--lineheight-h4);
  letter-spacing: var(--letterspacing-h4);
  text-align: center;
  appearance: none;
}

// Active box — subtle grey fill + info border (Figma Focus / Typing).
.c-code-entry__box:focus {
  outline: none;
  border-color: var(--color-signal-info);
  background-color: var(--color-bg-subtle);
}

// ── Error ────────────────────────────────────────────────────────────
.c-code-entry.is-error .c-code-entry__box {
  border-color: var(--color-signal-critical);
}

.c-code-entry.is-error .c-code-entry__box:focus {
  border-color: var(--color-signal-critical);
  background-color: var(--color-bg-subtle);
}

.c-code-entry.is-error .c-code-entry__helper {
  color: var(--color-text-error);
}

// ── Disabled ─────────────────────────────────────────────────────────
.c-code-entry.is-disabled .c-code-entry__label {
  color: var(--color-text-disabled);
}

.c-code-entry__box:disabled {
  border-color: var(--color-bg-muted);
  background-color: var(--color-bg-muted);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

// ── Helper message ───────────────────────────────────────────────────
.c-code-entry__helper {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-label);
  line-height: var(--lineheight-label);
  letter-spacing: var(--letterspacing-label);
}
`})))()}var fn;function pn(){return(pn=t((()=>{fn=`/**
 * Patterns/Content block — core (.c-content-block).
 * Figma: Web-ODS Shared Library Pattern / ContentBlock 3483:3418.
 *
 * Flat white section container — padding --space-7, gap --space-3.
 * Composes Content title, Content body, Text link, Button.
 */

.c-content-block {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-block: 0;
  margin-inline: 0;
  padding-block: var(--space-7);
  padding-inline: var(--space-7);
  inline-size: 100%;
  max-inline-size: 100%;
  background-color: var(--color-bg-primary);
}

.c-content-block__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
  inline-size: 100%;
}

.c-content-block__title {
  flex: 1 1 0;
  min-inline-size: 0;
}

.c-content-block__action {
  flex-shrink: 0;
  align-self: center;
}

.c-content-block__body {
  inline-size: 100%;
}

.c-content-block__slot {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  inline-size: 100%;
  min-block-size: 0;
}
`})))()}var mn;function hn(){return(hn=t((()=>{mn=`/**
 * Molecules/Content body — core (.c-content-body).
 * Figma: Web-ODS Shared Library 3483:3453 / canvas 3598:7414.
 *
 * Axes → BEM:
 *   style  → .c-content-body--body-3xl | --body-2xl | --body-xl |
 *            --body-lg | --body-base | --body-sm | --body-xs
 *   weight → .c-content-body--weight-subtle | --weight-base |
 *            --weight-prominent | --weight-emphasis | --weight-strong
 */

.c-content-body {
  box-sizing: border-box;
  margin-block: 0;
  margin-inline: 0;
  inline-size: 100%;
  max-inline-size: 100%;
  font-family: var(--font-family-primary);
  color: var(--color-text-primary);
  overflow-wrap: break-word;
}

// --- Style (size / line-height / letter-spacing) -----------------------------

.c-content-body--body-3xl {
  font-size: var(--font-size-body-3xl);
  line-height: var(--lineheight-body-3xl);
  letter-spacing: var(--letterspacing-body-3xl);
}

.c-content-body--body-2xl {
  font-size: var(--font-size-body-2xl);
  line-height: var(--lineheight-body-2xl);
  letter-spacing: var(--letterspacing-body-2xl);
}

.c-content-body--body-xl {
  font-size: var(--font-size-body-xl);
  line-height: var(--lineheight-body-xl);
  letter-spacing: var(--letterspacing-body-xl);
}

.c-content-body--body-lg {
  font-size: var(--font-size-body-lg);
  line-height: var(--lineheight-body-lg);
  letter-spacing: var(--letterspacing-body-lg);
}

.c-content-body--body-base {
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  letter-spacing: var(--letterspacing-body-base);
}

.c-content-body--body-sm {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
}

.c-content-body--body-xs {
  font-size: var(--font-size-body-xs);
  line-height: var(--lineheight-body-xs);
  letter-spacing: var(--letterspacing-body-xs);
}

// --- Weight -----------------------------------------------------------------

.c-content-body--weight-subtle {
  font-weight: var(--font-weight-light);
}

.c-content-body--weight-base {
  font-weight: var(--font-weight-regular);
}

.c-content-body--weight-prominent {
  font-weight: var(--font-weight-medium);
}

.c-content-body--weight-emphasis {
  font-weight: var(--font-weight-semibold);
}

.c-content-body--weight-strong {
  font-weight: var(--font-weight-bold);
}
`})))()}var gn;function _n(){return(_n=t((()=>{gn=`/**
 * Patterns/Content list — core (.c-content-list).
 * Figma: Web-ODS Shared Library Pattern / ContentList 3483:3503.
 *
 * Axes → BEM:
 *   listType → .c-content-list--unordered | --ordered | --nested
 *   marker   → .c-content-list--marker-bullet | --marker-icon
 *   surfaced → .c-content-list--surfaced
 */

.c-content-list {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-block: 0;
  margin-inline: 0;
  padding-block: 0;
  padding-inline: 0;
  inline-size: 100%;
  max-inline-size: 100%;
  list-style: none;
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-regular);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
  color: var(--color-text-primary);
}

.c-content-list--surfaced {
  padding-block: var(--space-7);
  padding-inline: var(--space-7);
  background-color: var(--color-bg-subtle);
  border-radius: var(--border-radius-l);
}

.c-content-list__item {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--space-3);
  margin-block: 0;
  margin-inline: 0;
  padding-block: 0;
  padding-inline: 0;
}

.c-content-list__marker {
  flex-shrink: 0;
  box-sizing: border-box;
}

.c-content-list__marker--text {
  min-inline-size: 1em;
  color: var(--color-text-primary);
}

.c-content-list__marker--icon {
  inline-size: 20px;
  block-size: 20px;
  color: var(--color-text-primary);
}

.c-content-list__body {
  flex: 1 1 0;
  min-inline-size: 0;
  overflow-wrap: break-word;
}

.c-content-list__child {
  flex: 1 0 100%;
  margin-block-start: 0;
  padding-inline-start: var(--space-7);
}

.c-content-list__item--switch,
.c-content-list__item--checkbox,
.c-content-list__item--radio {
  align-items: center;
}

.c-content-list__item--switch .c-switch,
.c-content-list__item--checkbox .c-checkbox,
.c-content-list__item--radio .c-radio {
  flex: 1 1 auto;
  min-inline-size: 0;
}
`})))()}var vn;function yn(){return(yn=t((()=>{vn=`/**
 * Molecules/Content title — core (.c-content-title).
 * Figma: Web-ODS Shared Library 3483:3436 / canvas 3598:7174 / Spec 3637:48.
 *
 * Axes → BEM:
 *   style  → .c-content-title--h0 … --h7
 *   weight → .c-content-title--weight-subtle | --weight-base |
 *            --weight-prominent | --weight-emphasis | --weight-strong
 *
 * Default Weight = emphasis (SemiBold) per Spec Frame.
 */

.c-content-title {
  box-sizing: border-box;
  margin-block: 0;
  margin-inline: 0;
  inline-size: 100%;
  max-inline-size: 100%;
  font-family: var(--font-family-primary);
  color: var(--color-text-primary);
  overflow-wrap: break-word;
}

// --- Style (size / line-height / letter-spacing) -----------------------------

.c-content-title--h0 {
  font-size: var(--font-size-h0);
  line-height: var(--lineheight-h0);
  letter-spacing: var(--letterspacing-h0);
}

.c-content-title--h1 {
  font-size: var(--font-size-h1);
  line-height: var(--lineheight-h1);
  letter-spacing: var(--letterspacing-h1);
}

.c-content-title--h2 {
  font-size: var(--font-size-h2);
  line-height: var(--lineheight-h2);
  letter-spacing: var(--letterspacing-h2);
}

.c-content-title--h3 {
  font-size: var(--font-size-h3);
  line-height: var(--lineheight-h3);
  letter-spacing: var(--letterspacing-h3);
}

.c-content-title--h4 {
  font-size: var(--font-size-h4);
  line-height: var(--lineheight-h4);
  letter-spacing: var(--letterspacing-h4);
}

.c-content-title--h5 {
  font-size: var(--font-size-h5);
  line-height: var(--lineheight-h5);
  letter-spacing: var(--letterspacing-h5);
}

.c-content-title--h6 {
  font-size: var(--font-size-h6);
  line-height: var(--lineheight-h6);
  letter-spacing: var(--letterspacing-h6);
}

.c-content-title--h7 {
  font-size: var(--font-size-h7);
  line-height: var(--lineheight-h7);
  letter-spacing: var(--letterspacing-h7);
}

// --- Weight -----------------------------------------------------------------

.c-content-title--weight-subtle {
  font-weight: var(--font-weight-light);
}

.c-content-title--weight-base {
  font-weight: var(--font-weight-regular);
}

.c-content-title--weight-prominent {
  font-weight: var(--font-weight-medium);
}

.c-content-title--weight-emphasis {
  font-weight: var(--font-weight-semibold);
}

.c-content-title--weight-strong {
  font-weight: var(--font-weight-bold);
}
`})))()}var $;function bn(){return(bn=t((()=>{$=`/**
 * Molecules/Discount label — core (.c-discount-label).
 * Figma: Web-ODS Shared Library 1408:443 / Spec 3024:48.
 *
 * Fill × Strength:
 *   solid + base → 100% surface
 *   transparent + 30|50|80 → color-mix with transparent
 *   tint + 30|50|80 → color-mix with --color-bg-default (tinted wash)
 */

.c-discount-label {
  --c-discount-label-bg: var(--color-bg-default);
  --c-discount-label-content: var(--color-text-primary);
  --c-discount-label-mix: 100%;
  --c-discount-label-mix-with: transparent;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  inline-size: fit-content;
  box-sizing: border-box;
  padding-block: var(--space-1);
  padding-inline: var(--space-3);
  border-radius: var(--border-radius-xl);
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-label);
  line-height: var(--lineheight-label);
  letter-spacing: var(--letterspacing-label);
  background-color: color-mix(
    in srgb,
    var(--c-discount-label-bg) var(--c-discount-label-mix),
    var(--c-discount-label-mix-with)
  );
  color: var(--c-discount-label-content);
}

.c-discount-label__text {
  display: inline-block;
}

.c-discount-label__icon {
  display: inline-flex;
  flex-shrink: 0;
}

/* Fill */
.c-discount-label--fill-solid {
  --c-discount-label-mix-with: transparent;
}

.c-discount-label--fill-transparent {
  --c-discount-label-mix-with: transparent;
}

.c-discount-label--fill-tint {
  --c-discount-label-mix-with: var(--color-bg-default);
}

/* Strength */
.c-discount-label--strength-base {
  --c-discount-label-mix: 100%;
}

.c-discount-label--strength-30 {
  --c-discount-label-mix: 30%;
}

.c-discount-label--strength-50 {
  --c-discount-label-mix: 50%;
}

.c-discount-label--strength-80 {
  --c-discount-label-mix: 80%;
}

/* Background paint pairs */
.c-discount-label--primary {
  --c-discount-label-bg: var(--color-bg-default);
  --c-discount-label-content: var(--color-text-primary);
}

.c-discount-label--secondary {
  --c-discount-label-bg: var(--color-bg-subtle);
  --c-discount-label-content: var(--color-text-primary);
}

.c-discount-label--brand {
  --c-discount-label-bg: var(--color-bg-brand);
  --c-discount-label-content: var(--color-text-inverse);
}

.c-discount-label--brand-soft {
  --c-discount-label-bg: var(--color-bg-brand-soft);
  --c-discount-label-content: var(--color-text-primary);
}

.c-discount-label--accent {
  --c-discount-label-bg: var(--color-bg-accent);
  --c-discount-label-content: var(--color-text-primary);
}

.c-discount-label--alpha {
  --c-discount-label-bg: var(--color-bg-alpha);
  --c-discount-label-content: var(--color-text-primary);
}

.c-discount-label--beta {
  --c-discount-label-bg: var(--color-bg-beta);
  --c-discount-label-content: var(--color-text-primary);
}

.c-discount-label--gamma {
  --c-discount-label-bg: var(--color-bg-gamma);
  --c-discount-label-content: var(--color-text-primary);
}

.c-discount-label--delta {
  --c-discount-label-bg: var(--color-bg-delta);
  --c-discount-label-content: var(--color-text-primary);
}

.c-discount-label--inverse-primary {
  --c-discount-label-bg: var(--color-bg-inverse-strong);
  --c-discount-label-content: var(--color-text-inverse);
}

.c-discount-label--inverse-secondary {
  --c-discount-label-bg: var(--color-bg-inverse);
  --c-discount-label-content: var(--color-text-inverse);
}

.c-discount-label--success {
  --c-discount-label-bg: var(--color-signal-success);
  --c-discount-label-content: var(--color-text-inverse);
}

.c-discount-label--size-small {
  /* Figma Size=Small — geometry locked to space-1 / space-3 + label type */
}
`})))()}var xn;function Sn(){return(Sn=t((()=>{xn=`/**
 * Molecules/Divider — core (.c-divider).
 * Figma: Web-ODS Shared Library 539:28432 / sets 1344:2031 · 1344:2052 · 1344:2073.
 *
 * Size → border-width (Figma 1–4 px):
 *   xs → --border-width-xs (1)
 *   s  → --border-width-s (2)
 *   m  → 3px literal (no contract step)
 *   l  → --border-width-m (4) — not --border-width-l (6)
 */

.c-divider {
  --c-divider-rule-color: var(--color-border-strong);
  --c-divider-rule-width: var(--border-width-s);
  --c-divider-label-color: var(--color-text-secondary);

  box-sizing: border-box;
  border: 0 solid var(--c-divider-rule-color);
}

.c-divider--inverse {
  --c-divider-rule-color: var(--color-border-inverse);
  --c-divider-label-color: var(--color-text-inverse);
}

// --- Size -------------------------------------------------------------------

.c-divider--xs {
  --c-divider-rule-width: var(--border-width-xs);
}

.c-divider--s {
  --c-divider-rule-width: var(--border-width-s);
}

// Figma Size=m is 3 px; contract jumps 2 → 4 (--border-width-s → --border-width-m).
.c-divider--m {
  --c-divider-rule-width: 3px;
}

.c-divider--l {
  --c-divider-rule-width: var(--border-width-m);
}

// --- Layout: horizontal -----------------------------------------------------

.c-divider--horizontal {
  display: block;
  inline-size: 100%;
  block-size: var(--c-divider-rule-width);
  border-block-start: var(--c-divider-rule-width) solid var(--c-divider-rule-color);
}

// --- Layout: vertical -------------------------------------------------------

.c-divider--vertical {
  display: inline-block;
  inline-size: var(--c-divider-rule-width);
  block-size: 100%;
  border-inline-start: var(--c-divider-rule-width) solid var(--c-divider-rule-color);
}

// --- Layout: label ----------------------------------------------------------

.c-divider--label {
  display: flex;
  align-items: center;
  inline-size: 100%;
  gap: var(--space-3);
  font-family: var(--font-family-primary);
  color: var(--c-divider-label-color);
}

.c-divider__rule {
  flex: 1 1 0;
  block-size: var(--c-divider-rule-width);
  border-block-start: var(--c-divider-rule-width) solid var(--c-divider-rule-color);
}

.c-divider__label {
  flex: 0 0 auto;
  font-family: var(--font-family-primary);
  color: var(--c-divider-label-color);
  padding-inline: 0;
  text-align: center;
  white-space: nowrap;
}

// --- Typography (label only) ------------------------------------------------

.c-divider--body-sm-regular .c-divider__label {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
  font-weight: var(--font-weight-regular);
}

.c-divider--body-sm-bold .c-divider__label {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
  font-weight: var(--font-weight-bold);
}

.c-divider--body-base-regular .c-divider__label {
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  letter-spacing: var(--letterspacing-body-base);
  font-weight: var(--font-weight-regular);
}

.c-divider--body-base-semibold .c-divider__label {
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  letter-spacing: var(--letterspacing-body-base);
  font-weight: var(--font-weight-semibold);
}

.c-divider--body-lg-regular .c-divider__label {
  font-size: var(--font-size-body-lg);
  line-height: var(--lineheight-body-lg);
  letter-spacing: var(--letterspacing-body-lg);
  font-weight: var(--font-weight-regular);
}

.c-divider--body-lg-bold .c-divider__label {
  font-size: var(--font-size-body-lg);
  line-height: var(--lineheight-body-lg);
  letter-spacing: var(--letterspacing-body-lg);
  font-weight: var(--font-weight-bold);
}

.c-divider--h6-medium .c-divider__label {
  font-size: var(--font-size-h6);
  line-height: var(--lineheight-h6);
  letter-spacing: var(--letterspacing-h6);
  font-weight: var(--font-weight-medium);
}

.c-divider--h5-bold .c-divider__label {
  font-size: var(--font-size-h5);
  line-height: var(--lineheight-h5);
  letter-spacing: var(--letterspacing-h5);
  font-weight: var(--font-weight-bold);
}
`})))()}var Cn;function wn(){return(wn=t((()=>{Cn=`/**
 * Icon — mask-image + currentColor primitive.
 *
 * Mirrors the canonical Icon mask wrapper on Web-ODS Shared Library
 * (\`984:863\` / sticker \`984:2871\`). The SVG is used as
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
`})))()}var Tn;function En(){return(En=t((()=>{Tn=`/**
 * Image Wrapper — core molecule (.c-image-wrapper).
 * Figma Web-ODS Shared Library page 5428:53699 / Spec 5653:1197.
 *
 * Ratio pins viewport aspect-ratio; Fit maps to object-fit on the image.
 * Default demo width matches sticker cell (220px); consumers override width.
 */

.c-image-wrapper {
  position: relative;
  display: block;
  box-sizing: border-box;
  overflow: clip;
  background-color: transparent;
  border-radius: var(--border-radius-0, 0);
  inline-size: var(--image-wrapper-width, 220px);
  max-inline-size: 100%;
  block-size: auto;
}

.c-image-wrapper--ratio-2-1 { aspect-ratio: 2 / 1; }
.c-image-wrapper--ratio-16-9 { aspect-ratio: 16 / 9; }
.c-image-wrapper--ratio-4-3 { aspect-ratio: 4 / 3; }
.c-image-wrapper--ratio-1-1 { aspect-ratio: 1 / 1; }
.c-image-wrapper--ratio-3-4 { aspect-ratio: 3 / 4; }
.c-image-wrapper--ratio-landscape { aspect-ratio: 3 / 2; }
.c-image-wrapper--ratio-portrait { aspect-ratio: 2 / 3; }
.c-image-wrapper--ratio-1-2 { aspect-ratio: 1 / 2; }
.c-image-wrapper--ratio-9-16 { aspect-ratio: 9 / 16; }

.c-image-wrapper__image {
  position: absolute;
  inset: 0;
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-position: center;
}

.c-image-wrapper--fit-contain .c-image-wrapper__image {
  object-fit: contain;
}

.c-image-wrapper--fit-cover .c-image-wrapper__image {
  object-fit: cover;
}

.c-image-wrapper__placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--color-disabled-border, #b3b3b3);
  padding: var(--space-0, 0);
}

.c-image-wrapper__placeholder-label {
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-regular, 400);
  font-size: var(--font-size-label, 12px);
  line-height: var(--lineheight-label, 16px);
  letter-spacing: var(--letterspacing-label, 0.24px);
  color: var(--color-text-inverse, #fff);
  text-align: center;
  word-break: break-word;
}
`})))()}var Dn;function On(){return(On=t((()=>{Dn=`/**
 * Logo Wrapper — core molecule (.c-logo-wrapper).
 * Figma Web-ODS Shared Library page 3768:2718 / Spec 3846:98.
 *
 * LockUp pins a fixed aspect ratio; surface is transparent; overflow clipped.
 * Default block-size matches the sticker board (88px); consumers override
 * height via CSS on the root.
 */

.c-logo-wrapper {
  position: relative;
  display: block;
  box-sizing: border-box;
  overflow: clip;
  background-color: transparent;
  border-radius: var(--border-radius-0, 0);
  block-size: var(--logo-wrapper-height, 88px);
  inline-size: auto;
  max-inline-size: 100%;
}

.c-logo-wrapper--horizontal {
  aspect-ratio: 1040 / 237;
}

.c-logo-wrapper--stacked {
  aspect-ratio: 265 / 237;
}

.c-logo-wrapper--checkmark {
  aspect-ratio: 238 / 237;
}

.c-logo-wrapper__image {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: contain;
  object-position: center;
}

.c-logo-wrapper__placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--color-disabled-border, #b3b3b3);
  padding: var(--space-0, 0);
}

.c-logo-wrapper__placeholder-label {
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-regular, 400);
  font-size: var(--font-size-label, 12px);
  line-height: var(--lineheight-label, 16px);
  letter-spacing: var(--letterspacing-label, 0.24px);
  color: var(--color-text-inverse, #fff);
  text-align: center;
  word-break: break-word;
}
`})))()}var kn;function An(){return(An=t((()=>{kn=`/**
 * Blocks/Lower footer — BEM root .c-lower-footer
 * Figma: page 3598:2174 / set 2498:2022 / Spec 4278:466
 *
 * Theme → .c-lower-footer--theme-light | --theme-dark
 * Device → CSS responsive (desktop wrap row vs mobile 2-up columns)
 */

.c-lower-footer {
  --c-lower-footer-logo-height: 38px;
  --c-lower-footer-gap: var(--space-8);
  --c-lower-footer-text: var(--color-text-secondary);
  --c-lower-footer-bg: transparent;

  box-sizing: border-box;
  display: block;
  inline-size: 100%;
  background-color: var(--c-lower-footer-bg);
  color: var(--c-lower-footer-text);
  font-family: var(--font-family-primary);
}

.c-lower-footer--theme-light {
  --c-lower-footer-text: var(--color-text-secondary);
  --c-lower-footer-bg: transparent;
}

.c-lower-footer--theme-dark {
  --c-lower-footer-text: var(--color-text-inverse);
  --c-lower-footer-bg: var(--color-bg-inverse);
}

.c-lower-footer__inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--c-lower-footer-gap);
  inline-size: 100%;
}

.c-lower-footer__divider {
  inline-size: 100%;
  opacity: var(--opacity-50, 50%);
}

.c-lower-footer__lockup {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4);
  inline-size: 100%;
}

.c-lower-footer__logo.c-logo-wrapper,
.c-lower-footer .c-lower-footer__logo {
  --logo-wrapper-height: var(--c-lower-footer-logo-height);
  flex-shrink: 0;
}

.c-lower-footer__statement.c-content-body,
.c-lower-footer__copyright.c-content-body,
.c-lower-footer .c-lower-footer__statement,
.c-lower-footer .c-lower-footer__copyright {
  color: var(--c-lower-footer-text);
}

.c-lower-footer__statement {
  flex: 1 1 12rem;
  min-inline-size: 0;
}

.c-lower-footer__copyright {
  margin: 0;
}

.c-lower-footer__nav {
  inline-size: 100%;
}

.c-lower-footer__links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-0);
  margin: 0;
  padding: 0;
  list-style: none;
}

.c-lower-footer__links .c-menu-list {
  min-inline-size: 0;
}

.c-lower-footer__links .c-menu-list__control {
  color: var(--c-lower-footer-text);
}

.c-lower-footer__links .c-menu-list--right-border::after {
  display: none;
}

@media (min-width: 768px) {
  .c-lower-footer {
    --c-lower-footer-logo-height: 72px;
  }

  .c-lower-footer__lockup {
    flex-wrap: nowrap;
    gap: var(--space-7);
  }

  .c-lower-footer__statement {
    flex: 1 1 auto;
  }

  .c-lower-footer__links {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-2) var(--space-0);
    grid-template-columns: none;
  }

  .c-lower-footer__links .c-menu-list--right-border::after {
    display: block;
    background-color: var(--color-border-strong);
  }
}
`})))()}var jn;function Mn(){return(Mn=t((()=>{jn=`/**
 * Media — core molecule (.c-media).
 * Figma Web-ODS Shared Library page 3412:17329 / Spec 3443:11387.
 *
 * Fixed 16:9 surface; Type swaps img / video / iframe; Width is parent-relative.
 */

.c-media {
  position: relative;
  display: block;
  box-sizing: border-box;
  overflow: clip;
  aspect-ratio: 16 / 9;
  background-color: var(--color-bg-subtle, #fafafc);
  border-radius: var(--border-radius-l, 8px);
  inline-size: 100%;
  max-inline-size: 100%;
}

.c-media--width-full {
  inline-size: 100%;
}

.c-media--width-half {
  inline-size: 100%;

  @media (min-width: 768px) {
    inline-size: 50%;
  }
}

.c-media__media {
  position: absolute;
  inset: 0;
  display: block;
  inline-size: 100%;
  block-size: 100%;
  border: 0;
  object-position: center;
}

.c-media--fit-cover .c-media__media { object-fit: cover; }
.c-media--fit-contain .c-media__media { object-fit: contain; }
.c-media--fit-fill .c-media__media { object-fit: fill; }
.c-media--fit-none .c-media__media { object-fit: none; }
.c-media--fit-scale-down .c-media__media { object-fit: scale-down; }

/* iframes ignore object-fit; keep absolute fill */
.c-media--type-youtube .c-media__media {
  object-fit: unset;
}

.c-media__placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.c-media__placeholder-glyph {
  display: block;
  inline-size: 18%;
  max-inline-size: 115px;
  block-size: auto;
}
`})))()}var Nn;function Pn(){return(Pn=t((()=>{Nn=`/**
 * Patterns/Menu block — core (.c-menu-block).
 * Figma: MenuBlock 1396:4886 / Spec 4647:135.
 *
 * Type → --simple | --with-caption
 * Size → --size-large | --size-small
 * Chrome → --shadow | --keyline
 */

.c-menu-block {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  min-inline-size: 144px;
  max-inline-size: 100%;
  padding-block: var(--space-3);
  padding-inline: 0;
  background-color: var(--color-bg-default);
  border-radius: var(--border-radius-l);
  color: var(--color-text-primary);
}

.c-menu-block--with-caption {
  min-inline-size: 228px;
}

.c-menu-block--shadow {
  box-shadow: var(--shadow-menu-block);
}

.c-menu-block--keyline {
  border: var(--border-width-xs) solid var(--color-border-subtle);
}

.c-menu-block__items {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  margin-block: 0;
  margin-inline: 0;
  padding-block: 0;
  padding-inline: 0;
  list-style: none;
  inline-size: 100%;
}

.c-menu-block--popup {
  z-index: 20;
}

.c-menu-block--popup[hidden] {
  display: none;
}

/* With-caption: first Caption row gets Spec padding (space-4 inline already
   from edge-pad; reinforce block-start). */
.c-menu-block--with-caption .c-menu-list--caption:first-child .c-menu-list__caption {
  padding-block-start: var(--space-6);
  padding-block-end: var(--space-3);
}
`})))()}var Fn;function In(){return(In=t((()=>{Fn=`/**
 * Molecules/Menu list — core (.c-menu-list).
 * Figma: MenuList 1396:5517 / Spec 4646:265.
 *
 * Type → --row | --divider | --caption
 * Size → --size-large (40px) | --size-small (38px)
 * Hover → :hover on .c-menu-list__control (Figma Hover axis is design-only)
 * Selected → .is-selected
 */

.c-menu-list {
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
  margin-block: 0;
  margin-inline: 0;
  padding-block: 0;
  padding-inline: 0;
  list-style: none;
  inline-size: 100%;
  position: relative;
  font-family: var(--font-family-primary);
  color: var(--color-text-primary);
}

.c-menu-list--size-large {
  min-block-size: 40px;
}

.c-menu-list--size-small {
  min-block-size: 38px;
}

.c-menu-list--edge-pad .c-menu-list__control,
.c-menu-list--edge-pad .c-menu-list__caption {
  padding-inline: var(--space-4);
}

.c-menu-list--divider-above::before {
  content: '';
  position: absolute;
  inset-block-start: 0;
  inset-inline: 0;
  border-block-start: var(--border-width-xs, 1px) solid var(--color-border-subtle);
}

.c-menu-list--right-border::after {
  content: '';
  position: absolute;
  inset-block: 0;
  inset-inline-end: 0;
  inline-size: var(--border-width-xs, 1px);
  background-color: var(--color-border-strong-alt);
}

/* —— Divider —— */
.c-menu-list--divider {
  min-block-size: auto;
  align-items: center;
  padding-block: var(--space-2);
  pointer-events: none;
}

.c-menu-list__rule {
  box-sizing: border-box;
  margin-block: 0;
  margin-inline: 0;
  border: 0;
  border-block-start: var(--border-width-xs, 1px) solid var(--color-border-subtle);
  inline-size: 100%;
}

/* —— Caption —— */
.c-menu-list--caption {
  pointer-events: none;
}

.c-menu-list__caption {
  display: flex;
  align-items: center;
  inline-size: 100%;
  padding-block: var(--space-3);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-semibold);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
  color: var(--color-neutral-60);
}

/* —— Row —— */
.c-menu-list__control {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  inline-size: 100%;
  min-block-size: inherit;
  margin: 0;
  padding-block: var(--space-3);
  padding-inline: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: start;
  text-decoration: none;
  cursor: pointer;
  appearance: none;
}

.c-menu-list__control:hover {
  background-color: var(--color-bg-subtle);
}

.c-menu-list__control:focus-visible {
  outline: var(--border-width-s, 2px) solid var(--color-border-focus);
  outline-offset: 2px;
}

.c-menu-list.is-selected .c-menu-list__control {
  background-color: var(--color-bg-muted);
}

.c-menu-list.is-disabled .c-menu-list__control,
.c-menu-list.is-disabled .c-menu-list__control:hover {
  color: var(--color-text-disabled);
  background-color: transparent;
  cursor: not-allowed;
}

.c-menu-list__label {
  flex: 1 1 auto;
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--font-size-body-base);
  font-weight: var(--font-weight-regular);
  line-height: var(--lineheight-body-base);
  letter-spacing: var(--letterspacing-body-base);
}

.c-menu-list--size-small .c-menu-list__label {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
}

.c-menu-list__icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
}

.c-menu-list--size-large .c-menu-list__icon {
  inline-size: 24px;
  block-size: 24px;
}

.c-menu-list--size-small .c-menu-list__icon {
  inline-size: 16px;
  block-size: 16px;
}

.c-menu-list__icon--loading {
  animation: c-menu-list-spin 0.8s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .c-menu-list__icon--loading {
    animation: none;
  }
}

@keyframes c-menu-list-spin {
  to {
    transform: rotate(360deg);
  }
}
`})))()}var Ln;function Rn(){return(Rn=t((()=>{Ln=`/**
 * Patterns/Modal — .c-modal
 * Figma: 1344:18518 / Overview 1359:21341.
 *
 * Size card widths: sm 320 / md 440 / lg 480.
 * Backdrop: --color-bg-primary at 70% opacity.
 * Card radius: --border-radius-dialog.
 * Card shadow: Spec 0 / 8px / 12px / 0.18 (component literal).
 */

.c-modal {
  box-sizing: border-box;
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-5);
}

.c-modal[hidden] {
  display: none;
}

.c-modal__backdrop {
  position: absolute;
  inset: 0;
  background-color: color-mix(in srgb, var(--color-bg-primary) 70%, transparent);
}

.c-modal__card {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  inline-size: 100%;
  max-inline-size: 440px;
  max-block-size: min(90dvh, 100%);
  padding: var(--space-7);
  background-color: var(--color-bg-default);
  border-radius: var(--border-radius-dialog);
  box-shadow: 0 8px 12px 0 rgb(0 0 0 / 18%);
  color: var(--color-text-primary);
}

.c-modal--sm .c-modal__card {
  max-inline-size: 320px;
}

.c-modal--md .c-modal__card {
  max-inline-size: 440px;
}

.c-modal--lg .c-modal__card {
  max-inline-size: 480px;
}

.c-modal__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  inline-size: 100%;
}

.c-modal__title {
  flex: 1 1 auto;
  margin: 0;
  font-family: var(--font-family-primary);
  font-size: var(--font-size-h6);
  line-height: var(--lineheight-h6);
  letter-spacing: var(--letterspacing-h6);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.c-modal__close {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  margin: 0;
  padding: var(--space-1);
  border: 0;
  border-radius: var(--border-radius-s);
  background: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
}

.c-modal__close:focus-visible {
  outline: var(--border-width-s) solid var(--color-border-focus);
  outline-offset: 2px;
}

.c-modal__body {
  inline-size: 100%;
}

.c-modal__body--scroll {
  overflow-y: auto;
  max-block-size: 240px;
}

.c-modal__description {
  margin: 0;
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  letter-spacing: var(--letterspacing-body-base);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-secondary);
}

.c-modal__media {
  inline-size: 100%;
  overflow: clip;
  border-radius: var(--border-radius-s);
}

.c-modal__media-placeholder {
  block-size: 160px;
  background-color: var(--color-bg-subtle);
}

.c-modal__media img,
.c-modal__media video {
  display: block;
  inline-size: 100%;
  block-size: auto;
}

.c-modal__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
  inline-size: 100%;
}

.c-modal--scrollable .c-modal__body--scroll {
  max-block-size: 280px;
}
`})))()}var zn;function Bn(){return(Bn=t((()=>{zn=`/**
 * Patterns/Pagination — .c-pagination
 * Figma: Nav 1332:52356 / Select 1332:52459 / Jump 1332:52580
 */

.c-pagination {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
  font-family: var(--font-family-primary);
  color: var(--color-text-primary);
}

.c-pagination__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.c-pagination__control {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 44px;
  block-size: 44px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: var(--border-radius-s);
  background: transparent;
  color: var(--color-text-primary);
  font-family: inherit;
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
}

.c-pagination__control:hover:not(:disabled) {
  background-color: var(--color-bg-subtle);
}

.c-pagination__control:focus-visible {
  outline: var(--border-width-s) solid var(--color-border-focus);
  outline-offset: 2px;
}

.c-pagination__control.is-current {
  background-color: var(--color-signal-info-subtle);
  color: var(--color-signal-info);
}

.c-pagination__control:disabled,
.c-pagination.is-disabled .c-pagination__control {
  opacity: 0.4;
  cursor: not-allowed;
}

.c-pagination__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 44px;
  block-size: 44px;
  font-weight: var(--font-weight-semibold);
}

.c-pagination__double-chevron {
  display: inline-flex;
  align-items: center;
  margin-inline: calc(var(--space-2) * -1);
}

.c-pagination__double-chevron .c-icon {
  margin-inline: -6px;
}

.c-pagination.is-error .c-pagination__list {
  outline: var(--border-width-xs) solid var(--color-signal-critical);
  outline-offset: 4px;
  border-radius: var(--border-radius-s);
}

.c-pagination__error {
  margin: 0;
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  color: var(--color-signal-critical);
}

/* Select */
.c-pagination--select {
  position: relative;
  min-inline-size: 200px;
}

.c-pagination__select-trigger {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  min-inline-size: 200px;
  min-block-size: 44px;
  padding-block: var(--space-3);
  padding-inline: var(--space-4);
  border: var(--border-width-xs) solid var(--color-border-subtle);
  border-radius: var(--border-radius-s);
  background-color: var(--color-bg-default);
  color: inherit;
  font: inherit;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
}

.c-pagination__select-trigger:focus-visible {
  outline: var(--border-width-s) solid var(--color-border-focus);
  outline-offset: 2px;
}

.c-pagination__select-menu {
  position: absolute;
  inset-block-start: calc(100% + var(--space-2));
  inset-inline-start: 0;
  z-index: 10;
  min-inline-size: 100%;
}

/* Jump */
.c-pagination__jump-label {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  font-weight: var(--font-weight-semibold);
}

.c-pagination__jump-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.c-pagination__jump-input {
  box-sizing: border-box;
  inline-size: 88px;
  min-block-size: 44px;
  padding-block: var(--space-3);
  padding-inline: var(--space-4);
  border: var(--border-width-xs) solid var(--color-border-subtle);
  border-radius: var(--border-radius-s);
  background-color: var(--color-bg-default);
  color: inherit;
  font: inherit;
}

.c-pagination__jump-input:focus-visible {
  outline: var(--border-width-s) solid var(--color-border-focus);
  outline-offset: 2px;
}

.c-pagination--size-small .c-pagination__jump-input,
.c-pagination--size-small .c-pagination__jump-submit {
  min-block-size: 36px;
}

.c-pagination.is-error .c-pagination__jump-input,
.c-pagination.is-error .c-pagination__select-trigger {
  border-color: var(--color-signal-critical);
}
`})))()}var Vn;function Hn(){return(Hn=t((()=>{Vn=`/**
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
`})))()}var Un;function Wn(){return(Wn=t((()=>{Un=`/**
 * Pricing — core molecule (.c-pricing).
 * Figma Web-ODS Shared Library page 4070:2426 / Spec 4313:48.
 *
 * Typography-only price triplet: currency + amount + optional period.
 */

.c-pricing {
  display: inline-flex;
  box-sizing: border-box;
  align-items: flex-end;
  gap: var(--space-2, 4px);
  padding: var(--space-0, 0);
  font-family: var(--font-family-primary);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.c-pricing--theme-inverse {
  color: var(--color-text-inverse);
  background-color: var(--color-bg-inverse);
}

.c-pricing--stack-period {
  flex-direction: column;
  align-items: flex-end;
}

.c-pricing__value {
  display: inline-flex;
  align-items: flex-end;
  gap: var(--space-1, 2px);
  overflow: clip;
}

.c-pricing__currency,
.c-pricing__amount,
.c-pricing__period {
  margin: 0;
  font-style: normal;
}

.c-pricing__currency,
.c-pricing__period {
  font-weight: var(--font-weight-regular, 400);
}

.c-pricing__amount {
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-semibold, 600);
}

/* Size L — amount H3, currency Body-2xl, period Body-sm, outer gap space-2 */
.c-pricing--size-l {
  gap: var(--space-2, 4px);
}

.c-pricing--size-l .c-pricing__amount {
  font-size: var(--font-size-h3);
  line-height: var(--lineheight-h3);
  letter-spacing: var(--letterspacing-h3);
}

.c-pricing--size-l .c-pricing__currency {
  font-size: var(--font-size-body-2xl);
  line-height: var(--lineheight-body-2xl);
  letter-spacing: var(--letterspacing-body-2xl);
  padding-block-end: var(--space-2, 4px);
}

.c-pricing--size-l .c-pricing__period {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
  padding-block-end: var(--space-2, 4px);
}

.c-pricing--size-l.c-pricing--stack-period .c-pricing__period {
  padding-block-end: 0;
}

/* Size M — amount H4, currency Body-xl */
.c-pricing--size-m {
  gap: var(--space-2, 4px);
}

.c-pricing--size-m .c-pricing__amount {
  font-size: var(--font-size-h4);
  line-height: var(--lineheight-h4);
  letter-spacing: var(--letterspacing-h4);
}

.c-pricing--size-m .c-pricing__currency {
  font-size: var(--font-size-body-xl);
  line-height: var(--lineheight-body-xl);
  letter-spacing: var(--letterspacing-body-xl);
  padding-block-end: var(--space-2, 4px);
}

.c-pricing--size-m .c-pricing__period {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
  padding-block-end: var(--space-2, 4px);
}

.c-pricing--size-m.c-pricing--stack-period .c-pricing__period {
  padding-block-end: 0;
}

/* Size S — amount H5, currency Body-base, outer gap space-1 */
.c-pricing--size-s {
  gap: var(--space-1, 2px);
}

.c-pricing--size-s .c-pricing__amount {
  font-size: var(--font-size-h5);
  line-height: var(--lineheight-h5);
  letter-spacing: var(--letterspacing-h5);
}

.c-pricing--size-s .c-pricing__currency {
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  letter-spacing: var(--letterspacing-body-base);
  padding-block-end: var(--space-1, 2px);
}

.c-pricing--size-s .c-pricing__period {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
  padding-block-end: var(--space-1, 2px);
}

.c-pricing--size-s.c-pricing--stack-period .c-pricing__period {
  padding-block-end: 0;
}

/* Size XS — amount H6, currency Body-sm */
.c-pricing--size-xs {
  gap: var(--space-1, 2px);
}

.c-pricing--size-xs .c-pricing__amount {
  font-size: var(--font-size-h6);
  line-height: var(--lineheight-h6);
  letter-spacing: var(--letterspacing-h6);
}

.c-pricing--size-xs .c-pricing__currency {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
  padding-block-end: var(--space-1, 2px);
}

.c-pricing--size-xs .c-pricing__period {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
  padding-block-end: var(--space-1, 2px);
}

.c-pricing--size-xs.c-pricing--stack-period .c-pricing__period {
  padding-block-end: 0;
}
`})))()}var Gn;function Kn(){return(Kn=t((()=>{Gn=`/**
 * Components/Progress indicator — single BEM root (.c-progress-indicator)
 * covering three layouts:
 *   - linear \`inline\` + \`stacked\` — mirror the Figma Linear master
 *     variant set on Web-ODS Shared Library \`1380:1255\` and the
 *     \`Progress indicator — Overview\` Spec Frame at \`1380:1478\`.
 *   - \`circular\` — mirrors the LifeLock-mode sticker sheet
 *     \`.Sticker Sheets/progress-indicator/LifeLock\` at \`615:80630\`
 *     (five discrete sizes: xs / sm / md / lg / xxl).
 *
 * Variant axes → BEM modifiers:
 *   layout → .c-progress-indicator--inline | --stacked | --circular
 *   theme  → .c-progress-indicator--light   | --dark
 *   size   → .c-progress-indicator--xs | --sm | --md | --lg | --xxl
 *            (circular only — linear layouts are fluid 100% wide)
 *   value  → inline \`--progress-indicator-value\` custom property
 *            (0..100; drives \`.c-progress-indicator__fill\` flex-basis on
 *            linear, and the SVG \`.c-progress-indicator__ring-fill\`'s
 *            \`stroke-dasharray\` on circular)
 *
 * Stateless — no \`:hover\` / \`:focus-visible\` / \`:active\` paints, no
 * \`is-*\` runtime classes, no JavaScript. The component reflects the
 * application's progress value to the user but does not accept input.
 *
 * Token surface (component-knobs only — public for consumers):
 *   --progress-indicator-track-height        : 2px (linear; LifeLock
 *                                               publishes no 2px primitive)
 *   --progress-indicator-radius               : 2px (linear; LifeLock's
 *                                               --border-radius-* ramp is
 *                                               role-keyed, no XS primitive)
 *   --progress-indicator-label-letter-spacing : 0.6px (linear; mirrors the
 *                                               Figma Tagline/Small
 *                                               letter-spacing without a
 *                                               Tagline scale in LifeLock
 *                                               typography)
 *   --progress-indicator-circular-size        : per-size diameter (set by
 *                                               .c-progress-indicator--* on
 *                                               circular; consumers may
 *                                               override inline for custom
 *                                               sizes)
 *   --progress-indicator-circular-stroke      : per-size stroke width
 *                                               (--border-width-default 2px
 *                                               for xs/sm/md/lg;
 *                                               --border-width-emphasis 4px
 *                                               for xxl)
 *
 * Logical properties (\`padding-inline\`, \`gap\`) keep the linear geometry
 * RTL-safe; the circular ring is naturally direction-neutral.
 *
 * Tokens consumed are documented in \`./spec.md\` § "Tokens consumed".
 */

:root {
  --progress-indicator-track-height: 2px;
  --progress-indicator-radius: 2px;
  --progress-indicator-label-letter-spacing: 0.6px;
}

// ============================================================================
// BLOCK — .c-progress-indicator
// ============================================================================

.c-progress-indicator {
  display: flex;
  inline-size: 100%;
  box-sizing: border-box;
  font-family: var(--font-family-primary);
}

// ============================================================================
// LINEAR ELEMENTS — label, track, fill, spacer
// ============================================================================

.c-progress-indicator__label {
  // Block-axis self-alignment is centred in the inline layout (label
  // sits next to the 2 px track and reads as part of the same row) and
  // start-aligned in the stacked layout (label sits above the track on
  // its own row). Applied via the modifier blocks below.
  display: inline-block;
  margin: 0;

  // Typography mirror — Figma uses Lexend Tagline/Small SemiBold
  // (14 / 16 / 0.6 px). LifeLock's Inter Tight ramp has no Tagline
  // scale, so the closest match is body-sm + a component-knob
  // letter-spacing. line-height drifts from 16 px to 22 px; documented
  // as a Designer Follow-Up in spec.md.
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--progress-indicator-label-letter-spacing);
  text-transform: uppercase;
  white-space: nowrap;
}

.c-progress-indicator__track {
  // The track is a horizontal flex row that hosts the fill (left) and
  // the spacer (right). The two children share the inline-axis space
  // proportionally — \`__fill\` claims \`var(--progress-indicator-value)\`
  // units (0..100), \`__spacer\` claims \`100 - <value>\` units. This
  // mirrors the Figma source verbatim (\`flex-[50_0_0]\` on both
  // children for a 50 % progress reading).
  display: flex;
  align-items: stretch;
  flex: 1 1 auto;
  inline-size: 100%;
  block-size: var(--progress-indicator-track-height);
  overflow: clip;
  border-radius: var(--progress-indicator-radius);
  background-color: var(--color-neutral-30);
}

.c-progress-indicator__fill {
  // Width is driven by the inline custom prop on the root —
  // flex-basis: <value> * 1%, no flex-grow / shrink, so the fill
  // paints its exact share of the track.
  flex: calc(var(--progress-indicator-value, 50)) 0 0;
  min-inline-size: 1px;
  block-size: 100%;
  border-radius: var(--progress-indicator-radius);
  background-color: var(--color-off-black);
}

.c-progress-indicator__spacer {
  // The spacer is the trailing chunk of the track that has not been
  // filled. It paints no surface of its own (the track's neutral-30
  // background shows through); it exists only to hold the remaining
  // flex share so the fill width math reads as \`value / 100\`.
  flex: calc(100 - var(--progress-indicator-value, 50)) 0 0;
  min-inline-size: 1px;
  block-size: 100%;
}

// ============================================================================
// LAYOUT — inline (label + track on one row)
// ============================================================================

.c-progress-indicator--inline {
  flex-flow: row wrap;
  align-items: center;
  gap: var(--space-4);
}

.c-progress-indicator--inline .c-progress-indicator__label {
  align-self: center;
  flex: 0 0 auto;
}

// ============================================================================
// LAYOUT — stacked (label above track)
// ============================================================================

.c-progress-indicator--stacked {
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-2);
}

.c-progress-indicator--stacked .c-progress-indicator__label {
  align-self: flex-start;
}

// ============================================================================
// THEME — light (default) + dark (applies to linear __label and circular __value)
// ============================================================================

.c-progress-indicator--light .c-progress-indicator__label,
.c-progress-indicator--light .c-progress-indicator__value {
  color: var(--color-text-primary);
}

.c-progress-indicator--dark .c-progress-indicator__label,
.c-progress-indicator--dark .c-progress-indicator__value {
  color: var(--color-text-inverse);
}

// ============================================================================
// LAYOUT — circular (SVG ring + optional inner value text)
// ============================================================================

/*
 * The circular layout paints a fixed-size square containing two
 * overlaid SVG circles (track + fill arc) and, when \`showLabel=true\`
 * and the size is large enough, an inner value text node positioned
 * at the centre.
 *
 * Geometry — driven by two component-knobs the per-size blocks set:
 *   --progress-indicator-circular-size   : diameter in CSS px
 *   --progress-indicator-circular-stroke : ring stroke in CSS px
 *
 * Sweep — the fill circle's \`pathLength="100"\` lets stroke-dasharray
 * read as a percent of the circumference, so the SCSS only needs to
 * pipe \`--progress-indicator-value\` straight through:
 *   stroke-dasharray: var(--progress-indicator-value) 100
 *
 * Direction — the \`<svg>\` itself is rotated -90° so the dash starts at
 * 12 o'clock and sweeps clockwise (matches the Figma reference).
 */

.c-progress-indicator--circular {
  // Override the parent block's \`display: flex; inline-size: 100%\`
  // because the circular layout is intrinsic-sized (the diameter
  // knob owns inline + block size). Children stack at the centre
  // of the square via absolute positioning, not flex.
  display: inline-block;
  position: relative;
  inline-size: var(--progress-indicator-circular-size, 48px);
  block-size: var(--progress-indicator-circular-size, 48px);

  // The five canonical stamps verbatim from the Figma sticker sheet.
  // Authors can override the two custom properties inline for custom
  // sizes — the SVG geometry scales with them.
  --progress-indicator-circular-size: 48px;

  // Stroke-width is expressed in viewBox user units (the SVG ships
  // viewBox="0 0 100 100"), NOT screen pixels — the per-size blocks
  // below set this to a value that renders to the target screen px
  // (\`2px\` for xs/sm/md/lg, \`4px\` for xxl) once the SVG is scaled to
  // the size knob. We can't use \`vector-effect: non-scaling-stroke\`
  // here because it suppresses \`pathLength="100"\` normalization on
  // the fill arc's \`stroke-dasharray\`, which is what makes the dash
  // sweep read as a percent of the circumference regardless of size.
  --progress-indicator-circular-stroke: 4.167; // md default — 2px @ 48px
}

.c-progress-indicator__ring {
  // The SVG fills the whole square. Rotating -90deg starts the dash
  // sweep at 12 o'clock; the fill arc grows clockwise.
  position: absolute;
  inset: 0;
  display: block;
  inline-size: 100%;
  block-size: 100%;
  transform: rotate(-90deg);

  // Trim the SVG bounding box to the visual ring; without \`overflow:
  // visible\` the stroke would clip at high stroke widths.
  overflow: visible;
}

.c-progress-indicator__ring-track,
.c-progress-indicator__ring-fill {
  fill: none;

  // \`--progress-indicator-circular-stroke\` is a unitless number in
  // viewBox user units (see the per-size blocks below). The SVG
  // viewBox is 100×100 so 1 user unit = (size / 100) screen px;
  // each per-size value is calibrated to render to 2 / 4 screen px.
  stroke-width: var(--progress-indicator-circular-stroke, 4.167);
}

.c-progress-indicator__ring-track {
  stroke: var(--color-neutral-30);
}

.c-progress-indicator__ring-fill {
  stroke: var(--color-off-black);
  stroke-linecap: butt;

  // \`var(--progress-indicator-value, 50)\` is a unit-less 0..100. The
  // companion \`100\` is the explicit pathLength so the dash array
  // reads as a percent of the circumference.
  stroke-dasharray: var(--progress-indicator-value, 50) 100;
}

.c-progress-indicator__value {
  // Centre the value text inside the ring. The container is \`inset:
  // 0\` so the flex centring rules apply to the full square.
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-semibold);
  text-align: center;
  pointer-events: none;
}

.c-progress-indicator__value-num {
  // Per-size override below.
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
}

.c-progress-indicator__value-unit {
  // The percent sign is a small superscript-ish unit. Per-size
  // override below; sizes that hide the unit set \`display: none\` on
  // this node.
  font-size: var(--font-size-body-xs);
  line-height: var(--lineheight-body-xs);
}

// ============================================================================
// SIZE — circular layout only (xs / sm / md / lg / xxl)
// ============================================================================

.c-progress-indicator--xs {
  --progress-indicator-circular-size: 16px;

  // 2 screen px target × (100 viewBox / 16 size) = 12.5 viewBox user units.
  --progress-indicator-circular-stroke: 12.5;
}

.c-progress-indicator--xs .c-progress-indicator__value {
  // The 16 px ring has no room for inner text — the Figma sticker
  // sheet only stamps the ring at this size. \`showLabel=true\` is
  // still respected at the prop level; the visible text just hides.
  display: none;
}

.c-progress-indicator--sm {
  --progress-indicator-circular-size: 24px;

  // 2 screen px target × (100 viewBox / 24 size) ≈ 8.333 viewBox user units.
  --progress-indicator-circular-stroke: 8.333;
}

.c-progress-indicator--sm .c-progress-indicator__value-num {
  font-size: var(--font-size-body-xs);
  line-height: var(--lineheight-body-xs);
}

.c-progress-indicator--sm .c-progress-indicator__value-unit {
  // Per the Figma sticker sheet — the 24 px ring only stamps the
  // digits, no \`%\` unit.
  display: none;
}

.c-progress-indicator--md {
  --progress-indicator-circular-size: 48px;

  // 2 screen px target × (100 viewBox / 48 size) ≈ 4.167 viewBox user units.
  --progress-indicator-circular-stroke: 4.167;
}

.c-progress-indicator--md .c-progress-indicator__value-num {
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
}

.c-progress-indicator--md .c-progress-indicator__value-unit {
  font-size: var(--font-size-body-xs);
  line-height: var(--lineheight-body-xs);
}

.c-progress-indicator--lg {
  --progress-indicator-circular-size: 96px;

  // 2 screen px target × (100 viewBox / 96 size) ≈ 2.083 viewBox user units.
  --progress-indicator-circular-stroke: 2.083;
}

.c-progress-indicator--lg .c-progress-indicator__value-num {
  font-size: var(--font-size-h6);
  line-height: var(--lineheight-h6);
}

.c-progress-indicator--lg .c-progress-indicator__value-unit {
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
}

.c-progress-indicator--xxl {
  --progress-indicator-circular-size: 256px;

  // 4 screen px target × (100 viewBox / 256 size) = 1.5625 viewBox user units
  // (--border-width-emphasis is 4px in screen px).
  --progress-indicator-circular-stroke: 1.5625;
}

.c-progress-indicator--xxl .c-progress-indicator__value-num {
  font-size: var(--font-size-h4);
  line-height: var(--lineheight-h4);
}

.c-progress-indicator--xxl .c-progress-indicator__value-unit {
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
}
`})))()}var qn;function Jn(){return(Jn=t((()=>{qn=`/**
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
`})))()}var Yn;function Xn(){return(Xn=t((()=>{Yn=`/**
 * Molecules/Rating — .c-rating
 * Figma: 2355:19638 / Spec 4630:2285
 *
 * Trustpilot types opt out of the icon mask pipeline for brand art;
 * here they recolour mask stars via --c-rating-trustpilot.
 */

.c-rating {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-text-primary);
  font-family: var(--font-family-primary);
}

.c-rating__stars {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}

.c-rating__star {
  display: inline-flex;
  flex: 0 0 auto;
  color: var(--color-text-primary);
}

/* Empty stars (non-zero ratings) use border-subtle per Figma caption. */
.c-rating__star--empty {
  color: var(--color-border-subtle);
}

/* Value=0: empty stars stay on content primary. */
.c-rating[data-value='0'] .c-rating__star--empty,
.c-rating[data-value='0.0'] .c-rating__star--empty {
  color: var(--color-text-primary);
}

.c-rating__score {
  font-size: var(--font-size-body-lg);
  line-height: var(--lineheight-body-lg);
  letter-spacing: var(--letterspacing-body-lg);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-primary);
  white-space: nowrap;
}

.c-rating--mobile .c-rating__score {
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  letter-spacing: var(--letterspacing-body-base);
}

.c-rating__leading,
.c-rating__trailing {
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-primary);
  white-space: nowrap;
}

.c-rating__count--static {
  font-size: var(--font-size-body-lg);
  line-height: var(--lineheight-body-lg);
  color: var(--color-text-accent, var(--color-signal-info));
  text-decoration: underline;
  white-space: nowrap;
}

.c-rating--mobile .c-rating__count--static {
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
}

/* Inline: score + single star */
.c-rating--inline {
  gap: var(--space-2);
}

/* Text-led */
.c-rating--text-led {
  gap: var(--space-2);
}

/* Trustpilot — multi-color brand row (iconCompositionOptOut) */
.c-rating--trustpilot .c-rating__star,
.c-rating--trustpilot-teaser .c-rating__star {
  color: var(--c-rating-trustpilot, #00b67a);
}

.c-rating--trustpilot .c-rating__star--empty,
.c-rating--trustpilot-teaser .c-rating__star--empty {
  color: color-mix(in srgb, var(--c-rating-trustpilot, #00b67a) 35%, transparent);
}

.c-rating--bg-dark {
  color: var(--color-text-inverse);
}

.c-rating--bg-dark .c-rating__score {
  color: var(--color-text-inverse);
}
`})))()}var Zn;function Qn(){return(Qn=t((()=>{Zn=`// Patterns/Inputs/Search box
// A single bordered :focus-within control wrapping a native
// <input type="search">. Two sizes (m = 32px, l = 40px). The search
// glyph + vertical separator lead the input (or trail it under
// \`--icon-last\`); the clear button shows once \`is-filled\`. All paints
// read from the LifeLock Layer 3c input tokens; all inline-axis sizing
// uses logical properties for RTL.

.c-search-box {
  --c-search-box-min-block: 32px;
  --c-search-box-radius: var(--border-radius-card);

  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-block-size: var(--c-search-box-min-block);
  padding-inline: var(--space-3);
  border: var(--border-width-hairline) solid var(--color-border-input-default);
  border-radius: var(--c-search-box-radius);
  background-color: var(--color-bg-input);
  inline-size: 100%;
  max-inline-size: 22rem;
  font-family: var(--font-family-primary);
}

.c-search-box--l {
  --c-search-box-min-block: 40px;
}

.c-search-box:hover {
  border-color: var(--color-border-input-hover);
}

.c-search-box:focus-within {
  border-color: var(--color-border-input-focus);
  box-shadow: 0 0 0 var(--space-1) var(--color-border-input-focus-glow);
}

// ── Search glyph + separator ─────────────────────────────────────────
.c-search-box__icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  color: var(--color-text-default);
}

.c-search-box__separator {
  flex: 0 0 auto;
  align-self: stretch;
  inline-size: var(--border-width-hairline);
  margin-block: var(--space-2);
  background-color: var(--color-border-input-divider);
}

// ── Native search input ──────────────────────────────────────────────
.c-search-box__input {
  flex: 1 1 auto;
  min-inline-size: 0;
  padding-block: var(--space-2);
  border: 0;
  background: transparent;
  color: var(--color-text-default);
  font-family: inherit;
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  text-align: start;
  appearance: none;
}

.c-search-box--l .c-search-box__input {
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
}

.c-search-box__input::placeholder {
  color: var(--color-text-placeholder);
}

.c-search-box__input:focus-visible {
  outline: none;
}

// Suppress the native UA search-cancel button — the styled clear button
// replaces it (and Firefox has none, so this keeps the affordance
// consistent cross-browser).
.c-search-box__input::-webkit-search-cancel-button,
.c-search-box__input::-webkit-search-decoration {
  appearance: none;
  display: none;
}

// ── Clear button ─────────────────────────────────────────────────────
.c-search-box__clear {
  display: none;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  // Figma clear / search Icon mask wrappers are 24×24 with no control pad
  // (e.g. \`1258:1389\`). Do not add \`--space-1\` here — that double-counts
  // with a 24 \`size=\` (or under-sizes a 20 \`size=\` vs the 24 mask).
  padding: 0;
  border: 0;
  border-radius: var(--border-radius-control);
  background: transparent;
  color: var(--color-text-default);
  cursor: pointer;
}

.c-search-box.is-filled .c-search-box__clear {
  display: inline-flex;
}

.c-search-box__clear:hover {
  color: var(--color-text-primary);
}

.c-search-box__clear:focus-visible {
  outline: var(--border-width-default) solid var(--color-border-input-focus);
  outline-offset: var(--space-1);
}

// ── Disabled ─────────────────────────────────────────────────────────
.c-search-box.is-disabled,
.c-search-box:has(.c-search-box__input:disabled) {
  border-color: var(--color-border-input-disabled);
  background-color: var(--color-bg-input-disabled);
}

.c-search-box.is-disabled .c-search-box__icon,
.c-search-box:has(.c-search-box__input:disabled) .c-search-box__input,
.c-search-box:has(.c-search-box__input:disabled) .c-search-box__icon {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.c-search-box__clear:disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}
`})))()}var $n;function er(){return(er=t((()=>{$n=`/**
 * Patterns/Sheet — .c-sheet (left / right / bottom drawer)
 * Figma: 539:28430 / Spec 4522:67
 *
 * Side sizes: compact 280 / medium 360 / large 480.
 * Bottom max widths: compact 360 / medium 600 / large 1200.
 * Modal backdrop: --color-bg-inverse at 75%.
 * Card radius: --border-radius-l on the open edge(s).
 * Shadow: 0 8px 24px / 18%.
 */

.c-sheet {
  box-sizing: border-box;
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
}

.c-sheet[hidden] {
  display: none;
}

.c-sheet__backdrop {
  position: absolute;
  inset: 0;
  background-color: color-mix(
    in srgb,
    var(--color-bg-inverse) 75%,
    transparent
  );
}

.c-sheet__card {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding: var(--space-7);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  box-shadow: 0 8px 24px 0 rgb(0 0 0 / 18%);
  max-block-size: 100%;
}

/* —— Layout: Left / Right —— */

.c-sheet--left {
  justify-content: flex-start;
  align-items: stretch;
}

.c-sheet--right {
  justify-content: flex-end;
  align-items: stretch;
}

.c-sheet--left .c-sheet__card,
.c-sheet--right .c-sheet__card {
  block-size: 100%;
  inline-size: 280px;
  max-inline-size: min(100%, 480px);
}

.c-sheet--left.c-sheet--compact .c-sheet__card,
.c-sheet--right.c-sheet--compact .c-sheet__card {
  inline-size: 280px;
}

.c-sheet--left.c-sheet--medium .c-sheet__card,
.c-sheet--right.c-sheet--medium .c-sheet__card {
  inline-size: 360px;
}

.c-sheet--left.c-sheet--large .c-sheet__card,
.c-sheet--right.c-sheet--large .c-sheet__card {
  inline-size: 480px;
}

.c-sheet--left .c-sheet__card {
  border-start-end-radius: var(--border-radius-l);
  border-end-end-radius: var(--border-radius-l);
}

.c-sheet--right .c-sheet__card {
  border-start-start-radius: var(--border-radius-l);
  border-end-start-radius: var(--border-radius-l);
}

/* —— Layout: Bottom (Drawer) —— */

.c-sheet--bottom {
  justify-content: center;
  align-items: flex-end;
}

.c-sheet--bottom .c-sheet__card {
  inline-size: 100%;
  max-inline-size: 360px;
  max-block-size: min(90dvh, 640px);
  border-start-start-radius: var(--border-radius-l);
  border-start-end-radius: var(--border-radius-l);
}

.c-sheet--bottom.c-sheet--medium .c-sheet__card {
  max-inline-size: 600px;
  max-block-size: min(90dvh, 600px);
}

.c-sheet--bottom.c-sheet--large .c-sheet__card {
  max-inline-size: 1200px;
  max-block-size: min(90dvh, 700px);
}

/* —— Non-modal: no full-viewport trap chrome —— */

.c-sheet--non-modal {
  pointer-events: none;
}

.c-sheet--non-modal .c-sheet__card {
  pointer-events: auto;
}

.c-sheet__drag-handle-wrap {
  display: flex;
  justify-content: center;
  inline-size: 100%;
  padding-block: var(--space-1) 0;
}

.c-sheet__drag-handle {
  display: block;
  inline-size: 40px;
  block-size: 4px;
  border-radius: var(--border-radius-pill);
  background-color: var(--color-border-subtle);
}

.c-sheet__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  inline-size: 100%;
  flex: 0 0 auto;
}

.c-sheet__title {
  flex: 1 1 auto;
  margin: 0;
  font-family: var(--font-family-primary);
  font-size: var(--font-size-h6);
  line-height: var(--lineheight-h6);
  letter-spacing: var(--letterspacing-h6);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.c-sheet__close {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  margin: 0;
  padding: var(--space-2);
  border: 0;
  border-radius: var(--border-radius-s);
  background: transparent;
  color: var(--color-text-accent);
  cursor: pointer;
}

.c-sheet__close:focus-visible {
  outline: var(--border-width-s) solid var(--color-border-focus);
  outline-offset: 2px;
}

.c-sheet__body {
  flex: 1 1 auto;
  inline-size: 100%;
  overflow-y: auto;
  min-block-size: 0;
}

.c-sheet__description {
  margin: 0;
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  letter-spacing: var(--letterspacing-body-base);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-secondary);
}

.c-sheet__footer {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
  inline-size: 100%;
}

.c-sheet--buttons-stacked .c-sheet__footer {
  flex-direction: column-reverse;
  align-items: stretch;
}

.c-sheet--buttons-stacked .c-sheet__action {
  inline-size: 100%;
}

.c-sheet__supporting {
  margin: 0;
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  color: var(--color-text-secondary);
  text-align: center;
}
`})))()}var tr;function nr(){return(nr=t((()=>{tr=`/**
 * Components/Slider — continuous + discrete sliders for single-value
 * and range selection.
 *
 * Mirrors the canonical Web-ODS Shared Library \`DS · Slider\`
 * component at \`1336:2939\` published on the Sliders 🟢 canvas
 * (\`539:28421\`). Twenty Figma variants across \`Variant × Selection ×
 * State\`; this stylesheet expresses them with one \`.c-slider\` BEM
 * root, modifiers per persistent axis, and CSS pseudo-classes on the
 * thumb element for transient states.
 *
 * All inline-axis sizing uses logical properties (\`padding-inline\`,
 * \`inset-inline-start\`, etc.) so the component flips cleanly under
 * \`dir="rtl"\`.
 *
 * Tokens consumed are listed in \`./spec.md\` § "Tokens consumed".
 */

.c-slider {
  /* Per-instance dials so the .scss expresses one paint surface and
     the per-state / per-variant blocks below only rebind the parts
     that change. */
  --c-slider-track-block: var(--space-2);          /* 4px */
  --c-slider-thumb-size:  var(--space-6);          /* 20px */
  --c-slider-thumb-radius: var(--border-radius-pill);
  --c-slider-track-radius: var(--border-radius-pill);
  --c-slider-pad-block:   var(--space-3);          /* 8px */
  --c-slider-pad-inline:  var(--space-3);          /* 8px */
  --c-slider-value-area-block: var(--space-6);     /* 20px → resolves to ≥20px so 24px label line fits */
  --c-slider-gap:         var(--space-2);          /* 4px between value-label and track-area */

  --c-slider-track-color:  var(--color-border-subtle);
  --c-slider-fill-color:   var(--color-signal-info);
  --c-slider-thumb-color:  var(--button-primary-bg-default);
  --c-slider-focus-color:  var(--color-border-focus);
  --c-slider-text-color:   var(--color-text-primary);

  display: flex;
  flex-direction: column;
  inline-size: 100%;
  box-sizing: border-box;
  padding: var(--c-slider-pad-block) var(--c-slider-pad-inline);
  background-color: var(--color-bg-primary);
  font-family: var(--font-family-primary);
  gap: var(--c-slider-gap);
}

/* --- Value label area ----------------------------------------- */

.c-slider__value-label-area {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-2);
  block-size: var(--c-slider-value-area-block);
  color: var(--c-slider-text-color);
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  font-weight: var(--font-weight-semibold);
}

.c-slider__value-label,
.c-slider__value-label-separator {
  display: inline-block;
}

/* --- Track area (track + active fill + ticks + inputs + thumbs) -- */

.c-slider__track-area {
  position: relative;
  display: block;
  inline-size: 100%;
  block-size: var(--c-slider-thumb-size); /* container reserves enough room for the 20px thumb */
}

.c-slider__track {
  position: absolute;
  inset-inline: 0;
  inset-block-start: calc(
    (var(--c-slider-thumb-size) - var(--c-slider-track-block)) / 2
  );
  block-size: var(--c-slider-track-block);
  background-color: var(--c-slider-track-color);
  border-radius: var(--c-slider-track-radius);
  pointer-events: none;
}

.c-slider__active-fill {
  position: absolute;
  inset-inline: var(--slider-fill-start, 0%) calc(100% - var(--slider-fill-end, 100%));
  inset-block-start: calc(
    (var(--c-slider-thumb-size) - var(--c-slider-track-block)) / 2
  );
  block-size: var(--c-slider-track-block);
  background-color: var(--c-slider-fill-color);
  border-radius: var(--c-slider-track-radius);
  pointer-events: none;
}

/* --- Tick marks (discrete variant only) ------------------------ */

.c-slider__tick {
  position: absolute;

  /* Track is at top: (thumb-size - track-block)/2. Ticks straddle
     the track on either side — Figma authors a 2×6 mark; CSS
     paints a 2×6 rect centered on the track centerline. */
  inset-inline-start: var(--slider-tick-offset, 0%);
  inset-block-start: calc(
    (var(--c-slider-thumb-size) - 6px) / 2
  );
  inline-size: 2px;
  block-size: 6px;
  margin-inline-start: -1px;
  background-color: var(--c-slider-track-color);
  pointer-events: none;
}

/* --- Native range inputs --------------------------------------- */

/*
 * The visible thumb is a presentational <span>; the native
 * <input type="range"> is layered visually beneath it at
 * opacity: 0 with the full track-area's hit zone so pointer drags
 * resolve against the native control directly. This is the
 * canonical "accessible custom slider" pattern: keyboard,
 * screen-reader, and ARIA semantics come for free; CSS owns the
 * paint.
 */
.c-slider__input {
  position: absolute;
  inset-inline: 0;
  inset-block: 0;
  inline-size: 100%;
  block-size: var(--c-slider-thumb-size);
  margin: 0;
  padding: 0;
  background: transparent;
  appearance: none;
  opacity: 0;             /* visual cover comes from .c-slider__thumb */
  cursor: pointer;
  pointer-events: auto;
  z-index: 2;
}

.c-slider__input::-webkit-slider-thumb {
  appearance: none;
  inline-size: var(--c-slider-thumb-size);
  block-size: var(--c-slider-thumb-size);
  border-radius: var(--c-slider-thumb-radius);
  background: transparent;
  border: 0;
  cursor: pointer;
}

.c-slider__input::-moz-range-thumb {
  appearance: none;
  inline-size: var(--c-slider-thumb-size);
  block-size: var(--c-slider-thumb-size);
  border-radius: var(--c-slider-thumb-radius);
  background: transparent;
  border: 0;
  cursor: pointer;
}

.c-slider__input::-webkit-slider-runnable-track,
.c-slider__input::-moz-range-track {
  background: transparent;
  border: 0;
}

/* On range sliders, layer the start input under the end input but
   both at the same z-index — pointer events resolve to whichever
   thumb is closer. JS reorders the z-index on the input being
   actively dragged so the user can recover overlapping thumbs. */
.c-slider__input--start { z-index: 2; }
.c-slider__input--end   { z-index: 3; }

/* --- Visible thumb -------------------------------------------- */

.c-slider__thumb {
  position: absolute;
  inset-inline-start: var(--slider-thumb-offset, 0%);
  inset-block-start: 0;
  inline-size: var(--c-slider-thumb-size);
  block-size: var(--c-slider-thumb-size);
  background-color: var(--c-slider-thumb-color);
  border-radius: var(--c-slider-thumb-radius);
  transform: translateX(-50%);
  pointer-events: none;   /* hit-area lives on the native input */
  z-index: 1;
}

/* Hover paint — the underlying input owns :hover; the visible thumb
   re-paints from the sibling-selector hook. The data-state="hover"
   block below mirrors the same paint for AllStyles freezes. */
.c-slider__input:hover ~ .c-slider__thumb,
.c-slider:hover .c-slider__thumb {
  background-color: var(--button-primary-bg-hover);
}

/* :active paint — pointer-down. */
.c-slider__input:active ~ .c-slider__thumb,
.c-slider:active .c-slider__thumb {
  background-color: var(--button-primary-bg-pressed);
}

/* :focus-visible paint — keyboard focus only. Draws a 2px ring at
   4px offset using outline rather than box-shadow so the ring
   respects the painted shape. Pointer focus does NOT trigger
   :focus-visible. */
.c-slider__input:focus-visible ~ .c-slider__thumb {
  outline:
    var(--border-width-s) solid var(--c-slider-focus-color);
  outline-offset: 4px;
  background-color: var(--c-slider-thumb-color);
}

/* --- Range-specific thumb hover/active routing ---------------- */

/* On range, two inputs share the track. Map each input to its
   sibling visible thumb so only the hovered thumb repaints. */
.c-slider--range .c-slider__input--start:hover ~ .c-slider__thumb--start,
.c-slider--range .c-slider__input--end:hover ~ .c-slider__thumb--end {
  background-color: var(--button-primary-bg-hover);
}

.c-slider--range .c-slider__input--start:active ~ .c-slider__thumb--start,
.c-slider--range .c-slider__input--end:active ~ .c-slider__thumb--end {
  background-color: var(--button-primary-bg-pressed);
}

.c-slider--range .c-slider__input--start:focus-visible ~ .c-slider__thumb--start,
.c-slider--range .c-slider__input--end:focus-visible ~ .c-slider__thumb--end {
  outline:
    var(--border-width-s) solid var(--c-slider-focus-color);
  outline-offset: 4px;
}

/* On range, :hover from the wrapper would repaint BOTH thumbs.
   Override the broad rule above so only the input-specific paint
   applies. */
.c-slider--range:hover  .c-slider__thumb { background-color: var(--c-slider-thumb-color); }
.c-slider--range:active .c-slider__thumb { background-color: var(--c-slider-thumb-color); }

/* --- [data-state] freezes (gallery only) ---------------------- */

.c-slider[data-state="hover"]   .c-slider__thumb { background-color: var(--button-primary-bg-hover); }
.c-slider[data-state="active"]  .c-slider__thumb { background-color: var(--button-primary-bg-pressed); }

.c-slider[data-state="focused"] .c-slider__thumb {
  outline:
    var(--border-width-s) solid var(--c-slider-focus-color);
  outline-offset: 4px;
}

/* On range freezes, only paint the START thumb so the difference
   between "hover one thumb" and "neither hover" reads clearly in
   the gallery. */
.c-slider--range[data-state="hover"]   .c-slider__thumb--end,
.c-slider--range[data-state="active"]  .c-slider__thumb--end,
.c-slider--range[data-state="focused"] .c-slider__thumb--end {
  outline: none;
  background-color: var(--c-slider-thumb-color);
}

/* --- Disabled state ------------------------------------------- */

.c-slider.is-disabled,
.c-slider[aria-disabled="true"] {
  --c-slider-track-color: var(--button-disabled-border);
  --c-slider-fill-color:  var(--button-disabled-content);
  --c-slider-thumb-color: var(--button-disabled-content);

  cursor: not-allowed;
}

.c-slider.is-disabled .c-slider__input,
.c-slider[aria-disabled="true"] .c-slider__input {
  cursor: not-allowed;
  pointer-events: none;
}

.c-slider.is-disabled .c-slider__input:hover ~ .c-slider__thumb,
.c-slider.is-disabled .c-slider__input:active ~ .c-slider__thumb,
.c-slider.is-disabled .c-slider__input:focus-visible ~ .c-slider__thumb,
.c-slider[aria-disabled="true"] .c-slider__input:hover ~ .c-slider__thumb,
.c-slider[aria-disabled="true"] .c-slider__input:active ~ .c-slider__thumb,
.c-slider[aria-disabled="true"] .c-slider__input:focus-visible ~ .c-slider__thumb {
  background-color: var(--c-slider-thumb-color);
  outline: none;
}

/* --- Reduced motion ------------------------------------------- */

@media (prefers-reduced-motion: reduce) {
  .c-slider,
  .c-slider * {
    transition: none;
    animation: none;
  }
}
`})))()}var rr;function ir(){return(ir=t((()=>{rr=`/**
 * Molecules/Stepper — BEM root (.c-stepper).
 * Figma: Web-ODS Shared Library master \`1386:867\` + Step set \`1386:803\`
 * (page \`1366:22777\`, Spec Frame \`3067:548\`).
 *
 * Variant axes → BEM modifiers:
 *   direction → .c-stepper--direction-horizontal | --direction-vertical
 *
 * Step state → element modifier:
 *   state     → .c-stepper__step--state-default | --state-active
 *               | --state-complete
 *
 * Persistent runtime states:
 *   current   → [aria-current="step"] on the active list item
 *
 * Stateless — progress is consumer-authored step state.
 */

.c-stepper {
  --c-stepper-indicator-size: 50px;
  --c-stepper-connector-offset: 24px;

  box-sizing: border-box;
  list-style: none;
  margin: 0;
  padding: 0;
}

.c-stepper__step {
  box-sizing: border-box;
}

.c-stepper__indicator,
.c-stepper__indicator-column,
.c-stepper__indicator-row {
  box-sizing: border-box;
}

.c-stepper__indicator {
  align-items: center;
  block-size: var(--c-stepper-indicator-size);
  border-radius: 50%;
  display: flex;
  inline-size: var(--c-stepper-indicator-size);
  justify-content: center;
  position: relative;
}

.c-stepper__number {
  color: var(--color-text-primary);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-lg);
  font-weight: var(--font-weight-regular);
  letter-spacing: var(--letterspacing-body-lg);
  line-height: var(--lineheight-body-lg);
  text-align: center;
}

.c-stepper__label {
  color: var(--color-text-secondary);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-tagline-sm);
  font-weight: var(--font-weight-regular);
  letter-spacing: var(--letterspacing-tagline-sm);
  line-height: var(--lineheight-tagline-sm);
  white-space: nowrap;
}

.c-stepper__connector-line {
  background-color: var(--c-stepper-connector-color, var(--color-border-subtle));
  block-size: var(--border-width-s);
  display: block;
}

.c-stepper__step--state-default {
  --c-stepper-connector-color: var(--color-border-subtle);

  .c-stepper__indicator {
    background-color: var(--color-bg-subtle);
  }
}

.c-stepper__step--state-active {
  --c-stepper-connector-color: color-mix(
    in srgb,
    var(--color-border-strong) 30%,
    transparent
  );

  .c-stepper__indicator {
    background-color: color-mix(
      in srgb,
      var(--color-bg-inverse) 30%,
      transparent
    );
    border: var(--border-width-hairline) solid var(--color-border-brand);
  }
}

.c-stepper__step--state-complete {
  --c-stepper-connector-color: color-mix(
    in srgb,
    var(--color-border-strong) 30%,
    transparent
  );

  .c-stepper__indicator {
    background-color: var(--color-bg-inverse-strong);
  }

  .c-icon {
    color: var(--color-text-inverse);
  }
}

.c-stepper--direction-horizontal {
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  inline-size: 100%;

  .c-stepper__step {
    align-items: flex-start;
    display: flex;
    flex-direction: row;
    gap: var(--space-0);

    &:not(:last-child) {
      flex: 1 1 0;
      min-inline-size: 0;
    }

    &:last-child {
      flex: 0 0 auto;
    }
  }

  .c-stepper__indicator-column {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .c-stepper__label {
    text-align: center;
  }

  .c-stepper__connector {
    flex: 1 1 0;
    min-inline-size: 0;
    padding-block-start: var(--c-stepper-connector-offset);
  }

  .c-stepper__connector-line {
    block-size: var(--border-width-s);
    inline-size: 100%;
  }
}

.c-stepper--direction-vertical {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  inline-size: auto;

  .c-stepper__step {
    display: flex;
    flex-direction: column;
    gap: var(--space-0);

    &:not(:last-child) {
      block-size: var(--space-15);
    }
  }

  .c-stepper__indicator-row {
    align-items: center;
    display: flex;
    flex-direction: row;
    gap: var(--space-3);
  }

  .c-stepper__connector {
    flex: 1 1 0;
    min-block-size: 0;
    padding-inline-start: var(--c-stepper-connector-offset);
  }

  .c-stepper__connector-line {
    block-size: 100%;
    inline-size: var(--border-width-s);
  }
}
`})))()}var ar;function or(){return(or=t((()=>{ar=`/**
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
   insert nodes. Figma Icon mask wrapper is 18×18 (\`717:48382\`); nearest
   enum is \`size="16"\` on the partial — do not re-size \`.c-icon\` here. */
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
`})))()}var sr;function cr(){return(cr=t((()=>{sr=`/**
 * Patterns/Table block — BEM root (.c-table-block).
 * Figma: Table block · content slot \`5914:53\` / Spec \`6032:729\`.
 *
 * Composes .c-table-cell. Adjacent cells and rows overlap by -1px so
 * shared 1 px borders collapse to a single line (Figma note).
 */

.c-table-block {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  inline-size: fit-content;
  max-inline-size: 100%;
}

.c-table-block__content {
  background-color: var(--color-bg-primary);
  display: flex;
  flex-direction: column;
  overflow: clip;
}

.c-table-block__row {
  display: flex;
  flex-direction: row;
  margin-block-end: -1px;

  &:last-child {
    margin-block-end: 0;
  }
}

.c-table-block__row .c-table-cell {
  flex: 0 0 auto;
  margin-inline-end: -1px;

  &:last-child {
    margin-inline-end: 0;
  }
}
`})))()}var lr;function ur(){return(ur=t((()=>{lr=`/**
 * Molecules/Table cell — BEM root (.c-table-cell).
 * Figma: Table cell · content slot \`5957:257\` / Spec \`5960:299\`.
 *
 * Axes:
 *   type   → .c-table-cell--type-header | --type-body
 *   align  → .c-table-cell--align-left | --align-center | --align-right
 *
 * Optional paints:
 *   background → .c-table-cell--background
 *   borders    → .c-table-cell--borders (+ per-side border elements)
 *
 * Table block collapses shared borders via -1px margin on adjacent cells.
 */

.c-table-cell {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  gap: var(--space-3);
  min-inline-size: 0;
  padding: var(--space-3);
  position: relative;
}

.c-table-cell--background.c-table-cell--type-header {
  background-color: var(--color-bg-muted);
}

.c-table-cell--background.c-table-cell--type-body {
  background-color: var(--color-bg-primary);
}

.c-table-cell__icon {
  block-size: 24px;
  color: var(--color-text-primary);
  display: inline-flex;
  flex: 0 0 auto;
  inline-size: 24px;
}

.c-table-cell__content {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  min-inline-size: 0;
  overflow: clip;
}

.c-table-cell--align-left .c-table-cell__content {
  align-items: flex-start;
  text-align: start;
}

.c-table-cell--align-center .c-table-cell__content {
  align-items: center;
  text-align: center;
}

.c-table-cell--align-right .c-table-cell__content {
  align-items: flex-end;
  text-align: end;
}

.c-table-cell__content .c-content-title,
.c-table-cell__content .c-content-body {
  margin: 0;
  max-inline-size: 100%;
  overflow-wrap: anywhere;
}

.c-table-cell__borders {
  inset: 0;
  pointer-events: none;
  position: absolute;
  z-index: 1;
}

.c-table-cell__border {
  background-color: var(--color-border-subtle);
  position: absolute;
}

.c-table-cell__border--top {
  block-size: var(--border-width-xs);
  inline-size: 100%;
  inset-block-start: 0;
  inset-inline: 0;
}

.c-table-cell__border--bottom {
  block-size: var(--border-width-xs);
  inline-size: 100%;
  inset-block-end: 0;
  inset-inline: 0;
}

.c-table-cell__border--left {
  block-size: 100%;
  inline-size: var(--border-width-xs);
  inset-block: 0;
  inset-inline-start: 0;
}

.c-table-cell__border--right {
  block-size: 100%;
  inline-size: var(--border-width-xs);
  inset-block: 0;
  inset-inline-end: 0;
}
`})))()}var dr;function fr(){return(fr=t((()=>{dr=`/**
 * Patterns/Tabs — BEM root (.c-tabs).
 * Figma: .Tab 1396:6950 / wrapper 1396:6994 / mobile 1396:7051 / Spec 4362:266.
 *
 * Style → .c-tabs--style-solid | --style-subtle
 * Tab states → .is-active / :hover / :focus-visible / :disabled + data-state=*
 * Mobile dropdown when [data-tabs-mobile] shown (CSS ≤ md-1px or --force-mobile).
 */

.c-tabs {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  inline-size: 100%;
  max-inline-size: 100%;
}

.c-tabs__list {
  align-items: stretch;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: var(--space-1);
  inline-size: fit-content;
  max-inline-size: 100%;
}

.c-tabs--style-solid .c-tabs__list {
  gap: var(--space-1);
  padding: var(--space-1);
}

.c-tabs--style-subtle .c-tabs__list {
  gap: var(--space-1);
}

.c-tabs__tab {
  align-items: center;
  background: transparent;
  border: none;
  box-sizing: border-box;
  color: var(--color-text-primary);
  cursor: pointer;
  display: inline-flex;
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-lg);
  font-weight: var(--font-weight-regular);
  gap: var(--space-2);
  letter-spacing: var(--letterspacing-body-lg);
  line-height: var(--lineheight-body-lg);
  margin: 0;
  padding-block: var(--space-3);
  padding-inline: var(--space-5);
  position: relative;
  white-space: nowrap;
}

.c-tabs--style-solid .c-tabs__tab {
  border-radius: var(--border-radius-s);
}

.c-tabs--style-subtle .c-tabs__tab {
  border-block-end: var(--border-width-s) solid transparent;
}

.c-tabs__icon {
  color: inherit;
  display: inline-flex;
  flex: 0 0 auto;
}

.c-tabs__label {
  display: inline-block;
}

/* Hover */
.c-tabs__tab:hover:not(:disabled):not(.is-disabled),
.c-tabs__tab[data-state='hover'] {
  font-weight: var(--font-weight-medium);
}

.c-tabs--style-solid .c-tabs__tab:hover:not(:disabled):not(.is-disabled),
.c-tabs--style-solid .c-tabs__tab[data-state='hover'] {
  background-color: color-mix(in srgb, var(--color-bg-primary) 10%, transparent);
}

.c-tabs--style-subtle .c-tabs__tab:hover:not(:disabled):not(.is-disabled),
.c-tabs--style-subtle .c-tabs__tab[data-state='hover'] {
  border-block-end-color: var(--color-border-strong);
}

/* Focus */
.c-tabs__tab:focus-visible,
.c-tabs__tab[data-state='focus'] {
  font-weight: var(--font-weight-semibold);
  outline: none;
}

.c-tabs--style-solid .c-tabs__tab:focus-visible,
.c-tabs--style-solid .c-tabs__tab[data-state='focus'] {
  box-shadow: 0 0 0 var(--border-width-s) var(--color-border-focus);
}

.c-tabs--style-subtle .c-tabs__tab:focus-visible,
.c-tabs--style-subtle .c-tabs__tab[data-state='focus'] {
  border-block-end-color: var(--color-border-accent);
  color: var(--color-text-accent);
  box-shadow: 0 0 0 var(--border-width-s) var(--color-border-focus);
}

/* Active */
.c-tabs__tab.is-active,
.c-tabs__tab[data-state='active'],
.c-tabs__tab[aria-selected='true'] {
  font-weight: var(--font-weight-semibold);
}

.c-tabs--style-solid .c-tabs__tab.is-active,
.c-tabs--style-solid .c-tabs__tab[data-state='active'],
.c-tabs--style-solid .c-tabs__tab[aria-selected='true'] {
  background-color: var(--color-bg-inverse-strong);
  color: var(--color-text-inverse);
}

.c-tabs--style-subtle .c-tabs__tab.is-active,
.c-tabs--style-subtle .c-tabs__tab[data-state='active'],
.c-tabs--style-subtle .c-tabs__tab[aria-selected='true'] {
  border-block-end-color: var(--color-border-accent);
  color: var(--color-text-accent);
}

/* Disabled */
.c-tabs__tab:disabled,
.c-tabs__tab.is-disabled,
.c-tabs__tab[data-state='disabled'] {
  color: var(--color-disabled-text);
  cursor: not-allowed;
  font-weight: var(--font-weight-regular);
}

.c-tabs--style-solid .c-tabs__tab:disabled,
.c-tabs--style-solid .c-tabs__tab.is-disabled,
.c-tabs--style-solid .c-tabs__tab[data-state='disabled'] {
  background: transparent;
}

.c-tabs--style-subtle .c-tabs__tab:disabled,
.c-tabs--style-subtle .c-tabs__tab.is-disabled,
.c-tabs--style-subtle .c-tabs__tab[data-state='disabled'] {
  border-block-end-color: transparent;
}

/* ── Mobile dropdown ─────────────────────────────────────────────── */

.c-tabs__mobile {
  display: none;
  flex-direction: column;
  gap: var(--space-2);
  inline-size: 100%;
  max-inline-size: 343px;
  padding: var(--space-1);
}

.c-tabs__mobile-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  position: relative;
}

.c-tabs__mobile-title {
  color: var(--color-text-primary);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letterspacing-label);
  line-height: var(--lineheight-label);
}

.c-tabs.is-mobile-open .c-tabs__mobile-title {
  color: var(--color-signal-info, var(--color-border-focus));
}

.c-tabs__mobile-trigger {
  align-items: center;
  background-color: var(--color-bg-input, var(--color-bg-primary));
  border: var(--border-width-xs) solid var(--color-border-input-default, var(--color-border-strong));
  border-radius: var(--border-radius-m, 6px);
  box-sizing: border-box;
  color: var(--color-text-primary);
  cursor: pointer;
  display: flex;
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-sm);
  gap: var(--space-3);
  inline-size: 100%;
  justify-content: space-between;
  letter-spacing: var(--letterspacing-body-sm);
  line-height: var(--lineheight-body-sm);
  min-block-size: 44px;
  padding: var(--space-3);
  text-align: start;
}

.c-tabs.is-mobile-open .c-tabs__mobile-trigger {
  border-color: var(--color-border-input-focus, var(--color-border-focus));
  border-width: var(--border-width-s);
}

.c-tabs__mobile-value {
  flex: 1 1 0;
  min-inline-size: 0;
}

.c-tabs__mobile-chevron {
  color: var(--color-text-primary);
  display: inline-flex;
  flex: 0 0 auto;
}

.c-tabs__mobile-menu {
  background-color: var(--color-bg-primary);
  border: var(--border-width-xs) solid var(--color-border-subtle);
  border-radius: var(--border-radius-m, 6px);
  box-shadow: var(--shadow-menu-block, 0 4px 12px rgb(0 0 0 / 8%));
  inset-block-start: calc(100% + var(--space-2));
  inset-inline: 0;
  list-style: none;
  margin: 0;
  padding: var(--space-1);
  position: absolute;
  z-index: 2;
}

.c-tabs__mobile-option {
  background: transparent;
  border: none;
  border-radius: var(--border-radius-s);
  color: var(--color-text-primary);
  cursor: pointer;
  display: block;
  font: inherit;
  inline-size: 100%;
  padding-block: var(--space-3);
  padding-inline: var(--space-3);
  text-align: start;
}

.c-tabs__mobile-option.is-active {
  font-weight: var(--font-weight-semibold);
}

.c-tabs__mobile-option:hover:not(:disabled) {
  background-color: var(--color-bg-subtle);
}

.c-tabs__mobile-option:disabled {
  color: var(--color-disabled-text);
  cursor: not-allowed;
}

/* Show mobile when forced or below MD and fallback present */
@media (max-width: 767px) {
  .c-tabs:has([data-tabs-mobile]:not([hidden])) .c-tabs__list-wrap {
    display: none;
  }

  .c-tabs [data-tabs-mobile]:not([hidden]) {
    display: flex;
  }
}

.c-tabs--force-mobile .c-tabs__list-wrap {
  display: none;
}

.c-tabs--force-mobile [data-tabs-mobile] {
  display: flex;
}
`})))()}var pr;function mr(){return(mr=t((()=>{pr=`/**
 * Molecules/Tag — core (.c-tag).
 * Figma: Web-ODS Shared Library 6114:53 / Spec 6328:54273.
 *
 * Squarer sibling of Discount label: radius-s, body-base/prominent,
 * leading icon default on. Fill × Strength same mix model as discount-label.
 */

.c-tag {
  --c-tag-bg: var(--color-bg-default);
  --c-tag-content: var(--color-text-primary);
  --c-tag-mix: 100%;
  --c-tag-mix-with: transparent;

  align-items: center;
  background-color: color-mix(
    in srgb,
    var(--c-tag-bg) var(--c-tag-mix),
    var(--c-tag-mix-with)
  );
  border-radius: var(--border-radius-s);
  box-sizing: border-box;
  color: var(--c-tag-content);
  display: inline-flex;
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-base);
  font-weight: var(--font-weight-medium);
  gap: var(--space-1);
  inline-size: fit-content;
  justify-content: center;
  letter-spacing: var(--letterspacing-body-base);
  line-height: var(--lineheight-body-base);
  padding-block: var(--space-1);
  padding-inline: var(--space-3);
}

.c-tag__text {
  display: inline-block;
}

.c-tag__icon {
  display: inline-flex;
  flex-shrink: 0;
}

.c-tag--fill-solid {
  --c-tag-mix-with: transparent;
}

.c-tag--fill-transparent {
  --c-tag-mix-with: transparent;
}

.c-tag--fill-tint {
  --c-tag-mix-with: var(--color-bg-default);
}

.c-tag--strength-base {
  --c-tag-mix: 100%;
}

.c-tag--strength-30 {
  --c-tag-mix: 30%;
}

.c-tag--strength-50 {
  --c-tag-mix: 50%;
}

.c-tag--strength-80 {
  --c-tag-mix: 80%;
}

.c-tag--primary {
  --c-tag-bg: var(--color-bg-default);
  --c-tag-content: var(--color-text-primary);
}

.c-tag--secondary {
  --c-tag-bg: var(--color-bg-subtle);
  --c-tag-content: var(--color-text-primary);
}

.c-tag--brand {
  --c-tag-bg: var(--color-bg-brand);
  --c-tag-content: var(--color-text-inverse);
}

.c-tag--brand-soft {
  --c-tag-bg: var(--color-bg-brand-soft);
  --c-tag-content: var(--color-text-primary);
}

.c-tag--accent {
  --c-tag-bg: var(--color-bg-accent);
  --c-tag-content: var(--color-text-primary);
}

.c-tag--alpha {
  --c-tag-bg: var(--color-bg-alpha);
  --c-tag-content: var(--color-text-primary);
}

.c-tag--beta {
  --c-tag-bg: var(--color-bg-beta);
  --c-tag-content: var(--color-text-primary);
}

.c-tag--gamma {
  --c-tag-bg: var(--color-bg-gamma);
  --c-tag-content: var(--color-text-primary);
}

.c-tag--delta {
  --c-tag-bg: var(--color-bg-delta);
  --c-tag-content: var(--color-text-primary);
}

.c-tag--inverse-primary {
  --c-tag-bg: var(--color-bg-inverse-strong);
  --c-tag-content: var(--color-text-inverse);
}

.c-tag--inverse-secondary {
  --c-tag-bg: var(--color-bg-inverse);
  --c-tag-content: var(--color-text-inverse);
}

/* Non-solid brand / inverse: keep readable ink on light washes */
.c-tag--brand.c-tag--fill-transparent,
.c-tag--brand.c-tag--fill-tint,
.c-tag--inverse-primary.c-tag--fill-transparent,
.c-tag--inverse-primary.c-tag--fill-tint,
.c-tag--inverse-secondary.c-tag--fill-transparent,
.c-tag--inverse-secondary.c-tag--fill-tint {
  --c-tag-content: var(--color-text-primary);
}
`})))()}var hr;function gr(){return(gr=t((()=>{hr=`// Patterns/Inputs/Text field
// Native <input> / <select> dressed with the LifeLock Layer 3c input
// tokens. One bordered "control" surface across every \`type\`; the
// resting border, hover, focus ring (border + glow box-shadow), error,
// and disabled paints all read from \`--color-*-input-*\`. The open
// <select> menu is progressively enhanced with \`appearance: base-select\`
// (Chromium 135+); every other browser keeps the native popup. All
// inline-axis sizing uses logical properties so the field flips under
// \`dir="rtl"\`.

.c-text-field {
  --c-text-field-radius: var(--border-radius-card);
  --c-text-field-min-block: 40px;
  --c-text-field-pad-inline: var(--space-5);
  --c-text-field-pad-block: var(--space-3);

  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  inline-size: 100%;
  max-inline-size: 22rem;
  font-family: var(--font-family-primary);
}

// ── Field title (label) ──────────────────────────────────────────────
.c-text-field__title {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--color-text-primary);
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-medium);
  line-height: var(--lineheight-label);
}

.c-text-field__required {
  color: var(--color-text-error);
}

// ── Control wrapper ──────────────────────────────────────────────────
.c-text-field__control {
  position: relative;
  display: flex;
  align-items: center;
  inline-size: 100%;
}

// ── Field surface (input + standalone select) ────────────────────────
.c-text-field__field {
  inline-size: 100%;
  min-block-size: var(--c-text-field-min-block);
  padding-block: var(--c-text-field-pad-block);
  padding-inline: var(--c-text-field-pad-inline);
  border: var(--border-width-hairline) solid var(--color-border-input-default);
  border-radius: var(--c-text-field-radius);
  background-color: var(--color-bg-input);
  color: var(--color-text-default);
  font-family: inherit;
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
  text-align: start;
}

// \`appearance: none\` only on text inputs — the native <select> keeps its
// UA arrow so the closed control still works in Firefox / Safari.
input.c-text-field__field {
  appearance: none;
}

.c-text-field__select {
  padding-inline-end: var(--space-9);
  cursor: pointer;
}

.c-text-field__field::placeholder {
  color: var(--color-text-placeholder);
}

.c-text-field__field:hover {
  border-color: var(--color-border-input-hover);
}

.c-text-field__field:focus-visible {
  outline: none;
  border-color: var(--color-border-input-focus);
  box-shadow: 0 0 0 var(--space-1) var(--color-border-input-focus-glow);
}

// ── Combined (one bordered wrapper: prefix select + input) ───────────
.c-text-field__control--combined,
.c-text-field__box {
  overflow: hidden;
  border: var(--border-width-hairline) solid var(--color-border-input-default);
  border-radius: var(--c-text-field-radius);
  background-color: var(--color-bg-input);
}

.c-text-field__control--combined:focus-within,
.c-text-field__box:focus-within {
  border-color: var(--color-border-input-focus);
  box-shadow: 0 0 0 var(--space-1) var(--color-border-input-focus-glow);
}

.c-text-field__control--combined {
  display: flex;
  align-items: stretch;
}

.c-text-field__prefix {
  flex: 0 0 auto;
}

.c-text-field__control--combined .c-text-field__field {
  flex: 1 1 auto;
}

.c-text-field__seam {
  flex: 0 0 auto;
  align-self: stretch;
  inline-size: var(--border-width-hairline);
  background-color: var(--color-border-input-divider);
}

// Inner controls inside a wrapper-bordered surface are borderless; the
// wrapper owns the border + focus ring.
.c-text-field__control--combined .c-text-field__field,
.c-text-field__control--combined .c-text-field__select,
.c-text-field__box .c-text-field__field,
.c-text-field__box .c-text-field__select {
  border: 0;
  border-radius: 0;
  background: transparent;
}

.c-text-field__control--combined .c-text-field__field:focus-visible,
.c-text-field__control--combined .c-text-field__select:focus-visible,
.c-text-field__box .c-text-field__field:focus-visible,
.c-text-field__box .c-text-field__select:focus-visible {
  outline: none;
  box-shadow: none;
}

// ── Split (separate prefix box + input box) ──────────────────────────
.c-text-field__control--split {
  display: flex;
  gap: var(--space-3);
  align-items: stretch;
}

.c-text-field__box--prefix {
  flex: 0 0 auto;
}

.c-text-field__control--split .c-text-field__box:not(.c-text-field__box--prefix) {
  flex: 1 1 auto;
}

// ── Password reveal ──────────────────────────────────────────────────
.c-text-field__control--password .c-text-field__field {
  padding-inline-end: var(--space-11);
}

.c-text-field__reveal {
  position: absolute;
  inset-inline-end: var(--space-3);
  inset-block-start: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  // Figma password reveal Icon mask wrapper is 20×20 (\`4084:69\`) with
  // no control pad — keep \`size="20"\` on the partial and zero pad here.
  padding: 0;
  border: 0;
  border-radius: var(--border-radius-control);
  background: transparent;
  color: var(--color-text-default);
  cursor: pointer;
  transform: translateY(-50%);
}

.c-text-field__reveal:hover {
  color: var(--color-text-primary);
}

.c-text-field__reveal:focus-visible {
  outline: var(--border-width-default) solid var(--color-border-input-focus);
  outline-offset: var(--space-1);
}

.c-text-field__reveal-icon {
  display: inline-flex;
}

.c-text-field__reveal-icon--hide {
  display: none;
}

.c-text-field.is-revealed .c-text-field__reveal-icon--show {
  display: none;
}

.c-text-field.is-revealed .c-text-field__reveal-icon--hide {
  display: inline-flex;
}

// ── Helper message ───────────────────────────────────────────────────
.c-text-field__helper {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-body-xs);
  line-height: var(--lineheight-body-xs);
}

// ── Error ────────────────────────────────────────────────────────────
.c-text-field.is-error .c-text-field__field,
.c-text-field.is-error .c-text-field__control--combined,
.c-text-field.is-error .c-text-field__box {
  border-color: var(--color-border-input-error);
}

.c-text-field.is-error .c-text-field__field:focus-visible,
.c-text-field.is-error .c-text-field__control--combined:focus-within,
.c-text-field.is-error .c-text-field__box:focus-within {
  border-color: var(--color-border-input-error);
  box-shadow: 0 0 0 var(--space-1) var(--color-border-input-error-glow);
}

.c-text-field.is-error .c-text-field__helper {
  color: var(--color-text-error);
}

// ── Disabled ─────────────────────────────────────────────────────────
.c-text-field.is-disabled .c-text-field__title {
  color: var(--color-text-disabled);
}

.c-text-field__field:disabled {
  border-color: var(--color-border-input-disabled);
  background-color: var(--color-bg-input-disabled);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.c-text-field__control--combined:has(:disabled),
.c-text-field__box:has(:disabled) {
  border-color: var(--color-border-input-disabled);
  background-color: var(--color-bg-input-disabled);
}

.c-text-field__reveal:disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

// ── Progressive enhancement: styled open <select> menu (Chromium 135+)
@supports (appearance: base-select) {
  .c-text-field__select,
  .c-text-field__select::picker(select) {
    appearance: base-select;
  }

  .c-text-field__select::picker(select) {
    padding: var(--space-2);
    border: var(--border-width-hairline) solid var(--color-border-input-default);
    border-radius: var(--border-radius-card);
    background-color: var(--color-bg-input);
    box-shadow: 0 4px 16px color-mix(in srgb, var(--color-text-primary) 12%, transparent);
  }

  .c-text-field__select option {
    padding-block: var(--space-3);
    padding-inline: var(--space-5);
    border-radius: var(--border-radius-control);
  }

  .c-text-field__select option:hover,
  .c-text-field__select option:focus {
    background-color: var(--color-border-input-divider);
  }

  .c-text-field__select option:checked {
    font-weight: var(--font-weight-medium);
  }

  .c-text-field__select::picker-icon {
    color: var(--color-text-default);
    transition: rotate 0.2s ease;
  }

  .c-text-field__select:open::picker-icon {
    rotate: 180deg;
  }
}

@media (prefers-reduced-motion: reduce) {
  .c-text-field__select::picker-icon {
    transition: none;
  }
}
`})))()}var _r;function vr(){return(vr=t((()=>{_r=`/**
 * Components/Text link — single BEM root (.c-text-link) covering the
 * Figma master variant set on Web-ODS Shared Library \`1332:54878\`
 * (LifeLock theme mode).
 *
 * Variant axes → BEM modifiers:
 *   background → .c-text-link--light | --dark
 *   size       → .c-text-link--xs | --sm | --base
 *                | --lg | --xl | --2xl | --3xl
 *   weight     → .c-text-link--regular | --medium
 *                | --semibold | --bold
 *   icon-slot  → .c-text-link--has-icon (+ --has-icon-leading
 *                | --has-icon-trailing)
 *
 * Persistent runtime states:
 *   disabled   → [aria-disabled="true"]   (markup-driven)
 *   visited    → :visited                 (browser-managed)
 *   forced     → .is-visited              (gallery-only override)
 *
 * Transient interaction states:
 *   hover      → :hover
 *   focus      → :focus-visible
 *   pressed    → :active
 *
 * Per \`spec-driven-sync.mdc\`, every paint resolves to a \`var(--…)\`
 * token declared in \`tokens/colors\`, \`tokens/typography\`,
 * \`tokens/spacing\`, or \`tokens/borders\`. No hardcoded design values.
 *
 * Logical properties (\`text-decoration\` and the \`padding\`-shorthand
 * focus-ring metrics) keep the unit RTL-safe out of the box.
 */

// ============================================================================
// BLOCK — .c-text-link
// ============================================================================

.c-text-link {
  // \`inline-flex\` lets the optional icon slot ride alongside the label
  // as part of the link's intrinsic content box. \`align-items: center\`
  // (rather than \`baseline\`) is the right cross-axis pick for an
  // icon + text pair because an inline-block icon (the icon partial
  // ships \`display: inline-block\` with \`vertical-align: middle\`) has
  // its baseline at the bottom of its content box — \`align-items:
  // baseline\` would put the icon's bottom edge on the text baseline
  // and the icon would sit visually too low next to the text. Centring
  // the icon to the link's content box aligns its visual centre with
  // the text's x-height for the common single-line case.
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  box-sizing: border-box;
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);

  // Default paint — Background=Light. Light/Dark modifier blocks below
  // override every state-aware paint so a bare \`.c-text-link\` still
  // renders correctly during dev / authoring without modifiers.
  color: var(--color-text-brand);
  // Rest state is underlined — mirrors the THEME=LifeLock rendering of
  // the shared master (conflict resolved 2026-06-11: Figma wins; the
  // earlier underline-on-interaction-only treatment matched the White
  // Label mode, not LifeLock).
  text-decoration: underline;
  text-decoration-thickness: var(--border-width-default);
  text-underline-offset: 0.2em;

  // The icon paints in \`currentColor\` so it tracks every state without
  // per-state overrides.
  .c-icon {
    color: inherit;
  }

  // Hover + pressed keep the underline; pressed dims via opacity so
  // the cue is tactile, not chromatic.
  &:hover,
  &:active {
    text-decoration: underline;
    text-decoration-thickness: var(--border-width-default);
  }

  &:active {
    opacity: 0.85;
  }

  // Focus ring uses --color-border-focus offset by --space-1 so the
  // ring sits clear of the underline. \`:focus-visible\` only — the ring
  // never appears on mouse-down.
  &:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: var(--space-1);
    text-decoration: underline;
    text-decoration-thickness: var(--border-width-default);
  }
}

// ============================================================================
// ELEMENT — .c-text-link__label
// ============================================================================

.c-text-link__label {
  // Inline so the label sits on the same baseline as the icon slot.
  display: inline;
}

// ============================================================================
// MODIFIERS — Background = Light (default)
// ============================================================================

.c-text-link--light {
  color: var(--color-text-brand);

  &:hover,
  &:active,
  &:focus-visible {
    color: var(--color-text-brand);
  }

  // Visited paints --color-text-secondary — softer than brand so users
  // can quickly scan which links they have followed without losing the
  // link affordance entirely (the rest-state underline persists).
  // The \`is-visited\` class is the gallery-only override consumed by
  // the AllStyles state band.
  &:visited,
  &.is-visited {
    color: var(--color-text-secondary);
  }
}

// ============================================================================
// MODIFIERS — Background = Dark
// ============================================================================

.c-text-link--dark {
  color: var(--color-text-inverse);

  &:hover,
  &:active,
  &:focus-visible {
    color: var(--color-text-inverse);
  }

  // On dark canvases the visited treatment stays inverse; the
  // surrounding canvas already carries enough chromatic isolation
  // that a tonal shift would reduce contrast below WCAG AA.
  &:visited,
  &.is-visited {
    color: var(--color-text-inverse);
  }
}

// ============================================================================
// MODIFIERS — Size (typography ladder)
// ============================================================================

.c-text-link--xs {
  font-size: var(--font-size-body-xs);
  line-height: var(--lineheight-body-xs);
}

.c-text-link--sm {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
}

.c-text-link--base {
  font-size: var(--font-size-body-base);
  line-height: var(--lineheight-body-base);
}

.c-text-link--lg {
  font-size: var(--font-size-body-lg);
  line-height: var(--lineheight-body-lg);
}

.c-text-link--xl {
  font-size: var(--font-size-body-xl);
  line-height: var(--lineheight-body-xl);
}

.c-text-link--2xl {
  font-size: var(--font-size-body-2xl);
  line-height: var(--lineheight-body-2xl);
}

.c-text-link--3xl {
  font-size: var(--font-size-body-3xl);
  line-height: var(--lineheight-body-3xl);
}

// ============================================================================
// MODIFIERS — Weight
// ============================================================================

.c-text-link--regular {
  font-weight: var(--font-weight-regular);
}

.c-text-link--medium {
  font-weight: var(--font-weight-medium);
}

.c-text-link--semibold {
  font-weight: var(--font-weight-semibold);
}

.c-text-link--bold {
  font-weight: var(--font-weight-bold);
}

// ============================================================================
// MODIFIERS — Icon slot (orthogonal opt-in)
// ============================================================================

.c-text-link--has-icon {
  // Gap is already declared on the block; this modifier exists so
  // consumers can target icon-bearing links without re-running the
  // selector chain (e.g. for layout-side adjacent-sibling rules).
}

// \`--has-icon-leading\` and \`--has-icon-trailing\` are positional hints
// only; the actual layout flips by the order of children inside the
// \`<a>\` element. They exist so consumers and audits can tell which
// slot is in use without inspecting child markup.
.c-text-link--has-icon-leading,
.c-text-link--has-icon-trailing {
  // No additional styling — see comment above.
}

// ============================================================================
// PERSISTENT STATE — disabled
// ============================================================================

// Disabled is markup-driven via \`aria-disabled="true"\`. The attribute
// selector carries the disabled paint and blocks pointer events so
// click handlers fire-no-op even in browsers that ignore the missing
// \`href\`.
.c-text-link[aria-disabled='true'] {
  color: var(--color-disabled-text);
  cursor: not-allowed;
  pointer-events: none;
  text-decoration: none;

  &:hover,
  &:active,
  &:focus-visible {
    color: var(--color-disabled-text);
    text-decoration: none;
  }

  &:focus-visible {
    // Focus ring is suppressed because tabindex="-1" already removes
    // the disabled link from the keyboard tab order. Belt-and-braces.
    outline: none;
  }
}
`})))()}var yr;function br(){return(br=t((()=>{yr=`/**
 * Patterns/Toggle — BEM root (.c-toggle).
 * Figma: Pattern / Toggle 539:28414 / Spec 4588:132.
 *
 * Types: link | segmented | pill
 */

@use '../discount-label/discount-label';

.c-toggle {
  box-sizing: border-box;
  display: inline-flex;
  font-family: var(--font-family-primary);
}

.c-toggle.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
  pointer-events: none;
}

/* ── Link (labels + track) ─────────────────────────────────────── */

.c-toggle__link {
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  display: inline-flex;
  gap: var(--space-5);
  margin: 0;
  padding: var(--space-3);
}

.c-toggle__label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-body-base);
  font-weight: var(--font-weight-regular);
  letter-spacing: var(--letterspacing-body-base);
  line-height: var(--lineheight-body-base);
}

.c-toggle__label.is-active {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
}

.c-toggle__track {
  background-color: var(--color-border-subtle);
  block-size: 24px;
  border-radius: var(--border-radius-pill);
  display: inline-flex;
  flex: 0 0 auto;
  inline-size: 44px;
  padding: 2px;
  position: relative;
  transition: background-color 0.15s ease;
}

.c-toggle[data-selected='on'] .c-toggle__track {
  background-color: var(--color-signal-info);
}

.c-toggle__knob {
  background-color: var(--color-bg-default);
  block-size: 20px;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgb(0 0 0 / 16%);
  inline-size: 20px;
  inset-inline-start: 2px;
  position: absolute;
  top: 2px;
  transition: inset-inline-start 0.15s ease;
}

.c-toggle[data-selected='on'] .c-toggle__knob {
  inset-inline-start: calc(100% - 22px);
}

.c-toggle__link:focus-visible {
  outline: none;
  box-shadow: 0 0 0 var(--border-width-s) var(--color-border-focus);
  border-radius: var(--border-radius-s);
}

/* ── Segmented ─────────────────────────────────────────────────── */

.c-toggle__segmented {
  align-items: center;
  border: var(--border-width-xs) solid var(--color-border-strong);
  border-radius: var(--border-radius-l);
  display: inline-flex;
  overflow: hidden;
  padding: var(--space-2);
}

.c-toggle__seg {
  background: transparent;
  border: none;
  border-radius: var(--border-radius-s);
  color: var(--color-text-primary);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--font-size-button-xl, var(--font-size-body-lg));
  font-weight: var(--font-weight-semibold);
  line-height: var(--lineheight-button-xl, var(--lineheight-body-lg));
  min-inline-size: 48px;
  padding-block: var(--space-4);
  padding-inline: var(--space-8);
}

.c-toggle__seg.is-selected {
  background-color: var(--button-primary-bg-default, var(--color-bg-brand));
  color: var(--button-primary-content-default, var(--color-text-inverse));
}

.c-toggle__seg:focus-visible {
  outline: none;
  box-shadow: 0 0 0 var(--border-width-s) var(--color-border-focus);
}

.c-toggle__seg:hover:not(.is-selected):not(:disabled) {
  background-color: var(--color-bg-subtle);
}

/* ── Pill ──────────────────────────────────────────────────────── */

.c-toggle__pill {
  align-items: stretch;
  background-color: var(--color-disabled-bg, var(--color-bg-subtle));
  border-radius: var(--border-radius-pill);
  display: inline-flex;
  min-block-size: 42px;
  overflow: hidden;
}

.c-toggle__pill-opt {
  align-items: center;
  background: transparent;
  border: none;
  border-radius: var(--border-radius-pill);
  color: var(--color-text-primary);
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: var(--font-size-body-base);
  font-weight: var(--font-weight-medium);
  gap: var(--space-3);
  justify-content: center;
  line-height: var(--lineheight-body-base);
  padding-block: var(--space-3);
  padding-inline: var(--space-7);
}

.c-toggle__pill-opt.is-selected {
  background-color: var(--color-text-primary);
  color: var(--color-text-inverse);
  padding-inline-end: var(--space-3);
}

.c-toggle__pill-opt:focus-visible {
  outline: none;
  box-shadow: 0 0 0 var(--border-width-s) var(--color-border-focus);
}

.c-toggle__pill-chip {
  display: inline-flex;
}

.c-toggle--state-hover .c-toggle__seg:not(.is-selected),
.c-toggle--state-hover .c-toggle__pill-opt:not(.is-selected) {
  background-color: var(--color-bg-subtle);
}

.c-toggle--state-pressed .c-toggle__seg.is-selected,
.c-toggle--state-pressed .c-toggle__pill-opt.is-selected {
  filter: brightness(0.92);
}
`})))()}var xr;function Sr(){return(Sr=t((()=>{xr=`/**
 * Molecules/Tooltip — BEM root (.c-tooltip).
 * Figma: Pattern / Tooltip 539:28418 / Spec 4601:164.
 *
 * Type → --type-small|medium|rich
 * Tint → --tint-*
 * Pointer → --pointer-* (CSS triangle on edge)
 */

.c-tooltip {
  --c-tooltip-bg: var(--color-bg-default);
  --c-tooltip-border: var(--color-border-subtle);
  --c-tooltip-fg: var(--color-text-primary);
  --c-tooltip-radius: var(--border-radius-m, 6px);
  --c-tooltip-pointer-size: 8px;

  box-sizing: border-box;
  color: var(--c-tooltip-fg);
  display: inline-flex;
  filter: drop-shadow(var(--shadow-default));
  flex-direction: column;
  font-family: var(--font-family-primary);
  max-inline-size: 280px;
  position: relative;
}

.c-tooltip[hidden]:not(.is-open) {
  display: none;
}

.c-tooltip.is-open {
  display: inline-flex;
}

.c-tooltip__bubble {
  background-color: var(--c-tooltip-bg);
  border: var(--border-width-xs) solid var(--c-tooltip-border);
  border-radius: var(--c-tooltip-radius);
  box-sizing: border-box;
  padding-block: var(--space-2);
  padding-inline: var(--space-4);
  position: relative;
  z-index: 1;
}

.c-tooltip--type-medium .c-tooltip__bubble,
.c-tooltip--type-rich .c-tooltip__bubble {
  padding-block: var(--space-3);
  padding-inline: var(--space-5);
  text-align: start;
}

.c-tooltip--type-small .c-tooltip__bubble {
  text-align: center;
}

.c-tooltip__title {
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letterspacing-body-sm);
  line-height: var(--lineheight-body-sm);
  margin: 0 0 var(--space-1);
}

.c-tooltip__body {
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-regular);
  letter-spacing: var(--letterspacing-body-sm);
  line-height: var(--lineheight-body-sm);
  margin: 0;
}

.c-tooltip--type-rich .c-tooltip__body {
  font-size: var(--font-size-body-base);
  letter-spacing: var(--letterspacing-body-base);
  line-height: var(--lineheight-body-base);
}

/* Tints */
.c-tooltip--tint-default {
  --c-tooltip-bg: var(--color-bg-default);
  --c-tooltip-border: var(--color-border-subtle);
  --c-tooltip-fg: var(--color-text-primary);
}

.c-tooltip--tint-main {
  --c-tooltip-bg: var(--color-signal-info-subtle);
  --c-tooltip-border: var(--color-signal-info-muted, var(--color-signal-info));
  --c-tooltip-fg: var(--color-text-primary);
}

.c-tooltip--tint-success {
  --c-tooltip-bg: var(--color-signal-success-subtle);
  --c-tooltip-border: var(--color-signal-success-muted, var(--color-signal-success));
  --c-tooltip-fg: var(--color-text-primary);
}

.c-tooltip--tint-attention {
  --c-tooltip-bg: var(--color-signal-warning-subtle);
  --c-tooltip-border: var(--color-signal-warning-muted, var(--color-signal-warning));
  --c-tooltip-fg: var(--color-text-primary);
}

.c-tooltip--tint-critical {
  --c-tooltip-bg: var(--color-signal-critical-subtle);
  --c-tooltip-border: var(--color-signal-critical-muted, var(--color-signal-critical));
  --c-tooltip-fg: var(--color-text-primary);
}

/* Pointer triangle */
.c-tooltip__pointer {
  background-color: var(--c-tooltip-bg);
  block-size: var(--c-tooltip-pointer-size);
  border-block-start: var(--border-width-xs) solid var(--c-tooltip-border);
  border-inline-start: var(--border-width-xs) solid var(--c-tooltip-border);
  inline-size: var(--c-tooltip-pointer-size);
  position: absolute;
  transform: rotate(45deg);
  z-index: 0;
}

.c-tooltip--pointer-top-center .c-tooltip__pointer,
.c-tooltip--pointer-top-left .c-tooltip__pointer,
.c-tooltip--pointer-top-right .c-tooltip__pointer {
  inset-block-start: calc(var(--c-tooltip-pointer-size) / -2);
}

.c-tooltip--pointer-top-center .c-tooltip__pointer {
  inset-inline-start: 50%;
  margin-inline-start: calc(var(--c-tooltip-pointer-size) / -2);
}

.c-tooltip--pointer-top-left .c-tooltip__pointer {
  inset-inline-start: var(--space-4);
}

.c-tooltip--pointer-top-right .c-tooltip__pointer {
  inset-inline-end: var(--space-4);
}

.c-tooltip--pointer-bottom-center .c-tooltip__pointer,
.c-tooltip--pointer-bottom-left .c-tooltip__pointer,
.c-tooltip--pointer-bottom-right .c-tooltip__pointer {
  inset-block-end: calc(var(--c-tooltip-pointer-size) / -2);
  border-block-start: none;
  border-inline-start: none;
  border-block-end: var(--border-width-xs) solid var(--c-tooltip-border);
  border-inline-end: var(--border-width-xs) solid var(--c-tooltip-border);
}

.c-tooltip--pointer-bottom-center .c-tooltip__pointer {
  inset-inline-start: 50%;
  margin-inline-start: calc(var(--c-tooltip-pointer-size) / -2);
}

.c-tooltip--pointer-bottom-left .c-tooltip__pointer {
  inset-inline-start: var(--space-4);
}

.c-tooltip--pointer-bottom-right .c-tooltip__pointer {
  inset-inline-end: var(--space-4);
}

.c-tooltip--pointer-left .c-tooltip__pointer {
  inset-block-start: 50%;
  inset-inline-start: calc(var(--c-tooltip-pointer-size) / -2);
  margin-block-start: calc(var(--c-tooltip-pointer-size) / -2);
  border-block-start: var(--border-width-xs) solid var(--c-tooltip-border);
  border-inline-start: var(--border-width-xs) solid var(--c-tooltip-border);
  border-block-end: none;
  border-inline-end: none;
}

.c-tooltip--pointer-right .c-tooltip__pointer {
  inset-block-start: 50%;
  inset-inline-end: calc(var(--c-tooltip-pointer-size) / -2);
  margin-block-start: calc(var(--c-tooltip-pointer-size) / -2);
  border-block-start: none;
  border-inline-start: none;
  border-block-end: var(--border-width-xs) solid var(--c-tooltip-border);
  border-inline-end: var(--border-width-xs) solid var(--c-tooltip-border);
}
`})))()}var Cr;function wr(){return(wr=t((()=>{Cr=`/**
 * Patterns/Trustpilot — review cell (.c-trustpilot).
 * Figma: 2500:4244 / Spec 3969:12883.
 */

@use '../rating/rating';

.c-trustpilot {
  background-color: var(--color-bg-default);
  border-radius: var(--border-radius-s);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  font-family: var(--font-family-primary);
  gap: var(--space-3);
  inline-size: 100%;
  max-inline-size: 304px;
  padding: var(--space-8);
}

.c-trustpilot__title {
  color: var(--color-text-primary);
  font-size: var(--font-size-body-lg);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letterspacing-body-lg);
  line-height: var(--lineheight-body-lg);
  margin: 0;
}

.c-trustpilot__product {
  color: var(--color-text-secondary);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-regular);
  letter-spacing: var(--letterspacing-body-sm);
  line-height: var(--lineheight-body-sm);
  margin: 0;
}

.c-trustpilot__rating {
  display: flex;
}

.c-trustpilot__meta {
  color: var(--color-text-secondary);
  font-size: var(--font-size-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
  line-height: var(--lineheight-body-sm);
  margin: 0;
}

.c-trustpilot__verified {
  color: var(--color-text-accent);
}

.c-trustpilot__quote {
  color: var(--color-text-primary);
  font-size: var(--font-size-body-base);
  font-weight: var(--font-weight-regular);
  letter-spacing: var(--letterspacing-body-base);
  line-height: var(--lineheight-body-base);
  margin: 0;
}
`})))()}var Tr;function Er(){return(Er=t((()=>{Tr=`/**
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
`})))()}var Dr;function Or(){return(Or=t((()=>{Dr=`/**
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
`})))()}var kr;function Ar(){return(Ar=t((()=>{kr=`/**
 * Alert Handlebars helpers — shared by core and brand packages.
 */

/**
 * @param {import('handlebars').HelperDelegate | typeof import('handlebars')} Handlebars
 */
export function registerAlertHelpers(Handlebars) {
  /**
   * Per-tone default status-icon catalog key.
   * Explicit \`icon\` override wins.
   */
  Handlebars.registerHelper('alertStatusIcon', (tone, override) => {
    if (override) return override;
    const map = {
      info: 'status/simple-status-info',
      critical: 'status/simple-status-critical',
      attention: 'status/simple-status-attention',
      success: 'status/simple-status-ok',
      dark: 'status/simple-info',
      brand: 'status/simple-status-info',
    };
    return map[tone] || map.info;
  });

  /**
   * Per-hierarchy CTA Button style: low → primary, high → secondary.
   */
  Handlebars.registerHelper('alertCtaStyle', (hierarchy) =>
    hierarchy === 'high' ? 'secondary' : 'primary',
  );
}
`})))()}var jr;function Mr(){return(Mr=t((()=>{jr=`/**
 * Patterns/Alert — progressive-enhancement dismiss behaviour.
 *
 * Presentational by default. When \`initAlert\` runs, dismiss buttons
 * unmount the root and fire \`lifelock:alert:dismiss\`.
 */

/**
 * @param {HTMLElement} root
 * @returns {{ destroy: () => void } | null}
 */
export function initAlert(root) {
  if (!root || root.dataset.alertInitialized === 'true') return null;

  const dismissBtn = root.querySelector('[data-alert-dismiss]');
  if (!dismissBtn) return null;

  root.dataset.alertInitialized = 'true';

  const onDismiss = () => {
    root.dispatchEvent(
      new CustomEvent('lifelock:alert:dismiss', {
        bubbles: true,
        composed: true,
        detail: { root },
      }),
    );
    root.remove();
  };

  dismissBtn.addEventListener('click', onDismiss);

  return {
    destroy() {
      dismissBtn.removeEventListener('click', onDismiss);
      delete root.dataset.alertInitialized;
    },
  };
}

/**
 * @param {ParentNode} [scope=document]
 * @returns {Array<{ destroy: () => void }>}
 */
export function initAlerts(scope = document) {
  return Array.from(scope.querySelectorAll('.c-alert')).map((el) => initAlert(el)).filter(Boolean);
}
`})))()}var Nr;function Pr(){return(Pr=t((()=>{Nr=`/**
 * Enrich consumer trail → template \`items[]\` for Patterns/Breadcrumb.
 * Spec Frame \`.Breadcrumb · spec\` \`4560:48\`.
 *
 * Output kinds:
 *   { kind: 'link', label, href, homeIconOnly?, truncate?, ariaLabel? }
 *   { kind: 'current', label, truncate? }
 *   { kind: 'separator' }
 *   { kind: 'ellipsis', hiddenLabels, hiddenPagesLabel? }
 *
 * Collapsed (≥3 items): first + ellipsis + last only (Spec Frame).
 * Template also receives \`itemsCollapsed\` so SM CSS can force the
 * compact trail regardless of the \`collapsed\` prop.
 * firstAsIcon default true → icon-only home on first crumb.
 * Truncation is per-item (\`items[].truncate\`), not a root axis.
 */

const DEFAULT_HIDDEN_PAGES_LABEL = 'Hidden pages';

function buildTrail(items, opts = {}) {
  const built = [];
  if (!Array.isArray(items) || items.length === 0) return built;

  const firstAsIcon = opts.firstAsIcon !== false;
  const collapsed = opts.collapsed === true;
  const showCurrentPage = opts.showCurrentPage !== false;
  const hiddenPagesLabel = opts.hiddenPagesLabel || DEFAULT_HIDDEN_PAGES_LABEL;
  const last = items.length - 1;
  const collapsable = collapsed && items.length >= 3;

  const firstHidden = collapsable ? 1 : -1;
  const lastHidden = collapsable ? last - 1 : -1;

  const hiddenLabels = collapsable
    ? items
        .slice(firstHidden, lastHidden + 1)
        .map((it) => (it && it.label) || '')
        .filter(Boolean)
        .join(', ')
    : '';

  for (let i = 0; i <= last; i += 1) {
    const item = items[i] || {};
    const isLast = i === last;
    const isFirst = i === 0;
    const isHiddenByCollapse =
      collapsable && i >= firstHidden && i <= lastHidden;

    if (isHiddenByCollapse) continue;

    if (!isFirst) {
      built.push({ kind: 'separator' });
    }

    if (collapsable && isLast) {
      built.push({
        kind: 'ellipsis',
        hiddenLabels,
        hiddenPagesLabel,
      });
      built.push({ kind: 'separator' });
    }

    if (isLast) {
      if (showCurrentPage) {
        built.push({
          kind: 'current',
          label: item.label ?? 'Current page',
          truncate: item.truncate === true,
        });
      }
    } else if (isFirst) {
      if (firstAsIcon) {
        built.push({
          kind: 'link',
          label: item.label ?? '',
          href: item.href ?? '#',
          homeIconOnly: true,
          ariaLabel: item.ariaLabel || item.label || 'Home',
          truncate: item.truncate === true,
        });
      } else {
        built.push({
          kind: 'link',
          label: item.label ?? '',
          href: item.href ?? '#',
          truncate: item.truncate === true,
        });
      }
    } else {
      built.push({
        kind: 'link',
        label: item.label ?? '',
        href: item.href ?? '#',
        truncate: item.truncate === true,
      });
    }
  }

  return built;
}

export function buildCrumbsFromItems(items, opts = {}) {
  return buildTrail(items, opts);
}

export const defaultBreadcrumbItems = [
  { label: 'Home', href: '/', ariaLabel: 'Home' },
  { label: 'Products', href: '/products' },
  { label: 'Software', href: '/products/software' },
  { label: 'Antivirus' },
];

export const defaultBreadcrumbArgs = {
  items: defaultBreadcrumbItems,
  firstAsIcon: true,
  collapsed: false,
  showCurrentPage: true,
  ariaLabel: 'Breadcrumb',
  hiddenPagesLabel: DEFAULT_HIDDEN_PAGES_LABEL,
  iconType: 'objects/simple-home',
};

export function compileBreadcrumbArgs(args, compiled, items) {
  const merged = { ...defaultBreadcrumbArgs, ...args };
  const trail = items ?? merged.items ?? defaultBreadcrumbItems;
  const shared = {
    firstAsIcon: merged.firstAsIcon !== false,
    showCurrentPage: merged.showCurrentPage !== false,
    hiddenPagesLabel: merged.hiddenPagesLabel,
  };
  const itemsExpanded = buildTrail(trail, {
    ...shared,
    collapsed: false,
  });
  const itemsCollapsed = buildTrail(trail, {
    ...shared,
    collapsed: true,
  });
  const collapsed = merged.collapsed === true;
  return compiled({
    firstAsIcon: shared.firstAsIcon,
    collapsed,
    showCurrentPage: shared.showCurrentPage,
    ariaLabel: merged.ariaLabel,
    hiddenPagesLabel: merged.hiddenPagesLabel,
    iconType: merged.iconType,
    // When collapsed prop is true, only emit compact list (a11y: one nav).
    // When false, emit both so SM CSS can swap without JS.
    items: collapsed ? itemsCollapsed : itemsExpanded,
    itemsCollapsed: collapsed ? null : itemsCollapsed,
    dualList: !collapsed && trail.length >= 3,
  });
}
`})))()}var Fr;function Ir(){return(Ir=t((()=>{Fr=`/**
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
`})))()}var Lr;function Rr(){return(Rr=t((()=>{Lr=`import { SAMPLE_IMAGE } from '../../helpers/sample-image.js';

export const RATIO_OPTIONS = ['16-9', '4-3', '1-1', '3-4', '2-1'];
export const ALIGNMENT_OPTIONS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

export const defaultCardArgs = {
  ratio: '16-9',
  alignment: 'bottom-left',
  imageSrc: SAMPLE_IMAGE,
  imageAlt: '',
  label: 'label',
  showLabel: true,
  title: 'Your identity, secured',
  body: 'We detect changes to your SSN, address, and personal info, and remove your data from broker sites.',
  category: 'Identity theft protection',
  showCategory: true,
  footerLabel: '2 min read',
  footerHref: '#',
  showFooter: true,
};

export function normalizeCardArgs(args = {}) {
  let ratio = String(args.ratio || '16-9').toLowerCase().replace(':', '-');
  if (!RATIO_OPTIONS.includes(ratio)) ratio = '16-9';

  return {
    ratio,
    alignment: String(args.alignment || 'bottom-left').toLowerCase(),
    imageSrc: args.imageSrc || SAMPLE_IMAGE,
    imageAlt: args.imageAlt || '',
    label: args.label || 'label',
    showLabel: args.showLabel !== false,
    title: args.title || 'Your identity, secured',
    body:
      args.body ||
      'We detect changes to your SSN, address, and personal info, and remove your data from broker sites.',
    category: args.category || 'Identity theft protection',
    showCategory: args.showCategory !== false,
    footerLabel: args.footerLabel || '2 min read',
    footerHref: args.footerHref || '#',
    showFooter: args.showFooter !== false,
    className: args.className || '',
  };
}

export function compileCardArgs(args, compiled) {
  return compiled(normalizeCardArgs(args));
}
`})))()}var zr;function Br(){return(Br=t((()=>{zr=`/**
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
`})))()}var Vr;function Hr(){return(Hr=t((()=>{Vr=`/**
 * Patterns/Inputs/Code entry behaviour layer.
 *
 * Progressive enhancement on top of the row of native single-character
 * \`<input>\` boxes the template emits. The SCSS paints every state; this
 * layer adds the OTP interaction model:
 *
 *   1. Auto-advance to the next box after a digit is entered.
 *   2. Backspace-to-previous when a box is already empty.
 *   3. Arrow-left / arrow-right move focus across boxes.
 *   4. Paste spreads the clipboard digits across the boxes from the
 *      caret position.
 *   5. Keep each box's \`is-filled\` modifier in sync and dispatch the
 *      namespaced \`lifelock:code-entry:input\` (every change) and
 *      \`lifelock:code-entry:complete\` (every box filled) CustomEvents.
 *
 * Only digits are accepted (the boxes are \`inputmode="numeric"\`).
 * Public API documented in \`./spec.md\` § "JavaScript API".
 */

/**
 * @typedef {Object} CodeEntryInstance
 * @property {() => string} getValue
 * @property {(next: string) => void} setValue
 * @property {() => void} clear
 * @property {(disabled: boolean) => void} setDisabled
 * @property {() => void} destroy
 */

function dispatch(root, name, detail) {
  root.dispatchEvent(
    new CustomEvent(name, { detail, bubbles: true, composed: true }),
  );
}

const NOOP_INSTANCE = {
  getValue: () => "",
  setValue: () => {},
  clear: () => {},
  setDisabled: () => {},
  destroy: () => {},
};

/**
 * Initialise one code-entry root.
 *
 * @param {HTMLElement} root
 * @returns {CodeEntryInstance}
 */
export function initCodeEntry(root) {
  if (!root || root.dataset.codeEntryInitialised === "true") {
    return /** @type {CodeEntryInstance} */ ({ ...NOOP_INSTANCE });
  }
  root.dataset.codeEntryInitialised = "true";

  /** @type {HTMLInputElement[]} */
  const boxes = Array.from(root.querySelectorAll(".c-code-entry__box"));
  if (boxes.length === 0) {
    return /** @type {CodeEntryInstance} */ ({
      ...NOOP_INSTANCE,
      destroy() {
        delete root.dataset.codeEntryInitialised;
      },
    });
  }

  function value() {
    return boxes.map((b) => b.value).join("");
  }

  function syncFilled(box) {
    box.classList.toggle("is-filled", box.value.length > 0);
  }

  function emit() {
    const v = value();
    dispatch(root, "lifelock:code-entry:input", { value: v });
    if (v.length === boxes.length) {
      dispatch(root, "lifelock:code-entry:complete", { value: v });
    }
  }

  function focusBox(index) {
    const box = boxes[index];
    if (!box) return;
    box.focus();
    box.select();
  }

  /** @param {InputEvent} e */
  function onInput(e) {
    const box = /** @type {HTMLInputElement} */ (e.target);
    const index = Number(box.dataset.index);
    const digits = box.value.replace(/\\D/g, "");
    box.value = digits.slice(-1);
    syncFilled(box);
    if (box.value && index < boxes.length - 1) focusBox(index + 1);
    emit();
  }

  /** @param {KeyboardEvent} e */
  function onKeydown(e) {
    const box = /** @type {HTMLInputElement} */ (e.target);
    const index = Number(box.dataset.index);
    if (e.key === "Backspace" && !box.value && index > 0) {
      e.preventDefault();
      const prev = boxes[index - 1];
      prev.value = "";
      syncFilled(prev);
      focusBox(index - 1);
      emit();
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusBox(index - 1);
    } else if (e.key === "ArrowRight" && index < boxes.length - 1) {
      e.preventDefault();
      focusBox(index + 1);
    }
  }

  /** @param {ClipboardEvent} e */
  function onPaste(e) {
    e.preventDefault();
    const box = /** @type {HTMLInputElement} */ (e.target);
    const startIndex = Number(box.dataset.index);
    const clip = e.clipboardData ? e.clipboardData.getData("text") : "";
    const digits = clip.replace(/\\D/g, "");
    if (!digits) return;
    let cursor = startIndex;
    for (const char of digits) {
      if (cursor >= boxes.length) break;
      boxes[cursor].value = char;
      syncFilled(boxes[cursor]);
      cursor += 1;
    }
    focusBox(Math.min(cursor, boxes.length - 1));
    emit();
  }

  for (const box of boxes) {
    box.addEventListener("input", onInput);
    box.addEventListener("keydown", onKeydown);
    box.addEventListener("paste", onPaste);
    syncFilled(box);
  }

  return {
    getValue() {
      return value();
    },
    setValue(next) {
      const digits = String(next ?? "").replace(/\\D/g, "");
      boxes.forEach((box, i) => {
        box.value = digits[i] ?? "";
        syncFilled(box);
      });
      emit();
    },
    clear() {
      for (const box of boxes) {
        box.value = "";
        syncFilled(box);
      }
      focusBox(0);
      emit();
    },
    setDisabled(disabled) {
      const next = Boolean(disabled);
      for (const box of boxes) box.disabled = next;
      root.classList.toggle("is-disabled", next);
    },
    destroy() {
      for (const box of boxes) {
        box.removeEventListener("input", onInput);
        box.removeEventListener("keydown", onKeydown);
        box.removeEventListener("paste", onPaste);
      }
      delete root.dataset.codeEntryInitialised;
    },
  };
}

/**
 * Initialise every code-entry inside a scope.
 *
 * @param {ParentNode} [scope]
 * @returns {CodeEntryInstance[]}
 */
export function initCodeEntries(scope) {
  const root =
    scope && typeof scope.querySelectorAll === "function"
      ? scope
      : typeof document !== "undefined"
        ? document
        : null;
  if (!root) return [];
  return Array.from(root.querySelectorAll(".c-code-entry")).map((el) =>
    initCodeEntry(/** @type {HTMLElement} */ (el)),
  );
}
`})))()}var Ur;function Wr(){return(Wr=t((()=>{Ur=`/**
 * Content list helpers — ordered markers + icon name resolution.
 */

/**
 * @param {import('handlebars').HelperDelegate | typeof import('handlebars')} Handlebars
 */
export function registerContentListHelpers(Handlebars) {
  Handlebars.registerHelper('contentListOrderedMarker', (itemIndex) => {
    const n = Number(itemIndex);
    return \`\${Number.isFinite(n) ? n + 1 : 1}.\`;
  });

  Handlebars.registerHelper('contentListIconName', (itemIcon, listIcon) => {
    return (
      itemIcon ||
      listIcon ||
      'status/simple-checkmark-small'
    );
  });
}
`})))()}var Gr;function Kr(){return(Kr=t((()=>{Gr=`/**
 * Package-local logo fixtures under \`assets/logos/\` (staticDirs → \`/assets\`).
 * Paths are base-prefixed via \`assetUrl\` for composed / Pages subpath deploys.
 */
import { assetUrl } from '../../helpers/asset-url.js';

export const LOGO_FIXTURES = {
  horizontal: assetUrl('assets/logos/horizontal.svg'),
  stacked: assetUrl('assets/logos/stacked.svg'),
  checkmark: assetUrl('assets/logos/checkmark.svg'),
};

/** Gen corporate mark used by Lower footer demos. */
export const GEN_HORIZONTAL_LOGO = assetUrl('assets/logos/gen-horizontal.svg');
`})))()}var qr;function Jr(){return(Jr=t((()=>{qr=`import { GEN_HORIZONTAL_LOGO } from '../logo-wrapper/logo-wrapper-fixtures.js';

export const THEME_OPTIONS = ['light', 'dark'];

export const DEFAULT_LINKS = [
  { label: 'About Gen', href: '#' },
  { label: 'Newsroom', href: '#' },
  { label: 'Partner with us', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Legal', href: '#' },
  { label: 'Security', href: '#' },
  { label: 'Terms of use', href: '#' },
  { label: 'Accessibility', href: '#' },
  { label: 'Your Privacy choice', href: '#' },
  { label: 'Privacy setting', href: '#' },
];

const TRADEMARK_BOILERPLATE =
  'Gen trademarks or registered trademarks are property of Gen Digital Inc. or its affiliates. Firefox is a trademark of Mozilla Foundation. Android, Google Chrome, Google Play and the Google Play logo are trademarks of Google, LLC. Mac, iPhone, iPad, Apple and the Apple logo are trademarks of Apple Inc., registered in the U.S. and other countries. App Store is a service mark of Apple Inc. Alexa and all related logos are trademarks of Amazon.com, Inc. or its affiliates. Microsoft and the Window logo are trademarks of Microsoft Corporation in the U.S. and other countries. The Android robot is reproduced or modified from work created and shared by Google and used according to terms described in the Creative Commons 3.0 Attribution License. Other names may be trademarks of their respective owners.';

export function buildCopyrightText(year, extra) {
  const y = year || new Date().getFullYear();
  if (extra) return extra;
  return \`Copyright © \${y} Gen Digital Inc. All rights reserved. \${TRADEMARK_BOILERPLATE}\`;
}

export function buildStatement(brandName, statement) {
  if (statement) return statement;
  const brand = brandName || '[Brand]';
  return \`\${brand} is part of Gen – a global company with a family of trusted brands.\`;
}

export function normalizeLinks(links) {
  const source = Array.isArray(links) && links.length ? links : DEFAULT_LINKS;
  return source.map((link, index) => {
    const text = link.text || link.label || \`Link \${index + 1}\`;
    const isLast = index === source.length - 1;
    return {
      text,
      href: link.href || '#',
      showRightBorder: !isLast,
      rightIcon: Boolean(link.rightIcon),
      rightIconName: link.rightIconName || '',
      role: 'listitem',
      edgePadding: true,
    };
  });
}

export const defaultLowerFooterArgs = {
  theme: 'light',
  showLowerLinks: true,
  logoSrc: GEN_HORIZONTAL_LOGO,
  logoAlt: 'Gen',
  brandName: '[Brand]',
  statement: '',
  copyrightYear: new Date().getFullYear(),
  copyrightText: '',
  links: DEFAULT_LINKS,
  navLabel: 'Legal and company links',
};

export function normalizeLowerFooterArgs(args = {}) {
  const theme = String(args.theme || 'light').toLowerCase() === 'dark' ? 'dark' : 'light';
  const brandName = args.brandName || '[Brand]';
  const copyrightYear = args.copyrightYear || new Date().getFullYear();

  return {
    theme,
    showLowerLinks: args.showLowerLinks !== false,
    logoSrc: args.logoSrc || GEN_HORIZONTAL_LOGO,
    logoAlt: args.logoAlt ?? 'Gen',
    brandName,
    statement: buildStatement(brandName, args.statement),
    copyrightYear,
    copyrightText: buildCopyrightText(copyrightYear, args.copyrightText),
    links: normalizeLinks(args.links),
    navLabel: args.navLabel || 'Legal and company links',
    dividerInverse: theme === 'dark',
    className: args.className || '',
  };
}

export function compileLowerFooterArgs(args, compiled) {
  return compiled(normalizeLowerFooterArgs(args));
}
`})))()}var Yr;function Xr(){return(Xr=t((()=>{Yr=`/**
 * Handlebars helpers for Molecules/Media.
 */

export function youtubeEmbedUrl(raw) {
  const value = String(raw ?? '').trim();
  if (!value) return '';
  if (/^[A-Za-z0-9_-]{11}$/.test(value)) {
    return \`https://www.youtube.com/embed/\${value}\`;
  }
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\\./, '');
    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) {
        return \`https://www.youtube.com/embed/\${id}\`;
      }
    }
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      const fromQuery = url.searchParams.get('v');
      if (fromQuery && /^[A-Za-z0-9_-]{11}$/.test(fromQuery)) {
        return \`https://www.youtube.com/embed/\${fromQuery}\`;
      }
      const parts = url.pathname.split('/').filter(Boolean);
      const markers = ['embed', 'shorts', 'live', 'v'];
      for (let i = 0; i < parts.length - 1; i += 1) {
        if (markers.includes(parts[i]) && /^[A-Za-z0-9_-]{11}$/.test(parts[i + 1])) {
          return \`https://www.youtube.com/embed/\${parts[i + 1]}\`;
        }
      }
    }
  } catch {
    // fall through
  }
  return '';
}

export function registerMediaHelpers(Handlebars) {
  Handlebars.registerHelper('youtubeEmbedUrl', youtubeEmbedUrl);
}
`})))()}var Zr;function Qr(){return(Qr=t((()=>{Zr=`/**
 * Patterns/Menu block — progressive-enhancement for popup mode.
 *
 * Static / anchored usage needs no JS. When \`data-mode="popup"\`, wire a
 * trigger (\`[aria-controls="<id>"]\` or \`data-menu-block-trigger\` pointing
 * at the block id) for open/close, focus first Row, Arrow/Home/End,
 * Escape, and Tab wrap among row controls.
 *
 * Events: \`lifelock:menu-block:{open,close,select}\`
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

function rowControls(root) {
  return Array.from(
    root.querySelectorAll(
      '.c-menu-list--row:not(.is-disabled) .c-menu-list__control',
    ),
  );
}

function dispatch(root, type, detail) {
  root.dispatchEvent(
    new CustomEvent(\`lifelock:menu-block:\${type}\`, {
      bubbles: true,
      composed: true,
      detail,
    }),
  );
}

function findTrigger(root) {
  const id = root.id;
  if (!id || typeof document === 'undefined') return null;
  return (
    document.querySelector(\`[aria-controls="\${id}"]\`) ||
    document.querySelector(\`[data-menu-block-trigger="\${id}"]\`)
  );
}

/**
 * @param {HTMLElement} root
 * @param {{ trigger?: HTMLElement | null }} [options]
 */
export function initMenuBlock(root, options = {}) {
  if (!root || root.dataset.menuBlockInitialized === 'true') {
    return null;
  }
  if (root.getAttribute('data-mode') !== 'popup') {
    return null;
  }
  root.dataset.menuBlockInitialized = 'true';

  const trigger =
    options.trigger ||
    findTrigger(root) ||
    null;

  function isOpen() {
    return !root.hasAttribute('hidden');
  }

  function open(source = 'api') {
    root.removeAttribute('hidden');
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'true');
      trigger.setAttribute('aria-haspopup', 'menu');
    }
    const rows = rowControls(root);
    if (rows[0]) rows[0].focus();
    dispatch(root, 'open', { source });
  }

  function close(source = 'api') {
    root.setAttribute('hidden', '');
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
      if (source !== 'api') trigger.focus();
    }
    dispatch(root, 'close', { source });
  }

  function toggle(source = 'api') {
    if (isOpen()) close(source);
    else open(source);
  }

  function onTriggerClick(event) {
    event.preventDefault();
    toggle('trigger');
  }

  function onKeydown(event) {
    if (!isOpen()) return;
    const rows = rowControls(root);
    if (!rows.length) return;
    const current = document.activeElement;
    const index = rows.indexOf(current);

    if (event.key === 'Escape') {
      event.preventDefault();
      close('keyboard');
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = index < 0 ? 0 : (index + 1) % rows.length;
      rows[next].focus();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const next = index < 0 ? rows.length - 1 : (index - 1 + rows.length) % rows.length;
      rows[next].focus();
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      rows[0].focus();
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      rows[rows.length - 1].focus();
      return;
    }

    if (event.key === 'Tab' && rows.length) {
      if (event.shiftKey && current === rows[0]) {
        event.preventDefault();
        rows[rows.length - 1].focus();
      } else if (!event.shiftKey && current === rows[rows.length - 1]) {
        event.preventDefault();
        rows[0].focus();
      }
    }
  }

  function onSelect(event) {
    const control = event.target.closest?.('.c-menu-list__control');
    if (!control || !root.contains(control)) return;
    const item = control.closest('.c-menu-list--row');
    dispatch(root, 'select', {
      text: item?.querySelector('.c-menu-list__label')?.textContent?.trim() || '',
      source: 'pointer',
    });
  }

  if (trigger) {
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', isOpen() ? 'true' : 'false');
    if (root.id) trigger.setAttribute('aria-controls', root.id);
    trigger.addEventListener('click', onTriggerClick);
  }

  root.addEventListener('keydown', onKeydown);
  root.addEventListener('click', onSelect);

  return {
    open,
    close,
    toggle,
    destroy() {
      if (trigger) trigger.removeEventListener('click', onTriggerClick);
      root.removeEventListener('keydown', onKeydown);
      root.removeEventListener('click', onSelect);
      delete root.dataset.menuBlockInitialized;
    },
  };
}

/**
 * @param {ParentNode} [scope]
 */
export function initMenuBlocks(scope = document) {
  const roots = scope.querySelectorAll?.(
    '[data-component="menu-block"][data-mode="popup"]',
  );
  if (!roots) return [];
  return Array.from(roots)
    .map((root) => initMenuBlock(root))
    .filter(Boolean);
}

export { prefersReducedMotion };
`})))()}var $r;function ei(){return(ei=t((()=>{$r=`/**
 * Patterns/Modal — progressive-enhancement open/close + focus trap.
 *
 * Wire a trigger with \`aria-controls="<modal id>"\` (or
 * \`data-modal-trigger="<id>"\`). Events: \`lifelock:modal:{open,close}\`.
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function dispatch(root, type, detail) {
  root.dispatchEvent(
    new CustomEvent(\`lifelock:modal:\${type}\`, {
      bubbles: true,
      composed: true,
      detail,
    }),
  );
}

function findTrigger(root) {
  const id = root.id;
  if (!id || typeof document === 'undefined') return null;
  return (
    document.querySelector(\`[aria-controls="\${id}"]\`) ||
    document.querySelector(\`[data-modal-trigger="\${id}"]\`)
  );
}

function focusables(card) {
  return Array.from(card.querySelectorAll(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true',
  );
}

/**
 * @param {HTMLElement} root
 * @param {{ trigger?: HTMLElement | null, initialFocus?: HTMLElement | null }} [options]
 */
export function initModal(root, options = {}) {
  if (!root || root.dataset.modalInitialized === 'true') return null;
  root.dataset.modalInitialized = 'true';

  const card = root.querySelector('[data-modal-card]') || root.querySelector('.c-modal__card');
  const backdrop = root.querySelector('[data-modal-backdrop]');
  const closeBtn = root.querySelector('[data-modal-close]');
  const trigger = options.trigger || findTrigger(root);
  let lastFocus = null;

  function isOpen() {
    return !root.hasAttribute('hidden');
  }

  function open(source = 'api') {
    lastFocus = document.activeElement;
    root.removeAttribute('hidden');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    const nodes = card ? focusables(card) : [];
    const initial =
      options.initialFocus ||
      (card && card.querySelector('[data-modal-initial-focus]')) ||
      closeBtn ||
      nodes[0];
    if (initial && typeof initial.focus === 'function') initial.focus();
    dispatch(root, 'open', { source, root });
  }

  function close(source = 'api') {
    root.setAttribute('hidden', '');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    dispatch(root, 'close', { source, root });
    const restore = lastFocus || trigger;
    if (restore && typeof restore.focus === 'function' && source !== 'api') {
      restore.focus();
    }
  }

  function onKeydown(event) {
    if (!isOpen()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close('keyboard');
      return;
    }
    if (event.key !== 'Tab' || !card) return;
    const nodes = focusables(card);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function onBackdropClick(event) {
    if (event.target === backdrop) close('backdrop');
  }

  function onCloseClick(event) {
    event.preventDefault();
    close('close-button');
  }

  function onTriggerClick(event) {
    event.preventDefault();
    if (isOpen()) close('trigger');
    else open('trigger');
  }

  if (trigger) {
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', isOpen() ? 'true' : 'false');
    if (root.id) trigger.setAttribute('aria-controls', root.id);
    trigger.addEventListener('click', onTriggerClick);
  }
  if (backdrop) backdrop.addEventListener('click', onBackdropClick);
  if (closeBtn) closeBtn.addEventListener('click', onCloseClick);
  root.addEventListener('keydown', onKeydown);

  return {
    open,
    close,
    destroy() {
      if (trigger) trigger.removeEventListener('click', onTriggerClick);
      if (backdrop) backdrop.removeEventListener('click', onBackdropClick);
      if (closeBtn) closeBtn.removeEventListener('click', onCloseClick);
      root.removeEventListener('keydown', onKeydown);
      delete root.dataset.modalInitialized;
    },
  };
}

/**
 * @param {ParentNode} [scope]
 */
export function initModals(scope = document) {
  const roots = scope.querySelectorAll?.('[data-component="modal"]');
  if (!roots) return [];
  return Array.from(roots)
    .map((root) => initModal(root))
    .filter(Boolean);
}
`})))()}var ti;function ni(){return(ni=t((()=>{ti=`/**
 * Build the numbered page model for Pagination nav truncation.
 *
 * @param {{ currentPage: number, totalPages: number, siblingCount?: number, truncate?: boolean }} opts
 * @returns {Array<{ kind: 'page'|'ellipsis', page?: number, current?: boolean }>}
 */
export function buildPaginationPages({
  currentPage = 1,
  totalPages = 5,
  siblingCount = 1,
  truncate = true,
} = {}) {
  const total = Math.max(1, Number(totalPages) || 1);
  const current = Math.min(total, Math.max(1, Number(currentPage) || 1));
  const siblings = Math.max(0, Number(siblingCount) || 0);

  if (!truncate || total <= siblings * 2 + 5) {
    return Array.from({ length: total }, (_, i) => ({
      kind: 'page',
      page: i + 1,
      current: i + 1 === current,
    }));
  }

  const pages = new Set([1, total, current]);
  for (let i = current - siblings; i <= current + siblings; i += 1) {
    if (i >= 1 && i <= total) pages.add(i);
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  for (const page of sorted) {
    if (prev && page - prev > 1) {
      out.push({ kind: 'ellipsis' });
    }
    out.push({ kind: 'page', page, current: page === current });
    prev = page;
  }
  return out;
}

export function registerPaginationHelpers(Handlebars) {
  Handlebars.registerHelper('paginationPages', (currentPage, totalPages, siblingCount, truncate) =>
    buildPaginationPages({
      currentPage,
      totalPages,
      siblingCount,
      truncate: truncate !== false,
    }),
  );
}
`})))()}var ri;function ii(){return(ii=t((()=>{ri=`/**
 * Patterns/Pagination — nav / select / jump interactions.
 * Events: \`lifelock:pagination:change\` detail \`{ page, root, source }\`
 */

function dispatchChange(root, page, source) {
  root.dispatchEvent(
    new CustomEvent('lifelock:pagination:change', {
      bubbles: true,
      composed: true,
      detail: { page, root, source },
    }),
  );
}

function clampPage(page, total) {
  const max = Math.max(1, Number(total) || 1);
  return Math.min(max, Math.max(1, Number(page) || 1));
}

/**
 * @param {HTMLElement} root
 * @param {{ currentPage?: number, totalPages?: number, onChange?: (page:number)=>void }} [options]
 */
export function initPagination(root, options = {}) {
  if (!root || root.dataset.paginationInitialized === 'true') return null;
  root.dataset.paginationInitialized = 'true';

  const type = root.getAttribute('data-pagination-type') || 'nav';
  let currentPage = Number(options.currentPage || root.dataset.currentPage || 1);
  let totalPages = Number(options.totalPages || root.dataset.totalPages || 1);

  function setPage(page, source) {
    currentPage = clampPage(page, totalPages);
    root.dataset.currentPage = String(currentPage);
    if (typeof options.onChange === 'function') options.onChange(currentPage);
    dispatchChange(root, currentPage, source);
  }

  function onNavClick(event) {
    const btn = event.target.closest?.('[data-pagination-page], [data-pagination-step]');
    if (!btn || !root.contains(btn) || btn.disabled) return;
    event.preventDefault();
    if (btn.hasAttribute('data-pagination-step')) {
      const step = Number(btn.getAttribute('data-pagination-step')) || 0;
      setPage(currentPage + step, 'nav');
      return;
    }
    setPage(btn.getAttribute('data-pagination-page'), 'nav');
  }

  function onSelectTrigger(event) {
    event.preventDefault();
    const open = root.classList.toggle('is-open');
    const trigger = root.querySelector('[data-pagination-select-trigger]');
    if (trigger) trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function onSelectItem(event) {
    const control = event.target.closest?.('.c-menu-list__control');
    if (!control || !root.contains(control)) return;
    const row = control.closest('.c-menu-list--row');
    const page = Number(row?.getAttribute('data-page') || control.textContent);
    if (!Number.isFinite(page)) return;
    root.classList.remove('is-open');
    const trigger = root.querySelector('[data-pagination-select-trigger]');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    setPage(page, 'select');
  }

  function onJumpSubmit(event) {
    event.preventDefault();
    const input = root.querySelector('[data-pagination-jump-input]');
    if (!input) return;
    setPage(input.value, 'jump');
  }

  function onJumpKeydown(event) {
    if (event.key === 'Enter') onJumpSubmit(event);
  }

  if (type === 'nav') root.addEventListener('click', onNavClick);
  if (type === 'select') {
    const trigger = root.querySelector('[data-pagination-select-trigger]');
    if (trigger) trigger.addEventListener('click', onSelectTrigger);
    root.addEventListener('click', onSelectItem);
  }
  if (type === 'jump') {
    const submit = root.querySelector('[data-pagination-jump-submit]');
    const input = root.querySelector('[data-pagination-jump-input]');
    if (submit) submit.addEventListener('click', onJumpSubmit);
    if (input) input.addEventListener('keydown', onJumpKeydown);
  }

  return {
    setPage: (page) => setPage(page, 'api'),
    getPage: () => currentPage,
    destroy() {
      root.removeEventListener('click', onNavClick);
      root.removeEventListener('click', onSelectItem);
      const trigger = root.querySelector('[data-pagination-select-trigger]');
      if (trigger) trigger.removeEventListener('click', onSelectTrigger);
      const submit = root.querySelector('[data-pagination-jump-submit]');
      const input = root.querySelector('[data-pagination-jump-input]');
      if (submit) submit.removeEventListener('click', onJumpSubmit);
      if (input) input.removeEventListener('keydown', onJumpKeydown);
      delete root.dataset.paginationInitialized;
    },
  };
}

export function initPaginations(scope = document) {
  const roots = scope.querySelectorAll?.('[data-component="pagination"]');
  if (!roots) return [];
  return Array.from(roots)
    .map((root) => initPagination(root))
    .filter(Boolean);
}
`})))()}var ai;function oi(){return(oi=t((()=>{ai=`/**
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
`})))()}var si;function ci(){return(ci=t((()=>{si=`/**
 * Rating helpers — star ladder + Trustpilot tier colour.
 * Used by stories (and available to Handlebars if registered).
 */

export const RATING_TYPE_OPTIONS = [
  'teaser',
  'inline',
  'text-led',
  'trustpilot',
  'trustpilot-teaser',
];

/** Trustpilot brand tier fills (approx. Star Combinations palette). */
export const TRUSTPILOT_TIER_COLORS = {
  1: '#ff3722',
  2: '#ff8622',
  3: '#ffce00',
  4: '#73cf11',
  5: '#00b67a',
};

/**
 * @param {number} value 0–5, step 0.5
 * @returns {{ fill: 'full'|'half'|'empty' }[]}
 */
export function buildStarLadder(value) {
  const v = Math.min(5, Math.max(0, Number(value) || 0));
  const stars = [];
  for (let i = 1; i <= 5; i += 1) {
    if (v >= i) stars.push({ fill: 'full' });
    else if (v >= i - 0.5) stars.push({ fill: 'half' });
    else stars.push({ fill: 'empty' });
  }
  return stars;
}

/**
 * @param {number} value
 * @returns {string} hex
 */
export function trustpilotTierColor(value) {
  const tier = Math.max(1, Math.min(5, Math.ceil(Number(value) || 0)));
  return TRUSTPILOT_TIER_COLORS[tier] || TRUSTPILOT_TIER_COLORS[5];
}

/**
 * Format score for display (always one decimal when not integer-ish).
 * @param {number} value
 */
export function formatScore(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0.0';
  return n % 1 === 0 ? n.toFixed(1) : String(n);
}
`})))()}var li;function ui(){return(ui=t((()=>{li=`/**
 * Patterns/Inputs/Search box behaviour layer.
 *
 * Progressive enhancement on top of the native
 * \`<input type="search">\`. The SCSS paints every visual state; this
 * layer's only jobs are:
 *
 *   1. Mirror the input's filled / empty state onto the root's
 *      \`is-filled\` modifier so the clear button shows once there is
 *      text to clear.
 *   2. Empty + refocus the input when the clear button is pressed.
 *   3. Dispatch namespaced \`lifelock:search-box:input\` and
 *      \`lifelock:search-box:clear\` CustomEvents.
 *
 * Public API documented in \`./spec.md\` § "JavaScript API".
 */

/**
 * @typedef {Object} SearchBoxInstance
 * @property {() => string} getValue
 * @property {(next: string) => void} setValue
 * @property {() => void} clear
 * @property {(disabled: boolean) => void} setDisabled
 * @property {() => void} destroy
 */

function dispatch(root, name, detail) {
  root.dispatchEvent(
    new CustomEvent(name, { detail, bubbles: true, composed: true }),
  );
}

const NOOP_INSTANCE = {
  getValue: () => "",
  setValue: () => {},
  clear: () => {},
  setDisabled: () => {},
  destroy: () => {},
};

/**
 * Initialise one search-box root.
 *
 * @param {HTMLElement} root
 * @returns {SearchBoxInstance}
 */
export function initSearchBox(root) {
  if (!root || root.dataset.searchBoxInitialised === "true") {
    return /** @type {SearchBoxInstance} */ ({ ...NOOP_INSTANCE });
  }
  root.dataset.searchBoxInitialised = "true";

  /** @type {HTMLInputElement | null} */
  const input = root.querySelector(".c-search-box__input");
  /** @type {HTMLButtonElement | null} */
  const clearBtn = root.querySelector(".c-search-box__clear");

  if (!input) {
    return /** @type {SearchBoxInstance} */ ({
      ...NOOP_INSTANCE,
      destroy() {
        delete root.dataset.searchBoxInitialised;
      },
    });
  }

  function syncFilled() {
    root.classList.toggle("is-filled", input.value.length > 0);
  }

  function onInput() {
    syncFilled();
    dispatch(root, "lifelock:search-box:input", { value: input.value });
  }

  function onClear() {
    input.value = "";
    syncFilled();
    input.focus();
    dispatch(root, "lifelock:search-box:clear", {});
    dispatch(root, "lifelock:search-box:input", { value: "" });
  }

  input.addEventListener("input", onInput);
  if (clearBtn) clearBtn.addEventListener("click", onClear);

  syncFilled();

  return {
    getValue() {
      return input.value;
    },
    setValue(next) {
      input.value = String(next ?? "");
      syncFilled();
      dispatch(root, "lifelock:search-box:input", { value: input.value });
    },
    clear() {
      onClear();
    },
    setDisabled(disabled) {
      input.disabled = Boolean(disabled);
      if (clearBtn) clearBtn.disabled = Boolean(disabled);
      root.classList.toggle("is-disabled", Boolean(disabled));
    },
    destroy() {
      input.removeEventListener("input", onInput);
      if (clearBtn) clearBtn.removeEventListener("click", onClear);
      delete root.dataset.searchBoxInitialised;
    },
  };
}

/**
 * Initialise every search-box inside a scope.
 *
 * @param {ParentNode} [scope]
 * @returns {SearchBoxInstance[]}
 */
export function initSearchBoxes(scope) {
  const root =
    scope && typeof scope.querySelectorAll === "function"
      ? scope
      : typeof document !== "undefined"
        ? document
        : null;
  if (!root) return [];
  return Array.from(root.querySelectorAll(".c-search-box")).map((el) =>
    initSearchBox(/** @type {HTMLElement} */ (el)),
  );
}
`})))()}var di;function fi(){return(fi=t((()=>{di=`/**
 * Patterns/Sheet — open/close + focus trap (modal mode).
 * Events: lifelock:sheet:{open,close}
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function dispatch(root, type, detail) {
  root.dispatchEvent(
    new CustomEvent(\`lifelock:sheet:\${type}\`, {
      bubbles: true,
      composed: true,
      detail,
    }),
  );
}

function findTrigger(root) {
  const id = root.id;
  if (!id || typeof document === 'undefined') return null;
  return (
    document.querySelector(\`[aria-controls="\${id}"]\`) ||
    document.querySelector(\`[data-sheet-trigger="\${id}"]\`)
  );
}

function focusables(card) {
  return Array.from(card.querySelectorAll(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true',
  );
}

/**
 * @param {HTMLElement} root
 * @param {{ trigger?: HTMLElement | null, initialFocus?: HTMLElement | null }} [options]
 */
export function initSheet(root, options = {}) {
  if (!root || root.dataset.sheetInitialized === 'true') return null;
  root.dataset.sheetInitialized = 'true';

  const mode = root.dataset.mode || 'modal';
  const isModal = mode !== 'non-modal';
  const card = root.querySelector('[data-sheet-card]') || root.querySelector('.c-sheet__card');
  const backdrop = root.querySelector('[data-sheet-backdrop]');
  const closeBtn = root.querySelector('[data-sheet-close]');
  const trigger = options.trigger || findTrigger(root);
  let lastFocus = null;

  function isOpen() {
    return !root.hasAttribute('hidden');
  }

  function open(source = 'api') {
    lastFocus = document.activeElement;
    root.removeAttribute('hidden');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    if (isModal && card) {
      const nodes = focusables(card);
      const initial =
        options.initialFocus ||
        card.querySelector('[data-sheet-initial-focus]') ||
        closeBtn ||
        nodes[0];
      if (initial && typeof initial.focus === 'function') initial.focus();
    }
    dispatch(root, 'open', { source, root });
  }

  function close(source = 'api') {
    root.setAttribute('hidden', '');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    dispatch(root, 'close', { source, root });
    const restore = lastFocus || trigger;
    if (restore && typeof restore.focus === 'function' && source !== 'api') {
      restore.focus();
    }
  }

  function onKeydown(event) {
    if (!isOpen()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close('keyboard');
      return;
    }
    if (!isModal || event.key !== 'Tab' || !card) return;
    const nodes = focusables(card);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function onBackdropClick(event) {
    if (!isModal) return;
    if (event.target === backdrop) close('backdrop');
  }

  function onCloseClick(event) {
    event.preventDefault();
    close('close-button');
  }

  function onTriggerClick(event) {
    event.preventDefault();
    if (isOpen()) close('trigger');
    else open('trigger');
  }

  if (trigger) {
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', isOpen() ? 'true' : 'false');
    if (root.id) trigger.setAttribute('aria-controls', root.id);
    trigger.addEventListener('click', onTriggerClick);
  }
  if (backdrop) backdrop.addEventListener('click', onBackdropClick);
  if (closeBtn) closeBtn.addEventListener('click', onCloseClick);
  root.addEventListener('keydown', onKeydown);

  return {
    open,
    close,
    destroy() {
      if (trigger) trigger.removeEventListener('click', onTriggerClick);
      if (backdrop) backdrop.removeEventListener('click', onBackdropClick);
      if (closeBtn) closeBtn.removeEventListener('click', onCloseClick);
      root.removeEventListener('keydown', onKeydown);
      delete root.dataset.sheetInitialized;
    },
  };
}

/**
 * @param {ParentNode} [scope]
 */
export function initSheets(scope = document) {
  const roots = scope.querySelectorAll?.('[data-component="sheet"]');
  if (!roots) return [];
  return Array.from(roots)
    .map((root) => initSheet(root))
    .filter(Boolean);
}
`})))()}var pi;function mi(){return(mi=t((()=>{pi=`/**
 * Components/Slider behaviour layer.
 *
 * Progressive enhancement on top of the native \`<input type="range">\`
 * pairs the template emits. The SCSS already paints every visual
 * state from the input's value via CSS custom properties; this
 * layer's only jobs are:
 *
 *   1. Bridge the native input's \`value\` into the visible thumb's
 *      \`--slider-thumb-offset\` and the active-fill's
 *      \`--slider-fill-{start,end}\` whenever the user moves a thumb.
 *   2. On \`selection="range"\`, constrain each input's domain against
 *      the other so the lower thumb can never exceed the upper.
 *   3. On \`variant="discrete"\`, snap to the nearest tick on commit
 *      (pointer-up / keyboard release) when \`snapToTicks\` is true.
 *   4. Dispatch \`lifelock:slider:input\` (every value change) and
 *      \`lifelock:slider:commit\` (on commit) custom events.
 *
 * Public API documented in \`./spec.md\` § "JavaScript API".
 */

/**
 * @typedef {Object} SliderInitOptions
 * @property {boolean} [snapToTicks]
 * @property {"input"|"change"} [commitOn="change"]
 */

/**
 * @typedef {number | { min: number, max: number }} SliderValue
 */

/**
 * @typedef {Object} SliderInstance
 * @property {() => SliderValue} getValue
 * @property {(next: SliderValue) => void} setValue
 * @property {(disabled: boolean) => void} setDisabled
 * @property {() => void} destroy
 */

function pct(value, min, max) {
  if (max === min) return 0;
  const clamped = Math.min(max, Math.max(min, value));
  return ((clamped - min) / (max - min)) * 100;
}

function dispatch(root, name, detail) {
  root.dispatchEvent(
    new CustomEvent(name, { detail, bubbles: true, composed: true }),
  );
}

/**
 * Initialise one slider root.
 *
 * @param {HTMLElement} root
 * @param {SliderInitOptions} [options]
 * @returns {SliderInstance}
 */
export function initSlider(root, options = {}) {
  if (!root || root.dataset.sliderInitialised === "true") {
    return /** @type {SliderInstance} */ ({
      getValue: () => 0,
      setValue: () => {},
      setDisabled: () => {},
      destroy: () => {},
    });
  }
  root.dataset.sliderInitialised = "true";

  const variant = root.dataset.variant || "continuous";
  const selection = root.dataset.selection || "single-value";
  const min = Number(root.dataset.min ?? 0);
  const max = Number(root.dataset.max ?? 100);
  const step = Number(root.dataset.step ?? 1);
  const snapToTicks =
    typeof options.snapToTicks === "boolean"
      ? options.snapToTicks
      : variant === "discrete";
  const commitOn = options.commitOn === "input" ? "input" : "change";

  /** @type {HTMLInputElement[]} */
  const inputs = Array.from(root.querySelectorAll(".c-slider__input"));
  /** @type {HTMLElement | null} */
  const thumbSingle = root.querySelector(
    ".c-slider__thumb:not(.c-slider__thumb--start):not(.c-slider__thumb--end)",
  );
  /** @type {HTMLElement | null} */
  const thumbStart = root.querySelector(".c-slider__thumb--start");
  /** @type {HTMLElement | null} */
  const thumbEnd = root.querySelector(".c-slider__thumb--end");
  /** @type {HTMLElement | null} */
  const fill = root.querySelector(".c-slider__active-fill");
  /** @type {HTMLElement | null} */
  const valueLabelSingle = root.querySelector(
    '.c-slider__value-label[data-role="value"]',
  );
  /** @type {HTMLElement | null} */
  const valueLabelMin = root.querySelector(
    '.c-slider__value-label[data-role="value-min"]',
  );
  /** @type {HTMLElement | null} */
  const valueLabelMax = root.querySelector(
    '.c-slider__value-label[data-role="value-max"]',
  );

  function paint(source) {
    if (selection === "range") {
      const a = Number(inputs[0]?.value ?? min);
      const b = Number(inputs[1]?.value ?? max);
      const lo = Math.min(a, b);
      const hi = Math.max(a, b);
      const loPct = pct(lo, min, max);
      const hiPct = pct(hi, min, max);
      if (thumbStart) thumbStart.style.setProperty("--slider-thumb-offset", \`\${loPct}%\`);
      if (thumbEnd) thumbEnd.style.setProperty("--slider-thumb-offset", \`\${hiPct}%\`);
      if (fill) {
        fill.style.setProperty("--slider-fill-start", \`\${loPct}%\`);
        fill.style.setProperty("--slider-fill-end", \`\${hiPct}%\`);
      }
      if (valueLabelMin) valueLabelMin.textContent = String(lo);
      if (valueLabelMax) valueLabelMax.textContent = String(hi);
      dispatch(root, "lifelock:slider:input", {
        value: { min: lo, max: hi },
        source,
      });
    } else {
      const v = Number(inputs[0]?.value ?? min);
      const vPct = pct(v, min, max);
      if (thumbSingle) thumbSingle.style.setProperty("--slider-thumb-offset", \`\${vPct}%\`);
      if (fill) {
        fill.style.setProperty("--slider-fill-start", "0%");
        fill.style.setProperty("--slider-fill-end", \`\${vPct}%\`);
      }
      if (valueLabelSingle) valueLabelSingle.textContent = String(v);
      dispatch(root, "lifelock:slider:input", { value: v, source });
    }
  }

  function snap(input) {
    if (!snapToTicks) return;
    const v = Number(input.value);
    const stepped = Math.round((v - min) / step) * step + min;
    const clamped = Math.min(max, Math.max(min, stepped));
    if (clamped !== v) input.value = String(clamped);
  }

  // Quantise a numeric value to the slider's step grid regardless of
  // \`snapToTicks\`. Used by \`setValue()\` so programmatic API consumers
  // always land on a representable value — the native input itself
  // already snaps user-initiated drags via its \`step\` attribute.
  function quantise(value) {
    if (!Number.isFinite(step) || step <= 0) return value;
    const stepped = Math.round((value - min) / step) * step + min;
    return Math.min(max, Math.max(min, stepped));
  }

  /** @param {Event} e */
  function onInput(e) {
    if (root.getAttribute("aria-disabled") === "true") return;
    const target = /** @type {HTMLInputElement} */ (e.currentTarget);
    if (selection === "range" && inputs.length === 2) {
      const a = Number(inputs[0].value);
      const b = Number(inputs[1].value);
      if (target === inputs[0] && a > b) inputs[1].value = String(a);
      if (target === inputs[1] && b < a) inputs[0].value = String(b);
    }
    paint("pointer");
  }

  /** @param {Event} e */
  function onChange(e) {
    if (root.getAttribute("aria-disabled") === "true") return;
    const target = /** @type {HTMLInputElement} */ (e.currentTarget);
    snap(target);
    paint("pointer");
    const value =
      selection === "range"
        ? {
            min: Math.min(Number(inputs[0].value), Number(inputs[1].value)),
            max: Math.max(Number(inputs[0].value), Number(inputs[1].value)),
          }
        : Number(inputs[0].value);
    if (commitOn === "change" || commitOn === "input") {
      dispatch(root, "lifelock:slider:commit", { value, source: "pointer" });
    }
  }

  /** @param {KeyboardEvent} e */
  function onKeyUp(e) {
    if (root.getAttribute("aria-disabled") === "true") return;
    if (
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "Home" ||
      e.key === "End" ||
      e.key === "PageUp" ||
      e.key === "PageDown"
    ) {
      const value =
        selection === "range"
          ? {
              min: Math.min(Number(inputs[0].value), Number(inputs[1].value)),
              max: Math.max(Number(inputs[0].value), Number(inputs[1].value)),
            }
          : Number(inputs[0].value);
      dispatch(root, "lifelock:slider:commit", { value, source: "keyboard" });
    }
  }

  inputs.forEach((input) => {
    input.addEventListener("input", onInput);
    input.addEventListener("change", onChange);
    input.addEventListener("keyup", onKeyUp);
  });

  paint("api");

  return {
    getValue() {
      if (selection === "range") {
        return {
          min: Math.min(Number(inputs[0].value), Number(inputs[1].value)),
          max: Math.max(Number(inputs[0].value), Number(inputs[1].value)),
        };
      }
      return Number(inputs[0].value);
    },
    setValue(next) {
      if (selection === "range" && typeof next === "object" && next !== null) {
        inputs[0].value = String(quantise(Number(next.min)));
        inputs[1].value = String(quantise(Number(next.max)));
      } else if (typeof next === "number") {
        inputs[0].value = String(quantise(next));
      }
      paint("api");
    },
    setDisabled(disabled) {
      if (disabled) {
        root.setAttribute("aria-disabled", "true");
        root.classList.add("is-disabled");
        inputs.forEach((i) => (i.disabled = true));
      } else {
        root.removeAttribute("aria-disabled");
        root.classList.remove("is-disabled");
        inputs.forEach((i) => (i.disabled = false));
      }
    },
    destroy() {
      inputs.forEach((input) => {
        input.removeEventListener("input", onInput);
        input.removeEventListener("change", onChange);
        input.removeEventListener("keyup", onKeyUp);
      });
      delete root.dataset.sliderInitialised;
    },
  };
}

/**
 * Initialise every slider inside a scope.
 *
 * @param {ParentNode} [scope]
 * @param {SliderInitOptions} [options]
 * @returns {SliderInstance[]}
 */
export function initSliders(scope, options) {
  const root =
    scope && typeof scope.querySelectorAll === "function"
      ? scope
      : typeof document !== "undefined"
      ? document
      : null;
  if (!root) return [];
  return Array.from(root.querySelectorAll(".c-slider")).map((el) =>
    initSlider(/** @type {HTMLElement} */ (el), options),
  );
}
`})))()}var hi;function gi(){return(gi=t((()=>{hi=`/**
 * Build the \`steps\` array the Handlebars template consumes from flat Storybook
 * args that mirror the Figma component-property names (\`showStep2\` … \`step3State\`).
 */
export function buildStepsFromArgs(args) {
  const steps = [];

  for (let index = 1; index <= 6; index += 1) {
    const visible = index === 1 || args[\`showStep\${index}\`] !== false;
    if (!visible) continue;

    const state = String(args[\`step\${index}State\`] ?? 'default').toLowerCase();
    steps.push({
      number: args[\`step\${index}Number\`] ?? index,
      state,
      showLabel: Boolean(args[\`step\${index}ShowLabel\`]),
      label: args[\`step\${index}Label\`] ?? 'Label',
      isActive: state === 'active',
    });
  }

  steps.forEach((step, stepIndex) => {
    step.showConnector = stepIndex < steps.length - 1;
  });

  return steps;
}

export const STEP_STATE_OPTIONS = ['default', 'active', 'complete'];
export const DIRECTION_OPTIONS = ['horizontal', 'vertical'];

export const defaultStepperArgs = {
  direction: 'horizontal',
  ariaLabel: 'Checkout progress',
  showStep2: true,
  showStep3: true,
  showStep4: true,
  showStep5: true,
  showStep6: true,
  step1State: 'active',
  step1Number: 1,
  step1ShowLabel: false,
  step1Label: 'Account',
  step2State: 'default',
  step2Number: 2,
  step2ShowLabel: false,
  step2Label: 'Shipping',
  step3State: 'default',
  step3Number: 3,
  step3ShowLabel: false,
  step3Label: 'Payment',
  step4State: 'default',
  step4Number: 4,
  step4ShowLabel: false,
  step4Label: 'Review',
  step5State: 'default',
  step5Number: 5,
  step5ShowLabel: false,
  step5Label: 'Confirm',
  step6State: 'default',
  step6Number: 6,
  step6ShowLabel: false,
  step6Label: 'Done',
};

export function compileStepperArgs(args, compiled) {
  const merged = { ...defaultStepperArgs, ...args };
  return compiled({
    direction: merged.direction,
    ariaLabel: merged.ariaLabel,
    steps: buildStepsFromArgs(merged),
  });
}
`})))()}var _i;function vi(){return(vi=t((()=>{_i=`/**
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
`})))()}var yi;function bi(){return(bi=t((()=>{yi=`/**
 * Build default demo rows for Table block (header + 3 body × 3 cols)
 * matching Figma \`5914:53\`.
 */

import { DEFAULT_ICON } from '../table-cell/table-cell-story-helpers.js';

export function cell(overrides = {}) {
  return {
    type: 'body',
    align: 'left',
    background: true,
    borders: true,
    topBorder: true,
    rightBorder: true,
    bottomBorder: true,
    leftBorder: true,
    leadingIcon: false,
    trailingIcon: false,
    leadingIconName: DEFAULT_ICON,
    trailingIconName: DEFAULT_ICON,
    label: 'Cell text',
    contentHtml: '',
    width: '220px',
    className: '',
    ...overrides,
  };
}

/** Default demo: header row + 3 body rows × 3 columns. */
export function defaultDemoRows() {
  return [
    {
      cells: [
        cell({ type: 'header', label: 'Header', leadingIcon: false }),
        cell({ type: 'header', label: 'Header', leadingIcon: false }),
        cell({ type: 'header', label: 'Header', leadingIcon: false }),
      ],
    },
    {
      cells: [
        cell({ type: 'body', leadingIcon: true }),
        cell({ type: 'body', leadingIcon: true }),
        cell({ type: 'body', leadingIcon: true }),
      ],
    },
    {
      cells: [
        cell({ type: 'body', leadingIcon: true }),
        cell({ type: 'body', leadingIcon: true }),
        cell({ type: 'body', leadingIcon: true }),
      ],
    },
    {
      cells: [
        cell({ type: 'body', leadingIcon: true }),
        cell({ type: 'body', leadingIcon: true }),
        cell({ type: 'body', leadingIcon: true }),
      ],
    },
  ];
}

export const defaultTableBlockArgs = {
  rows: defaultDemoRows(),
  slotHtml: '',
  className: '',
};

export function normalizeTableBlockArgs(args = {}) {
  return {
    rows: args.rows && args.rows.length ? args.rows : defaultDemoRows(),
    slotHtml: args.slotHtml || '',
    className: args.className || '',
  };
}

export function compileTableBlockArgs(args, compiled) {
  return compiled(normalizeTableBlockArgs(args));
}
`})))()}var xi;function Si(){return(Si=t((()=>{xi=`/**
 * Normalize Storybook args for the table-cell Handlebars template.
 */

export const TYPE_OPTIONS = ['header', 'body'];
export const ALIGN_OPTIONS = ['left', 'center', 'right'];

export const DEFAULT_ICON = 'objects/simple-device-vehicle';

export const defaultTableCellArgs = {
  type: 'header',
  align: 'left',
  background: true,
  borders: true,
  topBorder: true,
  rightBorder: true,
  bottomBorder: true,
  leftBorder: true,
  leadingIcon: true,
  trailingIcon: false,
  leadingIconName: DEFAULT_ICON,
  trailingIconName: DEFAULT_ICON,
  label: 'Header',
  contentHtml: '',
  width: '220px',
  className: '',
};

export function normalizeTableCellArgs(args = {}) {
  const type = String(args.type ?? 'body').toLowerCase();
  const labelDefault = type === 'header' ? 'Header' : 'Cell text';
  return {
    ...defaultTableCellArgs,
    ...args,
    type,
    align: String(args.align ?? 'left').toLowerCase(),
    background: args.background !== false,
    borders: args.borders !== false,
    topBorder: args.topBorder !== false,
    rightBorder: args.rightBorder !== false,
    bottomBorder: args.bottomBorder !== false,
    leftBorder: args.leftBorder !== false,
    leadingIcon: Boolean(args.leadingIcon),
    trailingIcon: Boolean(args.trailingIcon),
    leadingIconName: args.leadingIconName || DEFAULT_ICON,
    trailingIconName: args.trailingIconName || DEFAULT_ICON,
    label: args.label ?? labelDefault,
    contentHtml: args.contentHtml || '',
    width: args.width || '',
    className: args.className || '',
  };
}

export function compileTableCellArgs(args, compiled) {
  return compiled(normalizeTableCellArgs(args));
}
`})))()}var Ci;function wi(){return(wi=t((()=>{Ci=`export const STYLE_OPTIONS = ['solid', 'subtle'];
export const STATE_OPTIONS = ['default', 'hover', 'focus', 'active', 'disabled'];
export const DEFAULT_ICON = 'objects/simple-device-vehicle';

export function defaultTabs(count = 3) {
  return Array.from({ length: count }, (_, index) => ({
    label: \`Tab \${index + 1}\`,
    showIcon: false,
    iconName: DEFAULT_ICON,
    disabled: false,
    panelId: \`panel-\${index}\`,
    id: \`tab-\${index}\`,
  }));
}

export const defaultTabsArgs = {
  style: 'solid',
  activeIndex: 0,
  forceMobile: false,
  label: 'Section',
  ariaLabel: 'Example tabs',
  tabs: defaultTabs(3),
};

export function normalizeTabsArgs(args = {}) {
  const lockActive = Boolean(args.lockActive);
  const activeIndex = Number(args.activeIndex ?? 0);
  const rawTabs = Array.isArray(args.tabs) && args.tabs.length ? args.tabs : defaultTabs(3);
  const tabs = rawTabs.map((tab, index) => ({
    label: tab.label ?? \`Tab \${index + 1}\`,
    showIcon: Boolean(tab.showIcon),
    iconName: tab.iconName || DEFAULT_ICON,
    disabled: Boolean(tab.disabled),
    panelId: tab.panelId || \`panel-\${index}\`,
    id: tab.id || \`tab-\${index}\`,
    state: tab.state || '',
    index,
    isActive: index === activeIndex && !tab.disabled,
  }));

  // If active was disabled, pick first enabled (skip when lockActive for state galleries)
  if (!lockActive && !tabs.some((t) => t.isActive)) {
    const first = tabs.findIndex((t) => !t.disabled);
    if (first >= 0) tabs[first].isActive = true;
  }

  const resolvedActive = tabs.findIndex((t) => t.isActive);

  return {
    style: String(args.style || 'solid').toLowerCase(),
    activeIndex: resolvedActive < 0 ? 0 : resolvedActive,
    forceMobile: Boolean(args.forceMobile),
    showMobileFallback: tabs.length > 3 || Boolean(args.forceMobile),
    label: args.label || 'Section',
    ariaLabel: args.ariaLabel || 'Tabs',
    id: args.id || '',
    className: args.className || '',
    tabs,
  };
}

export function compileTabsArgs(args, compiled) {
  return compiled(normalizeTabsArgs(args));
}
`})))()}var Ti;function Ei(){return(Ei=t((()=>{Ti=`/**
 * Patterns/Tabs — selection + mobile dropdown.
 * Events: \`lifelock:tabs:change\` detail \`{ index, root, source }\`
 */

function dispatchChange(root, index, source) {
  root.dispatchEvent(
    new CustomEvent('lifelock:tabs:change', {
      bubbles: true,
      composed: true,
      detail: { index, root, source },
    }),
  );
}

function getTabButtons(root) {
  return Array.from(root.querySelectorAll('[data-tabs-list-wrap] [role="tab"]'));
}

function getMobileOptions(root) {
  return Array.from(root.querySelectorAll('[data-tabs-mobile-menu] [role="option"]'));
}

function setActive(root, index, source) {
  const tabs = getTabButtons(root);
  const options = getMobileOptions(root);
  const target = tabs[index];
  if (!target || target.disabled) return;

  tabs.forEach((tab, i) => {
    const active = i === index;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
    tab.tabIndex = active ? 0 : -1;
  });

  options.forEach((opt, i) => {
    const active = i === index;
    opt.classList.toggle('is-active', active);
    opt.setAttribute('aria-selected', active ? 'true' : 'false');
  });

  root.dataset.activeIndex = String(index);
  const valueEl = root.querySelector('[data-tabs-mobile-value]');
  if (valueEl) valueEl.textContent = target.textContent?.trim() || '';

  if (typeof source === 'string') dispatchChange(root, index, source);
}

function closeMobile(root) {
  root.classList.remove('is-mobile-open');
  const trigger = root.querySelector('[data-tabs-mobile-trigger]');
  const menu = root.querySelector('[data-tabs-mobile-menu]');
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
  if (menu) menu.hidden = true;
}

function openMobile(root) {
  root.classList.add('is-mobile-open');
  const trigger = root.querySelector('[data-tabs-mobile-trigger]');
  const menu = root.querySelector('[data-tabs-mobile-menu]');
  if (trigger) trigger.setAttribute('aria-expanded', 'true');
  if (menu) menu.hidden = false;
}

/**
 * @param {HTMLElement} root
 * @param {{ activeIndex?: number, onChange?: (index:number)=>void }} [options]
 */
export function initTabs(root, options = {}) {
  if (!root || root.dataset.tabsInitialized === 'true') return null;
  root.dataset.tabsInitialized = 'true';

  const initial = Number(
    options.activeIndex ?? root.dataset.activeIndex ?? 0,
  );
  setActive(root, initial, null);

  function selectIndex(index, source) {
    setActive(root, index, source);
    if (typeof options.onChange === 'function') options.onChange(index);
    closeMobile(root);
  }

  function onTabClick(event) {
    const tab = event.target.closest?.('[role="tab"]');
    if (!tab || !root.contains(tab) || tab.disabled) return;
    const index = Number(tab.getAttribute('data-tabs-index'));
    if (!Number.isFinite(index)) return;
    selectIndex(index, 'tab');
  }

  function onTabKeydown(event) {
    const tab = event.target.closest?.('[role="tab"]');
    if (!tab || !root.contains(tab)) return;
    const tabs = getTabButtons(root).filter((t) => !t.disabled);
    if (!tabs.length) return;
    const current = tabs.indexOf(tab);
    if (current < 0) return;

    let next = current;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = (current + 1) % tabs.length;
      event.preventDefault();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = (current - 1 + tabs.length) % tabs.length;
      event.preventDefault();
    } else if (event.key === 'Home') {
      next = 0;
      event.preventDefault();
    } else if (event.key === 'End') {
      next = tabs.length - 1;
      event.preventDefault();
    } else {
      return;
    }
    const index = Number(tabs[next].getAttribute('data-tabs-index'));
    selectIndex(index, 'keyboard');
    tabs[next].focus();
  }

  function onMobileTrigger(event) {
    event.preventDefault();
    if (root.classList.contains('is-mobile-open')) closeMobile(root);
    else openMobile(root);
  }

  function onMobileOption(event) {
    const opt = event.target.closest?.('[role="option"]');
    if (!opt || !root.contains(opt) || opt.disabled) return;
    const index = Number(opt.getAttribute('data-tabs-index'));
    if (!Number.isFinite(index)) return;
    selectIndex(index, 'mobile');
  }

  function onDocClick(event) {
    if (!root.classList.contains('is-mobile-open')) return;
    if (root.contains(event.target)) return;
    closeMobile(root);
  }

  const list = root.querySelector('[data-tabs-list-wrap]');
  if (list) {
    list.addEventListener('click', onTabClick);
    list.addEventListener('keydown', onTabKeydown);
  }
  const trigger = root.querySelector('[data-tabs-mobile-trigger]');
  if (trigger) trigger.addEventListener('click', onMobileTrigger);
  const menu = root.querySelector('[data-tabs-mobile-menu]');
  if (menu) menu.addEventListener('click', onMobileOption);
  document.addEventListener('click', onDocClick);

  return {
    setActiveIndex: (index) => selectIndex(index, 'api'),
    getActiveIndex: () => Number(root.dataset.activeIndex || 0),
    destroy() {
      if (list) {
        list.removeEventListener('click', onTabClick);
        list.removeEventListener('keydown', onTabKeydown);
      }
      if (trigger) trigger.removeEventListener('click', onMobileTrigger);
      if (menu) menu.removeEventListener('click', onMobileOption);
      document.removeEventListener('click', onDocClick);
      delete root.dataset.tabsInitialized;
    },
  };
}

export function initTabsAll(scope = document) {
  const roots = scope.querySelectorAll?.('[data-component="tabs"]');
  if (!roots) return [];
  return Array.from(roots)
    .map((root) => initTabs(root))
    .filter(Boolean);
}
`})))()}var Di;function Oi(){return(Oi=t((()=>{Di=`export const BACKGROUND_OPTIONS = [
  'primary',
  'secondary',
  'brand',
  'brand-soft',
  'accent',
  'alpha',
  'beta',
  'gamma',
  'delta',
  'inverse-primary',
  'inverse-secondary',
];

export const FILL_OPTIONS = ['solid', 'transparent', 'tint'];
export const STRENGTH_OPTIONS = ['base', '30', '50', '80'];
export const DEFAULT_ICON = 'objects/simple-device-vehicle';

export const defaultTagArgs = {
  background: 'primary',
  fill: 'solid',
  strength: 'base',
  text: 'Tag',
  showIcon: true,
  iconName: DEFAULT_ICON,
};

export function normalizeTagArgs(args = {}) {
  const fill = String(args.fill || 'solid').toLowerCase();
  let strength = String(args.strength || 'base').toLowerCase();
  if (fill === 'solid') strength = 'base';
  if (fill !== 'solid' && strength === 'base') strength = '50';
  return {
    background: String(args.background || 'primary').toLowerCase(),
    fill,
    strength,
    text: args.text ?? 'Tag',
    showIcon: args.showIcon !== false,
    iconName: args.iconName || DEFAULT_ICON,
  };
}

export function compileTagArgs(args, compiled) {
  return compiled(normalizeTagArgs(args));
}
`})))()}var ki;function Ai(){return(Ai=t((()=>{ki=`/**
 * Patterns/Inputs/Text field behaviour layer.
 *
 * Progressive enhancement on top of the native \`<input>\` / \`<select>\`
 * the template emits. Every paint (border, hover, focus ring, error,
 * disabled) is already CSS-driven; this layer's only job is the
 * password reveal toggle:
 *
 *   1. Flip the input's \`type\` between \`password\` and \`text\`.
 *   2. Mirror the revealed state onto the root's \`is-revealed\` modifier
 *      (the SCSS swaps the eye / eye-off glyph) plus \`aria-pressed\` and
 *      \`aria-label\` on the toggle button.
 *   3. Dispatch the namespaced \`lifelock:text-field:reveal\` CustomEvent.
 *
 * \`type=select\` ships no behaviour — the native control is fully
 * functional without JS. Public API documented in \`./spec.md\`
 * § "JavaScript API".
 */

/**
 * @typedef {Object} TextFieldInitOptions
 * @property {boolean} [revealed=false] Start the password field revealed.
 */

/**
 * @typedef {Object} TextFieldInstance
 * @property {() => boolean} getRevealed
 * @property {(next: boolean) => void} setRevealed
 * @property {(disabled: boolean) => void} setDisabled
 * @property {() => void} destroy
 */

function dispatch(root, name, detail) {
  root.dispatchEvent(
    new CustomEvent(name, { detail, bubbles: true, composed: true }),
  );
}

const NOOP_INSTANCE = {
  getRevealed: () => false,
  setRevealed: () => {},
  setDisabled: () => {},
  destroy: () => {},
};

/**
 * Initialise one text-field root.
 *
 * @param {HTMLElement} root
 * @param {TextFieldInitOptions} [options]
 * @returns {TextFieldInstance}
 */
export function initTextField(root, options = {}) {
  if (!root || root.dataset.textFieldInitialised === "true") {
    return /** @type {TextFieldInstance} */ ({ ...NOOP_INSTANCE });
  }
  root.dataset.textFieldInitialised = "true";

  /** @type {HTMLInputElement | null} */
  const input = root.querySelector(".c-text-field__field");
  /** @type {HTMLButtonElement | null} */
  const reveal = root.querySelector(".c-text-field__reveal");

  // No reveal button (non-password types) → nothing to wire.
  if (!input || !reveal) {
    return /** @type {TextFieldInstance} */ ({
      ...NOOP_INSTANCE,
      destroy() {
        delete root.dataset.textFieldInitialised;
      },
    });
  }

  function paint(revealed, source) {
    root.classList.toggle("is-revealed", revealed);
    input.type = revealed ? "text" : "password";
    reveal.setAttribute("aria-pressed", revealed ? "true" : "false");
    reveal.setAttribute(
      "aria-label",
      revealed ? "Hide password" : "Show password",
    );
    dispatch(root, "lifelock:text-field:reveal", { revealed, source });
  }

  function onClick() {
    paint(!root.classList.contains("is-revealed"), "pointer");
  }

  reveal.addEventListener("click", onClick);

  if (options.revealed) paint(true, "api");

  return {
    getRevealed() {
      return root.classList.contains("is-revealed");
    },
    setRevealed(next) {
      paint(Boolean(next), "api");
    },
    setDisabled(disabled) {
      if (disabled) {
        root.classList.add("is-disabled");
        input.disabled = true;
        reveal.disabled = true;
      } else {
        root.classList.remove("is-disabled");
        input.disabled = false;
        reveal.disabled = false;
      }
    },
    destroy() {
      reveal.removeEventListener("click", onClick);
      delete root.dataset.textFieldInitialised;
    },
  };
}

/**
 * Initialise every text-field inside a scope.
 *
 * @param {ParentNode} [scope]
 * @param {TextFieldInitOptions} [options]
 * @returns {TextFieldInstance[]}
 */
export function initTextFields(scope, options) {
  const root =
    scope && typeof scope.querySelectorAll === "function"
      ? scope
      : typeof document !== "undefined"
        ? document
        : null;
  if (!root) return [];
  return Array.from(root.querySelectorAll(".c-text-field")).map((el) =>
    initTextField(/** @type {HTMLElement} */ (el), options),
  );
}
`})))()}var ji;function Mi(){return(Mi=t((()=>{ji=`export const TYPE_OPTIONS = ['link', 'segmented', 'pill'];
export const STATE_OPTIONS = ['default', 'hover', 'pressed', 'focus', 'disabled'];

export const defaultToggleArgs = {
  type: 'link',
  selected: 'off',
  labelA: 'Off',
  labelB: 'On',
  showDiscountLabel: true,
  discountText: 'Save 40%',
  disabled: false,
  state: 'default',
  ariaLabel: 'Toggle',
};

export function normalizeToggleArgs(args = {}) {
  const type = String(args.type || 'link').toLowerCase();
  let selected = String(args.selected || (type === 'link' ? 'off' : 'a')).toLowerCase();
  if (type === 'link' && selected !== 'on' && selected !== 'off') selected = 'off';
  if (type !== 'link' && selected !== 'a' && selected !== 'b') selected = 'a';

  return {
    type,
    selected,
    labelA: args.labelA || (type === 'link' ? 'Off' : type === 'pill' ? 'Annual' : 'Free'),
    labelB: args.labelB || (type === 'link' ? 'On' : type === 'pill' ? 'Monthly' : 'Premium'),
    showDiscountLabel: args.showDiscountLabel !== false,
    discountText: args.discountText || 'Save 40%',
    disabled: Boolean(args.disabled) || String(args.state || '').toLowerCase() === 'disabled',
    state: String(args.state || 'default').toLowerCase(),
    ariaLabel: args.ariaLabel || 'Toggle',
    id: args.id || '',
    className: args.className || '',
  };
}

export function compileToggleArgs(args, compiled) {
  return compiled(normalizeToggleArgs(args));
}
`})))()}var Ni;function Pi(){return(Pi=t((()=>{Ni=`/**
 * Patterns/Toggle — Link / Segmented / Pill selection.
 * Event: \`lifelock:toggle:change\` detail \`{ selected, root, source }\`
 */

function dispatchChange(root, selected, source) {
  root.dispatchEvent(
    new CustomEvent('lifelock:toggle:change', {
      bubbles: true,
      composed: true,
      detail: { selected, root, source },
    }),
  );
}

function applySelected(root, selected) {
  const type = root.dataset.type || 'link';
  root.dataset.selected = selected;

  if (type === 'link') {
    const btn = root.querySelector('[data-toggle-control]');
    const on = selected === 'on';
    if (btn) btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    root.querySelector('.c-toggle__label--start')?.classList.toggle('is-active', !on);
    root.querySelector('.c-toggle__label--end')?.classList.toggle('is-active', on);
    return;
  }

  root.querySelectorAll('[data-toggle-value]').forEach((el) => {
    const value = el.getAttribute('data-toggle-value');
    const active = value === selected;
    el.classList.toggle('is-selected', active);
    el.setAttribute('aria-checked', active ? 'true' : 'false');
  });
}

/**
 * @param {HTMLElement} root
 * @param {{ selected?: string, onChange?: (s:string)=>void }} [options]
 */
export function initToggle(root, options = {}) {
  if (!root || root.dataset.toggleInitialized === 'true') return null;
  root.dataset.toggleInitialized = 'true';

  const type = root.dataset.type || 'link';
  let selected =
    options.selected ||
    root.dataset.selected ||
    (type === 'link' ? 'off' : 'a');
  applySelected(root, selected);

  function setSelected(next, source) {
    if (root.classList.contains('is-disabled')) return;
    selected = next;
    applySelected(root, next);
    if (typeof options.onChange === 'function') options.onChange(next);
    if (source) dispatchChange(root, next, source);
  }

  function onClick(event) {
    if (type === 'link') {
      const control = event.target.closest?.('[data-toggle-control]');
      if (!control || !root.contains(control)) return;
      setSelected(selected === 'on' ? 'off' : 'on', 'click');
      return;
    }
    const opt = event.target.closest?.('[data-toggle-value]');
    if (!opt || !root.contains(opt) || opt.disabled) return;
    setSelected(opt.getAttribute('data-toggle-value'), 'click');
  }

  function onKeydown(event) {
    if (type === 'link') {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        setSelected(selected === 'on' ? 'off' : 'on', 'keyboard');
      }
      return;
    }
    const opts = Array.from(root.querySelectorAll('[data-toggle-value]:not(:disabled)'));
    if (!opts.length) return;
    const current = opts.findIndex((o) => o.getAttribute('data-toggle-value') === selected);
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const next = opts[(current + 1) % opts.length];
      setSelected(next.getAttribute('data-toggle-value'), 'keyboard');
      next.focus();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const next = opts[(current - 1 + opts.length) % opts.length];
      setSelected(next.getAttribute('data-toggle-value'), 'keyboard');
      next.focus();
    }
  }

  root.addEventListener('click', onClick);
  root.addEventListener('keydown', onKeydown);

  return {
    setSelected: (value) => setSelected(value, 'api'),
    getSelected: () => selected,
    destroy() {
      root.removeEventListener('click', onClick);
      root.removeEventListener('keydown', onKeydown);
      delete root.dataset.toggleInitialized;
    },
  };
}

export function initToggles(scope = document) {
  const roots = scope.querySelectorAll?.('[data-component="toggle"]');
  if (!roots) return [];
  return Array.from(roots)
    .map((root) => initToggle(root))
    .filter(Boolean);
}
`})))()}var Fi;function Ii(){return(Ii=t((()=>{Fi=`export const TYPE_OPTIONS = ['small', 'medium', 'rich'];
export const TINT_OPTIONS = ['default', 'main', 'success', 'attention', 'critical'];
export const POINTER_OPTIONS = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
  'left',
  'right',
];

export const defaultTooltipArgs = {
  type: 'small',
  tint: 'main',
  pointer: 'top-center',
  title: 'Tooltip title',
  body: 'Tooltip text',
  open: true,
  id: 'demo-tooltip',
};

export function normalizeTooltipArgs(args = {}) {
  return {
    type: String(args.type || 'small').toLowerCase(),
    tint: String(args.tint || 'default').toLowerCase(),
    pointer: String(args.pointer || 'top-center').toLowerCase(),
    title: args.title || '',
    body: args.body || 'Tooltip text',
    open: args.open !== false,
    id: args.id || '',
    className: args.className || '',
  };
}

export function compileTooltipArgs(args, compiled) {
  return compiled(normalizeTooltipArgs(args));
}
`})))()}var Li;function Ri(){return(Ri=t((()=>{Li=`/**
 * Molecules/Tooltip — show/hide + Escape.
 * Pair with a trigger via \`aria-describedby\` pointing at the tooltip id.
 */

function setOpen(root, open) {
  root.classList.toggle('is-open', open);
  if (open) root.removeAttribute('hidden');
  else root.setAttribute('hidden', '');
}

/**
 * @param {HTMLElement} root
 * @param {{ trigger?: HTMLElement|string, open?: boolean }} [options]
 */
export function initTooltip(root, options = {}) {
  if (!root || root.dataset.tooltipInitialized === 'true') return null;
  root.dataset.tooltipInitialized = 'true';

  let trigger = null;
  if (options.trigger instanceof HTMLElement) trigger = options.trigger;
  else if (typeof options.trigger === 'string') {
    trigger = document.querySelector(options.trigger);
  } else if (root.id) {
    trigger = document.querySelector(\`[aria-describedby="\${root.id}"]\`);
  }

  const initial = options.open ?? root.classList.contains('is-open');
  setOpen(root, Boolean(initial));

  function open() {
    setOpen(root, true);
  }
  function close() {
    setOpen(root, false);
  }
  function toggle() {
    setOpen(root, !root.classList.contains('is-open'));
  }

  function onKeydown(event) {
    if (event.key === 'Escape') close();
  }

  function onTriggerEnter() {
    open();
  }
  function onTriggerLeave() {
    close();
  }
  function onTriggerFocus() {
    open();
  }
  function onTriggerBlur() {
    close();
  }

  if (trigger) {
    trigger.addEventListener('mouseenter', onTriggerEnter);
    trigger.addEventListener('mouseleave', onTriggerLeave);
    trigger.addEventListener('focus', onTriggerFocus);
    trigger.addEventListener('blur', onTriggerBlur);
  }
  document.addEventListener('keydown', onKeydown);

  return {
    open,
    close,
    toggle,
    destroy() {
      if (trigger) {
        trigger.removeEventListener('mouseenter', onTriggerEnter);
        trigger.removeEventListener('mouseleave', onTriggerLeave);
        trigger.removeEventListener('focus', onTriggerFocus);
        trigger.removeEventListener('blur', onTriggerBlur);
      }
      document.removeEventListener('keydown', onKeydown);
      delete root.dataset.tooltipInitialized;
    },
  };
}

export function initTooltips(scope = document) {
  const roots = scope.querySelectorAll?.('[data-component="tooltip"]');
  if (!roots) return [];
  return Array.from(roots)
    .map((root) => initTooltip(root))
    .filter(Boolean);
}
`})))()}var zi;function Bi(){return(Bi=t((()=>{zi=`import {
  buildStarLadder,
  formatScore,
  trustpilotTierColor,
} from '../rating/rating-helpers.js';

export const defaultTrustpilotArgs = {
  title: 'Best identity protection I\\'ve used',
  productLabel: 'LifeLock Standard',
  quoteBody: 'Customer quote body text goes here.',
  reviewerLine: 'Reviewer · Date',
  verifiedLabel: 'Verified purchaser',
  showProductLabel: true,
  showVerified: true,
  showQuote: true,
  value: 5,
};

export function normalizeTrustpilotArgs(args = {}) {
  const value = Number(args.value ?? 5);
  const scoreLabel = formatScore(value);

  return {
    title: args.title || 'Quote title',
    productLabel: args.productLabel || 'Product',
    quoteBody: args.quoteBody || 'Customer quote body text goes here.',
    reviewerLine: args.reviewerLine || 'Reviewer · Date',
    verifiedLabel: args.verifiedLabel || 'Verified purchaser',
    showProductLabel: args.showProductLabel !== false,
    showVerified: args.showVerified !== false,
    showQuote: args.showQuote !== false,
    value,
    className: args.className || '',
    ratingArgs: {
      type: 'trustpilot',
      value,
      device: 'desktop',
      showScore: false,
      showCount: false,
      stars: buildStarLadder(value),
      scoreLabel,
      iconSize: '24',
      countSize: 'lg',
      isTeaserFamily: false,
      isTrustpilotFamily: true,
      trustpilotColor: trustpilotTierColor(value),
      accessibleLabel: args.accessibleLabel || \`Rated \${scoreLabel} out of 5 on Trustpilot\`,
      className: '',
    },
  };
}

export function compileTrustpilotArgs(args, compiled) {
  return compiled(normalizeTrustpilotArgs(args));
}
`})))()}function Vi(e){if(!e)return{scss:null,js:null};let t=(t,n)=>[`/src/components/${e}/${e}.${n}`,`/src/layouts/${e}/${e}.${n}`,`/src/pages/${e}/${e}.${n}`].reduce((e,n)=>e??t[n]??null,null);return{scss:t(Gi,`scss`)??t(qi,`scss`)??t(Yi,`scss`),js:t(Ki,`js`)??t(Ji,`js`)??t(Xi,`js`)}}function Hi(e,t={}){let{unit:n,scss:r,js:i,extra:a={}}=t,o=Vi(n),s=r??o.scss,c=i??o.js,l=s&&String(s).trim()||c&&String(c).trim()?Wi(e,{js:c,scss:s}):String(e).trim(),{docs:u,...d}=a;return{...d,docs:{...u&&typeof u==`object`?u:{},source:{code:l,language:`html`,type:`code`}}}}function Ui(e,t){let n=RegExp(`</${t}`,`gi`);return String(e).replace(n,`<\\/${t}`)}function Wi(e,{js:t,scss:n}={}){let r=[String(e).trim()];if(t&&String(t).trim()){let e=Ui(String(t).trim(),`script`);r.push(``,`<!-- ── JavaScript ── -->`,`<script>`,e,`<\/script>`)}if(n&&String(n).trim()){let e=Ui(String(n).trim(),`style`);r.push(``,`<!-- ── SCSS ── -->`,`<style>`,e,`</style>`)}return r.join(`
`)}var Gi,Ki,qi,Ji,Yi,Xi;function Zi(){return(Zi=t((()=>{Kt(),Jt(),Xt(),Qt(),en(),nn(),an(),sn(),ln(),dn(),pn(),hn(),_n(),yn(),bn(),Sn(),wn(),En(),On(),An(),Mn(),Pn(),In(),Rn(),Bn(),Hn(),Wn(),Kn(),Jn(),Xn(),Qn(),er(),nr(),ir(),or(),cr(),ur(),fr(),mr(),gr(),vr(),br(),Sr(),wr(),Er(),Or(),Ar(),Mr(),Pr(),Ir(),Rr(),Br(),Hr(),Wr(),Kr(),Jr(),Xr(),Qr(),ei(),ni(),ii(),oi(),ci(),ui(),fi(),mi(),gi(),vi(),bi(),Si(),wi(),Ei(),Oi(),Ai(),Mi(),Pi(),Ii(),Ri(),Bi(),Gi=Object.assign({"/src/components/accordion/accordion.scss":Gt,"/src/components/alert/alert.scss":qt,"/src/components/award-item/award-item.scss":Yt,"/src/components/award-wrapper/award-wrapper.scss":Zt,"/src/components/badge/badge.scss":$t,"/src/components/breadcrumb/breadcrumb.scss":tn,"/src/components/button/button.scss":rn,"/src/components/card/card.scss":on,"/src/components/checkbox/checkbox.scss":cn,"/src/components/code-entry/code-entry.scss":un,"/src/components/content-block/content-block.scss":fn,"/src/components/content-body/content-body.scss":mn,"/src/components/content-list/content-list.scss":gn,"/src/components/content-title/content-title.scss":vn,"/src/components/discount-label/discount-label.scss":$,"/src/components/divider/divider.scss":xn,"/src/components/icon/icon.scss":Cn,"/src/components/image-wrapper/image-wrapper.scss":Tn,"/src/components/logo-wrapper/logo-wrapper.scss":Dn,"/src/components/lower-footer/lower-footer.scss":kn,"/src/components/media/media.scss":jn,"/src/components/menu-block/menu-block.scss":Nn,"/src/components/menu-list/menu-list.scss":Fn,"/src/components/modal/modal.scss":Ln,"/src/components/pagination/pagination.scss":zn,"/src/components/pagination-dots/pagination-dots.scss":Vn,"/src/components/pricing/pricing.scss":Un,"/src/components/progress-indicator/progress-indicator.scss":Gn,"/src/components/radio/radio.scss":qn,"/src/components/rating/rating.scss":Yn,"/src/components/search-box/search-box.scss":Zn,"/src/components/sheet/sheet.scss":$n,"/src/components/slider/slider.scss":tr,"/src/components/stepper/stepper.scss":rr,"/src/components/switch/switch.scss":ar,"/src/components/table-block/table-block.scss":sr,"/src/components/table-cell/table-cell.scss":lr,"/src/components/tabs/tabs.scss":dr,"/src/components/tag/tag.scss":pr,"/src/components/text-field/text-field.scss":hr,"/src/components/text-link/text-link.scss":_r,"/src/components/toggle/toggle.scss":yr,"/src/components/tooltip/tooltip.scss":xr,"/src/components/trustpilot/trustpilot.scss":Cr}),Ki=Object.assign({"/src/components/accordion/accordion-helpers.js":Tr,"/src/components/accordion/accordion.js":Dr,"/src/components/alert/alert-helpers.js":kr,"/src/components/alert/alert.js":jr,"/src/components/breadcrumb/breadcrumb-story-helpers.js":Nr,"/src/components/button/button-helpers.js":Fr,"/src/components/card/card-story-helpers.js":Lr,"/src/components/checkbox/checkbox.js":zr,"/src/components/code-entry/code-entry.js":Vr,"/src/components/content-list/content-list-helpers.js":Ur,"/src/components/logo-wrapper/logo-wrapper-fixtures.js":Gr,"/src/components/lower-footer/lower-footer-story-helpers.js":qr,"/src/components/media/media-helpers.js":Yr,"/src/components/menu-block/menu-block.js":Zr,"/src/components/modal/modal.js":$r,"/src/components/pagination/pagination-helpers.js":ti,"/src/components/pagination/pagination.js":ri,"/src/components/radio/radio.js":ai,"/src/components/rating/rating-helpers.js":si,"/src/components/search-box/search-box.js":li,"/src/components/sheet/sheet.js":di,"/src/components/slider/slider.js":pi,"/src/components/stepper/stepper-story-helpers.js":hi,"/src/components/switch/switch.js":_i,"/src/components/table-block/table-block-story-helpers.js":yi,"/src/components/table-cell/table-cell-story-helpers.js":xi,"/src/components/tabs/tabs-story-helpers.js":Ci,"/src/components/tabs/tabs.js":Ti,"/src/components/tag/tag-story-helpers.js":Di,"/src/components/text-field/text-field.js":ki,"/src/components/toggle/toggle-story-helpers.js":ji,"/src/components/toggle/toggle.js":Ni,"/src/components/tooltip/tooltip-story-helpers.js":Fi,"/src/components/tooltip/tooltip.js":Li,"/src/components/trustpilot/trustpilot-story-helpers.js":zi}),qi=Object.assign({}),Ji=Object.assign({}),Yi=Object.assign({}),Xi=Object.assign({})})))()}export{Vt as $,Be as $t,Sn as A,I as An,ft as At,pn as B,et as Bt,On as C,H as Cn,vt as Ct,Cn as D,R as Dn,mt as Dt,En as E,B as En,ht as Et,gn as F,D as Fn,at as Ft,Yt as G,Ye as Gt,an as H,$e as Ht,_n as I,O as In,it as It,Jt as J,qe as Jt,Xt as K,Je as Kt,mn as L,rt as Lt,bn as M,P as Mn,ct as Mt,vn as N,j as Nn,st as Nt,wn as O,L as On,pt as Ot,yn as P,M as Pn,ot as Pt,Wt as Q,Ue as Qt,hn as R,nt as Rt,jn as S,U as Sn,yt as St,Tn as T,z as Tn,gt as Tt,tn as U,Ze as Ut,rn as V,Qe as Vt,nn as W,Xe as Wt,Kt as X,Ge as Xt,Gt as Y,We as Yt,Q as Z,He as Zt,In as _,q as _n,wt as _t,vr as a,Pe as an,Ft as at,Nn as b,G as bn,xt as bt,$n as c,Me as cn,Nt as ct,Wn as d,Ee as dn,At as dt,Ve as en,Ut as et,Un as f,De as fn,kt as ft,Ln as g,Y as gn,Tt as gt,Rn as h,X as hn,Et as ht,Or as i,Ie as in,Rt as it,$ as j,N as jn,lt as jt,xn as k,F as kn,ut as kt,Xn as l,ke as ln,Mt as lt,zn as m,Z as mn,Dt as mt,Zi as n,Re as nn,zt as nt,_r as o,Ne as on,It as ot,Bn as p,Te as pn,Ot as pt,qt as q,Ke as qt,Dr as r,Fe as rn,Lt as rt,er as s,je as sn,Pt as st,Hi as t,Le as tn,Bt as tt,Yn as u,Ae as un,jt as ut,Fn as v,J as vn,Ct as vt,Dn as w,V as wn,_t as wt,Mn as x,W as xn,bt as xt,Pn as y,K as yn,St as yt,fn as z,tt as zt};