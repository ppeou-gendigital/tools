import { cx } from './cx.js'

export function Card({ className, ...rest }) {
  return <div className={cx('ui-card', className)} {...rest} />
}

export function CardHeader({ className, ...rest }) {
  return <div className={cx('ui-card__header', className)} {...rest} />
}

export function CardTitle({ className, as: As = 'h2', ...rest }) {
  return <As className={cx('ui-card__title', className)} {...rest} />
}

export function CardDescription({ className, ...rest }) {
  return <p className={cx('ui-card__description', className)} {...rest} />
}

export function CardBody({ className, ...rest }) {
  return <div className={cx('ui-card__body', className)} {...rest} />
}

export function CardFooter({ className, ...rest }) {
  return <div className={cx('ui-card__footer', className)} {...rest} />
}
