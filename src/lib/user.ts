interface Attributes {
  email: string;
  sub: string;
}

export interface UserInfo {
  username: string;
  pool: unknown;
  Session: string | null;
  client: unknown;
  signInUserSession: unknown;
  authenticationFlowType: string;
  storage: { cookies: unknown; store: unknown };
  keyPrefix: string;
  userDataKey: string;
  attributes: Attributes;
  preferredMFA: string;
}

export const isUserInfo = (obj: any): obj is UserInfo => {
  return obj && (obj as UserInfo).username !== undefined;
};
