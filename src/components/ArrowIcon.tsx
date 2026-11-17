type ArrowIconProps = {
  direction?: 'diagonal' | 'right' | 'down'
}

export function ArrowIcon({ direction = 'diagonal' }: ArrowIconProps) {
  return (
    <svg className={`arrow-icon arrow-icon--${direction}`} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
