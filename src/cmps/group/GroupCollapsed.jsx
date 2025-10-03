
export function GroupCollapsed({ provided, group, snapshot, isDragging }) {

    return <div
        className="group-collapsed"
        {...provided.draggableProps}
        ref={provided.innerRef}
        style={{
            ...provided.draggableProps.style, // Include styles from react-beautiful-dnd
            ...group.style, // Add your custom styles
            height: isDragging ? '50px' : 'auto', // Force fixed height while dragging
            // height: '50px', // Fixed height for all collapsed groups
                marginBottom: '10px', // Add consistent spacing between groups
                overflow: 'hidden', // Prevent content from overflowing
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