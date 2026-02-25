import {useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../../shared/api/client.ts";
import type {components} from "../../../../shared/api/schema.ts";
type CreatePlaylistRequestPayload = components['schemas']['CreatePlaylistRequestPayload']

export const AddPlaylistForm = () => {
    const {register, handleSubmit} = useForm<CreatePlaylistRequestPayload>()

    const queryClient = useQueryClient()

    const {mutate} = useMutation({
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
                queryKey: ["playlists"],
                refetchType: 'all'
            })
        }
    })

    const onSubmit = (data: CreatePlaylistRequestPayload) => {
        mutate(data)
    }

    return <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Add New Playlist</h2>
        <p>
            <input {...register('data.attributes.title')}/>
        </p>
        <p>
            <textarea {...register('data.attributes.description')}></textarea>
        </p>
        <button type={'submit'}>Create</button>
    </form>
}