"use strict";

require("finally-polyfill");
const { MessageType, WAConnection } = require("@adiwajshing/baileys/lib");
const QR = require("qrcode-terminal/lib/main");
window.Buffer = require("buffer").Buffer;

async function connectToWhatsApp(conn) {
    const authInfo = Windows.Storage.ApplicationData.current.localSettings.values["authInfo"];

    conn.on("qr", qr => {
        QR.generate(qr, { small: true }, function (qrcode) {
            const div = document.getElementById("pair");
            div.innerHTML = qrcode;
        });
        pair.classList.remove("hidden");
        directory.classList.add("hidden");
    });

    conn.on("close", () => {
        status.className = "red";
    });

    conn.on("connecting", () => {
        status.className = "orange";
    });

    conn.on("open", () => {
        status.className = "green";
        const authInfo = conn.base64EncodedAuthInfo();
        Windows.Storage.ApplicationData.current.localSettings.values["authInfo"] = JSON.stringify(authInfo);
    });

    conn.on("contacts-received", openDirectory);

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

function openDirectory() {
    sender.innerHTML = conn.user.name;
    contacts.innerHTML = "";
    conn.chats.array.forEach(chat => {
        const div = document.createElement("div");
        div.addEventListener("click", () => openConversation(chat.jid));
        if (chat.count > 0) {
            div.innerHTML = "<b>" + chat.name + "</b>";
        } else {
            div.innerHTML = chat.name;
        }
        div.classList.add("contact");
        contacts.appendChild(div);
    });

    directory.classList.remove("hidden");
    pair.classList.add("hidden");
    conversation.classList.add("hidden");
}

async function openConversation(jid) {
    Windows.UI.Core.SystemNavigationManager.getForCurrentView().appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.visible;
    Windows.UI.Core.SystemNavigationManager.getForCurrentView().onbackrequested = event => {
        event.handled = true;
        Windows.UI.Core.SystemNavigationManager.getForCurrentView().appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
        Windows.UI.Core.SystemNavigationManager.getForCurrentView().onbackrequested = "";
        openDirectory();
    }

    const chat = conn.chats.dict[jid];
    addressee.innerHTML = chat.name;
    address.value = jid;
    messages.innerHTML = "";

    directory.classList.add("hidden");
    conversation.classList.remove("hidden");

    let envelopes = chat.messages.array;
    if (envelopes.length < 2) {
        envelopes = (await conn.loadMessages(jid, 20)).messages;
    }

    if (address.value === jid) {
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
                } else if (message.imageMessage || message.videoMessage ) {
                    const content = message.imageMessage || message.videoMessage;
                    const img = document.createElement("img");
                    img.src = URL.createObjectURL(new Blob([content.jpegThumbnail], { type: 'image/png' }));
                    img.id = envelope.key.id;
                    div.appendChild(img);
                    div.addEventListener("click", () => loadImage(envelope));
                    div.innerHTML += content.caption ? "\n" + content.caption : "";
                } else if (message.audioMessage || message.documentMessage) {
                    div.innerHTML += "Attachment";
                } else {
                    div.innerHTML += "Unkown message type!"
                }
                div.innerHTML += "\n<i>" + (new Date(envelope.messageTimestamp.low * 1000)).toLocaleString() + "</i";
                div.classList.add("message");
                messages.appendChild(div);
            }
        });
        messages.scrollTop = messages.scrollHeight
        conn.chatRead(jid);
    }
}

function sendMessage() {
    conn.sendMessage(address.value, letter.value, MessageType.text);
    letter.value = "";
}

async function loadImage(envelope) {
    const buffer = await conn.downloadMediaMessage(envelope);
    const img = document.getElementById(envelope.key.id);
    img.src = URL.createObjectURL(new Blob([Uint8Array.from(buffer)], { type: 'image/png' }));
    img.style.width = "100%";
}

let conn;
let pair;
let directory, sender, status, contacts;
let conversation, addressee, messages, letter, address, send;
window.onload = () => {
    conn = new WAConnection();

    pair = document.getElementById("pair");

    directory = document.getElementById("directory");
    sender = document.getElementById("sender");
    status = document.getElementById("status");
    contacts = document.getElementById("contacts");

    conversation = document.getElementById("conversation");
    addressee = document.getElementById("addressee");
    messages = document.getElementById("messages");
    letter = document.getElementById("letter");
    address = document.getElementById("address");
    send = document.getElementById("send");

    connectToWhatsApp(conn);

    send.addEventListener("click", sendMessage);
}
