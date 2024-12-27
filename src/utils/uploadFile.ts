import axios from "axios";
import request from "./request";

interface PreSignedUrl {
  url: string;
  key: string;
}

interface UploadResponse {
  data: {
    preSignedUrls: PreSignedUrl[];
  };
}

async function uploadFiles(files: File[]): Promise<PreSignedUrl[]> {
  try {
      const preparedFiles = Array.from(files).map(file => ({
          fileName: file.name,
          fileType: file.type,
      }));

      const response: UploadResponse = await request({
          method: 'POST',
          url: '/upload-file',
          data: { files: preparedFiles },
      });

      const { preSignedUrls } = response.data;

      const uploadPromises = Array.from(files).map((file, index) => {
          const preSignedUrl = preSignedUrls[index];

          return axios.put(preSignedUrl.url, file, {
            headers: {
              "Content-Type": files[index].type || "image/jpeg",
            },
          });
      });

      await Promise.all(uploadPromises);

      return preSignedUrls;
  } catch (error) {
      throw new Error('File upload failed. Please try again.');
  }
}

export default uploadFiles;
