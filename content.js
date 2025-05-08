// The position of the button is all based on a version of Discord app where the
// title bar structure is like this:
//  <div data-windows="false" class="bar_*" ...>//
//      <div class="title_*">
//          <div class="title_*">
//              <div class="icon_* guildIcon__*" ...>
//                  ... </div>
//              <div ...>
//                  ...</div>
//          </div>
//      </div>
//      <div class="leading_*"></div>
//      <div class="trailing_*">
//          ...
//      </div>
//  </div>
// So if the structure changes, the selecting method will need to change.
function injectButton() {
    // Find the element with "guildIcon_*" unique selector
    const guildIcon = document.querySelector('[class*="guildIcon_"]');
    if (!guildIcon) return;

    // Go up to the correct title bar ancestor
    const bar = guildIcon.closest('[class*="bar_"]');
    if (!bar || bar.querySelector('.mark-read-btn')) return;
    
    // Find the trailing section where buttons like Inbox/Help are placed
    const trailing = bar.querySelector('.trailing_c38106');
    if (!trailing || trailing.querySelector('#mark-as-read-btn')) return; // Avoid duplicates

    // Create the button
    const btn = document.createElement('button');
    btn.textContent = 'Mark as Read';
    btn.className = 'mark-read-btn';
    btn.style = `
        margin-left: 10px;
        padding: 4px 8px;
        background-color: #5865F2;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
    `;

    btn.onclick = () => {
        const ev = new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27, // Add keyCode
            charCode: 0,  // Add charCode (often 0 for non-character keys)
            which: 27,     // Add which (often the same as keyCode)
            shiftKey: true,
            bubbles: true,
            cancelable: true
        });
        document.body.dispatchEvent(ev);
    };

    // Append the button at the start of the "trailing" group
    trailing.appendChild(btn);
}

// Observe for navigation changes
const observer = new MutationObserver(injectButton);
observer.observe(document.body, { childList: true, subtree: true });

injectButton();