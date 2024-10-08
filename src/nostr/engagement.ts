import { subDays } from "date-fns";
import { getNdk } from ".";
import { nip19 } from "nostr-tools";
import { NDKFilter } from "@nostr-dev-kit/ndk";

export async function getEvents(npubs: string[], days = 7) {
  const ndk = await getNdk();

  const hexDataList = npubs.map((npub) => nip19.decode(npub));
  const hexResultList = hexDataList.filter((hex) => hex.type == "npub");

  const hexList = hexResultList.map((h) => h.data);

  const since = Math.floor(subDays(new Date(), days).getTime() / 1000);

  const filter: NDKFilter = { authors: hexList, since, kinds: [1, 7] };

  return ndk.fetchEvents(filter);
}

export async function getFollowList(
  npub: string
): Promise<{ follows: string[]; name?: string }> {
  const ndk = await getNdk();

  const user = ndk.getUser({
    npub,
  });

  const followlist = await user.follows();

  const profile = await user.fetchProfile();

  return { follows: [...followlist].map((u) => u.npub), name: profile?.name };
}
