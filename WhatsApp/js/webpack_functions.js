function(e, t, a) {
    "use strict";
    var n = a("cfjecfhbfg");
    Object.defineProperty(t, "__esModule", {
        value: !0
    }),
    t.default = function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return LOG(2)(g()),
        m(e, t).catch((function(e) {
            if ("AbortError" === e.name)
                throw new s.default;
            if (e instanceof c.HttpNetworkError)
                throw e;
            throw new c.HttpNetworkError(e.message)
        }
        ))
    }
    ,
    t.sharedFetch = m;
    var i = n(a("bhfcfhafdj"))
      , r = n(a("bhabhhjdch"))
      , o = n(a("dfadhaifh"))
      , s = n(a("cgijjjgici"))
      , d = n(a("bcjafgaahj"))
      , c = a("fdghiidhc")
      , u = n(a("dcgheafecg"))
      , l = n(a("dbhgiicheg"))
      , f = n(a("ciehajbjae"));
    function h(e, t) {
        var a = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(e);
            t && (n = n.filter((function(t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable
            }
            ))),
            a.push.apply(a, n)
        }
        return a
    }
    function p(e) {
        for (var t = 1; t < arguments.length; t++) {
            var a = null != arguments[t] ? arguments[t] : {};
            t % 2 ? h(Object(a), !0).forEach((function(t) {
                (0,
                r.default)(e, t, a[t])
            }
            )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(a)) : h(Object(a)).forEach((function(t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(a, t))
            }
            ))
        }
        return e
    }
    function g() {
        var e = (0,
        o.default)(["extendedFetch:"]);
        return g = function() {
            return e
        }
        ,
        e
    }
    function m(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return new Promise((function(a, n) {
            if (t.signal && t.signal.aborted)
                n(new d.default("AbortError"));
            else {
                var r = new XMLHttpRequest;
                if (t.signal) {
                    var o = t.signal;
                    o.addEventListener("abort", (function e() {
                        o.removeEventListener("abort", e),
                        r.onreadystatechange = function() {}
                        ,
                        r.abort(),
                        n(new d.default("AbortError"))
                    }
                    ))
                }
                //var s = new l.default(t.headers || {});
                //(0,
                //u.default)(s.keys(), (function(e) {
                //    var t = s.get(e);
                //    null != t && r.setRequestHeader(e, t)
                //}
                //));
                var h = t.onProgress
                  , g = t.onResponseText;
                (null != h || g) && (r.onprogress = function(e) {
                    g && g(e, r.responseText),
                    h && h(e)
                }
                ),
                r.onreadystatechange = function() {
                    if (0 !== r.readyState) {
                        if (4 === r.readyState) {
                            if (null == r.status)
                                return void n(new Error("fetch error: no status"));
                            if (0 === r.status || r.status >= 12e3)
                                return void n(new Error("fetch error: unexpected status ".concat(r.status)));
                            a(m())
                        }
                    } else
                        n(new Error("fetch error: not sent"))
                }
                ,
                r.onerror = function() {
                    return n(new Error("fetch error: error"))
                }
                ,
                r.ontimeout = function() {
                    n(new c.HttpTimedOutError("fetch error: timedout",{
                        url: e.toString()
                    }))
                }
                ,
                r.withCredentials = "include" === t.credentials,
                null != t.timeout && (r.timeout = t.timeout),
                r.open(t.method || "get", e.toString(), !0),
                g ? r.overrideMimeType("text/plain; charset=x-user-defined") : r.responseType = "arraybuffer",
                r.send(t.body || null)
            }
            function m() {
                var e = new l.default((0,
                f.default)(r.getAllResponseHeaders()));
                return p({
                    ok: 200 <= r.status && r.status < 300,
                    statusText: r.statusText,
                    status: r.status,
                    url: r.responseURL
                }, g ? {
                    text: function() {
                        return Promise.resolve(r.responseText)
                    },
                    json: function() {
                        return Promise.resolve(JSON.parse(r.responseText))
                    },
                    arrayBuffer: function() {
                        return Promise.resolve((e = r.responseText,
                        (t = new Uint8Array(e.length)).set((0,
                        i.default)(e).map((function(e) {
                            return e.codePointAt(0)
                        }
                        ))),
                        t.buffer));
                        var e, t
                    }
                } : {
                    text: function() {
                        return b()
                    },
                    json: function() {
                        return b().then((function(e) {
                            return JSON.parse(e)
                        }
                        ))
                    },
                    arrayBuffer: function() {
                        return r.response
                    }
                }, {
                    blob: function() {
                        return Promise.resolve(new Blob([r.response],{
                            type: e.get("content-type") || ""
                        }))
                    },
                    clone: m,
                    headers: e
                })
            }
            function b() {
                return Promise.resolve(String.fromCharCode.apply(String, (0,
                i.default)(new Uint8Array(r.response))))
            }
        }
        ))
    }
}