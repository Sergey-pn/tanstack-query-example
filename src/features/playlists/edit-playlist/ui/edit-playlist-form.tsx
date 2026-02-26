import {useEffect} from "react";
import {useForm} from "react-hook-form";
import type {components} from "../../../../shared/api/schema.ts";
import {usePlaylistQuery} from "../api/use-playlist-query.ts";
import {useUpdatePlaylistMutation} from "../api/use-update-playlist-mutation.ts";

type UpdatePlaylistRequestPayload = components['schemas']['UpdatePlaylistRequestPayload']
type Props = {
    playlistId: string | null
    onCancelEditing: () => void
}

export const EditPlaylistForm = ({playlistId, onCancelEditing}: Props) => {
    const {register, handleSubmit, reset} = useForm<UpdatePlaylistRequestPayload>()

    useEffect(() => {
        reset()
    }, [playlistId])

    const {data, isPending, isError} = usePlaylistQuery(playlistId)

    const {mutate} = useUpdatePlaylistMutation()

    const onSubmit = (data: UpdatePlaylistRequestPayload) => {
        mutate({...data, playlistId: playlistId!})
    }

    const handleCancelEditingClick = () => {
        onCancelEditing()
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
        <button type={'submit'} onClick={handleCancelEditingClick}>Cancel</button>
    </form>
}