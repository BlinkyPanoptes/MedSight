import { colors, fonts, fontSizes } from "@/theme/theme";
import type { ReactNode } from "react";
import { StyleProp, Text, TextStyle } from "react-native";

// ─── PROPS ───

type AppTextProps = {
  variant: "display" | "h1" | "title" | "body" | "bodySm" | "caption";
  children: ReactNode;
  bold?: boolean;
  color?: string;
  style?: StyleProp<TextStyle>;
};

// ─── COMPONENTS ───

export function AppText({
  variant,
  children,
  bold = false,
  color = colors.text,
  style,
}: AppTextProps) {
  return (
    <Text
      style={[
        {
          fontFamily: bold ? fonts.bold : fonts.regular,
          fontSize: fontSizes[variant],
          color,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
