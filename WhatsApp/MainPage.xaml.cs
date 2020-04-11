using System;
using Windows.Storage;
using Windows.UI.Core;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Navigation;
using Windows.Web.Http;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace WhatsApp
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        private String gutter = "var gutter = document.getElementsByClassName('_1-iDe _1xXdX'); gutter.length > 0 && (gutter[1].style.display = ";
        private String conversation = "var conversation = document.getElementsByClassName('_1-iDe Wu52Z'); conversation.length > 0 && (conversation[1].style.display = ";
        private String show = "'block');";
        private String hide = "'none');";

        private String webpackFunctions = "";

        public MainPage()
        {
            this.InitializeComponent();

            var userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.45 Safari/537.36 Edg/79.0.309.30";
            HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, new Uri("https://web.whatsapp.com/"));
            httpRequestMessage.Headers.Add("User-Agent", userAgent);
            webView.NavigateWithHttpRequestMessage(httpRequestMessage);

            LoadWebPackFunctions();
        }

        private async void LoadWebPackFunctions()
        {
            StorageFile file = await StorageFile.GetFileFromApplicationUriAsync(new Uri("ms-appx:///js/webpack_functions.js"));
            webpackFunctions = await FileIO.ReadTextAsync(file);
        }

        private void WebView_LoadCompleted(object sender, NavigationEventArgs e)
        {
            _ = webView.InvokeScriptAsync("eval", new string[] {
                "var style = document.createElement('style');" +
                "style.appendChild(document.createTextNode('" +
                    "._2dA13 { min-width:0; }" +
                    "html[dir=ltr] ._2ucQa { margin-left: 0px; margin-right: 0px }" +
                    "html[dir=ltr] .l92Uo { margin-left: 0px; margin-right: 0px }" +
                    "@media screen and (max-width:648px) { .h70RQ { min-width: 0; } }" +
                    "@media screen and (max-width:660px) { .landing-wrapper { min-width: 0; } }" +
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
                                        "var property = declaration.replace('--','').split(': ');" +
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
                                        "var text = text.replace(match, variables[match.replace('var(--','' ).replace(')','')]);" +
                                    "}" +
                                    "styleSheet.deleteRule(j);" +
                                    "var n = styleSheet.insertRule(text);" +
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
                "}, 1000);" +
                "window.webpackJsonp.push([[4],{dgjijbgdai: " + webpackFunctions + "}]);"});
        }

        private void WebView_ScriptNotify(object sender, NotifyEventArgs e)
        {
            if (webView.ActualWidth < 600)
            {
                SystemNavigationManager currentView = SystemNavigationManager.GetForCurrentView();
                _ = webView.InvokeScriptAsync("eval", new string[] { gutter + hide + conversation + show });
                currentView.AppViewBackButtonVisibility = AppViewBackButtonVisibility.Visible;
                currentView.BackRequested += OnBackRequested;
            }
        }

        private void OnBackRequested(object sender, BackRequestedEventArgs e)
        {
            SystemNavigationManager currentView = SystemNavigationManager.GetForCurrentView();
            _ = webView.InvokeScriptAsync("eval", new string[] { gutter + show + conversation + hide });
            currentView.AppViewBackButtonVisibility = AppViewBackButtonVisibility.Collapsed;
            currentView.BackRequested -= OnBackRequested;
            e.Handled = true;
        }

        private void WebView_SizeChanged(object sender, SizeChangedEventArgs e)
        {
            SystemNavigationManager currentView = SystemNavigationManager.GetForCurrentView();
            if (webView.ActualWidth > 600)
            {
                _ = webView.InvokeScriptAsync("eval", new string[] { gutter + show + conversation + show });
                currentView.AppViewBackButtonVisibility = AppViewBackButtonVisibility.Collapsed;
                currentView.BackRequested -= OnBackRequested;
            }
            else
            {
                if (currentView.AppViewBackButtonVisibility == AppViewBackButtonVisibility.Visible)
                {
                    _ = webView.InvokeScriptAsync("eval", new string[] { gutter + hide + conversation + show });
                }
                else
                {
                    _ = webView.InvokeScriptAsync("eval", new string[] { gutter + show + conversation + hide });
                }
            }
        }
    }
}
