"use strict";

require("finally-polyfill");
const { MessageType, WAConnection } = require("@adiwajshing/baileys/lib");
const QR = require("qrcode-terminal/lib/main");
window.Buffer = require("buffer").Buffer;

async function connectToWhatsApp(conn) {
    const authInfo = Windows.Storage.ApplicationData.current.localSettings.values["authInfo"];

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
        sender.innerHTML = conn.user.name;
        conn.chats.array.forEach(chat => {
            const div = document.createElement("div");
            div.addEventListener("click", () => openConversation(chat.jid));
            div.innerHTML = chat.name;
            div.classList.add("contact");
            contacts.appendChild(div);
        });
        directory.classList.remove("hidden");
        qr.classList.add("hidden");
    });

    if (authInfo) {
        conn.loadAuthInfo(JSON.parse(authInfo));
    }

    try {
        await conn.connect();
    } catch (error) {
        conn.clearAuthInfo();
        await conn.connect();
    }
}

async function openConversation(jid) {
    directory.classList.add("hidden");

    Windows.UI.Core.SystemNavigationManager.getForCurrentView().appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.visible;
    Windows.UI.Core.SystemNavigationManager.getForCurrentView().onbackrequested = event => {
        event.handled = true;
        conversation.classList.add("hidden");
        directory.classList.remove("hidden");
        Windows.UI.Core.SystemNavigationManager.getForCurrentView().appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
        Windows.UI.Core.SystemNavigationManager.getForCurrentView().onbackrequested = "";
    }

    const chat = conn.chats.dict[jid];
    addressee.innerHTML = chat.name;
    address.value = jid;

    let envelopes = chat.messages.array;
    if (envelopes.length < 2) {
        envelopes = (await conn.loadMessages(jid, 20)).messages;
    }

    messages.innerHTML = "";
    envelopes.forEach(envelope => {
        const message = envelope.message;
        if (message) {
            const div = document.createElement("div");
            if (envelope.key.fromMe) {
                div.classList.add("right");
                div.innerHTML = "<b>" + conn.user.name + "</b>\n";
            } else {
                div.classList.add("left");
                if (envelope.key.participant) {
                    div.innerHTML = "<b>" + conn.contacts[envelope.key.participant].name + "</b>\n";
                } else {
                    div.innerHTML = "<b>" + conn.contacts[envelope.key.remoteJid].name + "</b>\n";
                }
            }
            if (message.conversation) {
                div.innerHTML += message.conversation;
            } else if (message.extendedTextMessage) {
                div.innerHTML += message.extendedTextMessage.text;
            } else if (message.contactMessage) {
                div.innerHTML += message.contactMessage.displayName + ": " + message.contactMessage.vcard;
            } else if (message.imageMessage || message.audioMessage || message.documentMessage) {
                if (message.imageMessage) {
                    const img = document.createElement("img");
                    img.src = URL.createObjectURL(new Blob([message.imageMessage.jpegThumbnail], { type: 'image/png' }));
                    div.appendChild(img);
                    div.innerHTML += message.imageMessage.caption ? "\n" + message.imageMessage.caption : "";
                } else {
                    div.innerHTML += "Attachment";
                }
            } else {
                div.innerHTML += "Unkown message type!"
            }
            div.innerHTML += "\n<i>" + (new Date(envelope.messageTimestamp.low * 1000)).toLocaleString() + "</i";
            div.classList.add("message");
            messages.appendChild(div);
        }
    });

    conversation.classList.remove("hidden");
    messages.scrollTop = messages.scrollHeight
}

async function sendMessage() {
    await conn.sendMessage(address.value, letter.value, MessageType.text);
    letter.value = "";
}

let conn;
let directory, sender, contacts;
let conversation, addressee, messages, letter, address, send;
window.onload = () => {
    conn = new WAConnection();
    connectToWhatsApp(conn);

    directory = document.getElementById("directory");
    sender = document.getElementById("sender");
    contacts = document.getElementById("contacts");

    conversation = document.getElementById("conversation");
    addressee = document.getElementById("addressee");
    messages = document.getElementById("messages");
    letter = document.getElementById("letter");
    address = document.getElementById("address");
    send = document.getElementById("send");

    send.addEventListener("click", sendMessage);
}
