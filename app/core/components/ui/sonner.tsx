import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useTheme } from "remix-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const [theme] = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "hsl(var(--success))",
          "--success-text": "hsl(var(--success-foreground))",
          "--success-border": "hsl(var(--success))",
          "--warning-bg": "hsl(var(--warning))",
          "--warning-text": "hsl(var(--warning-foreground))",
          "--warning-border": "hsl(var(--warning))",
          "--error-bg": "hsl(var(--destructive))",
          "--error-text": "hsl(var(--destructive-foreground))",
          "--error-border": "hsl(var(--destructive))",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          success:
            "bg-[--success-bg] text-[--success-text] border-[--success-border]",
          warning:
            "bg-[--warning-bg] text-[--warning-text] border-[--warning-border]",
          error: "bg-[--error-bg] text-[--error-text] border-[--error-border]",
        },
        duration: 4000,
      }}
      icons={{
        success: <CheckCircle className="h-4 w-4" />,
        warning: <AlertCircle className="h-4 w-4" />,
        error: <XCircle className="h-4 w-4" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
