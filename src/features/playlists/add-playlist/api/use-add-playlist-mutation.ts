import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../../shared/api/client.ts";
import type {components} from "../../../../shared/api/schema.ts";
import {playlistsKeys} from "../../../../shared/api/keys-factories/playlists-keys-factory.ts";

type CreatePlaylistRequestPayload = components['schemas']['CreatePlaylistRequestPayload'];

export const useAddPlaylistMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreatePlaylistRequestPayload) => {
            const response = await client.POST("/playlists", {
                body: {
                    ...data,
                    data: {
                        ...data.data,
                        type: 'playlists'
                    }
                }
            })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: playlistsKeys.lists(),
                refetchType: 'all'
            })
        }
    })
}