import { TextInput } from "react-native";
import React from "react";
import { cn } from "@/utils/cn";

import type { TextInputProps, KeyboardTypeOptions } from "react-native";

interface Props extends TextInputProps {
  className?: string;
  type?: TextInputProps["textContentType"];
  keyboardType?: KeyboardTypeOptions;
  value: string;
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onPressIn?: () => void;
  maxLength?: number;
}

const Input: React.FC<Props> = ({
  className,
  onChangeText,
  value,
  keyboardType,
  placeholder,
  onPressIn,
  maxLength,
  secureTextEntry,
  type,
  ...props
}) => {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      textContentType={type}
      keyboardType={keyboardType}
      placeholder={placeholder}
      className={cn(
        "rounded-xl border-2 border-zinc-900 ring-2 ring-zinc-900 p-2 outline-none text-lg font-[500]",
        className ?? ""
      )}
      placeholderTextColor="#9CA3AF"
      onPressIn={onPressIn}
      secureTextEntry={secureTextEntry}
      maxLength={maxLength}
      {...props}
    />
  );
};

export default Input;
