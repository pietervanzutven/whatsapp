{dgjijbgdai: function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }),
    t.default = function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return s.default.log("extendedFetch:", e)(),
        f(e, t).catch(function(e) {
            if ("AbortError" === e.name)
                throw new r.default;
            if (e instanceof o.HttpNetworkError)
                throw e;
            throw new o.HttpNetworkError(e.message)
        })
    }
    ,
    t.sharedFetch = f;
    var r = c(n("cgijjjgici"))
      , a = c(n("bcjafgaahj"))
      , o = n("fdghiidhc")
      , i = c(n("dcgheafecg"))
      , u = c(n("dbhgiicheg"))
      , s = c(n("bdiiahhjbe"))
      , l = c(n("ciehajbjae"));
    function c(e) {
        return e && e.__esModule ? e : {
            default: e
        }
    }
    function f(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return new Promise(function(n, r) {
            if (t.signal && t.signal.aborted)
                r(new a.default("AbortError"));
            else {
                var s = new XMLHttpRequest;
                if (t.signal) {
                    var c = t.signal;
                    c.addEventListener("abort", function e() {
                        c.removeEventListener("abort", e),
                        s.onreadystatechange = function() {}
                        ,
                        s.abort(),
                        r(new a.default("AbortError"))
                    })
                }
                //var f = new u.default(t.headers || {});
                //(0,
                //i.default)(f.keys(), function(e) {
                //    var t = f.get(e);
                //    null != t && s.setRequestHeader(e, t)
                //}),
                null != t.onProgress && (s.onprogress = t.onProgress),
                s.onreadystatechange = function() {
                    if (0 !== s.readyState) {
                        if (4 === s.readyState) {
                            if (null == s.status)
                                return void r(new Error("fetch error: no status"));
                            if (0 === s.status || s.status >= 12e3)
                                return void r(new Error(`fetch error: unexpected status ${s.status}`));
                            n(d())
                        }
                    } else
                        r(new Error("fetch error: not sent"))
                }
                ,
                s.onerror = function() {
                    return r(new Error("fetch error: error"))
                }
                ,
                s.ontimeout = function() {
                    r(new o.HttpTimedOutError("fetch error: timedout",{
                        url: e.toString()
                    }))
                }
                ,
                s.withCredentials = "include" === t.credentials,
                null != t.timeout && (s.timeout = t.timeout),
                s.open(t.method || "get", e.toString(), !0),
                s.responseType = "arraybuffer",
                s.send(t.body || null)
            }
            function d() {
                var e = new u.default((0,
                l.default)(s.getAllResponseHeaders()));
                return {
                    ok: 200 <= s.status && s.status < 300,
                    statusText: s.statusText,
                    status: s.status,
                    url: s.responseURL,
                    text: function() {
                        return p()
                    },
                    json: function() {
                        return p().then(function(e) {
                            return JSON.parse(e)
                        })
                    },
                    arrayBuffer: function() {
                        return s.response
                    },
                    blob: function() {
                        return Promise.resolve(new Blob([s.response],{
                            type: e.get("content-type") || ""
                        }))
                    },
                    clone: d,
                    headers: e
                }
            }
            function p() {
                return Promise.resolve(String.fromCharCode.apply(String, function(e) {
                    if (Array.isArray(e)) {
                        for (var t = 0, n = Array(e.length); t < e.length; t++)
                            n[t] = e[t];
                        return n
                    }
                    return Array.from(e)
                }(new Uint8Array(s.response))))
            }
        }
        )
    }
}}