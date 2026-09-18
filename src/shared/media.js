export function mediaImage(url, alt) {
    const image = document.createElement("img");
    image.alt = alt || "";
    image.loading = "lazy";
    image.decoding = "async";
    if (url) {
        image.src = url;
        image.addEventListener("error", () => {
            image.removeAttribute("src");
            image.alt = "";
            image.classList.add("is-placeholder");
        });
    } else {
        image.classList.add("is-placeholder");
    }
    return image;
}
