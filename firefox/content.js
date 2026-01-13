// This script injects a custom "Mark as Read" button into the Discord web app's
// server title bar. The DOM structure of this area uses hashed class names, so element
// selection is done via stable semantic substrings rather than full class names.
//
// Current relevant structure is like:
//  ...
//   <div class="*-bar">                     // Title bar container
//     <div class="*-leading"></div>
//     <div class="*-title">
//       <div>
//         <div class="*guildIcon*"></div>   // Server (guild) icon
//         <div>Server Name</div>
//       </div>
//     </div>
//     <div class="*-trailing">              // Right-side action buttons
//       [Checkpoint] [Inbox] [Help] ...
//     </div>
//   </div>
//  ...
// If Discord changes these semantic class suffixes or restructures the title
// bar hierarchy, the selectors and traversal logic will need to be updated.

function injectButton() {
    // Find the guild icon (still the most reliable anchor)
    const guildIcon = document.querySelector('[class*="guildIcon"]');
    if (!guildIcon) return;

    // Find the title bar container
    const bar = guildIcon.closest('[class*="-bar"]');
    if (!bar) return;

    // Avoid injecting multiple times
    if (bar.querySelector('.mark-read-btn')) return;

    // Find the trailing container (Inbox / Help area)
    const trailing = bar.querySelector('[class*="-trailing"]');
    if (!trailing) return;

    // Create the button
    const btn = document.createElement('button');
    btn.textContent = 'Mark as Read';
    btn.className = 'mark-read-btn';

    btn.style.cssText = `
        margin-left: 8px;
        padding: 4px 8px;
        background-color: #5865F2;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        align-self: center;
    `;

    btn.onclick = () => {
        const ev = new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,    // Add keyCode
            which: 27,      // Add which (often the same as keyCode)
            shiftKey: true,
            bubbles: true,
            cancelable: true
        });
        document.body.dispatchEvent(ev);
    };

    // Insert before Help / Inbox buttons
    trailing.prepend(btn);
}

// Observe for navigation changes
const observer = new MutationObserver(injectButton);
observer.observe(document.body, { childList: true, subtree: true });

injectButton();