/**
 * OAuth type definitions.
 */

export type SubscriptionType = 'pro' | 'max' | 'enterprise' | 'team' | null

export type RateLimitTier = string | null

export type BillingType = string | null

export interface OAuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
  scopes: string[]
  subscriptionType: SubscriptionType
  rateLimitTier: RateLimitTier
  profile?: OAuthProfileResponse
  tokenAccount?: {
    uuid: string
    emailAddress: string
    organizationUuid?: string
  }
}

export interface OAuthTokenExchangeResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  scope?: string
  account?: {
    uuid: string
    email_address: string
  }
  organization?: {
    uuid: string
  }
}

export interface OAuthProfileResponse {
  account?: {
    display_name?: string
    created_at?: string
  }
  organization?: {
    organization_type?: string
    rate_limit_tier?: string | null
    has_extra_usage_enabled?: boolean | null
    billing_type?: string | null
  }
}

export interface UserRolesResponse {
  roles?: string[]
}

export interface ReferrerRewardInfo {
  currency: string
  amount_minor_units: number
}

export interface ReferralRedemptionsResponse {
  redemptions?: Array<{
    redeemer?: {
      display_name?: string
    }
    created_at?: string
  }>
}

export interface ReferralEligibilityResponse {
  eligible: boolean
  remaining_passes?: number
  referrer_reward?: ReferrerRewardInfo | null
}
