import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { getProtectedNavigation } from '../utils/routes.js'

const variantClasses = {
  button:
    'inline-flex items-center justify-center gap-2 bg-brand px-8 py-3 text-sm font-medium text-white transition hover:bg-brand-dark',
  icon: 'inline-flex h-8 w-8 items-center justify-center text-black transition hover:text-brand',
  pill:
    'inline-flex items-center justify-center gap-2 border border-black/20 px-4 py-3 text-xs font-medium uppercase tracking-[0.08em] text-black transition hover:border-brand hover:bg-brand hover:text-white',
  card: 'group block border border-black/10 bg-white p-5 transition hover:border-brand',
}

function ProtectedActionLink({
  actionKey,
  icon: Icon,
  label,
  description = '',
  variant = 'button',
  className = '',
}) {
  const { isAuthenticated } = useAuth()
  const navigation = getProtectedNavigation({
    actionKey,
    isAuthenticated,
    label,
    authenticatedState: {
      actionKey,
      title: label,
    },
  })

  const classes = `${variantClasses[variant] ?? variantClasses.button} ${className}`.trim()

  if (variant === 'icon') {
    return (
      <Link
        aria-label={label}
        className={classes}
        state={navigation.state}
        to={navigation.to}
      >
        {Icon ? <Icon className="h-5 w-5" aria-hidden="true" /> : null}
      </Link>
    )
  }

  return (
    <Link className={classes} state={navigation.state} to={navigation.to}>
      {variant === 'card' ? (
        <>
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand">
              {Icon ? <Icon className="h-5 w-5" aria-hidden="true" /> : null}
            </div>
            <h3 className="text-sm font-semibold text-black">{label}</h3>
          </div>
          <div className="mt-4">
            <p className="text-sm leading-6 text-black/60">{description}</p>
          </div>
        </>
      ) : (
        <>
          {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
          <span>{label}</span>
        </>
      )}
    </Link>
  )
}

export default ProtectedActionLink
