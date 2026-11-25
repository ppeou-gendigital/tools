// Terminal prompts for `setup`. Prompts go to stderr so a `--json` stdout stays
// one clean document. The hidden variant reads through a sink, which is the
// same trick `auth set` uses to take a PAT without echo.

import { Writable } from 'node:stream'
import { createInterface } from 'node:readline/promises'

export function createPrompter({
  input = process.stdin,
  output = process.stderr,
} = {}) {
  async function read(promptText, { hidden = false } = {}) {
    // A fresh interface per question: closing it afterwards leaves stdin open
    // for the next prompt and for whatever the command does next.
    const sink = new Writable({
      write(_chunk, _encoding, callback) {
        callback()
      },
    })
    const rl = createInterface({
      input,
      output: hidden ? sink : output,
      terminal: true,
    })

    try {
      if (!hidden) {
        return String((await rl.question(promptText)) ?? '').trim()
      }
      output.write(promptText)
      const answer = await rl.question('')
      output.write('\n')
      return String(answer ?? '').trim()
    } finally {
      rl.close()
      sink.end()
    }
  }

  return {
    async ask(label, { defaultValue = '' } = {}) {
      const suffix = defaultValue ? ` [${defaultValue}]` : ''
      return (await read(`${label}${suffix}: `)) || defaultValue
    },

    async askHidden(label) {
      return read(`${label}: `, { hidden: true })
    },

    async confirm(label, { defaultValue = true } = {}) {
      const suffix = defaultValue ? ' [Y/n]' : ' [y/N]'
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const answer = (await read(`${label}${suffix}: `)).toLowerCase()
        if (!answer) return defaultValue
        if (answer === 'y' || answer === 'yes') return true
        if (answer === 'n' || answer === 'no') return false
        output.write('Please answer y or n.\n')
      }
      return defaultValue
    },
  }
}
