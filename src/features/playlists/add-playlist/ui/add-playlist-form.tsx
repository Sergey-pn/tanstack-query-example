import {useForm} from "react-hook-form";
import type {components} from "../../../../shared/api/schema.ts";
import {useAddPlaylistMutation} from "../api/use-add-playlist-mutation.ts";
type CreatePlaylistRequestPayload = components['schemas']['CreatePlaylistRequestPayload']

export const AddPlaylistForm = () => {
    const {register, handleSubmit} = useForm<CreatePlaylistRequestPayload>()

    const {mutate} = useAddPlaylistMutation()

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