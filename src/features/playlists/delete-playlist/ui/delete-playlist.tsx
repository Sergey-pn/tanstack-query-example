import {useDeleteMutation} from "../api/use-delete-mutation.ts";

type Props = {
    playlistId: string
}

export const DeletePlaylist = ({playlistId}: Props) => {
    const {mutate} = useDeleteMutation()

    const handleDeleteClick = () => {
        mutate(playlistId)
    }

  return <button onClick={handleDeleteClick}>🗑️</button>
}