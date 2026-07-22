import { useRef } from 'react'
import { Camera, FileUp, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/molecules/Button'
import styles from './UploadPicker.module.scss'

/**
 * File / camera / library picker. Calls onPick(File, source) for each file.
 */
export function UploadPicker({ onPick, disabled, acceptDocs = true }) {
  const cameraRef = useRef(null)
  const libraryRef = useRef(null)
  const filesRef = useRef(null)

  function handle(files, source) {
    if (!files?.length) return
    for (const file of files) onPick?.(file, source)
  }

  return (
    <div className={styles.row}>
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className={styles.hidden}
        onChange={(e) => {
          handle(e.target.files, 'camera')
          e.target.value = ''
        }}
      />
      <input
        ref={libraryRef}
        type="file"
        accept="image/*"
        multiple
        className={styles.hidden}
        onChange={(e) => {
          handle(e.target.files, 'library')
          e.target.value = ''
        }}
      />
      <input
        ref={filesRef}
        type="file"
        accept={
          acceptDocs
            ? 'image/*,application/pdf,.pdf'
            : 'image/*'
        }
        multiple
        className={styles.hidden}
        onChange={(e) => {
          handle(e.target.files, 'file')
          e.target.value = ''
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => cameraRef.current?.click()}
      >
        <Camera size={14} aria-hidden="true" />
        Take photo
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => libraryRef.current?.click()}
      >
        <ImageIcon size={14} aria-hidden="true" />
        Library
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => filesRef.current?.click()}
      >
        <FileUp size={14} aria-hidden="true" />
        Files
      </Button>
    </div>
  )
}
