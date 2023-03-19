// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged, User } from "firebase/auth"
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
export const auth = getAuth(app)

const AuthContext = createContext<{
  isLoading: boolean
  isAuthenticated: boolean
  user: User | null
}>({
  isLoading: true,
  isAuthenticated: false,
  user: null,
})

export function AuthProvider(props: { children: ReactNode; [x: string]: any }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setIsLoading(false)
      setUser(user)

      if (user) setIsAuthenticated(true)
      else setIsAuthenticated(false)
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{ isLoading, isAuthenticated, user }}
      {...props}
    />
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
