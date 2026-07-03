import { cx } from '@/lib/cx'
import styles from './Card.module.scss'

export function Card({ className, ...rest }) {
  return <div className={cx(styles.card, className)} {...rest} />
}

export function CardHeader({ className, ...rest }) {
  return <div className={cx(styles.header, className)} {...rest} />
}

export function CardTitle({ className, as: As = 'h2', ...rest }) {
  return <As className={cx(styles.title, className)} {...rest} />
}

export function CardDescription({ className, ...rest }) {
  return <p className={cx(styles.description, className)} {...rest} />
}

export function CardBody({ className, ...rest }) {
  return <div className={cx(styles.body, className)} {...rest} />
}

export function CardFooter({ className, ...rest }) {
  return <div className={cx(styles.footer, className)} {...rest} />
}
