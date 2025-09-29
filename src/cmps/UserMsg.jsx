import { eventBus, showSuccessMsg } from '../services/event-bus.service'
import { useState, useEffect, useRef } from 'react'
import { socketService, SOCKET_EVENT_REVIEW_ABOUT_YOU } from '../services/socket.service'

import xMark from '../../public/icons/x-mark.svg'
import vMark from '../../public/icons/v-makr.svg'
import errorIcon from '../../public/icons/error-icon.svg'


export function UserMsg() {
	const [msg, setMsg] = useState(null)
	const [isVisible, setIsVisible] = useState(false)
	const timeoutIdRef = useRef()

	useEffect(() => {
		const unsubscribe = eventBus.on('show-msg', msg => {
			setMsg(msg)
			setIsVisible(true)

			if (timeoutIdRef.current) {
				timeoutIdRef.current = null
				clearTimeout(timeoutIdRef.current)
			}

			timeoutIdRef.current = setTimeout(closeMsg, 3000)
		})

		socketService.on(SOCKET_EVENT_REVIEW_ABOUT_YOU, review => {
			showSuccessMsg(`New review about me ${review.txt}`)
		})

		return () => {
			unsubscribe()
			socketService.off(SOCKET_EVENT_REVIEW_ABOUT_YOU)
		}
	}, [])

	function closeMsg() {
		setIsVisible(false)

		setTimeout(() => {
			setMsg(null)
		}, 300)
	}

	return (
		<section className={`user-msg ${msg?.type} ${isVisible ? "visible" : ""}`}>
			<img src={msg?.type === 'success' ? vMark : errorIcon} alt={msg?.type} className='icon big white' />
			<span>{msg?.txt}</span>
			<button onClick={closeMsg}>
				<img src={xMark} alt="close btn" className='icon big white' />
			</button>
		</section>
	)
}
