"use strict";

const { WAConnection } = require('@adiwajshing/baileys/lib');
const QR = require("qrcode-terminal/lib/main");
window.Buffer = require('buffer').Buffer;

async function connectToWhatsApp(conn) {
    const authInfo = JSON.parse(Windows.Storage.ApplicationData.current.localSettings.values["authInfo"]);

    conn.on("qr", qr => {
        QR.generate(qr, { small: true }, function (qrcode) {
            const div = document.getElementById("qr");
            div.innerHTML = qrcode;
        });
    });

    conn.on("open", () => {
        const authInfo = conn.base64EncodedAuthInfo();
        Windows.Storage.ApplicationData.current.localSettings.values["authInfo"] = JSON.stringify(authInfo);
    });

    conn.on("contacts-received", () => {
        conn.chats.array.forEach(chat => {
            const link = document.createElement("a");
            link.addEventListener("click", () => openConversation(chat.jid));
            link.href = "#";
            link.innerHTML = chat.name + "\n";
            contacts.appendChild(link);
        });
        contacts.classList.remove("hidden");
        qr.classList.add("hidden");
    });

    if (authInfo) {
        conn.loadAuthInfo(authInfo);
    }

    try {
        await conn.connect();
    } catch (error) {
        conn.clearAuthInfo();
        await conn.connect();
    }
}

function openConversation(jid) {
    contacts.classList.add("hidden");
    conversation.classList.remove("hidden");

    const envelopes = conn.chats.dict[jid].messages.array;
    conversation.innerHTML = "";
    envelopes.forEach(envelope => {
        const message = envelope.message;
        if (message) {
            if (message.conversation) {
                const div = document.createElement("div");
                div.innerHTML = message.conversation;
                div.classList.add("message");
                if (envelope.key.fromMe) {
                    div.classList.add("right");
                } else {
                    div.classList.add("left");
                }
                conversation.appendChild(div);
            }
        }
    });

    Windows.UI.Core.SystemNavigationManager.getForCurrentView().appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.visible;
    Windows.UI.Core.SystemNavigationManager.getForCurrentView().onbackrequested = event => {
        event.handled = true;
        conversation.classList.add("hidden");
        contacts.classList.remove("hidden");
        Windows.UI.Core.SystemNavigationManager.getForCurrentView().appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
    }
}

let conn;
window.onload = () => {
    conn = new WAConnection();

    connectToWhatsApp(conn);
}
