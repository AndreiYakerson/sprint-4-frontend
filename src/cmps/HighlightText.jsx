export function HighlightText({ text, query }) {
  if (!query) return text

  const regex = new RegExp(query, 'i') // only first, case-insensitive
  const match = text.match(regex)
  if (!match) return text

  const start = match.index
  const end = start + match[0].length

  return (
    <>
      {text.slice(0, start)}
      <span className="Highlighted-text">{text.slice(start, end)}</span>
      {text.slice(end)}
    </>
  )
}
