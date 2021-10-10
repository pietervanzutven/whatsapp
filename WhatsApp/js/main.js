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

window.onload = () => {
    const conn = new WAConnection();

    connectToWhatsApp(conn);
}
