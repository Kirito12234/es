import { useEffect, useState } from 'react'
import { apiRequest, clearToken, getToken, setToken } from '../utils/api.js'
import AuthContext from './auth-context.js'

const splitName = (name = '') => {
  const segments = name.trim().split(/\s+/).filter(Boolean)

  return {
    firstName: segments[0] ?? '',
    lastName: segments.slice(1).join(' '),
  }
}

const normalizeApiUser = (apiUser = {}) => {
  const parsedName = splitName(apiUser.name)
  const address = apiUser.address || {}

  return {
    id: apiUser._id,
    _id: apiUser._id,
    name: apiUser.name || apiUser.email || 'Customer',
    firstName: parsedName.firstName,
    lastName: parsedName.lastName,
    email: apiUser.email || '',
    phone: apiUser.phone || '',
    role: apiUser.role === 'customer' ? 'buyer' : apiUser.role || 'buyer',
    avatar: apiUser.avatar || '',
    address: address.street || '',
    city: address.city || '',
    state: address.state || '',
    postalCode: address.postalCode || '',
    country: address.country || '',
    companyName: '',
    apartment: '',
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthReady, setIsAuthReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      if (!getToken()) {
        setIsAuthReady(true)
        return
      }

      try {
        const profile = await apiRequest('/auth/profile')
        if (isMounted) setUser(normalizeApiUser(profile))
      } catch {
        clearToken()
      } finally {
        if (isMounted) setIsAuthReady(true)
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [])

  const signUp = async ({ name, email, password, role }) => {
    try {
      const result = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      })

      const nextUser = normalizeApiUser(result.user)
      clearToken()
      setUser(null)

      return { success: true, user: nextUser }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Account could not be created.',
      }
    }
  }

  const login = async ({ email, password }) => {
    try {
      const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      setToken(result.token)
      const nextUser = normalizeApiUser(result.user)
      setUser(nextUser)

      return { success: true, user: nextUser }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed.',
      }
    }
  }

  const updateAccount = async ({
    firstName,
    lastName,
    email,
    address,
    city,
    phone,
    companyName,
    apartment,
    newPassword = '',
  }) => {
    if (!user) {
      return { success: false, message: 'You need to log in first.' }
    }

    try {
      const name = [firstName, lastName].filter(Boolean).join(' ').trim() || user.name
      const result = await apiRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name,
          email,
          phone,
          password: newPassword.trim() || undefined,
          address: {
            street: address,
            city,
            state: user.state || '',
            postalCode: user.postalCode || '',
            country: user.country || '',
          },
        }),
      })

      if (result.token) setToken(result.token)
      const nextUser = {
        ...normalizeApiUser(result.user),
        companyName: companyName?.trim() || '',
        apartment: apartment?.trim() || '',
      }
      setUser(nextUser)

      return { success: true, user: nextUser }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Account could not be updated.',
      }
    }
  }

  const saveBillingDetails = async ({
    firstName,
    emailAddress,
    streetAddress,
    townCity,
    phoneNumber,
    companyName,
    apartment,
  }) => {
    return updateAccount({
      firstName: firstName || user?.firstName || '',
      lastName: user?.lastName || '',
      email: emailAddress || user?.email || '',
      address: streetAddress || user?.address || '',
      city: townCity || user?.city || '',
      phone: phoneNumber || user?.phone || '',
      companyName: companyName || user?.companyName || '',
      apartment: apartment || user?.apartment || '',
    })
  }

  const logout = () => {
    clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthReady,
        isAuthenticated: Boolean(user),
        isBuyer: user?.role === 'buyer',
        isSeller: user?.role === 'seller' || user?.role === 'admin',
        signUp,
        login,
        updateAccount,
        saveBillingDetails,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
