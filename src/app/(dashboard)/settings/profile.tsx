"use client";
import { Avatar, Button, Label, TextInput } from "flowbite-react";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "@/context/userContext";
import request from "@/utils/request";
import { useToast } from "@/context/toastContext";
import { ImageFile } from "@/types";
import uploadFiles from "@/utils/uploadFile";
import { FaUpload } from "react-icons/fa";
import { joinFullName, splitFullName } from "@/utils/commonUtils";

export default function Profile() {
  const { user, setUser } = useContext(UserContext);
  const { showToast } = useToast();
  const [image, setImage] = useState<ImageFile | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      email: "",
      fullName: "",
      username: "",
      phone: "",
      city: "",
      country: "",
    },
  });

  useEffect(() => {
    setValue("email", user?.email || "");
    setValue("fullName", joinFullName({ firstName: user?.firstName || "", lastName: user?.lastName || "" }));
    setValue("phone", user?.phone || "");
    setValue("username", user?.username || "");
    setValue("city", user?.city || "");
    setValue("country", user?.country || "");
  }, [user, setValue]);

  const onSubmit = async (data: any) => {
    const { firstName, lastName } = splitFullName(data.fullName);
    const body: any = {
      firstName,
      lastName,
      phone: data.phone,
      city: data.city,
      country: data.country,
      username: data.username,
    };

    if (image) {
      const upload = await uploadFiles([image.data]);
      if (upload?.[0]) {
        body.profileImage = {
          fileId: upload[0].key,
          fileUrl: upload[0].url,
          fileType: "image/jpeg",
        };
      }
    }

    const res = await request({
      method: "PUT",
      url: `/profiles/${user?.id}`,
      data: body,
    });

    if (res?.status === 200) {
      showToast("Successfully updated profile", "success");
      const resProfile = await request({
        method: "GET",
        url: `/profiles/${user?.id}`,
      });
      const profile = resProfile.data.profile;
      if (profile) {
        setUser({ ...profile, id: profile.userId });
      }
    } else {
      showToast(res.data.message || "Failed", "error");
    }
    reset();
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
    <div className="">
      <h1 className="mb-2 text-xl font-bold leading-tight tracking-tight ">Account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6 sm:mt-6">
        <div className="grid gap-4 sm:grid-rows-2">
          <div className="flex items-center gap-6">
            <Avatar img={image?.url || user?.profileImage?.fileUrl} alt="User" rounded size="lg" />
            <Button size="sm" onClick={handleButtonClick} color="gray">
              <FaUpload size={16} className="mr-1.5" />
              Upload
            </Button>
            <input type="file" name="file_upload" accept="image/*" className="hidden" onChange={selectImages} ref={fileInputRef} />
          </div>
          <div className="flex flex-row gap-4">
            <div className="flex flex-col flex-1">
              <Label htmlFor="username">Username*</Label>
              <TextInput id="username" required {...register("username")} />
              <p className="dark:text-gray-400 text-sm mt-1">Visible to members</p>
            </div>
            <div className="flex flex-col flex-1">
              <Label htmlFor="fullName">Full name*</Label>
              <TextInput id="fullName" required {...register("fullName")} />
              <p className="dark:text-gray-400 text-sm mt-1">Your full name</p>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div className="flex flex-col flex-1">
              <Label>Email*</Label>
              <TextInput id="email" required type="email" {...register("email")} />
              <p className="dark:text-gray-400 text-sm mt-1">For notifications and login</p>
            </div>
            <div className="flex flex-col flex-1">
              <Label>Phone Number</Label>
              <TextInput id="phone" required type="phone" {...register("phone")} />
              <p className="dark:text-gray-400 text-sm mt-1">For 2FA and notifications</p>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div className="flex flex-col flex-1">
              <Label>Country</Label>
              <TextInput id="country" {...register("country")} />
            </div>
            <div className="flex flex-col flex-1">
              <Label>City</Label>
              <TextInput id="city" {...register("city")} />
            </div>
          </div>
        </div>
        <div className="border-t border-t-gray-200 pt-4 dark:border-t-gray-600">
          <Button type="submit" isProcessing={isSubmitting} color="gray">
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
