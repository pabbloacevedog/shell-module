export const setLocalStorage = async (nombre, objeto) => {
    const encodedKey = new TextEncoder().encode(import.meta.env.vite_PASS_LOCAL_STORAGE);
    const hashKey = await crypto.subtle.digest("SHA-256", encodedKey);

    const key = await crypto.subtle.importKey(
        "raw",
        hashKey,
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
    );

    const encodedData = new TextEncoder().encode(JSON.stringify(objeto));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encodedData
    );

    const combinedData = new Uint8Array(iv.byteLength + encryptedData.byteLength);
    combinedData.set(new Uint8Array(iv), 0);
    combinedData.set(new Uint8Array(encryptedData), iv.byteLength);

    const base64String = btoa(String.fromCharCode.apply(null, combinedData));
    localStorage.setItem(nombre, base64String);
}


export const getLocalStorage = async (nombre) => {
    const base64String = localStorage.getItem(nombre);
    if (!base64String) {
        return null;
    }

    const dataArray = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));
    const iv = dataArray.slice(0, 12);
    const encryptedData = dataArray.slice(12);

    const encodedKey = new TextEncoder().encode(import.meta.env.vite_PASS_LOCAL_STORAGE);
    const hashKey = await crypto.subtle.digest("SHA-256", encodedKey);

    const key = await crypto.subtle.importKey(
        "raw",
        hashKey,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
    );

    try {
        const decryptedData = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            encryptedData
        );

        return JSON.parse(new TextDecoder().decode(decryptedData));
    } catch (error) {
        console.error('Decryption failed:', error);
        return null;
    }
}

