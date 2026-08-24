import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";
import useServer from "./useServer";
import { ResponseType } from "expo-auth-session/build/AuthRequest.types";

WebBrowser.maybeCompleteAuthSession();

export default function useAuth(onUpdate?: () => void) {
  const { ip, port } = useServer();

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_IOS_ID,
    scopes: ["openid", "profile", "email"],
    responseType: ResponseType.Code,
  });

  async function authenticate(idToken: string) {
    await fetch(`http://${ip}:${port}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idToken,
      }),
    });
    onUpdate?.();
  }

  useEffect(() => {
    if (!response) return;
    if (response.type !== "success") return;
    const idToken = response.params.id_token;
    if (!idToken) return;
    authenticate(idToken);
  }, [response]);

  return {
    ready: !!request,
    login: () => {
      promptAsync();
    },
  };
}
