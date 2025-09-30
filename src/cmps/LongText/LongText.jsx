export function LongTxt({ txt, maxWidth='150px', className = '' }) {
  const truncationStyle = {
    maxWidth: maxWidth,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    paddingRight: '3px', // Reserves small space before the ellipsis
  };

  return (
    <div 
      className={`long-txt ${className}`} 
      style={truncationStyle} 
      title={txt} // Shows full text on hover
    >
      {txt}
    </div>
  );
}