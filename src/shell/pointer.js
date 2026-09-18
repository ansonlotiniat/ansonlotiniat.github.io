export default function initPointer({ root }) {
    const pixelCursor = document.querySelector("[data-pixel-cursor]");
    const finePointer = window.matchMedia("(pointer: fine)");

    if (pixelCursor && finePointer.matches) {
        root.classList.add("has-pixel-cursor");

        document.addEventListener(
            "pointermove",
            (event) => {
                if (event.pointerType === "touch") return;
                pixelCursor.style.left = `${event.clientX}px`;
                pixelCursor.style.top = `${event.clientY}px`;
                pixelCursor.classList.add("is-visible");
                const interactiveTarget =
                    event.target instanceof Element
                        ? event.target.closest("button, a, input, [role='tab'], [role='option']")
                        : null;
                pixelCursor.classList.toggle("is-hovering", Boolean(interactiveTarget));
            },
            { passive: true },
        );

        document.addEventListener(
            "pointerdown",
            () => {
                pixelCursor.classList.add("is-pressed");
            },
            { passive: true },
        );
        document.addEventListener(
            "pointerup",
            () => {
                pixelCursor.classList.remove("is-pressed");
            },
            { passive: true },
        );
        document.documentElement.addEventListener("mouseleave", () => {
            pixelCursor.classList.remove("is-visible");
        });
    }

    function reportPointer(frame, message) {
        if (!pixelCursor || !finePointer.matches) return;
        if (message.phase === "leave") {
            pixelCursor.classList.remove("is-visible", "is-pressed", "is-hovering");
            return;
        }

        const frameRect = frame.getBoundingClientRect();
        pixelCursor.style.left = `${frameRect.left + Number(message.x || 0)}px`;
        pixelCursor.style.top = `${frameRect.top + Number(message.y || 0)}px`;
        pixelCursor.classList.add("is-visible");
        pixelCursor.classList.toggle("is-hovering", Boolean(message.interactive));
        pixelCursor.classList.toggle("is-pressed", message.phase === "down");
    }

    return { reportPointer };
}
