import {useEffect} from "react";
import {useForm} from "react-hook-form";
import type {components} from "../../../../shared/api/schema.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../../shared/api/client.ts";
import {useMeQuery} from "../../../auth/api/use-me-query.ts";

type UpdatePlaylistRequestPayload = components['schemas']['UpdatePlaylistRequestPayload']
type GetPlaylistsOutput = components['schemas']['GetPlaylistsOutput']
type Props = {
    playlistId: string | null
}

export const EditPlaylistForm = ({playlistId}: Props) => {
    const {register, handleSubmit, reset} = useForm<UpdatePlaylistRequestPayload>()

    const {data: meData} = useMeQuery()

    useEffect(() => {
        reset()
    }, [playlistId])

    const {data, isPending, isError} = useQuery({
        queryKey: ["playlists", 'details', playlistId],
        queryFn: async () => {
            const response = await client.GET('/playlists/{playlistId}',
                {params: {path: {playlistId: playlistId!}}})
            return response.data!
        },
        enabled: !!playlistId
    })

    const queryClient = useQueryClient()

    const key = ['playlists', 'my', meData!.userId]

    const {mutate} = useMutation({
        mutationFn: async (data: UpdatePlaylistRequestPayload) => {
            // data.data.type = 'ppp'
            // data.data.attributes.tagIds = []
            const response = await client.PUT("/playlists/{playlistId}", {
                params: {path: {playlistId: playlistId!}},
                body: {
                    ...data,
                    data: {
                        ...data.data,
                        type: 'playlist',
                        attributes: {
                            ...data.data.attributes,
                            tagIds: []
                        }
                    }
                }
            })
            return response.data
        },
        onMutate: async (data: UpdatePlaylistRequestPayload) => {
            // Cancel any outgoing refetches
            // (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['playlists'] })

            // Snapshot the previous value
            const previousMyPlaylists = queryClient.getQueryData(key)

            // Optimistically update to the new value
            queryClient.setQueryData(key, (oldData: GetPlaylistsOutput) => {
                return {
                    ...oldData,
                    data: oldData.data.map(p => {
                        if (p.id === playlistId) return {
                            ...p,
                            attributes: {
                                ...p.attributes,
                                description: data.data.attributes.description,
                                title: data.data.attributes.title,
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
        onError: (_, __: UpdatePlaylistRequestPayload, context) => {
            queryClient.setQueryData(
                key,
                context!.previousMyPlaylists,
            )
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["playlists"],
                refetchType: 'all'
            })
        }
    })

    const onSubmit = (data: UpdatePlaylistRequestPayload) => {
        mutate(data)
    }

    if (!playlistId) return <></>
    if (isPending) return <p>Loading...</p>
    if (isError) return <p>Error...</p>

    return <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Edit Playlist</h2>
        <p>
            <input {...register('data.attributes.title')} defaultValue={data.data.attributes.title} />
        </p>
        <p>
            <textarea {...register('data.attributes.description')} defaultValue={data.data.attributes.description!} ></textarea>
        </p>
        <button type={'submit'}>Save</button>
    </form>
}