export function HighlightText({ text, query }) {
  if (!query) return text

  const regex = new RegExp(query, 'gi')
  const parts = text.split(regex)

  return parts.reduce((acc, part, i) => {
    acc.push(part)
    if (i < parts.length - 1) {
      const match = text.match(regex)[i]
      acc.push(<span key={i} className="Highlighted-text">{match}</span>)
    }
    return acc
  }, [])
}
