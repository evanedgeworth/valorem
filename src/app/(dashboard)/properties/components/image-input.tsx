import { Avatar } from "flowbite-react";
import { AiOutlineCloudUpload } from "react-icons/ai";

interface ImageFile {
  data: File;
  url: string;
}

interface ImageInputProps {
  onChange: (value: ImageFile[]) => void;
  value?: ImageFile[];
}

export default function ImageInput({ onChange, value }: ImageInputProps) {
  function selectImages(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles: ImageFile[] = [];

    if (e.target.files) {
      const targetFiles = Array.from(e.target.files);

      targetFiles.forEach((file) => {
        selectedFiles.push({
          data: file,
          url: URL.createObjectURL(file),
        });
      });

      onChange(selectedFiles);
    }
  }

  return (
    <div className="">
      <div className="flex gap-2 mb-2">
        {
          value?.map(item => (
            <div>
              <Avatar size="lg" img={item.url} />
            </div>
          ))
        }
      </div>
      <label className="flex justify-center w-full h-16 px-4 transition border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
        <span className="flex items-center space-x-2">
          <AiOutlineCloudUpload size={25} color="rgb(75 85 99)" />
          <span className="font-medium text-gray-600">
            Drop files to Attach, or browse
          </span>
        </span>
        <input
          type="file"
          name="file_upload"
          accept="image/*"
          multiple
          className="hidden"
          onChange={selectImages}
        />
      </label>
    </div>
  );
}