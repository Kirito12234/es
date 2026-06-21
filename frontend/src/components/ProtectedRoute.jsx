import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

function ProtectedRoute({ children, requestedAction = 'Dashboard', allowedRoles }) {
  const { isAuthReady, isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthReady) {
    return <div className="min-h-screen bg-white" />
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        to="/signup"
        state={{
          from: location.pathname,
          requestedAction,
        }}
      />
    )
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    return <Navigate replace to="/shop" state={{ accessMessage: `${requestedAction} is available to sellers only.` }} />
  }

  return children
}

export default ProtectedRoute
