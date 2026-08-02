import{n as e,t}from"./rolldown-runtime-DkW27tQK.js";var n=t((e=>{e.__esModule=!0,e.extend=a,e.indexOf=l,e.escapeExpression=u,e.isEmpty=d,e.createFrame=f,e.blockParams=p,e.appendContextPath=m;var t={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#x27;`,"`":`&#x60;`,"=":`&#x3D;`},n=/[&<>"'`=]/g,r=/[&<>"'`=]/;function i(e){return t[e]}function a(e){for(var t=1;t<arguments.length;t++)for(var n in arguments[t])Object.prototype.hasOwnProperty.call(arguments[t],n)&&(e[n]=arguments[t][n]);return e}var o=Object.prototype.toString;e.toString=o;var s=function(e){return typeof e==`function`};s(/x/)&&(e.isFunction=s=function(e){return typeof e==`function`&&o.call(e)===`[object Function]`}),e.isFunction=s;var c=Array.isArray||function(e){return e&&typeof e==`object`?o.call(e)===`[object Array]`:!1};e.isArray=c;function l(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1}function u(e){if(typeof e!=`string`){if(e&&e.toHTML)return e.toHTML();if(e==null)return``;if(!e)return e+``;e=``+e}return r.test(e)?e.replace(n,i):e}function d(e){return!e&&e!==0||!!(c(e)&&e.length===0)}function f(e){var t=a({},e);return t._parent=e,t}function p(e,t){return e.path=t,e}function m(e,t){return(e?e+`.`:``)+t}})),r=t(((e,t)=>{e.__esModule=!0;var n=[`description`,`fileName`,`lineNumber`,`endLineNumber`,`message`,`name`,`number`,`stack`];function r(e,t){var i=t&&t.loc,a=void 0,o=void 0,s=void 0,c=void 0;i&&(a=i.start.line,o=i.end.line,s=i.start.column,c=i.end.column,e+=` - `+a+`:`+s);for(var l=Error.prototype.constructor.call(this,e),u=0;u<n.length;u++)this[n[u]]=l[n[u]];Error.captureStackTrace&&Error.captureStackTrace(this,r);try{i&&(this.lineNumber=a,this.endLineNumber=o,Object.defineProperty?(Object.defineProperty(this,"column",{value:s,enumerable:!0}),Object.defineProperty(this,"endColumn",{value:c,enumerable:!0})):(this.column=s,this.endColumn=c))}catch{}}r.prototype=Error(),e.default=r,t.exports=e.default})),i=t(((e,t)=>{e.__esModule=!0;var r=n();e.default=function(e){e.registerHelper(`blockHelperMissing`,function(t,n){var i=n.inverse,a=n.fn;if(t===!0)return a(this);if(t===!1||t==null)return i(this);if(r.isArray(t))return t.length>0?(n.ids&&(n.ids=[n.name]),e.helpers.each(t,n)):i(this);if(n.data&&n.ids){var o=r.createFrame(n.data);o.contextPath=r.appendContextPath(n.data.contextPath,n.name),n={data:o}}return a(t,n)})},t.exports=e.default})),a=t(((e,t)=>{e.__esModule=!0;function i(e){return e&&e.__esModule?e:{default:e}}var a=n(),o=i(r());e.default=function(e){e.registerHelper(`each`,function(e,t){if(!t)throw new o.default(`Must pass iterator to #each`);var n=t.fn,r=t.inverse,i=0,s=``,c=void 0,l=void 0;t.data&&t.ids&&(l=a.appendContextPath(t.data.contextPath,t.ids[0])+`.`),a.isFunction(e)&&(e=e.call(this)),t.data&&(c=a.createFrame(t.data));function u(t,r,i){c&&(c.key=t,c.index=r,c.first=r===0,c.last=!!i,l&&(c.contextPath=l+t)),s+=n(e[t],{data:c,blockParams:a.blockParams([e[t],t],[l+t,null])})}if(e&&typeof e==`object`)if(a.isArray(e))for(var d=e.length;i<d;i++)i in e&&u(i,i,i===e.length-1);else if(typeof Symbol==`function`&&e[Symbol.iterator]){for(var f=[],p=e[Symbol.iterator](),m=p.next();!m.done;m=p.next())f.push(m.value);e=f;for(var d=e.length;i<d;i++)u(i,i,i===e.length-1)}else(function(){var t=void 0;Object.keys(e).forEach(function(e){t!==void 0&&u(t,i-1),t=e,i++}),t!==void 0&&u(t,i-1,!0)})();return i===0&&(s=r(this)),s})},t.exports=e.default})),o=t(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var i=n(r());e.default=function(e){e.registerHelper(`helperMissing`,function(){if(arguments.length!==1)throw new i.default(`Missing helper: "`+arguments[arguments.length-1].name+`"`)})},t.exports=e.default})),s=t(((e,t)=>{e.__esModule=!0;function i(e){return e&&e.__esModule?e:{default:e}}var a=n(),o=i(r());e.default=function(e){e.registerHelper(`if`,function(e,t){if(arguments.length!=2)throw new o.default(`#if requires exactly one argument`);return a.isFunction(e)&&(e=e.call(this)),!t.hash.includeZero&&!e||a.isEmpty(e)?t.inverse(this):t.fn(this)}),e.registerHelper(`unless`,function(t,n){if(arguments.length!=2)throw new o.default(`#unless requires exactly one argument`);return e.helpers.if.call(this,t,{fn:n.inverse,inverse:n.fn,hash:n.hash})})},t.exports=e.default})),c=t(((e,t)=>{e.__esModule=!0,e.default=function(e){e.registerHelper(`log`,function(){for(var t=[void 0],n=arguments[arguments.length-1],r=0;r<arguments.length-1;r++)t.push(arguments[r]);var i=1;n.hash.level==null?n.data&&n.data.level!=null&&(i=n.data.level):i=n.hash.level,t[0]=i,e.log.apply(e,t)})},t.exports=e.default})),l=t(((e,t)=>{e.__esModule=!0,e.default=function(e){e.registerHelper(`lookup`,function(e,t,n){return e&&n.lookupProperty(e,t)})},t.exports=e.default})),u=t(((e,t)=>{e.__esModule=!0;function i(e){return e&&e.__esModule?e:{default:e}}var a=n(),o=i(r());e.default=function(e){e.registerHelper(`with`,function(e,t){if(arguments.length!=2)throw new o.default(`#with requires exactly one argument`);a.isFunction(e)&&(e=e.call(this));var n=t.fn;if(a.isEmpty(e))return t.inverse(this);var r=t.data;return t.data&&t.ids&&(r=a.createFrame(t.data),r.contextPath=a.appendContextPath(t.data.contextPath,t.ids[0])),n(e,{data:r,blockParams:a.blockParams([e],[r&&r.contextPath])})})},t.exports=e.default})),d=t((e=>{e.__esModule=!0,e.registerDefaultHelpers=g,e.moveHelperToHooks=_;function t(e){return e&&e.__esModule?e:{default:e}}var n=t(i()),r=t(a()),d=t(o()),f=t(s()),p=t(c()),m=t(l()),h=t(u());function g(e){n.default(e),r.default(e),d.default(e),f.default(e),p.default(e),m.default(e),h.default(e)}function _(e,t,n){e.helpers[t]&&(e.hooks[t]=e.helpers[t],n||(e.helpers[t]=void 0))}})),f=t(((e,t)=>{e.__esModule=!0;var r=n();e.default=function(e){e.registerDecorator(`inline`,function(e,t,n,i){var a=e;return t.partials||(t.partials={},a=function(i,a){var o=n.partials;n.partials=r.extend({},o,t.partials);var s=e(i,a);return n.partials=o,s}),t.partials[i.args[0]]=i.fn,a})},t.exports=e.default})),p=t((e=>{e.__esModule=!0,e.registerDefaultDecorators=r;function t(e){return e&&e.__esModule?e:{default:e}}var n=t(f());function r(e){n.default(e)}})),m=t(((e,t)=>{e.__esModule=!0;var r=n(),i={methodMap:[`debug`,`info`,`warn`,`error`],level:`info`,lookupLevel:function(e){if(typeof e==`string`){var t=r.indexOf(i.methodMap,e.toLowerCase());e=t>=0?t:parseInt(e,10)}return e},log:function(e){if(e=i.lookupLevel(e),typeof console<`u`&&i.lookupLevel(i.level)<=e){var t=i.methodMap[e];console[t]||(t=`log`);var n=[...arguments].slice(1);console[t].apply(console,n)}}};e.default=i,t.exports=e.default})),h=t((e=>{e.__esModule=!0,e.createProtoAccessControl=o,e.resultIsAllowed=s,e.resetLoggedProperties=u;function t(e){return e&&e.__esModule?e:{default:e}}var r=n(),i=t(m()),a=Object.create(null);function o(e){var t=Object.create(null);t.__proto__=!1,r.extend(t,e.allowedProtoProperties);var n=Object.create(null);return n.constructor=!1,n.__defineGetter__=!1,n.__defineSetter__=!1,n.__lookupGetter__=!1,n.__lookupSetter__=!1,r.extend(n,e.allowedProtoMethods),{properties:{whitelist:t,defaultValue:e.allowProtoPropertiesByDefault},methods:{whitelist:n,defaultValue:e.allowProtoMethodsByDefault}}}function s(e,t,n){return c(typeof e==`function`?t.methods:t.properties,n)}function c(e,t){return e.whitelist[t]===void 0?e.defaultValue===void 0?(l(t),!1):e.defaultValue:e.whitelist[t]===!0}function l(e){a[e]!==!0&&(a[e]=!0,i.default.log(`error`,`Handlebars: Access has been denied to resolve the property "`+e+`" because it is not an "own property" of its parent.
You can add a runtime option to disable the check or this warning:
See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details`))}function u(){Object.keys(a).forEach(function(e){delete a[e]})}})),g=t((e=>{e.__esModule=!0,e.HandlebarsEnvironment=f;function t(e){return e&&e.__esModule?e:{default:e}}var i=n(),a=t(r()),o=d(),s=p(),c=t(m()),l=h();e.VERSION=`4.7.9`,e.COMPILER_REVISION=8,e.LAST_COMPATIBLE_COMPILER_REVISION=7,e.REVISION_CHANGES={1:`<= 1.0.rc.2`,2:`== 1.0.0-rc.3`,3:`== 1.0.0-rc.4`,4:`== 1.x.x`,5:`== 2.0.0-alpha.x`,6:`>= 2.0.0-beta.1`,7:`>= 4.0.0 <4.3.0`,8:`>= 4.3.0`};var u=`[object Object]`;function f(e,t,n){this.helpers=e||{},this.partials=t||{},this.decorators=n||{},o.registerDefaultHelpers(this),s.registerDefaultDecorators(this)}f.prototype={constructor:f,logger:c.default,log:c.default.log,registerHelper:function(e,t){if(i.toString.call(e)===u){if(t)throw new a.default(`Arg not supported with multiple helpers`);i.extend(this.helpers,e)}else this.helpers[e]=t},unregisterHelper:function(e){delete this.helpers[e]},registerPartial:function(e,t){if(i.toString.call(e)===u)i.extend(this.partials,e);else{if(t===void 0)throw new a.default(`Attempting to register a partial called "`+e+`" as undefined`);this.partials[e]=t}},unregisterPartial:function(e){delete this.partials[e]},registerDecorator:function(e,t){if(i.toString.call(e)===u){if(t)throw new a.default(`Arg not supported with multiple decorators`);i.extend(this.decorators,e)}else this.decorators[e]=t},unregisterDecorator:function(e){delete this.decorators[e]},resetLoggedPropertyAccesses:function(){l.resetLoggedProperties()}},e.log=c.default.log,e.createFrame=i.createFrame,e.logger=c.default})),_=t(((e,t)=>{e.__esModule=!0;function n(e){this.string=e}n.prototype.toString=n.prototype.toHTML=function(){return``+this.string},e.default=n,t.exports=e.default})),v=t((e=>{e.__esModule=!0,e.wrapHelper=t;function t(e,t){return typeof e==`function`?function(){var n=arguments[arguments.length-1];return arguments[arguments.length-1]=t(n),e.apply(this,arguments)}:e}})),y=t((e=>{e.__esModule=!0,e.checkRevision=f,e.template=p,e.wrapProgram=m,e.resolvePartial=_,e.invokePartial=y,e.noop=b;function t(e){return e&&e.__esModule?e:{default:e}}function i(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}var a=i(n()),o=t(r()),s=g(),c=d(),l=v(),u=h();function f(e){var t=e&&e[0]||1,n=s.COMPILER_REVISION;if(!(t>=s.LAST_COMPATIBLE_COMPILER_REVISION&&t<=s.COMPILER_REVISION)){if(t<s.LAST_COMPATIBLE_COMPILER_REVISION){var r=s.REVISION_CHANGES[n],i=s.REVISION_CHANGES[t];throw new o.default(`Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version (`+r+`) or downgrade your runtime to an older version (`+i+`).`)}throw new o.default(`Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version (`+e[1]+`).`)}}function p(e,t){if(!t)throw new o.default(`No environment passed to template`);if(!e||!e.main)throw new o.default(`Unknown template object: `+typeof e);e.main.decorator=e.main_d,t.VM.checkRevision(e.compiler);var n=e.compiler&&e.compiler[0]===7;function r(n,r,i){i.hash&&(r=a.extend({},r,i.hash),i.ids&&(i.ids[0]=!0)),n=t.VM.resolvePartial.call(this,n,r,i),i.hooks=this.hooks,i.protoAccessControl=this.protoAccessControl;var s=t.VM.invokePartial.call(this,n,r,i);if(s==null&&t.compile&&(i.partials[i.name]=t.compile(n,e.compilerOptions,t),s=i.partials[i.name](r,i)),s!=null){if(i.indent){for(var c=s.split(`
`),l=0,u=c.length;l<u&&!(!c[l]&&l+1===u);l++)c[l]=i.indent+c[l];s=c.join(`
`)}return s}throw new o.default(`The partial `+i.name+` could not be compiled when running in runtime-only mode`)}var i={strict:function(e,t,n){if(!e||!(t in e))throw new o.default(`"`+t+`" not defined in `+e,{loc:n});return i.lookupProperty(e,t)},lookupProperty:function(e,t){var n=e[t];if(n==null||Object.prototype.hasOwnProperty.call(e,t)||u.resultIsAllowed(n,i.protoAccessControl,t))return n},lookup:function(e,t){for(var n=e.length,r=0;r<n;r++){var a=e[r]&&i.lookupProperty(e[r],t);if(a!=null)return a}},lambda:function(e,t){return typeof e==`function`?e.call(t):e},escapeExpression:a.escapeExpression,invokePartial:r,fn:function(t){var n=e[t];return n.decorator=e[t+`_d`],n},programs:[],program:function(e,t,n,r,i){var a=this.programs[e],o=this.fn(e);return t||i||r||n?a=m(this,e,o,t,n,r,i):a||=this.programs[e]=m(this,e,o),a},data:function(e,t){for(;e&&t--;)e=e._parent;return e},mergeIfNeeded:function(e,t){var n=e||t;return e&&t&&e!==t&&(n=a.extend({},t,e)),n},nullContext:Object.seal({}),noop:t.VM.noop,compilerInfo:e.compiler};function s(t){var n=arguments.length<=1||arguments[1]===void 0?{}:arguments[1],r=n.data;s._setup(n),!n.partial&&e.useData&&(r=S(t,r));var a=void 0,o=e.useBlockParams?[]:void 0;e.useDepths&&(a=n.depths?t==n.depths[0]?n.depths:[t].concat(n.depths):[t]);function c(t){return``+e.main(i,t,i.helpers,i.partials,r,o,a)}return c=C(e.main,c,i,n.depths||[],r,o),c(t,n)}return s.isTop=!0,s._setup=function(r){if(r.partial)i.protoAccessControl=r.protoAccessControl,i.helpers=r.helpers,i.partials=r.partials,i.decorators=r.decorators,i.hooks=r.hooks;else{var o={};w(o,t.helpers,i),w(o,r.helpers,i),i.helpers=o,e.usePartial&&(i.partials=i.mergeIfNeeded(r.partials,t.partials)),(e.usePartial||e.useDecorators)&&(i.decorators=a.extend({},t.decorators,r.decorators)),i.hooks={},i.protoAccessControl=u.createProtoAccessControl(r);var s=r.allowCallsToHelperMissing||n;c.moveHelperToHooks(i,`helperMissing`,s),c.moveHelperToHooks(i,`blockHelperMissing`,s)}},s._child=function(t,n,r,a){if(e.useBlockParams&&!r)throw new o.default(`must pass block params`);if(e.useDepths&&!a)throw new o.default(`must pass parent depths`);return m(i,t,e[t],n,0,r,a)},s}function m(e,t,n,r,i,a,o){function s(t){var i=arguments.length<=1||arguments[1]===void 0?{}:arguments[1],s=o;return o&&t!=o[0]&&(t!==e.nullContext||o[0]!==null)&&(s=[t].concat(o)),n(e,t,e.helpers,e.partials,i.data||r,a&&[i.blockParams].concat(a),s)}return s=C(n,s,e,o,r,a),s.program=t,s.depth=o?o.length:0,s.blockParams=i||0,s}function _(e,t,n){return e?!e.call&&!n.name&&(n.name=e,e=x(n.partials,e)):e=n.name===`@partial-block`?x(n.data,`partial-block`):x(n.partials,n.name),e}function y(e,t,n){var r=x(n.data,`partial-block`);n.partial=!0,n.ids&&(n.data.contextPath=n.ids[0]||n.data.contextPath);var i=void 0;if(n.fn&&n.fn!==b&&(function(){n.data=s.createFrame(n.data);var e=n.fn;i=n.data[`partial-block`]=function(t){var n=arguments.length<=1||arguments[1]===void 0?{}:arguments[1];return n.data=s.createFrame(n.data),n.data[`partial-block`]=r,e(t,n)},e.partials&&(n.partials=a.extend({},n.partials,e.partials))})(),e===void 0&&i&&(e=i),e===void 0)throw new o.default(`The partial `+n.name+` could not be found`);if(e instanceof Function)return e(t,n)}function b(){return``}function x(e,t){if(e&&Object.prototype.hasOwnProperty.call(e,t))return e[t]}function S(e,t){return(!t||!(`root`in t))&&(t=t?s.createFrame(t):{},t.root=e),t}function C(e,t,n,r,i,o){if(e.decorator){var s={};t=e.decorator(t,s,n,r&&r[0],i,o,r),a.extend(t,s)}return t}function w(e,t,n){t&&Object.keys(t).forEach(function(r){var i=t[r];e[r]=T(i,n)})}function T(e,t){var n=t.lookupProperty;return l.wrapHelper(e,function(e){return e.lookupProperty=n,e})}})),b=t(((e,t)=>{e.__esModule=!0,e.default=function(e){(function(){typeof globalThis!=`object`&&(Object.prototype.__defineGetter__(`__magic__`,function(){return this}),__magic__.globalThis=__magic__,delete Object.prototype.__magic__)})();var t=globalThis.Handlebars;e.noConflict=function(){return globalThis.Handlebars===e&&(globalThis.Handlebars=t),e}},t.exports=e.default})),x=t(((e,t)=>{e.__esModule=!0;function i(e){return e&&e.__esModule?e:{default:e}}function a(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}var o=a(g()),s=i(_()),c=i(r()),l=a(n()),u=a(y()),d=i(b());function f(){var e=new o.HandlebarsEnvironment;return l.extend(e,o),e.SafeString=s.default,e.Exception=c.default,e.Utils=l,e.escapeExpression=l.escapeExpression,e.VM=u,e.template=function(t){return u.template(t,e)},e}var p=f();p.create=f,d.default(p),p.default=p,e.default=p,t.exports=e.default})),S=t(((e,t)=>{e.__esModule=!0;var n={helpers:{helperExpression:function(e){return e.type===`SubExpression`||(e.type===`MustacheStatement`||e.type===`BlockStatement`)&&!!(e.params&&e.params.length||e.hash)},scopedId:function(e){return/^\.|this\b/.test(e.original)},simpleId:function(e){return e.parts.length===1&&!n.helpers.scopedId(e)&&!e.depth}}};e.default=n,t.exports=e.default})),C=t(((e,t)=>{e.__esModule=!0,e.default=(function(){var e={trace:function(){},yy:{},symbols_:{error:2,root:3,program:4,EOF:5,program_repetition0:6,statement:7,mustache:8,block:9,rawBlock:10,partial:11,partialBlock:12,content:13,COMMENT:14,CONTENT:15,openRawBlock:16,rawBlock_repetition0:17,END_RAW_BLOCK:18,OPEN_RAW_BLOCK:19,helperName:20,openRawBlock_repetition0:21,openRawBlock_option0:22,CLOSE_RAW_BLOCK:23,openBlock:24,block_option0:25,closeBlock:26,openInverse:27,block_option1:28,OPEN_BLOCK:29,openBlock_repetition0:30,openBlock_option0:31,openBlock_option1:32,CLOSE:33,OPEN_INVERSE:34,openInverse_repetition0:35,openInverse_option0:36,openInverse_option1:37,openInverseChain:38,OPEN_INVERSE_CHAIN:39,openInverseChain_repetition0:40,openInverseChain_option0:41,openInverseChain_option1:42,inverseAndProgram:43,INVERSE:44,inverseChain:45,inverseChain_option0:46,OPEN_ENDBLOCK:47,OPEN:48,mustache_repetition0:49,mustache_option0:50,OPEN_UNESCAPED:51,mustache_repetition1:52,mustache_option1:53,CLOSE_UNESCAPED:54,OPEN_PARTIAL:55,partialName:56,partial_repetition0:57,partial_option0:58,openPartialBlock:59,OPEN_PARTIAL_BLOCK:60,openPartialBlock_repetition0:61,openPartialBlock_option0:62,param:63,sexpr:64,OPEN_SEXPR:65,sexpr_repetition0:66,sexpr_option0:67,CLOSE_SEXPR:68,hash:69,hash_repetition_plus0:70,hashSegment:71,ID:72,EQUALS:73,blockParams:74,OPEN_BLOCK_PARAMS:75,blockParams_repetition_plus0:76,CLOSE_BLOCK_PARAMS:77,path:78,dataName:79,STRING:80,NUMBER:81,BOOLEAN:82,UNDEFINED:83,NULL:84,DATA:85,pathSegments:86,SEP:87,$accept:0,$end:1},terminals_:{2:`error`,5:`EOF`,14:`COMMENT`,15:`CONTENT`,18:`END_RAW_BLOCK`,19:`OPEN_RAW_BLOCK`,23:`CLOSE_RAW_BLOCK`,29:`OPEN_BLOCK`,33:`CLOSE`,34:`OPEN_INVERSE`,39:`OPEN_INVERSE_CHAIN`,44:`INVERSE`,47:`OPEN_ENDBLOCK`,48:`OPEN`,51:`OPEN_UNESCAPED`,54:`CLOSE_UNESCAPED`,55:`OPEN_PARTIAL`,60:`OPEN_PARTIAL_BLOCK`,65:`OPEN_SEXPR`,68:`CLOSE_SEXPR`,72:`ID`,73:`EQUALS`,75:`OPEN_BLOCK_PARAMS`,77:`CLOSE_BLOCK_PARAMS`,80:`STRING`,81:`NUMBER`,82:`BOOLEAN`,83:`UNDEFINED`,84:`NULL`,85:`DATA`,87:`SEP`},productions_:[0,[3,2],[4,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[13,1],[10,3],[16,5],[9,4],[9,4],[24,6],[27,6],[38,6],[43,2],[45,3],[45,1],[26,3],[8,5],[8,5],[11,5],[12,3],[59,5],[63,1],[63,1],[64,5],[69,1],[71,3],[74,3],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[56,1],[56,1],[79,2],[78,1],[86,3],[86,1],[6,0],[6,2],[17,0],[17,2],[21,0],[21,2],[22,0],[22,1],[25,0],[25,1],[28,0],[28,1],[30,0],[30,2],[31,0],[31,1],[32,0],[32,1],[35,0],[35,2],[36,0],[36,1],[37,0],[37,1],[40,0],[40,2],[41,0],[41,1],[42,0],[42,1],[46,0],[46,1],[49,0],[49,2],[50,0],[50,1],[52,0],[52,2],[53,0],[53,1],[57,0],[57,2],[58,0],[58,1],[61,0],[61,2],[62,0],[62,1],[66,0],[66,2],[67,0],[67,1],[70,1],[70,2],[76,1],[76,2]],performAction:function(e,t,n,r,i,a,o){var s=a.length-1;switch(i){case 1:return a[s-1];case 2:this.$=r.prepareProgram(a[s]);break;case 3:this.$=a[s];break;case 4:this.$=a[s];break;case 5:this.$=a[s];break;case 6:this.$=a[s];break;case 7:this.$=a[s];break;case 8:this.$=a[s];break;case 9:this.$={type:`CommentStatement`,value:r.stripComment(a[s]),strip:r.stripFlags(a[s],a[s]),loc:r.locInfo(this._$)};break;case 10:this.$={type:`ContentStatement`,original:a[s],value:a[s],loc:r.locInfo(this._$)};break;case 11:this.$=r.prepareRawBlock(a[s-2],a[s-1],a[s],this._$);break;case 12:this.$={path:a[s-3],params:a[s-2],hash:a[s-1]};break;case 13:this.$=r.prepareBlock(a[s-3],a[s-2],a[s-1],a[s],!1,this._$);break;case 14:this.$=r.prepareBlock(a[s-3],a[s-2],a[s-1],a[s],!0,this._$);break;case 15:this.$={open:a[s-5],path:a[s-4],params:a[s-3],hash:a[s-2],blockParams:a[s-1],strip:r.stripFlags(a[s-5],a[s])};break;case 16:this.$={path:a[s-4],params:a[s-3],hash:a[s-2],blockParams:a[s-1],strip:r.stripFlags(a[s-5],a[s])};break;case 17:this.$={path:a[s-4],params:a[s-3],hash:a[s-2],blockParams:a[s-1],strip:r.stripFlags(a[s-5],a[s])};break;case 18:this.$={strip:r.stripFlags(a[s-1],a[s-1]),program:a[s]};break;case 19:var c=r.prepareBlock(a[s-2],a[s-1],a[s],a[s],!1,this._$),l=r.prepareProgram([c],a[s-1].loc);l.chained=!0,this.$={strip:a[s-2].strip,program:l,chain:!0};break;case 20:this.$=a[s];break;case 21:this.$={path:a[s-1],strip:r.stripFlags(a[s-2],a[s])};break;case 22:this.$=r.prepareMustache(a[s-3],a[s-2],a[s-1],a[s-4],r.stripFlags(a[s-4],a[s]),this._$);break;case 23:this.$=r.prepareMustache(a[s-3],a[s-2],a[s-1],a[s-4],r.stripFlags(a[s-4],a[s]),this._$);break;case 24:this.$={type:`PartialStatement`,name:a[s-3],params:a[s-2],hash:a[s-1],indent:``,strip:r.stripFlags(a[s-4],a[s]),loc:r.locInfo(this._$)};break;case 25:this.$=r.preparePartialBlock(a[s-2],a[s-1],a[s],this._$);break;case 26:this.$={path:a[s-3],params:a[s-2],hash:a[s-1],strip:r.stripFlags(a[s-4],a[s])};break;case 27:this.$=a[s];break;case 28:this.$=a[s];break;case 29:this.$={type:`SubExpression`,path:a[s-3],params:a[s-2],hash:a[s-1],loc:r.locInfo(this._$)};break;case 30:this.$={type:`Hash`,pairs:a[s],loc:r.locInfo(this._$)};break;case 31:this.$={type:`HashPair`,key:r.id(a[s-2]),value:a[s],loc:r.locInfo(this._$)};break;case 32:this.$=r.id(a[s-1]);break;case 33:this.$=a[s];break;case 34:this.$=a[s];break;case 35:this.$={type:`StringLiteral`,value:a[s],original:a[s],loc:r.locInfo(this._$)};break;case 36:this.$={type:`NumberLiteral`,value:Number(a[s]),original:Number(a[s]),loc:r.locInfo(this._$)};break;case 37:this.$={type:`BooleanLiteral`,value:a[s]===`true`,original:a[s]===`true`,loc:r.locInfo(this._$)};break;case 38:this.$={type:`UndefinedLiteral`,original:void 0,value:void 0,loc:r.locInfo(this._$)};break;case 39:this.$={type:`NullLiteral`,original:null,value:null,loc:r.locInfo(this._$)};break;case 40:this.$=a[s];break;case 41:this.$=a[s];break;case 42:this.$=r.preparePath(!0,a[s],this._$);break;case 43:this.$=r.preparePath(!1,a[s],this._$);break;case 44:a[s-2].push({part:r.id(a[s]),original:a[s],separator:a[s-1]}),this.$=a[s-2];break;case 45:this.$=[{part:r.id(a[s]),original:a[s]}];break;case 46:this.$=[];break;case 47:a[s-1].push(a[s]);break;case 48:this.$=[];break;case 49:a[s-1].push(a[s]);break;case 50:this.$=[];break;case 51:a[s-1].push(a[s]);break;case 58:this.$=[];break;case 59:a[s-1].push(a[s]);break;case 64:this.$=[];break;case 65:a[s-1].push(a[s]);break;case 70:this.$=[];break;case 71:a[s-1].push(a[s]);break;case 78:this.$=[];break;case 79:a[s-1].push(a[s]);break;case 82:this.$=[];break;case 83:a[s-1].push(a[s]);break;case 86:this.$=[];break;case 87:a[s-1].push(a[s]);break;case 90:this.$=[];break;case 91:a[s-1].push(a[s]);break;case 94:this.$=[];break;case 95:a[s-1].push(a[s]);break;case 98:this.$=[a[s]];break;case 99:a[s-1].push(a[s]);break;case 100:this.$=[a[s]];break;case 101:a[s-1].push(a[s])}},table:[{3:1,4:2,5:[2,46],6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{1:[3]},{5:[1,4]},{5:[2,2],7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:[1,12],15:[1,20],16:17,19:[1,23],24:15,27:16,29:[1,21],34:[1,22],39:[2,2],44:[2,2],47:[2,2],48:[1,13],51:[1,14],55:[1,18],59:19,60:[1,24]},{1:[2,1]},{5:[2,47],14:[2,47],15:[2,47],19:[2,47],29:[2,47],34:[2,47],39:[2,47],44:[2,47],47:[2,47],48:[2,47],51:[2,47],55:[2,47],60:[2,47]},{5:[2,3],14:[2,3],15:[2,3],19:[2,3],29:[2,3],34:[2,3],39:[2,3],44:[2,3],47:[2,3],48:[2,3],51:[2,3],55:[2,3],60:[2,3]},{5:[2,4],14:[2,4],15:[2,4],19:[2,4],29:[2,4],34:[2,4],39:[2,4],44:[2,4],47:[2,4],48:[2,4],51:[2,4],55:[2,4],60:[2,4]},{5:[2,5],14:[2,5],15:[2,5],19:[2,5],29:[2,5],34:[2,5],39:[2,5],44:[2,5],47:[2,5],48:[2,5],51:[2,5],55:[2,5],60:[2,5]},{5:[2,6],14:[2,6],15:[2,6],19:[2,6],29:[2,6],34:[2,6],39:[2,6],44:[2,6],47:[2,6],48:[2,6],51:[2,6],55:[2,6],60:[2,6]},{5:[2,7],14:[2,7],15:[2,7],19:[2,7],29:[2,7],34:[2,7],39:[2,7],44:[2,7],47:[2,7],48:[2,7],51:[2,7],55:[2,7],60:[2,7]},{5:[2,8],14:[2,8],15:[2,8],19:[2,8],29:[2,8],34:[2,8],39:[2,8],44:[2,8],47:[2,8],48:[2,8],51:[2,8],55:[2,8],60:[2,8]},{5:[2,9],14:[2,9],15:[2,9],19:[2,9],29:[2,9],34:[2,9],39:[2,9],44:[2,9],47:[2,9],48:[2,9],51:[2,9],55:[2,9],60:[2,9]},{20:25,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:36,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{4:37,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],39:[2,46],44:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{4:38,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],44:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{15:[2,48],17:39,18:[2,48]},{20:41,56:40,64:42,65:[1,43],72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{4:44,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{5:[2,10],14:[2,10],15:[2,10],18:[2,10],19:[2,10],29:[2,10],34:[2,10],39:[2,10],44:[2,10],47:[2,10],48:[2,10],51:[2,10],55:[2,10],60:[2,10]},{20:45,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:46,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:47,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:41,56:48,64:42,65:[1,43],72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{33:[2,78],49:49,65:[2,78],72:[2,78],80:[2,78],81:[2,78],82:[2,78],83:[2,78],84:[2,78],85:[2,78]},{23:[2,33],33:[2,33],54:[2,33],65:[2,33],68:[2,33],72:[2,33],75:[2,33],80:[2,33],81:[2,33],82:[2,33],83:[2,33],84:[2,33],85:[2,33]},{23:[2,34],33:[2,34],54:[2,34],65:[2,34],68:[2,34],72:[2,34],75:[2,34],80:[2,34],81:[2,34],82:[2,34],83:[2,34],84:[2,34],85:[2,34]},{23:[2,35],33:[2,35],54:[2,35],65:[2,35],68:[2,35],72:[2,35],75:[2,35],80:[2,35],81:[2,35],82:[2,35],83:[2,35],84:[2,35],85:[2,35]},{23:[2,36],33:[2,36],54:[2,36],65:[2,36],68:[2,36],72:[2,36],75:[2,36],80:[2,36],81:[2,36],82:[2,36],83:[2,36],84:[2,36],85:[2,36]},{23:[2,37],33:[2,37],54:[2,37],65:[2,37],68:[2,37],72:[2,37],75:[2,37],80:[2,37],81:[2,37],82:[2,37],83:[2,37],84:[2,37],85:[2,37]},{23:[2,38],33:[2,38],54:[2,38],65:[2,38],68:[2,38],72:[2,38],75:[2,38],80:[2,38],81:[2,38],82:[2,38],83:[2,38],84:[2,38],85:[2,38]},{23:[2,39],33:[2,39],54:[2,39],65:[2,39],68:[2,39],72:[2,39],75:[2,39],80:[2,39],81:[2,39],82:[2,39],83:[2,39],84:[2,39],85:[2,39]},{23:[2,43],33:[2,43],54:[2,43],65:[2,43],68:[2,43],72:[2,43],75:[2,43],80:[2,43],81:[2,43],82:[2,43],83:[2,43],84:[2,43],85:[2,43],87:[1,50]},{72:[1,35],86:51},{23:[2,45],33:[2,45],54:[2,45],65:[2,45],68:[2,45],72:[2,45],75:[2,45],80:[2,45],81:[2,45],82:[2,45],83:[2,45],84:[2,45],85:[2,45],87:[2,45]},{52:52,54:[2,82],65:[2,82],72:[2,82],80:[2,82],81:[2,82],82:[2,82],83:[2,82],84:[2,82],85:[2,82]},{25:53,38:55,39:[1,57],43:56,44:[1,58],45:54,47:[2,54]},{28:59,43:60,44:[1,58],47:[2,56]},{13:62,15:[1,20],18:[1,61]},{33:[2,86],57:63,65:[2,86],72:[2,86],80:[2,86],81:[2,86],82:[2,86],83:[2,86],84:[2,86],85:[2,86]},{33:[2,40],65:[2,40],72:[2,40],80:[2,40],81:[2,40],82:[2,40],83:[2,40],84:[2,40],85:[2,40]},{33:[2,41],65:[2,41],72:[2,41],80:[2,41],81:[2,41],82:[2,41],83:[2,41],84:[2,41],85:[2,41]},{20:64,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{26:65,47:[1,66]},{30:67,33:[2,58],65:[2,58],72:[2,58],75:[2,58],80:[2,58],81:[2,58],82:[2,58],83:[2,58],84:[2,58],85:[2,58]},{33:[2,64],35:68,65:[2,64],72:[2,64],75:[2,64],80:[2,64],81:[2,64],82:[2,64],83:[2,64],84:[2,64],85:[2,64]},{21:69,23:[2,50],65:[2,50],72:[2,50],80:[2,50],81:[2,50],82:[2,50],83:[2,50],84:[2,50],85:[2,50]},{33:[2,90],61:70,65:[2,90],72:[2,90],80:[2,90],81:[2,90],82:[2,90],83:[2,90],84:[2,90],85:[2,90]},{20:74,33:[2,80],50:71,63:72,64:75,65:[1,43],69:73,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{72:[1,79]},{23:[2,42],33:[2,42],54:[2,42],65:[2,42],68:[2,42],72:[2,42],75:[2,42],80:[2,42],81:[2,42],82:[2,42],83:[2,42],84:[2,42],85:[2,42],87:[1,50]},{20:74,53:80,54:[2,84],63:81,64:75,65:[1,43],69:82,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{26:83,47:[1,66]},{47:[2,55]},{4:84,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],39:[2,46],44:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{47:[2,20]},{20:85,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{4:86,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{26:87,47:[1,66]},{47:[2,57]},{5:[2,11],14:[2,11],15:[2,11],19:[2,11],29:[2,11],34:[2,11],39:[2,11],44:[2,11],47:[2,11],48:[2,11],51:[2,11],55:[2,11],60:[2,11]},{15:[2,49],18:[2,49]},{20:74,33:[2,88],58:88,63:89,64:75,65:[1,43],69:90,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{65:[2,94],66:91,68:[2,94],72:[2,94],80:[2,94],81:[2,94],82:[2,94],83:[2,94],84:[2,94],85:[2,94]},{5:[2,25],14:[2,25],15:[2,25],19:[2,25],29:[2,25],34:[2,25],39:[2,25],44:[2,25],47:[2,25],48:[2,25],51:[2,25],55:[2,25],60:[2,25]},{20:92,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:74,31:93,33:[2,60],63:94,64:75,65:[1,43],69:95,70:76,71:77,72:[1,78],75:[2,60],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:74,33:[2,66],36:96,63:97,64:75,65:[1,43],69:98,70:76,71:77,72:[1,78],75:[2,66],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:74,22:99,23:[2,52],63:100,64:75,65:[1,43],69:101,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:74,33:[2,92],62:102,63:103,64:75,65:[1,43],69:104,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{33:[1,105]},{33:[2,79],65:[2,79],72:[2,79],80:[2,79],81:[2,79],82:[2,79],83:[2,79],84:[2,79],85:[2,79]},{33:[2,81]},{23:[2,27],33:[2,27],54:[2,27],65:[2,27],68:[2,27],72:[2,27],75:[2,27],80:[2,27],81:[2,27],82:[2,27],83:[2,27],84:[2,27],85:[2,27]},{23:[2,28],33:[2,28],54:[2,28],65:[2,28],68:[2,28],72:[2,28],75:[2,28],80:[2,28],81:[2,28],82:[2,28],83:[2,28],84:[2,28],85:[2,28]},{23:[2,30],33:[2,30],54:[2,30],68:[2,30],71:106,72:[1,107],75:[2,30]},{23:[2,98],33:[2,98],54:[2,98],68:[2,98],72:[2,98],75:[2,98]},{23:[2,45],33:[2,45],54:[2,45],65:[2,45],68:[2,45],72:[2,45],73:[1,108],75:[2,45],80:[2,45],81:[2,45],82:[2,45],83:[2,45],84:[2,45],85:[2,45],87:[2,45]},{23:[2,44],33:[2,44],54:[2,44],65:[2,44],68:[2,44],72:[2,44],75:[2,44],80:[2,44],81:[2,44],82:[2,44],83:[2,44],84:[2,44],85:[2,44],87:[2,44]},{54:[1,109]},{54:[2,83],65:[2,83],72:[2,83],80:[2,83],81:[2,83],82:[2,83],83:[2,83],84:[2,83],85:[2,83]},{54:[2,85]},{5:[2,13],14:[2,13],15:[2,13],19:[2,13],29:[2,13],34:[2,13],39:[2,13],44:[2,13],47:[2,13],48:[2,13],51:[2,13],55:[2,13],60:[2,13]},{38:55,39:[1,57],43:56,44:[1,58],45:111,46:110,47:[2,76]},{33:[2,70],40:112,65:[2,70],72:[2,70],75:[2,70],80:[2,70],81:[2,70],82:[2,70],83:[2,70],84:[2,70],85:[2,70]},{47:[2,18]},{5:[2,14],14:[2,14],15:[2,14],19:[2,14],29:[2,14],34:[2,14],39:[2,14],44:[2,14],47:[2,14],48:[2,14],51:[2,14],55:[2,14],60:[2,14]},{33:[1,113]},{33:[2,87],65:[2,87],72:[2,87],80:[2,87],81:[2,87],82:[2,87],83:[2,87],84:[2,87],85:[2,87]},{33:[2,89]},{20:74,63:115,64:75,65:[1,43],67:114,68:[2,96],69:116,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{33:[1,117]},{32:118,33:[2,62],74:119,75:[1,120]},{33:[2,59],65:[2,59],72:[2,59],75:[2,59],80:[2,59],81:[2,59],82:[2,59],83:[2,59],84:[2,59],85:[2,59]},{33:[2,61],75:[2,61]},{33:[2,68],37:121,74:122,75:[1,120]},{33:[2,65],65:[2,65],72:[2,65],75:[2,65],80:[2,65],81:[2,65],82:[2,65],83:[2,65],84:[2,65],85:[2,65]},{33:[2,67],75:[2,67]},{23:[1,123]},{23:[2,51],65:[2,51],72:[2,51],80:[2,51],81:[2,51],82:[2,51],83:[2,51],84:[2,51],85:[2,51]},{23:[2,53]},{33:[1,124]},{33:[2,91],65:[2,91],72:[2,91],80:[2,91],81:[2,91],82:[2,91],83:[2,91],84:[2,91],85:[2,91]},{33:[2,93]},{5:[2,22],14:[2,22],15:[2,22],19:[2,22],29:[2,22],34:[2,22],39:[2,22],44:[2,22],47:[2,22],48:[2,22],51:[2,22],55:[2,22],60:[2,22]},{23:[2,99],33:[2,99],54:[2,99],68:[2,99],72:[2,99],75:[2,99]},{73:[1,108]},{20:74,63:125,64:75,65:[1,43],72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{5:[2,23],14:[2,23],15:[2,23],19:[2,23],29:[2,23],34:[2,23],39:[2,23],44:[2,23],47:[2,23],48:[2,23],51:[2,23],55:[2,23],60:[2,23]},{47:[2,19]},{47:[2,77]},{20:74,33:[2,72],41:126,63:127,64:75,65:[1,43],69:128,70:76,71:77,72:[1,78],75:[2,72],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{5:[2,24],14:[2,24],15:[2,24],19:[2,24],29:[2,24],34:[2,24],39:[2,24],44:[2,24],47:[2,24],48:[2,24],51:[2,24],55:[2,24],60:[2,24]},{68:[1,129]},{65:[2,95],68:[2,95],72:[2,95],80:[2,95],81:[2,95],82:[2,95],83:[2,95],84:[2,95],85:[2,95]},{68:[2,97]},{5:[2,21],14:[2,21],15:[2,21],19:[2,21],29:[2,21],34:[2,21],39:[2,21],44:[2,21],47:[2,21],48:[2,21],51:[2,21],55:[2,21],60:[2,21]},{33:[1,130]},{33:[2,63]},{72:[1,132],76:131},{33:[1,133]},{33:[2,69]},{15:[2,12],18:[2,12]},{14:[2,26],15:[2,26],19:[2,26],29:[2,26],34:[2,26],47:[2,26],48:[2,26],51:[2,26],55:[2,26],60:[2,26]},{23:[2,31],33:[2,31],54:[2,31],68:[2,31],72:[2,31],75:[2,31]},{33:[2,74],42:134,74:135,75:[1,120]},{33:[2,71],65:[2,71],72:[2,71],75:[2,71],80:[2,71],81:[2,71],82:[2,71],83:[2,71],84:[2,71],85:[2,71]},{33:[2,73],75:[2,73]},{23:[2,29],33:[2,29],54:[2,29],65:[2,29],68:[2,29],72:[2,29],75:[2,29],80:[2,29],81:[2,29],82:[2,29],83:[2,29],84:[2,29],85:[2,29]},{14:[2,15],15:[2,15],19:[2,15],29:[2,15],34:[2,15],39:[2,15],44:[2,15],47:[2,15],48:[2,15],51:[2,15],55:[2,15],60:[2,15]},{72:[1,137],77:[1,136]},{72:[2,100],77:[2,100]},{14:[2,16],15:[2,16],19:[2,16],29:[2,16],34:[2,16],44:[2,16],47:[2,16],48:[2,16],51:[2,16],55:[2,16],60:[2,16]},{33:[1,138]},{33:[2,75]},{33:[2,32]},{72:[2,101],77:[2,101]},{14:[2,17],15:[2,17],19:[2,17],29:[2,17],34:[2,17],39:[2,17],44:[2,17],47:[2,17],48:[2,17],51:[2,17],55:[2,17],60:[2,17]}],defaultActions:{4:[2,1],54:[2,55],56:[2,20],60:[2,57],73:[2,81],82:[2,85],86:[2,18],90:[2,89],101:[2,53],104:[2,93],110:[2,19],111:[2,77],116:[2,97],119:[2,63],122:[2,69],135:[2,75],136:[2,32]},parseError:function(e,t){throw Error(e)},parse:function(e){var t=this,n=[0],r=[null],i=[],a=this.table,o=``,s=0,c=0,l=0;this.lexer.setInput(e),this.lexer.yy=this.yy,this.yy.lexer=this.lexer,this.yy.parser=this,this.lexer.yylloc===void 0&&(this.lexer.yylloc={});var u=this.lexer.yylloc;i.push(u);var d=this.lexer.options&&this.lexer.options.ranges;typeof this.yy.parseError==`function`&&(this.parseError=this.yy.parseError);function f(){var e=t.lexer.lex()||1;return typeof e!=`number`&&(e=t.symbols_[e]||e),e}for(var p,m,h,g,_,v={},y,b,x,S;;){if(h=n[n.length-1],this.defaultActions[h]?g=this.defaultActions[h]:(p??=f(),g=a[h]&&a[h][p]),g===void 0||!g.length||!g[0]){var C=``;if(!l){for(y in S=[],a[h])this.terminals_[y]&&y>2&&S.push(`'`+this.terminals_[y]+`'`);C=this.lexer.showPosition?`Parse error on line `+(s+1)+`:
`+this.lexer.showPosition()+`
Expecting `+S.join(`, `)+`, got '`+(this.terminals_[p]||p)+`'`:`Parse error on line `+(s+1)+`: Unexpected `+(p==1?`end of input`:`'`+(this.terminals_[p]||p)+`'`),this.parseError(C,{text:this.lexer.match,token:this.terminals_[p]||p,line:this.lexer.yylineno,loc:u,expected:S})}}if(g[0]instanceof Array&&g.length>1)throw Error(`Parse Error: multiple actions possible at state: `+h+`, token: `+p);switch(g[0]){case 1:n.push(p),r.push(this.lexer.yytext),i.push(this.lexer.yylloc),n.push(g[1]),p=null,m?(p=m,m=null):(c=this.lexer.yyleng,o=this.lexer.yytext,s=this.lexer.yylineno,u=this.lexer.yylloc,l>0&&l--);break;case 2:if(b=this.productions_[g[1]][1],v.$=r[r.length-b],v._$={first_line:i[i.length-(b||1)].first_line,last_line:i[i.length-1].last_line,first_column:i[i.length-(b||1)].first_column,last_column:i[i.length-1].last_column},d&&(v._$.range=[i[i.length-(b||1)].range[0],i[i.length-1].range[1]]),_=this.performAction.call(v,o,c,s,this.yy,g[1],r,i),_!==void 0)return _;b&&(n=n.slice(0,-1*b*2),r=r.slice(0,-1*b),i=i.slice(0,-1*b)),n.push(this.productions_[g[1]][0]),r.push(v.$),i.push(v._$),x=a[n[n.length-2]][n[n.length-1]],n.push(x);break;case 3:return!0}}return!0}};e.lexer=(function(){var e={EOF:1,parseError:function(e,t){if(this.yy.parser)this.yy.parser.parseError(e,t);else throw Error(e)},setInput:function(e){return this._input=e,this._more=this._less=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match=``,this.conditionStack=[`INITIAL`],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var e=this._input[0];return this.yytext+=e,this.yyleng++,this.offset++,this.match+=e,this.matched+=e,e.match(/(?:\r\n?|\n).*/g)?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),e},unput:function(e){var t=e.length,n=e.split(/(?:\r\n?|\n)/g);this._input=e+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-t-1),this.offset-=t;var r=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),n.length-1&&(this.yylineno-=n.length-1);var i=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:n?(n.length===r.length?this.yylloc.first_column:0)+r[r.length-n.length].length-n[0].length:this.yylloc.first_column-t},this.options.ranges&&(this.yylloc.range=[i[0],i[0]+this.yyleng-t]),this},more:function(){return this._more=!0,this},less:function(e){this.unput(this.match.slice(e))},pastInput:function(){var e=this.matched.substr(0,this.matched.length-this.match.length);return(e.length>20?`...`:``)+e.substr(-20).replace(/\n/g,``)},upcomingInput:function(){var e=this.match;return e.length<20&&(e+=this._input.substr(0,20-e.length)),(e.substr(0,20)+(e.length>20?`...`:``)).replace(/\n/g,``)},showPosition:function(){var e=this.pastInput(),t=Array(e.length+1).join(`-`);return e+this.upcomingInput()+`
`+t+`^`},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var e,t,n,r,i;this._more||(this.yytext=``,this.match=``);for(var a=this._currentRules(),o=0;o<a.length&&(n=this._input.match(this.rules[a[o]]),!(n&&(!t||n[0].length>t[0].length)&&(t=n,r=o,!this.options.flex)));o++);return t?(i=t[0].match(/(?:\r\n?|\n).*/g),i&&(this.yylineno+=i.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:i?i[i.length-1].length-i[i.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+t[0].length},this.yytext+=t[0],this.match+=t[0],this.matches=t,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._input=this._input.slice(t[0].length),this.matched+=t[0],e=this.performAction.call(this,this.yy,this,a[r],this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),e||void 0):this._input===``?this.EOF:this.parseError(`Lexical error on line `+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:``,token:null,line:this.yylineno})},lex:function(){var e=this.next();return e===void 0?this.lex():e},begin:function(e){this.conditionStack.push(e)},popState:function(){return this.conditionStack.pop()},_currentRules:function(){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules},topState:function(){return this.conditionStack[this.conditionStack.length-2]},pushState:function(e){this.begin(e)}};return e.options={},e.performAction=function(e,t,n,r){function i(e,n){return t.yytext=t.yytext.substring(e,t.yyleng-n+e)}switch(n){case 0:if(t.yytext.slice(-2)===`\\\\`?(i(0,1),this.begin(`mu`)):t.yytext.slice(-1)===`\\`?(i(0,1),this.begin(`emu`)):this.begin(`mu`),t.yytext)return 15;break;case 1:return 15;case 2:return this.popState(),15;case 3:return this.begin(`raw`),15;case 4:return this.popState(),this.conditionStack[this.conditionStack.length-1]===`raw`?15:(i(5,9),`END_RAW_BLOCK`);case 5:return 15;case 6:return this.popState(),14;case 7:return 65;case 8:return 68;case 9:return 19;case 10:return this.popState(),this.begin(`raw`),23;case 11:return 55;case 12:return 60;case 13:return 29;case 14:return 47;case 15:return this.popState(),44;case 16:return this.popState(),44;case 17:return 34;case 18:return 39;case 19:return 51;case 20:return 48;case 21:this.unput(t.yytext),this.popState(),this.begin(`com`);break;case 22:return this.popState(),14;case 23:return 48;case 24:return 73;case 25:return 72;case 26:return 72;case 27:return 87;case 28:break;case 29:return this.popState(),54;case 30:return this.popState(),33;case 31:return t.yytext=i(1,2).replace(/\\"/g,`"`),80;case 32:return t.yytext=i(1,2).replace(/\\'/g,`'`),80;case 33:return 85;case 34:return 82;case 35:return 82;case 36:return 83;case 37:return 84;case 38:return 81;case 39:return 75;case 40:return 77;case 41:return 72;case 42:return t.yytext=t.yytext.replace(/\\([\\\]])/g,`$1`),72;case 43:return`INVALID`;case 44:return 5}},e.rules=[/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/,/^(?:\{\{\{\{(?=[^\/]))/,/^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/,/^(?:[^\x00]+?(?=(\{\{\{\{)))/,/^(?:[\s\S]*?--(~)?\}\})/,/^(?:\()/,/^(?:\))/,/^(?:\{\{\{\{)/,/^(?:\}\}\}\})/,/^(?:\{\{(~)?>)/,/^(?:\{\{(~)?#>)/,/^(?:\{\{(~)?#\*?)/,/^(?:\{\{(~)?\/)/,/^(?:\{\{(~)?\^\s*(~)?\}\})/,/^(?:\{\{(~)?\s*else\s*(~)?\}\})/,/^(?:\{\{(~)?\^)/,/^(?:\{\{(~)?\s*else\b)/,/^(?:\{\{(~)?\{)/,/^(?:\{\{(~)?&)/,/^(?:\{\{(~)?!--)/,/^(?:\{\{(~)?![\s\S]*?\}\})/,/^(?:\{\{(~)?\*?)/,/^(?:=)/,/^(?:\.\.)/,/^(?:\.(?=([=~}\s\/.)|])))/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}(~)?\}\})/,/^(?:(~)?\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@)/,/^(?:true(?=([~}\s)])))/,/^(?:false(?=([~}\s)])))/,/^(?:undefined(?=([~}\s)])))/,/^(?:null(?=([~}\s)])))/,/^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/,/^(?:as\s+\|)/,/^(?:\|)/,/^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/,/^(?:\[(\\\]|[^\]])*\])/,/^(?:.)/,/^(?:$)/],e.conditions={mu:{rules:[7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44],inclusive:!1},emu:{rules:[2],inclusive:!1},com:{rules:[6],inclusive:!1},raw:{rules:[3,4,5],inclusive:!1},INITIAL:{rules:[0,1,44],inclusive:!0}},e})();function t(){this.yy={}}return t.prototype=e,e.Parser=t,new t})(),t.exports=e.default})),w=t(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var i=n(r());function a(){this.parents=[]}a.prototype={constructor:a,mutating:!1,acceptKey:function(e,t){var n=this.accept(e[t]);if(this.mutating){if(n&&!a.prototype[n.type])throw new i.default(`Unexpected node type "`+n.type+`" found when accepting `+t+` on `+e.type);e[t]=n}},acceptRequired:function(e,t){if(this.acceptKey(e,t),!e[t])throw new i.default(e.type+` requires `+t)},acceptArray:function(e){for(var t=0,n=e.length;t<n;t++)this.acceptKey(e,t),e[t]||(e.splice(t,1),t--,n--)},accept:function(e){if(e){if(!this[e.type])throw new i.default(`Unknown type: `+e.type,e);this.current&&this.parents.unshift(this.current),this.current=e;var t=this[e.type](e);if(this.current=this.parents.shift(),!this.mutating||t)return t;if(t!==!1)return e}},Program:function(e){this.acceptArray(e.body)},MustacheStatement:o,Decorator:o,BlockStatement:s,DecoratorBlock:s,PartialStatement:c,PartialBlockStatement:function(e){c.call(this,e),this.acceptKey(e,`program`)},ContentStatement:function(){},CommentStatement:function(){},SubExpression:o,PathExpression:function(){},StringLiteral:function(){},NumberLiteral:function(){},BooleanLiteral:function(){},UndefinedLiteral:function(){},NullLiteral:function(){},Hash:function(e){this.acceptArray(e.pairs)},HashPair:function(e){this.acceptRequired(e,`value`)}};function o(e){this.acceptRequired(e,`path`),this.acceptArray(e.params),this.acceptKey(e,`hash`)}function s(e){o.call(this,e),this.acceptKey(e,`program`),this.acceptKey(e,`inverse`)}function c(e){this.acceptRequired(e,`name`),this.acceptArray(e.params),this.acceptKey(e,`hash`)}e.default=a,t.exports=e.default})),T=t(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var r=n(w());function i(){var e=arguments.length<=0||arguments[0]===void 0?{}:arguments[0];this.options=e}i.prototype=new r.default,i.prototype.Program=function(e){var t=!this.options.ignoreStandalone,n=!this.isRootSeen;this.isRootSeen=!0;for(var r=e.body,i=0,l=r.length;i<l;i++){var u=r[i],d=this.accept(u);if(d){var f=a(r,i,n),p=o(r,i,n),m=d.openStandalone&&f,h=d.closeStandalone&&p,g=d.inlineStandalone&&f&&p;d.close&&s(r,i,!0),d.open&&c(r,i,!0),t&&g&&(s(r,i),c(r,i)&&u.type===`PartialStatement`&&(u.indent=/([ \t]+$)/.exec(r[i-1].original)[1])),t&&m&&(s((u.program||u.inverse).body),c(r,i)),t&&h&&(s(r,i),c((u.inverse||u.program).body))}}return e},i.prototype.BlockStatement=i.prototype.DecoratorBlock=i.prototype.PartialBlockStatement=function(e){this.accept(e.program),this.accept(e.inverse);var t=e.program||e.inverse,n=e.program&&e.inverse,r=n,i=n;if(n&&n.chained)for(r=n.body[0].program;i.chained;)i=i.body[i.body.length-1].program;var l={open:e.openStrip.open,close:e.closeStrip.close,openStandalone:o(t.body),closeStandalone:a((r||t).body)};if(e.openStrip.close&&s(t.body,null,!0),n){var u=e.inverseStrip;u.open&&c(t.body,null,!0),u.close&&s(r.body,null,!0),e.closeStrip.open&&c(i.body,null,!0),!this.options.ignoreStandalone&&a(t.body)&&o(r.body)&&(c(t.body),s(r.body))}else e.closeStrip.open&&c(t.body,null,!0);return l},i.prototype.Decorator=i.prototype.MustacheStatement=function(e){return e.strip},i.prototype.PartialStatement=i.prototype.CommentStatement=function(e){var t=e.strip||{};return{inlineStandalone:!0,open:t.open,close:t.close}};function a(e,t,n){t===void 0&&(t=e.length);var r=e[t-1],i=e[t-2];if(!r)return n;if(r.type===`ContentStatement`)return(i||!n?/\r?\n\s*?$/:/(^|\r?\n)\s*?$/).test(r.original)}function o(e,t,n){t===void 0&&(t=-1);var r=e[t+1],i=e[t+2];if(!r)return n;if(r.type===`ContentStatement`)return(i||!n?/^\s*?\r?\n/:/^\s*?(\r?\n|$)/).test(r.original)}function s(e,t,n){var r=e[t==null?0:t+1];if(!(!r||r.type!==`ContentStatement`||!n&&r.rightStripped)){var i=r.value;r.value=r.value.replace(n?/^\s+/:/^[ \t]*\r?\n?/,``),r.rightStripped=r.value!==i}}function c(e,t,n){var r=e[t==null?e.length-1:t-1];if(!(!r||r.type!==`ContentStatement`||!n&&r.leftStripped)){var i=r.value;return r.value=r.value.replace(n?/\s+$/:/[ \t]+$/,``),r.leftStripped=r.value!==i,r.leftStripped}}e.default=i,t.exports=e.default})),ee=t((e=>{e.__esModule=!0,e.SourceLocation=a,e.id=o,e.stripFlags=s,e.stripComment=c,e.preparePath=l,e.prepareMustache=u,e.prepareRawBlock=d,e.prepareBlock=f,e.prepareProgram=p,e.preparePartialBlock=m;function t(e){return e&&e.__esModule?e:{default:e}}var n=t(r());function i(e,t){if(t=t.path?t.path.original:t,e.path.original!==t){var r={loc:e.path.loc};throw new n.default(e.path.original+` doesn't match `+t,r)}}function a(e,t){this.source=e,this.start={line:t.first_line,column:t.first_column},this.end={line:t.last_line,column:t.last_column}}function o(e){return/^\[.*\]$/.test(e)?e.substring(1,e.length-1):e}function s(e,t){return{open:e.charAt(2)===`~`,close:t.charAt(t.length-3)===`~`}}function c(e){return e.replace(/^\{\{~?!-?-?/,``).replace(/-?-?~?\}\}$/,``)}function l(e,t,r){r=this.locInfo(r);for(var i=e?`@`:``,a=[],o=0,s=0,c=t.length;s<c;s++){var l=t[s].part,u=t[s].original!==l;if(i+=(t[s].separator||``)+l,!u&&(l===`..`||l===`.`||l===`this`)){if(a.length>0)throw new n.default(`Invalid path: `+i,{loc:r});l===`..`&&o++}else a.push(l)}return{type:`PathExpression`,data:e,depth:o,parts:a,original:i,loc:r}}function u(e,t,n,r,i,a){var o=r.charAt(3)||r.charAt(2),s=o!==`{`&&o!==`&`;return{type:/\*/.test(r)?`Decorator`:`MustacheStatement`,path:e,params:t,hash:n,escaped:s,strip:i,loc:this.locInfo(a)}}function d(e,t,n,r){i(e,n),r=this.locInfo(r);var a={type:`Program`,body:t,strip:{},loc:r};return{type:`BlockStatement`,path:e.path,params:e.params,hash:e.hash,program:a,openStrip:{},inverseStrip:{},closeStrip:{},loc:r}}function f(e,t,r,a,o,s){a&&a.path&&i(e,a);var c=/\*/.test(e.open);t.blockParams=e.blockParams;var l=void 0,u=void 0;if(r){if(c)throw new n.default(`Unexpected inverse block on decorator`,r);r.chain&&(r.program.body[0].closeStrip=a.strip),u=r.strip,l=r.program}return o&&(o=l,l=t,t=o),{type:c?`DecoratorBlock`:`BlockStatement`,path:e.path,params:e.params,hash:e.hash,program:t,inverse:l,openStrip:e.strip,inverseStrip:u,closeStrip:a&&a.strip,loc:this.locInfo(s)}}function p(e,t){if(!t&&e.length){var n=e[0].loc,r=e[e.length-1].loc;n&&r&&(t={source:n.source,start:{line:n.start.line,column:n.start.column},end:{line:r.end.line,column:r.end.column}})}return{type:`Program`,body:e,strip:{},loc:t}}function m(e,t,n,r){return i(e,n),{type:`PartialBlockStatement`,name:e.path,params:e.params,hash:e.hash,program:t,openStrip:e.strip,closeStrip:n&&n.strip,loc:this.locInfo(r)}}})),te=t((e=>{e.__esModule=!0,e.parseWithoutProcessing=d,e.parse=f;function t(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function i(e){return e&&e.__esModule?e:{default:e}}var a=i(C()),o=i(T()),s=t(ee()),c=i(r()),l=n();e.parser=a.default;var u={};l.extend(u,s);function d(e,t){return e.type===`Program`?(p(e),e):(a.default.yy=u,u.locInfo=function(e){return new u.SourceLocation(t&&t.srcName,e)},a.default.parse(e))}function f(e,t){var n=d(e,t);return new o.default(t).accept(n)}function p(e){m(e)}function m(e){if(e!=null){if(Array.isArray(e)){e.forEach(m);return}if(typeof e==`object`){if(e.type===`PathExpression`){if(!h(e.depth))throw new c.default(`Invalid AST: PathExpression.depth must be an integer`);if(!Array.isArray(e.parts))throw new c.default(`Invalid AST: PathExpression.parts must be an array`);for(var t=0;t<e.parts.length;t++)if(typeof e.parts[t]!=`string`)throw new c.default(`Invalid AST: PathExpression.parts must only contain strings`)}else if(e.type===`NumberLiteral`){if(typeof e.value!=`number`||!isFinite(e.value))throw new c.default(`Invalid AST: NumberLiteral.value must be a number`)}else if(e.type===`BooleanLiteral`&&typeof e.value!=`boolean`)throw new c.default(`Invalid AST: BooleanLiteral.value must be a boolean`);Object.keys(e).forEach(function(t){t!==`loc`&&m(e[t])})}}}function h(e){return typeof e==`number`&&isFinite(e)&&Math.floor(e)===e&&e>=0}})),ne=t((e=>{e.__esModule=!0,e.Compiler=c,e.precompile=l,e.compile=u;function t(e){return e&&e.__esModule?e:{default:e}}var i=t(r()),a=n(),o=t(S()),s=[].slice;function c(){}c.prototype={compiler:c,equals:function(e){var t=this.opcodes.length;if(e.opcodes.length!==t)return!1;for(var n=0;n<t;n++){var r=this.opcodes[n],i=e.opcodes[n];if(r.opcode!==i.opcode||!d(r.args,i.args))return!1}t=this.children.length;for(var n=0;n<t;n++)if(!this.children[n].equals(e.children[n]))return!1;return!0},guid:0,compile:function(e,t){return this.sourceNode=[],this.opcodes=[],this.children=[],this.options=t,this.stringParams=t.stringParams,this.trackIds=t.trackIds,t.blockParams=t.blockParams||[],t.knownHelpers=a.extend(Object.create(null),{helperMissing:!0,blockHelperMissing:!0,each:!0,if:!0,unless:!0,with:!0,log:!0,lookup:!0},t.knownHelpers),this.accept(e)},compileProgram:function(e){var t=new this.compiler().compile(e,this.options),n=this.guid++;return this.usePartial=this.usePartial||t.usePartial,this.children[n]=t,this.useDepths=this.useDepths||t.useDepths,n},accept:function(e){if(!this[e.type])throw new i.default(`Unknown type: `+e.type,e);this.sourceNode.unshift(e);var t=this[e.type](e);return this.sourceNode.shift(),t},Program:function(e){this.options.blockParams.unshift(e.blockParams);for(var t=e.body,n=t.length,r=0;r<n;r++)this.accept(t[r]);return this.options.blockParams.shift(),this.isSimple=n===1,this.blockParams=e.blockParams?e.blockParams.length:0,this},BlockStatement:function(e){f(e);var t=e.program,n=e.inverse;t&&=this.compileProgram(t),n&&=this.compileProgram(n);var r=this.classifySexpr(e);r===`helper`?this.helperSexpr(e,t,n):r===`simple`?(this.simpleSexpr(e),this.opcode(`pushProgram`,t),this.opcode(`pushProgram`,n),this.opcode(`emptyHash`),this.opcode(`blockValue`,e.path.original)):(this.ambiguousSexpr(e,t,n),this.opcode(`pushProgram`,t),this.opcode(`pushProgram`,n),this.opcode(`emptyHash`),this.opcode(`ambiguousBlockValue`)),this.opcode(`append`)},DecoratorBlock:function(e){var t=e.program&&this.compileProgram(e.program),n=this.setupFullMustacheParams(e,t,void 0),r=e.path;this.useDecorators=!0,this.opcode(`registerDecorator`,n.length,r.original)},PartialStatement:function(e){this.usePartial=!0;var t=e.program;t&&=this.compileProgram(e.program);var n=e.params;if(n.length>1)throw new i.default(`Unsupported number of partial arguments: `+n.length,e);n.length||(this.options.explicitPartialContext?this.opcode(`pushLiteral`,`undefined`):n.push({type:`PathExpression`,parts:[],depth:0}));var r=e.name.original,a=e.name.type===`SubExpression`;a&&this.accept(e.name),this.setupFullMustacheParams(e,t,void 0,!0);var o=e.indent||``;this.options.preventIndent&&o&&(this.opcode(`appendContent`,o),o=``),this.opcode(`invokePartial`,a,r,o),this.opcode(`append`)},PartialBlockStatement:function(e){this.PartialStatement(e)},MustacheStatement:function(e){this.SubExpression(e),e.escaped&&!this.options.noEscape?this.opcode(`appendEscaped`):this.opcode(`append`)},Decorator:function(e){this.DecoratorBlock(e)},ContentStatement:function(e){e.value&&this.opcode(`appendContent`,e.value)},CommentStatement:function(){},SubExpression:function(e){f(e);var t=this.classifySexpr(e);t===`simple`?this.simpleSexpr(e):t===`helper`?this.helperSexpr(e):this.ambiguousSexpr(e)},ambiguousSexpr:function(e,t,n){var r=e.path,i=r.parts[0],a=t!=null||n!=null;this.opcode(`getContext`,r.depth),this.opcode(`pushProgram`,t),this.opcode(`pushProgram`,n),r.strict=!0,this.accept(r),this.opcode(`invokeAmbiguous`,i,a)},simpleSexpr:function(e){var t=e.path;t.strict=!0,this.accept(t),this.opcode(`resolvePossibleLambda`)},helperSexpr:function(e,t,n){var r=this.setupFullMustacheParams(e,t,n),a=e.path,s=a.parts[0];if(this.options.knownHelpers[s])this.opcode(`invokeKnownHelper`,r.length,s);else if(this.options.knownHelpersOnly)throw new i.default(`You specified knownHelpersOnly, but used the unknown helper `+s,e);else a.strict=!0,a.falsy=!0,this.accept(a),this.opcode(`invokeHelper`,r.length,a.original,o.default.helpers.simpleId(a))},PathExpression:function(e){this.addDepth(e.depth),this.opcode(`getContext`,e.depth);var t=e.parts[0],n=o.default.helpers.scopedId(e),r=!e.depth&&!n&&this.blockParamIndex(t);r?this.opcode(`lookupBlockParam`,r,e.parts):t?e.data?(this.options.data=!0,this.opcode(`lookupData`,e.depth,e.parts,e.strict)):this.opcode(`lookupOnContext`,e.parts,e.falsy,e.strict,n):this.opcode(`pushContext`)},StringLiteral:function(e){this.opcode(`pushString`,e.value)},NumberLiteral:function(e){this.opcode(`pushLiteral`,e.value)},BooleanLiteral:function(e){this.opcode(`pushLiteral`,e.value)},UndefinedLiteral:function(){this.opcode(`pushLiteral`,`undefined`)},NullLiteral:function(){this.opcode(`pushLiteral`,`null`)},Hash:function(e){var t=e.pairs,n=0,r=t.length;for(this.opcode(`pushHash`);n<r;n++)this.pushParam(t[n].value);for(;n--;)this.opcode(`assignToHash`,t[n].key);this.opcode(`popHash`)},opcode:function(e){this.opcodes.push({opcode:e,args:s.call(arguments,1),loc:this.sourceNode[0].loc})},addDepth:function(e){e&&(this.useDepths=!0)},classifySexpr:function(e){var t=o.default.helpers.simpleId(e.path),n=t&&!!this.blockParamIndex(e.path.parts[0]),r=!n&&o.default.helpers.helperExpression(e),i=!n&&(r||t);if(i&&!r){var a=e.path.parts[0],s=this.options;s.knownHelpers[a]?r=!0:s.knownHelpersOnly&&(i=!1)}return r?`helper`:i?`ambiguous`:`simple`},pushParams:function(e){for(var t=0,n=e.length;t<n;t++)this.pushParam(e[t])},pushParam:function(e){var t=e.value==null?e.original||``:e.value;if(this.stringParams)t.replace&&(t=t.replace(/^(\.?\.\/)*/g,``).replace(/\//g,`.`)),e.depth&&this.addDepth(e.depth),this.opcode(`getContext`,e.depth||0),this.opcode(`pushStringParam`,t,e.type),e.type===`SubExpression`&&this.accept(e);else{if(this.trackIds){var n=void 0;if(e.parts&&!o.default.helpers.scopedId(e)&&!e.depth&&(n=this.blockParamIndex(e.parts[0])),n){var r=e.parts.slice(1).join(`.`);this.opcode(`pushId`,`BlockParam`,n,r)}else t=e.original||t,t.replace&&(t=t.replace(/^this(?:\.|$)/,``).replace(/^\.\//,``).replace(/^\.$/,``)),this.opcode(`pushId`,e.type,t)}this.accept(e)}},setupFullMustacheParams:function(e,t,n,r){var i=e.params;return this.pushParams(i),this.opcode(`pushProgram`,t),this.opcode(`pushProgram`,n),e.hash?this.accept(e.hash):this.opcode(`emptyHash`,r),i},blockParamIndex:function(e){for(var t=0,n=this.options.blockParams.length;t<n;t++){var r=this.options.blockParams[t],i=r&&a.indexOf(r,e);if(r&&i>=0)return[t,i]}}};function l(e,t,n){if(e==null||typeof e!=`string`&&e.type!==`Program`)throw new i.default(`You must pass a string or Handlebars AST to Handlebars.precompile. You passed `+e);t||={},`data`in t||(t.data=!0),t.compat&&(t.useDepths=!0);var r=n.parse(e,t),a=new n.Compiler().compile(r,t);return new n.JavaScriptCompiler().compile(a,t)}function u(e,t,n){if(t===void 0&&(t={}),e==null||typeof e!=`string`&&e.type!==`Program`)throw new i.default(`You must pass a string or Handlebars AST to Handlebars.compile. You passed `+e);t=a.extend({},t),`data`in t||(t.data=!0),t.compat&&(t.useDepths=!0);var r=void 0;function o(){var r=n.parse(e,t),i=new n.Compiler().compile(r,t),a=new n.JavaScriptCompiler().compile(i,t,void 0,!0);return n.template(a)}function s(e,t){return r||=o(),r.call(this,e,t)}return s._setup=function(e){return r||=o(),r._setup(e)},s._child=function(e,t,n,i){return r||=o(),r._child(e,t,n,i)},s}function d(e,t){if(e===t)return!0;if(a.isArray(e)&&a.isArray(t)&&e.length===t.length){for(var n=0;n<e.length;n++)if(!d(e[n],t[n]))return!1;return!0}}function f(e){if(!e.path.parts){var t=e.path;e.path={type:`PathExpression`,data:!1,depth:0,parts:[t.original+``],original:t.original+``,loc:t.loc}}}})),re=t((e=>{var t=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`.split(``);e.encode=function(e){if(0<=e&&e<t.length)return t[e];throw TypeError(`Must be between 0 and 63: `+e)},e.decode=function(e){var t=65,n=90,r=97,i=122,a=48;return t<=e&&e<=n?e-t:r<=e&&e<=i?e-r+26:a<=e&&e<=57?e-a+52:e==43?62:e==47?63:-1}})),E=t((e=>{var t=re(),n=5,r=1<<n,i=r-1,a=r;function o(e){return e<0?(-e<<1)+1:(e<<1)+0}function s(e){var t=(e&1)==1,n=e>>1;return t?-n:n}e.encode=function(e){var r=``,s,c=o(e);do s=c&i,c>>>=n,c>0&&(s|=a),r+=t.encode(s);while(c>0);return r},e.decode=function(e,r,o){var c=e.length,l=0,u=0,d,f;do{if(r>=c)throw Error(`Expected more digits in base 64 VLQ value.`);if(f=t.decode(e.charCodeAt(r++)),f===-1)throw Error(`Invalid base64 digit: `+e.charAt(r-1));d=!!(f&a),f&=i,l+=f<<u,u+=n}while(d);o.value=s(l),o.rest=r}})),D=t((e=>{function t(e,t,n){if(t in e)return e[t];if(arguments.length===3)return n;throw Error(`"`+t+`" is a required argument.`)}e.getArg=t;var n=/^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/,r=/^data:.+\,.+$/;function i(e){var t=e.match(n);return t?{scheme:t[1],auth:t[2],host:t[3],port:t[4],path:t[5]}:null}e.urlParse=i;function a(e){var t=``;return e.scheme&&(t+=e.scheme+`:`),t+=`//`,e.auth&&(t+=e.auth+`@`),e.host&&(t+=e.host),e.port&&(t+=`:`+e.port),e.path&&(t+=e.path),t}e.urlGenerate=a;function o(t){var n=t,r=i(t);if(r){if(!r.path)return t;n=r.path}for(var o=e.isAbsolute(n),s=n.split(/\/+/),c,l=0,u=s.length-1;u>=0;u--)c=s[u],c===`.`?s.splice(u,1):c===`..`?l++:l>0&&(c===``?(s.splice(u+1,l),l=0):(s.splice(u,2),l--));return n=s.join(`/`),n===``&&(n=o?`/`:`.`),r?(r.path=n,a(r)):n}e.normalize=o;function s(e,t){e===``&&(e=`.`),t===``&&(t=`.`);var n=i(t),s=i(e);if(s&&(e=s.path||`/`),n&&!n.scheme)return s&&(n.scheme=s.scheme),a(n);if(n||t.match(r))return t;if(s&&!s.host&&!s.path)return s.host=t,a(s);var c=t.charAt(0)===`/`?t:o(e.replace(/\/+$/,``)+`/`+t);return s?(s.path=c,a(s)):c}e.join=s,e.isAbsolute=function(e){return e.charAt(0)===`/`||n.test(e)};function c(e,t){e===``&&(e=`.`),e=e.replace(/\/$/,``);for(var n=0;t.indexOf(e+`/`)!==0;){var r=e.lastIndexOf(`/`);if(r<0||(e=e.slice(0,r),e.match(/^([^\/]+:\/)?\/*$/)))return t;++n}return Array(n+1).join(`../`)+t.substr(e.length+1)}e.relative=c;var l=function(){return!(`__proto__`in Object.create(null))}();function u(e){return e}function d(e){return p(e)?`$`+e:e}e.toSetString=l?u:d;function f(e){return p(e)?e.slice(1):e}e.fromSetString=l?u:f;function p(e){if(!e)return!1;var t=e.length;if(t<9||e.charCodeAt(t-1)!==95||e.charCodeAt(t-2)!==95||e.charCodeAt(t-3)!==111||e.charCodeAt(t-4)!==116||e.charCodeAt(t-5)!==111||e.charCodeAt(t-6)!==114||e.charCodeAt(t-7)!==112||e.charCodeAt(t-8)!==95||e.charCodeAt(t-9)!==95)return!1;for(var n=t-10;n>=0;n--)if(e.charCodeAt(n)!==36)return!1;return!0}function m(e,t,n){var r=g(e.source,t.source);return r!==0||(r=e.originalLine-t.originalLine,r!==0)||(r=e.originalColumn-t.originalColumn,r!==0||n)||(r=e.generatedColumn-t.generatedColumn,r!==0)||(r=e.generatedLine-t.generatedLine,r!==0)?r:g(e.name,t.name)}e.compareByOriginalPositions=m;function h(e,t,n){var r=e.generatedLine-t.generatedLine;return r!==0||(r=e.generatedColumn-t.generatedColumn,r!==0||n)||(r=g(e.source,t.source),r!==0)||(r=e.originalLine-t.originalLine,r!==0)||(r=e.originalColumn-t.originalColumn,r!==0)?r:g(e.name,t.name)}e.compareByGeneratedPositionsDeflated=h;function g(e,t){return e===t?0:e===null?1:t===null?-1:e>t?1:-1}function _(e,t){var n=e.generatedLine-t.generatedLine;return n!==0||(n=e.generatedColumn-t.generatedColumn,n!==0)||(n=g(e.source,t.source),n!==0)||(n=e.originalLine-t.originalLine,n!==0)||(n=e.originalColumn-t.originalColumn,n!==0)?n:g(e.name,t.name)}e.compareByGeneratedPositionsInflated=_;function v(e){return JSON.parse(e.replace(/^\)]}'[^\n]*\n/,``))}e.parseSourceMapInput=v;function y(e,t,n){if(t||=``,e&&(e[e.length-1]!==`/`&&t[0]!==`/`&&(e+=`/`),t=e+t),n){var r=i(n);if(!r)throw Error(`sourceMapURL could not be parsed`);if(r.path){var c=r.path.lastIndexOf(`/`);c>=0&&(r.path=r.path.substring(0,c+1))}t=s(a(r),t)}return o(t)}e.computeSourceURL=y})),O=t((e=>{var t=D(),n=Object.prototype.hasOwnProperty,r=typeof Map<`u`;function i(){this._array=[],this._set=r?new Map:Object.create(null)}i.fromArray=function(e,t){for(var n=new i,r=0,a=e.length;r<a;r++)n.add(e[r],t);return n},i.prototype.size=function(){return r?this._set.size:Object.getOwnPropertyNames(this._set).length},i.prototype.add=function(e,i){var a=r?e:t.toSetString(e),o=r?this.has(e):n.call(this._set,a),s=this._array.length;(!o||i)&&this._array.push(e),o||(r?this._set.set(e,s):this._set[a]=s)},i.prototype.has=function(e){if(r)return this._set.has(e);var i=t.toSetString(e);return n.call(this._set,i)},i.prototype.indexOf=function(e){if(r){var i=this._set.get(e);if(i>=0)return i}else{var a=t.toSetString(e);if(n.call(this._set,a))return this._set[a]}throw Error(`"`+e+`" is not in the set.`)},i.prototype.at=function(e){if(e>=0&&e<this._array.length)return this._array[e];throw Error(`No element indexed by `+e)},i.prototype.toArray=function(){return this._array.slice()},e.ArraySet=i})),ie=t((e=>{var t=D();function n(e,n){var r=e.generatedLine,i=n.generatedLine,a=e.generatedColumn,o=n.generatedColumn;return i>r||i==r&&o>=a||t.compareByGeneratedPositionsInflated(e,n)<=0}function r(){this._array=[],this._sorted=!0,this._last={generatedLine:-1,generatedColumn:0}}r.prototype.unsortedForEach=function(e,t){this._array.forEach(e,t)},r.prototype.add=function(e){n(this._last,e)?(this._last=e,this._array.push(e)):(this._sorted=!1,this._array.push(e))},r.prototype.toArray=function(){return this._sorted||=(this._array.sort(t.compareByGeneratedPositionsInflated),!0),this._array},e.MappingList=r})),k=t((e=>{var t=E(),n=D(),r=O().ArraySet,i=ie().MappingList;function a(e){e||={},this._file=n.getArg(e,`file`,null),this._sourceRoot=n.getArg(e,`sourceRoot`,null),this._skipValidation=n.getArg(e,`skipValidation`,!1),this._sources=new r,this._names=new r,this._mappings=new i,this._sourcesContents=null}a.prototype._version=3,a.fromSourceMap=function(e){var t=e.sourceRoot,r=new a({file:e.file,sourceRoot:t});return e.eachMapping(function(e){var i={generated:{line:e.generatedLine,column:e.generatedColumn}};e.source!=null&&(i.source=e.source,t!=null&&(i.source=n.relative(t,i.source)),i.original={line:e.originalLine,column:e.originalColumn},e.name!=null&&(i.name=e.name)),r.addMapping(i)}),e.sources.forEach(function(i){var a=i;t!==null&&(a=n.relative(t,i)),r._sources.has(a)||r._sources.add(a);var o=e.sourceContentFor(i);o!=null&&r.setSourceContent(i,o)}),r},a.prototype.addMapping=function(e){var t=n.getArg(e,`generated`),r=n.getArg(e,`original`,null),i=n.getArg(e,`source`,null),a=n.getArg(e,`name`,null);this._skipValidation||this._validateMapping(t,r,i,a),i!=null&&(i=String(i),this._sources.has(i)||this._sources.add(i)),a!=null&&(a=String(a),this._names.has(a)||this._names.add(a)),this._mappings.add({generatedLine:t.line,generatedColumn:t.column,originalLine:r!=null&&r.line,originalColumn:r!=null&&r.column,source:i,name:a})},a.prototype.setSourceContent=function(e,t){var r=e;this._sourceRoot!=null&&(r=n.relative(this._sourceRoot,r)),t==null?this._sourcesContents&&(delete this._sourcesContents[n.toSetString(r)],Object.keys(this._sourcesContents).length===0&&(this._sourcesContents=null)):(this._sourcesContents||=Object.create(null),this._sourcesContents[n.toSetString(r)]=t)},a.prototype.applySourceMap=function(e,t,i){var a=t;if(t==null){if(e.file==null)throw Error(`SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`);a=e.file}var o=this._sourceRoot;o!=null&&(a=n.relative(o,a));var s=new r,c=new r;this._mappings.unsortedForEach(function(t){if(t.source===a&&t.originalLine!=null){var r=e.originalPositionFor({line:t.originalLine,column:t.originalColumn});r.source!=null&&(t.source=r.source,i!=null&&(t.source=n.join(i,t.source)),o!=null&&(t.source=n.relative(o,t.source)),t.originalLine=r.line,t.originalColumn=r.column,r.name!=null&&(t.name=r.name))}var l=t.source;l!=null&&!s.has(l)&&s.add(l);var u=t.name;u!=null&&!c.has(u)&&c.add(u)},this),this._sources=s,this._names=c,e.sources.forEach(function(t){var r=e.sourceContentFor(t);r!=null&&(i!=null&&(t=n.join(i,t)),o!=null&&(t=n.relative(o,t)),this.setSourceContent(t,r))},this)},a.prototype._validateMapping=function(e,t,n,r){if(t&&typeof t.line!=`number`&&typeof t.column!=`number`)throw Error(`original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.`);if(!(e&&`line`in e&&`column`in e&&e.line>0&&e.column>=0&&!t&&!n&&!r)&&!(e&&`line`in e&&`column`in e&&t&&`line`in t&&`column`in t&&e.line>0&&e.column>=0&&t.line>0&&t.column>=0&&n))throw Error(`Invalid mapping: `+JSON.stringify({generated:e,source:n,original:t,name:r}))},a.prototype._serializeMappings=function(){for(var e=0,r=1,i=0,a=0,o=0,s=0,c=``,l,u,d,f,p=this._mappings.toArray(),m=0,h=p.length;m<h;m++){if(u=p[m],l=``,u.generatedLine!==r)for(e=0;u.generatedLine!==r;)l+=`;`,r++;else if(m>0){if(!n.compareByGeneratedPositionsInflated(u,p[m-1]))continue;l+=`,`}l+=t.encode(u.generatedColumn-e),e=u.generatedColumn,u.source!=null&&(f=this._sources.indexOf(u.source),l+=t.encode(f-s),s=f,l+=t.encode(u.originalLine-1-a),a=u.originalLine-1,l+=t.encode(u.originalColumn-i),i=u.originalColumn,u.name!=null&&(d=this._names.indexOf(u.name),l+=t.encode(d-o),o=d)),c+=l}return c},a.prototype._generateSourcesContent=function(e,t){return e.map(function(e){if(!this._sourcesContents)return null;t!=null&&(e=n.relative(t,e));var r=n.toSetString(e);return Object.prototype.hasOwnProperty.call(this._sourcesContents,r)?this._sourcesContents[r]:null},this)},a.prototype.toJSON=function(){var e={version:this._version,sources:this._sources.toArray(),names:this._names.toArray(),mappings:this._serializeMappings()};return this._file!=null&&(e.file=this._file),this._sourceRoot!=null&&(e.sourceRoot=this._sourceRoot),this._sourcesContents&&(e.sourcesContent=this._generateSourcesContent(e.sources,e.sourceRoot)),e},a.prototype.toString=function(){return JSON.stringify(this.toJSON())},e.SourceMapGenerator=a})),ae=t((e=>{e.GREATEST_LOWER_BOUND=1,e.LEAST_UPPER_BOUND=2;function t(n,r,i,a,o,s){var c=Math.floor((r-n)/2)+n,l=o(i,a[c],!0);return l===0?c:l>0?r-c>1?t(c,r,i,a,o,s):s==e.LEAST_UPPER_BOUND?r<a.length?r:-1:c:c-n>1?t(n,c,i,a,o,s):s==e.LEAST_UPPER_BOUND?c:n<0?-1:n}e.search=function(n,r,i,a){if(r.length===0)return-1;var o=t(-1,r.length,n,r,i,a||e.GREATEST_LOWER_BOUND);if(o<0)return-1;for(;o-1>=0&&i(r[o],r[o-1],!0)===0;)--o;return o}})),oe=t((e=>{function t(e,t,n){var r=e[t];e[t]=e[n],e[n]=r}function n(e,t){return Math.round(e+Math.random()*(t-e))}function r(e,i,a,o){if(a<o){var s=n(a,o),c=a-1;t(e,s,o);for(var l=e[o],u=a;u<o;u++)i(e[u],l)<=0&&(c+=1,t(e,c,u));t(e,c+1,u);var d=c+1;r(e,i,a,d-1),r(e,i,d+1,o)}}e.quickSort=function(e,t){r(e,t,0,e.length-1)}})),se=t((e=>{var t=D(),n=ae(),r=O().ArraySet,i=E(),a=oe().quickSort;function o(e,n){var r=e;return typeof e==`string`&&(r=t.parseSourceMapInput(e)),r.sections==null?new s(r,n):new l(r,n)}o.fromSourceMap=function(e,t){return s.fromSourceMap(e,t)},o.prototype._version=3,o.prototype.__generatedMappings=null,Object.defineProperty(o.prototype,"_generatedMappings",{configurable:!0,enumerable:!0,get:function(){return this.__generatedMappings||this._parseMappings(this._mappings,this.sourceRoot),this.__generatedMappings}}),o.prototype.__originalMappings=null,Object.defineProperty(o.prototype,"_originalMappings",{configurable:!0,enumerable:!0,get:function(){return this.__originalMappings||this._parseMappings(this._mappings,this.sourceRoot),this.__originalMappings}}),o.prototype._charIsMappingSeparator=function(e,t){var n=e.charAt(t);return n===`;`||n===`,`},o.prototype._parseMappings=function(e,t){throw Error(`Subclasses must implement _parseMappings`)},o.GENERATED_ORDER=1,o.ORIGINAL_ORDER=2,o.GREATEST_LOWER_BOUND=1,o.LEAST_UPPER_BOUND=2,o.prototype.eachMapping=function(e,n,r){var i=n||null,a=r||o.GENERATED_ORDER,s;switch(a){case o.GENERATED_ORDER:s=this._generatedMappings;break;case o.ORIGINAL_ORDER:s=this._originalMappings;break;default:throw Error(`Unknown order of iteration.`)}var c=this.sourceRoot;s.map(function(e){var n=e.source===null?null:this._sources.at(e.source);return n=t.computeSourceURL(c,n,this._sourceMapURL),{source:n,generatedLine:e.generatedLine,generatedColumn:e.generatedColumn,originalLine:e.originalLine,originalColumn:e.originalColumn,name:e.name===null?null:this._names.at(e.name)}},this).forEach(e,i)},o.prototype.allGeneratedPositionsFor=function(e){var r=t.getArg(e,`line`),i={source:t.getArg(e,`source`),originalLine:r,originalColumn:t.getArg(e,`column`,0)};if(i.source=this._findSourceIndex(i.source),i.source<0)return[];var a=[],o=this._findMapping(i,this._originalMappings,`originalLine`,`originalColumn`,t.compareByOriginalPositions,n.LEAST_UPPER_BOUND);if(o>=0){var s=this._originalMappings[o];if(e.column===void 0)for(var c=s.originalLine;s&&s.originalLine===c;)a.push({line:t.getArg(s,`generatedLine`,null),column:t.getArg(s,`generatedColumn`,null),lastColumn:t.getArg(s,`lastGeneratedColumn`,null)}),s=this._originalMappings[++o];else for(var l=s.originalColumn;s&&s.originalLine===r&&s.originalColumn==l;)a.push({line:t.getArg(s,`generatedLine`,null),column:t.getArg(s,`generatedColumn`,null),lastColumn:t.getArg(s,`lastGeneratedColumn`,null)}),s=this._originalMappings[++o]}return a},e.SourceMapConsumer=o;function s(e,n){var i=e;typeof e==`string`&&(i=t.parseSourceMapInput(e));var a=t.getArg(i,`version`),o=t.getArg(i,`sources`),s=t.getArg(i,`names`,[]),c=t.getArg(i,`sourceRoot`,null),l=t.getArg(i,`sourcesContent`,null),u=t.getArg(i,`mappings`),d=t.getArg(i,`file`,null);if(a!=this._version)throw Error(`Unsupported version: `+a);c&&=t.normalize(c),o=o.map(String).map(t.normalize).map(function(e){return c&&t.isAbsolute(c)&&t.isAbsolute(e)?t.relative(c,e):e}),this._names=r.fromArray(s.map(String),!0),this._sources=r.fromArray(o,!0),this._absoluteSources=this._sources.toArray().map(function(e){return t.computeSourceURL(c,e,n)}),this.sourceRoot=c,this.sourcesContent=l,this._mappings=u,this._sourceMapURL=n,this.file=d}s.prototype=Object.create(o.prototype),s.prototype.consumer=o,s.prototype._findSourceIndex=function(e){var n=e;if(this.sourceRoot!=null&&(n=t.relative(this.sourceRoot,n)),this._sources.has(n))return this._sources.indexOf(n);var r;for(r=0;r<this._absoluteSources.length;++r)if(this._absoluteSources[r]==e)return r;return-1},s.fromSourceMap=function(e,n){var i=Object.create(s.prototype),o=i._names=r.fromArray(e._names.toArray(),!0),l=i._sources=r.fromArray(e._sources.toArray(),!0);i.sourceRoot=e._sourceRoot,i.sourcesContent=e._generateSourcesContent(i._sources.toArray(),i.sourceRoot),i.file=e._file,i._sourceMapURL=n,i._absoluteSources=i._sources.toArray().map(function(e){return t.computeSourceURL(i.sourceRoot,e,n)});for(var u=e._mappings.toArray().slice(),d=i.__generatedMappings=[],f=i.__originalMappings=[],p=0,m=u.length;p<m;p++){var h=u[p],g=new c;g.generatedLine=h.generatedLine,g.generatedColumn=h.generatedColumn,h.source&&(g.source=l.indexOf(h.source),g.originalLine=h.originalLine,g.originalColumn=h.originalColumn,h.name&&(g.name=o.indexOf(h.name)),f.push(g)),d.push(g)}return a(i.__originalMappings,t.compareByOriginalPositions),i},s.prototype._version=3,Object.defineProperty(s.prototype,"sources",{get:function(){return this._absoluteSources.slice()}});function c(){this.generatedLine=0,this.generatedColumn=0,this.source=null,this.originalLine=null,this.originalColumn=null,this.name=null}s.prototype._parseMappings=function(e,n){for(var r=1,o=0,s=0,l=0,u=0,d=0,f=e.length,p=0,m={},h={},g=[],_=[],v,y,b,x,S;p<f;)if(e.charAt(p)===`;`)r++,p++,o=0;else if(e.charAt(p)===`,`)p++;else{for(v=new c,v.generatedLine=r,x=p;x<f&&!this._charIsMappingSeparator(e,x);x++);if(y=e.slice(p,x),b=m[y],b)p+=y.length;else{for(b=[];p<x;)i.decode(e,p,h),S=h.value,p=h.rest,b.push(S);if(b.length===2)throw Error(`Found a source, but no line and column`);if(b.length===3)throw Error(`Found a source and line, but no column`);m[y]=b}v.generatedColumn=o+b[0],o=v.generatedColumn,b.length>1&&(v.source=u+b[1],u+=b[1],v.originalLine=s+b[2],s=v.originalLine,v.originalLine+=1,v.originalColumn=l+b[3],l=v.originalColumn,b.length>4&&(v.name=d+b[4],d+=b[4])),_.push(v),typeof v.originalLine==`number`&&g.push(v)}a(_,t.compareByGeneratedPositionsDeflated),this.__generatedMappings=_,a(g,t.compareByOriginalPositions),this.__originalMappings=g},s.prototype._findMapping=function(e,t,r,i,a,o){if(e[r]<=0)throw TypeError(`Line must be greater than or equal to 1, got `+e[r]);if(e[i]<0)throw TypeError(`Column must be greater than or equal to 0, got `+e[i]);return n.search(e,t,a,o)},s.prototype.computeColumnSpans=function(){for(var e=0;e<this._generatedMappings.length;++e){var t=this._generatedMappings[e];if(e+1<this._generatedMappings.length){var n=this._generatedMappings[e+1];if(t.generatedLine===n.generatedLine){t.lastGeneratedColumn=n.generatedColumn-1;continue}}t.lastGeneratedColumn=1/0}},s.prototype.originalPositionFor=function(e){var n={generatedLine:t.getArg(e,`line`),generatedColumn:t.getArg(e,`column`)},r=this._findMapping(n,this._generatedMappings,`generatedLine`,`generatedColumn`,t.compareByGeneratedPositionsDeflated,t.getArg(e,`bias`,o.GREATEST_LOWER_BOUND));if(r>=0){var i=this._generatedMappings[r];if(i.generatedLine===n.generatedLine){var a=t.getArg(i,`source`,null);a!==null&&(a=this._sources.at(a),a=t.computeSourceURL(this.sourceRoot,a,this._sourceMapURL));var s=t.getArg(i,`name`,null);return s!==null&&(s=this._names.at(s)),{source:a,line:t.getArg(i,`originalLine`,null),column:t.getArg(i,`originalColumn`,null),name:s}}}return{source:null,line:null,column:null,name:null}},s.prototype.hasContentsOfAllSources=function(){return this.sourcesContent?this.sourcesContent.length>=this._sources.size()&&!this.sourcesContent.some(function(e){return e==null}):!1},s.prototype.sourceContentFor=function(e,n){if(!this.sourcesContent)return null;var r=this._findSourceIndex(e);if(r>=0)return this.sourcesContent[r];var i=e;this.sourceRoot!=null&&(i=t.relative(this.sourceRoot,i));var a;if(this.sourceRoot!=null&&(a=t.urlParse(this.sourceRoot))){var o=i.replace(/^file:\/\//,``);if(a.scheme==`file`&&this._sources.has(o))return this.sourcesContent[this._sources.indexOf(o)];if((!a.path||a.path==`/`)&&this._sources.has(`/`+i))return this.sourcesContent[this._sources.indexOf(`/`+i)]}if(n)return null;throw Error(`"`+i+`" is not in the SourceMap.`)},s.prototype.generatedPositionFor=function(e){var n=t.getArg(e,`source`);if(n=this._findSourceIndex(n),n<0)return{line:null,column:null,lastColumn:null};var r={source:n,originalLine:t.getArg(e,`line`),originalColumn:t.getArg(e,`column`)},i=this._findMapping(r,this._originalMappings,`originalLine`,`originalColumn`,t.compareByOriginalPositions,t.getArg(e,`bias`,o.GREATEST_LOWER_BOUND));if(i>=0){var a=this._originalMappings[i];if(a.source===r.source)return{line:t.getArg(a,`generatedLine`,null),column:t.getArg(a,`generatedColumn`,null),lastColumn:t.getArg(a,`lastGeneratedColumn`,null)}}return{line:null,column:null,lastColumn:null}},e.BasicSourceMapConsumer=s;function l(e,n){var i=e;typeof e==`string`&&(i=t.parseSourceMapInput(e));var a=t.getArg(i,`version`),s=t.getArg(i,`sections`);if(a!=this._version)throw Error(`Unsupported version: `+a);this._sources=new r,this._names=new r;var c={line:-1,column:0};this._sections=s.map(function(e){if(e.url)throw Error(`Support for url field in sections not implemented.`);var r=t.getArg(e,`offset`),i=t.getArg(r,`line`),a=t.getArg(r,`column`);if(i<c.line||i===c.line&&a<c.column)throw Error(`Section offsets must be ordered and non-overlapping.`);return c=r,{generatedOffset:{generatedLine:i+1,generatedColumn:a+1},consumer:new o(t.getArg(e,`map`),n)}})}l.prototype=Object.create(o.prototype),l.prototype.constructor=o,l.prototype._version=3,Object.defineProperty(l.prototype,"sources",{get:function(){for(var e=[],t=0;t<this._sections.length;t++)for(var n=0;n<this._sections[t].consumer.sources.length;n++)e.push(this._sections[t].consumer.sources[n]);return e}}),l.prototype.originalPositionFor=function(e){var r={generatedLine:t.getArg(e,`line`),generatedColumn:t.getArg(e,`column`)},i=n.search(r,this._sections,function(e,t){return e.generatedLine-t.generatedOffset.generatedLine||e.generatedColumn-t.generatedOffset.generatedColumn}),a=this._sections[i];return a?a.consumer.originalPositionFor({line:r.generatedLine-(a.generatedOffset.generatedLine-1),column:r.generatedColumn-(a.generatedOffset.generatedLine===r.generatedLine?a.generatedOffset.generatedColumn-1:0),bias:e.bias}):{source:null,line:null,column:null,name:null}},l.prototype.hasContentsOfAllSources=function(){return this._sections.every(function(e){return e.consumer.hasContentsOfAllSources()})},l.prototype.sourceContentFor=function(e,t){for(var n=0;n<this._sections.length;n++){var r=this._sections[n].consumer.sourceContentFor(e,!0);if(r)return r}if(t)return null;throw Error(`"`+e+`" is not in the SourceMap.`)},l.prototype.generatedPositionFor=function(e){for(var n=0;n<this._sections.length;n++){var r=this._sections[n];if(r.consumer._findSourceIndex(t.getArg(e,`source`))!==-1){var i=r.consumer.generatedPositionFor(e);if(i)return{line:i.line+(r.generatedOffset.generatedLine-1),column:i.column+(r.generatedOffset.generatedLine===i.line?r.generatedOffset.generatedColumn-1:0)}}}return{line:null,column:null}},l.prototype._parseMappings=function(e,n){this.__generatedMappings=[],this.__originalMappings=[];for(var r=0;r<this._sections.length;r++)for(var i=this._sections[r],o=i.consumer._generatedMappings,s=0;s<o.length;s++){var c=o[s],l=i.consumer._sources.at(c.source);l=t.computeSourceURL(i.consumer.sourceRoot,l,this._sourceMapURL),this._sources.add(l),l=this._sources.indexOf(l);var u=null;c.name&&(u=i.consumer._names.at(c.name),this._names.add(u),u=this._names.indexOf(u));var d={source:l,generatedLine:c.generatedLine+(i.generatedOffset.generatedLine-1),generatedColumn:c.generatedColumn+(i.generatedOffset.generatedLine===c.generatedLine?i.generatedOffset.generatedColumn-1:0),originalLine:c.originalLine,originalColumn:c.originalColumn,name:u};this.__generatedMappings.push(d),typeof d.originalLine==`number`&&this.__originalMappings.push(d)}a(this.__generatedMappings,t.compareByGeneratedPositionsDeflated),a(this.__originalMappings,t.compareByOriginalPositions)},e.IndexedSourceMapConsumer=l})),ce=t((e=>{var t=k().SourceMapGenerator,n=D(),r=/(\r?\n)/,i=10,a=`$$$isSourceNode$$$`;function o(e,t,n,r,i){this.children=[],this.sourceContents={},this.line=e??null,this.column=t??null,this.source=n??null,this.name=i??null,this[a]=!0,r!=null&&this.add(r)}o.fromStringWithSourceMap=function(e,t,i){var a=new o,s=e.split(r),c=0,l=function(){return e()+(e()||``);function e(){return c<s.length?s[c++]:void 0}},u=1,d=0,f=null;return t.eachMapping(function(e){if(f!==null)if(u<e.generatedLine)p(f,l()),u++,d=0;else{var t=s[c]||``,n=t.substr(0,e.generatedColumn-d);s[c]=t.substr(e.generatedColumn-d),d=e.generatedColumn,p(f,n),f=e;return}for(;u<e.generatedLine;)a.add(l()),u++;if(d<e.generatedColumn){var t=s[c]||``;a.add(t.substr(0,e.generatedColumn)),s[c]=t.substr(e.generatedColumn),d=e.generatedColumn}f=e},this),c<s.length&&(f&&p(f,l()),a.add(s.splice(c).join(``))),t.sources.forEach(function(e){var r=t.sourceContentFor(e);r!=null&&(i!=null&&(e=n.join(i,e)),a.setSourceContent(e,r))}),a;function p(e,t){if(e===null||e.source===void 0)a.add(t);else{var r=i?n.join(i,e.source):e.source;a.add(new o(e.originalLine,e.originalColumn,r,t,e.name))}}},o.prototype.add=function(e){if(Array.isArray(e))e.forEach(function(e){this.add(e)},this);else if(e[a]||typeof e==`string`)e&&this.children.push(e);else throw TypeError(`Expected a SourceNode, string, or an array of SourceNodes and strings. Got `+e);return this},o.prototype.prepend=function(e){if(Array.isArray(e))for(var t=e.length-1;t>=0;t--)this.prepend(e[t]);else if(e[a]||typeof e==`string`)this.children.unshift(e);else throw TypeError(`Expected a SourceNode, string, or an array of SourceNodes and strings. Got `+e);return this},o.prototype.walk=function(e){for(var t,n=0,r=this.children.length;n<r;n++)t=this.children[n],t[a]?t.walk(e):t!==``&&e(t,{source:this.source,line:this.line,column:this.column,name:this.name})},o.prototype.join=function(e){var t,n,r=this.children.length;if(r>0){for(t=[],n=0;n<r-1;n++)t.push(this.children[n]),t.push(e);t.push(this.children[n]),this.children=t}return this},o.prototype.replaceRight=function(e,t){var n=this.children[this.children.length-1];return n[a]?n.replaceRight(e,t):typeof n==`string`?this.children[this.children.length-1]=n.replace(e,t):this.children.push(``.replace(e,t)),this},o.prototype.setSourceContent=function(e,t){this.sourceContents[n.toSetString(e)]=t},o.prototype.walkSourceContents=function(e){for(var t=0,r=this.children.length;t<r;t++)this.children[t][a]&&this.children[t].walkSourceContents(e);for(var i=Object.keys(this.sourceContents),t=0,r=i.length;t<r;t++)e(n.fromSetString(i[t]),this.sourceContents[i[t]])},o.prototype.toString=function(){var e=``;return this.walk(function(t){e+=t}),e},o.prototype.toStringWithSourceMap=function(e){var n={code:``,line:1,column:0},r=new t(e),a=!1,o=null,s=null,c=null,l=null;return this.walk(function(e,t){n.code+=e,t.source!==null&&t.line!==null&&t.column!==null?((o!==t.source||s!==t.line||c!==t.column||l!==t.name)&&r.addMapping({source:t.source,original:{line:t.line,column:t.column},generated:{line:n.line,column:n.column},name:t.name}),o=t.source,s=t.line,c=t.column,l=t.name,a=!0):a&&=(r.addMapping({generated:{line:n.line,column:n.column}}),o=null,!1);for(var u=0,d=e.length;u<d;u++)e.charCodeAt(u)===i?(n.line++,n.column=0,u+1===d?(o=null,a=!1):a&&r.addMapping({source:t.source,original:{line:t.line,column:t.column},generated:{line:n.line,column:n.column},name:t.name})):n.column++}),this.walkSourceContents(function(e,t){r.setSourceContent(e,t)}),{code:n.code,map:r}},e.SourceNode=o})),le=t((e=>{e.SourceMapGenerator=k().SourceMapGenerator,e.SourceMapConsumer=se().SourceMapConsumer,e.SourceNode=ce().SourceNode})),ue=t(((e,t)=>{e.__esModule=!0;var r=n(),i=void 0;try{(typeof define!=`function`||!define.amd)&&(i=le().SourceNode)}catch{}i||(i=function(e,t,n,r){this.src=``,r&&this.add(r)},i.prototype={add:function(e){r.isArray(e)&&(e=e.join(``)),this.src+=e},prepend:function(e){r.isArray(e)&&(e=e.join(``)),this.src=e+this.src},toStringWithSourceMap:function(){return{code:this.toString()}},toString:function(){return this.src}});function a(e,t,n){if(r.isArray(e)){for(var i=[],a=0,o=e.length;a<o;a++)i.push(t.wrap(e[a],n));return i}return typeof e==`boolean`||typeof e==`number`?e+``:e}function o(e){this.srcFile=e,this.source=[]}o.prototype={isEmpty:function(){return!this.source.length},prepend:function(e,t){this.source.unshift(this.wrap(e,t))},push:function(e,t){this.source.push(this.wrap(e,t))},merge:function(){var e=this.empty();return this.each(function(t){e.add([`  `,t,`
`])}),e},each:function(e){for(var t=0,n=this.source.length;t<n;t++)e(this.source[t])},empty:function(){var e=this.currentLocation||{start:{}};return new i(e.start.line,e.start.column,this.srcFile)},wrap:function(e){var t=arguments.length<=1||arguments[1]===void 0?this.currentLocation||{start:{}}:arguments[1];return e instanceof i?e:(e=a(e,this,t),new i(t.start.line,t.start.column,this.srcFile,e))},functionCall:function(e,t,n){return n=this.generateList(n),this.wrap([e,t?`.`+t+`(`:`(`,n,`)`])},quotedString:function(e){return`"`+(e+``).replace(/\\/g,`\\\\`).replace(/"/g,`\\"`).replace(/\n/g,`\\n`).replace(/\r/g,`\\r`).replace(/\u2028/g,`\\u2028`).replace(/\u2029/g,`\\u2029`)+`"`},objectLiteral:function(e){var t=this,n=[];Object.keys(e).forEach(function(r){var i=a(e[r],t);i!==`undefined`&&n.push([t.quotedString(r),`:`,i])});var r=this.generateList(n);return r.prepend(`{`),r.add(`}`),r},generateList:function(e){for(var t=this.empty(),n=0,r=e.length;n<r;n++)n&&t.add(`,`),t.add(a(e[n],this));return t},generateArray:function(e){var t=this.generateList(e);return t.prepend(`[`),t.add(`]`),t}},e.default=o,t.exports=e.default})),de=t(((e,t)=>{e.__esModule=!0;function i(e){return e&&e.__esModule?e:{default:e}}var a=g(),o=i(r()),s=n(),c=i(ue());function l(e){this.value=e}function u(){}u.prototype={nameLookup:function(e,t){return this.internalNameLookup(e,t)},depthedLookup:function(e){return[this.aliasable(`container.lookup`),`(depths, `,JSON.stringify(e),`)`]},compilerInfo:function(){var e=a.COMPILER_REVISION;return[e,a.REVISION_CHANGES[e]]},appendToBuffer:function(e,t,n){return s.isArray(e)||(e=[e]),e=this.source.wrap(e,t),this.environment.isSimple?[`return `,e,`;`]:n?[`buffer += `,e,`;`]:(e.appendToBuffer=!0,e)},initializeBuffer:function(){return this.quotedString(``)},internalNameLookup:function(e,t){return this.lookupPropertyFunctionIsUsed=!0,[`lookupProperty(`,e,`,`,JSON.stringify(t),`)`]},lookupPropertyFunctionIsUsed:!1,compile:function(e,t,n,r){this.environment=e,this.options=t,this.stringParams=this.options.stringParams,this.trackIds=this.options.trackIds,this.precompile=!r,this.name=this.environment.name,this.isChild=!!n,this.context=n||{decorators:[],programs:[],environments:[]},this.preamble(),this.stackSlot=0,this.stackVars=[],this.aliases={},this.registers={list:[]},this.hashes=[],this.compileStack=[],this.inlineStack=[],this.blockParams=[],this.compileChildren(e,t),this.useDepths=this.useDepths||e.useDepths||e.useDecorators||this.options.compat,this.useBlockParams=this.useBlockParams||e.useBlockParams;var i=e.opcodes,a=void 0,s=void 0,c=void 0,l=void 0;for(c=0,l=i.length;c<l;c++)a=i[c],this.source.currentLocation=a.loc,s||=a.loc,this[a.opcode].apply(this,a.args);if(this.source.currentLocation=s,this.pushSource(``),this.stackSlot||this.inlineStack.length||this.compileStack.length)throw new o.default(`Compile completed with content left on stack`);this.decorators.isEmpty()?this.decorators=void 0:(this.useDecorators=!0,this.decorators.prepend([`var decorators = container.decorators, `,this.lookupPropertyFunctionVarDeclaration(),`;
`]),this.decorators.push(`return fn;`),r?this.decorators=Function.apply(this,[`fn`,`props`,`container`,`depth0`,`data`,`blockParams`,`depths`,this.decorators.merge()]):(this.decorators.prepend(`function(fn, props, container, depth0, data, blockParams, depths) {
`),this.decorators.push(`}
`),this.decorators=this.decorators.merge()));var u=this.createFunctionContext(r);if(this.isChild)return u;var d={compiler:this.compilerInfo(),main:u};this.decorators&&(d.main_d=this.decorators,d.useDecorators=!0);var f=this.context,p=f.programs,m=f.decorators;for(c=0,l=p.length;c<l;c++)d[c]=p[c],m[c]&&(d[c+`_d`]=m[c],d.useDecorators=!0);return this.environment.usePartial&&(d.usePartial=!0),this.options.data&&(d.useData=!0),this.useDepths&&(d.useDepths=!0),this.useBlockParams&&(d.useBlockParams=!0),this.options.compat&&(d.compat=!0),r?d.compilerOptions=this.options:(d.compiler=JSON.stringify(d.compiler),this.source.currentLocation={start:{line:1,column:0}},d=this.objectLiteral(d),t.srcName?(d=d.toStringWithSourceMap({file:t.destName}),d.map=d.map&&d.map.toString()):d=d.toString()),d},preamble:function(){this.lastContext=0,this.source=new c.default(this.options.srcName),this.decorators=new c.default(this.options.srcName)},createFunctionContext:function(e){var t=this,n=``,r=this.stackVars.concat(this.registers.list);r.length>0&&(n+=`, `+r.join(`, `));var i=0;Object.keys(this.aliases).forEach(function(e){var r=t.aliases[e];r.children&&r.referenceCount>1&&(n+=`, alias`+ ++i+`=`+e,r.children[0]=`alias`+i)}),this.lookupPropertyFunctionIsUsed&&(n+=`, `+this.lookupPropertyFunctionVarDeclaration());var a=[`container`,`depth0`,`helpers`,`partials`,`data`];(this.useBlockParams||this.useDepths)&&a.push(`blockParams`),this.useDepths&&a.push(`depths`);var o=this.mergeSource(n);return e?(a.push(o),Function.apply(this,a)):this.source.wrap([`function(`,a.join(`,`),`) {
  `,o,`}`])},mergeSource:function(e){var t=this.environment.isSimple,n=!this.forceBuffer,r=void 0,i=void 0,a=void 0,o=void 0;return this.source.each(function(e){e.appendToBuffer?(a?e.prepend(`  + `):a=e,o=e):(a&&=(i?a.prepend(`buffer += `):r=!0,o.add(`;`),o=void 0),i=!0,t||(n=!1))}),n?a?(a.prepend(`return `),o.add(`;`)):i||this.source.push(`return "";`):(e+=`, buffer = `+(r?``:this.initializeBuffer()),a?(a.prepend(`return buffer + `),o.add(`;`)):this.source.push(`return buffer;`)),e&&this.source.prepend(`var `+e.substring(2)+(r?``:`;
`)),this.source.merge()},lookupPropertyFunctionVarDeclaration:function(){return`lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }`},blockValue:function(e){var t=this.aliasable(`container.hooks.blockHelperMissing`),n=[this.contextName(0)];this.setupHelperArgs(e,0,n);var r=this.popStack();n.splice(1,0,r),this.push(this.source.functionCall(t,`call`,n))},ambiguousBlockValue:function(){var e=this.aliasable(`container.hooks.blockHelperMissing`),t=[this.contextName(0)];this.setupHelperArgs(``,0,t,!0),this.flushInline();var n=this.topStack();t.splice(1,0,n),this.pushSource([`if (!`,this.lastHelper,`) { `,n,` = `,this.source.functionCall(e,`call`,t),`}`])},appendContent:function(e){this.pendingContent?e=this.pendingContent+e:this.pendingLocation=this.source.currentLocation,this.pendingContent=e},append:function(){if(this.isInline())this.replaceStack(function(e){return[` != null ? `,e,` : ""`]}),this.pushSource(this.appendToBuffer(this.popStack()));else{var e=this.popStack();this.pushSource([`if (`,e,` != null) { `,this.appendToBuffer(e,void 0,!0),` }`]),this.environment.isSimple&&this.pushSource([`else { `,this.appendToBuffer(`''`,void 0,!0),` }`])}},appendEscaped:function(){this.pushSource(this.appendToBuffer([this.aliasable(`container.escapeExpression`),`(`,this.popStack(),`)`]))},getContext:function(e){this.lastContext=e},pushContext:function(){this.pushStackLiteral(this.contextName(this.lastContext))},lookupOnContext:function(e,t,n,r){var i=0;!r&&this.options.compat&&!this.lastContext?this.push(this.depthedLookup(e[i++])):this.pushContext(),this.resolvePath(`context`,e,i,t,n)},lookupBlockParam:function(e,t){this.useBlockParams=!0,this.push([`blockParams[`,e[0],`][`,e[1],`]`]),this.resolvePath(`context`,t,1)},lookupData:function(e,t,n){e?this.pushStackLiteral(`container.data(data, `+e+`)`):this.pushStackLiteral(`data`),this.resolvePath(`data`,t,0,!0,n)},resolvePath:function(e,t,n,r,i){var a=this;if(this.options.strict||this.options.assumeObjects){this.push(d(this.options.strict&&i,this,t,n,e));return}for(var o=t.length,s=function(n){a.replaceStack(function(i){var o=a.nameLookup(i,t[n],e);return r?[` && `,o]:[` != null ? `,o,` : `,i]})},c=n;c<o;c++)s(c)},resolvePossibleLambda:function(){this.push([this.aliasable(`container.lambda`),`(`,this.popStack(),`, `,this.contextName(0),`)`])},pushStringParam:function(e,t){this.pushContext(),this.pushString(t),t!==`SubExpression`&&(typeof e==`string`?this.pushString(e):this.pushStackLiteral(e))},emptyHash:function(e){this.trackIds&&this.push(`{}`),this.stringParams&&(this.push(`{}`),this.push(`{}`)),this.pushStackLiteral(e?`undefined`:`{}`)},pushHash:function(){this.hash&&this.hashes.push(this.hash),this.hash={values:{},types:[],contexts:[],ids:[]}},popHash:function(){var e=this.hash;this.hash=this.hashes.pop(),this.trackIds&&this.push(this.objectLiteral(e.ids)),this.stringParams&&(this.push(this.objectLiteral(e.contexts)),this.push(this.objectLiteral(e.types))),this.push(this.objectLiteral(e.values))},pushString:function(e){this.pushStackLiteral(this.quotedString(e))},pushLiteral:function(e){this.pushStackLiteral(e)},pushProgram:function(e){e==null?this.pushStackLiteral(null):this.pushStackLiteral(this.programExpression(e))},registerDecorator:function(e,t){var n=this.nameLookup(`decorators`,t,`decorator`),r=this.setupHelperArgs(t,e);this.decorators.push([`var decorator = `,n,`;`]),this.decorators.push([`if (typeof decorator !== "function") { throw new Error(`,this.quotedString(`Missing decorator: "`+t+`"`),`); }`]),this.decorators.push([`fn = `,this.decorators.functionCall(`decorator`,``,[`fn`,`props`,`container`,r]),` || fn;`])},invokeHelper:function(e,t,n){var r=this.popStack(),i=this.setupHelper(e,t),a=[];n&&a.push(i.name),a.push(r),this.options.strict||a.push(this.aliasable(`container.hooks.helperMissing`));var o=[`(`,this.itemsSeparatedBy(a,`||`),`)`],s=this.source.functionCall(o,`call`,i.callParams);this.push(s)},itemsSeparatedBy:function(e,t){var n=[];n.push(e[0]);for(var r=1;r<e.length;r++)n.push(t,e[r]);return n},invokeKnownHelper:function(e,t){var n=this.setupHelper(e,t);this.push(this.source.functionCall(n.name,`call`,n.callParams))},invokeAmbiguous:function(e,t){this.useRegister(`helper`);var n=this.popStack();this.emptyHash();var r=this.setupHelper(0,e,t),i=[`(`,`(helper = `,this.lastHelper=this.nameLookup(`helpers`,e,`helper`),` || `,n,`)`];this.options.strict||(i[0]=`(helper = `,i.push(` != null ? helper : `,this.aliasable(`container.hooks.helperMissing`))),this.push([`(`,i,r.paramsInit?[`),(`,r.paramsInit]:[],`),`,`(typeof helper === `,this.aliasable(`"function"`),` ? `,this.source.functionCall(`helper`,`call`,r.callParams),` : helper))`])},invokePartial:function(e,t,n){var r=[],i=this.setupParams(t,1,r);e&&(t=this.popStack(),delete i.name),n&&(i.indent=JSON.stringify(n)),i.helpers=`helpers`,i.partials=`partials`,i.decorators=`container.decorators`,e?r.unshift(t):r.unshift(this.nameLookup(`partials`,t,`partial`)),this.options.compat&&(i.depths=`depths`),i=this.objectLiteral(i),r.push(i),this.push(this.source.functionCall(`container.invokePartial`,``,r))},assignToHash:function(e){var t=this.popStack(),n=void 0,r=void 0,i=void 0;this.trackIds&&(i=this.popStack()),this.stringParams&&(r=this.popStack(),n=this.popStack());var a=this.hash;n&&(a.contexts[e]=n),r&&(a.types[e]=r),i&&(a.ids[e]=i),a.values[e]=t},pushId:function(e,t,n){e===`BlockParam`?this.pushStackLiteral(`blockParams[`+t[0]+`].path[`+t[1]+`]`+(n?` + `+JSON.stringify(`.`+n):``)):e===`PathExpression`?this.pushString(t):e===`SubExpression`?this.pushStackLiteral(`true`):this.pushStackLiteral(`null`)},compiler:u,compileChildren:function(e,t){for(var n=e.children,r=void 0,i=void 0,a=0,o=n.length;a<o;a++){r=n[a],i=new this.compiler;var s=this.matchExistingProgram(r);if(s==null){var c=this.context.programs.push(``)-1;r.index=c,r.name=`program`+c,this.context.programs[c]=i.compile(r,t,this.context,!this.precompile),this.context.decorators[c]=i.decorators,this.context.environments[c]=r,this.useDepths=this.useDepths||i.useDepths,this.useBlockParams=this.useBlockParams||i.useBlockParams,r.useDepths=this.useDepths,r.useBlockParams=this.useBlockParams}else r.index=s.index,r.name=`program`+s.index,this.useDepths=this.useDepths||s.useDepths,this.useBlockParams=this.useBlockParams||s.useBlockParams}},matchExistingProgram:function(e){for(var t=0,n=this.context.environments.length;t<n;t++){var r=this.context.environments[t];if(r&&r.equals(e))return r}},programExpression:function(e){var t=this.environment.children[e],n=[t.index,`data`,t.blockParams];return(this.useBlockParams||this.useDepths)&&n.push(`blockParams`),this.useDepths&&n.push(`depths`),`container.program(`+n.join(`, `)+`)`},useRegister:function(e){this.registers[e]||(this.registers[e]=!0,this.registers.list.push(e))},push:function(e){return e instanceof l||(e=this.source.wrap(e)),this.inlineStack.push(e),e},pushStackLiteral:function(e){this.push(new l(e))},pushSource:function(e){this.pendingContent&&=(this.source.push(this.appendToBuffer(this.source.quotedString(this.pendingContent),this.pendingLocation)),void 0),e&&this.source.push(e)},replaceStack:function(e){var t=[`(`],n=void 0,r=void 0,i=void 0;if(!this.isInline())throw new o.default(`replaceStack on non-inline`);var a=this.popStack(!0);if(a instanceof l)n=[a.value],t=[`(`,n],i=!0;else{r=!0;var s=this.incrStack();t=[`((`,this.push(s),` = `,a,`)`],n=this.topStack()}var c=e.call(this,n);i||this.popStack(),r&&this.stackSlot--,this.push(t.concat(c,`)`))},incrStack:function(){return this.stackSlot++,this.stackSlot>this.stackVars.length&&this.stackVars.push(`stack`+this.stackSlot),this.topStackName()},topStackName:function(){return`stack`+this.stackSlot},flushInline:function(){var e=this.inlineStack;this.inlineStack=[];for(var t=0,n=e.length;t<n;t++){var r=e[t];if(r instanceof l)this.compileStack.push(r);else{var i=this.incrStack();this.pushSource([i,` = `,r,`;`]),this.compileStack.push(i)}}},isInline:function(){return this.inlineStack.length},popStack:function(e){var t=this.isInline(),n=(t?this.inlineStack:this.compileStack).pop();if(!e&&n instanceof l)return n.value;if(!t){if(!this.stackSlot)throw new o.default(`Invalid stack pop`);this.stackSlot--}return n},topStack:function(){var e=this.isInline()?this.inlineStack:this.compileStack,t=e[e.length-1];return t instanceof l?t.value:t},contextName:function(e){return this.useDepths&&e?`depths[`+e+`]`:`depth`+e},quotedString:function(e){return this.source.quotedString(e)},objectLiteral:function(e){return this.source.objectLiteral(e)},aliasable:function(e){var t=this.aliases[e];return t?(t.referenceCount++,t):(t=this.aliases[e]=this.source.wrap(e),t.aliasable=!0,t.referenceCount=1,t)},setupHelper:function(e,t,n){var r=[];return{params:r,paramsInit:this.setupHelperArgs(t,e,r,n),name:this.nameLookup(`helpers`,t,`helper`),callParams:[this.aliasable(this.contextName(0)+` != null ? `+this.contextName(0)+` : (container.nullContext || {})`)].concat(r)}},setupParams:function(e,t,n){var r={},i=[],a=[],o=[],s=!n,c=void 0;s&&(n=[]),r.name=this.quotedString(e),r.hash=this.popStack(),this.trackIds&&(r.hashIds=this.popStack()),this.stringParams&&(r.hashTypes=this.popStack(),r.hashContexts=this.popStack());var l=this.popStack(),u=this.popStack();(u||l)&&(r.fn=u||`container.noop`,r.inverse=l||`container.noop`);for(var d=t;d--;)c=this.popStack(),n[d]=c,this.trackIds&&(o[d]=this.popStack()),this.stringParams&&(a[d]=this.popStack(),i[d]=this.popStack());return s&&(r.args=this.source.generateArray(n)),this.trackIds&&(r.ids=this.source.generateArray(o)),this.stringParams&&(r.types=this.source.generateArray(a),r.contexts=this.source.generateArray(i)),this.options.data&&(r.data=`data`),this.useBlockParams&&(r.blockParams=`blockParams`),r},setupHelperArgs:function(e,t,n,r){var i=this.setupParams(e,t,n);return i.loc=JSON.stringify(this.source.currentLocation),i=this.objectLiteral(i),r?(this.useRegister(`options`),n.push(`options`),[`options=`,i]):n?(n.push(i),``):i}},(function(){for(var e=`break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield await null true false`.split(` `),t=u.RESERVED_WORDS={},n=0,r=e.length;n<r;n++)t[e[n]]=!0})(),u.isValidJavaScriptVariableName=function(e){return!u.RESERVED_WORDS[e]&&/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(e)};function d(e,t,n,r,i){var a=t.popStack(),o=n.length;e&&o--;for(var s=r;s<o;s++)a=t.nameLookup(a,n[s],i);return e?[t.aliasable(`container.strict`),`(`,a,`, `,t.quotedString(n[o]),`, `,JSON.stringify(t.source.currentLocation),` )`]:a}e.default=u,t.exports=e.default})),fe=t(((e,t)=>{e.__esModule=!0;function n(e){return e&&e.__esModule?e:{default:e}}var r=n(x()),i=n(S()),a=te(),o=ne(),s=n(de()),c=n(w()),l=n(b()),u=r.default.create;function d(){var e=u();return e.compile=function(t,n){return o.compile(t,n,e)},e.precompile=function(t,n){return o.precompile(t,n,e)},e.AST=i.default,e.Compiler=o.Compiler,e.JavaScriptCompiler=s.default,e.Parser=a.parser,e.parse=a.parse,e.parseWithoutProcessing=a.parseWithoutProcessing,e}var f=d();f.create=d,l.default(f),f.Visitor=c.default,f.default=f,e.default=f,t.exports=e.default})),A;function j(){return(j=e((()=>{A=`<div
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
`})))()}function pe(e){return String(e).trim().toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-+|-+$/g,``)}function me(e){e.registerHelper(`accordionGroupKey`,e=>{let t=e?pe(e):``;return t?N=t:(M+=1,N=`auto-${M}`),N}),e.registerHelper(`accordionItemId`,e=>`c-accordion-${N||`auto-${++M}`}__item-${e}`)}var M,N;function P(){return(P=e((()=>{M=0,N=null})))()}var F;function I(){return(I=e((()=>{F=`{{!--
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
`})))()}function he(e){e.registerHelper(`buttonIconSize`,e=>String(e??``).toLowerCase()===`s`?`16`:`20`)}function L(){return(L=e((()=>{})))()}var R;function z(){return(z=e((()=>{R=`{{!--
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
`})))()}var B;function V(){return(V=e((()=>{B=`{{!--
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
`})))()}var H;function U(){return(U=e((()=>{H=`{{!--
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
`})))()}var W;function G(){return(G=e((()=>{W=`{{!--
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
`})))()}var K;function q(){return(q=e((()=>{K=`{{!--
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
`})))()}var J;function Y(){return(Y=e((()=>{J=`/**
 * Components/Alert — three layouts (banner / toast / passive) on one
 * BEM block.
 *
 * Mirrors the canonical Web-ODS Shared Library \`Alerts and Notifications\`
 * canvas at \`537:28056\` — three sibling component sets (Banner
 * \`1284:11542\`, Toast \`1284:11906\`, Passive \`1284:12270\`) plus the
 * \`Alert — Overview\` documentation frame at \`1284:13821\`. The three
 * sibling sets are wired identically across \`Hierarchy × Tone ×
 * Breakpoint\` so they fold onto one \`.c-alert\` block with \`Layout\` as
 * the structural variant.
 *
 * Variant axes → BEM modifiers:
 *   layout       → .c-alert--banner | --toast | --passive
 *   hierarchy    → .c-alert--low    | --high
 *   tone         → .c-alert--info | --critical | --attention
 *                  | --success | --dark
 *   wholeClickable → .c-alert--whole-clickable (root flips <div> → <a>)
 *
 * Composition:
 *   - Status icon + dismiss × → both rendered via the {{> icon}}
 *     partial. Inline SVG is forbidden per src/components/icon/spec.md
 *     § "Composition rules for consumers".
 *   - CTA → composes the registered \`{{> button}}\` partial (Size=S,
 *     Style per hierarchy: low → primary, high → secondary). See
 *     \`storybook-core/src/components/button/spec.md\` for the
 *     canonical paint / padding / focus / state ladder. When
 *     \`ctaHref\` is set, the same paint surfaces as
 *     \`<a class="btn btn--<style> btn--s">\` so navigation targets
 *     reuse the Button styles without forcing the \`<button>\`
 *     element. No \`.c-alert__cta\` selector lives in this file —
 *     every CTA paint comes from
 *     \`storybook-core/src/components/button/button.scss\`.
 *
 * All inline-axis sizing uses logical properties so the component
 * flips cleanly under \`dir="rtl"\`.
 *
 * Tokens consumed are listed in \`./spec.md\` § "Tokens consumed".
 */

@use '../../tokens/breakpoints/breakpoints' as bp;

.c-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  inline-size: 100%;
  box-sizing: border-box;
  padding-block: var(--space-3);
  padding-inline: var(--space-5);
  border-radius: var(--border-radius-card);
  font-family: var(--font-family-primary);
  text-decoration: none;
  flex-wrap: wrap;
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
}

.c-alert__description {
  margin: 0;
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  font-weight: var(--font-weight-regular);
}

// -- CTA — composes \`{{> button}}\` partial. Every CTA paint /
// padding / radius / focus / state token comes from
// \`storybook-core/.../button/button.scss\` (Size=S; Style per hierarchy:
// low → primary, high → secondary, resolved by the \`alertCtaStyle\`
// Handlebars helper). When \`ctaHref\` is set the template applies the
// canonical Button classes directly to an \`<a class="btn btn--<style>
// btn--s">\` element since the Button partial only emits
// \`<button>\`. The flex-child slot the CTA sits in inherits its
// \`flex: 0 0 auto\` from \`.btn\`'s \`display: inline-flex\` +
// \`width: fit-content\` defaults.
// The only Alert-side rule on the CTA is its **vertical alignment**
// in the flex row — the CTA always centers on the cross axis
// regardless of how many lines the description wraps to. This
// mirrors the Figma source's \`items-center\` on the outer Alert
// wrapper (verified live on Banner Low/Info \`1284:11552\` and Toast
// Low/Info \`1284:11916\`). The icon + content sit at the top of the
// row via this file's \`align-items: flex-start\` default, so the
// CTA's centering is a per-child opt-in via \`align-self: center\`
// rather than flipping the parent's alignment (which would also
// re-position the icon and dismiss).
.c-alert > .btn {
  align-self: center;
}

// -- Dismiss button

.c-alert__dismiss {
  // Vertically center the dismiss button on the cross axis of the
  // Alert's flex row regardless of how many lines the description
  // wraps to — mirrors the Figma source's \`items-center\` on the
  // outer Alert wrapper (same per-child opt-in pattern as the CTA
  // above). The parent stays \`align-items: flex-start\` so the
  // icon + content column anchor to the top of the row; the
  // dismiss opts into centering individually rather than flipping
  // the parent's alignment. Replaces the previous
  // \`margin-block-start: -6px\` hack that nudged the 32×32 hit
  // target up against the parent's \`flex-start\` default.
  align-self: center;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 32px;
  block-size: 32px;
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
.c-alert[data-state="hover"] .c-alert__dismiss {
  background-color: rgb(0 0 0 / 8%);
}

.c-alert__dismiss:focus-visible,
.c-alert[data-state="focus"] .c-alert__dismiss {
  outline: var(--border-width-default) solid var(--color-border-focus);
  outline-offset: 2px;
}

// -- Tone × Hierarchy paint matrix
// Low (subtle tint surface, primary content) ---------------------------------

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

// High (strong fill surface, inverse content) --------------------------------

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

// Attention High keeps primary text — the yellow / orange surface
// fails contrast with inverse white text. Mirrors the Spec Frame's
// \`Content fill\` row.
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

// -- Layouts -----------------------------------------------------------------

.c-alert--banner {
  inline-size: 100%;
}

.c-alert--toast {
  inline-size: 100%;
  max-inline-size: 343px;
  box-shadow: var(--shadow-default);
}

@include bp.lg {
  .c-alert--toast {
    max-inline-size: 400px;
  }
}

@include bp.xl {
  .c-alert--toast {
    max-inline-size: 400px;
  }
}

.c-alert--passive {
  inline-size: 100%;
}

// -- Whole-clickable hover affordance ----------------------------------------

.c-alert--whole-clickable {
  cursor: pointer;
  transition: box-shadow 150ms ease;
}

.c-alert--whole-clickable:hover {
  box-shadow: var(--shadow-default);
}

.c-alert--whole-clickable:focus-visible {
  outline: var(--border-width-default) solid var(--color-border-focus);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .c-alert,
  .c-alert__dismiss,
  .c-alert--whole-clickable {
    transition: none;
  }
}
`})))()}var X;function Z(){return(Z=e((()=>{X=`/**
 * Patterns/Breadcrumb — single BEM root (.c-breadcrumb) covering the
 * Figma master variant set on Web-ODS Shared Library \`1260:8373\`
 * (LifeLock theme mode).
 *
 * Variant axes → BEM modifiers:
 *   firstAsIcon → .c-breadcrumb--first-as-icon-{no|yes}
 *   collapsed   → .c-breadcrumb--collapsed-{no|yes}
 *   truncation  → .c-breadcrumb--truncation-{no|yes}
 *
 * Interaction state mechanics: every intermediate link inherits its
 * own :hover / :focus-visible / :active / :visited paint from the
 * composed \`text-link\` partial. Breadcrumb adds no per-link
 * overrides — only the home-icon anchor paints its own focus ring
 * (because it is not a composed text-link). The static ellipsis
 * placeholder receives a subtle hover cue (tooltip surfaces via
 * native \`title\`) but never accepts pointer or keyboard focus.
 *
 * Per \`spec-driven-sync.mdc\`, every paint resolves to a \`var(--…)\`
 * token declared in \`tokens/colors\`, \`tokens/typography\`,
 * \`tokens/spacing\`, or \`tokens/borders\`. No hardcoded design values.
 *
 * Logical properties (\`padding-inline\`, \`padding-block\`,
 * \`margin-inline-*\`, \`max-inline-size\`) keep the unit RTL-safe out
 * of the box.
 */

// ============================================================================
// BLOCK — .c-breadcrumb
// ============================================================================

.c-breadcrumb {
  // Wayfinding lives inside body content — sit inline-flex so the
  // nav hugs its content and doesn't stretch to its container's
  // inline-size. Wrap on narrow viewports rather than overflow.
  display: inline-flex;
  // Mirrors the Figma master's root box: 2px block / 4px inline.
  padding-block: var(--space-1);
  padding-inline: var(--space-2);

  // Color inheritance — separators sit at low contrast; the
  // composed text-link / current-page paints override locally.
  color: var(--color-disabled-text);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  // Inherits into every composed text-link label and the current
  // crumb — matches the master's +0.28px (2%) tracking on body-sm.
  letter-spacing: var(--letterspacing-body-sm);
}

// ============================================================================
// ELEMENT — .c-breadcrumb__list
// ============================================================================

.c-breadcrumb__list {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

// ============================================================================
// ELEMENT — .c-breadcrumb__item
// ============================================================================

.c-breadcrumb__item {
  display: inline-flex;
  align-items: center;
  min-block-size: 24px;
}

.c-breadcrumb__item--separator {
  color: var(--color-disabled-text);
}

// ============================================================================
// ELEMENT — .c-breadcrumb__current (the leaf node — never a link)
// ============================================================================

.c-breadcrumb__current {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
}

// ============================================================================
// ELEMENT — .c-breadcrumb__home (icon-only anchor for firstAsIcon=true)
// ============================================================================

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

  // Focus ring mirrors the text-link's outline / outline-offset so
  // the keyboard cue stays consistent across the trail.
  &:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: var(--space-1);
  }
}

// ============================================================================
// ELEMENT — .c-breadcrumb__ellipsis (static collapsed-state placeholder)
// ============================================================================
// Mirrors the Figma \`PaginationControls / Style=Square\` instance at
// 20×20 with padding \`space-1\` and \`border-radius-s\`. The placeholder
// is presentation-only: it surfaces the hidden labels via the native
// \`title\` tooltip on hover and the same labels via \`aria-label\` for
// screen readers. There is no click, no keyboard activation, and no
// JS layer — every collapsed-state trail keeps the last visible
// intermediate link reachable as the user's recovery path.

.c-breadcrumb__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 20px;
  block-size: 20px;
  padding: var(--space-1);
  color: var(--color-text-primary);
  border-radius: var(--border-radius-control);
  cursor: help;
}

// ============================================================================
// MODIFIER — .c-breadcrumb--truncation-yes
// ============================================================================

// Truncation is purely visual — the full label stays in the DOM via
// the underlying text-link's \`<span class="c-text-link__label">\` and
// the current-page \`<span class="c-breadcrumb__current">\`. The cap
// is expressed in \`ch\` units so it tracks the user's preferred font
// size; readability stays consistent across zoom levels.
.c-breadcrumb--truncation-yes .c-breadcrumb__item--link .c-text-link__label,
.c-breadcrumb--truncation-yes .c-breadcrumb__current {
  display: inline-block;
  max-inline-size: 12ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}
`})))()}var Q;function ge(){return(ge=e((()=>{Q=`// Patterns/Inputs/Code entry
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
`})))()}var _e;function ve(){return(ve=e((()=>{_e=`/**
 * Components/Divider — single BEM root (.c-divider) covering the
 * three Figma sibling variant sets on Web-ODS-Shared-Library —
 * \`Divider / Horizontal\` (1344:2031), \`Divider / Vertical\`
 * (1344:2052), and \`Divider / Label\` (1344:2073) — folded onto one
 * orthogonal four-axis collapse per spec.md § "Variant axes".
 *
 * Variant axes → BEM modifiers:
 *   layout     → .c-divider--horizontal | --vertical | --label
 *   size       → .c-divider--xs | --s | --m | --l
 *   inverse    → .c-divider--inverse  (boolean — no value suffix)
 *   typography → .c-divider--body-sm-regular |
 *                --body-sm-semibold |
 *                --body-base-regular |
 *                --body-base-semibold |
 *                --body-lg-regular |
 *                --body-lg-bold |
 *                --h6-medium |
 *                --h5-bold
 *
 * Divider is stateless — no \`:hover\` / \`:focus-visible\` / \`:active\`
 * paints, no \`is-*\` runtime classes, no JavaScript. It is a
 * presentation-only molecule that separates surrounding content.
 *
 * Layout paint mechanics:
 *   - horizontal → block-level root, paints \`border-block-start\`
 *     spanning the full inline size of its container.
 *   - vertical   → inline-block root, paints \`border-inline-start\`,
 *     sizes \`block-size: 100%\` to its parent's cross axis.
 *   - label      → block-level root, paints inline-flex row of
 *     \`__rule--start\` + \`__label\` + \`__rule--end\`; the two
 *     \`__rule\` spans paint \`border-block-start\` and \`flex: 1 1 0\`
 *     so they share remaining inline space symmetrically.
 *
 * The \`size\` axis selects rule weight via
 * \`--border-width-{hairline,default,emphasis}\` for xs / s / l.
 * \`m\` (3 px) ships a literal pixel value — LifeLock's
 * \`--border-width-*\` ladder skips 3 px (see spec.md
 * § "Notes & open questions" for the gap discussion).
 *
 * The \`inverse\` axis flips the rule paint from
 * \`--color-border-strong\` to \`--color-border-inverse\`.
 *
 * The \`typography\` axis paints \`.c-divider__label\` typography on
 * \`layout = label\` only; the modifier renders on every variant for
 * shape consistency but is inert when no \`.c-divider__label\`
 * element exists.
 *
 * Logical properties (\`border-block-start\` / \`border-inline-start\`
 * / \`padding-inline\`) keep every layout RTL-safe; the inline-flex
 * centring on \`label\` survives direction flips with no overrides.
 *
 * Tokens consumed are documented in \`./spec.md\` § "Tokens consumed".
 */

// ============================================================================
// BLOCK — .c-divider
// ============================================================================

.c-divider {
  // Default paint — overridden per layout below. Kept here so a bare
  // \`.c-divider\` element still renders a visible rule during dev /
  // authoring even when modifiers are missing.
  --c-divider-rule-color: var(--color-border-strong);
  --c-divider-rule-width: var(--border-width-default);

  box-sizing: border-box;
  border: 0 solid var(--c-divider-rule-color);
}

// ============================================================================
// INVERSE — applies across all three layouts
// ============================================================================

.c-divider--inverse {
  --c-divider-rule-color: var(--color-border-inverse);
}

// ============================================================================
// SIZE — rule weight ladder
// ============================================================================

.c-divider--xs {
  --c-divider-rule-width: var(--border-width-hairline);
}

.c-divider--s {
  --c-divider-rule-width: var(--border-width-default);
}

// 3 px rule weight is a token gap — LifeLock's \`--border-width-*\` ladder
// skips 3 px (declared values: hairline = 1, default = 2,
// emphasis = 4). Ships a literal pixel value here rather than
// triggering the formal token-gap AskQuestion round because spec.md
// never references an undeclared custom property. See
// \`./spec.md\` § "Notes & open questions" for the designer follow-up.
.c-divider--m {
  --c-divider-rule-width: 3px;
}

.c-divider--l {
  --c-divider-rule-width: var(--border-width-emphasis);
}

// ============================================================================
// LAYOUT — horizontal (block-level, full-width horizontal rule)
// ============================================================================

.c-divider--horizontal {
  display: block;
  inline-size: 100%;
  block-size: var(--c-divider-rule-width);
  border-block-start: var(--c-divider-rule-width) solid var(--c-divider-rule-color);
}

// ============================================================================
// LAYOUT — vertical (inline-block, parent-cross-axis vertical rule)
// ============================================================================

.c-divider--vertical {
  display: inline-block;
  inline-size: var(--c-divider-rule-width);
  block-size: 100%;
  border-inline-start: var(--c-divider-rule-width) solid var(--c-divider-rule-color);
}

// ============================================================================
// LAYOUT — label (inline-flex row, rule + centred label + rule)
// ============================================================================

.c-divider--label {
  display: flex;
  align-items: center;
  inline-size: 100%;
  gap: var(--space-3);

  // The label paint inherits its surrounding content paint by default
  // (\`currentColor\`). Consumers wanting a custom label color set a
  // \`color\` on the parent context rather than the divider itself.
  color: inherit;

  // The label kicker font-family is always Inter Tight — only size /
  // line-height / letter-spacing / weight vary per the \`typography\`
  // axis below.
  font-family: var(--font-family-primary);
}

// ============================================================================
// ELEMENTS — rule (label variant) + label (label variant)
// ============================================================================

.c-divider__rule {
  // Flex children share remaining inline space symmetrically so the
  // centred label is always optically centred regardless of the
  // label's intrinsic text width.
  flex: 1 1 0;

  // The rule paint sits on \`border-block-start\` so the span carries
  // no visible block-size of its own — the rule paints as a 1-pixel-
  // tall line at the block-start edge of the span and the surrounding
  // flex centring aligns it vertically with the label's optical
  // centre line.
  block-size: var(--c-divider-rule-width);
  border-block-start: var(--c-divider-rule-width) solid var(--c-divider-rule-color);
}

.c-divider__label {
  flex: 0 0 auto;

  // Label paint inherits all four typography properties from the
  // \`.c-divider--*\` modifier on the root.
  font-family: var(--font-family-primary);

  // Padding-inline matches the \`gap\` declared on the flex parent —
  // when a future use case needs a closer label-rule spacing,
  // override the \`gap\` rather than the padding here.
  padding-inline: 0;

  // Center text horizontally — defensive in case a parent context
  // sets \`text-align: start\` on inline children.
  text-align: center;
  white-space: nowrap;
}

// ============================================================================
// TYPOGRAPHY — label variant only (modifier is inert on other layouts)
// ============================================================================

// body/sm — 14 px in both bands
.c-divider--body-sm-regular .c-divider__label {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
  font-weight: var(--font-weight-regular);
}

.c-divider--body-sm-semibold .c-divider__label {
  font-size: var(--font-size-body-sm);
  line-height: var(--lineheight-body-sm);
  letter-spacing: var(--letterspacing-body-sm);
  font-weight: var(--font-weight-semibold);
}

// body/base — 14 px (SM band) / 16 px (LG band)
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

// body/lg — 16 px (SM band) / 18 px (LG band)
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

// h6 — 24 / 24 px (SM-collision; identical in both bands)
.c-divider--h6-medium .c-divider__label {
  font-size: var(--font-size-h6);
  line-height: var(--lineheight-h6);
  letter-spacing: var(--letterspacing-h6);
  font-weight: var(--font-weight-medium);
}

// h5 — 24 px (SM band) / 28 px (LG band)
.c-divider--h5-bold .c-divider__label {
  font-size: var(--font-size-h5);
  line-height: var(--lineheight-h5);
  letter-spacing: var(--letterspacing-h5);
  font-weight: var(--font-weight-bold);
}
`})))()}var ye;function be(){return(be=e((()=>{ye=`/**
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
`})))()}var xe;function Se(){return(Se=e((()=>{xe=`/**
 * Components/Label — single BEM root (.c-label) covering the Figma
 * master variant set on Web-ODS Shared Library \`1408:443\` (LifeLock
 * theme mode).
 *
 * Variant axes → BEM modifiers:
 *   background → .c-label--{primary | secondary | brand |
 *                brand-soft | accent | alpha | beta | gamma | delta |
 *                inverse-primary | inverse-secondary}
 *   variant    → .c-label--{solid | transparent-30 |
 *                transparent-50 | transparent-80}
 *
 * Label is stateless — no \`:hover\` / \`:focus-visible\` / \`:active\`
 * paints, no \`is-*\` runtime classes, no JavaScript. It is a
 * presentation-only molecule that decorates surrounding content
 * (cards, list rows, metadata strips).
 *
 * The paint matrix collapses the 11 × 4 Figma variant set onto two
 * orthogonal per-instance custom properties:
 *   --c-label-bg          surface base colour (picked per \`background\`)
 *   --c-label-bg-opacity  surface opacity 100 / 30 / 50 / 80%
 *                         (picked per \`variant\`)
 *   --c-label-content     content paint colour (picked per \`background\`)
 *
 * The block-level rule composes the surface as
 * \`color-mix(in srgb, var(--c-label-bg) var(--c-label-bg-opacity), transparent)\`
 * so dimming the surface to a transparency stop never affects the
 * content paint — text + icon stay fully opaque at every stop, which
 * is what the Figma master ships.
 *
 * Logical properties (\`padding-block\` / \`padding-inline\`) keep the
 * pill geometry RTL-safe; the inline-flex centring + DOM-ordered
 * icon-before-text slot survive direction flips with no extra rules.
 *
 * Tokens consumed are documented in \`./spec.md\` § "Tokens consumed".
 */

// ============================================================================
// BLOCK — .c-label
// ============================================================================

.c-label {
  // Per-instance knobs the modifier rules below set. Defaults paint a
  // "primary background, solid variant" bare \`.c-label\` so authoring
  // without modifiers still renders a sensible white-pill default.
  --c-label-bg: var(--color-bg-default);
  --c-label-bg-opacity: 100%;
  --c-label-content: var(--color-text-primary);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  inline-size: fit-content;
  box-sizing: border-box;
  padding-block: var(--space-1);
  padding-inline: var(--space-3);
  border-radius: var(--border-radius-pill);
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-body-xs);
  line-height: var(--lineheight-body-xs);
  letter-spacing: var(--letterspacing-body-xs);

  // color-mix dims the surface to the per-variant opacity stop while
  // leaving the content paint at full opacity — text + icon stay
  // readable across solid / transparent-30 / transparent-50 / -80.
  background-color: color-mix(
    in srgb,
    var(--c-label-bg) var(--c-label-bg-opacity),
    transparent
  );
  color: var(--c-label-content);
}

// ============================================================================
// ELEMENT — text
// ============================================================================

.c-label__text {
  display: inline-block;
}

// ============================================================================
// VARIANT — surface opacity stops
// ============================================================================

.c-label--solid {
  --c-label-bg-opacity: 100%;
}

.c-label--transparent-30 {
  --c-label-bg-opacity: 30%;
}

.c-label--transparent-50 {
  --c-label-bg-opacity: 50%;
}

.c-label--transparent-80 {
  --c-label-bg-opacity: 80%;
}

// ============================================================================
// BACKGROUND — per-Background paint pairs
// Each background sets BOTH the surface base colour (--c-label-bg)
// and the content paint (--c-label-content). The variant modifiers
// above only flip the opacity of the surface composite — never the
// content paint.
// ============================================================================

// --- primary (white) --------------------------------------------------------
.c-label--primary {
  --c-label-bg: var(--color-bg-default);
  --c-label-content: var(--color-text-primary);
}

// --- secondary (near-white subtle) ------------------------------------------
.c-label--secondary {
  --c-label-bg: var(--color-bg-subtle);
  --c-label-content: var(--color-text-primary);
}

// --- brand (LifeLock dark green) --------------------------------------------
.c-label--brand {
  --c-label-bg: var(--color-bg-brand);
  --c-label-content: var(--color-text-inverse);
}

// --- brand-soft (sand) ------------------------------------------------------
.c-label--brand-soft {
  --c-label-bg: var(--color-bg-brand-soft);
  --c-label-content: var(--color-text-primary);
}

// --- accent (ivory) ---------------------------------------------------------
.c-label--accent {
  --c-label-bg: var(--color-bg-accent);
  --c-label-content: var(--color-text-primary);
}

// --- alpha (warm stone) -----------------------------------------------------
.c-label--alpha {
  --c-label-bg: var(--color-bg-alpha);
  --c-label-content: var(--color-text-primary);
}

// --- beta (cool gray) -------------------------------------------------------
.c-label--beta {
  --c-label-bg: var(--color-bg-beta);
  --c-label-content: var(--color-text-primary);
}

// --- gamma (soft gray) ------------------------------------------------------
.c-label--gamma {
  --c-label-bg: var(--color-bg-gamma);
  --c-label-content: var(--color-text-primary);
}

// --- delta (neutral-20) -----------------------------------------------------
.c-label--delta {
  --c-label-bg: var(--color-bg-delta);
  --c-label-content: var(--color-text-primary);
}

// --- inverse-primary (off-black) --------------------------------------------
.c-label--inverse-primary {
  --c-label-bg: var(--color-bg-inverse-strong);
  --c-label-content: var(--color-text-inverse);
}

// --- inverse-secondary (ocean teal) -----------------------------------------
.c-label--inverse-secondary {
  --c-label-bg: var(--color-bg-inverse);
  --c-label-content: var(--color-text-inverse);
}
`})))()}var Ce;function we(){return(we=e((()=>{Ce=`/**
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
`})))()}var Te;function Ee(){return(Ee=e((()=>{Te=`// Patterns/Inputs/Search box
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
  padding: var(--space-1);
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
`})))()}var De;function Oe(){return(Oe=e((()=>{De=`/**
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

  --c-slider-track-color:  var(--color-border-tertiary);
  --c-slider-fill-color:   var(--color-signal-info);
  --c-slider-thumb-color:  var(--button-primary-bg-default);
  --c-slider-focus-color:  var(--color-border-focus);
  --c-slider-text-color:   var(--color-text-primary, #161616);

  display: flex;
  flex-direction: column;
  inline-size: 100%;
  box-sizing: border-box;
  padding: var(--c-slider-pad-block) var(--c-slider-pad-inline);
  background-color: var(--color-background-primary);
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
    var(--border-width-default) solid var(--c-slider-focus-color);
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
    var(--border-width-default) solid var(--c-slider-focus-color);
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
    var(--border-width-default) solid var(--c-slider-focus-color);
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
`})))()}var ke;function Ae(){return(Ae=e((()=>{ke=`/**
 * Components/Stepper — single BEM root (.c-stepper) covering the Figma
 * master variant set on Web-ODS Shared Library \`1386:867\` (LifeLock theme
 * mode) and the Step sub-component set \`1386:803\`.
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
 * Stepper is stateless — no JavaScript. Progress is expressed by which
 * step carries \`state=active\` or \`state=complete\` in the markup the
 * consumer (or Storybook args) supplies.
 *
 * Per \`spec-driven-sync.mdc\`, every paint resolves to a \`var(--…)\` token
 * declared in the LifeLock token partials. No hardcoded design values.
 */

// ============================================================================
// BLOCK — .c-stepper
// ============================================================================

.c-stepper {
  // Component knobs — block-scoped local custom properties (not design
  // tokens; consumers never override these directly).
  --c-stepper-indicator-size:    50px;
  --c-stepper-connector-offset:  24px;

  box-sizing: border-box;
  list-style: none;
  margin: 0;
  padding: 0;
}

// ============================================================================
// ELEMENT — shared step anatomy
// ============================================================================

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
  background-color: var(--c-stepper-connector-color, var(--color-border-tertiary));
  block-size: var(--border-width-default);
  display: block;
}

// ============================================================================
// MODIFIERS — step state paints
// ============================================================================

.c-stepper__step--state-default {
  --c-stepper-connector-color: var(--color-border-tertiary);

  .c-stepper__indicator {
    background-color: var(--color-bg-subtle);
  }
}

.c-stepper__step--state-active {
  --c-stepper-connector-color: color-mix(
    in srgb,
    var(--color-border-secondary) 30%,
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
    var(--color-border-secondary) 30%,
    transparent
  );

  .c-stepper__indicator {
    background-color: var(--color-bg-inverse-strong);
  }

  .c-icon {
    color: var(--color-text-inverse);
  }
}

// ============================================================================
// MODIFIERS — Direction = Horizontal
// ============================================================================

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

    // Every step except the last owns a trailing connector, so it must be
    // able to grow for that connector to fill the gap to the next step.
    // Only the final step (no connector) hugs its content.
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
    block-size: var(--border-width-default);
    inline-size: 100%;
  }
}

// ============================================================================
// MODIFIERS — Direction = Vertical
// ============================================================================

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
    inline-size: var(--border-width-default);
  }
}
`})))()}var je;function Me(){return(Me=e((()=>{je=`// Patterns/Inputs/Text field
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
  padding: var(--space-1);
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
`})))()}var Ne;function Pe(){return(Pe=e((()=>{Ne=`/**
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
`})))()}var Fe;function Ie(){return(Ie=e((()=>{Fe=`/**
 * Build the enriched \`items\` array the breadcrumb Handlebars template
 * iterates (\`{{#each items}}\`) from the consumer trail + flat Storybook
 * args that mirror the Figma component property names (\`firstAsIcon\`,
 * \`collapsed\`, \`truncation\`).
 *
 * Each output entry is one of:
 *   { kind: 'link',      label, href, homeIconOnly?, leadingHomeIcon?, ariaLabel? }
 *   { kind: 'current',   label }
 *   { kind: 'separator' }
 *   { kind: 'ellipsis',  hiddenLabels, hiddenPagesLabel? }
 *
 * First-crumb rendering rules (verified against the eight Figma master
 * variants on \`1260:8373\`):
 *
 *   firstAsIcon=false, collapsed=false → plain text-link  (no icon)
 *   firstAsIcon=false, collapsed=true  → text-link with LEADING home icon
 *   firstAsIcon=true,  collapsed=*     → icon-only home anchor
 *
 * Collapsed=true rule: the last item is always the current page; the
 * second-to-last is the only visible intermediate link. Every other
 * middle item folds into ONE static \`<span class="c-breadcrumb__ellipsis">\`
 * placeholder whose tooltip (\`title\`) + accessible name (\`aria-label\`)
 * enumerate the hidden labels. The placeholder is NOT clickable — there
 * is no JS layer; consumers needing on-demand expansion should drop
 * \`collapsed=false\` and rely on the host page's overflow handling.
 */

const DEFAULT_HIDDEN_PAGES_LABEL = 'Hidden pages';

export function buildCrumbsFromItems(items, opts = {}) {
  const built = [];
  if (!Array.isArray(items) || items.length === 0) return built;

  const firstAsIcon = opts.firstAsIcon === true;
  const collapsed = opts.collapsed === true;
  const hiddenPagesLabel = opts.hiddenPagesLabel || DEFAULT_HIDDEN_PAGES_LABEL;
  const last = items.length - 1;
  // Only collapse when there is at least one middle item to hide BETWEEN
  // the first crumb and the second-to-last crumb (i.e. >= 4 items total).
  const collapsable = collapsed && items.length >= 4;

  // The "hidden range" when collapsed: indices [1 .. last - 2] inclusive.
  // Items at index 0 (first), \`last - 1\` (parent of current), and \`last\`
  // (current) stay visible.
  const firstHidden = collapsable ? 1 : -1;
  const lastHidden = collapsable ? last - 2 : -1;

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

    // Skip every middle item that got folded into the ellipsis — they
    // are NOT rendered in the DOM (Figma master shows a single ⋯
    // placeholder, not a hidden-but-present list).
    if (isHiddenByCollapse) continue;

    // Separator precedes every non-first item.
    if (!isFirst) {
      built.push({ kind: 'separator' });
    }

    // Insert the ellipsis placeholder directly BEFORE the parent-of-current
    // crumb (which renders at index \`last - 1\` after the collapse skip).
    if (collapsable && i === last - 1) {
      built.push({
        kind: 'ellipsis',
        hiddenLabels,
        hiddenPagesLabel,
      });
      built.push({ kind: 'separator' });
    }

    if (isLast) {
      built.push({ kind: 'current', label: item.label ?? 'Current page' });
    } else if (isFirst) {
      // First-crumb shape per the matrix above.
      if (firstAsIcon) {
        built.push({
          kind: 'link',
          label: item.label ?? '',
          href: item.href ?? '#',
          homeIconOnly: true,
          ariaLabel: item.ariaLabel || item.label || 'Home',
        });
      } else if (collapsable) {
        built.push({
          kind: 'link',
          label: item.label ?? '',
          href: item.href ?? '#',
          leadingHomeIcon: true,
        });
      } else {
        built.push({
          kind: 'link',
          label: item.label ?? '',
          href: item.href ?? '#',
        });
      }
    } else {
      built.push({
        kind: 'link',
        label: item.label ?? '',
        href: item.href ?? '#',
      });
    }
  }

  return built;
}

// Mirrors the trail authored on the Figma master variants (1260:8373):
// Home › Products › Software › Antivirus.
export const defaultBreadcrumbItems = [
  { label: 'Home', href: '/', ariaLabel: 'Home' },
  { label: 'Products', href: '/products' },
  { label: 'Software', href: '/products/software' },
  { label: 'Antivirus' },
];

export const defaultBreadcrumbArgs = {
  items: defaultBreadcrumbItems,
  firstAsIcon: false,
  collapsed: false,
  truncation: false,
  ariaLabel: 'Breadcrumb',
  hiddenPagesLabel: DEFAULT_HIDDEN_PAGES_LABEL,
  iconType: 'objects/simple-home',
};

export function compileBreadcrumbArgs(args, compiled, items) {
  const merged = { ...defaultBreadcrumbArgs, ...args };
  // Precedence: an explicit \`items\` arg (AllStyles cells pass a fixed
  // trail) wins; otherwise the consumer-set \`items\` arg from the
  // controls panel; otherwise the canonical default trail.
  const trail = items ?? merged.items ?? defaultBreadcrumbItems;
  return compiled({
    firstAsIcon: merged.firstAsIcon,
    collapsed: merged.collapsed,
    truncation: merged.truncation,
    ariaLabel: merged.ariaLabel,
    hiddenPagesLabel: merged.hiddenPagesLabel,
    iconType: merged.iconType,
    items: buildCrumbsFromItems(trail, {
      firstAsIcon: merged.firstAsIcon,
      collapsed: merged.collapsed,
      hiddenPagesLabel: merged.hiddenPagesLabel,
    }),
  });
}
`})))()}var Le;function Re(){return(Re=e((()=>{Le=`/**
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
`})))()}var ze;function Be(){return(Be=e((()=>{ze=`/**
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
`})))()}var Ve;function $(){return($=e((()=>{Ve=`/**
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
`})))()}var He;function Ue(){return(Ue=e((()=>{He=`/**
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
`})))()}var We;function Ge(){return(Ge=e((()=>{We=`/**
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
`})))()}function Ke(e){if(!e)return{scss:null,js:null};let t=(t,n)=>[`/src/components/${e}/${e}.${n}`,`/src/layouts/${e}/${e}.${n}`,`/src/pages/${e}/${e}.${n}`].reduce((e,n)=>e??t[n]??null,null);return{scss:t(Xe,`scss`)??t(Qe,`scss`)??t(et,`scss`),js:t(Ze,`js`)??t($e,`js`)??t(tt,`js`)}}function qe(e,t={}){let{unit:n,scss:r,js:i,extra:a={}}=t,o=Ke(n),s=r??o.scss,c=i??o.js,l=s&&String(s).trim()||c&&String(c).trim()?Ye(e,{js:c,scss:s}):String(e).trim(),{docs:u,...d}=a;return{...d,docs:{...u&&typeof u==`object`?u:{},source:{code:l,language:`html`,type:`code`}}}}function Je(e,t){let n=RegExp(`</${t}`,`gi`);return String(e).replace(n,`<\\/${t}`)}function Ye(e,{js:t,scss:n}={}){let r=[String(e).trim()];if(t&&String(t).trim()){let e=Je(String(t).trim(),`script`);r.push(``,`<!-- ── JavaScript ── -->`,`<script>`,e,`<\/script>`)}if(n&&String(n).trim()){let e=Je(String(n).trim(),`style`);r.push(``,`<!-- ── SCSS ── -->`,`<style>`,e,`</style>`)}return r.join(`
`)}var Xe,Ze,Qe,$e,et,tt;function nt(){return(nt=e((()=>{Y(),Z(),ge(),ve(),be(),Se(),we(),Ee(),Oe(),Ae(),Me(),Pe(),Ie(),Re(),Be(),$(),Ue(),Ge(),Xe=Object.assign({"/src/components/alert/alert.scss":J,"/src/components/breadcrumb/breadcrumb.scss":X,"/src/components/code-entry/code-entry.scss":Q,"/src/components/divider/divider.scss":_e,"/src/components/icon/icon.scss":ye,"/src/components/label/label.scss":xe,"/src/components/progress-indicator/progress-indicator.scss":Ce,"/src/components/search-box/search-box.scss":Te,"/src/components/slider/slider.scss":De,"/src/components/stepper/stepper.scss":ke,"/src/components/text-field/text-field.scss":je,"/src/components/text-link/text-link.scss":Ne}),Ze=Object.assign({"/src/components/breadcrumb/breadcrumb-story-helpers.js":Fe,"/src/components/code-entry/code-entry.js":Le,"/src/components/search-box/search-box.js":ze,"/src/components/slider/slider.js":Ve,"/src/components/stepper/stepper-story-helpers.js":He,"/src/components/text-field/text-field.js":We}),Qe=Object.assign({}),$e=Object.assign({}),et=Object.assign({}),tt=Object.assign({})})))()}export{P as _,G as a,j as b,H as c,R as d,z as f,I as g,F as h,K as i,B as l,he as m,nt as n,W as o,L as p,q as r,U as s,qe as t,V as u,me as v,fe as x,A as y};