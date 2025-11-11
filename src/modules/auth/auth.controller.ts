import { Request, Response } from 'express'
import crypto from 'node:crypto'
import {
  getGoogleAuthUrl,
  handleGoogleAuthCallback,
} from '@modules/auth/auth.service'
import { AuthError } from '@errors/AuthError'
import { successResponse } from '@utils/response'

// sign in with google
export async function googleAuth(req: Request, res: Response) {
  // make a random state for csrf protection
  const state = crypto.randomBytes(16).toString('hex')
  // console.log('state from google auth', state)

  // store the state in a cookie
  res.cookie('oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 5 * 60 * 1000,
  })

  // call auth service to get the redirect url
  const redirectUrl = await getGoogleAuthUrl(state)

  // redirect to callback
  return res.redirect(redirectUrl)
}

// callback on successful sign up/in
export async function googleAuthCallback(req: Request, res: Response) {
  const code = req.query.code as string
  const state = req.query.state as string
  const storedState = req.cookies.oauth_state as string
  // console.log('storedState from googleAuthCallback', storedState)

  // no code or state
  if (!code || !state) {
    throw new AuthError('Missing authorization code or state', 400)
  }

  // states didnt match
  if (state !== storedState) {
    throw new AuthError('Invalid state parameter', 403)
  }

  // clear the cookie
  res.clearCookie('oauth_state')

  // create/log in user, get tokens and user data from auth service
  const { accessToken, refreshToken, user } =
    await handleGoogleAuthCallback(code)

  // store refresh token in cookie for 7 days
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  return successResponse(res, { accessToken, user }, 'Login successfull!')
}
