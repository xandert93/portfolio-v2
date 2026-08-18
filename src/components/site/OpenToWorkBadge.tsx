import Badge from '../ui/Badge'
import StatusDot from '../ui/StatusDot'

type Props = {
  isOpenToWork: boolean
}

export default function OpenToWorkBadge({ isOpenToWork }: Props) {
  return (
    <Badge>
      <StatusDot />
      {isOpenToWork ? 'Available for work' : 'Booking select projects'}
      <Badge.Shimmer />
    </Badge>
  )
}
