export default async function FetchResource(url, responseType = "json", options = {}) {
    const res = await fetch(url, options);

    if(!res.ok) throw new Error(`[Network Error] Couldn't get a response from ${url}. Status: ${res.status}`);

    switch(responseType) {
        case "blob":
            return res.blob();
        case "text":
            return res.text();
        case "arrayBuffer":
            return res.arrayBuffer();
        default:
            return res.json();
    }
}