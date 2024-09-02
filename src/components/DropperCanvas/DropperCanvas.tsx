import { useRef, useEffect, useState } from 'react'
import Dropper from '../Dropper/Dropper';
import PickerImg from '../../assets/IconColorPicker.svg'

const ZOOM_SIZE = 11
const ZOOM_SIZE_HALF = Math.floor(11 / 2)

export const DropperCanvas = ({ image } : {
  image: HTMLImageElement | null
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const zoomRef = useRef<HTMLCanvasElement>(null)
  const [color, setColor] = useState<string | null>(null)
  const [zoom, setZoom] = useState<string[][] | null>(null)
  const [pointerX, setPointerX] = useState<number | null>(null)
  const [pointerY, setPointerY] = useState<number | null>(null)

  const parseColor = (pixel: Uint8ClampedArray): string => {
    const [red, green, blue, alpha] = pixel
    const color = `rgba(${red}, ${green}, ${blue}, ${alpha})`

    return color
  }

  const parseImageCrop = (crop: Uint8ClampedArray, width: number = ZOOM_SIZE): string[][] => {
    const result = [];
    let row = [];

    for(let i = 0; i < crop.length; i+=4) {
      const pixel = crop.slice(i, i + 4)
      row.push(parseColor(pixel))

      if (row.length === width) {
        result.push(row)
        row = []
      }
    }

    return result
  }

  const handleMouseOver = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    const x = e.nativeEvent.offsetX
    const y = e.nativeEvent.offsetY
    setPointerX(x)
    setPointerY(y)
    const ctx = canvasRef.current?.getContext('2d')

    if (!ctx) return

    const pixel = ctx.getImageData(x, y, 1, 1).data
    const zoomCrop = ctx.getImageData(x - ZOOM_SIZE_HALF, y - ZOOM_SIZE_HALF, ZOOM_SIZE, ZOOM_SIZE)
    const color = parseColor(pixel)

    setColor(color)
    setZoom(parseImageCrop(zoomCrop.data))

    zoomRef.current?.getContext('2d')?.putImageData(zoomCrop, 0, 0)
  }

  const handleMouseLeave = (): void => {
    setPointerX(null)
    setPointerY(null)
    setColor(null)
    setZoom(null)
  }

  useEffect(() => {
    if (!image) return

    canvasRef.current?.getContext('2d')?.drawImage(image, 0, 0)
  }, [image])
  

  return (
    <div
      className="relative"
      style={{ cursor: `url(${PickerImg}), crosshair`}}>
      <canvas 
        ref={canvasRef}
        id="canvas"
        width={image?.width}
        height={image?.height}
        onMouseMove={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        />
      {zoom &&
        <div 
          className="absolute pointer-events-none"
          style={{ left: pointerX ?? '', top: pointerY ?? '' }}>
          <Dropper crop={zoom} color={color} />
        </div>
      }
    </div>
  );
};
