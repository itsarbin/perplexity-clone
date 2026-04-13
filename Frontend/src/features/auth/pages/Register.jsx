import { useState } from 'react'
import { Link } from 'react-router'

const Register = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02080b] px-6 py-10 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(26,129,142,0.35),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(26,129,142,0.18),_transparent_30%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden flex-col justify-between bg-[#07161a] p-10 lg:flex">
            <div>
              <span className="inline-flex rounded-full border border-[#1a818e]/30 bg-[#1a818e]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#76d4df]">
                Ask smarter
              </span>
              <h1 className="mt-6 max-w-sm text-4xl font-semibold leading-tight text-white">
                Create your account and explore answers with your Perplexity clone.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
                Sign up to search the web, discover cited responses, and get a fast
                AI-powered experience in one focused workspace.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <p className="text-sm leading-7 text-slate-300">
                Search with clarity, discover grounded answers, and bring everything
                together in a clean AI search experience from the very first click.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-10 lg:p-12">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#76d4df]">
                  Register
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white">
                  Build your profile
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Enter your details below to create a new account.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    Email
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-[#081115] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#1a818e] focus:ring-2 focus:ring-[#1a818e]/30"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    Username
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="yourname"
                    className="w-full rounded-2xl border border-white/10 bg-[#081115] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#1a818e] focus:ring-2 focus:ring-[#1a818e]/30"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    Password
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a strong password"
                    className="w-full rounded-2xl border border-white/10 bg-[#081115] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#1a818e] focus:ring-2 focus:ring-[#1a818e]/30"
                  />
                </label>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[#1a818e] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#146a74] focus:outline-none focus:ring-2 focus:ring-[#1a818e]/40 focus:ring-offset-2 focus:ring-offset-[#02080b]"
                >
                  Create account
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-[#76d4df] transition hover:text-[#a1ebf1]"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Register
