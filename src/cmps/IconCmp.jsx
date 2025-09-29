export function IconCmp({ src, label = '', position='' }) {

  if (!label) return (
    <span className='icon' data-type={label}>
      <img className="icon" src={src} alt={`icon ${label}`} />
    </span>
  )
  else return (
    <span className={`hover-show ${position}`} data-type={label}>
      <img className="icon" src={src} alt={`icon ${label}`} />
    </span>
  )
}