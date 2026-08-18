import clsx from 'clsx'

type Props = {
  className?: string
}

export default function Divider({ className }: Props) {
  return <div className={clsx(className, 'border-faint border-t')} />
}
