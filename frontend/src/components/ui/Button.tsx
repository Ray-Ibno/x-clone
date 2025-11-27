type ButtonProp = {
  className: string
  onClick: (e?: any) => void
  label: string | React.ReactElement
}

const Button = ({ className, onClick, label }: ButtonProp) => {
  return (
    <button className={className} onClick={onClick}>
      {label}
    </button>
  )
}
export default Button
