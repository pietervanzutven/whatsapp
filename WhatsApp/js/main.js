"use strict";

var currentView = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
var appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility;

var gutter = "var gutter = document.getElementsByClassName('_1-iDe _1xXdX'); gutter.length > 0 && (gutter[1].style.display = ";
var conversation = "var conversation = document.getElementsByClassName('_1-iDe Wu52Z'); conversation.length > 0 && (conversation[1].style.display = ";
var show = "'block');";
var hide = "'none');";

var webpackFunctions = "";
Windows.Storage.StorageFile.getFileFromApplicationUriAsync(Windows.Foundation.Uri("ms-appx:///js/webpack_functions.js"))
    .then(file => Windows.Storage.FileIO.readTextAsync(file)
    .then(text => webpackFunctions = text));

window.onload = () => {
    var userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.45 Safari/537.36 Edg/79.0.309.30";
    var httpRequestMessage = new Windows.Web.Http.HttpRequestMessage(Windows.Web.Http.HttpMethod.get, new Windows.Foundation.Uri("https://web.whatsapp.com/"));
    httpRequestMessage.headers.append("User-Agent", userAgent);
    webView.navigateWithHttpRequestMessage(httpRequestMessage);

    webView.addEventListener("MSWebViewNavigationCompleted", () => {
        webView.invokeScriptAsync("eval",
            "var style = document.createElement('style');" +
            "style.appendChild(document.createTextNode('" +
                "._2dA13 { min-width:0; }" +
                "@media screen and (max-width:648px) { .h70RQ { min-width: 0; } }" +
                "@media screen and (max-width:660px) { .landing-wrapper { min-width: 0; } }" +
                "html[dir] ._2fq0t { background-color: #f7f7f7; }" +
                "html[dir] ._1CkkN { background-color: 3fff; }" +
                "html[dir] ._1NVPn { background-color: #ededed;}" +
                "html[dir] ._3auIg { background-color: #ededed; }" +
                "html[dir] ._35DHA { background-color: #9de1fe; }" +
                "html[dir] .rRAIq { background-color: #f7f7f7; }" +
                "html[dir] ._1RQfk { background-color: #fff; }" +
                "html[dir] ._1FroB { background-color: #00bfa5 }" +
                "html[dir] ._1AKfk { background-color: #fff; }" +
                "html[dir] ._2EXPL { background-color: #fff; }" +
                "html[dir] .Zq3Mc { background-color: rgba(225, 245, 254, 0.92); }" +
                "html[dir] ._2y17h { background-color: #ededed; }" +
                "html[dir] .message-in .MVjBr { background-color: #fff; }" +
                "html[dir] .message-out .MVjBr { background-color: #dcf8c6; }" +
                "html[dir] ._298R6 { background-color: #fff; }" +
                "html[dir] ._3pkkz { background-color: #f0f0f0; }" +
                "html[dir] ._1Plpp { background-color: #fff; }" +
                "html[dir] ._1CSx9 { background-color: #ededed; }" +
                "html[dir] ._1CRb5 { background-color: #fff; }" +
                "html[dir] ._1qUma { background-color: #f0f0f0; }" +
                "html[dir] ._3tlsa { background-color: #f0f0f0; }" +
                "html[dir] ._1CnF3 { background-color: #fff; }" +
            "'));" +
            "document.head.appendChild(style);" +
            "var interval = setInterval(() => {" +
                "var pane = document.getElementById('pane-side');" +
                "if (pane) {" +
                    "pane.addEventListener('click',() => window.external.notify('pane_clicked'));" +
                    "if (window.innerWidth < 600) {" +
                        gutter + show + conversation + hide +
                    "}" +
                    "clearInterval(interval);" +
                "}" +
            "}, 1000);" +
            "window.webpackJsonp.push([[4],{dgjijbgdai: " + webpackFunctions + "}]);").start();
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