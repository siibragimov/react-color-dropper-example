import { ChangeEvent } from 'react';

export const InputImage = (
  { onChange } : { onChange: (image: HTMLImageElement ) => void }
) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      onChange(img);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleChange} className="my-6" />
    </div>
  );
}