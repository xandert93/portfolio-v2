'use client'

import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({
    name: '',
    email: '',
    projectType: '',
    message: '',
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('Request failed')

      setStatus('success')
      setForm({ name: '', email: '', projectType: '', message: '' })
    } catch (err) {
      setStatus('error')
    }
  }

  if (status !== 'success')
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label
            htmlFor="name"
            className="text-2xs text-muted mb-2 block tracking-widest uppercase"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className="border-faint bg-paper text-ink focus:border-accent w-full rounded-md border px-4 py-3 text-sm transition-colors focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="text-2xs text-muted mb-2 block tracking-widest uppercase"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="border-faint bg-paper text-ink focus:border-accent w-full rounded-md border px-4 py-3 text-sm transition-colors focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="projectType"
            className="text-2xs text-muted mb-2 block tracking-widest uppercase"
          >
            Project type
          </label>
          <select
            id="projectType"
            name="projectType"
            value={form.projectType}
            onChange={handleChange}
            className="border-faint bg-paper text-ink focus:border-accent w-full rounded-md border px-4 py-3 text-sm transition-colors focus:outline-none"
          >
            <option value="">Select one</option>
            <option value="New website">New website</option>
            <option value="Existing site update">Existing site update</option>
            <option value="Freelance enquiry">Freelance enquiry</option>
            <option value="Job opportunity">Job opportunity</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="text-2xs text-muted mb-2 block tracking-widest uppercase"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            value={form.message}
            onChange={handleChange}
            className="border-faint bg-paper text-ink focus:border-accent w-full resize-none rounded-md border px-4 py-3 text-sm transition-colors focus:outline-none"
          />
        </div>

        {status === 'error' && (
          <p className="text-sm text-red-600">
            Something went wrong — please try again or email me directly.
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="text-2xs bg-ink text-paper rounded px-7 py-3.5 tracking-widest uppercase transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {status === 'submitting' ? 'Sending...' : 'Send message'}
        </button>
      </form>
    )
  else
    return (
      <div className="border-faint bg-accent-light rounded-lg border p-8 text-center">
        <p className="text-ink mb-2 font-serif text-2xl">Message sent</p>
        <p className="text-muted text-sm font-light">
          Thanks for reaching out — I'll get back to you soon.
        </p>
      </div>
    )
}
