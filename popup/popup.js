const statusEl = document.getElementById('status');
const btn = document.getElementById('doThing');

btn.addEventListener('click', async () => {
  statusEl.textContent = 'Working...';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      statusEl.textContent = 'No active tab.';
      return;
    }
    statusEl.textContent = `${tab.title || '(no title)'}\n${tab.url || ''}`;
  } catch (err) {
    statusEl.textContent = `Error: ${err.message}`;
  }
});
