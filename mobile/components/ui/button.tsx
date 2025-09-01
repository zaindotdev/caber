import { TouchableOpacity } from "react-native";
import React from "react";
import { cn } from "@/utils/cn";

interface Props {
  children: React.ReactNode;
  className?: string;
  onPress?: () => Promise<void>;
  disabled?: boolean;
}

const Button = ({
  children,
  className,
  onPress,
  disabled,
  ...props
}: Props) => {
  return (
    <TouchableOpacity
      {...props}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      className={cn(
        "bg-zinc-900 p-2 mt-4 rounded-2xl border border-zinc-100 ring-2 ring-zinc-900 flex items-center justify-center",
        className ?? ""
      )}
    >
      {children}
    </TouchableOpacity>
  );
};

export default Button;
