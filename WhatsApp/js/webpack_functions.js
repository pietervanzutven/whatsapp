function(e, t, a) {
    "use strict";
    var n = a("cfjecfhbfg");
    Object.defineProperty(t, "__esModule", {
        value: !0
    }),
    t.default = function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return u.default.log("extendedFetch:", e)(),
        f(e, t).catch((function(e) {
            if ("AbortError" === e.name)
                throw new r.default;
            if (e instanceof s.HttpNetworkError)
                throw e;
            throw new s.HttpNetworkError(e.message)
        }
        ))
    }
    ,
    t.sharedFetch = f;
    var i = n(a("bhfcfhafdj"))
      , r = n(a("cgijjjgici"))
      , o = n(a("bcjafgaahj"))
      , s = a("fdghiidhc")
      , d = n(a("dcgheafecg"))
      , c = n(a("dbhgiicheg"))
      , u = n(a("bdiiahhjbe"))
      , l = n(a("ciehajbjae"));
    function f(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return new Promise((function(a, n) {
            if (t.signal && t.signal.aborted)
                n(new o.default("AbortError"));
            else {
                var r = new XMLHttpRequest;
                if (t.signal) {
                    var u = t.signal;
                    u.addEventListener("abort", (function e() {
                        u.removeEventListener("abort", e),
                        r.onreadystatechange = function() {}
                        ,
                        r.abort(),
                        n(new o.default("AbortError"))
                    }
                    ))
                }
                //var f = new c.default(t.headers || {});
                //(0,
                //d.default)(f.keys(), (function(e) {
                //    var t = f.get(e);
                //    null != t && r.setRequestHeader(e, t)
                //}
                //)),
                null != t.onProgress && (r.onprogress = t.onProgress),
                r.onreadystatechange = function() {
                    if (0 !== r.readyState) {
                        if (4 === r.readyState) {
                            if (null == r.status)
                                return void n(new Error("fetch error: no status"));
                            if (0 === r.status || r.status >= 12e3)
                                return void n(new Error("fetch error: unexpected status ".concat(r.status)));
                            a(h())
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
                    n(new s.HttpTimedOutError("fetch error: timedout",{
                        url: e.toString()
                    }))
                }
                ,
                r.withCredentials = "include" === t.credentials,
                null != t.timeout && (r.timeout = t.timeout),
                r.open(t.method || "get", e.toString(), !0),
                r.responseType = "arraybuffer",
                r.send(t.body || null)
            }
            function h() {
                var e = new c.default((0,
                l.default)(r.getAllResponseHeaders()));
                return {
                    ok: 200 <= r.status && r.status < 300,
                    statusText: r.statusText,
                    status: r.status,
                    url: r.responseURL,
                    text: function() {
                        return p()
                    },
                    json: function() {
                        return p().then((function(e) {
                            return JSON.parse(e)
                        }
                        ))
                    },
                    arrayBuffer: function() {
                        return r.response
                    },
                    blob: function() {
                        return Promise.resolve(new Blob([r.response],{
                            type: e.get("content-type") || ""
                        }))
                    },
                    clone: h,
                    headers: e
                }
            }
            function p() {
                return Promise.resolve(String.fromCharCode.apply(String, (0,
                i.default)(new Uint8Array(r.response))))
            }
        }
        ))
    }
}