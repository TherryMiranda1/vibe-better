interface LoaderProps {
  size?: string;
}

const sizes = {
  small: "h-6 w-6",
  medium: "h-12 w-12",
  large: "h-16 w-16",
};

export default function Loader({ size = "small" }: LoaderProps) {
  const sizeClass = sizes[size as keyof typeof sizes] || sizes.medium;

  return (
    <div
      className={`animate-spin rounded-full border-t-2 border-b-2 border-primary ${sizeClass}`}
    />
  );
}
