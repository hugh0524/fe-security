/**
 * Created by hugh on 2019/10/9.
 */

(function moduleDefinition(root, factory) {
    if(typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if(typeof define === 'function' && define.amd)
        define([], factory);
    else if(typeof exports === 'object')
        exports["xss_encode"] = factory();
    else
        root["xss_encode"] = factory();
})(this, function() {
        if(!String.prototype.codePointAt) {
            (function() {
                'use strict'; // 严格模式，needed to support `apply`/`call` with `undefined`/`null`
                var codePointAt = function(position) {
                    if(this == null) {
                        throw TypeError();
                    }
                    var string = String(this);
                    var size = string.length;
                    // 变成整数
                    var index = position ? Number(position) : 0;
                    if(index != index) { // better `isNaN`
                        index = 0;
                    }
                    // 边界
                    if(index < 0 || index >= size) {
                        return undefined;
                    }
                    // 第一个编码单元
                    var first = string.charCodeAt(index);
                    var second;
                    if( // 检查是否开始 surrogate pair
                    first >= 0xD800 && first <= 0xDBFF && // high surrogate
                    size > index + 1 // 下一个编码单元
                    ) {
                        second = string.charCodeAt(index + 1);
                        if(second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
                            // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                            return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
                        }
                    }
                    return first;
                };
                if(Object.defineProperty) {
                    Object.defineProperty(String.prototype, 'codePointAt', {
                        'value': codePointAt,
                        'configurable': true,
                        'writable': true
                    });
                } else {
                    String.prototype.codePointAt = codePointAt;
                }
            }());
        }

        const characterToEntityMap = {
            34: "quot", /* quotation mark */
            38: "amp", /* ampersand */
            60: "lt", /* less-than sign */
            62: "gt", /* greater-than sign */
            160: "nbsp", /* no-break space */
            161: "iexcl", /* inverted exclamation mark */
            162: "cent", /* cent sign */
            163: "pound", /* pound sign */
            164: "curren", /* currency sign */
            165: "yen", /* yen sign */
            166: "brvbar", /* broken bar */
            167: "sect", /* section sign */
            168: "uml", /* diaeresis */
            169: "copy", /* copyright sign */
            170: "ordf", /* feminine ordinal indicator */
            171: "laquo", /* left-pointing double angle quotation mark */
            172: "not", /* not sign */
            173: "shy", /* soft hyphen */
            174: "reg", /* registered sign */
            175: "macr", /* macron */
            176: "deg", /* degree sign */
            177: "plusmn", /* plus-minus sign */
            178: "sup2", /* superscript two */
            179: "sup3", /* superscript three */
            180: "acute", /* acute accent */
            181: "micro", /* micro sign */
            182: "para", /* pilcrow sign */
            183: "middot", /* middle dot */
            184: "cedil", /* cedilla */
            185: "sup1", /* superscript one */
            186: "ordm", /* masculine ordinal indicator */
            187: "raquo", /* right-pointing double angle quotation mark */
            188: "frac14", /* vulgar fraction one quarter */
            189: "frac12", /* vulgar fraction one half */
            190: "frac34", /* vulgar fraction three quarters */
            191: "iquest", /* inverted question mark */
            192: "Agrave", /* Latin capital letter a with grave */
            193: "Aacute", /* Latin capital letter a with acute */
            194: "Acirc", /* Latin capital letter a with circumflex */
            195: "Atilde", /* Latin capital letter a with tilde */
            196: "Auml", /* Latin capital letter a with diaeresis */
            197: "Aring", /* Latin capital letter a with ring above */
            198: "AElig", /* Latin capital letter ae */
            199: "Ccedil", /* Latin capital letter c with cedilla */
            200: "Egrave", /* Latin capital letter e with grave */
            201: "Eacute", /* Latin capital letter e with acute */
            202: "Ecirc", /* Latin capital letter e with circumflex */
            203: "Euml", /* Latin capital letter e with diaeresis */
            204: "Igrave", /* Latin capital letter i with grave */
            205: "Iacute", /* Latin capital letter i with acute */
            206: "Icirc", /* Latin capital letter i with circumflex */
            207: "Iuml", /* Latin capital letter i with diaeresis */
            208: "ETH", /* Latin capital letter eth */
            209: "Ntilde", /* Latin capital letter n with tilde */
            210: "Ograve", /* Latin capital letter o with grave */
            211: "Oacute", /* Latin capital letter o with acute */
            212: "Ocirc", /* Latin capital letter o with circumflex */
            213: "Otilde", /* Latin capital letter o with tilde */
            214: "Ouml", /* Latin capital letter o with diaeresis */
            215: "times", /* multiplication sign */
            216: "Oslash", /* Latin capital letter o with stroke */
            217: "Ugrave", /* Latin capital letter u with grave */
            218: "Uacute", /* Latin capital letter u with acute */
            219: "Ucirc", /* Latin capital letter u with circumflex */
            220: "Uuml", /* Latin capital letter u with diaeresis */
            221: "Yacute", /* Latin capital letter y with acute */
            222: "THORN", /* Latin capital letter thorn */
            223: "szlig", /* Latin small letter sharp sXCOMMAX German Eszett */
            224: "agrave", /* Latin small letter a with grave */
            225: "aacute", /* Latin small letter a with acute */
            226: "acirc", /* Latin small letter a with circumflex */
            227: "atilde", /* Latin small letter a with tilde */
            228: "auml", /* Latin small letter a with diaeresis */
            229: "aring", /* Latin small letter a with ring above */
            230: "aelig", /* Latin lowercase ligature ae */
            231: "ccedil", /* Latin small letter c with cedilla */
            232: "egrave", /* Latin small letter e with grave */
            233: "eacute", /* Latin small letter e with acute */
            234: "ecirc", /* Latin small letter e with circumflex */
            235: "euml", /* Latin small letter e with diaeresis */
            236: "igrave", /* Latin small letter i with grave */
            237: "iacute", /* Latin small letter i with acute */
            238: "icirc", /* Latin small letter i with circumflex */
            239: "iuml", /* Latin small letter i with diaeresis */
            240: "eth", /* Latin small letter eth */
            241: "ntilde", /* Latin small letter n with tilde */
            242: "ograve", /* Latin small letter o with grave */
            243: "oacute", /* Latin small letter o with acute */
            244: "ocirc", /* Latin small letter o with circumflex */
            245: "otilde", /* Latin small letter o with tilde */
            246: "ouml", /* Latin small letter o with diaeresis */
            247: "divide", /* division sign */
            248: "oslash", /* Latin small letter o with stroke */
            249: "ugrave", /* Latin small letter u with grave */
            250: "uacute", /* Latin small letter u with acute */
            251: "ucirc", /* Latin small letter u with circumflex */
            252: "uuml", /* Latin small letter u with diaeresis */
            253: "yacute", /* Latin small letter y with acute */
            254: "thorn", /* Latin small letter thorn */
            255: "yuml", /* Latin small letter y with diaeresis */
            338: "OElig", /* Latin capital ligature oe */
            339: "oelig", /* Latin small ligature oe */
            352: "Scaron", /* Latin capital letter s with caron */
            353: "scaron", /* Latin small letter s with caron */
            376: "Yuml", /* Latin capital letter y with diaeresis */
            402: "fnof", /* Latin small letter f with hook */
            710: "circ", /* modifier letter circumflex accent */
            732: "tilde", /* small tilde */
            913: "Alpha", /* Greek capital letter alpha */
            914: "Beta", /* Greek capital letter beta */
            915: "Gamma", /* Greek capital letter gamma */
            916: "Delta", /* Greek capital letter delta */
            917: "Epsilon", /* Greek capital letter epsilon */
            918: "Zeta", /* Greek capital letter zeta */
            919: "Eta", /* Greek capital letter eta */
            920: "Theta", /* Greek capital letter theta */
            921: "Iota", /* Greek capital letter iota */
            922: "Kappa", /* Greek capital letter kappa */
            923: "Lambda", /* Greek capital letter lambda */
            924: "Mu", /* Greek capital letter mu */
            925: "Nu", /* Greek capital letter nu */
            926: "Xi", /* Greek capital letter xi */
            927: "Omicron", /* Greek capital letter omicron */
            928: "Pi", /* Greek capital letter pi */
            929: "Rho", /* Greek capital letter rho */
            931: "Sigma", /* Greek capital letter sigma */
            932: "Tau", /* Greek capital letter tau */
            933: "Upsilon", /* Greek capital letter upsilon */
            934: "Phi", /* Greek capital letter phi */
            935: "Chi", /* Greek capital letter chi */
            936: "Psi", /* Greek capital letter psi */
            937: "Omega", /* Greek capital letter omega */
            945: "alpha", /* Greek small letter alpha */
            946: "beta", /* Greek small letter beta */
            947: "gamma", /* Greek small letter gamma */
            948: "delta", /* Greek small letter delta */
            949: "epsilon", /* Greek small letter epsilon */
            950: "zeta", /* Greek small letter zeta */
            951: "eta", /* Greek small letter eta */
            952: "theta", /* Greek small letter theta */
            953: "iota", /* Greek small letter iota */
            954: "kappa", /* Greek small letter kappa */
            955: "lambda", /* Greek small letter lambda */
            956: "mu", /* Greek small letter mu */
            957: "nu", /* Greek small letter nu */
            958: "xi", /* Greek small letter xi */
            959: "omicron", /* Greek small letter omicron */
            960: "pi", /* Greek small letter pi */
            961: "rho", /* Greek small letter rho */
            962: "sigmaf", /* Greek small letter final sigma */
            963: "sigma", /* Greek small letter sigma */
            964: "tau", /* Greek small letter tau */
            965: "upsilon", /* Greek small letter upsilon */
            966: "phi", /* Greek small letter phi */
            967: "chi", /* Greek small letter chi */
            968: "psi", /* Greek small letter psi */
            969: "omega", /* Greek small letter omega */
            977: "thetasym", /* Greek theta symbol */
            978: "upsih", /* Greek upsilon with hook symbol */
            982: "piv", /* Greek pi symbol */
            8194: "ensp", /* en space */
            8195: "emsp", /* em space */
            8201: "thinsp", /* thin space */
            8204: "zwnj", /* zero width non-joiner */
            8205: "zwj", /* zero width joiner */
            8206: "lrm", /* left-to-right mark */
            8207: "rlm", /* right-to-left mark */
            8211: "ndash", /* en dash */
            8212: "mdash", /* em dash */
            8216: "lsquo", /* left single quotation mark */
            8217: "rsquo", /* right single quotation mark */
            8218: "sbquo", /* single low-9 quotation mark */
            8220: "ldquo", /* left double quotation mark */
            8221: "rdquo", /* right double quotation mark */
            8222: "bdquo", /* double low-9 quotation mark */
            8224: "dagger", /* dagger */
            8225: "Dagger", /* double dagger */
            8226: "bull", /* bullet */
            8230: "hellip", /* horizontal ellipsis */
            8240: "permil", /* per mille sign */
            8242: "prime", /* prime */
            8243: "Prime", /* double prime */
            8249: "lsaquo", /* single left-pointing angle quotation mark */
            8250: "rsaquo", /* single right-pointing angle quotation mark */
            8254: "oline", /* overline */
            8260: "frasl", /* fraction slash */
            8364: "euro", /* euro sign */
            8465: "image", /* black-letter capital i */
            8472: "weierp", /* script capital pXCOMMAX Weierstrass p */
            8476: "real", /* black-letter capital r */
            8482: "trade", /* trademark sign */
            8501: "alefsym", /* alef symbol */
            8592: "larr", /* leftwards arrow */
            8593: "uarr", /* upwards arrow */
            8594: "rarr", /* rightwards arrow */
            8595: "darr", /* downwards arrow */
            8596: "harr", /* left right arrow */
            8629: "crarr", /* downwards arrow with corner leftwards */
            8656: "lArr", /* leftwards double arrow */
            8657: "uArr", /* upwards double arrow */
            8658: "rArr", /* rightwards double arrow */
            8659: "dArr", /* downwards double arrow */
            8660: "hArr", /* left right double arrow */
            8704: "forall", /* for all */
            8706: "part", /* partial differential */
            8707: "exist", /* there exists */
            8709: "empty", /* empty set */
            8711: "nabla", /* nabla */
            8712: "isin", /* element of */
            8713: "notin", /* not an element of */
            8715: "ni", /* contains as member */
            8719: "prod", /* n-ary product */
            8721: "sum", /* n-ary summation */
            8722: "minus", /* minus sign */
            8727: "lowast", /* asterisk operator */
            8730: "radic", /* square root */
            8733: "prop", /* proportional to */
            8734: "infin", /* infinity */
            8736: "ang", /* angle */
            8743: "and", /* logical and */
            8744: "or", /* logical or */
            8745: "cap", /* intersection */
            8746: "cup", /* union */
            8747: "int", /* integral */
            8756: "there4", /* therefore */
            8764: "sim", /* tilde operator */
            8773: "cong", /* congruent to */
            8776: "asymp", /* almost equal to */
            8800: "ne", /* not equal to */
            8801: "equiv", /* identical toXCOMMAX equivalent to */
            8804: "le", /* less-than or equal to */
            8805: "ge", /* greater-than or equal to */
            8834: "sub", /* subset of */
            8835: "sup", /* superset of */
            8836: "nsub", /* not a subset of */
            8838: "sube", /* subset of or equal to */
            8839: "supe", /* superset of or equal to */
            8853: "oplus", /* circled plus */
            8855: "otimes", /* circled times */
            8869: "perp", /* up tack */
            8901: "sdot", /* dot operator */
            8968: "lceil", /* left ceiling */
            8969: "rceil", /* right ceiling */
            8970: "lfloor", /* left floor */
            8971: "rfloor", /* right floor */
            9001: "lang", /* left-pointing angle bracket */
            9002: "rang", /* right-pointing angle bracket */
            9674: "loz", /* lozenge */
            9824: "spades", /* black spade suit */
            9827: "clubs", /* black club suit */
            9829: "hearts", /* black heart suit */
            9830: "diams", /* black diamond suit */
        }

        const REPLACEMENT_CHAR = '\ufffd';
        const REPLACEMENT_HEX = "fffd";
        const REPLACEMENT_STR = "" + REPLACEMENT_CHAR;

        function toHex (input) {
            return (Number(input)).toString(16)
        }

        function encodeCharacterForHtml (immune, codePoint, source) {
            let hex = toHex(codePoint)
            if(!hex) {
                return source
            }

            // check for illegal characters
            if(( codePoint <= 0x1f
                    && codePoint != '\t'
                    && codePoint != '\n'
                    && codePoint != '\r' )
                    || ( codePoint >= 0x7f && codePoint <= 0x9f )) {
                hex = REPLACEMENT_HEX;	// Let's entity encode this instead of returning it
                codePoint = REPLACEMENT_CHAR;
            }

            // check if there's a defined entity
            let entityName = characterToEntityMap[codePoint];
            if(entityName != null) {
                return "&" + entityName + ";";
            }

            // return the hex entity as suggested in the spec
            return "&#x" + hex + ";";
        }
    
        function encodeCharacterForJS (immune, codePoint, source) {
            let hex = toHex(codePoint)
            if(!hex) {
                return source
            }

            if ( codePoint < 256 ) {
                let pad = "00".substring(hex.length );
                return "\\x" + pad + hex.toUpperCase();
            }

            // otherwise encode with \\uHHHH
            let pad = "0000".substring(hex.length);
            return "\\u" + pad + hex.toUpperCase();

        }

        let xss_encode = {
            // 参考 OWASP ESAPI的实现
            htmlEncode: function(input) {
                let sb = ''
                let immune = [',', '.', '-', '_', ' ']
                for(let offset = 0; offset < input.length; offset++) {
                    const point = input.codePointAt(offset);
                    if(point && !isNaN(point)) {
                        sb += encodeCharacterForHtml(immune, point, input.charAt(offset));
                    }
                }
                return sb;
            },
            htmlDecode: function(input) {
                
            },
            // 基于html Node节点特性  ## https://developer.mozilla.org/zh-CN/docs/Web/API/Node/textContent
            htmlEncodeByNode: function(input) {
                var temp = document.createElement ("div");
                (temp.textContent != undefined ) ? (temp.textContent = input) : (temp.innerText = input);
                var output = temp.innerHTML;
                return output;
            },
            htmlDecodeByNode: function(input) {
                var temp = document.createElement("div");
                temp.innerHTML = input;
                var output = temp.innerText || temp.textContent;
                temp = null;
                return output;
            },
            // 基于特定字符转义的方式
            htmlEncodeSimple: function(input) {
                var s = "";
                if(!input || input.length == 0) return "";
                s = input.replace(/&/g,"&amp;");
                s = s.replace(/</g,"&lt;");
                s = s.replace(/>/g,"&gt;");
                s = s.replace(/ /g,"&nbsp;");
                s = s.replace(/\'/g,"&#39;");
                s = s.replace(/\"/g,"&quot;");
                return s;
            },
            htmlDecodeSimple: function(input) {
                var s = "";
                if(!input || input.length == 0) return "";
                s = input.replace(/&amp;/g,"&");
                s = s.replace(/&lt;/g,"<");
                s = s.replace(/&gt;/g,">");
                s = s.replace(/&nbsp;/g," ");
                s = s.replace(/&#39;/g,"\'");
                s = s.replace(/&quot;/g,"\"");
                return s;
            },
            // 参考 OWASP ESAPI的实现
            javascriptEncode: function(input) {
                let sb = ''
                let immune = [',', '.', '-', '_', ' ']
                for(let offset = 0; offset < input.length; offset++) {
                    const point = input.codePointAt(offset);
                    if(point && !isNaN(point)) {
                        sb += encodeCharacterForJS(immune, point, input.charAt(offset));
                    }
                }
                return sb;
            },
            // 
            cssEncode: function(input) {
                
            }
        }

        return xss_encode
    }
)

