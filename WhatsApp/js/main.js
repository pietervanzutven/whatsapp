"use strict";

require("allsettled-polyfill");
require("finally-polyfill");
require("flatMap-polyfill");
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
    store = baileys.makeInMemoryStore({ });
    store.readFromFile('baileys_store_multi.json');
    setInterval(() => store.writeToFile('baileys_store_multi.json'), 10000);

    setInterval(startSock, 1000);
}

function startSock() {
    if (!sock || sock.ws.readyState === sock.ws.CLOSED) {
        sock = baileys.default({ auth: state });
        store.bind(sock.ev);
    
        sock.ev.on("connection.update", update => {
            console.log(update);
            switch (update.connection) {
                case "close":
                    status.className = "red";
                    break;
                case "connecting":
                    status.className = "orange";
                    break;
                case "open":
                    status.className = "green";
                    loadDirectory();
                    break;
            }
            if (update.qr) {
                QR.generate(update.qr, { small: true }, qrcode => pair.innerHTML = qrcode);
                pair.classList.remove("hidden");
                directory.classList.add("hidden");
            }
        });

        sock.ev.on("creds.update", saveState);
        sock.ev.on("chats.upsert", () => {
            loadDirectory();
        });
        sock.ev.on("chats.update", chat => {
            loadDirectory();
        });
        sock.ev.on("messages.upsert", upsert => {
            upsert.messages.forEach(message => {
                loadConversation(message.key.remoteJid);
            });
        });
    }
}

function loadDirectory() {
    sender.innerHTML = sock.user.name;
    contacts.innerHTML = "";
    store.chats.array.forEach(chat => {
        const div = document.createElement("div");
        div.addEventListener("click", () => openConversation(chat.id));
        const name = ((store.contacts[chat.id] && store.contacts[chat.id].notify) || chat.id);
        if (chat.unreadCount > 0) {
            div.innerHTML = "<b>" + name + "</b>";
        } else {
            div.innerHTML = name;
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

        let envelopes = store.messages[id].array.slice(-20);
        envelopes = envelopes.sort((envelope1, envelope2) => {
            return (envelope1.messageTimestamp.low || envelope1.messageTimestamp) - (envelope2.messageTimestamp.low || envelope2.messageTimestamp);
        });
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
                } else if (message.imageMessage || message.videoMessage) {
                    const content = message.imageMessage || message.videoMessage;
                    let element;
                    if (content.directPath.includes("ms-appdata")) {
                        element = message.imageMessage ? document.createElement("img") : document.createElement("video");
                        ("controls" in element) && (element.controls = true);
                        element.src = content.directPath;
                        element.style.width = "100%";
                    } else {
                        element = document.createElement("img");
                        element.src = URL.createObjectURL(new Blob([content.jpegThumbnail], { type: "image/png" }));
                        element.id = envelope.key.id;
                        div.addEventListener("click", async () => {
                            await loadAttachment(content);
                            loadConversation(id);
                        });
                    }
                    div.appendChild(element);
                    div.innerHTML += content.caption ? "\n" + content.caption : "";
                } else if (message.audioMessage || message.documentMessage) {
                    div.innerHTML += "Attachment";
                } else {
                    div.innerHTML += "Unkown message type: " + JSON.stringify(message);
                }
                div.innerHTML += "\n<i>" + (new Date((envelope.messageTimestamp.low || envelope.messageTimestamp) * 1000)).toLocaleString() + "</i>";
                div.classList.add("message");
                messages.appendChild(div);
            }
            sock.sendReceipt(envelope.key.remoteJid, envelope.key.participant, [envelope.key.id]);
        });
        store.chats.dict[id].unreadCount = 0;
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

    setTimeout(() => messages.scrollTop = messages.scrollHeight, 10);
}

async function sendMessage() {
    if (letter.value) {
        sock.sendMessage(address.value, { text: letter.value }, { logger: P });
        letter.value = "";
    } else {
        const picker = Windows.Storage.Pickers.FileOpenPicker();
        picker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
        picker.fileTypeFilter.append(".jpg");
        picker.fileTypeFilter.append(".jpeg");
        picker.fileTypeFilter.append(".png");

        const file = await picker.pickSingleFileAsync();
        if (file) {
            let buffer = await Windows.Storage.FileIO.readBufferAsync(file);
            buffer = Buffer.from(new Uint8Array(buffer));
            sock.sendMessage(address.value, { image: buffer, jpegThumbnail: null }, { logger: P });
        }
    }
}

async function loadAttachment(content) {
    const type = content.mimetype.split('/');
    const stream = await baileys.downloadContentFromMessage(content, type[0]);
    let buffer = Buffer.from([]);
    let chunk;
    while (null !== (chunk = stream.read())) {
        buffer = Buffer.concat([buffer, chunk]);
    }

    const fileName = Date.now().toString() + '.' + type[1];
    const file = await Windows.Storage.ApplicationData.current.localFolder.createFileAsync(fileName,Windows.Storage.CreationCollisionOption.replaceExisting);
    await Windows.Storage.FileIO.writeBytesAsync(file, buffer);

    content.directPath = 'ms-appdata:///local/' + fileName;
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
    status.addEventListener("click", startSock);
}
