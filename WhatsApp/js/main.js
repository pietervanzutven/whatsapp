"use strict";

var currentView = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
var appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility;

var gutter = "var gutter = document.getElementsByClassName('_1-iDe _1xXdX'); gutter.length > 0 && (gutter[1].style.display = ";
var conversation = "var conversation = document.getElementsByClassName('_1-iDe Wu52Z'); conversation.length > 0 && (conversation[1].style.display = ";
var show = "'block');";
var hide = "'none');";

window.onload = () => {
    webView.addEventListener("MSWebViewContentLoading", () => webView.invokeScriptAsync("eval", "delete window.Headers;").start());

    webView.addEventListener("MSWebViewNavigationCompleted", () => {
        webView.invokeScriptAsync("eval",
            "var style = document.createElement('style');" +
            "style.appendChild(document.createTextNode('" +
                "._2Oo_9 { min-width: 0px; }" +
                "html[dir=ltr] ._1iJWV { margin-left: 0px; margin-right: 0px }" +
                "@media screen and (max-width:648px) { .h70RQ { min-width: 0; } }" +
                "@media screen and (max-width:660px) { .landing-wrapper { min-width: 0; } }" +
                "@media screen and (max-width:600px) { ._1-iDe {position: absolute; width: 100%; } }" +
            "'));" +
            "document.head.appendChild(style);" +
            "var variables = {};" +
            "var styleSheets = document.styleSheets;" +
            "for (var i=0; i<styleSheets.length; i++) {" +
                "var styleSheet = styleSheets[i];" +
                "if (styleSheet.href && styleSheet.href.includes('cssm_qr')) {" +
                    "var rules = styleSheet.rules;" +
                    "for (var j=0; j<rules.length; j++) {" +
                        "var rule = rules[j];" +
                        "if (rule.cssText.includes(':root { ')) {" +
                            "var declarations = rule.cssText.replace(':root { ','').replace('}','').split('; ');" +
                            "for (var k=0; k<declarations.length; k++) {" +
                                "var declaration = declarations[k];" +
                                "if (declaration) {" +
                                    "var property = declaration.replace('--','').split(':');" +
                                    "variables[property[0]] = property[1];" +
                                "}" +
                            "}" +
                            "break;" +
                        "}" +
                    "}" +
                    "break;" +
                "}" +
            "}" +
            "for (var i=0; i<styleSheets.length; i++) {" +
                "var styleSheet = styleSheets[i];" +
                "if (styleSheet.href && (styleSheet.href.includes('cssm_qr') || styleSheet.href.includes('cssm_app'))) {" +
                    "var rules = styleSheet.rules;" +
                    "for (var j=0; j<rules.length; j++) {" +
                        "var rule = rules[j];" +
                        "if (rule.cssText.search('var') > 0) {" +
                            "var text = rule.cssText;" +
                            "var matches = text.match(/var\\(.*?\\)/g);" +
                            "if (matches) {" +
                                "for (var k=0; k<matches.length; k++) {" +
                                    "var match = matches[k];" +
                                    "var text = text.replace(match, variables[match.replace('var(--','').replace(')','')]);" +
                                "}" +
                                "styleSheet.deleteRule(j);" +
                                "styleSheet.insertRule(text);" +
                            "}" +
                        "}" +
                    "}" +
                "}" +
            "}" +
            "var interval = setInterval(() => {" +
                "var pane = document.getElementById('pane-side');" +
                "if (pane) {" +
                    "pane.addEventListener('click',() => window.external.notify('pane_clicked'));" +
                    "if (window.innerWidth < 600) {" +
                        gutter + show + conversation + hide +
                    "}" +
                    "clearInterval(interval);" +
                "}" +
            "}, 1000);").start();
    });

    webView.addEventListener("MSWebViewScriptNotify", () => {
        if (window.innerWidth < 600) {
            webView.invokeScriptAsync("eval", gutter + hide + conversation + show).start();
            currentView.appViewBackButtonVisibility = appViewBackButtonVisibility.visible;
            currentView.onbackrequested = function (event) {
                if (currentView.appViewBackButtonVisibility === appViewBackButtonVisibility.visible) {
                    webView.invokeScriptAsync("eval", gutter + show + conversation + hide).start();
                    currentView.appViewBackButtonVisibility = appViewBackButtonVisibility.collapsed;
                    event.detail[0].handled = true;
                }
            };
        }
    });

    var userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.45 Safari/537.36 Edg/79.0.309.30";
    var httpRequestMessage = new Windows.Web.Http.HttpRequestMessage(Windows.Web.Http.HttpMethod.get, new Windows.Foundation.Uri("https://web.whatsapp.com/"));
    httpRequestMessage.headers.append("User-Agent", userAgent);
    webView.navigateWithHttpRequestMessage(httpRequestMessage);
}

window.matchMedia("(max-width: 600px)").addListener(() => {
    if (window.innerWidth > 600) {
        webView.invokeScriptAsync("eval", gutter + show + conversation + show).start();
        currentView.appViewBackButtonVisibility = appViewBackButtonVisibility.collapsed;
        currentView.onbackrequested = null;
    } else {
        if (currentView.appViewBackButtonVisibility === appViewBackButtonVisibility.visible) {
            webView.invokeScriptAsync("eval", gutter + hide + conversation + show).start();
        } else {
            webView.invokeScriptAsync("eval", gutter + show + conversation + hide).start();
        }
    }
});