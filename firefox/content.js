// This content script injects a custom "Mark as Read" button into the Discord
// web app’s server title bar. Discord’s DOM uses module-scoped, hashed class
// names that change across builds, so the script avoids hard-coded selectors
// and instead anchors to stable accessibility attributes.
//
// Current strategy:
// - Anchor to the Inbox button via aria-label="Inbox", which has proven stable
//   across Discord UI refactors.
// - From the Inbox button, locate the enclosing title bar’s trailing action
//   container (class prefix "trailing_").
// - Inject a lightweight button into that container, guarding against
//   duplicate insertion.
//
// Interaction model:
// - Clicking the button simulates Discord’s native "Mark Server as Read"
//   keyboard shortcut (Shift + Escape).
// - The shortcut is dispatched as a realistic key lifecycle (keydown → keyup)
//   on the window object, matching Discord’s state-based shortcut handling.
//
// Notes:
// - Discord is a single-page application; navigation does not reload the page.
//   A MutationObserver is required to re-inject the button on route changes.

function injectButton() {
    // Anchor to inbox button to be a bit more future-proof
    const inboxBtn = document.querySelector('[aria-label="Inbox"]');
    if (!inboxBtn) return;

    // Find the title bar container
    const trailing = inboxBtn.closest('div[class^="trailing_"]');
    if (!trailing || trailing.querySelector('.mark-read-btn')) return;

    const btn = document.createElement('button');
    btn.textContent = 'Mark as Read';
    btn.className = 'mark-read-btn';

    btn.style.cssText = `
        margin-right: 8px;
        padding: 4px 8px;
        background-color: #5865F2;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
    `;

    btn.onclick = () => {
        // Ensure focus is inside the app
        document.body.focus();

        const down = new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            which: 27,
            shiftKey: true,
            bubbles: true,
            cancelable: true
        });

        const up = new KeyboardEvent('keyup', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            which: 27,
            shiftKey: true,
            bubbles: true,
            cancelable: true
        });

        window.dispatchEvent(down);
        window.dispatchEvent(up);
    };

    trailing.prepend(btn);
}

// Observe for navigation changes
const observer = new MutationObserver(injectButton);
observer.observe(document.body, { childList: true, subtree: true });

injectButton();