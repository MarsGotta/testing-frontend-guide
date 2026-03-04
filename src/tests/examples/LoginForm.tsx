import { useState, type FormEvent } from 'react'

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => Promise<void>
}

interface FieldErrors {
  email?: string
  password?: string
}

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {}
  if (!email) {
    errors.email = 'El email es obligatorio'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'El email no es válido'
  }
  if (!password) {
    errors.password = 'La contraseña es obligatoria'
  } else if (password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
  }
  return errors
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [serverError, setServerError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const fieldErrors = validate(email, password)
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length > 0) return

    setStatus('loading')
    setServerError(null)
    try {
      await onSubmit({ email, password })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setServerError(err instanceof Error ? err.message : 'Error desconocido')
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Formulario de inicio de sesión">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          autoComplete="email"
        />
        {errors.email && (
          <span id="email-error" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          autoComplete="current-password"
        />
        {errors.password && (
          <span id="password-error" role="alert">
            {errors.password}
          </span>
        )}
      </div>

      {serverError && (
        <div role="alert" aria-live="assertive">
          {serverError}
        </div>
      )}

      {status === 'success' && (
        <div role="status" aria-live="polite">
          ¡Sesión iniciada correctamente!
        </div>
      )}

      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Iniciando sesión…' : 'Iniciar sesión'}
      </button>
    </form>
  )
}
