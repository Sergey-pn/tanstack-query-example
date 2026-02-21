import {useForm} from "react-hook-form";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../../shared/api/client.ts";
import type {components} from "../../../../shared/api/schema.ts";
type UpdatePlaylistRequestPayload = components['schemas']['UpdatePlaylistRequestPayload']
type Props = {
    playlistId: string
}

export const EditPlaylistForm = ({playlistId}: Props) => {
    const {register, handleSubmit} = useForm<UpdatePlaylistRequestPayload>()

    const {data, isPending, isError} = useQuery({
        queryKey: ["playlists", playlistId],
        queryFn: async () => {
            const response = await client.GET('/playlists/{playlistId}', {params: {path: {playlistId}}})
            return response.data!
        }
    })

    const queryClient = useQueryClient()

    const {mutate} = useMutation({
        mutationFn: async (data: UpdatePlaylistRequestPayload) => {
            data.data.type = 'ppp'
            data.data.attributes.tagIds = []
            const response = await client.PUT("/playlists/{playlistId}", {
                params: {path: {playlistId}},
                body: data
            })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["playlists"],
                refetchType: 'all'
            })
        }
    })

    const onSubmit = (data: UpdatePlaylistRequestPayload) => {
        mutate(data)
    }

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
        <button type={'submit'}>Create</button>
    </form>
}