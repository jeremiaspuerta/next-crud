

export const DELETE_MODAL_DESCRIPTION = (title: string) => {
    return (
        <>
            Are you sure you want to delete <strong>{title}</strong>? <br/>You can't undo this action.
        </>
    )
};

export const ASSIGN_UNASSIGN_SUBJECT_MODAL_DESCRIPTION = (action: string,title: string) => {
    return (
        <>
            Are you sure you want to {action} <strong>{title}</strong>? <br/>
        </>
    )
};