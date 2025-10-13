const board = {
    _id: 'g101',
    title: 'board',
    createdAt: 1589983468418,
    groups: [
        {
            id: 'g101',
            title: 'Group',
            createdAt: 1589983468418,
            tasks: [
                {
                    id: 'c101',
                    title: 'task',
                    createdAt: 1589983468418,
                },
            ],
        },
    ],
}


.hover-show {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;

    
    &::after {
        content: attr(data-type);
        position: absolute;
        left: 50%;
        transform: translate(-50%, -10%) scale(0.7);
        transform-origin: center top;
        padding: 4px 8px;
        white-space: nowrap;
        pointer-events: none;
        border-radius: 4px;
        opacity: 0;
        color: var(--text-color-on-primary, #fff);
        background-color: #474747;
        transition: opacity 0s ease-in-out, transform 0s ease-in-out;
    }

    &::before {
        content: "";
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        border: 6px solid transparent;
        opacity: 0;
        transition: opacity 0s ease-in-out, transform 0s ease-in-out;
    }

    /* Direction control + spacing + triangle pointer */
    &.up::after {
        bottom: calc(100% + 15px);
    }

    &.up::before {
        bottom: calc(100% + 4px);
        border-top-color: #474747;
    }

    &.down::after {
        top: calc(100% + 15px);
    }

    &.down::before {
        top: calc(100% + 4px);
        border-bottom-color: #474747;
    }

    /* Hover reveal animation */
    &:hover::after {
        opacity: 1;
        transform: translate(-50%, 0) scale(1);
        z-index: 100000;
        transition:
            opacity 0.1s ease-in-out 0.2s,
            transform 0.1s ease-in-out 0.2s;
    }

    &:hover::before {
        opacity: 1;
        z-index: 100000;
        transition:
            opacity 0.1s ease-in-out 0.2s,
            transform 0.1s ease-in-out 0.2s;
    }
}
