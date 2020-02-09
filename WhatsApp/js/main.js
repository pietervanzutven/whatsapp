'use strict';

var currentView = Windows.UI.Core.SystemNavigationManager.getForCurrentView();

var gutter = 'document.getElementsByClassName("_10V4p _3A_Ft")[1].style.display = ';
var conversation = 'document.getElementsByClassName("_10V4p _1jxtm")[1].style.display = ';
var show = '"block";';
var hide = '"none";';

var webpackFunctions = '';
Windows.Storage.StorageFile.getFileFromApplicationUriAsync(Windows.Foundation.Uri('ms-appx:///js/webpack_functions.js'))
    .then(file => Windows.Storage.FileIO.readTextAsync(file)
    .then(text => webpackFunctions = text));

window.onload = () => {
    var userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.45 Safari/537.36 Edg/79.0.309.30";
    var httpRequestMessage = new Windows.Web.Http.HttpRequestMessage(Windows.Web.Http.HttpMethod.get, new Windows.Foundation.Uri('https://web.whatsapp.com/'));
    httpRequestMessage.headers.append("User-Agent", userAgent);
    webView.navigateWithHttpRequestMessage(httpRequestMessage);

    webView.addEventListener('MSWebViewNavigationCompleted', () => {
        webView.invokeScriptAsync('eval',
            'var style = document.createElement("style");' +
            'style.appendChild(document.createTextNode("' + 
                '.-peIt { min-width:0; }' +
                '@media screen and (max-width:648px) { ._1Jzz1 { min-width:0; } }' +
                '@media screen and (max-width:660px) { .landing-wrapper { min-width:0; } }' +
                '@media screen and (max-width:600px) { ._1jxtm { display: none; } }' +
            '"));' +
            'document.head.appendChild(style);' +
            'webpackJsonp([0], ' + webpackFunctions + ');' +
            'var interval = setInterval(() => {' +
                'var pane = document.getElementById("pane-side");' +
                'if (pane) {' +
                    'pane.addEventListener("click",() => window.external.notify("pane_clicked"));' +
                    'clearInterval(interval);' +
                '}' +
            '}, 1000);').start();
    });

    webView.addEventListener('MSWebViewScriptNotify', () => {
        if (window.innerWidth < 600) {
            webView.invokeScriptAsync('eval', gutter + hide + conversation + show).start();
            currentView.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.visible;
            currentView.onbackrequested = function (event) {
                if (currentView.appViewBackButtonVisibility === Windows.UI.Core.AppViewBackButtonVisibility.visible) {
                    webView.invokeScriptAsync('eval', gutter + show + conversation + hide).start();
                    currentView.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
                    event.detail[0].handled = true;
                }
            };
        }
    });

}

window.matchMedia('(max-width: 600px)').addListener(() => {
    if (window.innerWidth > 600) {
        webView.invokeScriptAsync('eval', gutter + show + conversation + show).start();
        currentView.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
        currentView.onbackrequested = null;
    } else {
        if (Windows.UI.Core.SystemNavigationManager.getForCurrentView().appViewBackButtonVisibility === Windows.UI.Core.AppViewBackButtonVisibility.visible) {
            webView.invokeScriptAsync('eval', gutter + hide + conversation + show).start();
        } else {
            webView.invokeScriptAsync('eval', gutter + show + conversation + hide).start();
        }
    }
});