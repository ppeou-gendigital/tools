// Self-contained page-context filler. Injected verbatim into the
// active tab via chrome.scripting.executeScript({ func, args }), so
// like pageScanner.js this function CANNOT import anything or close
// over app state.
//
// Contract:
//   args:  [{ username: string, password: string }]
//   return { filledUsername, filledPassword, matched }
//     - `filledUsername` / `filledPassword`: whether we found and
//       wrote each field.
//     - `matched`: whether the page looked login-shaped (password
//       field, or email-first username field).
//
// Field detection mirrors pageScanner.js (visible password field
// ranked by autocomplete hint, paired username in same form or
// preceding DOM; email-first fallback when no password) so
// scan-then-fill on the same page targets the same inputs.
//
// The setter dance is the standard "trick" used by every password
// manager: React (and other synthetic-event frameworks) overrides
// the value setter on the input's *instance*, which bypasses their
// change-tracking. Assigning via the *prototype* descriptor and
// then dispatching input/change events makes framework state sync
// correctly.
export function fillPageCredentials({ username, password } = {}) {
  try {
    function isVisible(el) {
      if (!el) return false
      if (el.disabled) return false
      if (el.type === 'hidden') return false
      if (el.readOnly) return false
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
      if (el.disabled || el.type === 'hidden' || el.readOnly) return false
      const type = (el.type || '').toLowerCase()
      const ac = (el.getAttribute('autocomplete') || '').toLowerCase()
      if (ac === 'username' || ac === 'email') return true
      if (type === 'email' || type === 'tel') return true
      if (type === 'text' || type === '') return true
      return false
    }

    function isStrongUsernameCandidate(el) {
      if (!el || el.tagName !== 'INPUT') return false
      if (el.disabled || el.type === 'hidden' || el.readOnly) return false
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

    // React-safe value write. Uses the prototype's native setter to
    // sidestep any framework override installed on the element, then
    // fires input + change so listeners run.
    function writeValue(el, value) {
      const proto =
        el.tagName === 'TEXTAREA'
          ? window.HTMLTextAreaElement.prototype
          : window.HTMLInputElement.prototype
      const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set
      if (setter) {
        setter.call(el, value)
      } else {
        el.value = value
      }
      el.dispatchEvent(new Event('input', { bubbles: true }))
      el.dispatchEvent(new Event('change', { bubbles: true }))
    }

    function findUsernameBefore(passwordEl) {
      let usernameEl = null
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

    let usernameEl = null
    let passwordEl = null

    if (passwords.length > 0) {
      passwords.sort((a, b) => rankPassword(a) - rankPassword(b))
      passwordEl = passwords[0]
      usernameEl = findUsernameBefore(passwordEl)
    } else {
      const usernames = Array.from(document.querySelectorAll('input'))
        .filter((el) => isStrongUsernameCandidate(el) && isVisible(el))
      if (usernames.length === 0) {
        return { matched: false, filledUsername: false, filledPassword: false }
      }
      usernames.sort((a, b) => rankUsername(a) - rankUsername(b))
      usernameEl = usernames[0]
    }

    let filledUsername = false
    let filledPassword = false

    if (usernameEl && typeof username === 'string' && username.length > 0) {
      usernameEl.focus()
      writeValue(usernameEl, username)
      usernameEl.blur()
      filledUsername = true
    }
    if (
      passwordEl &&
      typeof password === 'string' &&
      password.length > 0
    ) {
      passwordEl.focus()
      writeValue(passwordEl, password)
      passwordEl.blur()
      filledPassword = true
    }

    return { matched: true, filledUsername, filledPassword }
  } catch {
    return { matched: false, filledUsername: false, filledPassword: false }
  }
}
