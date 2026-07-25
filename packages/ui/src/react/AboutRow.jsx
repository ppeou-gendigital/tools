export function AboutRow({ name = 'App', version }) {
  return (
    <div className="ui-about-row">
      <span>{name}</span>
      <span>v{version}</span>
    </div>
  )
}
