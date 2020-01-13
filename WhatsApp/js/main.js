﻿'use strict';

window.onload = () => {
    var userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.45 Safari/537.36 Edg/79.0.309.30";
    var httpRequestMessage = new Windows.Web.Http.HttpRequestMessage(Windows.Web.Http.HttpMethod.get, new Windows.Foundation.Uri('https://web.whatsapp.com/'));
    httpRequestMessage.headers.append("User-Agent", userAgent);
    webView.navigateWithHttpRequestMessage(httpRequestMessage);
}

window.matchMedia('(max-width: 600px)').addListener(() => {
    var gutter = 'document.getElementsByClassName("_3HZor _3kF8H")[1].style.display = ';
    var conversation = 'document.getElementsByClassName("_3HZor _2rI9W")[1].style.display = ';
    var show = '"block";';
    var hide = '"none";';
    if (window.innerWidth > 600) {
        webView.invokeScriptAsync('eval', gutter + show + conversation + show).start();
    } else {
        if (Windows.UI.Core.SystemNavigationManager.getForCurrentView().appViewBackButtonVisibility === Windows.UI.Core.AppViewBackButtonVisibility.visible) {
            webView.invokeScriptAsync('eval', gutter + hide + conversation + show).start();
        } else {
            webView.invokeScriptAsync('eval', gutter + show + conversation + hide).start();
        }
    }
});