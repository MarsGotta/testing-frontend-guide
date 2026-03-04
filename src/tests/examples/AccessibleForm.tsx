import { useState, type FormEvent } from 'react'

interface AccessibleFormProps {
  onSubmit?: (data: { nombre: string; email: string; mensaje: string }) => void
}

export function AccessibleForm({ onSubmit }: AccessibleFormProps) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit?.({ nombre, email, mensaje })
    setSent(true)
  }

  if (sent) {
    return (
      <div role="status" aria-live="polite">
        ¡Mensaje enviado correctamente!
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Formulario de contacto"
      noValidate
    >
      <fieldset>
        <legend>Datos de contacto</legend>

        <div>
          <label htmlFor="nombre">
            Nombre <span aria-hidden="true">*</span>
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            aria-required="true"
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="email-contacto">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id="email-contacto"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-required="true"
            autoComplete="email"
          />
        </div>
      </fieldset>

      <div>
        <label htmlFor="mensaje">Mensaje</label>
        <textarea
          id="mensaje"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          rows={4}
          aria-describedby="mensaje-hint"
        />
        <p id="mensaje-hint" className="text-sm text-gray-500">
          Máximo 500 caracteres
        </p>
      </div>

      <button type="submit">Enviar mensaje</button>
    </form>
  )
}
