import { useState } from 'react'

export const usePasswordFieldState = () => {
  const [isVisible, setIsVisible] = useState(false)
  return {
    inputType: isVisible ? 'text' : 'password',
    toggleIcon: isVisible ? ('eyeOff' as const) : ('eye' as const),
    toggleLabel: isVisible ? 'Hide password' : 'Show password',
    isVisible,
    toggle: () => setIsVisible((visible) => !visible),
  }
}
