import React, { forwardRef } from 'react'

export const IconCmp = forwardRef(({ src, label, position, onClick }, ref) => {

  const hoverShow = label ? 'hover-show' : ''
  
  return (
    <div className={`icon ${hoverShow} ${position || 'down'}`} data-type={label}>
    <img
      ref={ref}
      src={src}
      alt={`${label} icon`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      />
      </div>
  )
})


// Pest function
// export function IconCmp({ src, label = '', position = '', onClick }) {
//   return (
//     <span
//       className={`${label ? `hover-show ${position}` : 'icon'}`}
//       data-type={label}
//       onClick={(e) => onClick?.(e.currentTarget)}
//     >
//       <img className="icon" src={src} alt={`icon ${label}`} />
//     </span>
//   )
// }