import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { SvgIcon } from './SvgIcon'

export function CustomSelect({ labelsInfo, onSaveLabels }) {

    const [selectedlabel, setSelectedLabel] = useState([])
    const [isLabelsBoxOpen, setIsLabelsBoxOpen] = useState(false)
    const [position, setPosition] = useState('up')

    const selectionBoxRef = useRef(null)
    const labelInputRef = useRef(null)
    const selectedOptionRef = useRef(null)

    useEffect(() => {
        if (labelsInfo.selectedLabel) {
            setSelectedLabel(labelsInfo.selectedLabel)
        }
    }, [])


    // for if filter reset
    // useEffect(() => {
    //     if (labelsInfo.selectedLabel !== selectedlabel) {
    //         setSelectedLabel(labelsInfo.selectedLabel)
    //     }
    // }, [labelsInfo.selectedLabel])

    useEffect(() => {
        if (isLabelsBoxOpen && selectedOptionRef.current) {
            selectedOptionRef.current.scrollIntoView({
                block: 'center'
            })
        }
    }, [isLabelsBoxOpen])

    useEffect(() => {
        if (isLabelsBoxOpen) {
            addEventListener('mousedown', handleClickOutside)
        } else {
            removeEventListener('mousedown', handleClickOutside)
        }

        return (() => {
            removeEventListener('mousedown', handleClickOutside)
        })

    }, [selectedlabel, isLabelsBoxOpen])


    useLayoutEffect(() => {
        if (isLabelsBoxOpen && selectionBoxRef.current) {
            const rect = selectionBoxRef.current.getBoundingClientRect()
            const spaceBelow = window.innerHeight - rect.bottom
            const spaceAbove = rect.top

            if (spaceBelow < 300 && spaceAbove > spaceBelow) {
                setPosition("up")
            } else {
                setPosition("down")
            }
        }
    }, [isLabelsBoxOpen])



    function handleClickOutside({ target }) {

        if (target !== selectionBoxRef.current && !selectionBoxRef.current.contains(target)) {

            if (target !== labelInputRef.current && !labelInputRef.current.contains(target)) setIsLabelsBoxOpen(false)
            submitLabels()
        }
    }

    function handleChange({ target }) {
        var { value } = target

        setSelectedLabel(value)
        onSaveLabels(value)
        setIsLabelsBoxOpen(false)
    }

    function toggleIsLabelsBoxOpen() {
        setIsLabelsBoxOpen(!isLabelsBoxOpen)
    }

    function submitLabels() {
        onSaveLabels(selectedlabel)
    }



    return (
        <section className="custom-select">

            <div className={`select label-prev flex 
            ${labelsInfo?.type === 'times' ? "times" : ""}`}
                onClick={toggleIsLabelsBoxOpen} ref={labelInputRef}>

                <span>
                    {labelsInfo?.type === 'months'
                        ? labelsInfo?.options[selectedlabel]?.substring(0, 3)
                        : selectedlabel
                    }
                </span>

                {labelsInfo?.type !== 'times' && <SvgIcon
                    iconName="chevronDown"
                    size={20}
                    colorName={'primaryText'}
                />}
            </div>

            <div className={`label-selection-wrapper ${isLabelsBoxOpen ? 'box-open' : ''} ${position}`}
                ref={selectionBoxRef}>

                <div className={`input label-selection-box`}>

                    {labelsInfo?.options?.length > 0 && labelsInfo.options.map((label, idx) => {

                        if (labelsInfo?.type === 'months') {
                            return (
                                <label key={idx} className={idx === labelsInfo?.selectedLabel ? "selected" : ""}
                                    ref={idx === labelsInfo.selectedLabel ? selectedOptionRef : null}
                                >
                                    <input
                                        type="radio"
                                        name="selectedlabel"
                                        value={idx}
                                        checked={idx === labelsInfo.selectedLabel}
                                        onChange={handleChange}
                                    />
                                    {label}
                                </label>
                            )
                        }

                        return (
                            <label key={idx} className={label === labelsInfo?.selectedLabel ? "selected" : ""}
                                ref={label === labelsInfo?.selectedLabel ? selectedOptionRef : null}
                            >
                                <input
                                    type="radio"
                                    name="selectedlabel"
                                    value={label}
                                    checked={label === labelsInfo.selectedLabel}
                                    onChange={handleChange}
                                />
                                {label}
                            </label>
                        )
                    })}

                </div>
            </div>

        </section>

    )
}