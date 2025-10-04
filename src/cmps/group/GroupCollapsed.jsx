
export function GroupCollapsed({ provided, group, snapshot, isDragging }) {

    return <div
        className="group-collapsed"
        {...provided.draggableProps}
        ref={provided.innerRef}
        style={{
            ...provided.draggableProps.style,
            ...group.style,
            height: '70px',
            // marginBottom: '10px', 
            overflow: 'hidden',
            backgroundColor: snapshot.isDragging ? '#e0e0e0' : '#f9f9f9', // Optional: Change background color while dragging
            border: '1px solid #ddd',
            borderRadius: '4px',

        }}
    >
        <header
            className="group-header"
            {...provided.dragHandleProps}
        >
            <h1>{group.title}</h1>
        </header>
    </div>
}