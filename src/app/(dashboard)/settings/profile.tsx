"use client";
import { Avatar, Button, Label, TextInput } from "flowbite-react";
import { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "@/context/userContext";
import request from "@/utils/request";
import { useToast } from "@/context/toastContext";
import { ImageFile } from "@/types";
import uploadFiles from "@/utils/uploadFile";
import { FaUpload } from "react-icons/fa";

export default function Profile() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsloading] = useState<boolean>(false);
  const { user, setUser } = useContext(UserContext);
  const { showToast } = useToast();
  const [image, setImage] = useState<ImageFile | null>(null);

  useEffect(() => {
    setEmail(user?.email || "");
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setPhone(user?.phone || "");
  }, [user]);

  const handleSubmitChanges = async () => {
    setIsloading(true);
    const body: any = { firstName, lastName, phone };
    if (image) {
      const upload = await uploadFiles([image.data]);
      if (upload?.[0]) {
        body.profileImage = {
          fileId: upload[0].key,
          fileUrl: upload[0].url,
          fileType: "image/jpeg"
        }
      }
    }

    const res = await request({
      method: "PUT",
      url: `/profiles/${user?.id}`,
      data: body,
    });


    setIsloading(false);
    if (res.status === 200) {
      console.log(res.data);
      showToast('Successfully updated profile', 'success');

      const resProfile = await request({
        method: "GET",
        url: `/profiles/${user?.id}`,
      });
      const profile = resProfile.data.profile;
      if (profile) {
        setUser({ ...profile, id: profile });
      }
    } else {
      showToast(res.data.message || 'Failed', 'error');
    }
  };

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
      setImage(selectedFiles[0]);
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mx-auto rounded-lg p-6 shadow sm:max-w-xl sm:p-8">
      <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight ">Account</h1>
      <div className="mt-4 space-y-6 sm:mt-6">
        <div className="grid gap-6 sm:grid-rows-2">
          <div className="flex items-center gap-6">
            <Avatar img={image?.url || user?.profileImage?.fileUrl} alt="User" rounded size="lg" />
            <Button size="sm" onClick={handleButtonClick}>
              <FaUpload size={16} className="mr-1.5" />
              Upload
            </Button>
            <input
              type="file"
              name="file_upload"
              accept="image/*"
              className="hidden"
              onChange={selectImages}
              ref={fileInputRef}
            />
          </div>
          <div className="flex flex-row gap-4">
            <div className="flex flex-col flex-1">
              <Label htmlFor="email">First Name</Label>
              <TextInput id="first name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="flex flex-col flex-1">
              <Label htmlFor="email">Last Name</Label>
              <TextInput id="last name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Phone Number</Label>
            <TextInput id="phone" required value={phone} type="phone" onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
        <Button className="w-full" onClick={handleSubmitChanges} isProcessing={isLoading}>
          Save changes
        </Button>
      </div>
    </div>
  );
}
