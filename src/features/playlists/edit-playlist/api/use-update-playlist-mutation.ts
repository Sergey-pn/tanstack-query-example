import {client} from "../../../../shared/api/client.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {playlistsKeys} from "../../../../shared/api/keys-factories/playlists-keys-factory.ts";
import type {components} from "../../../../shared/api/schema.ts";
import type {JsonApiErrorDocument} from "../../../../shared/util/json-api-error.ts";
type UpdatePlaylistRequestPayload = components['schemas']['UpdatePlaylistRequestPayload']
type GetPlaylistsOutput = components['schemas']['GetPlaylistsOutput']

type MutationVariables = UpdatePlaylistRequestPayload & {playlistId: string}

export const useUpdatePlaylistMutation = ({onSuccess, onError}: {
    onSuccess?: () => void
    onError?: (error: JsonApiErrorDocument) => void
}) => {
    const queryClient = useQueryClient()

    const key = playlistsKeys.myList()

    return useMutation({
        mutationFn: async (variables: MutationVariables) => {
            const {playlistId, ...rest} = variables
            const response = await client.PUT("/playlists/{playlistId}", {
                params: {path: {playlistId: playlistId}},
                body: {
                    ...rest,
                    data: {
                        ...rest.data,
                        type: 'playlist',
                        attributes: {
                            ...rest.data.attributes,
                            tagIds: []
                        }
                    }
                }
            })
            return response.data
        },
        onMutate: async (variables: MutationVariables) => {
            // Cancel any outgoing refetches
            // (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: playlistsKeys.all })
            // Snapshot the previous value
            const previousMyPlaylists = queryClient.getQueryData(key)
            // Optimistically update to the new value
            queryClient.setQueryData(key, (oldData: GetPlaylistsOutput) => {
                return {
                    ...oldData,
                    data: oldData.data.map(p => {
                        if (p.id === variables.playlistId) return {
                            ...p,
                            attributes: {
                                ...p.attributes,
                                description: variables.data.attributes.description,
                                title: variables.data.attributes.title,
                            }
                        }
                        else return p
                    })
                }
            })
            // Return a result with the previous and new playlist
            return { previousMyPlaylists }
        },
        // If the mutation fails, use the result we returned above
        onError: (error, __: MutationVariables, context) => {
            queryClient.setQueryData(
                key,
                context!.previousMyPlaylists,
            )
            onError?.(error as unknown as JsonApiErrorDocument)
        },
        onSuccess: () => {
            onSuccess?.()
        },
        // Always refetch after error or success:
        onSettled: (_, __, variables: MutationVariables) => {
            queryClient.invalidateQueries({
                queryKey: playlistsKeys.lists(),
                refetchType: 'all'
            })
            queryClient.invalidateQueries({
                queryKey: playlistsKeys.detail(variables.playlistId),
                refetchType: 'all'
            })
        }
    })
}