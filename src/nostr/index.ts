import NDK from "@nostr-dev-kit/ndk";
import "websocket-polyfill";

export async function getNdk() {
  const ndk = new NDK({
    explicitRelayUrls: [
      "wss://nostr.oxtr.dev",
      "wss://nostr.swiss-enigma.ch",
      "wss://nos.lol",
      "wss://nostr.cro.social",
      "wss://relay.nostr.vet",
      "wss://nostr.azzamo.net",
      "wss://relay.primal.net",
      "wss://relay.damus.io",
    ],
    autoConnectUserRelays: true,
  });

  await ndk.connect();

  return ndk;
}
