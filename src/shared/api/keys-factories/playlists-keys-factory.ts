import type {components} from "../schema.ts";

type CreatePlaylistRequestPayload = components['schemas']['CreatePlaylistRequestPayload']

export const playlistsKeys = {
    all: ['playlists'],
      lists: () => [...playlistsKeys.all, 'lists'],
        myList: () => [...playlistsKeys.lists(), 'my'],
        list: (filters: Partial<CreatePlaylistRequestPayload>) => [...playlistsKeys.lists(), filters],
      details: () => [...playlistsKeys.all],
        detail: (id: string) => [...playlistsKeys.details(), id],
}