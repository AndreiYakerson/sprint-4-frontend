export function DynamicCmp({ cmp, info, onUpdate }) {
	switch (cmp) {
		case 'StatusPicker':
			return <StatusPicker info={info} onUpdate={onUpdate} />
		case 'MemberPicker':
			return <MemberPicker info={info} onUpdate={onUpdate} />
		default:
			return <p>UNKNOWN {cmp}</p>
	}
}
