export function IconCmp({ src, label = '', position = '', onClick }) {
  return (
    <span
      className={`${label ? `hover-show ${position}` : 'icon'}`}
      data-type={label}
      onClick={(e) => onClick?.(e.currentTarget)}
    >
      <img className="icon" src={src} alt={`icon ${label}`} />
    </span>
  )
}