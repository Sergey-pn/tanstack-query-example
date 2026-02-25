import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../../shared/api/client.ts";
import type {components} from "../../../../shared/api/schema.ts";
import {playlistsKeys} from "../../../../shared/api/keys-factories/playlists-keys-factory.ts";
type GetPlaylistsOutput = components['schemas']['GetPlaylistsOutput']

export const useDeleteMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (playlistId: string) => {
            const response = await client.DELETE('/playlists/{playlistId}', {
                params: {path:{playlistId}}
            })
            return response.data
        },
        onSuccess: (_, playlistId) => {
            queryClient.setQueriesData({queryKey: playlistsKeys.lists()}, (oldData: GetPlaylistsOutput) => {
                return {
                    ...oldData,
                    data: oldData.data.filter((p) => p.id !== playlistId)
                }
            })

            queryClient.setQueryData(playlistsKeys.detail(playlistId), () => {
                return null
            })
        }
    })
}