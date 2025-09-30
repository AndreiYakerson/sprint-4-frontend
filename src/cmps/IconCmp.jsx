import React, { forwardRef } from 'react'

export const IconCmp = forwardRef(({ src, label, position, onClick }, ref) => {
  return (
    <img
      ref={ref}
      src={src}
      alt={label || 'icon'}
      className={`icon icon-${position || 'default'}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    />
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