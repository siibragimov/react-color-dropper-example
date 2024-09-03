import { useRef, useEffect, useState } from 'react'
import Dropper from '../Dropper/Dropper'
import PickerImg from '../../assets/IconColorPicker.svg'

const ZOOM_SIZE = 11
const ZOOM_SIZE_HALF = Math.floor(11 / 2)

export const DropperCanvas = ({ image } : {
  image: HTMLImageElement | null
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [color, setColor] = useState<string | null>(null)
  const [currentColor, setCurrentColor] = useState<string | null>(null)
  const [currentColorHex, setCurrentColorHex] = useState<string | null>(null)
  const [zoom, setZoom] = useState<string[][] | null>(null)
  const [pointerX, setPointerX] = useState<number | null>(null)
  const [pointerY, setPointerY] = useState<number | null>(null)
  const [isDropperOn, setIsDropperOn] = useState<boolean>(false)

  const rgb2hex = (rgb: string): string => {
    const colors = rgb.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/) ?? [];
    const hex = (x: string) => ("0" + parseInt(x).toString(16)).slice(-2);

    return "#" + hex(colors[1]) + hex(colors[2]) + hex(colors[3] + colors[4]);
}

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
    const zoomCrop = ctx.getImageData(x - ZOOM_SIZE_HALF, y - ZOOM_SIZE_HALF, ZOOM_SIZE, ZOOM_SIZE).data
    const color = parseColor(pixel)

    setColor(color)
    setZoom(parseImageCrop(zoomCrop))
  }

  const handleMouseLeave = (): void => {
    setPointerX(null)
    setPointerY(null)
    setColor(null)
    setZoom(null)
  }

  const handleImageClick = (): void => {
    if (!isDropperOn) return

    setCurrentColor(color)
    setCurrentColorHex(rgb2hex(color ?? ''))
  }

  const handleButtonClick = (): void => {
    setIsDropperOn(!isDropperOn)
  }

  useEffect(() => {
    if (!image) return

    canvasRef.current?.getContext('2d')?.drawImage(image, 0, 0)
  }, [image])
  

  return (
    <div>
      <div className="flex justify-center items-center relative py-6">
        <button
          className="bg-slate-300 p-1 rounded-full flex absolute left-8"
          onClick={handleButtonClick}>
          <img src={PickerImg} width="16" height="16" alt="Choose color" />
        </button>
        <div className="flex justify-center items-center gap-3">
          <div>{ currentColorHex }</div>
          <div
            className="w-20 h-10 rounded-lg"
            style={{ backgroundColor: currentColor ?? '' }}/>
        </div>
      </div>
      <div
        className="relative"
        style={isDropperOn ? { cursor: `url(${PickerImg}), crosshair`} : {}}>
        <canvas 
          ref={canvasRef}
          id="canvas"
          width={image?.width}
          height={image?.height}
          onMouseMove={handleMouseOver}
          onMouseLeave={handleMouseLeave}
          onClick={handleImageClick}
          />
        {zoom && isDropperOn &&
          <div 
            className="absolute pointer-events-none"
            style={{ left: pointerX ?? '', top: pointerY ?? '' }}>
            <Dropper crop={zoom} color={color} />
          </div>
        }
      </div>
    </div>
  );
};
