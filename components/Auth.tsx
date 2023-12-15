import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (event: any) => {
    event.preventDefault()
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_SERVER_ROLE_KEY as string
    );


    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
        alert(error.message)
    } else {
      alert('Check your email for the login link!')
    }
    setLoading(false)
  }

    return (
        <div className="row flex flex-col items-center p-3">
            <div className="form-widget space-x-3">
                <div className="rounded-lg overflow-hidden">
                    <form className="form-widget" onSubmit={handleLogin}>
                        <div className="flex flex-row">
                            <input
                                className="inputField text-slate-600 px-2 text-center outline-none"
                                type="email"
                                placeholder="Your email"
                                value={email}
                                required={true}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button className={'button block align-center bg-orange-600 px-2 py-1 hover:bg-orange-900'} disabled={loading}>
                                {loading ? <span>Loading</span> : <span>Send magic link -&gt;</span>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
