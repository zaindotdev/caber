import { TextInput } from "react-native";
import React from "react";
import { cn } from "@/utils/cn";

import type { TextInputProps,KeyboardType } from "react-native";

interface Props {
  className?: string;
  type?: TextInputProps["textContentType"];
  keyboardType?: KeyboardType
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onPressIn?: () => void;
}
const Input = ({ className, type, onChangeText, value,keyboardType,placeholder,onPressIn, ...props }: Props) => {
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
      {...props}
    />
  );
};

export default Input;
