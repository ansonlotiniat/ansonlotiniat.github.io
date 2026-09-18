/**
 * App controllers mount once per page. Closing a window preserves its state.
 * Hooks are synchronous: open runs before the reveal; close/minimize after hiding;
 * languageChanged runs after the document language changes. The shell sets the
 * initial locale before mounting; controllers render their initial state in mount.
 * The registry owns no App-specific behavior. See knowledge/architecture.md.
 */
export function createAppRegistry(manifest, factories) {
    const mounted = new Map();
    return {
        mountAll(services = {}, documentRoot = document) {
            for (const app of manifest) {
                if (mounted.has(app.id)) continue;
                const root = documentRoot.querySelector(`[data-window="${app.id}"]`);
                const factory = factories[app.id];
                if (!root || typeof factory !== "function") {
                    throw new Error(`App ${app.id} is missing its root or controller`);
                }
                const hooks = factory(Object.freeze({ ...services, root, manifest: app })) || {};
                mounted.set(app.id, hooks);
            }
        },
        notify(id, event) {
            mounted.get(id)?.[event]?.();
        },
        languageChanged() {
            for (const hooks of mounted.values()) hooks.languageChanged?.();
        },
    };
}
