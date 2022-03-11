"use strict";

require("finally-polyfill");
window.Buffer = require("buffer").Buffer;
window.process = require("process");

const baileys = require("@adiwajshing/baileys/lib");
const QR = require("qrcode-terminal/lib/main");
const fs = require("fs");
const P  = require("pino").default();

async function connectToWhatsApp() {
    await fs.prepareFileAsync('auth_info_multi.json');
    const authState = baileys.useSingleFileAuthState('auth_info_multi.json');
    state = authState.state;
    saveState = authState.saveState;

    await fs.prepareFileAsync('baileys_store_multi.json');
    store = baileys.makeInMemoryStore({ logger: P.child() });
    store.readFromFile('baileys_store_multi.json');
    setInterval(() => store.writeToFile('baileys_store_multi.json'), 10000);

    startSock();

    openDirectory();
}

async function startSock() {
    sock = baileys.default({ auth: state });
    store.bind(sock.ev);
    
    sock.ev.on("connection.update", update => {
        console.log(update);
        switch (update.connection) {
            case "close":
                status.className = "red";

                const error = update.lastDisconnect.error;
                if (error.output && error.output.statusCode !== baileys.DisconnectReason.loggedOut) {
                    startSock();
                }

                break;
            case "connecting":
                status.className = "orange";
                break;
            case "open":
                status.className = "green";
                break;
        }
        if (update.qr) {
            QR.generate(update.qr, { small: true }, qrcode => pair.innerHTML = qrcode);
            pair.classList.remove("hidden");
            directory.classList.add("hidden");
        }
    });

    sock.ev.on("creds.update", saveState);
}

function loadDirectory() {
    sender.innerHTML = sock.user.name;
    contacts.innerHTML = "";
    store.chats.array.forEach(chat => {
        const div = document.createElement("div");
        div.addEventListener("click", () => openConversation(chat.id));
        if (chat.unreadCount > 0) {
            div.innerHTML = "<b>" + (chat.name || chat.id) + "</b>";
        } else {
            div.innerHTML = chat.name || chat.id;
        }
        div.classList.add("contact");
        contacts.appendChild(div);
    });
}

function openDirectory() {
    loadDirectory();

    directory.classList.remove("hidden");
    pair.classList.add("hidden");
    conversation.classList.add("hidden");
}

function loadConversation(id) {
    if (address.value === id) {
        addressee.innerHTML = store.chats.dict[id].name || store.chats.dict[id].id;
        messages.innerHTML = "";

        let envelopes = store.messages[id].array;
        envelopes.forEach(envelope => {
            const message = envelope.message;
            if (message) {
                const div = document.createElement("div");
                if (envelope.key.fromMe) {
                    div.classList.add("right");
                    div.innerHTML = "<b>" + sock.user.name + "</b>\n";
                } else {
                    div.classList.add("left");
                    div.innerHTML = "<b>" + envelope.pushName + "</b>\n";
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
                    img.src = URL.createObjectURL(new Blob([content.jpegThumbnail], { type: "image/png" }));
                    img.id = envelope.key.id;
                    div.appendChild(img);
                    //div.addEventListener("click", () => loadImage(envelope));
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
            sock.sendReadReceipt(envelope.key.remoteJid, envelope.key.participant, [envelope.key.id]);
        });
        messages.scrollTop = messages.scrollHeight
    }
}

function openConversation(id) {
    address.value = id;

    loadConversation(id);

    Windows.UI.Core.SystemNavigationManager.getForCurrentView().appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.visible;
    Windows.UI.Core.SystemNavigationManager.getForCurrentView().onbackrequested = event => {
        event.handled = true;
        Windows.UI.Core.SystemNavigationManager.getForCurrentView().appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
        Windows.UI.Core.SystemNavigationManager.getForCurrentView().onbackrequested = "";
        openDirectory();
    }

    directory.classList.add("hidden");
    conversation.classList.remove("hidden");
}

function sendMessage() {
    if (letter.value) {
        sock.sendMessage(address.value, { text: letter.value });
        letter.value = "";
    }
}

async function loadImage(envelope) {
    const buffer = await sock.downloadMediaMessage(envelope);
    const img = document.getElementById(envelope.key.id);
    img.src = URL.createObjectURL(new Blob([Uint8Array.from(buffer)], { type: "image/png" }));
    img.style.width = "100%";
}

let sock, state, saveState, store;
let pair;
let directory, sender, status, contacts;
let conversation, addressee, messages, letter, address, send;
window.onload = () => {
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

    connectToWhatsApp();

    send.addEventListener("click", sendMessage);
}
