type AvatarProps = {
  url: string | undefined;
  className?: string;
};

export default function Avatar({ url, className = "" }: AvatarProps) {
  const src = url?.replace(`{w}x{h}`, "300x300");

  return (
    <div
      className={`overflow-hidden rounded-full bg-[url('/avatar-placeholder.png')] bg-cover bg-center bg-no-repeat ${className}`}
    >
      {src && (
        <img
          src={src}
          alt="Artist avatar"
          className="size-full object-cover"
          onError={(e) => e.currentTarget.remove()}
        />
      )}
    </div>
  );
}
