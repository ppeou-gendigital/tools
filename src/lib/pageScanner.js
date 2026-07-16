// Self-contained page-context scanner. Injected verbatim into the
// active tab via chrome.scripting.executeScript({ func }), so this
// function CANNOT import anything, reference module state, or close
// over app variables — it's serialized and re-parsed inside the
// target page. Everything it needs (helpers, constants) must live
// inside its own body.
//
// Returns { username: string, password: string, docTitle: string }
// or null if no plausible login form was found. Never throws — an
// invisible-catch pattern keeps errors from bubbling into
// executeScript and turning into opaque "script error" messages.
//
// Supports classic email+password forms and email-first / two-step
// flows (username only on step 1; password empty until the next step).
export function scanPageForCredentials() {
  try {
    function isVisible(el) {
      if (!el) return false
      if (el.disabled) return false
      if (el.type === 'hidden') return false
      // offsetParent is null for display:none subtrees and detached
      // nodes. Fixed elements have null offsetParent too, but the
      // rects.length check below covers those.
      if (el.offsetParent === null) {
        const rects = el.getClientRects()
        if (rects.length === 0) return false
      }
      const style = window.getComputedStyle(el)
      if (style.visibility === 'hidden' || style.display === 'none') return false
      return true
    }

    function rankPassword(el) {
      const ac = (el.getAttribute('autocomplete') || '').toLowerCase()
      if (ac === 'current-password') return 0
      if (ac === 'new-password') return 1
      return 2
    }

    function isUsernameCandidate(el) {
      if (!el || el.tagName !== 'INPUT') return false
      if (el.disabled || el.type === 'hidden') return false
      const type = (el.type || '').toLowerCase()
      const ac = (el.getAttribute('autocomplete') || '').toLowerCase()
      if (ac === 'username' || ac === 'email') return true
      if (type === 'email' || type === 'tel') return true
      if (type === 'text' || type === '') return true
      return false
    }

    // Stricter than isUsernameCandidate — used for email-first pages
    // where there is no password field to anchor on. Bare type=text
    // would match search boxes; require email/username signals.
    function isStrongUsernameCandidate(el) {
      if (!el || el.tagName !== 'INPUT') return false
      if (el.disabled || el.type === 'hidden') return false
      const type = (el.type || '').toLowerCase()
      const ac = (el.getAttribute('autocomplete') || '').toLowerCase()
      if (ac === 'username' || ac === 'email') return true
      if (type === 'email' || type === 'tel') return true
      return false
    }

    function rankUsername(el) {
      const ac = (el.getAttribute('autocomplete') || '').toLowerCase()
      const type = (el.type || '').toLowerCase()
      if (ac === 'username' || ac === 'email') return 0
      if (type === 'email') return 1
      if (type === 'tel') return 2
      return 3
    }

    function findUsernameBefore(passwordEl) {
      let usernameEl = null

      // 1) Same-form scan (Chrome autofill's primary heuristic).
      const form = passwordEl.form
      if (form) {
        const elems = Array.from(form.elements)
        const pwIdx = elems.indexOf(passwordEl)
        for (let i = pwIdx - 1; i >= 0; i--) {
          if (isUsernameCandidate(elems[i]) && isVisible(elems[i])) {
            usernameEl = elems[i]
            break
          }
        }
      }

      // 2) Formless fallback — walk DOM order backwards.
      if (!usernameEl) {
        const allInputs = Array.from(document.querySelectorAll('input'))
        const pwIdx = allInputs.indexOf(passwordEl)
        for (let i = pwIdx - 1; i >= 0; i--) {
          if (isUsernameCandidate(allInputs[i]) && isVisible(allInputs[i])) {
            usernameEl = allInputs[i]
            break
          }
        }
      }

      return usernameEl
    }

    const passwords = Array.from(
      document.querySelectorAll('input[type="password"]'),
    ).filter(isVisible)

    if (passwords.length > 0) {
      passwords.sort((a, b) => rankPassword(a) - rankPassword(b))
      const passwordEl = passwords[0]
      const usernameEl = findUsernameBefore(passwordEl)
      return {
        username: usernameEl?.value ?? '',
        password: passwordEl.value ?? '',
        docTitle: document.title || '',
      }
    }

    // Email-first / two-step: no password yet, but a clear email or
    // username field. Password stays empty for a later capture.
    const usernames = Array.from(document.querySelectorAll('input'))
      .filter((el) => isStrongUsernameCandidate(el) && isVisible(el))
    if (usernames.length === 0) return null

    usernames.sort((a, b) => rankUsername(a) - rankUsername(b))
    const usernameEl = usernames[0]
    return {
      username: usernameEl.value ?? '',
      password: '',
      docTitle: document.title || '',
    }
  } catch {
    return null
  }
}
