import { forwardRef } from "react";

export const HoveredTextCmp = forwardRef(({ children, label, position, onClick, size }, ref) => {
  const hoverShow = label ? 'hover-show' : '';

  return (
    <div
      className={`icon ${size} ${hoverShow} ${position || 'down'}`}
      data-type={label}
      onClick={onClick}
      ref={ref}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </div>
  );
});


// Pest function
// export function HoveredTextCmp({ src, label = '', position = '', onClick }) {
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