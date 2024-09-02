const Dropper = ({ crop, color } : {
  crop: string[][] | null
  color: string | null
}) => {
  return (
    <div 
      className="border-[5px] rounded-full overflow-hidden flex w-fit" 
      style={{borderColor: color ?? ''}}>
      <table className="border-collapse">
        <tbody>
          {crop?.map((row, i) => (
            <tr key={i}>
              {row.map((pixel, j) => (
                <td
                  key={j} 
                  className="w-2 h-2 min-w-2 border-black border-[1px] border-opacity-5"
                  style={{ backgroundColor: pixel }} />
              ))}
            </tr>
          ))}
        </tbody> 
      </table>
    </div>
  )
}

export default Dropper