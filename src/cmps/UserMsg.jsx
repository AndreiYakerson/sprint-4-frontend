import { eventBus, showSuccessMsg } from '../services/event-bus.service'
import { useState, useEffect, useRef } from 'react'
import { socketService, SOCKET_EVENT_REVIEW_ABOUT_YOU } from '../services/socket.service'

import { SvgIcon } from './SvgIcon'


export function UserMsg() {
	const [msg, setMsg] = useState(null)
	const [isVisible, setIsVisible] = useState(false)
	const timeoutIdRef = useRef()
	const closeMsgTimeOutRef = useRef()

	useEffect(() => {
		const unsubscribe = eventBus.on('show-msg', msg => {
			setMsg(msg)
			setIsVisible(true)

			if (timeoutIdRef.current) {
				clearTimeout(timeoutIdRef.current)
				timeoutIdRef.current = null
			}

			if (closeMsgTimeOutRef.current) {
				clearTimeout(closeMsgTimeOutRef.current)
				closeMsgTimeOutRef.current = null
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

		closeMsgTimeOutRef.current = setTimeout(() => {
			setMsg(null)
		}, 300)
	}

	return (
		<section className={`user-msg ${msg?.type} ${isVisible ? "visible" : ""}`}>
			<SvgIcon iconName={msg?.type === 'success' ? 'vMark' : 'errorIcon'} size={22} colorName={'whiteText'} />
			<span>{msg?.txt}</span>
			<button onClick={closeMsg}>
				<SvgIcon iconName='xMark' size={22} colorName={'whiteText'} />
			</button>
		</section>
	)
}
