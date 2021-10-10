"use strict";

const { WAConnection } = require('@adiwajshing/baileys/lib');
window.Buffer = require('buffer').Buffer;

async function connectToWhatsApp(conn) {
    const authInfo = JSON.parse(Windows.Storage.ApplicationData.current.localSettings.values["authInfo"]);
    
    conn.on("open", () => {
        const authInfo = conn.base64EncodedAuthInfo();
        Windows.Storage.ApplicationData.current.localSettings.values["authInfo"] = JSON.stringify(authInfo);
    })

    if (authInfo) {
        conn.loadAuthInfo(authInfo);
    }

    await conn.connect();
}

window.onload = () => {
    const conn = new WAConnection();

    connectToWhatsApp(conn);
}
