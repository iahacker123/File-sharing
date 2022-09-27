import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash, FaFile, FaKey, FaLock, FaUpload } from "react-icons/fa";

import SpinningCircle from "$lib/components/Svg/SpinningCircle";
import { supabase } from "$lib/server/db/supabase";
import { genID } from "$lib/utils/genID";
import { InferProceduresOutput, trpc } from "$lib/utils/trpc";

import UploadInfo from "./UploadInfo";

export interface UploadFile extends InferProceduresOutput<"upload", "withAuth"> {
    password?: string;
}

const Upload: React.FC<{ isAuth: boolean }> = ({ isAuth }) => {
    const passwordRef = useRef<HTMLInputElement>(null);
    const apiKeyRef = useRef<HTMLInputElement>(null);

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showKey, setShowKey] = useState<boolean>(false);

    const [userFile, setUserFile] = useState<File | undefined>();
    const [uploaded, setUploaded] = useState<UploadFile>();

    const { mutateAsync, isLoading } = (
        isAuth ? trpc.upload.withAuth : trpc.upload.noAuth
    ).useMutation({
        onSuccess: (file) => {
            if (passwordRef.current) {
                setUploaded({ ...file, password: passwordRef.current.value });

                setUserFile(undefined);
                return (passwordRef.current.value = "");
            }
            return setUploaded({ ...file });
        },
        onError: ({ message }) => {
            toast.error(message);
        },
    });

    const HandleChangeFile = (file?: File) => {
        if (!file || file.size >= 52428800) {
            toast.error(`${file?.name || "File size"} is above 50MB limit!`);
            return setUserFile(undefined);
        }

        setUserFile(file);
    };

    const HandleSubmitFile = async () => {
        setUploaded(undefined);
        if (!userFile) {
            return toast.error("No file to upload!");
        }

        if (!isAuth && !apiKeyRef.current!.value) {
            return toast.error("Please login or enter your api key.");
        }

        const { fileID, path } = genID(userFile.name);

        const [, file] = await Promise.all([
            supabase.upload(path, userFile, { contentType: userFile.type, cacheControl: "3600" }),
            mutateAsync({
                fileID,
                name: userFile.name,
                path,
                type: userFile.type,
                password: passwordRef.current?.value,
                apiKey: isAuth ? undefined : apiKeyRef.current!.value,
            }),
        ]);

        setUploaded({ ...file, password: passwordRef.current?.value });
    };

    return (
        <>
            <div className="flex w-full flex-wrap justify-around gap-10 pt-20">
                {/* Upload Form */}
                <form
                    className={`relative flex flex-col items-start gap-y-6 rounded-2xl bg-gradient-to-tl from-slate-800 to-slate-900 p-10 drop-shadow-lg ${
                        isAuth ? "h-80" : "h-[23rem]"
                    }`}
                    onSubmit={(e) => {
                        e.preventDefault();
                        HandleSubmitFile();
                    }}
                >
                    <span className="flex w-full items-center justify-center gap-2 text-2xl">
                        <FaUpload />
                        Upload File
                    </span>
                    <label htmlFor="file" className="flex items-center justify-center gap-2">
                        <FaFile />
                        File:
                        <span className="rounded-2xl bg-slate-700 px-4 py-2">
                            {userFile?.name || "None"}
                        </span>
                    </label>
                    <input
                        className="hidden"
                        type="file"
                        id="file"
                        onChange={(e) => HandleChangeFile(e.target.files?.[0])}
                    />
                    <div className="flex w-full items-center justify-center gap-x-4">
                        <label
                            htmlFor="password"
                            className="flex items-center justify-center gap-2"
                        >
                            <FaLock /> Password:
                        </label>

                        <div className="flex w-full items-center justify-between rounded-2xl bg-slate-700">
                            <input
                                className="ml-4 w-full bg-inherit py-2 focus:outline-none"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                ref={passwordRef}
                            />
                            <button
                                className="px-4"
                                aria-label="toggle password display"
                                type="button"
                                onClick={() => setShowPassword((current) => !current)}
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </button>
                        </div>
                    </div>

                    {!isAuth && (
                        <div className="flex w-full items-center justify-center gap-x-4">
                            <label
                                htmlFor="apiKey"
                                className="flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                <FaKey /> API Key:
                            </label>

                            <div className="flex w-full items-center justify-between rounded-2xl bg-slate-700">
                                <input
                                    className="ml-4 w-full bg-inherit py-2 focus:outline-none"
                                    type={showKey ? "text" : "password"}
                                    id="apiKey"
                                    ref={apiKeyRef}
                                />
                                <button
                                    className="px-4"
                                    aria-label="toggle password display"
                                    type="button"
                                    onClick={() => setShowKey((current) => !current)}
                                >
                                    {showKey ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        className="h-10 w-full rounded-2xl bg-slate-700 py-2 drop-shadow-lg"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex w-full items-center justify-center">
                                <SpinningCircle />
                            </div>
                        ) : (
                            "Submit"
                        )}
                    </button>
                </form>

                {/* Info Form */}
                <UploadInfo upload={uploaded} />
            </div>
            <Toaster
                toastOptions={{
                    style: {
                        borderRadius: "10px",
                        background: "#262626",
                        color: "#E8DCFF",
                        maxWidth: "max-content",
                    },
                }}
            />
        </>
    );
};

export default Upload;
