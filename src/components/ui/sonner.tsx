import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-2 group-[.toaster]:border-ink group-[.toaster]:rounded-2xl group-[.toaster]:shadow-sticker-sm group-[.toaster]:font-sans",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:!bg-ink group-[.toast]:!text-ink-foreground group-[.toast]:!rounded-full group-[.toast]:!font-bold",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
