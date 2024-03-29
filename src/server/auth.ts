import { getApps, getApp, initializeApp, cert } from "firebase-admin/app"
import { UserRecord, getAuth } from "firebase-admin/auth"
import { GetServerSidePropsContext } from "next"

const {
  FIREBASE_ADMIN_PROJECT_ID,
  FIREBASE_ADMIN_PRIVATE_KEY,
  FIREBASE_ADMIN_CLIENT_EMAIL,
} = process.env

if (!FIREBASE_ADMIN_PROJECT_ID)
  throw new Error("Missing or invalid Firebase Admin project ID")

if (!FIREBASE_ADMIN_PRIVATE_KEY)
  throw new Error("Missing or invalid Firebase Admin private key")

if (!FIREBASE_ADMIN_CLIENT_EMAIL)
  throw new Error("Missing or invalid Firebase Admin client email")

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert({
          projectId: FIREBASE_ADMIN_PROJECT_ID,
          privateKey: FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
          clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
        }),
      })
    : getApp()

const auth = getAuth(app)

export async function updateProfile(
  user: UserRecord,
  {
    displayName,
    photoURL,
  }: {
    displayName?: string | null
    photoURL?: string | null
  }
) {
  await auth.updateUser(user.uid, {
    displayName,
    photoURL,
  })
}

export async function getServerSession({
  req,
}: {
  req: GetServerSidePropsContext["req"]
  res: GetServerSidePropsContext["res"]
}) {
  const { authorization } = req.headers
  if (!authorization) return null

  try {
    const idToken = authorization.split(" ")[1]
    const token = await auth.verifyIdToken(idToken)
    const user = await auth.getUser(token.uid)

    return {
      user,
      token,
    }
  } catch {
    // If verification fails, then we have no session.
    return null
  }
}
